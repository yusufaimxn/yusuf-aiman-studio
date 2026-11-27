// Yusuf Aiman Studio: stickman characters (big round head, thick ink outline, stick limbs)
// drawn in 2D on a canvas every frame, shown as a lit-shadow billboard inside a Three.js world.
//
//   const yusuf = makeStickman(THREE, STICK_YUSUF);
//   scene.add(yusuf.object);
//   yusuf.draw({ pose: STICK_POSES.explain, expression: "smug", viseme: "D", blink: 0, flip: false, walk: 0 });
//
// All drawing is a pure function of the state passed in, so frames render in any order.

export const STICK_YUSUF = {
  name: "yusuf",
  head: "#fbf8f2", ink: "#121014",
  hair: "#1d1715", stubble: "#8e8580", beard: "#1d1715",
  shirt: "#232027", shirtHi: "#3a3640", pants: "#2b292d", shoes: "#ffffff",
  watch: "#c3c8cf",
  hairStyle: "quiff", goatee: true, glasses: false, headphones: false, hoodie: false, backpack: false,
};

export const STICK_AIMAN = {
  name: "aiman",
  head: "#fbf8f2", ink: "#121014",
  hair: "#3b2a23", beard: null,
  shirt: "#e9d7c1", shirtHi: "#f6e9d8", pants: "#2e2b2c", shoes: "#ffffff",
  watch: null,
  hairStyle: "curly", goatee: false, glasses: true, headphones: true, hoodie: true, backpack: true,
};

// Arm angles in degrees from straight down (positive = forward/out to the facing side),
// elbow bend in degrees; legs likewise. "phone" holds a phone to the ear.
export const STICK_POSES = {
  idle:     { aF: [8, 10], aB: [-8, 10], body: 0 },
  explain:  { aF: [55, 70], aB: [-10, 12], body: 3 },
  present:  { aF: [70, 20], aB: [-70, 20], body: 0 },
  point:    { aF: [95, 0], aB: [-8, 10], body: 4 },
  shrug:    { aF: [45, 110], aB: [-45, 110], body: 0 },
  phone:    { aF: [125, 62], aB: [-8, 10], body: -2, phone: "F" },
  panic:    { aF: [150, 30], aB: [-150, 30], body: 0 },
  thumbsUp: { aF: [40, 100], aB: [-8, 10], body: 2, thumb: true },
  handsHips:{ aF: [38, -88], aB: [-38, -88], body: 0 },
};

const VIS = { // jaw open 0..1, width 0..1, round 0..1
  X: [0, 1, 0], A: [0, 0.8, 0], B: [0.25, 1, 0], C: [0.5, 1, 0.1], D: [0.9, 1, 0], E: [0.5, 0.75, 0.6], F: [0.25, 0.5, 1], G: [0.15, 0.9, 0], H: [0.55, 1, 0],
};

export const STICK_EXPRESSIONS = {
  neutral:  { lid: 0, brow: 0, browTilt: 0, smile: 0.4 },
  happy:    { lid: 0, brow: 0.3, browTilt: 0, smile: 0.9 },
  smug:     { lid: 0.45, brow: -0.1, browTilt: -0.3, smile: 0.6, side: 1 },
  calm:     { lid: 0.25, brow: 0, browTilt: 0, smile: 0.45 },
  surprised:{ lid: -0.25, brow: 1, browTilt: 0, smile: 0, o: true },
  panic:    { lid: -0.3, brow: 0.9, browTilt: 0.6, smile: -0.6 },
  worried:  { lid: 0, brow: 0.4, browTilt: 0.7, smile: -0.4 },
  serious:  { lid: 0.2, brow: -0.4, browTilt: -0.5, smile: 0 },
  confused: { lid: 0.1, brow: 0.5, browTilt: 0.2, smile: -0.1, asym: 1 },
};

const W = 600, H = 1200;          // canvas size (px); character is 1100 px tall, feet at y = 1150
const R = 210;                    // head radius in px (Rick-style huge head)

export function makeStickman(THREE, spec, heightM = 1.7) {
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const hM = heightM * (H / 1100);
  const geo = new THREE.PlaneGeometry(hM * W / H, hM);
  geo.translate(0, hM / 2 - heightM * (50 / 1100), 0);   // feet (y = 1150 px) on the floor
  const mat = new THREE.MeshBasicMaterial({ map: tex, alphaTest: 0.4, side: THREE.DoubleSide, toneMapped: false });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: tex, alphaTest: 0.4 });
  mesh.castShadow = true;
  const object = new THREE.Group();
  object.add(mesh);

  function draw(state = {}) {
    const st = { pose: STICK_POSES.idle, expression: "neutral", viseme: "X", blink: 0, flip: false, walk: 0, walking: 0, bob: 0, look: 0, ...state };
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    if (st.flip) { ctx.translate(W, 0); ctx.scale(-1, 1); }
    drawBody(ctx, spec, st);
    ctx.restore();
    tex.needsUpdate = true;
  }
  return { object, mesh, draw, canvas, spec };
}

