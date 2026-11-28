// Isometric 3D world for "Apa Jadi Kalau Semua Satelit GPS Berhenti Berfungsi?".
// Pure function of timeline time: draw(t) runs on every hf-seek with absolute seconds.
import * as THREE from "../vendor/three.module.js";
import * as K from "./kit.js";
import { buildSpace, buildMapWorld, buildTaman, buildSea, buildSky, buildGridStrip, buildReveal, setBeam, GT } from "./gps.js";

const T = window.YA_T, S = T.scenes;
const WD = (n, w) => { const x = T.words[n].find((v) => v[0].toLowerCase().startsWith(w.toLowerCase())); if (!x) throw new Error("word " + n + " " + w); return x[1]; };
const clamp01 = (x) => Math.max(0, Math.min(1, x));
const ease = (x) => { x = clamp01(x); return x * x * (3 - 2 * x); };
const lerp = (a, b, k) => a + (b - a) * k;
const span = (t, a, b) => ease((t - a) / (b - a));
const V = (x, y, z) => new THREE.Vector3(x, y, z);

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
const SP = V(0, 0, -1000), MP = V(0, 0, 0), TM = V(400, 0, 0), SE = V(400, 0, 300), SK = V(400, 40, 600), GS = V(-400, 0, 0), RV = V(0, 0, 1000);
const space = buildSpace(scene, SP), map = buildMapWorld(scene, MP), taman = buildTaman(scene, TM);
const sea = buildSea(scene, SE), sky = buildSky(scene, SK), strip = buildGridStrip(scene, GS), rev = buildReveal(scene, RV);
// trilateration wavefronts: 3 rings per map satellite, billboarded circles
const rings = map.sats.map(() => [0, 1, 2].map(() => {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.MeshBasicMaterial({ map: GT.ring, transparent: true, toneMapped: false, depthWrite: false, side: THREE.DoubleSide }));
  m.visible = false; scene.add(m); return m;
}));

// ---------------------------------------------------------------- key times
const tk = {
  maps: WD(1, "Maps") - 0.15, tak: WD(1, "tak") - 0.1, korang: WD(1, "korang") - 0.1, mana: WD(1, "mana"),
  tapi2: WD(2, "tapi") - 0.1, jadi: WD(2, "jadi"), besar: WD(2, "besar"), agak: WD(2, "agak"),
  sebab3: WD(3, "sebab") - 0.1, tak3: WD(3, "tak"),
  tunggu: WD(4, "tunggu"), simpang: WD(4, "simpang"), salah: WD(4, "salah"),
  pilot: WD(5, "pilot") - 0.1, semua5: WD(5, "semua") - 0.1, cara: WD(5, "cara"),
  silap: WD(7, "Silap"), bukan7: WD(7, "bukan") - 0.1, tapi7: WD(7, "Tapi"), jam7: WD(7, "jam"),
  bank: WD(9, "bank") - 0.1, grid: WD(9, "grid") - 0.1, semua9: WD(9, "semua") - 0.15, lama: WD(9, "Lama") - 0.1, lari: WD(9, "lari"),
  bukan10: WD(10, "bukan") - 0.1, jam10: WD(10, "jam"), tepat: WD(10, "tepat"),
  phone11: WD(11, "phone") - 0.1, dengar: WD(11, "dengar"), kira: WD(11, "kira") - 0.2, dari: WD(11, "dari") - 0.1, tahu: WD(11, "tahu"), mana11: WD(11, "mana"),
};

