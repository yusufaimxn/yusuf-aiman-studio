// Reusable low-poly isometric kit (Three.js r170). Everything is seeded: no Math.random.
import * as THREE from "../vendor/three.module.js";

export function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
export const backOut = (x) => { x = Math.max(0, Math.min(1, x)); const c = 1.9; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };

const std = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0, flatShading: true, ...o });
function box(w, h, d, mat, x = 0, y = 0, z = 0, parent) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true;
  if (parent) parent.add(m); return m;
}
function canvasTex(w, h, paint) {
  const c = document.createElement("canvas"); c.width = w; c.height = h; paint(c.getContext("2d"), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
function rr(g, x, y, w, h, r) { g.beginPath(); g.roundRect(x, y, w, h, r); }
const FONT = (px, wt = 800) => `${wt} ${px}px Sora, Inter, sans-serif`;

// ---------------------------------------------------------------- sprite textures
function bubbleTex(fill, mark) {
  return canvasTex(256, 256, (g) => {
    g.fillStyle = fill; rr(g, 18, 18, 220, 170, 46); g.fill();
    g.beginPath(); g.moveTo(70, 180); g.lineTo(52, 238); g.lineTo(118, 184); g.fill();
    g.fillStyle = "#fff";
    if (mark === "dots") for (const x of [78, 128, 178]) { g.beginPath(); g.arc(x, 104, 17, 0, Math.PI * 2); g.fill(); }
    if (mark === "tick") { g.strokeStyle = "#fff"; g.lineWidth = 22; g.lineCap = "round"; g.beginPath(); g.moveTo(80, 104); g.lineTo(115, 138); g.lineTo(180, 70); g.stroke(); }
    if (mark === "plane") { g.beginPath(); g.moveTo(70, 104); g.lineTo(190, 56); g.lineTo(150, 152); g.lineTo(128, 118); g.closePath(); g.fill(); }
  });
}
function clockTex() {
  return canvasTex(256, 256, (g) => {
    g.fillStyle = "#fff"; g.beginPath(); g.arc(128, 128, 112, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#1F2937"; g.lineWidth = 18; g.beginPath(); g.arc(128, 128, 92, 0, Math.PI * 2); g.stroke();
    g.lineCap = "round"; g.beginPath(); g.moveTo(128, 128); g.lineTo(128, 62); g.stroke(); g.beginPath(); g.moveTo(128, 128); g.lineTo(172, 150); g.stroke();
  });
}
function signTex(text, bg, fg, w = 512, h = 256, px = 92) {
  return canvasTex(w, h, (g) => {
    g.fillStyle = bg; rr(g, 8, 8, w - 16, h - 16, 36); g.fill();
    g.strokeStyle = "rgba(255,255,255,0.85)"; g.lineWidth = 10; rr(g, 22, 22, w - 44, h - 44, 26); g.stroke();
    g.fillStyle = fg; g.font = FONT(px); g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(text, w / 2, h / 2 + 4);
  });
}
function boardTex(bad) {
  return canvasTex(512, 384, (g) => {
    g.fillStyle = "#0B1E3F"; g.fillRect(0, 0, 512, 384);
    g.fillStyle = "#00C2FF"; g.font = FONT(34); g.fillText("BERLEPAS", 24, 52);
    const rows = [["YA 101", "KUL"], ["YA 205", "SIN"], ["YA 330", "BKK"], ["YA 412", "CGK"]];
    rows.forEach(([f, d], i) => {
      const y = 112 + i * 66; g.fillStyle = "#F5F7FA"; g.font = FONT(30, 700); g.fillText(f, 24, y); g.fillText(d, 190, y);
      g.fillStyle = bad ? "#FF4D5E" : "#22C55E"; g.fillText(bad ? "TANGGUH" : "ON TIME", 300, y);
    });
  });
}
function alertTex(ch, bg) {
  return canvasTex(256, 256, (g) => {
    g.fillStyle = bg; g.beginPath(); g.arc(128, 128, 112, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#fff"; g.font = FONT(170); g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(ch, 128, 140);
  });
}
function windowsTex() {
  return canvasTex(128, 256, (g) => {
    g.fillStyle = "#000"; g.fillRect(0, 0, 128, 256);
    g.fillStyle = "#fff"; for (let r = 0; r < 8; r++) for (let c = 0; c < 4; c++) g.fillRect(10 + c * 30, 12 + r * 30, 18, 18);
  });
}
function stripeTex() {
  return canvasTex(256, 64, (g) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? "#F5F7FA" : "#E23B3B"; g.fillRect(i * 32, 0, 32, 64); } });
}
export const TEX = {
  bubble: bubbleTex("#25C45F", "dots"), bubbleGrey: bubbleTex("#8D96A3", "dots"),
  bubbleGreen: bubbleTex("#25C45F", "tick"), bubbleBlue: bubbleTex("#2AA3EF", "plane"),
  clock: clockTex(), boardOk: boardTex(false), boardRed: boardTex(true),
  cash: signTex("CASH ONLY", "#FF8A00", "#fff"), mamak: signTex("RESTORAN MAMAK", "#0066DE", "#fff", 1024, 200, 92),
  atm: signTex("ATM", "#0B1E3F", "#00C2FF", 256, 128, 72), kedai: signTex("KEDAI RUNCIT", "#22C55E", "#fff", 768, 160, 80),
  mart: signTex("PASAR RAYA", "#0066DE", "#fff", 768, 160, 84), bang: alertTex("!", "#FF4D5E"), what: alertTex("?", "#FF8A00"),
  windows: windowsTex(), stripes: stripeTex(),
};
TEX.windows.wrapS = TEX.windows.wrapT = THREE.RepeatWrapping;
TEX.stripes.wrapS = THREE.RepeatWrapping;
export function sprite(tex, size, parent) {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
  s.scale.setScalar(size); if (parent) parent.add(s); return s;
}

// ---------------------------------------------------------------- people (generic tiny figures)
const SHIRTS = ["#0066DE", "#FF8A00", "#22C55E", "#E23B3B", "#8B5CF6", "#F5F7FA", "#0EA5E9", "#F59E0B", "#334155"];
const SKIN = ["#F1C9A5", "#D9A27A", "#B57A52", "#8D5A3B"];
export function person(seed, phone = true) {
  const r = rng(seed * 97 + 13), g = new THREE.Group();
  const shirt = std(SHIRTS[Math.floor(r() * SHIRTS.length)]), skin = std(SKIN[Math.floor(r() * SKIN.length)]);
  const legs = std(r() > 0.5 ? "#1F2937" : "#475569");
  const lg = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.75, 8), legs); lg.position.y = 0.38; lg.castShadow = true; g.add(lg);
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.27, 0.45, 4, 10), shirt); body.position.y = 1.08; body.castShadow = true; g.add(body);
  const head = new THREE.Group(); head.position.y = 1.72; g.add(head);
  const hd = new THREE.Mesh(new THREE.SphereGeometry(0.24, 14, 10), skin); hd.castShadow = true; head.add(hd);
  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.25, 14, 8, 0, Math.PI * 2, 0, Math.PI * 0.45), std(r() > 0.3 ? "#1b1410" : "#3b2a1e")); hair.position.y = 0.03; head.add(hair);
  if (r() > 0.75) { const tud = new THREE.Mesh(new THREE.SphereGeometry(0.27, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.62), std(SHIRTS[Math.floor(r() * 6)])); head.add(tud); }
  if (phone) {
    const ph = box(0.12, 0.22, 0.04, std("#111827", { emissive: new THREE.Color("#00C2FF"), emissiveIntensity: 0.6 }), 0.0, 1.25, 0.33, g);
    ph.rotation.x = -0.6;
  }
  const obj = { obj: g, head, body,
    look(a) { head.rotation.y = a; head.rotation.x = 0.25; },
    walk(dt, moving) { const k = moving ? Math.sin(dt * 14) : 0; body.rotation.z = k * 0.06; g.position.y = moving ? Math.abs(k) * 0.08 : g.position.y; } };
  return obj;
}