// ----------------------------------------------------------------- drawing
const rad = (d) => (d * Math.PI) / 180;
function line(ctx, pts, w, color) {
  ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = "round"; ctx.lineJoin = "round";
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.stroke();
}
function blob(ctx, fill, ink, lw, path) {
  ctx.beginPath(); path(ctx); ctx.closePath();
  ctx.fillStyle = fill; ctx.fill();
  if (lw) { ctx.lineWidth = lw; ctx.strokeStyle = ink; ctx.lineJoin = "round"; ctx.stroke(); }
}
function limb(x, y, a1, len1, bend, len2) {            // returns [shoulder, elbow, hand]
  const e = [x + Math.sin(rad(a1)) * len1, y + Math.cos(rad(a1)) * len1];
  const a2 = a1 + bend;
  return [[x, y], e, [e[0] + Math.sin(rad(a2)) * len2, e[1] + Math.cos(rad(a2)) * len2]];
}

function drawBody(ctx, s, st) {
  const ink = s.ink, cx = W / 2;
  const bob = st.bob + (st.walking ? Math.abs(Math.sin(st.walk * Math.PI * 2)) * -10 * st.walking : 0);
  const hipY = 800 + bob, shY = 545 + bob;
  const lean = (st.pose.body || 0) + (st.walking ? 4 * st.walking : 0);
  const tilt = rad(lean);
  const shX = cx + Math.sin(tilt) * (hipY - shY);

  // ---- legs (back leg first). walk: swing hips/knees in opposite phase
  const sw = Math.sin(st.walk * Math.PI * 2) * 28 * st.walking;
  const kneeF = Math.max(0, Math.cos(st.walk * Math.PI * 2)) * 30 * st.walking;
  const kneeB = Math.max(0, -Math.cos(st.walk * Math.PI * 2)) * 30 * st.walking;
  const legs = [[-1, -sw, kneeB], [1, sw, kneeF]];
  for (const [side, swing, knee] of legs) {
    const [h, k, f] = limb(cx + side * 22, hipY, swing, 175, -knee, 175);
    const footY = Math.min(f[1], 1150);
    line(ctx, [h, k, [f[0], footY]], 30, ink);                  // outline
    line(ctx, [h, k, [f[0], footY]], 20, s.pants);              // jogger leg
    // sneaker
    blob(ctx, s.shoes, ink, 8, (c) => { c.ellipse(f[0] + 22, footY + 2, 40, 20, 0, Math.PI, 0); c.lineTo(f[0] + 62, footY + 14); c.lineTo(f[0] - 18, footY + 14); });
    ctx.fillStyle = "#d9d4cf"; ctx.fillRect(f[0] - 16, footY + 8, 76, 6);
  }

  // ---- arms: back arm behind the torso
  const armB = limb(shX - 52, shY + 26, st.pose.aB[0], 125, st.pose.aB[1] * Math.sign(st.pose.aB[0] || -1), 120);
  const armF = limb(shX + 52, shY + 26, st.pose.aF[0], 125, st.pose.aF[1] * Math.sign(st.pose.aF[0] || 1), 120);
  const walkArm = Math.sin(st.walk * Math.PI * 2) * 25 * st.walking;
  if (st.walking) { armB.splice(0, 3, ...limb(shX - 52, shY + 26, -walkArm, 125, 10, 120)); armF.splice(0, 3, ...limb(shX + 52, shY + 26, walkArm, 125, 10, 120)); }
  const drawArm = (arm, watch) => {
    line(ctx, arm, 16, ink);
    if (watch && s.watch) { const [e, h] = [arm[1], arm[2]]; const wx = e[0] + (h[0] - e[0]) * 0.82, wy = e[1] + (h[1] - e[1]) * 0.82;
      blob(ctx, s.watch, ink, 5, (c) => c.arc(wx, wy, 13, 0, Math.PI * 2)); }
    blob(ctx, s.head, ink, 7, (c) => c.arc(arm[2][0], arm[2][1], 21, 0, Math.PI * 2));   // round mitten hand
  };
  if (s.backpack) blob(ctx, "#2f3338", ink, 8, (c) => c.roundRect(shX - 120, shY + 10, 70, 190, 24));
  drawArm(armB, false);

  // ---- torso: short tee / hoodie trapezoid
  blob(ctx, s.shirt, ink, 9, (c) => {
    c.moveTo(shX - 70, shY + 6); c.quadraticCurveTo(shX, shY - 18, shX + 70, shY + 6);
    c.lineTo(shX + 84, shY + 70); c.lineTo(shX + 62, shY + 74);              // sleeve
    c.lineTo(cx + 58, hipY + 8); c.quadraticCurveTo(cx, hipY + 20, cx - 58, hipY + 8);
    c.lineTo(shX - 62, shY + 74); c.lineTo(shX - 84, shY + 70);
  });
  ctx.strokeStyle = s.shirtHi; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(shX - 40, shY + 20); ctx.quadraticCurveTo(shX - 52, shY + 120, cx - 40, hipY - 10); ctx.stroke();
  if (s.hoodie) {
    blob(ctx, s.shirtHi, ink, 6, (c) => c.roundRect(cx - 42, hipY - 90, 84, 55, 14));                    // pocket
    line(ctx, [[shX - 14, shY + 14], [shX - 18, shY + 90]], 5, "#f7efe3"); line(ctx, [[shX + 14, shY + 14], [shX + 18, shY + 90]], 5, "#f7efe3");
  }
  if (s.backpack) { line(ctx, [[shX - 46, shY + 4], [shX - 40, shY + 160]], 14, "#2f3338"); line(ctx, [[shX + 46, shY + 4], [shX + 40, shY + 160]], 14, "#2f3338"); }

  // ---- head (drawn before the front arm so a raised hand can cover the face)
  const hx = shX + Math.sin(tilt) * 60 + (st.look || 0) * 6, hy = shY - R + 18;
  if (s.headphones) blob(ctx, "#3b3f46", ink, 7, (c) => c.ellipse(shX, shY + 2, 92, 26, 0, 0, Math.PI * 2));
  drawHead(ctx, s, st, hx, hy);
  drawArm(armF, true);
  if (st.pose.phone) {                                         // phone in the raised hand, held at the ear
    const h = (st.pose.phone === "F" ? armF : armB)[2];
    blob(ctx, "#1e2a3a", ink, 6, (c) => c.roundRect(h[0] - 18, h[1] - 52, 36, 72, 8));
    blob(ctx, s.head, ink, 7, (c) => c.arc(h[0], h[1], 21, 0, Math.PI * 2));
  }
}

