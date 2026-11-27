// Isometric 3D world for "Apa Jadi Kalau Semua Apps Dalam Phone Kau Hilang?".
// Pure function of timeline time: draw(t) runs on every hf-seek with absolute seconds.
import * as THREE from "../vendor/three.module.js";
import * as K from "./kit.js";
import { buildRoom, buildStack, buildServerBlock, placeIcon, ICON, TX } from "./phone.js";

const T = window.YA_T, S = T.scenes, L = (n) => T.lines[n];
const WD = (n, w) => { const x = T.words[n].find((v) => v[0].toLowerCase().startsWith(w.toLowerCase())); if (!x) throw new Error("word " + n + " " + w); return x[1]; };
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
scene.background = new THREE.Color("#cfe8f7");
const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, -500, 1500);
const hemi = new THREE.HemisphereLight("#e3f1ff", "#7a6a5a", 1.15); scene.add(hemi);
const sun = new THREE.DirectionalLight("#ffe0b0", 2.5); sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.02;
scene.add(sun); scene.add(sun.target);

// ---------------------------------------------------------------- worlds
const RO = new THREE.Vector3(0, 0, 400), SO = new THREE.Vector3(-300, 0, 0), SV = new THREE.Vector3(300, 0, 0);
const town = K.buildTown(THREE, scene);
town.people.forEach((p) => { p.bubble.visible = false; p.clock.visible = false; });
town.queue.forEach((q) => (q.obj.visible = false));
town.terminal.x.visible = false; town.cashSign.visible = false;
const room = buildRoom(scene, RO);
const phone = room.phone;
const stack = buildStack(scene, SO);
const srv = buildServerBlock(scene, SV);

// street: people stuck staring at empty phones, an e-hailing car that never comes
const street = [];
[[-6, 4.6], [-3.5, 4.4], [3, 4.6], [5.5, 4.3], [8, 4.7], [-14, 4.5], [13, 4.4], [17.5, 4.6]].forEach(([x, z], i) => {
  const p = K.person(60 + i); p.obj.position.set(x, 0, z); p.obj.rotation.y = 0.5 + (i % 3) * 0.6; scene.add(p.obj);
  const q = K.sprite(K.TEX.what, 1.5, scene); q.position.set(x, 3.0, z); q.visible = false;
  street.push({ p, q, i });
});
const car = new THREE.Group(); car.position.set(1, 0, 8.6); car.rotation.y = 0; scene.add(car);
K.box(4.2, 1.1, 2.0, K.std("#F5F7FA"), 0, 0.85, 0, car); K.box(2.4, 0.9, 1.8, K.std("#0B3A8A"), -0.2, 1.85, 0, car);
for (const [x, z] of [[-1.4, 1], [-1.4, -1], [1.4, 1], [1.4, -1]]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.3, 12), K.std("#111827")); w.rotation.x = Math.PI / 2; w.position.set(x, 0.42, z); car.add(w); }
const carQ = K.sprite(K.TEX.what, 2.0, scene); carQ.position.set(1, 4.2, 8.6); carQ.visible = false;
// city: every phone in town loses its icons (they rise into the sky)
const KINDS = Object.keys(ICON).filter((k) => !["phone", "cam", "gear"].includes(k));
const sky = [];
{ const r = K.rng(4040);
  for (let i = 0; i < 140; i++) {
    const s = K.sprite(ICON[KINDS[Math.floor(r() * KINDS.length)]], 2.2 + r() * 1.6, scene); s.visible = false;
    sky.push({ s, x: (r() - 0.5) * 150, z: (r() - 0.6) * 140, y0: 2 + r() * 16, d: r(), vx: (r() - 0.5) * 6 });
  } }

