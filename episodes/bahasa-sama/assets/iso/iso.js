// Isometric 3D world for "Apa Jadi Kalau Semua Developer Guna Bahasa Programming Yang Sama?".
// Pure function of timeline time: draw(t) runs on every hf-seek with absolute seconds.
import * as THREE from "../vendor/three.module.js";
import * as K from "./kit.js";
import { buildCore, buildOffice, buildStudent, buildScale, buildRace, buildHotPhone, buildSpaghetti, buildCity, buildToolbox, buildChip, buildFunnel, langCube, LANGS, CT } from "./code.js";

const T = window.YA_T, S = T.scenes;
const WD = (n, w) => { const x = T.words[n].find((v) => v[0].toLowerCase().startsWith(w.toLowerCase())); if (!x) throw new Error("word " + n + " " + w); return x[1]; };
const LAST = (n) => T.words[n][T.words[n].length - 1][1];
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
const CO = V(0, 0, -600), OF = V(0, 0, 0), ST = V(0, 0, 150), SC = V(0, 0, 300);
const RA = V(300, 0, 0), HP = V(300, 0, 150), SG = V(300, 0, 300);
const CI = V(-300, 0, 0), TB = V(-300, 0, 200), CH = V(-300, 0, 400), FU = V(-300, 0, 600);
const core = buildCore(scene, CO), office = buildOffice(scene, OF), stu = buildStudent(scene, ST), scale = buildScale(scene, SC);
const race = buildRace(scene, RA), hot = buildHotPhone(scene, HP), spag = buildSpaghetti(scene, SG);
const city = buildCity(scene, CI), tbx = buildToolbox(scene, TB), chip = buildChip(scene, CH), fun = buildFunnel(scene, FU);
const cityCube = new THREE.Mesh(core.one.geometry, core.one.material.clone()); cityCube.position.copy(CI).add(V(0, 4, 0)); cityCube.castShadow = true; scene.add(cityCube);
const cityGlow = K.sprite(CT.redGlow, 30, scene); cityGlow.position.copy(cityCube.position);
const orbitCubes = LANGS.map((L) => langCube(scene, L, 3));

// ---------------------------------------------------------------- key times
const tk = {
  py: WD(1, "Python") - 0.1, ja: WD(1, "Java") - 0.08, cp: WD(1, "C++") - 0.08, js: WD(1, "JavaScript") - 0.08,
  jadi: WD(1, "jadi") - 0.1, mA: WD(1, "satu") - 0.1, mB: WD(1, "bahasa"), je: WD(1, "je"),
  sebab2: WD(2, "sebab") - 0.1, faham: WD(2, "faham"),
  jap: WD(4, "jap"), laju4: WD(4, "laju"),
  game: WD(5, "game") - 0.1, lag: WD(5, "lag"), phone: WD(5, "phone") - 0.1, panas: WD(5, "panas"),
  code6: WD(6, "code") - 0.1, stud: WD(6, "Student") - 0.1, pening: WD(6, "pening"),
  bug: WD(7, "bug"), tu7: WD(7, "tu"), seluruh: WD(7, "seluruh") - 0.1, terkesan: WD(7, "terkesan"),
  macam: WD(8, "Macam") - 0.1, tukul: WD(8, "Tukul") - 0.1, untuk8: WD(8, "untuk"), paku: WD(8, "paku"), driver: WD(8, "screwdriver") - 0.1, skru: WD(8, "skru"),
  satu9: WD(9, "satu") - 0.1, kosong: WD(9, "Kosong"), satuEnd: LAST(9),
  kita: WD(10, "Kita") - 0.1, komputer: WD(10, "komputer"),
};
const ISO = [1, 0.82, 1];
const cubePos = (i, t) => {
  const k = span(t, tk.mA, tk.mB), a = t * 0.9 + i * Math.PI / 2 + k * 6;
  const R = lerp(7, 0, k), y = 5 + Math.sin(t * 2 + i) * 0.4 * (1 - k);
  return CO.clone().add(V(Math.cos(a) * R, y, Math.sin(a) * R));
};