// ---------------------------------------------------------------- shots
const ISO = [1, 0.82, 1];
const D0 = map.dot.position.clone().add(MP);
const SHOTS = [
  { t0: 0, from: { p: SP.clone(), h: 130 }, to: { p: SP.clone(), h: 96 }, dir: [0.35, 0.55, 1], fy: 0, bg: "#050b1e", night: 0.2 },
  { t0: tk.maps, from: { p: D0.clone(), h: 34 }, to: { p: D0.clone(), h: 22 }, dir: ISO, fy: 0.05, bg: "#cfe8f7" },
  { t0: tk.tak, from: { p: SP.clone(), h: 100 }, to: { p: SP.clone(), h: 90 }, dir: [-0.4, 0.5, 1], fy: 0, bg: "#050b1e", night: 0.3 },
  { t0: tk.korang, from: { p: D0.clone(), h: 21 }, to: { p: D0.clone(), h: 17 }, dir: ISO, fy: 0.05, bg: "#cfe8f7" },
  { t0: S.bulatan, from: { p: D0.clone(), h: 13 }, to: { p: D0.clone(), h: 15 }, dir: [1, 0.95, 0.65], fy: 0.02, bg: "#cfe8f7" },
  { t0: tk.tapi2, from: { p: D0.clone(), h: 18 }, to: { p: D0.clone(), h: 52 }, dir: ISO, fy: 0.04, bg: "#cfe8f7" },
  { t0: S.rider, follow: "rider", h0: 22, h1: 19, dir: ISO, fy: 0, bg: "#d7f0c8" },
  { t0: tk.sebab3, from: { p: TM.clone().add(V(0, 0, 2)), h: 56 }, to: { p: TM.clone().add(V(0, 0, 2)), h: 62 }, dir: ISO, fy: 0, bg: "#d7f0c8" },
  { t0: S.grab, from: { p: TM.clone().add(V(25, 0, -13)), h: 36 }, to: { p: TM.clone().add(V(25, 0, -14)), h: 31 }, dir: [1, 0.9, 0.8], fy: 0, bg: "#d7f0c8" },
  { t0: S.laut, from: { p: SE.clone().add(V(0, 2, 0)), h: 28 }, to: { p: SE.clone().add(V(1, 2, 0)), h: 23 }, dir: ISO, fy: 0, bg: "#7cc4f5" },
  { t0: tk.pilot, follow: "jet", h0: 24, h1: 20, dir: [0.6, 0.45, 1], fy: 0, bg: "#7cc4f5" },
  { t0: tk.semua5, from: { p: SE.clone().add(V(-4, 4, 3)), h: 22 }, to: { p: SE.clone().add(V(-4, 4, 3)), h: 18 }, dir: ISO, fy: 0, bg: "#5aa8e6" },
  { t0: S.ingat, from: { p: TM.clone(), h: 66 }, to: { p: TM.clone(), h: 84 }, dir: ISO, fy: 0, bg: "#9fb8cc", night: 0.35 },
  { t0: S.twist, from: { p: D0.clone(), h: 70 }, to: { p: D0.clone(), h: 34 }, dir: ISO, fy: 0, bg: "#cfe8f7", shake: [WD(7, "Silap"), 0.5, 1.2], zoomEase: 3 },
  { t0: tk.bukan7, from: { p: MP.clone().add(V(0, 4, 0)), h: 62 }, to: { p: MP.clone().add(V(0, 8, 0)), h: 70 }, dir: ISO, fy: -0.02, bg: "#0f2a55", night: 0.4, shake: [WD(7, "jam") + 0.1, 0.6, 1.4] },
  { t0: S.jam, from: { p: MP.clone().add(V(0, 12, 0)), h: 40 }, to: { p: MP.clone().add(V(0, 12, 0)), h: 36 }, dir: ISO, fy: 0.22, bg: "#0f2a55", night: 0.4 },
  { t0: S.lari, from: { p: GS.clone().add(V(-20, 9, 0)), h: 26 }, to: { p: GS.clone().add(V(-20, 9, 0)), h: 23 }, dir: ISO, fy: 0, bg: "#cfe8f7" },
  { t0: tk.bank, from: { p: GS.clone().add(V(0, 5, 1)), h: 24 }, to: { p: GS.clone().add(V(0.5, 5, 1)), h: 21 }, dir: [1, 0.7, 1.1], fy: 0, bg: "#e6f2fb" },
  { t0: tk.grid, from: { p: GS.clone().add(V(20, 6, 0)), h: 26 }, to: { p: GS.clone().add(V(20, 6, 0)), h: 23 }, dir: ISO, fy: 0, bg: "#cfe8f7" },
  { t0: tk.semua9, from: { p: GS.clone().add(V(0, 14, 0)), h: 66 }, to: { p: GS.clone().add(V(0, 14, 0)), h: 60 }, dir: [0.9, 0.55, 1], fy: 0, bg: "#cfe8f7" },
  { t0: tk.lama, from: { p: GS.clone().add(V(0, 12, 0)), h: 72 }, to: { p: GS.clone().add(V(0, 11, 0)), h: 68 }, dir: [0.9, 0.55, 1], fy: 0, bg: "#3a1622", night: 0.55, shake: [WD(9, "lari"), 0.35, 0.9] },
  { t0: S.reveal, from: { p: RV.clone(), h: 34 }, to: { p: RV.clone(), h: 28 }, orbit: [0.2, 0.8], fy: 0, bg: "#050b1e", night: 0.25 },
  { t0: tk.bukan10, from: { p: RV.clone(), h: 30 }, to: { p: RV.clone(), h: 34 }, orbit: [0.8, 1.6], fy: 0, bg: "#050b1e", night: 0.25 },
  { t0: tk.jam10 - 0.3, from: { p: RV.clone().add(V(0, 3, 0)), h: 22 }, to: { p: RV.clone().add(V(0, 4, 0)), h: 16 }, orbit: [1.6, 2.0], fy: 0, bg: "#050b1e", night: 0.25 },
  { t0: S.kira, from: { p: MP.clone().add(V(0, 15, 0)), h: 76 }, to: { p: MP.clone().add(V(0, 15, 0)), h: 70 }, dir: [1, 0.5, 1], fy: 0, bg: "#0f2a55", night: 0.3 },
  { t0: tk.phone11, from: { p: D0.clone(), h: 26 }, to: { p: D0.clone(), h: 21 }, dir: [1, 0.6, 1], fy: -0.1, bg: "#0f2a55", night: 0.3 },
  { t0: tk.kira, from: { p: MP.clone().add(V(0, 15, 0)), h: 74 }, to: { p: MP.clone().add(V(0, 15, 0)), h: 68 }, dir: [1, 0.5, 1], fy: 0, bg: "#0f2a55", night: 0.3 },
  { t0: tk.dari, from: { p: D0.clone(), h: 40 }, to: { p: D0.clone(), h: 14 }, dir: ISO, fy: 0.02, bg: "#cfe8f7" },
  { t0: S.akhir, from: { p: MP.clone().add(V(0, 6, 0)), h: 58 }, to: { p: MP.clone().add(V(0, 6, 0)), h: 50 }, dir: [1, 0.62, 1], fy: 0.2, bg: "#cfe8f7" },
];
SHOTS.forEach((s, i) => (s.t1 = i + 1 < SHOTS.length ? SHOTS[i + 1].t0 : T.total));
function shotAt(t) { let s = SHOTS[0]; for (const x of SHOTS) if (t >= x.t0) s = x; return s; }
window.YA_CUTS = SHOTS.map((s) => s.t0).filter((x) => x > 0);

