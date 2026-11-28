// Isometric 3D world for "Apa Jadi Kalau AI Ganti Semua Pekerjaan Manusia?".
// Pure function of timeline time: draw(t) runs on every hf-seek with absolute seconds.
import * as THREE from "../vendor/three.module.js";
import * as K from "./kit.js";
import { burst, DT } from "./data.js";
import { buildOffice, buildFactory, buildShop, buildBankHall, buildProfit, buildPlaza, buildLoop, buildStage, buildHuman, WT } from "./work.js";

const T = window.YA_T, S = T.scenes;
const WD = (n, w, k = 0) => { const xs = T.words[n].filter((v) => v[0].toLowerCase().startsWith(w.toLowerCase())); if (!xs[k]) throw new Error("word " + n + " " + w + " " + k); return xs[k][1]; };
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
const OF = V(0, 0, 0), FA = V(300, 0, 0), SH = V(300, 0, 150), BH = V(300, 0, 300);
const PR = V(-300, 0, 0), PL = V(-300, 0, 150), LP = V(-300, 0, 300), STG = V(0, 0, 300), HU = V(0, 0, 450);
const off = buildOffice(scene, OF), fac = buildFactory(scene, FA), shop = buildShop(scene, SH), bank = buildBankHall(scene, BH);
const prof = buildProfit(scene, PR), plaza = buildPlaza(scene, PL), loop = buildLoop(scene, LP), stage = buildStage(scene, STG), hum = buildHuman(scene, HU);
hum.glows.forEach((g) => g.material.color.set("#FF8A00"));
const heroTick = K.sprite(WT.tick, 1.3, off.group); heroTick.visible = false;
const HX = off.hero.x, HZ = off.hero.z;

// ---------------------------------------------------------------- key times
const tk = {
  ai2: WD(2, "AI."), email: WD(3, "Email") - 0.1, report: WD(3, "Report") - 0.1, design: WD(3, "Design") - 0.1, korang3: WD(3, "Korang") - 0.1,
  kilang: WD(4, "Kilang") - 0.1, kedai: WD(4, "kedai") - 0.1, bank: WD(4, "bank") - 0.1, semua4: WD(4, "semua") - 0.1, sendiri: WD(4, "sendiri"),
  untung: WD(5, "untung"), sebab5: WD(5, "sebab") - 0.1, gaji5: WD(5, "gaji"),
  takde: WD(6, "takde"), siapa6: WD(6, "siapa") - 0.1, beli: WD(6, "beli"),
  barang7: WD(7, "Barang") - 0.1, duit7: WD(7, "Duit") - 0.1, terus7: WD(7, "terus"), berhenti: WD(7, "berhenti"), pusing: WD(7, "berpusing"),
  ke8: WD(8, "ke?"),
  tak9: WD(9, "tak."), tugas9: WD(9, "tugas") - 0.1, sebab9: WD(9, "Sebab") - 0.1, ulang: WD(9, "berulang"),
  salah: WD(10, "salah") - 0.1, check: WD(10, "check"), keputusan: WD(10, "keputusan") - 0.1, perasaan: WD(10, "perasaan") - 0.1, tanggung: WD(10, "bertanggungjawab") - 0.1, jadi10: WD(10, "Jadi") - 0.1,
  berubah: WD(11, "berubah"), dan11: WD(11, "Dan") - 0.1, laju: WD(11, "laju"),
};
const ISO = [1, 0.82, 1];
const DAY = "#dbeafe", NAVY = "#0f2a55";
const hero = (x, y, z) => OF.clone().add(V(HX + x, y, HZ + z));

