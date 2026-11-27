// Isometric 3D world for "Apa Jadi Kalau Internet Hilang Dari Bumi?" (scene type B).
// Pure function of timeline time: draw(t) is called from the root hf-seek listener with absolute seconds.
// Reusable kit pieces (people, shops, towers, sprites, cross-section sea block) live in kit.js.
import * as THREE from "../vendor/three.module.js";
import * as K from "./kit.js";

const T = window.YA_T, S = T.scenes, L = (n) => T.lines[n], PH = (n) => T.phr[n];
const WD = (n, w) => { const x = T.words[n].find((v) => v[0].toLowerCase().startsWith(w.toLowerCase())); if (!x) throw new Error('word ' + n + ' ' + w); return x[1]; };
const clamp01 = (x) => Math.max(0, Math.min(1, x));
const ease = (x) => { x = clamp01(x); return x * x * (3 - 2 * x); };
const lerp = (a, b, k) => a + (b - a) * k;
const span = (t, a, b) => ease((t - a) / (b - a));

const W = 1080, H = 1920;
const canvas = document.getElementById("iso-canvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1); renderer.setSize(W, H, false);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;

const scene = new THREE.Scene();
const DAY = new THREE.Color("#9fd3f5"), NIGHT = new THREE.Color("#0b1530"), SEA = new THREE.Color("#7fc6ee");
scene.background = DAY.clone();
scene.fog = new THREE.Fog("#9fd3f5", 400, 900);
const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, -500, 1500);

// light: low warm sun (long shadows) + cool sky fill
const hemi = new THREE.HemisphereLight("#d6ecff", "#7a6a5a", 1.1); scene.add(hemi);
const sun = new THREE.DirectionalLight("#ffd7a3", 2.6); sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.02;
scene.add(sun); scene.add(sun.target);

// ---------------------------------------------------------------- the town (origin = mamak)
const town = K.buildTown(THREE, scene);          // ground, road, shops, mamak, ATM, towers, airport, warehouse, market
const mig = K.buildMigration(THREE, scene, new THREE.Vector3(-260, 0, 0));
const sea = K.buildSeaBlock(THREE, scene, new THREE.Vector3(260, 0, 0));

// ---------------------------------------------------------------- shots
// each shot: [time, target xyz, frustum height, camera dir (iso default), background]
const ISO = [1, 0.82, 1];
const hookCut = WD(2, "dari") - 0.2;       // "...dari seluruh bumi"
const k3 = PH(3), k10 = PH(10), k13 = PH(13), k15 = PH(15);
const SHOTS = [
  // hook tail: whole town from far, lights switch off outward
  { t0: hookCut, t1: S.tidur, from: { p: [0, 0, -6], h: 150 }, to: { p: [0, 0, -6], h: 175 }, dir: ISO, night: 1 },
  // minit: inside the mamak
  { t0: S.minit, t1: S.tidur, from: { p: [0, 1.8, 0.8], h: 15 }, to: { p: [0.3, 1.7, 0.6], h: 12.5 }, dir: [1, 0.6, 1.1], night: 0 },
  // jam: the street, card terminal, CASH ONLY, ATM queue
  { t0: S.jam, t1: S.dompet, from: { p: [4, 1.5, 4], h: 26 }, to: { p: [-3, 1.5, 4], h: 23 }, dir: ISO, night: 0.15 },
  // fakta: city wide behind the fact cards
  { t0: S.fakta, t1: S.telegram, from: { p: [0, 0, -10], h: 95 }, to: { p: [0, 0, -10], h: 110 }, dir: ISO, night: 0.55 },
  // telegram: crowd moves from green island to blue island
  { t0: S.telegram, t1: S.sehari, from: { p: [-259, 1.0, 1], h: 38 }, to: { p: [-259, 1.0, 1], h: 34 }, dir: ISO, night: 0 },
  // bandar line 10: airport + warehouse, line 11: supermarket shelves
  { t0: S.bandar, t1: L(11)[0] - 0.15, from: { p: [-10, 0, -30], h: 120 }, to: { p: [-32, 1, -40], h: 60 }, dir: ISO, night: 0.35 },
  { t0: L(11)[0] - 0.15, t1: S.awan, from: { p: [30, 1.5, 19], h: 30 }, to: { p: [29, 1.8, 19], h: 22 }, dir: ISO, night: 0.45 },
  // kabel: coast cross-section, then close-up of the cable next to a garden hose
  { t0: S.kabel, t1: WD(13, "Saiz") - 0.2, from: { p: [262, -8, 0], h: 46 }, to: { p: [264, -9, 0], h: 40 }, dir: [1, 0.42, 1.25], night: 0 },
  { t0: WD(13, "Saiz") - 0.2, t1: S.jerung, from: { p: [270, -13.2, 1], h: 9 }, to: { p: [270.5, -13.3, 1], h: 7 }, dir: [1, 0.55, 1.25], night: 0 },
  // sauh: shark, ship + anchor, cable breaks, island goes dark
  { t0: S.sauh, t1: S.akhir, from: { p: [268, -9.5, 0], h: 36 }, to: { p: [262, -7.5, 0], h: 50 }, dir: [1, 0.42, 1.25], night: 0 },
];
const VIS = [[hookCut, S.tidur], [S.jam, S.dompet], [S.fakta, S.sehari], [S.bandar, S.awan], [S.kabel, S.jerung], [S.sauh, S.akhir]];
// hook tail and minit overlap: minit wins once it starts
function shotAt(t) {
  let s = null;
  for (const x of SHOTS) if (t >= x.t0 && t < x.t1) s = x;
  return s || SHOTS[0];
}
const tmp = new THREE.Vector3();
function frame(s, t) {
  const k = ease((t - s.t0) / Math.max(0.01, s.t1 - s.t0)) * 0.6 + clamp01((t - s.t0) / Math.max(0.01, s.t1 - s.t0)) * 0.4;
  const p = s.from.p.map((v, i) => lerp(v, s.to.p[i], k)), h = lerp(s.from.h, s.to.h, k);
  const target = new THREE.Vector3(...p);
  const d = tmp.set(...s.dir).normalize();
  cam.position.copy(target).addScaledVector(d, 400);
  cam.up.set(0, 1, 0); cam.lookAt(target);
  const w = h * W / H;
  cam.left = -w / 2; cam.right = w / 2; cam.top = h / 2; cam.bottom = -h / 2; cam.updateProjectionMatrix();
  // shadow camera follows the framed area
  sun.position.copy(target).add(new THREE.Vector3(-40, 60, 25)); sun.target.position.copy(target);
  const sc = sun.shadow.camera, r = Math.max(h, w) * 0.85;
  sc.left = -r; sc.right = r; sc.top = r; sc.bottom = -r; sc.near = 1; sc.far = 220; sc.updateProjectionMatrix();
  return h;
}