// ---------------------------------------------------------------- buildings
function tower(x, z, w, d, h, color, seed) {
  const g = new THREE.Group();
  const mat = std(color, { emissive: new THREE.Color("#ffd27a"), emissiveMap: TEX.windows.clone(), emissiveIntensity: 0 });
  mat.emissiveMap.needsUpdate = true; mat.emissiveMap.repeat.set(Math.max(1, Math.round(w / 2)), Math.max(1, Math.round(h / 4)));
  const b = box(w, h, d, mat, 0, h / 2, 0, g);
  box(w + 0.3, 0.3, d + 0.3, std("#e5e7eb"), 0, h + 0.15, 0, g);
  g.position.set(x, 0, z);
  return { group: g, mat, x, z, seed };
}

export function buildTown(THREE_, scene) {
  const out = { people: [], queue: [], alerts: [], goods: [], towers: [] };
  const R = rng(2026);
  // ground + roads
  const ground = new THREE.Mesh(new THREE.BoxGeometry(220, 1, 200), std("#bfe0a6")); ground.position.y = -0.5; ground.receiveShadow = true; scene.add(ground);
  const asphalt = std("#3b4252"), walk = std("#d8dee9");
  box(220, 0.06, 5, asphalt, 0, 0.03, 7.5, scene);
  box(5, 0.06, 200, asphalt, 15, 0.03, 0, scene);
  box(220, 0.08, 1.6, walk, 0, 0.04, 4.2, scene);
  for (let x = -100; x < 100; x += 4) box(1.8, 0.07, 0.2, std("#f5f7fa"), x, 0.07, 7.5, scene);

  // ---- mamak (open front, origin)
  const mm = new THREE.Group(); scene.add(mm);
  box(9, 0.3, 6.6, std("#e7d3b5"), 0, 0.15, 0, mm);                       // tiled floor
  box(9, 5.6, 0.35, std("#f6e7c8"), 0, 2.8, -3.2, mm);                    // back wall
  box(0.35, 5.6, 6.6, std("#f2dcb4"), -4.5, 2.8, 0, mm);                  // side wall
  const aw = new THREE.Mesh(new THREE.BoxGeometry(9.6, 0.25, 1.7), new THREE.MeshStandardMaterial({ map: TEX.stripes, roughness: 0.8 }));
  aw.material.map.repeat.set(4, 1); aw.position.set(0, 5.3, 3.4); aw.rotation.x = 0.22; aw.castShadow = true; mm.add(aw);
  for (const x of [-4.3, 4.3]) box(0.25, 5.3, 0.25, std("#9ca3af"), x, 2.65, 3.1, mm);
  const sg = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 1.4), new THREE.MeshBasicMaterial({ map: TEX.mamak, transparent: true })); sg.position.set(0, 4.4, -3.0); mm.add(sg);
  out.router = box(0.6, 0.25, 0.35, std("#111827", { emissive: new THREE.Color("#22c55e"), emissiveIntensity: 1.2 }), -3.2, 3.0, -2.95, mm);
  box(0.06, 0.4, 0.06, std("#111827"), -3.4, 3.3, -2.95, mm); box(0.06, 0.4, 0.06, std("#111827"), -3.0, 3.3, -2.95, mm);
  box(2.6, 1.1, 0.9, std("#c08457"), 2.6, 0.85, -2.4, mm);                 // counter
  const tables = [[-2.2, 0.4], [0.6, -0.9], [2.4, 1.4], [-0.9, 2.0]];
  tables.forEach(([x, z]) => {
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.1, 18), std("#f5f7fa")); top.position.set(x, 1.15, z); top.castShadow = true; mm.add(top);
    box(0.12, 0.85, 0.12, std("#9ca3af"), x, 0.72, z, mm);
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.26, 10), std("#c9853d")); cup.position.set(x + 0.3, 1.33, z); mm.add(cup);
  });
  const seats = [[-3.1, 0.6], [-1.3, 0.1], [0.0, -1.6], [1.4, -0.6], [2.4, 2.4], [3.3, 1.0], [-1.6, 2.6]];
  seats.forEach(([x, z], i) => {
    const p = person(i + 1); p.obj.position.set(x, 0.3, z); p.obj.lookAt(0, 0.3, 6); mm.add(p.obj);
    p.x = x; p.z = z;
    p.bubble = sprite(TEX.bubble, 0.95, scene); p.bubble.visible = false;
    p.clock = sprite(TEX.clock, 0.95, scene); p.clock.visible = false;
    out.people.push(p);
  });

  // ---- shops row left/right of the mamak
  const shop = (x, w, col, roof) => { const g = new THREE.Group(); scene.add(g); box(w, 4.2, 6, std(col), x, 2.1, -1.0, g); box(w + 0.4, 0.4, 6.4, std(roof), x, 4.4, -1.0, g); return g; };
  shop(-10, 7, "#f8d7da", "#e23b3b"); shop(10.5, 8, "#d1fae5", "#22c55e"); shop(-18, 6, "#e0e7ff", "#6366f1"); shop(22, 7, "#fef3c7", "#f59e0b");
  // ATM kiosk on the left shop front
  const atm = box(1.4, 2.4, 0.8, std("#cbd5e1"), -10, 1.2, 2.95, scene);
  box(0.9, 0.6, 0.05, std("#0B1E3F", { emissive: new THREE.Color("#00C2FF"), emissiveIntensity: 0.8 }), -10, 1.7, 3.37, scene);
  const atmSign = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.1), new THREE.MeshBasicMaterial({ map: TEX.atm, transparent: true })); atmSign.position.set(-10, 3.9, 2.62); scene.add(atmSign);
  for (let i = 0; i < 6; i++) {
    const q = person(40 + i); scene.add(q.obj); q.obj.visible = false;
    q.sx = -26 - i * 2.2; q.sz = 5.2; q.ex = -10 - i * 0.05; q.ez = 4.2 + i * 0.95; q.obj.rotation.y = Math.PI;
    out.queue.push(q);
  }
  // card terminal on the kedai runcit counter
  const kd = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 1.3), new THREE.MeshBasicMaterial({ map: TEX.kedai, transparent: true })); kd.position.set(10.5, 4.2, 2.62); scene.add(kd);
  box(5, 1.2, 1.0, std("#a16207"), 10.5, 0.6, 3.2, scene);
  const term = new THREE.Group(); term.position.set(9.6, 1.2, 3.25); scene.add(term);
  box(0.6, 0.18, 0.9, std("#1F2937"), 0, 0.09, 0, term);
  const screen = box(0.5, 0.5, 0.06, std("#111827", { emissive: new THREE.Color("#22c55e"), emissiveIntensity: 1.6 }), 0, 0.45, -0.25, term); screen.rotation.x = -0.35;
  const xs = sprite(alertTex("×", "#FF4D5E"), 1.4, term); xs.position.set(0, 1.5, 0);
  out.terminal = { screen, x: xs };
  out.cashSign = sprite(TEX.cash, 1, scene); out.cashSign.position.set(12.5, 6.6, 3.0); out.cashSign.visible = false;

  // ---- city towers (avoid roads and the special lots)
  const lots = [[-38, -42, 30, 18], [32, -38, 20, 14], [30, 20, 14, 12], [0, 0, 30, 8]];
  // keep a clear sight-line from the iso camera (+x,+z side) to every focus point
  const FOCUS = [[0, 2, 26], [-6, 5, 30], [-38, -44, 30], [30, 20, 34], [32, -38, 26]];
  const inFront = (x, z) => FOCUS.some(([fx, fz, wdt]) => { const a = (x - fx) + (z - fz), c = Math.abs((x - fx) - (z - fz)) / Math.SQRT2; return a > -10 && a < 90 && c < wdt; });
  const free = (x, z) => Math.abs(z - 7.5) > 4.5 && Math.abs(x - 15) > 4.5 && !inFront(x, z) && !lots.some(([cx, cz, hw, hd]) => Math.abs(x - cx) < hw && Math.abs(z - cz) < hd);
  const COLS = ["#e2e8f0", "#cbd5e1", "#bfdbfe", "#fde68a", "#fecaca", "#c7d2fe", "#d1fae5", "#f5f5f4"];
  for (let gx = -96; gx <= 96; gx += 9) for (let gz = -90; gz <= 90; gz += 9) {
    const x = gx + (R() - 0.5) * 2, z = gz + (R() - 0.5) * 2;
    if (!free(x, z) || R() < 0.18) continue;
    const dist = Math.hypot(x, z), h = 4 + R() * (dist < 40 ? 16 : 26) + (dist > 30 && R() > 0.8 ? 18 : 0);
    const tw = tower(x, z, 4 + R() * 3, 4 + R() * 3, h, COLS[Math.floor(R() * COLS.length)], R());
    scene.add(tw.group); out.towers.push(tw);
    if (R() > 0.7) { const tr = new THREE.Mesh(new THREE.ConeGeometry(1, 2.4, 7), std("#4ade80")); tr.position.set(x + 4, 1.2, z + 3); tr.castShadow = true; scene.add(tr); }
  }
  out.setWindows = (fn) => out.towers.forEach((tw) => { tw.mat.emissiveIntensity = fn(tw.x, tw.z, tw.seed) ? 1.25 : 0; });

  // ---- airport (left back): runway, terminal, departure board, planes
  const ap = new THREE.Group(); ap.position.set(-38, 0, -44); scene.add(ap);
  box(56, 0.08, 9, std("#4b5563"), 0, 0.05, 6, ap);
  for (let x = -24; x < 26; x += 5) box(2.6, 0.1, 0.4, std("#f5f7fa"), x, 0.1, 6, ap);
  box(22, 6, 8, std("#e0f2fe"), -6, 3, -6, ap); box(23, 0.5, 9, std("#0066DE"), -6, 6.25, -6, ap);
  const board = new THREE.Mesh(new THREE.PlaneGeometry(9, 6.75), new THREE.MeshBasicMaterial({ map: TEX.boardOk })); board.position.set(-6, 10.5, -2.2); ap.add(board);
  box(0.4, 4.2, 0.4, std("#9ca3af"), -6, 6.8, -2.4, ap);
  out.board = board;
  const plane = (x, z, ry) => {
    const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; ap.add(g);
    const fus = new THREE.Mesh(new THREE.CapsuleGeometry(0.9, 9, 4, 12), std("#f8fafc")); fus.rotation.z = Math.PI / 2; fus.position.y = 1.6; fus.castShadow = true; g.add(fus);
    box(3, 0.18, 11, std("#cbd5e1"), 0.6, 1.4, 0, g); box(1.2, 2.2, 0.2, std("#0066DE"), -4.6, 3, 0, g); box(1.4, 0.15, 4, std("#cbd5e1"), -4.6, 1.9, 0, g);
    for (const s of [-1, 1]) box(0.3, 1, 0.3, std("#334155"), 0.5, 0.5, s * 1.6, g);
    return g;
  };
  plane(-12, 6, 0); plane(10, 0, 0.3); plane(18, -8, 1.2);
  out.alerts.push({ kind: "!", sprite: sprite(TEX.bang, 4, scene), size: 4, y: 11 });
  out.alerts[out.alerts.length - 1].sprite.position.set(-50, 11, -38);
  out.alerts.push({ kind: "!", sprite: sprite(TEX.bang, 4, scene), size: 4, y: 9 });
  out.alerts[out.alerts.length - 1].sprite.position.set(-28, 9, -44);

  // ---- warehouse + trucks (right back)
  const wh = new THREE.Group(); wh.position.set(32, 0, -38); scene.add(wh);
  box(22, 7, 12, std("#d6d3d1"), 0, 3.5, -2, wh); box(23, 0.6, 13, std("#78716c"), 0, 7.3, -2, wh);
  for (let i = 0; i < 4; i++) box(3, 4, 0.2, std("#57534e"), -7.5 + i * 5, 2, 4.1, wh);
  const truck = (x, z, ry, parent) => {
    const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; parent.add(g);
    box(5, 2.6, 2.2, std("#f5f7fa"), -1, 1.8, 0, g); box(1.8, 1.9, 2.2, std("#FF8A00"), 2.6, 1.45, 0, g);
    for (const [wx, wz] of [[-2.5, 1.1], [-2.5, -1.1], [2.6, 1.1], [2.6, -1.1]]) { const wl = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.3, 10), std("#111827")); wl.rotation.x = Math.PI / 2; wl.position.set(wx, 0.45, wz); g.add(wl); }
    return g;
  };
  [[-7, 8, Math.PI / 2], [-2, 8, Math.PI / 2], [3, 8, Math.PI / 2], [8, 8, Math.PI / 2]].forEach(([x, z, r], i) => {
    truck(x, z, r, wh);
    const a = { kind: "!", sprite: sprite(TEX.bang, 3, scene), size: 3, y: 7 }; a.sprite.position.set(32 + x, 7, -38 + z); out.alerts.push(a);
  });

  // ---- pasar raya (cutaway: floor, two walls, shelves with goods) + confused lorries
  const mk = new THREE.Group(); mk.position.set(30, 0, 20); scene.add(mk);
  box(20, 0.3, 14, std("#f1f5f9"), 0, 0.15, 0, mk); box(20, 6, 0.4, std("#e2e8f0"), 0, 3, -7, mk); box(0.4, 6, 14, std("#dbeafe"), -10, 3, 0, mk);
  const ms = new THREE.Mesh(new THREE.PlaneGeometry(9, 1.9), new THREE.MeshBasicMaterial({ map: TEX.mart, transparent: true })); ms.position.set(0, 5, -6.75); mk.add(ms);
  const GOODS = ["#E23B3B", "#FF8A00", "#22C55E", "#0066DE", "#F59E0B", "#8B5CF6", "#0EA5E9", "#F472B6"];
  const gr = rng(77);
  for (let s = 0; s < 4; s++) {
    const sz = -4.5 + s * 3.2;
    box(15, 0.2, 1.2, std("#94a3b8"), 0, 0.9, sz, mk); box(15, 0.2, 1.2, std("#94a3b8"), 0, 2.1, sz, mk); box(15, 0.2, 1.2, std("#94a3b8"), 0, 3.3, sz, mk);
    box(15, 3.4, 0.15, std("#cbd5e1"), 0, 2.0, sz - 0.55, mk);
    for (const y of [1.0, 2.2, 3.4]) for (let x = -7; x <= 7; x += 0.75) {
      const g = box(0.6, 0.7 + gr() * 0.3, 0.7, std(GOODS[Math.floor(gr() * GOODS.length)]), x, y + 0.45, sz, mk);
      out.goods.push({ mesh: g, seed: gr() });
    }
  }
  const lorry1 = truck(-14, 9, 0.4, mk), lorry2 = truck(-4, 11, -0.3, mk);
  for (const [x, z] of [[16, 29], [26, 31]]) { const a = { kind: "?", sprite: sprite(TEX.what, 3.2, scene), size: 3.2, y: 7 }; a.sprite.position.set(x, 7, z); out.alerts.push(a); }
  out.alerts.forEach((a) => (a.sprite.visible = false));
  return out;
}