const SHOTS = [
  { t0: 0, from: { p: OF.clone().add(V(-1, 2, 2)), h: 36 }, to: { p: OF.clone().add(V(-2, 2, 3)), h: 27 }, dir: ISO, fy: 0, bg: DAY },
  { t0: S.hook, from: { p: hero(0, 2.4, 0), h: 15 }, to: { p: hero(0, 2.4, 0), h: 10 }, dir: ISO, fy: 0, bg: DAY, shake: [tk.ai2, 0.35, 0.6] },
  { t0: tk.email, from: { p: hero(0.4, 2.6, -0.4), h: 7.5 }, to: { p: hero(0.6, 2.8, -0.4), h: 6.5 }, dir: [0.7, 0.55, 1], fy: 0, bg: DAY },
  { t0: tk.report, from: { p: hero(1.5, 1.6, 0), h: 6.5 }, to: { p: hero(1.5, 1.8, 0), h: 5.5 }, dir: [1, 0.6, 0.7], fy: 0, bg: DAY },
  { t0: tk.design, from: { p: hero(-1.6, 1.8, 0), h: 6.5 }, to: { p: hero(-1.6, 1.9, 0), h: 5.5 }, dir: [0.6, 0.55, 1], fy: 0, bg: DAY },
  { t0: tk.korang3, from: { p: hero(0, 1.6, 1), h: 9 }, to: { p: hero(0, 1.6, 1), h: 7.5 }, dir: [1, 0.65, 1], fy: 0, bg: DAY },
  { t0: S.domino, from: { p: hero(0, 1.6, 0), h: 10 }, to: { p: OF.clone().add(V(0, 1, 1)), h: 38 }, dir: ISO, fy: 0, bg: DAY, zoomEase: 2 },
  { t0: tk.kilang, from: { p: FA.clone().add(V(0, 2, 0)), h: 24 }, to: { p: FA.clone().add(V(0, 2, 0)), h: 19 }, dir: [1, 0.7, 1], fy: 0, bg: "#0f2a55", night: 0.1 },
  { t0: tk.kedai, from: { p: SH.clone().add(V(0, 2.5, 0)), h: 22 }, to: { p: SH.clone().add(V(0, 2.5, 0)), h: 18 }, dir: ISO, fy: 0, bg: "#fde7d1" },
  { t0: tk.bank, from: { p: BH.clone().add(V(0, 3, -2)), h: 24 }, to: { p: BH.clone().add(V(0, 3, -2)), h: 21 }, dir: ISO, fy: 0, bg: "#e0f2fe" },
  { t0: tk.semua4, from: { p: OF.clone().add(V(0, 2, 0)), h: 60 }, to: { p: OF.clone().add(V(0, 2, 0)), h: 170 }, dir: [1, 1.05, 1], fy: 0, bg: NAVY, night: 0.25, zoomEase: 2 },
  { t0: S.untung, from: { p: PR.clone().add(V(0, 4.5, -1)), h: 30 }, to: { p: PR.clone().add(V(0, 5, -1)), h: 25 }, dir: ISO, fy: 0, bg: NAVY, night: 0.1 },
  { t0: tk.sebab5, from: { p: PR.clone().add(V(0, 2, 5.5)), h: 15 }, to: { p: PR.clone().add(V(0, 2, 5.5)), h: 12.5 }, dir: [0.55, 0.55, 1], fy: 0, bg: NAVY, night: 0.15, shake: [tk.gaji5, 0.6, 0.8] },
  { t0: S.soalan, from: { p: PL.clone().add(V(0, 2, 0)), h: 30 }, to: { p: PL.clone().add(V(0, 2, 0)), h: 24 }, dir: ISO, fy: 0, bg: "#0a1530", night: 0.45 },
  { t0: tk.siapa6, from: { p: PL.clone().add(V(0, 5, 0)), h: 32 }, to: { p: PL.clone().add(V(0, 5, 0)), h: 38 }, dir: [1, 0.75, 1], fy: 0, bg: "#0a1530", night: 0.45, shake: [tk.beli + 0.2, 0.8, 1] },
  { t0: S.sunyi, from: { p: SH.clone().add(V(1, 2.5, 0)), h: 24 }, to: { p: SH.clone().add(V(1, 2.5, 0)), h: 19 }, dir: ISO, fy: 0, bg: "#060b18", night: 0.7 },
  { t0: tk.barang7, from: { p: SH.clone().add(V(7, 2, 2.5)), h: 15 }, to: { p: SH.clone().add(V(7, 2.4, 2.5)), h: 13 }, dir: [1, 0.6, 0.8], fy: 0, bg: "#060b18", night: 0.6 },
  { t0: tk.duit7, from: { p: LP.clone().add(V(0, 1, 0)), h: 32 }, to: { p: LP.clone().add(V(0, 1, 0)), h: 26 }, dir: [1, 1.1, 1], fy: 0, bg: NAVY, night: 0.3, shake: [tk.pusing, 0.8, 1] },
  { t0: S.ragu, from: { p: STG.clone().add(V(0, 4, 0)), h: 30 }, to: { p: STG.clone().add(V(0, 4, 0)), h: 25 }, dir: [0.5, 0.55, 1], fy: 0, bg: "#0b1e3f", night: 0.2 },
  { t0: S.twist, from: { p: STG.clone().add(V(0, 5, 0)), h: 24 }, to: { p: STG.clone().add(V(0, 5.5, 0)), h: 22 }, dir: [0.3, 0.5, 1], fy: 0, bg: "#0b1e3f", night: 0.15, shake: [tk.tak9, 0.7, 0.8] },
  { t0: tk.tugas9, from: { p: STG.clone().add(V(0, 6.5, 0)), h: 20 }, to: { p: STG.clone().add(V(0, 6.5, 0)), h: 17 }, dir: [0.3, 0.5, 1], fy: 0, bg: "#0b1e3f", night: 0.15 },
  { t0: tk.sebab9, from: { p: STG.clone().add(V(0, 5, 0)), h: 27 }, to: { p: STG.clone().add(V(0, 5, 0)), h: 25 }, dir: [0.55, 0.55, 1], fy: 0, bg: "#0b1e3f", night: 0.15 },
  { t0: S.manusia, from: { p: HU.clone().add(V(0, 2, 0)), h: 40 }, to: { p: HU.clone().add(V(-6, 2, 0)), h: 30 }, dir: ISO, fy: 0, bg: DAY },
  { t0: tk.salah, from: { p: HU.clone().add(hum.ST[0]).add(V(0, 2.6, -0.4)), h: 11 }, to: { p: HU.clone().add(hum.ST[0]).add(V(0.4, 2.6, 0)), h: 9.5 }, dir: [0.8, 0.6, 1], fy: 0, bg: DAY },
  { t0: tk.keputusan, from: { p: HU.clone().add(hum.ST[1]).add(V(0, 2, 0.5)), h: 9 }, to: { p: HU.clone().add(hum.ST[1]).add(V(0, 2, 0.5)), h: 8 }, dir: ISO, fy: 0, bg: DAY },
  { t0: tk.perasaan, from: { p: HU.clone().add(hum.ST[2]).add(V(0, 1.8, 0)), h: 8.5 }, to: { p: HU.clone().add(hum.ST[2]).add(V(0, 1.8, 0)), h: 7.5 }, dir: [0.5, 0.5, 1], fy: 0, bg: DAY },
  { t0: tk.tanggung, from: { p: HU.clone().add(hum.ST[3]).add(V(0, 1.5, 0.5)), h: 8 }, to: { p: HU.clone().add(hum.ST[3]).add(V(0, 1.4, 0.4)), h: 6.5 }, dir: [0.8, 0.9, 1], fy: 0, bg: DAY },
  { t0: tk.jadi10, from: { p: HU.clone().add(V(0, 2.5, 0)), h: 36 }, to: { p: HU.clone().add(V(0, 2.5, 0)), h: 40 }, dir: [0.7, 0.75, 1], fy: 0, bg: DAY },
  { t0: S.berubah, from: { p: OF.clone().add(V(0, 2, 2)), h: 32 }, to: { p: OF.clone().add(V(0, 2, 2)), h: 26 }, dir: ISO, fy: 0, bg: DAY },
  { t0: tk.dan11, from: { p: hero(0.6, 2, 0.3), h: 10 }, to: { p: hero(0.6, 2, 0.3), h: 8.5 }, dir: [1, 0.65, 1], fy: 0, bg: DAY },
  { t0: S.akhir, from: { p: OF.clone().add(V(0, 6, 0)), h: 70 }, to: { p: OF.clone().add(V(0, 6, 0)), h: 60 }, dir: [1, 1.05, 1], fy: 0.2, bg: NAVY, night: 0.2 },
];
SHOTS.forEach((s, i) => (s.t1 = i + 1 < SHOTS.length ? SHOTS[i + 1].t0 : T.total));
function shotAt(t) { let s = SHOTS[0]; for (const x of SHOTS) if (t >= x.t0) s = x; return s; }