// ---------------------------------------------------------------- shots
const ISO = [1, 0.82, 1], FRONT = [1, 0.55, 1];
const P = phone.group.position.clone();
const streetAt = L(3)[1] + 0.35, cityAt = WD(4, "satu") - 0.45;
const SHOTS = [
  { t0: 0, t1: S.setup, from: { p: P.toArray(), h: 27 }, to: { p: P.toArray(), h: 23 }, dir: FRONT, fy: 0.2, bg: "#cfe8f7" },
  { t0: S.setup, t1: S.trigger, from: { p: RO.clone().add(new THREE.Vector3(-1, 4.5, -1)).toArray(), h: 36 }, to: { p: RO.clone().add(new THREE.Vector3(-0.5, 4.5, -1)).toArray(), h: 31 }, dir: ISO, fy: 0.02, bg: "#cfe8f7" },
  { t0: S.trigger, t1: streetAt, from: { p: P.toArray(), h: 18 }, to: { p: P.toArray(), h: 16.5 }, dir: [1, 0.3, 1], fy: 0.1, bg: "#cfe8f7" },
  { t0: streetAt, t1: cityAt, from: { p: [6, 1.5, 5], h: 28 }, to: { p: [0, 1.5, 5], h: 25 }, dir: ISO, fy: 0.0, bg: "#9fd3f5" },
  { t0: cityAt, t1: S.hidup, from: { p: [0, 2, 0], h: 45 }, to: { p: [0, 10, -10], h: 150 }, dir: ISO, fy: 0.0, bg: "#9fd3f5" },
  { t0: S.hidup, t1: S.os, from: { p: P.toArray(), h: 24 }, to: { p: P.toArray(), h: 20 }, dir: FRONT, fy: 0.05, bg: "#0f2a55" },
  { t0: S.os, t1: S.server, from: { p: SO.clone().add(new THREE.Vector3(0, 3, 0)).toArray(), h: 25 }, to: { p: SO.clone().add(new THREE.Vector3(0, 3, 0)).toArray(), h: 20.5 }, dir: ISO, fy: -0.1, bg: "#0B1E3F" },
  { t0: S.server, t1: S.balik, from: { p: SV.clone().add(new THREE.Vector3(0.5, 4, -0.5)).toArray(), h: 50 }, to: { p: SV.clone().add(new THREE.Vector3(0.5, 4, -0.5)).toArray(), h: 46 }, dir: ISO, fy: -0.04, bg: "#0f2a55" },
  { t0: S.balik, t1: S.akhir + 1, from: { p: P.toArray(), h: 25 }, to: { p: P.toArray(), h: 22.5 }, dir: FRONT, fy: 0.2, bg: "#cfe8f7" },
];
const VIS = [[0, S.akhir]];
function shotAt(t) { let s = SHOTS[0]; for (const x of SHOTS) if (t >= x.t0) s = x; return s; }
const tmp = new THREE.Vector3();
function frame(s, t) {
  const u = clamp01((t - s.t0) / Math.max(0.01, s.t1 - s.t0)), k = ease(u) * 0.6 + u * 0.4;
  const p = s.from.p.map((v, i) => lerp(v, s.to.p[i], k)), h = lerp(s.from.h, s.to.h, k);
  const target = new THREE.Vector3(...p); target.y -= s.fy * h;
  const d = tmp.set(...s.dir).normalize();
  cam.position.copy(target).addScaledVector(d, 400); cam.up.set(0, 1, 0); cam.lookAt(target);
  const w = h * W / H; cam.left = -w / 2; cam.right = w / 2; cam.top = h / 2; cam.bottom = -h / 2; cam.updateProjectionMatrix();
  sun.position.copy(target).add(new THREE.Vector3(-35, 60, 30)); sun.target.position.copy(target);
  const sc = sun.shadow.camera, r = Math.max(h, w) * 0.85;
  sc.left = -r; sc.right = r; sc.top = r; sc.bottom = -r; sc.near = 1; sc.far = 240; sc.updateProjectionMatrix();
  scene.background.set(s.bg);
}