// ---------------------------------------------------------------- migration diorama (generic app icons, not real logos)
export function buildMigration(THREE_, scene, at) {
  const g = new THREE.Group(); g.position.copy(at); scene.add(g);
  const water = new THREE.Mesh(new THREE.BoxGeometry(80, 1, 80), std("#7dd3fc")); water.position.y = -0.8; water.receiveShadow = true; g.add(water);
  const isl = (x, col) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(7, 7.6, 1.2, 8), std("#e5e7eb")); m.position.set(x, 0, 0); m.receiveShadow = true; m.castShadow = true; g.add(m);
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(7.1, 7.1, 0.25, 32), std(col, { emissive: new THREE.Color(col), emissiveIntensity: 1 })); ring.position.set(x, 0.62, 0); g.add(ring);
    const pole = box(0.3, 6, 0.3, std("#94a3b8"), x, 3.6, -4, g);
    return ring;
  };
  const greenGlow = isl(-11, "#25C45F"), blueGlow = isl(11, "#2AA3EF");
  box(8, 0.3, 2.4, std("#cbd5e1"), 0, 0.2, 0, g);                         // bridge
  const sg = sprite(TEX.bubbleGreen, 6, g); sg.position.set(-11, 8.4, -4);
  const sb = sprite(TEX.bubbleBlue, 6, g); sb.position.set(11, 8.4, -4);
  const walkers = [], r = rng(70);
  for (let i = 0; i < 48; i++) {
    const p = person(100 + i, false); g.add(p.obj);
    const a = r() * Math.PI * 2, d = 1 + r() * 5, a2 = r() * Math.PI * 2, d2 = 1 + r() * 5;
    p.sx = -11 + Math.cos(a) * d; p.sz = Math.sin(a) * d * 0.8 + 0.6; p.ex = 11 + Math.cos(a2) * d2; p.ez = Math.sin(a2) * d2 * 0.8 + 0.6; p.seed = r();
    p.obj.position.set(p.sx, 0.6, p.sz); p.obj.rotation.y = Math.PI / 2;
    const base = p.walk; p.walk = (dt, moving) => { base(dt, moving); p.obj.position.y += 0.6; };
    walkers.push(p);
  }
  return { walkers, greenGlow, blueGlow };
}