function drawHead(ctx, s, st, hx, hy) {
  const ink = s.ink;
  const e = STICK_EXPRESSIONS[st.expression] || STICK_EXPRESSIONS.neutral;
  // ears
  for (const sd of [-1, 1]) blob(ctx, s.head, ink, 8, (c) => c.ellipse(hx + sd * (R - 6), hy + 20, 30, 40, 0, 0, Math.PI * 2));
  // hair behind (back volume)
  if (s.hairStyle === "curly") {
    for (let i = 0; i < 15; i++) { const a = Math.PI * (1.02 + i * 0.07); blob(ctx, s.hair, ink, 7, (c) => c.arc(hx + Math.cos(a) * R * 0.98, hy + Math.sin(a) * R * 0.9 - 10, 54 + (i % 3) * 6, 0, Math.PI * 2)); }
  }
  // face disc
  blob(ctx, s.head, ink, 11, (c) => c.ellipse(hx, hy, R, R * 0.97, 0, 0, Math.PI * 2));
  // hair on top
  if (s.hairStyle === "quiff") {
    // short sides: a thin dark band down to the ears
    for (const sd of [-1, 1]) blob(ctx, s.hair, ink, 7, (c) => { c.moveTo(hx + sd * (R - 4), hy - 10); c.quadraticCurveTo(hx + sd * (R + 6), hy - 90, hx + sd * (R - 40), hy - 150); c.lineTo(hx + sd * (R - 64), hy - 120); c.quadraticCurveTo(hx + sd * (R - 26), hy - 70, hx + sd * (R - 22), hy - 4); });
    // swept-up wavy quiff: tall at the front, rolling back, with a separate wave crest
    blob(ctx, s.hair, ink, 9, (c) => {
      c.moveTo(hx - R + 30, hy - 105);
      c.bezierCurveTo(hx - R + 10, hy - R - 30, hx - 70, hy - R - 95, hx + 20, hy - R - 78);
      c.bezierCurveTo(hx + 70, hy - R - 120, hx + 175, hy - R - 70, hx + 150, hy - R + 5);
      c.bezierCurveTo(hx + R - 10, hy - R + 50, hx + R - 30, hy - 120, hx + R - 50, hy - 105);
      c.bezierCurveTo(hx + 110, hy - 150, hx + 70, hy - R + 70, hx + 20, hy - R + 62);
      c.bezierCurveTo(hx - 30, hy - R + 70, hx - 110, hy - R + 95, hx - R + 30, hy - 105);
    });
    ctx.strokeStyle = "#3a302c"; ctx.lineWidth = 6; ctx.lineCap = "round";                      // strand highlights
    for (const [a, b, c2, d] of [[-120, -R - 10, -10, -R - 62], [-40, -R - 40, 110, -R - 52], [-150, -R + 30, -80, -R - 10], [30, -R + 30, 150, -R - 10]]) {
      ctx.beginPath(); ctx.moveTo(hx + a, hy + b); ctx.quadraticCurveTo(hx + (a + c2) / 2, hy + Math.min(b, d) - 20, hx + c2, hy + d); ctx.stroke();
    }
  } else {
    for (let i = 0; i < 11; i++) { const a = Math.PI * (1.08 + i * 0.084); blob(ctx, s.hair, ink, 7, (c) => c.arc(hx + Math.cos(a) * R * 0.86, hy + Math.sin(a) * R * 0.86 - 8, 48 + (i % 2) * 8, 0, Math.PI * 2)); }
  }

  // eyes (with lids for half-lidded looks and blinks)
  const lid = Math.min(1, Math.max(-0.3, e.lid + st.blink));
  const ey = hy + 10, ex = 62;
  for (const sd of [-1, 1]) {
    const x = hx + sd * ex + (st.look || 0) * 8;
    const ry = 24 * (1 + Math.min(0, -lid) * 0.8);
    ctx.save(); ctx.beginPath(); ctx.ellipse(x, ey, 17, ry, 0, 0, Math.PI * 2); ctx.clip();
    ctx.fillStyle = ink; ctx.fillRect(x - 20, ey - ry + Math.max(0, lid) * ry * 2, 40, ry * 2);
    ctx.restore();
    if (lid > 0.05) line(ctx, [[x - 22, ey - ry + lid * ry * 2], [x + 22, ey - ry + lid * ry * 2]], 7, ink);
    if (lid < 0.7) { ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.arc(x + 5, ey - 8 + Math.max(0, lid) * 18, 5, 0, Math.PI * 2); ctx.fill(); }
  }
  // brows
  for (const sd of [-1, 1]) {
    const by = ey - 58 - e.brow * 26 - (e.asym && sd > 0 ? 18 : 0);
    const tilt = e.browTilt * 18 * sd;
    line(ctx, [[hx + sd * 38, by + tilt], [hx + sd * 88, by - tilt * 0.4]], 13, s.hair);
  }
  if (s.glasses) {
    ctx.lineWidth = 8; ctx.strokeStyle = ink;
    for (const sd of [-1, 1]) { ctx.beginPath(); ctx.arc(hx + sd * ex, ey, 44, 0, Math.PI * 2); ctx.stroke(); }
    line(ctx, [[hx - 20, ey - 6], [hx + 20, ey - 6]], 7, ink);
  }
  // nose
  ctx.strokeStyle = ink; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(hx + 4, ey + 52, 13, Math.PI * 0.1, Math.PI * 0.95); ctx.stroke();

  // mouth: closed smile line or open shape from the viseme
  const [jaw, wid, round] = VIS[st.viseme] || VIS.X;
  const my = hy + 112, mw = 46 * wid * (1 - 0.45 * round), side = (e.side || 0) * 14;
  if (jaw < 0.12 && !e.o) {
    const sm = e.smile;
    ctx.strokeStyle = ink; ctx.lineWidth = 8; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(hx - mw + side, my - sm * 6 + (e.side ? 6 : 0)); ctx.quadraticCurveTo(hx + side, my + sm * 26, hx + mw + side, my - sm * 6 - (e.side ? 10 : 0)); ctx.stroke();
  } else {
    const oh = e.o && jaw < 0.12 ? 22 : 12 + jaw * 52;
    blob(ctx, "#3a1418", ink, 7, (c) => c.ellipse(hx + side * 0.5, my + oh * 0.35, Math.max(18, mw), oh, 0, 0, Math.PI * 2));
    ctx.save(); ctx.beginPath(); ctx.ellipse(hx + side * 0.5, my + oh * 0.35, Math.max(18, mw) - 4, oh - 4, 0, 0, Math.PI * 2); ctx.clip();
    ctx.fillStyle = "#fbf7f2"; ctx.fillRect(hx - 60, my + oh * 0.35 - oh, 120, 12);          // teeth
    ctx.fillStyle = "#d4646a"; ctx.beginPath(); ctx.ellipse(hx, my + oh * 0.35 + oh * 0.75, 26, 14, 0, 0, Math.PI * 2); ctx.fill(); // tongue
    ctx.restore();
  }
  if (s.goatee) {
    blob(ctx, s.beard, ink, 0, (c) => { c.moveTo(hx - 26, hy + 150); c.quadraticCurveTo(hx, hy + 140, hx + 26, hy + 150); c.quadraticCurveTo(hx + 18, hy + 182, hx, hy + 188); c.quadraticCurveTo(hx - 18, hy + 182, hx - 26, hy + 150); });
    line(ctx, [[hx - 4, hy + 132], [hx + 4, hy + 132]], 9, s.beard);                       // soul patch
  }
}