const SHOTS = [
  { t0: 0, from: { p: CO.clone().add(V(0, 5, 0)), h: 36 }, to: { p: CO.clone().add(V(0, 5, 0)), h: 28 }, dir: ISO, fy: 0, bg: "#071330", night: 0.3 },
  { t0: tk.py, follow: () => cubePos(0, tkNow), h0: 12, h1: 10, dir: ISO, fy: 0, bg: "#071330", night: 0.3 },
  { t0: tk.ja, follow: () => cubePos(1, tkNow), h0: 12, h1: 10, dir: [1, 0.55, 0.7], fy: 0, bg: "#071330", night: 0.3 },
  { t0: tk.cp, follow: () => cubePos(2, tkNow), h0: 12, h1: 10, dir: [0.7, 0.6, 1], fy: 0, bg: "#071330", night: 0.3 },
  { t0: tk.js, follow: () => cubePos(3, tkNow), h0: 12, h1: 10, dir: ISO, fy: 0, bg: "#071330", night: 0.3 },
  { t0: tk.jadi, from: { p: CO.clone().add(V(0, 5, 0)), h: 30 }, to: { p: CO.clone().add(V(0, 5, 0)), h: 18 }, dir: ISO, fy: 0, bg: "#071330", night: 0.3, shake: [tk.mB, 0.7, 1] },
  { t0: S.best, from: { p: OF.clone().add(V(0, 2, 0)), h: 36 }, to: { p: OF.clone().add(V(0, 2, 0)), h: 30 }, dir: ISO, fy: 0, bg: "#dbeafe" },
  { t0: tk.sebab2, from: { p: OF.clone().add(V(-2, 3, 0)), h: 28 }, to: { p: OF.clone().add(V(3, 3, 0)), h: 25 }, dir: [1, 0.9, 0.6], fy: 0, bg: "#dbeafe" },
  { t0: S.belajar, from: { p: ST.clone().add(V(0, 2.5, 1)), h: 20 }, to: { p: ST.clone().add(V(0, 3, 1)), h: 30 }, dir: ISO, fy: 0, bg: "#0f2a55", night: 0.2 },
  { t0: S.tunggu, from: { p: SC.clone().add(V(0, 7, 0)), h: 32 }, to: { p: SC.clone().add(V(0, 7, 0)), h: 25 }, dir: [1, 0.55, 1], fy: 0, bg: "#0f2a55", night: 0.2 },
  { t0: S.senang, from: { p: SC.clone().add(V(-4, 6, 0)), h: 26 }, to: { p: SC.clone().add(V(-5, 6, 0)), h: 22 }, dir: [1, 0.55, 1], fy: 0, bg: "#0f2a55", night: 0.2 },
  { t0: tk.game, from: { p: RA.clone(), h: 58 }, to: { p: RA.clone(), h: 50 }, dir: ISO, fy: 0, bg: "#bfe3c0" },
  { t0: tk.phone, from: { p: HP.clone().add(V(0, 7, 0)), h: 22 }, to: { p: HP.clone().add(V(0, 7, 0)), h: 17 }, dir: [1, 0.5, 1], fy: 0, bg: "#3a1622", night: 0.3 },
  { t0: S.laju, from: { p: SC.clone().add(V(4, 6, 0)), h: 26 }, to: { p: SC.clone().add(V(5, 6, 0)), h: 22 }, dir: [1, 0.55, 1], fy: 0, bg: "#0f2a55", night: 0.2 },
  { t0: tk.code6, from: { p: SG.clone().add(V(0, 6, -4)), h: 34 }, to: { p: SG.clone().add(V(0, 9, -4)), h: 30 }, dir: ISO, fy: 0, bg: "#0f2a55", night: 0.2 },
  { t0: tk.stud, from: { p: SG.clone().add(V(0, 3, 6)), h: 14 }, to: { p: SG.clone().add(V(0, 3.3, 6)), h: 12 }, dir: [1, 0.6, 1], fy: -0.05, bg: "#0f2a55", night: 0.2 },
  { t0: S.bug, from: { p: CO.clone().add(V(-5, 2, 3)), h: 16 }, to: { p: CO.clone().add(V(-1, 3.5, 1)), h: 14 }, dir: ISO, fy: 0, bg: "#071330", night: 0.35 },
  { t0: tk.seluruh, from: { p: CI.clone().add(V(0, 3, 0)), h: 70 }, to: { p: CI.clone().add(V(0, 3, 0)), h: 92 }, dir: ISO, fy: 0, bg: "#2a0f1a", night: 0.35, shake: [tk.terkesan, 0.5, 1] },
  { t0: S.toolbox, from: { p: TB.clone().add(V(0, 4, 0)), h: 22 }, to: { p: TB.clone().add(V(0, 5, 0)), h: 24 }, dir: ISO, fy: 0, bg: "#fde7d1" },
  { t0: tk.macam, from: { p: TB.clone().add(V(1, 5, 0)), h: 28 }, to: { p: TB.clone().add(V(2, 5, 0)), h: 30 }, dir: [1, 0.6, 0.8], fy: 0, bg: "#fde7d1" },
  { t0: tk.tukul, from: { p: TB.clone().add(V(7, 2, 4)), h: 12 }, to: { p: TB.clone().add(V(7, 2, 4)), h: 10 }, dir: [1, 0.7, 1], fy: 0, bg: "#fde7d1", shake: [tk.paku, 0.4, 0.5] },
  { t0: tk.driver, from: { p: TB.clone().add(V(11, 2, 4)), h: 12 }, to: { p: TB.clone().add(V(11, 2, 4)), h: 10 }, dir: [0.8, 0.7, 1], fy: 0, bg: "#fde7d1" },
  { t0: S.mesin, from: { p: CH.clone(), h: 46 }, to: { p: CH.clone(), h: 34 }, dir: ISO, fy: 0, bg: "#06281c", night: 0.25 },
  { t0: tk.satu9, from: { p: CH.clone().add(V(0, 1.5, 0)), h: 30 }, to: { p: CH.clone().add(V(0, 1.5, 0)), h: 8 }, dir: ISO, fy: 0, bg: "#06281c", night: 0.25, zoomEase: 3 },
  { t0: tk.kosong - 0.25, from: { p: CH.clone().add(V(0, 5, 0)), h: 26 }, to: { p: CH.clone().add(V(0, 5, 0)), h: 22 }, dir: [1, 0.6, 1], fy: 0, bg: "#071330", night: 0.3, shake: [tk.kosong + 0.25, 0.6, 0.8], shake2: [tk.satuEnd + 0.25, 0.6, 0.8] },
  { t0: S.terjemah, from: { p: FU.clone().add(V(0, 12, 0)), h: 40 }, to: { p: FU.clone().add(V(0, 12, 0)), h: 36 }, dir: [1, 0.5, 1], fy: 0, bg: "#0f2a55", night: 0.2 },
  { t0: tk.kita, from: { p: FU.clone().add(V(0, 5, 0)), h: 24 }, to: { p: FU.clone().add(V(0, 3, 0)), h: 18 }, dir: [1, 0.6, 1], fy: 0, bg: "#0f2a55", night: 0.2 },
  { t0: S.akhir, from: { p: CI.clone().add(V(0, 8, 0)), h: 84 }, to: { p: CI.clone().add(V(0, 8, 0)), h: 74 }, dir: [1, 1.05, 1], fy: 0.2, bg: "#0f2a55", night: 0.15 },
];
SHOTS.forEach((s, i) => (s.t1 = i + 1 < SHOTS.length ? SHOTS[i + 1].t0 : T.total));
function shotAt(t) { let s = SHOTS[0]; for (const x of SHOTS) if (t >= x.t0) s = x; return s; }

