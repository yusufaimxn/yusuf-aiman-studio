// Isometric 3D world for "Apa Jadi Kalau Semua Data Dunia Hilang?".
// Pure function of timeline time: draw(t) runs on every hf-seek with absolute seconds.
import * as THREE from "../vendor/three.module.js";
import * as K from "./kit.js";
import { buildDataCity, buildGallery, buildHospital, buildGate, buildBank, buildDataCentre, buildDisk, buildWorld, makePixels, burst, DT } from "./data.js";

const T = window.YA_T, S = T.scenes;
const WD = (n, w) => { const x = T.words[n].find((v) => v[0].toLowerCase().startsWith(w.toLowerCase())); if (!x) throw new Error("word " + n + " " + w); return x[1]; };
const WDn = (n, w, k) => { const xs = T.words[n].filter((v) => v[0].toLowerCase().startsWith(w.toLowerCase())); if (!xs[k]) throw new Error("word " + n + " " + w + " " + k); return xs[k][1]; };
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
const DC0 = V(0, 0, -600), GP = V(0, 0, 0), HS = V(0, 0, 150), AG = V(0, 0, 300);
const BK = V(300, 0, 0), DCN = V(300, 0, 200), HDD = V(300, 0, 350), WM = V(-300, 0, 0);
const city = buildDataCity(scene, DC0), gal = buildGallery(scene, GP), hos = buildHospital(scene, HS), gate = buildGate(scene, AG);
const bank = buildBank(scene, BK), dcn = buildDataCentre(scene, DCN), disk = buildDisk(scene, HDD), world = buildWorld(scene, WM);
hos.mon.rotation.y = 0.35;
bank.screen.position.set(0, 6, 3.95); // in the doorway, right behind the vault door
const screenPx = makePixels(bank.group, 26, "#00C2FF");
const big0 = K.sprite(DT.bit0, 7, disk.group), big1 = K.sprite(DT.bit1, 7, disk.group);
const tickTex = K.canvasTex(256, 256, (g) => { g.fillStyle = "#22C55E"; g.beginPath(); g.arc(128, 128, 118, 0, 7); g.fill(); g.strokeStyle = "#fff"; g.lineWidth = 30; g.lineCap = "round"; g.lineJoin = "round"; g.beginPath(); g.moveTo(72, 132); g.lineTo(112, 172); g.lineTo(186, 92); g.stroke(); });
const ticks = world.dcs.map((d) => { const s = K.sprite(tickTex, 3.2, d.d); s.position.y = 7; s.visible = false; return s; });
const hosWhat = K.sprite(K.TEX.what, 2.2, gate.group); hosWhat.visible = false;

// ---------------------------------------------------------------- key times
const tk = {
  gambar: WD(1, "gambar") - 0.1, video: WD(1, "video") - 0.1, db1: WD(1, "database") - 0.1, tiba: WD(1, "tiba") - 0.1, kosong1: WD(1, "kosong"),
  kosong2: WD(2, "kosong"), chat: WD(2, "Chat") - 0.1, kosong2b: WDn(2, "kosong", 1), semua2: WD(2, "semua") - 0.1, hilang2: WD(2, "hilang"),
  rekod3: WD(3, "rekod") - 0.1, kosong3: WD(3, "kosong"),
  sistem: WD(4, "Sistem") - 0.1, tak4: WD(4, "tak"),
  duit5: WD(5, "duit"), bank5: WD(5, "bank"),
  peti: WD(6, "peti") - 0.1, ke: WD(6, "ke?"), sebenarnya: WD(6, "Sebenarnya") - 0.1, tidak: WD(6, "tidak"), nombor6: WD(6, "nombor") - 0.1, db6: WD(6, "database"),
  hilang7: WD(7, "hilang"), hilang7b: WDn(7, "hilang", 1),
  center: WD(8, "center"), berderet: WD(8, "Berderet") - 0.1, hard: WD(8, "hard") - 0.1, simpan8: WD(8, "simpan"), kosong8: WD(8, "kosong"), satu8: WD(8, "satu"),
  satu9: WD(9, "satu") - 0.1, backup9: WD(9, "backup") - 0.1, banyak: WD(9, "banyak"),
  rosak: WD(10, "rosak"), masih: WD(10, "masih") - 0.1,
};
const ISO = [1, 0.82, 1];
const NAVY = "#071330";
const itemPos = (it, t) => DC0.clone().add(it.base).add(V(0, Math.sin(t * 1.6 + it.i) * 0.35, 0));
const dissolveAt = (it) => tk.tiba + 0.15 + it.i * 0.14;
const restoreAt = (it) => S.akhir + 0.05 + it.i * 0.07;