function along(pts, u) {
  const segs = []; let tot = 0;
  for (let i = 1; i < pts.length; i++) { const l = pts[i].distanceTo(pts[i - 1]); segs.push(l); tot += l; }
  let d = clamp01(u) * tot;
  for (let i = 0; i < segs.length; i++) { if (d <= segs[i] || i === segs.length - 1) return pts[i].clone().lerp(pts[i + 1], Math.min(1, d / segs[i])); d -= segs[i]; }
  return pts[pts.length - 1].clone();
}
const riderEnd = tk.tak3 + 0.25, RIDE_U = 0.97;
const riderU = (t) => clamp01((t - S.rider + 0.2) / (riderEnd - S.rider + 0.2)) * RIDE_U;
const jetPos = () => SK.clone();

const camDir = new THREE.Vector3();
let shakeOff = new THREE.Vector3();
function frame(s, t) {
  const u = clamp01((t - s.t0) / Math.max(0.01, s.t1 - s.t0));
  const k = s.zoomEase ? 1 - Math.pow(1 - clamp01(u * 1.6), s.zoomEase) : ease(u) * 0.6 + u * 0.4;
  let target, h;
  if (s.follow === "rider") { target = along(taman.path, riderU(t)).add(TM).add(V(0, 1, 0)); h = lerp(s.h0, s.h1, k); }
  else if (s.follow === "jet") { target = jetPos().add(V(0, 0, 0)); h = lerp(s.h0, s.h1, k); }
  else { target = s.from.p.clone().lerp(s.to.p, k); h = lerp(s.from.h, s.to.h, k); }
  target.y -= s.fy * h;
  if (s.shake) {
    const [ts, amp, dur] = s.shake, e = t - ts;
    if (e > 0 && e < dur) { const a = amp * Math.exp(-e * 4) * h * 0.02; target.add(V(Math.sin(e * 61) * a, Math.sin(e * 47 + 1) * a, Math.cos(e * 53) * a)); }
  }
  if (s.orbit) { const a = lerp(s.orbit[0], s.orbit[1], u); camDir.set(Math.sin(a), 0.45, Math.cos(a)).normalize(); }
  else camDir.set(...s.dir).normalize();
  cam.position.copy(target).addScaledVector(camDir, 400); cam.up.set(0, 1, 0); cam.lookAt(target);
  const w = h * W / H; cam.left = -w / 2; cam.right = w / 2; cam.top = h / 2; cam.bottom = -h / 2; cam.updateProjectionMatrix();
  sun.position.copy(target).add(V(-35, 60, 30)); sun.target.position.copy(target);
  const sc = sun.shadow.camera, r = Math.max(h, w) * 0.85;
  sc.left = -r; sc.right = r; sc.top = r; sc.bottom = -r; sc.near = 1; sc.far = 260; sc.updateProjectionMatrix();
  scene.background.set(s.bg);
  const night = s.night || 0; hemi.intensity = lerp(1.15, 0.55, night); sun.intensity = lerp(2.5, 0.9, night);
}
const bill = (o) => o.quaternion.copy(cam.quaternion);
const pop = (t, a, d = 0.3) => Math.max(0.001, K.backOut(clamp01((t - a) / d)));