let tkNow = 0;
const camDir = new THREE.Vector3();
function shakeVec(sh, t, h) {
  if (!sh) return V(0, 0, 0);
  const [ts, amp, dur] = sh, e = t - ts;
  if (e <= 0 || e >= dur) return V(0, 0, 0);
  const a = amp * Math.exp(-e * 4) * h * 0.02; return V(Math.sin(e * 61) * a, Math.sin(e * 47 + 1) * a, Math.cos(e * 53) * a);
}
function frame(s, t) {
  const u = clamp01((t - s.t0) / Math.max(0.01, s.t1 - s.t0));
  const k = s.zoomEase ? 1 - Math.pow(1 - clamp01(u * 1.4), s.zoomEase) : ease(u) * 0.6 + u * 0.4;
  let target, h;
  if (s.follow) { target = s.follow(); h = lerp(s.h0, s.h1, k); }
  else { target = s.from.p.clone().lerp(s.to.p, k); h = lerp(s.from.h, s.to.h, k); }
  target.y -= s.fy * h;
  target.add(shakeVec(s.shake, t, h)).add(shakeVec(s.shake2, t, h));
  camDir.set(...s.dir).normalize();
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
  // ---- core: four cubes orbit, merge into one; later a bug crawls in and it goes red
  core.cubes.forEach((c, i) => {
    const merged = t >= tk.mB; c.visible = !merged;
    c.position.copy(cubePos(i, t)).sub(CO); c.rotation.set(t * 0.6 + i, t * 0.9 + i * 2, 0);
    c.scale.setScalar(1 - 0.5 * span(t, tk.mA, tk.mB));
  });
  const oneK = pop(t, tk.mB, 0.45);
  core.one.visible = t >= tk.mB; core.one.position.set(0, 5 + Math.sin(t * 1.5) * 0.3, 0); core.one.rotation.y = t * 0.5; core.one.scale.setScalar(oneK);
  core.glow.position.set(0, 5, 0); core.glow.scale.setScalar(16 * (t >= tk.mB ? 1 + 0.8 * Math.exp(-(t - tk.mB) * 3) : 0.6));
  core.what.visible = t >= tk.je && t < S.best; core.what.position.set(0, 10, 0); core.what.scale.setScalar(3.4 * pop(t, tk.je));
  const bugIn = tk.bug + 0.7;
  core.bug.visible = t >= S.bug - 0.2;
  if (core.bug.visible) {
    const k = clamp01((t - S.bug + 0.2) / (bugIn - S.bug + 0.2));
    const p = V(-11, 0.6, 7).lerp(V(-2.2, 0.6, 1.2), k);
    if (t > bugIn) { const c = clamp01((t - bugIn) / 0.6); p.set(-2.2 + c * 0.6, 0.6 + c * 2.4, 1.2 - c * 0.6); }
    core.bug.position.copy(p); core.bug.rotation.y = Math.atan2(-(1.2 - 7), -2.2 + 11); core.bug.rotation.z = t > bugIn ? -1.2 * clamp01((t - bugIn) / 0.3) : 0;
    core.legs.forEach((l, i) => (l.rotation.y = Math.sin(t * 30 + i * 2) * 0.4));
  }
  const red = t >= tk.tu7 && t < S.toolbox;
  core.one.material.emissive.set(red ? "#FF4D5E" : "#00C2FF"); core.one.material.emissiveIntensity = red ? 0.6 + 0.4 * Math.abs(Math.sin(t * 9)) : 0.5;
  core.crackGlow.visible = red; core.crackGlow.position.set(0, 5, 0); core.crackGlow.scale.setScalar(14 + Math.sin(t * 9) * 2);

  // ---- office: code bubbles between desks, ticks on "faham"
  office.bubbles.forEach((b, i) => {
    const a = tk.sebab2 - 0.4 + i * 0.4, k = clamp01((t - a) / 1.1);
    b.visible = t >= a && t < S.belajar && k < 1;
    const A = office.desks[i % 6], B = office.desks[(i * 4 + 1) % 6];
    if (b.visible) b.position.set(lerp(A.x, B.x, k), 4 + Math.sin(k * Math.PI) * 4, lerp(A.z, B.z, k));
  });
  office.desks.forEach((d, i) => {
    const a = tk.faham + i * 0.14; d.tick.visible = t >= a && t < S.belajar; d.tick.scale.setScalar(1.6 * pop(t, a));
    d.mon.material.emissiveIntensity = 0.6 + 0.3 * Math.sin(t * 3 + i); d.p.look(Math.sin(t * 1.3 + i) * 0.3);
  });

  // ---- student: one book, four creations pop out
  const beats = [WD(3, "bahasa"), WD(3, "terus"), WD(3, "buat"), WD(3, "semua")];
  stu.items.forEach((it, i) => { it.visible = t >= beats[i]; const k = pop(t, beats[i], 0.35); it.scale.setScalar(k * 1.6); it.position.copy(stu.slots[i]).add(V(0, Math.sin(t * 2 + i) * 0.3, 0)); it.rotation.y = t * 0.8 + i; });
  stu.book.material.emissiveIntensity = 0.4 + 0.4 * Math.abs(Math.sin(t * 4)); stu.st.look(Math.sin(t * 1.5) * 0.4);

  // ---- scale: wobble on the question, then tips to SENANG, later to LAJU
  let rot = 0;
  if (t < S.senang) rot = Math.sin((t - S.tunggu) * 3) * 0.28 * Math.exp(-Math.max(0, t - tk.laju4) * 3);
  else if (t < S.laju) rot = 0.36 * K.backOut(clamp01((t - S.senang - 0.2) / 0.5));
  else rot = lerp(0.36, -0.36, K.backOut(clamp01((t - S.laju - 0.2) / 0.55)));
  scale.beam.rotation.z = rot;
  scale.pans.forEach((p) => { p.hang.rotation.z = -rot; bill(p.lb); });
  scale.what.visible = t >= tk.jap && t < S.senang; scale.what.scale.setScalar(3 * pop(t, tk.jap));

  // ---- race: smooth, then stuttering frames once "lag"
  const lagOn = t >= tk.game + 0.5;
  const tq = lagOn ? tk.game + 0.5 + Math.floor((t - tk.game - 0.5) * 2.5) / 2.5 : t;
  const a = tq * 1.3;
  race.car.position.set(Math.cos(a) * 13, 0.12, Math.sin(a) * 10);
  race.car.rotation.y = -Math.atan2(Math.cos(a) * 10, -Math.sin(a) * 13);
  race.lag.visible = t >= tk.lag - 0.1 && t < tk.phone + 0.1;
  if (race.lag.visible) { race.lag.position.copy(race.car.position).add(V(0, 4.5, 0)); bill(race.lag); race.lag.scale.setScalar(pop(t, tk.lag - 0.1) * (1 + 0.08 * Math.sin(t * 30))); }

  // ---- hot phone: thermometer up, battery down, glowing red
  const hk = span(t, tk.phone + 0.1, tk.panas + 0.4);
  hot.merc.scale.y = 1 + hk * 5.5; hot.batt.scale.y = Math.max(0.05, 1 - hk * 0.9);
  hot.batt.material.color.set(hk > 0.6 ? "#E23B3B" : hk > 0.3 ? "#FF8A00" : "#22C55E"); hot.batt.material.emissive.copy(hot.batt.material.color);
  hot.bodyMat.emissiveIntensity = hk * (0.5 + 0.2 * Math.sin(t * 12));
  hot.ph.position.x = hk > 0.7 ? Math.sin(t * 50) * 0.08 : 0;
  hot.heat.forEach((s, i) => { const ph = ((t * 0.7 + i / 5) % 1); s.position.set(Math.sin(i * 2.4) * 4, 3 + ph * 12, Math.cos(i * 2.4) * 4); s.material.opacity = hk * (1 - ph) * 0.8; });

  // ---- spaghetti: tangled code grows; student smokes
  spag.tubes.forEach((tb) => { const k = span(t, tk.code6 + tb.d * 1.2, tk.code6 + tb.d * 1.2 + 1.2); tb.m.geometry.setDrawRange(0, Math.floor(tb.n * k / 3) * 3); });
  spag.smoke.forEach((s, i) => { const a = tk.pening - 0.3 + i * 0.25, ph = ((t - a) * 0.8) % 1; s.visible = t >= a && t < S.bug; s.position.set(Math.sin(i * 1.7) * 0.6, 3.4 + ph * 3, 6); s.scale.setScalar(1.2 + ph * 1.6); s.material.opacity = 1 - ph; });
  spag.what.visible = t >= tk.stud + 0.4 && t < S.bug; spag.what.position.set(1.3, 4.6, 6); spag.what.scale.setScalar(2.2 * pop(t, tk.stud + 0.4)); spag.st.look(Math.sin(t * 5) * 0.4);

  // ---- city: red wave spreads out from the cube, everything at once; calm blue for the ending
  const R = t >= tk.seluruh && t < S.toolbox ? lerp(4, 70, span(t, tk.seluruh + 0.1, tk.terkesan + 0.3)) : -1;
  city.blds.forEach((b) => {
    const hit = R > b.d; b.mat.emissive.set(hit ? "#FF4D5E" : "#00C2FF"); b.mat.emissiveIntensity = hit ? 0.55 + 0.25 * Math.sin(t * 10 + b.d) : 0.25;
    if (b.alert) { b.alert.visible = hit; if (hit) b.alert.scale.setScalar(2.4 * pop(t, tk.seluruh + 0.1 + (b.d / 66) * (tk.terkesan + 0.2 - tk.seluruh))); }
    if (b.sign) bill(b.sign);
  });
  city.ring.visible = R > 0; city.ring.scale.setScalar(Math.max(0.01, R));
  cityCube.material.emissive.set(R > 0 ? "#FF4D5E" : "#00C2FF"); cityCube.material.emissiveIntensity = R > 0 ? 0.9 : 0.5; cityCube.rotation.y = t * 0.5;
  cityGlow.visible = R > 0;
  orbitCubes.forEach((c, i) => {
    c.visible = t >= S.akhir - 0.1;
    const an = t * 0.7 + i * Math.PI / 2; c.position.copy(CI).add(V(Math.cos(an) * 10, 12 + Math.sin(t * 2 + i) * 0.6, Math.sin(an) * 10)); c.rotation.set(t * 0.5 + i, t + i, 0);
  });
  cityCube.visible = !(t >= S.akhir);

  // ---- toolbox: lid opens, labelled tools fly out; hammer hits nail, driver turns screw
  tbx.lid.rotation.x = -1.9 * K.backOut(clamp01((t - S.toolbox - 0.35) / 0.5));
  const ROW = [V(-6, 7.5, 0), V(-2, 8, 0), V(2, 8, 0), V(6, 7.5, 0)];
  tbx.tools.forEach((tl, i) => {
    const a = S.toolbox + 0.7 + i * 0.28, k = ease(clamp01((t - a) / 0.6));
    let p = V(0, 2, 0).lerp(ROW[i], k); p.y += Math.sin(t * 2 + i) * 0.25 * k;
    let rz = 0, ry = t * 0.6 * k;
    if (i === 0 && t >= tk.tukul - 0.2) { // hammer at the nail
      const hits = [tk.untuk8, tk.paku, tk.paku + 0.4];
      let sw = 0.9; hits.forEach((h) => { const e = t - h; if (e > -0.25 && e < 0.2) sw = Math.min(sw, e < 0 ? 0.9 * (-e / 0.25) : 0.9 * (e / 0.2)); });
      p = V(8.2, 3.4, 4); rz = sw; ry = 0;
    }
    if (i === 1 && t >= tk.driver - 0.2) { p = V(11, 3.6, 4); ry = -(t - tk.driver) * 9; rz = 0; }
    tl.position.copy(p); tl.rotation.set(0, ry, rz); tl.scale.setScalar(Math.max(0.001, k > 0 ? 1 : 0.001));
    tl.visible = (t >= a || (i < 2 && t >= tk.tukul - 0.2)) && !(i !== 1 && t >= tk.driver - 0.1 && t < S.mesin);
    tl.lb.position.set(0, i === 1 ? -2.6 : -2.8, 0); tl.lb.quaternion.copy(cam.quaternion).premultiply(tl.quaternion.clone().invert());
  });
  let sink = 0; [tk.untuk8, tk.paku, tk.paku + 0.4].forEach((h, i) => { if (t > h) sink = (i + 1) * 0.4; });
  tbx.nail.position.y = 0.6 - sink;
  const sk = span(t, tk.driver + 0.1, tk.skru + 0.4); tbx.screw.position.y = 0.6 - sk * 1.1; tbx.screw.rotation.y = -sk * 18;

  // ---- chip: bits stream into the CPU; giant 0 and 1 slam
  chip.bits.forEach((b, i) => {
    const tr = chip.traces[i % chip.traces.length], ph = ((t * 0.55 + i * 0.37) % 1);
    b.visible = t >= S.mesin - 0.2 && t < S.terjemah; b.position.copy(tr.a.clone().lerp(tr.b, tr.a.x < 0 ? ph : 1 - ph)).add(V(0, 0.9, 0));
  });
  chip.chip.material.emissiveIntensity = 0.05 + 0.6 * span(t, tk.satu9, tk.kosong);
  chip.glow.material.opacity = 0.8 * span(t, tk.satu9, tk.kosong);
  const drop = (o, at, x) => { o.visible = t >= at - 0.35 && t < S.terjemah; const k = clamp01((t - at + 0.35) / 0.35); o.position.set(x, lerp(22, 5.5, k * k), 0); bill(o); o.rotateY(0); };
  drop(chip.big0, tk.kosong + 0.25, -3.2); drop(chip.big1, tk.satuEnd + 0.25, 3.2);

  // ---- funnel: languages drop in, 0/1 stream out into the chip
  fun.cubes.forEach((c, i) => {
    const a = S.terjemah + 0.4 + i * 0.5, k = clamp01((t - a) / 0.9);
    const ang = i * Math.PI / 2 + 0.6, sx = Math.cos(ang) * 8, sz = Math.sin(ang) * 8;
    c.position.set(lerp(sx, 0, ease(k)), lerp(24, 14, k * k), lerp(sz, 0, ease(k))); c.rotation.set(t + i, t * 1.3, 0);
    c.scale.setScalar(Math.max(0.001, 1 - Math.max(0, k - 0.7) / 0.3)); c.visible = k < 1;
  });
  const flowOn = t >= S.terjemah + 1.2;
  fun.bits.forEach((b, i) => { const ph = ((t * 0.9 + i / 30) % 1); b.visible = flowOn && t < S.akhir; b.position.set(Math.sin(i * 2.1) * 0.5, lerp(7, 1.6, ph), Math.cos(i * 2.1) * 0.5); });
  fun.chip.material.emissiveIntensity = 0.05 + 0.9 * span(t, tk.komputer - 0.2, tk.komputer + 0.3);
  fun.glow.material.opacity = 0.9 * span(t, tk.komputer - 0.2, tk.komputer + 0.3);
  bill(fun.lb);
}

function draw(t) {
  tkNow = t;
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