const SHOTS = [
  { t0: 0, from: { p: DC0.clone().add(V(0, 7, 0)), h: 52 }, to: { p: DC0.clone().add(V(0, 7, 0)), h: 40 }, dir: ISO, fy: 0, bg: NAVY, night: 0.3 },
  { t0: tk.gambar, follow: () => itemPos(city.items[1], tkNow), h0: 13, h1: 11, dir: ISO, fy: 0, bg: NAVY, night: 0.3 },
  { t0: tk.video, follow: () => itemPos(city.items[2], tkNow), h0: 13, h1: 11, dir: [1, 0.55, 0.75], fy: 0, bg: NAVY, night: 0.3 },
  { t0: tk.db1, follow: () => itemPos(city.items[0], tkNow), h0: 15, h1: 12, dir: [0.75, 0.6, 1], fy: 0, bg: NAVY, night: 0.3 },
  { t0: tk.tiba, from: { p: DC0.clone().add(V(0, 8, 0)), h: 40 }, to: { p: DC0.clone().add(V(0, 8, 0)), h: 30 }, dir: ISO, fy: 0, bg: NAVY, night: 0.35, shake: [tk.kosong1, 0.7, 1] },
  { t0: S.gallery, from: { p: GP.clone().add(V(-1, 8.5, 0)), h: 26 }, to: { p: GP.clone().add(V(-1, 8.5, 0)), h: 21 }, dir: ISO, fy: 0, bg: "#dbeafe", shake: [tk.kosong2, 0.35, 0.6] },
  { t0: tk.chat, from: { p: GP.clone().add(V(6.5, 9, 3)), h: 19 }, to: { p: GP.clone().add(V(7, 9.5, 3)), h: 16 }, dir: [1, 0.6, 1], fy: 0, bg: "#dbeafe", shake: [tk.kosong2b, 0.35, 0.6] },
  { t0: tk.semua2, from: { p: GP.clone().add(V(1, 9, 0)), h: 26 }, to: { p: GP.clone().add(V(1, 9, 0)), h: 32 }, dir: ISO, fy: 0, bg: "#c7d2fe" },
  { t0: S.hospital, from: { p: HS.clone().add(V(0, 4, -1)), h: 30 }, to: { p: HS.clone().add(V(0, 4, -1)), h: 25 }, dir: ISO, fy: 0, bg: "#e0f2fe" },
  { t0: tk.rekod3, from: { p: HS.clone().add(V(4.5, 4.5, -3)), h: 20 }, to: { p: HS.clone().add(V(4.5, 4.5, -3)), h: 17 }, dir: [1, 0.65, 1.2], fy: 0, bg: "#e0f2fe", shake: [tk.kosong3, 0.4, 0.7] },
  { t0: S.flight, from: { p: AG.clone().add(V(0, 3, 2)), h: 28 }, to: { p: AG.clone().add(V(0, 3, 2)), h: 23 }, dir: ISO, fy: 0, bg: "#fde7d1" },
  { t0: tk.sistem, from: { p: AG.clone().add(V(0, 4.5, 1)), h: 17 }, to: { p: AG.clone().add(V(0, 4.5, 1)), h: 13.5 }, dir: [1, 0.6, 1], fy: 0, bg: "#fde7d1", shake: [tk.tak4, 0.4, 0.6] },
  { t0: S.seram, from: { p: BK.clone().add(V(0, 6, -3)), h: 44 }, to: { p: BK.clone().add(V(0, 6, -4)), h: 26 }, dir: ISO, fy: 0, bg: "#1a2a55", night: 0.2, shake: [tk.bank5, 0.35, 0.7] },
  { t0: S.vault, from: { p: BK.clone().add(V(0, 5, -2)), h: 30 }, to: { p: BK.clone().add(V(0, 5, -2)), h: 26 }, dir: ISO, fy: 0, bg: "#1a2a55", night: 0.15 },
  { t0: tk.peti, from: { p: BK.clone().add(V(0, 6, -6)), h: 19 }, to: { p: BK.clone().add(V(0, 6, -6)), h: 16 }, dir: [0.75, 0.55, 1], fy: 0, bg: "#1a2a55", night: 0.15 },
  { t0: tk.sebenarnya, from: { p: BK.clone().add(V(0, 5, -2)), h: 26 }, to: { p: BK.clone().add(V(0, 5.5, -3)), h: 24 }, dir: ISO, fy: 0, bg: "#1a2a55", night: 0.12 },
  { t0: tk.nombor6, from: { p: BK.clone().add(V(0, 6, -6.5)), h: 13 }, to: { p: BK.clone().add(V(0, 6, -6.5)), h: 11 }, dir: [0.45, 0.4, 1], fy: 0, bg: "#1a2a55", night: 0.12 },
  { t0: S.padam, from: { p: BK.clone().add(V(0, 6, -5)), h: 22 }, to: { p: BK.clone().add(V(0, 6, -5)), h: 19 }, dir: [0.6, 0.5, 1], fy: 0, bg: "#1a2a55", night: 0.15, shake: [tk.hilang7, 0.5, 0.8], shake2: [tk.hilang7b, 0.7, 1] },
  { t0: S.dc, from: { p: DCN.clone().add(V(0, 3, 0)), h: 58 }, to: { p: DCN.clone().add(V(0, 3, 0)), h: 42 }, dir: ISO, fy: 0, bg: "#13294f", night: 0 },
  { t0: tk.berderet, from: { p: DCN.clone().add(V(-10, 3.5, 2)), h: 24 }, to: { p: DCN.clone().add(V(8, 3.5, 2)), h: 22 }, dir: [0.6, 0.6, 1], fy: 0, bg: "#13294f", night: 0 },
  { t0: tk.hard, from: { p: HDD.clone().add(V(0, 3, 0)), h: 26 }, to: { p: HDD.clone().add(V(0, 4, 0)), h: 21 }, dir: ISO, fy: 0, bg: NAVY, night: 0.3, shake: [tk.kosong8, 0.4, 0.5], shake2: [tk.satu8, 0.5, 0.6] },
  { t0: S.backup, from: { p: WM.clone().add(V(0, 2, 0)), h: 84 }, to: { p: WM.clone().add(V(0, 2, 0)), h: 76 }, dir: [1, 1.15, 0.35], fy: 0, bg: "#0f2a55", night: 0.15 },
  { t0: tk.satu9, follow: () => WM.clone().add(world.dcs[2].p).add(V(0, 2, 0)), h0: 30, h1: 24, dir: [1, 1, 0.5], fy: 0, bg: "#0f2a55", night: 0.15 },
  { t0: tk.backup9, from: { p: WM.clone().add(V(0, 2, 0)), h: 66 }, to: { p: WM.clone().add(V(0, 2, 0)), h: 78 }, dir: [1, 1.15, 0.35], fy: 0, bg: "#0f2a55", night: 0.15 },
  { t0: S.selamat, from: { p: WM.clone().add(V(0, 2, 0)), h: 78 }, to: { p: WM.clone().add(V(0, 2, 0)), h: 70 }, dir: [1, 1.15, 0.35], fy: 0, bg: "#0f2a55", night: 0.2, shake: [tk.rosak, 0.6, 0.9] },
  { t0: S.akhir, from: { p: DC0.clone().add(V(0, 9, 0)), h: 66 }, to: { p: DC0.clone().add(V(0, 9, 0)), h: 58 }, dir: [1, 1.0, 1], fy: 0.2, bg: NAVY, night: 0.2 },
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
const flick = (t, a, b) => t >= a && t < b && Math.floor(t * 14) % 3 !== 0;

// ---------------------------------------------------------------- world state at t
function state(t) {
  // ---- data city: icon blocks float, then dissolve into pixels; they rebuild for the ending
  const ending = t >= S.akhir;
  city.items.forEach((it) => {
    const p = it.base.clone().add(V(0, Math.sin(t * 1.6 + it.i) * 0.35, 0)), d0 = dissolveAt(it), r0 = restoreAt(it);
    it.m.position.copy(p); it.m.rotation.y = Math.sin(t * 0.8 + it.i) * 0.5 + 0.4; it.ghost.position.copy(p); it.ghost.rotation.copy(it.m.rotation);
    const gone = !ending ? t >= d0 + 0.08 : t < r0 + 0.7;
    it.m.visible = !gone;
    it.m.scale.setScalar(ending ? pop(t, r0 + 0.7, 0.35) : t > d0 - 0.15 ? 1 + 0.15 * Math.sin((t - d0) * 60) : 1);
    it.ghost.visible = (t >= d0 && t < S.gallery) || (ending && t < r0 + 0.7);
    it.ghost.material.opacity = 0.55 * span(t, d0, d0 + 0.4);
    if (!ending) burst(it.px, p, t, d0, 1.1); else burst(it.px, p, t, r0, 0.7, true);
  });
  const dead = t >= tk.kosong1 && t < S.akhir, rev = span(t, S.akhir, S.akhir + 1.8);
  city.blds.forEach((b, i) => { b.material.emissive.set(dead && Math.floor(t * 10 + i) % 7 === 0 ? "#FF4D5E" : "#00C2FF"); b.material.emissiveIntensity = t < tk.tiba ? 0.25 : ending ? 0.08 + 0.3 * rev : 0.05 + 0.2 * (1 - span(t, tk.tiba, tk.kosong1)); });
  city.glow.material.opacity = t < tk.tiba ? 0.8 : ending ? 0.8 * rev : 0.8 * (1 - span(t, tk.tiba, tk.kosong1 - 0.3));

  // ---- gallery: photos blink out in a ripple; chat bubbles pop then vanish
  gal.tiles.forEach((tl) => {
    const a = tk.kosong2 - 0.2 + (Math.floor(tl.i / 3) + (tl.i % 3)) * 0.06;
    tl.m.visible = t < a;
    const p = V(tl.x, tl.y, 0.7).applyQuaternion(gal.ph.quaternion).add(gal.ph.position);
    burst(tl.px, p, t, a, 0.8);
  });
  gal.chats.forEach((c) => {
    const a = tk.chat + 0.05 + c.i * 0.12, z = tk.kosong2b - 0.1 + c.i * 0.06;
    c.c.visible = t >= a && t < z; c.c.position.copy(c.base).add(V(0, Math.sin(t * 2 + c.i) * 0.15, 0)); bill(c.c); c.c.scale.setScalar(pop(t, a, 0.3));
    burst(c.px, c.base, t, z, 0.8);
  });
  gal.what.visible = t >= tk.hilang2 - 0.1 && t < S.hospital; gal.what.scale.setScalar(4 * pop(t, tk.hilang2 - 0.1));

  // ---- hospital: drawers slide out, record + papers vanish, doctor confused
  const drawOut = span(t, tk.rekod3 + 0.1, tk.rekod3 + 0.6);
  hos.drawers.forEach((d, i) => { d.d.position.z = 1.5 + drawOut * (1.4 + i * 0.3); d.papers.visible = t < tk.kosong3 + i * 0.08; });
  hos.mon.material.map = t >= tk.kosong3 || flick(t, tk.kosong3 - 0.35, tk.kosong3) ? DT.recBlank : DT.recOk;
  burst(hos.recPx, V(2, 6.2, -5.6), t, tk.kosong3, 1);
  hos.what.visible = t >= tk.kosong3 + 0.25 && t < S.flight; hos.what.scale.setScalar(2.2 * pop(t, tk.kosong3 + 0.25));
  hos.doc.look(t > tk.kosong3 ? Math.sin(t * 5) * 0.5 : -0.5);

  // ---- gate: passengers queue, the scanner turns red and refuses
  const deny = t >= tk.tak4;
  gate.lightMat.color.set(deny ? "#FF4D5E" : "#22C55E"); gate.lightMat.emissive.set(deny ? "#FF4D5E" : "#22C55E");
  gate.lightMat.emissiveIntensity = deny ? 0.7 + 0.5 * Math.abs(Math.sin(t * 10)) : 0.9;
  gate.pax.forEach((p, i) => { const walk = clamp01((t - S.flight) / Math.max(0.1, tk.tak4 - S.flight)); p.obj.position.z = 3 + i * 1.8 - walk * 1.6; p.look(deny ? Math.sin(t * 4 + i) * 0.5 : 0); });
  gate.x.visible = deny && t < S.seram; gate.x.scale.setScalar(2.6 * pop(t, tk.tak4, 0.35));
  hosWhat.visible = t >= tk.tak4 + 0.4 && t < S.seram; hosWhat.position.set(0, 3.9, 1.4); hosWhat.scale.setScalar(2 * pop(t, tk.tak4 + 0.4));

  // ---- bank vault: door opens, cash turns into data and flies into the database screen
  const wheelSpin = t < tk.peti ? 0 : (t - tk.peti) * 7;
  bank.wheel.rotation.z = Math.min(wheelSpin, 4.4);
  bank.hinge.rotation.y = -1.75 * K.backOut(clamp01((t - tk.ke) / 0.6));
  const SCR = V(0, 6, -7);
  bank.cash.forEach((c) => {
    const morph = span(t, tk.sebenarnya + 0.1 + c.d * 0.5, tk.sebenarnya + 0.5 + c.d * 0.5);
    c.m.color.set(morph > 0.5 ? "#0B1E3F" : "#22C55E"); c.m.emissive.set("#00C2FF"); c.m.emissiveIntensity = morph * 0.9 + (t > tk.duit5 && t < S.vault ? 0.25 * Math.abs(Math.sin(t * 6)) : 0);
    const fa = tk.tidak + c.d * 1.4, fk = clamp01((t - fa) / 0.8), e = fk * fk;
    const p = c.base.clone().lerp(SCR, e); p.y += Math.sin(fk * Math.PI) * 4;
    c.b.position.copy(p); c.b.scale.setScalar(lerp(1, 0.2, e) * (1 + morph * 0.1)); c.b.rotation.set(fk * 3, fk * 5, 0);
    c.b.visible = fk < 1;
  });
  bank.screen.visible = t >= tk.ke + 0.3;
  const glitching = t >= tk.hilang7 && t < tk.hilang7b;
  bank.screen.material.map = t >= tk.hilang7b || (glitching && Math.floor(t * 12) % 2 === 0) ? DT.tabBlank : DT.tabOk;
  bank.screen.material.opacity = glitching ? 0.6 + 0.4 * Math.abs(Math.sin(t * 25)) : 1;
  bank.screen.scale.setScalar(t >= tk.ke + 0.3 ? pop(t, tk.ke + 0.3, 0.4) : 0.001);
  burst(screenPx, V(0, 6, -6.8), t, tk.hilang7, 1.3);
  bank.alarm.visible = t >= tk.hilang7b && t < S.dc; bank.alarm.material.opacity = 0.5 + 0.5 * Math.abs(Math.sin(t * 8));
  bank.what.visible = t >= tk.ke && t < tk.sebenarnya; bank.what.position.set(-4, 12, -6); bank.what.scale.setScalar(3 * pop(t, tk.ke));

  // ---- data centre: racks blink
  dcn.leds.forEach((L) => (L.l.visible = Math.floor(t * 7 + L.s) % 4 !== 0));

  // ---- hard disk: platter spins, 0/1 rise, giant 0 and 1 drop on the words
  disk.platter.rotation.y = t * 14; disk.arm.rotation.y = 0.35 + Math.sin(t * 3) * 0.22;
  disk.bits.forEach((b, i) => {
    const ph = ((t * 0.55 + i / 30) % 1), a = i * 2.39996, r = 1.5 + (i % 5) * 0.9;
    b.visible = t >= tk.simpan8 - 0.1 && t < S.backup; b.position.set(Math.cos(a) * r, 2 + ph * 11, -2 + Math.sin(a) * r); b.material.opacity = 1 - ph;
  });
  const drop = (o, at, x) => { o.visible = t >= at - 0.3 && t < S.backup; const k = clamp01((t - at + 0.3) / 0.3); o.position.set(x, lerp(24, 7.5, k * k), -2); };
  drop(big0, tk.kosong8, -3.2); drop(big1, tk.satu8, 3.2);

  // ---- world: one copy, then backups everywhere; one site breaks, the others still have it
  const only = t < tk.backup9 + 0.2;
  const order = [2, 3, 0, 4, 1, 5], litAt = {}; order.forEach((j, k) => (litAt[j] = j === 2 ? 0 : tk.backup9 + 0.3 + k * 0.28));
  const broken = (j) => j === 4 && t >= tk.rosak && t < tk.masih + 0.9;
  world.dcs.forEach((d, j) => {
    const on = j === 2 || t >= litAt[j];
    const br = broken(j);
    d.mat.emissive.set(br ? "#FF4D5E" : "#00C2FF");
    d.mat.emissiveIntensity = br ? 0.4 + 0.4 * Math.abs(Math.sin(t * 12)) : on ? 0.7 + (j === 2 && only ? 0.3 * Math.sin(t * 5) : 0) : 0.02;
    d.glow.visible = on && !br; d.glow.scale.setScalar(9 * (on ? pop(t, litAt[j], 0.4) : 1) * (t >= tk.masih && !br && j !== 4 ? 1 + 0.25 * Math.abs(Math.sin((t - tk.masih) * 6)) : 1));
    d.boom.visible = br; d.boom.scale.setScalar(br ? 14 * (0.6 + 0.6 * Math.exp(-(t - tk.rosak) * 3)) : 1);
    d.d.position.y = br ? Math.sin(t * 40) * 0.15 : 0;
    ticks[j].visible = j !== 4 && t >= tk.masih + 0.1 + j * 0.07 && t < S.akhir; ticks[j].scale.setScalar(3.2 * pop(t, tk.masih + 0.1 + j * 0.07));
  });
  world.arcs.forEach((a, n) => {
    const lit = Math.max(litAt[a.i], litAt[a.j]);
    const on = t >= tk.backup9 + 0.2 && t >= lit - 0.25;
    const touchesBroken = (a.i === 4 || a.j === 4) && t >= tk.rosak && t < tk.masih + 0.6;
    a.tube.material.opacity = on ? (touchesBroken ? 0.12 : 0.75 * span(t, lit - 0.25, lit + 0.1)) : 0;
    a.tube.material.color.set(touchesBroken ? "#FF4D5E" : "#00C2FF");
    const ph = ((t * 0.6 + n * 0.23) % 1), flow = on && !touchesBroken && t < S.akhir;
    a.pkt.visible = flow; if (flow) { const back = t >= tk.masih && (a.i === 4 || a.j === 4); const u = (n % 2 ? 1 - ph : ph); const uu = back ? (a.j === 4 ? ph : 1 - ph) : u; a.pkt.position.copy(a.c.getPoint(uu)); a.pkt.rotation.set(t * 3, t * 2, 0); }
  });
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