// ---------------------------------------------------------------- world state at t
function state(t) {
  // town lights / darkness: the internet-less world gets darker and quieter
  const s = shotAt(t);
  const night = s.night;
  scene.background.copy(DAY).lerp(NIGHT, night * 0.85);
  if (s.dir !== ISO) scene.background.copy(SEA);
  hemi.intensity = lerp(1.1, 0.55, night); sun.intensity = lerp(2.6, 1.1, night);

  // hook tail: ring of lights switching off from the centre
  const ringR = t < S.minit ? lerp(0, 140, span(t, WD(2, "seluruh"), S.minit - 0.1)) : (t > S.fakta ? 999 : 0);
  town.setWindows((x, z, seed) => {
    if (t < S.minit) return Math.hypot(x, z) > ringR;
    if (t < S.fakta) return seed > 0.25;                  // daytime: some offices lit
    return seed > lerp(0.3, 0.8, span(t, S.fakta, S.awan)); // later: more buildings dark
  });

  // ---- minit: chat bubbles over the customers turn grey and fall, clocks appear
  const m0 = S.minit;
  town.people.forEach((p, i) => {
    const b = p.bubble, c = p.clock, ph = i * 0.37;
    const greyAt = WD(3, "senyap") + i * 0.18;  // "Semua senyap."
    const fallAt = greyAt + 0.25;
    b.visible = t >= m0 && t < m0 + 30;
    const up = 2.95 + Math.sin((t + ph) * 2.2) * 0.08;
    const fall = clamp01((t - fallAt) / 0.7);
    b.position.set(p.x, up - fall * fall * 2.6, p.z);
    b.material.opacity = 1 - clamp01((t - fallAt - 0.45) / 0.3);
    b.material.color.setRGB(...(t >= greyAt ? [0.55, 0.58, 0.62] : [1, 1, 1]));
    b.material.map = t >= greyAt ? K.TEX.bubbleGrey : K.TEX.bubble;
    const clockAt = WD(3, "ikon") + i * 0.12;         // "...ikon jam je yang bergerak"
    c.visible = t >= clockAt && t < S.tidur + 1;
    c.material.rotation = -(t - clockAt) * 2.5;
    const pop = Math.min(1, (t - clockAt) / 0.2);
    c.scale.setScalar(0.95 * K.backOut(pop));
    c.position.set(p.x, 2.7 + Math.sin((t + ph) * 2.4) * 0.06, p.z);
    p.look(Math.sin(t * 1.3 + ph) * 0.15);
  });
  town.router.material.emissive.setHex(t < L(2)[0] ? 0x22c55e : 0x3a0a0a);

  // ---- jam: card terminal red, CASH ONLY sign pops, ATM queue walks in
  const j0 = S.jam;
  town.terminal.screen.material.emissive.setHex(t >= WD(5, "QR") ? 0xff2a3a : 0x22c55e);
  const kx = WD(5, "kad"); town.terminal.x.visible = t >= WD(5, "QR") + 0.3 && (Math.floor((t - j0) * 3) % 2 === 0 || t >= kx);
  const ca = WD(5, "cash") - 0.1; const cs = K.backOut(clamp01((t - ca) / 0.45));
  town.cashSign.scale.set(cs * 4.2, cs * 2.1, 1); town.cashSign.visible = t >= ca;
  town.queue.forEach((q, i) => {
    const a = j0 + 0.8 + i * 0.45, k = ease((t - a) / 1.3);
    q.obj.position.set(lerp(q.sx, q.ex, k), 0, lerp(q.sz, q.ez, k));
    q.obj.visible = t >= a - 0.01;
    q.walk(t - a, k < 1);
  });

  // ---- bandar: planes grounded (red board), trucks stopped with "!", lorries confused "?"
  town.board.material.map = t >= WD(10, "flight") ? K.TEX.boardRed : K.TEX.boardOk;
  town.alerts.forEach((a, i) => {
    const at = (a.kind === "?" ? WD(11, "Lori") : WD(10, "flight") + 0.2) + i * 0.25;
    a.sprite.visible = t >= at && t < S.awan;
    a.sprite.scale.setScalar(a.size * K.backOut(clamp01((t - at) / 0.3)));
    a.sprite.position.y = a.y + Math.sin(t * 3 + i) * 0.3;
  });
  // shelves empty out during line 11
  const r0 = WD(11, "Rak") - 0.2; town.goods.forEach((g) => { g.mesh.visible = t < r0 + g.seed * (L(11)[1] - r0 + 0.2); });

  // ---- telegram migration: 48 people walk green -> blue
  mig.walkers.forEach((w, i) => {
    const a = WD(8, "tujuh") - 0.3 + w.seed * 3.0, k = ease((t - a) / 1.5);
    const x = lerp(w.sx, w.ex, k), z = lerp(w.sz, w.ez, k), hop = Math.sin(k * Math.PI) * 1.2;
    w.obj.position.set(x, hop, z); w.walk(t - a, k > 0 && k < 1);
  });
  mig.blueGlow.material.emissiveIntensity = lerp(0.2, 1.4, span(t, S.telegram + 1, S.telegram + 4.5));
  mig.greenGlow.material.emissiveIntensity = lerp(1.0, 0.15, span(t, S.telegram + 1, S.telegram + 4.5));

  // ---- sea block: data pulses along the cable; hose for scale; shark, ship, anchor, break, blackout
  sea.update(t, {
    hoseAt: WD(13, "hos") - 0.15, hoseEnd: S.jerung,
    sharkFrom: S.sauh - 0.1, sharkTo: WD(15, "kes") + 0.4,
    shipAt: WD(15, "Yang") - 0.6, anchorAt: WD(15, "sauh") - 0.3, breakAt: WD(15, "nelayan") + 0.35,
    darkAt: WD(15, "terputus") - 0.1, end: S.akhir,
  });
}

function draw(t) {
  const wrap = document.getElementById("iso-wrap");
  let op = 0;
  for (const [a, b] of VIS) op = Math.max(op, Math.min(clamp01((t - a + 0.18) / 0.18), clamp01((b + 0.18 - t) / 0.18)));
  wrap.style.opacity = op.toFixed(3);
  if (op <= 0) { renderer.clear(); return; }
  const s = shotAt(t);
  frame(s, t);
  state(t);
  renderer.render(scene, cam);
}
window.YA_ISO = { draw };
window.addEventListener("hf-seek", (e) => draw(e.detail.time));
window.__hf = window.__hf || {}; window.__hf.buildReady = window.__hf.buildReady || {};
window.__hf.buildReady.iso = renderer.compileAsync ? renderer.compileAsync(scene, cam).catch(() => {}) : Promise.resolve();
draw(0);