// ---------------------------------------------------------------- coast cross-section with the subsea cable
export function buildSeaBlock(THREE_, scene, at) {
  const g = new THREE.Group(); g.position.copy(at); scene.add(g);
  const D = 20;
  const ext = (pts, mat, depth = D) => {
    const sh = new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));
    const m = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth, bevelEnabled: false }), mat); m.position.z = -depth / 2; m.receiveShadow = true; m.castShadow = true; g.add(m); return m;
  };
  // sand + beach (slope from x=-16,y=1 to x=-8,y=-14)
  ext([[-34, -17], [34, -17], [34, -14], [-8, -14], [-16, 1], [-34, 1]], std("#e8c98f"));
  ext([[-34, -17], [34, -17], [34, -16.2], [-34, -16.2]], std("#c9a66b"));
  box(18, 0.3, D, std("#9fd67a"), -25, 1.15, 0, g);                       // grass on land
  const water = ext([[-15.47, 0], [34, 0], [34, -14], [-8, -14]], new THREE.MeshStandardMaterial({ color: "#1f86d1", transparent: true, opacity: 0.32, roughness: 0.2, depthWrite: false }));
  water.castShadow = false;
  const surf = new THREE.Mesh(new THREE.PlaneGeometry(49.5, D), new THREE.MeshStandardMaterial({ color: "#5ab8f0", transparent: true, opacity: 0.35, depthWrite: false }));
  surf.rotation.x = -Math.PI / 2; surf.position.set(9.25, 0.02, 0); g.add(surf);
  // rocks + weed
  const rr_ = rng(5);
  for (let i = 0; i < 26; i++) { const r = new THREE.Mesh(new THREE.DodecahedronGeometry(0.4 + rr_() * 0.9), std("#94a3b8")); r.position.set(-6 + rr_() * 39, -13.8, -8 + rr_() * 16); r.castShadow = true; if (Math.abs(r.position.x - 10) < 8 && r.position.z > -3) continue; g.add(r); }
  for (let i = 0; i < 18; i++) { const w = new THREE.Mesh(new THREE.ConeGeometry(0.25, 2 + rr_() * 2, 5), std("#16a34a")); w.position.set(-4 + rr_() * 37, -13, -9 + rr_() * 18); if (Math.abs(w.position.x - 10) < 8 && w.position.z > -3) continue; g.add(w); }
  // landing station + houses (lights)
  const lights = [];
  const house = (x, z, w, h, col) => {
    const m = std(col, { emissive: new THREE.Color("#ffd27a"), emissiveMap: TEX.windows, emissiveIntensity: 1.3 });
    box(w, h, w, m, x, 1.3 + h / 2, z, g); box(w + 0.3, 0.4, w + 0.3, std("#e23b3b"), x, 1.3 + h + 0.2, z, g); lights.push(m);
  };
  house(-24, 0, 4, 3, "#e0f2fe"); house(-29, -5, 3, 4, "#fde68a"); house(-29, 5, 3, 3, "#fecaca"); house(-20, -6, 2.6, 2.6, "#d1fae5"); house(-21, 6, 2.6, 5, "#c7d2fe");
  // cable: two pieces so it can break at u = UB
  const curve = new THREE.CatmullRomCurve3([[-24, 1.45, 0], [-17.5, 1.45, 0], [-12, -6.25, 0], [-8.2, -13.6, 0], [0, -13.7, 0], [34, -13.7, 0]].map((p) => new THREE.Vector3(...p)), false, "catmullrom", 0.1);
  const cableMat = std("#111827", { roughness: 0.5 }), RAD = 0.24;
  const pts = curve.getSpacedPoints(400);
  const UB = pts.findIndex((p) => p.x > 15) / 400;
  const piece = (a, b) => { const sub = new THREE.CatmullRomCurve3(pts.slice(Math.floor(a * 400), Math.floor(b * 400) + 1)); const m = new THREE.Mesh(new THREE.TubeGeometry(sub, 200, RAD, 10), cableMat); m.castShadow = true; g.add(m); return m; };
  const left = piece(0, UB), right = new THREE.Group(); g.add(right);
  const rp = piece(UB, 1); g.remove(rp); right.add(rp);
  const pivot = pts[Math.floor(UB * 400)].clone();
  right.position.copy(pivot); rp.position.sub(pivot);
  const pulses = [];
  for (let i = 0; i < 26; i++) { const s = new THREE.Mesh(new THREE.SphereGeometry(0.34, 10, 8), new THREE.MeshStandardMaterial({ color: "#00C2FF", emissive: new THREE.Color("#00C2FF"), emissiveIntensity: 2.2 })); g.add(s); pulses.push(s); }
  // garden hose for scale (same diameter)
  const hose = new THREE.Group(); hose.position.set(10, -13.72, 2.4); g.add(hose);
  const hc = new THREE.CatmullRomCurve3([[-4, 0, -0.9], [-1, 0, -0.95], [2, 0, -0.8], [4, 0, 0.2], [3, 0, 1.2], [0.5, 0, 1.3]].map((p) => new THREE.Vector3(...p)));
  const hm = new THREE.Mesh(new THREE.TubeGeometry(hc, 80, RAD, 10), std("#22C55E", { roughness: 0.45 })); hm.castShadow = true; hose.add(hm);
  hose.visible = false;
  // shark (generic low-poly)
  const shark = new THREE.Group(); g.add(shark);
  const sb = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), std("#64748b")); sb.scale.set(3.2, 0.9, 1); shark.add(sb);
  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.95, 14, 10), std("#e2e8f0")); belly.scale.set(2.9, 0.6, 0.9); belly.position.y = -0.3; shark.add(belly);
  const fin = new THREE.Mesh(new THREE.ConeGeometry(0.6, 1.6, 4), std("#64748b")); fin.position.set(-0.2, 1.2, 0); fin.rotation.z = 0.3; shark.add(fin);
  const tail = new THREE.Group(); tail.position.set(-3, 0, 0); shark.add(tail);
  const tf = new THREE.Mesh(new THREE.ConeGeometry(0.7, 1.8, 4), std("#64748b")); tf.rotation.z = Math.PI / 2; tf.position.x = -0.6; tf.scale.set(1, 1, 0.3); tail.add(tf);
  for (const s of [-1, 1]) { const e = new THREE.Mesh(new THREE.SphereGeometry(0.13, 8, 6), std("#0f172a")); e.position.set(2.5, 0.25, s * 0.55); shark.add(e); }
  shark.visible = false;
  // ship + anchor
  const ship = new THREE.Group(); g.add(ship);
  box(9, 1.6, 3.4, std("#E23B3B"), 0, 0.6, 0, ship); box(9.2, 0.4, 3.6, std("#f5f7fa"), 0, 1.5, 0, ship); box(3, 2.2, 2.6, std("#f5f7fa"), -2, 2.8, 0, ship); box(0.6, 1.6, 0.6, std("#1F2937"), -2.4, 4.6, 0, ship);
  const anchor = new THREE.Group(); g.add(anchor);
  box(0.25, 2.2, 0.25, std("#475569", { metalness: 0.4 }), 0, 1.1, 0, anchor); box(2.0, 0.3, 0.3, std("#475569", { metalness: 0.4 }), 0, 0.15, 0, anchor);
  box(1.0, 0.25, 0.25, std("#475569"), 0, 2.1, 0, anchor);
  const chainMat = new THREE.LineBasicMaterial({ color: "#334155" }); const chainGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3(0, 1, 0)]);
  const chain = new THREE.Line(chainGeo, chainMat); g.add(chain);
  const spark = sprite(alertTex("⚡", "#FF8A00"), 3, g); spark.visible = false;

  const clamp01 = (x) => Math.max(0, Math.min(1, x)), ease = (x) => { x = clamp01(x); return x * x * (3 - 2 * x); }, lerp = (a, b, k) => a + (b - a) * k;
  function update(t, o) {
    const broken = t >= o.breakAt;
    // pulses flow land -> sea (data); after the break, nothing passes the gap
    pulses.forEach((p, i) => {
      let u = ((t * 0.07 + i / pulses.length) % 1);
      if (broken) { const k = clamp01((t - o.breakAt) / 0.6); p.visible = u < UB && k < 1; p.material.emissiveIntensity = 2.2 * (1 - k); }
      else { p.visible = true; p.material.emissiveIntensity = 2.2; }
      p.position.copy(curve.getPointAt(u));
    });
    hose.visible = t >= o.hoseAt && t < o.hoseEnd; hose.scale.setScalar(backOut(clamp01((t - o.hoseAt) / 0.35)) || 0.0001);
    // shark crosses above the cable, ignoring it
    const sk = clamp01((t - o.sharkFrom) / (o.sharkTo - o.sharkFrom + 0.6));
    shark.visible = t >= o.sharkFrom && sk < 1;
    shark.position.set(lerp(-4, 36, sk), -10.5 + Math.sin(t * 2) * 0.3, 2.5); tail.rotation.y = Math.sin(t * 9) * 0.4;
    // ship sails in, drops anchor, drags it across the cable
    const sh = ease((t - o.shipAt) / 2.2);
    ship.visible = t >= o.shipAt - 0.01;
    ship.position.set(lerp(42, 20, sh), Math.sin(t * 1.6) * 0.15, -1); ship.rotation.z = Math.sin(t * 1.3) * 0.03;
    const drop = ease((t - o.anchorAt) / 1.2), drag = ease((t - (o.anchorAt + 1.2)) / (o.breakAt - o.anchorAt - 1.2 + 0.8));
    anchor.visible = t >= o.anchorAt;
    const ax = lerp(17.5, 12.5, drag), ay = lerp(0, -13.6, drop);
    anchor.position.set(ax, ay, 0); anchor.rotation.z = drag > 0 && drag < 1 ? 0.5 : 0;
    chain.visible = anchor.visible;
    chain.geometry.setFromPoints([new THREE.Vector3(ax, ay + 2.2, 0), new THREE.Vector3(ship.position.x - 3.5, 0.8, -1)]);
    // break: right piece kinks away
    const bk = ease((t - o.breakAt) / 0.5);
    right.rotation.z = -0.22 * bk; right.position.set(pivot.x + 0.9 * bk, pivot.y + 0.5 * bk, pivot.z + 1.4 * bk);
    spark.visible = t >= o.breakAt && t < o.breakAt + 1.0 && Math.floor((t - o.breakAt) * 10) % 2 === 0;
    spark.position.set(pivot.x, pivot.y + 1.2, 0.5);
    // the island goes dark
    const dk = clamp01((t - o.darkAt) / 0.8);
    lights.forEach((m, i) => (m.emissiveIntensity = t >= o.darkAt + i * 0.12 ? 0 : 1.3 * (1 - dk * 0)));
  }
  return { update };
}
export { std, box, canvasTex, rr, FONT };