// ---------------------------------------------------------------- world state at t
function state(t) {
  // ---- space: satellites orbit; they die one by one on "tak tahu"
  space.update(t, (i) => (t >= tk.tak + 0.25 + i * 0.17 && t < S.reveal ? 0 : 1));
  space.sats.forEach((s) => (s.beam.visible = false));

  // ---- map: satellites + beams to the dot
  const mapOn = (i) => !(t >= tk.tak + 0.15 + i * 0.12 && t < S.kira + 0.1 + i * 0.15);
  map.sats.forEach((s, i) => {
    s.power(mapOn(i) ? 1 : 0); s.group.rotation.y = 0.6 + i + t * 0.15;
    const beamOn = (t < tk.tak + 0.15 + i * 0.12) || (t >= tk.dengar + (i - 1) * 0.35 && t < tk.kira && i > 0);
    s.beam.visible = beamOn && t >= tk.maps - 0.2;
    if (s.beam.visible) { setBeam(s.beam, s.p.clone().add(V(0, -1, 0)), map.dot.position.clone()); s.beam.material.opacity = 0.45 + 0.3 * Math.sin(t * 14 + i); }
  });
  // accuracy circle radius
  let R = 1.7;
  if (t >= tk.jadi && t < tk.tahu) R = lerp(1.7, 17, span(t, tk.jadi, tk.besar + 0.35));
  if (t >= tk.tahu) R = lerp(17, 1.7, span(t, tk.tahu - 0.1, tk.tahu + 0.5));
  map.acc.scale.setScalar(R); map.accEdge.scale.setScalar(R);
  map.acc.material.opacity = 0.18 + (R > 3 ? 0.06 * Math.sin(t * 5) : 0);
  // dot: steady, flickers when the signals die, wanders inside the circle while "agak-agak"
  const lost = t >= tk.tak + 0.3 && t < tk.tahu;
  let ox = 0, oz = 0;
  if (t >= tk.agak && t < tk.tahu) { const k = span(t, tk.agak, tk.agak + 0.4) * (1 - span(t, tk.tahu - 0.2, tk.tahu + 0.4)); ox = (Math.sin(t * 2.3) * 7 + Math.sin(t * 5.1) * 2) * k; oz = (Math.cos(t * 1.7) * 6 + Math.sin(t * 4.3) * 2) * k; }
  map.dot.position.set(ox, 1.0 + Math.sin(t * 3) * 0.12, oz);
  map.core.material.emissiveIntensity = lost && t < S.bulatan ? (Math.sin(t * 40) > 0 ? 0.9 : 0.05) : 0.6;
  const pk = ((t * 0.9) % 1); map.pulse.scale.setScalar(1 + pk * (R > 3 ? 1 : 2.5)); map.pulse.material.opacity = 0.6 * (1 - pk) * (lost && R > 3 ? 0.2 : 1);
  map.pulse.position.set(ox, 0.06, oz);
  const qOn = (t >= tk.mana - 0.15 && t < S.bulatan) || (t >= tk.agak + 0.2 && t < S.rider);
  map.what.visible = qOn; if (qOn) { map.what.position.copy(map.dot.position).add(V(0, 3.4, 0)); const a = t < S.bulatan ? tk.mana - 0.15 : tk.agak + 0.2; map.what.scale.setScalar(3 * pop(t, a)); }
  map.tick.visible = t >= tk.mana11 - 0.1 && t < S.akhir + 1.2;
  if (map.tick.visible) { map.tick.position.copy(map.dot.position).add(V(2.4, 3.2, 0)); map.tick.scale.setScalar(2.6 * pop(t, tk.mana11 - 0.1)); }
  // twist: map tiles break apart, a giant clock rises out of the hole
  const brk = t >= tk.bukan7 && t < S.kira;
  map.tiles.forEach((tl) => {
    if (!brk) { tl.g.position.set(tl.cx, 0, tl.cz); tl.g.rotation.set(0, 0, 0); tl.g.visible = true; return; }
    const a = WD(7, "bukan") + 0.1 + tl.d * 0.03 + tl.seed * 0.25, k = clamp01((t - a) / 1.3);
    const dir = V(tl.cx, 0, tl.cz).normalize();
    tl.g.position.set(tl.cx + dir.x * k * 26, Math.sin(k * Math.PI * 0.8) * 9 - k * k * 6, tl.cz + dir.z * k * 26);
    tl.g.rotation.set(k * (tl.seed - 0.5) * 3, k * tl.seed * 2, k * (0.5 - tl.seed) * 3);
    tl.g.visible = k < 0.98;
  });
  map.dot.visible = !brk; map.pulse.visible = map.acc.visible = map.accEdge.visible = !brk;
  const bc = map.bigClock; bc.group.visible = t >= tk.tapi7 - 0.2 && t < S.lari;
  if (bc.group.visible) {
    const k = clamp01((t - (tk.tapi7 - 0.2)) / 0.55);
    bc.group.position.set(0, lerp(-14, 12, K.backOut(k)), 0); bill(bc.group);
    const sp = t < tk.jam7 ? (t - 30) * 30 : 0; bc.set(600 + sp * 4 + Math.floor((t - tk.jam7) * 2) * 0.5, Math.floor(t * 2) * 6);
    bc.tint(0);
    const sq = t > tk.jam7 ? 1 + 0.14 * Math.exp(-(t - tk.jam7) * 6) * Math.sin((t - tk.jam7) * 32) : 1; bc.group.scale.setScalar(sq);
  }

  // ---- taman: rider circles the estate leaving a tangled trail; customer waits
  const u = riderU(t), rp = along(taman.path, u), rn = along(taman.path, Math.min(1, u + 0.004));
  taman.bike.position.copy(rp); const dx = rn.x - rp.x, dz = rn.z - rp.z; if (Math.hypot(dx, dz) > 1e-4) taman.bike.rotation.y = Math.atan2(-dz, dx);
  taman.bike.position.y = 0.1 + (u < RIDE_U && t > S.rider ? Math.abs(Math.sin(t * 18)) * 0.06 : 0);
  taman.trail.forEach((d, i) => { const ui = (i / taman.trail.length) * u; d.visible = t >= S.rider && ui < u - 0.004; if (d.visible) d.position.copy(along(taman.path, ui)).setY(0.18); });
  taman.custClock.material.rotation = -t * 5; taman.cust.look(Math.sin(t * 2) * 0.5);
  taman.homePin.position.y = 3.2 + Math.abs(Math.sin(t * 4)) * 0.5; taman.homePin.rotation.y = t * 2;
  taman.riderQ.visible = t >= tk.tak3 && t < S.twist;
  if (taman.riderQ.visible) { taman.riderQ.position.copy(taman.bike.position).add(V(0, 4.2, 0)); taman.riderQ.scale.setScalar(2.6 * pop(t, tk.tak3)); }
  // grab: car drives to the wrong corner, the pin hops to the right one
  const cu = span(t, S.grab - 0.3, tk.tunggu);
  taman.car.position.set(lerp(2, 21.5, cu), 0.05, -6.9); taman.car.rotation.y = 0;
  const pinA = V(21.5, 3.2, -6.9), pinB = V(28.4, 3.2, -20.4);
  const hop = clamp01((t - tk.salah) / 0.5);
  const pp = pinA.clone().lerp(pinB, ease(hop)); pp.y += Math.sin(hop * Math.PI) * 6 + (hop === 0 ? Math.abs(Math.sin(t * 7)) * 0.8 : Math.abs(Math.sin(t * 5)) * 0.3 * hop);
  taman.carPin.position.copy(pp); taman.carPin.rotation.y = t * 2; taman.carPin.visible = t >= S.grab - 0.3;
  taman.pax.obj.position.set(28.4, 0, -21.6); taman.pax.obj.rotation.y = -2.4 + Math.sin(t * 8) * 0.2; taman.paxBang.position.set(28.4, 3.8, -21.6);
  taman.paxBang.visible = t >= S.grab + 0.6; taman.paxBang.scale.setScalar(2 * pop(t, S.grab + 0.6));
  taman.carQ.visible = t >= tk.simpang && t < S.twist; if (taman.carQ.visible) { taman.carQ.position.copy(taman.car.position).add(V(0, 4, 0)); taman.carQ.scale.setScalar(2.6 * pop(t, tk.simpang)); }

  // ---- sea + sky
  sea.ship.rotation.z = Math.sin(t * 1.4) * 0.04; sea.ship.rotation.x = Math.sin(t * 1.1) * 0.03; sea.ship.position.y = Math.sin(t * 1.6) * 0.18;
  sea.ship.rotation.y = Math.sin(t * 0.7) * 0.5;
  sea.waves.forEach((w) => { w.w.position.x = ((w.x0 + t * 3 + 40) % 80 + 80) % 80 - 40; w.w.position.y = 0.05 + Math.max(0, Math.sin(t * 2 + w.ph)) * 0.12; });
  sea.compass.material.rotation = Math.sin(t * 3.1) * 2.4 + t * 3; sea.compass.position.set(sea.ship.position.x, 9, 0);
  sea.chart.visible = t >= tk.cara - 0.5 && t < S.ingat;
  if (sea.chart.visible) { sea.chart.position.copy(V(-7, 6.5, 5)); bill(sea.chart); sea.chart.scale.set(Math.max(0.001, ease((t - tk.cara + 0.5) / 0.45)), 1, 1); }
  sky.clouds.forEach((c) => { c.c.position.x = ((c.x0 - t * (14 + c.v) + 60) % 120 + 120) % 120 - 60; });
  sky.jet.rotation.x = Math.sin(t * 2.2) * 0.12; sky.jet.position.y = Math.sin(t * 1.5) * 0.4;
  sky.compass.position.set(0, 5.5, 0); sky.compass.material.rotation = -Math.sin(t * 2.7) * 2.6 - t * 4;

  // ---- strip: clocks synced by GPS, then drifting apart
  const tl0 = tk.lama + 0.3;
  strip.clocks.forEach((c, i) => {
    bill(c.group);
    const drift = t > tl0 ? Math.pow(t - tl0, 2) * [9, -6, 15][i] : 0;
    c.set(125 + t * 0.6 + drift, Math.floor(t * 2) * 6 + (t > tl0 ? drift * 7 : 0));
    c.tint(span(t, tl0 + 0.6, tl0 + 1.8));
    c.group.scale.setScalar(t > tl0 + 0.6 ? 1 + 0.06 * Math.sin(t * 20 + i) : 1);
  });
  strip.sat.power(t < tl0 - 0.1 || t >= S.reveal ? 1 : 0); strip.sat.group.rotation.y = t * 0.3;
  strip.beams.forEach((b, i) => {
    b.visible = t >= tk.semua9 + i * 0.12 && t < tl0 - 0.05 && !(t > tl0 - 0.35 && Math.sin(t * 60) > 0);
    if (b.visible) setBeam(b, strip.sat.group.position.clone().add(V(0, -1.4, 0)), strip.clocks[i].group.position.clone().add(V(0, 2.6, 0)));
  });
  strip.bars.material.map = t < tl0 + 1.0 ? GT.bars4 : GT.bars1; bill(strip.bars);
  strip.bars.scale.setScalar(t >= tl0 + 1.0 ? pop(t, tl0 + 1.0, 0.25) : 1);
  strip.people.forEach((p, i) => p.look(Math.sin(t * (t > tl0 ? 6 : 1.5) + i) * 0.5));
  strip.homes.forEach((h) => { h.wm.emissiveIntensity = t > tl0 + 1.3 ? (Math.sin(t * 23 + h.i * 3.3) > 0.2 ? 1.2 : 0.05) : 1.2; });
  strip.cubes.forEach((c, i) => {
    const jam = t > tl0 + 1.1;
    const tt = jam ? tl0 + 1.1 + (t - tl0 - 1.1) * 0.15 : t;
    const x = (((tt * 0.25 + c.off) % 1) * 15) - 7.5;
    c.c.position.set(x, 1.25 + (jam ? Math.abs(Math.sin(t * 9 + i)) * 0.8 : 0), 5.6);
    c.c.rotation.set(jam ? Math.sin(t * 7 + i) * 0.5 : 0, jam ? t * 2 + i : 0, 0);
    c.c.material.emissive.set(jam ? "#E23B3B" : ["#0066DE", "#22C55E", "#FF8A00"][i % 3]);
  });

  // ---- reveal: satellite opens up, atomic clock core inside
  const ex = span(t, tk.bukan10 + 0.2, tk.bukan10 + 1.4);
  rev.sat.group.rotation.y = t * 0.1;
  rev.sat.panels.forEach((p) => { p.p.position.x = p.x0 + p.sx * 5 * ex; p.arm.position.x = p.sx * (1.7 + 2.5 * ex); });
  rev.sat.bl.position.x = -0.55 - 2.2 * ex; rev.sat.br.position.x = 0.55 + 2.2 * ex; rev.sat.dish.position.y = -1.3 - 2.2 * ex;
  rev.sat.bl.position.z = rev.sat.br.position.z = 0;
  rev.core.scale.setScalar(Math.max(0.001, ex)); rev.core.position.y = -1.3 * ex;
  rev.rings.forEach((r, i) => { r.rotation.z = t * (1.4 + i * 0.5); });
  rev.electrons.forEach((e, i) => { const a = t * (3 + i) + i * 2, r = rev.rings[i]; e.position.set(Math.cos(a) * 1.9, Math.sin(a) * 1.9, 0).applyEuler(r.rotation).add(r.position); });
  const gl = t >= tk.tepat - 0.1 ? 1 + 0.4 * Math.exp(-(t - tk.tepat) * 2) * Math.abs(Math.sin((t - tk.tepat) * 8)) : 1;
  rev.glow.scale.setScalar(12 * gl); rev.nucleus.scale.setScalar(gl);
  rev.clock.group.visible = t >= tk.jam10 - 0.15 && t < S.kira;
  if (rev.clock.group.visible) { rev.clock.group.position.set(0, 9.5, 0); bill(rev.clock.group); rev.clock.group.scale.setScalar(pop(t, tk.jam10 - 0.15, 0.35)); rev.clock.set(125 + t * 0.6, Math.floor(t * 2) * 6); rev.clock.tint(0); }

  // ---- trilateration wavefronts (billboard circles; radius measured in the screen plane so they meet at the dot)
  const dotW = map.dot.position.clone().add(MP);
  const inPlane = (a, b) => { const d = b.clone().sub(a); return d.sub(camDir.clone().multiplyScalar(d.dot(camDir))).length(); };
  rings.forEach((rs, i) => {
    const sp = map.sats[i].p.clone().add(MP), Rd = inPlane(sp, dotW);
    rs.forEach((m, j) => {
      m.visible = false;
      let rad = 0, op = 0;
      if ((t >= S.kira && t < tk.kira) || t >= S.akhir) {            // periodic "masa" pulses
        const e = t - (t >= S.akhir ? S.akhir : S.kira) - j * 0.55 - i * 0.18;
        if (e > 0) { const ph = e % 1.65; rad = ph * 32; op = 1 - ph / 1.65; }
      } else if (t >= tk.kira && t < tk.tahu + 0.6 && j === 0) {     // one front per satellite, arriving at different times
        const arr = tk.kira + 0.5 + i * 0.32, k = clamp01((t - tk.kira - 0.1) / (arr - tk.kira - 0.1));
        rad = Rd * ease(k); op = t > tk.tahu ? 1 - clamp01((t - tk.tahu) / 0.6) : 1;
      }
      if (rad > 0.3 && op > 0.02) { m.visible = true; m.position.copy(sp); bill(m); m.scale.setScalar(rad); m.material.opacity = op * (t >= S.akhir ? 0.55 : 1); }
    });
  });
  // dot flashes as each front arrives
  if (t >= tk.kira && t < tk.tahu) {
    let f = 0; for (let i = 0; i < 4; i++) { const arr = tk.kira + 0.5 + i * 0.32; if (t > arr) f = Math.max(f, Math.exp(-(t - arr) * 6)); }
    map.core.material.emissiveIntensity = 0.6 + f * 2; map.dot.scale.setScalar(1 + f * 0.5);
  } else map.dot.scale.setScalar(t >= tk.tahu && t < tk.tahu + 0.5 ? 1 + 0.4 * Math.sin(clamp01((t - tk.tahu) / 0.5) * Math.PI) : 1);
}

function draw(t) {
  document.getElementById("iso-wrap").style.opacity = "1";
  frame(shotAt(t), t);
  state(t);
  renderer.render(scene, cam);
}
window.YA_ISO = { draw };
window.addEventListener("hf-seek", (e) => draw(e.detail.time));
window.__hf = window.__hf || {}; window.__hf.buildReady = window.__hf.buildReady || {};
window.__hf.buildReady.iso = renderer.compileAsync ? renderer.compileAsync(scene, cam).catch(() => {}) : Promise.resolve();
draw(0);