const camDir = new THREE.Vector3();
function shakeVec(sh, t, h) {
  if (!sh) return V(0, 0, 0);
  const [ts, amp, dur] = sh, e = t - ts;
  if (e <= 0 || e >= dur) return V(0, 0, 0);
  const a = amp * Math.exp(-e * 4) * h * 0.02; return V(Math.sin(e * 61) * a, Math.sin(e * 47 + 1) * a, Math.cos(e * 53) * a);
}
function frame(s, t) {
  const u = clamp01((t - s.t0) / Math.max(0.01, s.t1 - s.t0));
  const k = s.zoomEase ? 1 - Math.pow(1 - clamp01(u * 1.15), s.zoomEase) : ease(u) * 0.6 + u * 0.4;
  let target = s.from.p.clone().lerp(s.to.p, k), h = lerp(s.from.h, s.to.h, k);
  target.y -= s.fy * h;
  target.add(shakeVec(s.shake, t, h));
  camDir.set(...s.dir).normalize();
  cam.position.copy(target).addScaledVector(camDir, 400); cam.up.set(0, 1, 0); cam.lookAt(target);
  const w = h * W / H; cam.left = -w / 2; cam.right = w / 2; cam.top = h / 2; cam.bottom = -h / 2; cam.updateProjectionMatrix();
  sun.position.copy(target).add(V(-35, 60, 30)); sun.target.position.copy(target);
  const sc = sun.shadow.camera, r = Math.min(160, Math.max(h, w) * 0.85);
  sc.left = -r; sc.right = r; sc.top = r; sc.bottom = -r; sc.near = 1; sc.far = 300; sc.updateProjectionMatrix();
  scene.background.set(s.bg);
  const night = s.night || 0; hemi.intensity = lerp(1.15, 0.55, night); sun.intensity = lerp(2.5, 0.9, night);
}
const bill = (o) => o.quaternion.copy(cam.quaternion);
const pop = (t, a, d = 0.3) => Math.max(0.001, K.backOut(clamp01((t - a) / d)));