// ---------------------------------------------------------------- world state at t
const order = phone.icons.filter((i) => !i.system).map((ic, n) => ({ ic, o: (n * 7) % 21 }));
const W3 = { chat: WD(3, "chat"), card: WD(3, "bayar"), pin: WD(3, "jalan"), all: WD(3, "Semua"), empty: WD(3, "Kosong") };
const W6 = { kedai: WD(6, "kedai"), os: WD(6, "OS"), tapak: WD(6, "tapak") };
const W7 = { duit: WD(7, "Duit"), akaun: WD(7, "akaun"), semua: WD(7, "Semua"), server: WD(7, "server") };
function state(t) {
  // ---- icons leave (hook) and come back (balik)
  order.forEach(({ ic, o }) => {
    const out = 0.2 + o * 0.085, back = S.balik + 0.45 + o * 0.2;
    const k = t < S.balik ? clamp01((t - out) / 1.3) : clamp01(1 - (t - back) / 0.9);
    placeIcon(ic, k, t);
  });
  // ---- trigger: tap chat / bayar / jalan -> ghost + X; "Semua takde" -> every slot outlined; "Kosong" -> fade
  const trig = t >= S.trigger && t < streetAt;
  phone.icons.forEach((ic) => {
    const tg = { chat: W3.chat, card: W3.card, pin: W3.pin }[ic.kind];
    let g = 0, sl = 0;
    if (trig && tg !== undefined) g = 0.45 * clamp01((t - tg) / 0.2);
    if (trig && !ic.system && t >= W3.all - 0.1) sl = (0.4 + 0.4 * (Math.floor((t - W3.all) * 6) % 2)) * (1 - clamp01((t - W3.empty - 0.2) / 0.4));
    if (trig && t >= W3.empty) g *= 1 - clamp01((t - W3.empty) / 0.4);
    ic.ghost.material.opacity = g; ic.slot.material.opacity = sl;
  });
  for (const [k, x] of Object.entries(phone.xs)) {
    const at = W3[k] + 0.3; x.visible = trig && t >= at && t < W3.empty + 0.4;
    x.scale.setScalar(K.backOut(clamp01((t - at) / 0.25)));
  }
  const dim = t >= W3.empty && t < S.hidup ? lerp(1, 0.5, clamp01((t - W3.empty) / 0.4)) : (t >= S.hidup && t < S.os ? lerp(0.5, 1, clamp01((t - WD(5, "hidup") + 0.2) / 0.4)) : 1);
  phone.wall.material.color.setScalar(dim);
  // ---- hidup: status bar goes green, pulse rings
  const alive = t >= WD(5, "hidup") - 0.2 && t < S.os;
  phone.status.material.map = alive ? TX.statusG : TX.statusW;
  phone.rings.forEach((r, i) => {
    if (!alive) { r.material.opacity = 0; return; }
    const ph = ((t - WD(5, "hidup") + 0.2) * 0.8 + i * 0.5) % 1;
    r.scale.setScalar(1 + ph * 6); r.material.opacity = 0.8 * (1 - ph);
  });
  // tiny person looks between phone and window
  room.person.look(Math.sin(t * 0.9) * 0.4);

  // ---- street + city
  street.forEach(({ p, q, i }) => {
    const at = streetAt + 0.3 + i * 0.28; q.visible = t >= at && t < S.hidup;
    q.scale.setScalar(1.5 * K.backOut(clamp01((t - at) / 0.3))); q.position.y = 3.0 + Math.sin(t * 3 + i) * 0.15;
    p.look(Math.sin(t * 1.1 + i) * 0.2);
  });
  carQ.visible = t >= streetAt + 1.2 && t < S.hidup; carQ.scale.setScalar(2.0 * K.backOut(clamp01((t - streetAt - 1.2) / 0.3)));
  town.setWindows((x, z, seed) => seed > 0.55);
  const c0 = cityAt;
  sky.forEach((o) => {
    const a = c0 + o.d * 2.6, dt = t - a;
    o.s.visible = dt > 0 && t < S.hidup && dt < 4;
    if (!o.s.visible) return;
    o.s.position.set(o.x + o.vx * dt, o.y0 + dt * 16 + dt * dt * 4, o.z);
    o.s.material.opacity = 1 - clamp01((dt - 2.6) / 1.2);
  });

  // ---- OS exploded view
  const sep = span(t, S.os + 0.1, S.os + 1.3);
  stack.os.position.y = lerp(0.7, 4.2, sep);
  stack.osMat.emissiveIntensity = t < W6.os - 0.1 ? 0.25 : 0.9 + 0.5 * Math.sin((t - W6.os) * 6) * Math.exp(-(t - W6.os) * 0.4) + 0.3;
  stack.shops.forEach((s, i) => {
    const on = W6.kedai - 0.15 + i * 0.1, off = W6.os - 0.35 + i * 0.07;
    const k = K.backOut(clamp01((t - on) / 0.35));
    const lift = clamp01((t - off) / 0.7);
    s.visible = t >= on && lift < 1;
    s.scale.setScalar(Math.max(0.001, k * (1 - lift * 0.6)));
    s.position.y = 0.3 + lift * lift * 14;
    s.rotation.y = lift * 2;
  });

  // ---- server: pulses along the arc, money + account travel into the data centre
  const sv = t >= S.server && t < S.balik;
  srv.tube.material.opacity = sv ? 0.55 * span(t, S.server, S.server + 0.6) : 0;
  srv.pulses.forEach((s, i) => {
    s.visible = sv && t > S.server + 0.4;
    if (s.visible) s.position.copy(srv.curve.getPoint(((t - S.server) * 0.55 + i / 10) % 1));
  });
  const fly = (spr, appear, go, dx) => {
    spr.visible = sv && t >= appear;
    if (!spr.visible) return;
    const pop = K.backOut(clamp01((t - appear) / 0.3)), u = ease((t - go) / 1.1);
    const p = srv.curve.getPoint(Math.max(0, Math.min(1, u)));
    spr.position.copy(p).add(new THREE.Vector3(dx * (1 - u) + dx * 0.6 * u, 3.2 + Math.sin(t * 3) * 0.2 + u * 2.4, 0));
    spr.scale.setScalar((spr === srv.coin ? 4.6 : 5.2) * pop);
  };
  fly(srv.coin, W7.duit - 0.1, W7.semua - 0.2, -1.8); fly(srv.acct, W7.akaun - 0.1, W7.semua + 0.05, 1.8);
  srv.rackMat.emissiveIntensity = t >= W7.server - 0.1 ? 0.6 + 0.9 * Math.abs(Math.sin((t - W7.server) * 5)) : 0.6;
}

function draw(t) {
  const wrap = document.getElementById("iso-wrap");
  let op = 0;
  for (const [a, b] of VIS) op = Math.max(op, Math.min(a <= 0 ? 1 : clamp01((t - a + 0.18) / 0.18), clamp01((b + 0.2 - t) / 0.2)));
  wrap.style.opacity = op.toFixed(3);
  if (op <= 0) { renderer.clear(); return; }
  frame(shotAt(t), t);
  state(t);
  renderer.render(scene, cam);
}
window.YA_ISO = { draw };
window.addEventListener("hf-seek", (e) => draw(e.detail.time));
window.__hf = window.__hf || {}; window.__hf.buildReady = window.__hf.buildReady || {};
window.__hf.buildReady.iso = renderer.compileAsync ? renderer.compileAsync(scene, cam).catch(() => {}) : Promise.resolve();
draw(0);