// ---------------------------------------------------------------- world state at t
function state(t) {
  // ---- office: AI brain, tasks finish themselves, desks flip to AI, later humans + robots together
  const late = t >= S.berubah;
  off.ai.g.visible = t < S.berubah;
  off.ai.g.rotation.y = t * 0.8; off.ai.wire.rotation.x = t * 0.5;
  const pulse = 1 + 0.35 * Math.exp(-Math.max(0, t - tk.ai2) * 3) * (t > tk.ai2 ? 1 : 0);
  off.ai.g.scale.setScalar(pulse * (1 + 0.05 * Math.sin(t * 3))); off.ai.g.position.set(HX + 0.5, 5.8 + Math.sin(t * 1.6) * 0.25, HZ - 4);
  off.desks.forEach((d) => {
    const flipAt = S.domino + 0.15 + d.dist * 0.11, heroAt = S.hook + 0.6;
    const isAI = !late && (t >= flipAt || (d === off.hero && t >= heroAt));
    const mixAt = tk.berubah - 0.3 + d.dist * 0.04;
    d.mon.material[4].map = late && t >= mixAt ? WT.screenMix : isAI ? WT.screenAI : WT.screenHuman;
    d.ring.material.opacity = late ? (t >= mixAt ? 0.7 : 0) : isAI ? 0.75 * (0.7 + 0.3 * Math.sin(t * 6 + d.i)) : 0;
    d.ring.material.color.set(late ? "#FF8A00" : "#00C2FF");
    d.p.look(isAI ? Math.sin(t * 1.2 + d.i) * 0.6 : late ? Math.sin(t * 2 + d.i) * 0.2 : 0);
    const botAt = S.berubah + 0.3 + d.i * 0.08;
    d.bot.g.visible = late && t >= botAt; d.bot.g.scale.setScalar(0.8 * pop(t, botAt, 0.35));
    d.bot.arms[1].rotation.x = Math.sin(t * 5 + d.i) * 0.5; d.bot.head.rotation.y = Math.sin(t * 2 + d.i) * 0.3;
  });
  // emails fly out, papers stack, report + design pop
  off.mails.forEach((m, i) => {
    const a = tk.email + 0.15 + i * 0.16, k = clamp01((t - a) / 1.1);
    m.visible = t >= a && k < 1 && t < S.domino;
    if (m.visible) m.position.set(HX + lerp(0, 3 + (i % 3), k), lerp(1.9, 5 + (i % 2) * 1.5, k) + Math.sin(k * Math.PI) * 1.2, HZ - 0.4 + lerp(0, -2 - (i % 4), k));
  });
  off.papers.forEach((p, i) => { const a = tk.report + 0.1 + i * 0.07; p.visible = t >= a && t < S.berubah; p.position.set(HX + 1.6, 0.93 + i * 0.045 + (1 - clamp01((t - a) / 0.15)) * 0.8, HZ + 0.1); });
  off.report.visible = t >= tk.report + 0.5 && t < S.domino; off.report.position.set(HX + 1.7, 2.4, HZ); bill(off.report); off.report.scale.setScalar(pop(t, tk.report + 0.5, 0.35));
  off.canvasP.visible = t >= tk.design + 0.1 && t < S.domino; off.canvasP.position.set(HX - 1.7, 2.3, HZ); bill(off.canvasP); off.canvasP.scale.setScalar(pop(t, tk.design + 0.1, 0.4));
  off.what.visible = t >= tk.korang3 + 0.35 && t < S.domino; off.what.position.set(HX, 2.7, HZ + 1.25); off.what.scale.setScalar(1.2 * pop(t, tk.korang3 + 0.35));
  heroTick.visible = t >= tk.laju - 0.1; heroTick.position.set(HX, 3, HZ + 1.25); heroTick.scale.setScalar(1.3 * pop(t, tk.laju - 0.1));
  // city wave
  const R = t >= tk.semua4 && t < S.berubah ? lerp(14, 115, span(t, tk.semua4 + 0.1, tk.sendiri + 0.6)) : -1;
  off.wave.visible = R > 0 && R < 112; off.wave.scale.setScalar(Math.max(1, R));
  off.city.forEach((c) => {
    let vis = 0;
    if (t >= tk.semua4 && t < S.untung) vis = clamp01((R - c.d + 6) / 10) + (t >= tk.sendiri + 0.6 ? 1 : 0);
    else if (t >= S.akhir && (c.x + c.z < -4 || Math.abs(c.x - c.z) > 45)) vis = 1;
    vis = Math.min(1, vis);
    c.parts.forEach(([m, h]) => { m.visible = vis > 0.01; m.scale.y = Math.max(0.01, K.backOut(vis)); m.position.y = h * m.scale.y / 2; });
    const hit = R > c.d || (t >= tk.sendiri + 0.6 && t < S.berubah);
    c.mat.emissive.set(late ? "#ffb347" : "#00C2FF"); c.mat.emissiveIntensity = late ? (t >= S.akhir ? 0.35 : 0.12) : hit ? 0.55 + 0.15 * Math.sin(t * 6 + c.d) : 0;
  });

  // ---- factory: belt + arms, no humans working
  fac.boxes.forEach((b, i) => { const x = ((t * 3 + i * 3) % 27) - 13.5; b.position.x = x; });
  fac.arms.forEach((a) => { const s = Math.sin(t * 4 + a.i * 2); a.base.rotation.y = s * 0.8; a.sh.rotation.z = 0.3 + s * 0.2; a.el.rotation.x = 0.5 + Math.cos(t * 4 + a.i) * 0.3; });
  fac.idle.look(Math.sin(t * 2) * 0.5);

  // ---- shop: robot cart roams; lights off and goods pile up in "sunyi"
  const dark = t >= S.sunyi;
  const cx = Math.sin(t * 1.2) * 6; shop.cart.g.position.set(cx, 0, 3 + Math.cos(t * 1.2) * 1.5); shop.cart.g.rotation.y = Math.cos(t * 1.2) > 0 ? Math.PI / 2 : -Math.PI / 2;
  shop.cart.g.visible = !dark; shop.shopper.obj.visible = !dark;
  shop.lampMat.emissiveIntensity = dark ? (Math.floor(t * 9) % 11 === 0 ? 0.6 : 0.03) : 1;
  shop.pile.forEach((b, i) => { const a = tk.barang7 + 0.15 + i * 0.03; b.visible = dark && t >= a; if (b.visible) { const k = clamp01((t - a) / 0.25); b.position.y = (0.5 + Math.floor(i / 10) * 1.02) + (1 - k) * 4; } });
  shop.kscr.visible = !dark;

  // ---- bank: robot tellers bob
  bank.tellers.forEach((b, i) => { b.head.rotation.y = Math.sin(t * 2 + i) * 0.4; b.arms[0].rotation.x = Math.sin(t * 4 + i) * 0.4; });

  // ---- profit: bars grow, arrow rises; payslips shatter on "gaji"
  prof.bars.forEach((b, i) => { const k = span(t, tk.untung - 0.3 + i * 0.12, tk.untung + 0.3 + i * 0.12); const h = lerp(1, 3 + i * 2.6, k); b.scale.y = h; b.position.y = h / 2; });
  const ak = span(t, tk.untung, tk.untung + 1);
  prof.arrow.position.set(lerp(-2, 9, ak), lerp(3, 16, ak), -4); prof.arrow.rotation.z = -0.85; prof.head.position.y = 0.8; prof.shaft.scale.y = 0.001;
  prof.arrow.visible = t >= tk.untung;
  prof.slips.forEach((s, i) => { const a = tk.gaji5 - 0.1 + i * 0.05; s.p.visible = t < a; bill(s.p); s.p.position.y = 1.6 + Math.sin(t * 2 + i) * 0.1; burst(s.px, s.at, t, a, 1); });
  prof.workers.forEach((w, i) => w.look(t > tk.gaji5 ? Math.sin(t * 4 + i) * 0.6 : -0.3));

  // ---- plaza: wallets pop open empty, giant "?" drops
  plaza.people.forEach((p, i) => {
    const a = tk.takde - 0.05 + i * 0.04; p.w.visible = t >= a && t < S.sunyi; p.w.position.copy(p.p.obj.position).add(V(0, 2.9, 0)); p.w.scale.setScalar(1.1 * pop(t, a));
    p.p.look(t > tk.siapa6 ? 0.5 : Math.sin(t + i) * 0.3);
  });
  plaza.shops.forEach((m, i) => (m.emissiveIntensity = lerp(0.6, 0.02, span(t, S.soalan + i * 0.4, S.soalan + 1.5 + i * 0.4))));
  const qd = clamp01((t - (tk.siapa6 + 0.1)) / 0.45);
  plaza.big.visible = t >= tk.siapa6 + 0.1 && t < S.sunyi; plaza.big.position.set(0, lerp(40, 9, qd * qd), 0); plaza.big.scale.setScalar(9 * (t > tk.beli + 0.2 ? 1 + 0.08 * Math.sin(t * 6) : 1));

  // ---- money loop: coins race around, slow down, stop, ring breaks
  const brk = t >= tk.pusing;
  const ang = (() => { // integrated angle: fast, then decelerate to zero at "berhenti"
    const v0 = 2.4, a0 = S.sunyi, t1 = tk.terus7, t2 = tk.berhenti;
    if (t < t1) return (t - a0) * v0;
    if (t < t2) { const d = t - t1, D = t2 - t1; return (t1 - a0) * v0 + v0 * (d - d * d / (2 * D)); }
    return (t1 - a0) * v0 + v0 * (t2 - t1) / 2;
  })();
  loop.coins.forEach((c, i) => {
    const a = ang + i / loop.coins.length * Math.PI * 2;
    if (!brk) { c.position.set(Math.cos(a) * loop.R, 1.3 + Math.sin(t * 8 + i) * 0.1 * (t < tk.berhenti ? 1 : 0), Math.sin(a) * loop.R); c.rotation.set(Math.PI / 2, 0, -a); }
    else { const e = Math.min(1, (t - tk.pusing) / 0.5); c.position.set(Math.cos(a) * (loop.R + e * (1 + (i % 3))), lerp(1.3, 0.1, e * e), Math.sin(a) * (loop.R + e * (1 + (i % 3)))); c.rotation.set(e * 1.5, i, 0); }
  });
  loop.track.visible = !brk; loop.track.material.emissive.set(t >= tk.berhenti ? "#FF4D5E" : "#00C2FF");
  loop.shards.forEach((s) => { s.s.visible = brk; if (brk) { const e = Math.min(1.2, t - tk.pusing); s.s.position.set(Math.cos(s.a) * (loop.R + e * 3), 0.6 + Math.sin(e * 3) * 1.5 - e * 0.6, Math.sin(s.a) * (loop.R + e * 3)); s.s.rotation.set(e * 3, -s.a, e * 2); } });
  loop.redGlow.visible = brk; loop.redGlow.material.opacity = 0.6 + 0.4 * Math.abs(Math.sin(t * 7));

  // ---- stage: KERJA card splits into TUGAS cards; robot takes the repetitive ones
  stage.card.visible = t < tk.tak9; stage.card.position.y = 5 + Math.sin(t * 2) * 0.2; bill(stage.card); stage.card.rotateZ(Math.sin(t * 1.5) * 0.05);
  burst(stage.cardPx, V(0, 5, 0), t, tk.tak9, 1.1);
  stage.what.visible = t >= tk.ke8 - 0.05 && t < tk.tak9; stage.what.scale.setScalar(2.4 * pop(t, tk.ke8 - 0.05));
  stage.bot.head.rotation.y = Math.sin(t * 1.5) * 0.3; stage.hum.look(Math.sin(t * 1.3) * 0.3);
  stage.tasks.forEach((c) => {
    const a = tk.tak9 + 0.05 + c.i * 0.06;
    c.m.visible = t >= a;
    const fan = V(c.ai ? -2.8 : 2.8, 8.6 - (c.i % 3) * 1.5, 0.5);
    const side = c.ai ? V(-5.5 + 2.9, 3.4 + (c.i % 3) * 1.45, 0.8) : V(5.5 - 2.9, 3.4 + ((c.i - 3) % 3) * 1.45, 0.8);
    const sk = span(t, tk.sebab9 + c.i * 0.12, tk.sebab9 + 0.6 + c.i * 0.12);
    const p = V(0, 5, 0).lerp(fan, K.backOut(clamp01((t - a) / 0.45))).lerp(side, sk);
    c.m.position.copy(p); bill(c.m);
    const spin = c.ai && t >= tk.sebab9 + 0.7 ? Math.sin((t - tk.sebab9) * 18) * 0.1 : 0; c.m.rotateZ(spin);
    c.m.scale.setScalar(lerp(1, 0.75, sk) * (c.m.visible ? pop(t, a, 0.3) : 1));
    const ta = tk.sebab9 + 1.1 + c.i * 0.25; c.tk.visible = c.ai && t >= ta; c.tk.position.copy(p).add(V(2.1, 0.5, 0.2)); c.tk.scale.setScalar(0.9 * pop(t, ta));
  });

  // ---- human stations
  const sal = t >= tk.salah + 0.1 && t < tk.check + 0.4;
  hum.salah.visible = sal; hum.salah.scale.set(3 * pop(t, tk.salah + 0.1), 0.94 * pop(t, tk.salah + 0.1), 1);
  hum.scr.material.color.set(t >= tk.salah + 0.1 && t < tk.check ? "#ff9aa4" : "#ffffff");
  hum.tick1.visible = t >= tk.check; hum.tick1.scale.setScalar(1.6 * pop(t, tk.check));
  hum.p1.look(Math.sin(t * 2) * 0.3);
  const press = t >= tk.keputusan + 0.2 ? Math.max(0, 1 - Math.abs(t - tk.keputusan - 0.35) / 0.15) : 0;
  hum.btn.position.y = 1.6 - press * 0.25;
  hum.lulus.visible = t >= tk.keputusan + 0.35; hum.lulus.scale.set(3 * pop(t, tk.keputusan + 0.35), 0.94 * pop(t, tk.keputusan + 0.35), 1);
  hum.heart.visible = t >= tk.perasaan + 0.2; hum.heart.scale.setScalar(1.8 * pop(t, tk.perasaan + 0.2) * (1 + 0.1 * Math.sin(t * 8)));
  hum.p3.look(Math.sin(t * 1.5) * 0.2); hum.c3.look(Math.sin(t * 1.3 + 1) * 0.2);
  hum.sig.scale.x = Math.max(0.001, span(t, tk.tanggung + 0.2, tk.tanggung + 1)); hum.sig.position.x = -0.1 - (1 - hum.sig.scale.x) * 0.5;
  hum.stamp.visible = t >= tk.tanggung + 1.15; hum.stamp.position.y = 1.21 + (1 - clamp01((t - tk.tanggung - 1.15) / 0.15)) * 0.6;
  hum.glows.forEach((g, i) => { const a = tk.jadi10 + 0.6 + i * 0.25; g.visible = t >= a && t < S.berubah; g.scale.setScalar(7 * pop(t, a, 0.4) * (1 + 0.1 * Math.sin(t * 5 + i))); });
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
