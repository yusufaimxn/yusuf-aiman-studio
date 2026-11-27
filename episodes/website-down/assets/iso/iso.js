// Isometric 3D world for "Apa Jadi Kalau Semua Website Dunia Down?".
// Pure function of timeline time: draw(t) runs on every hf-seek with absolute seconds.
import * as THREE from "../vendor/three.module.js";
import * as K from "./kit.js";
import { buildPhone, buildServerBlock, ICON } from "./phone.js";
import { buildBrowserWall, cityPanels, buildSearch, buildCart, buildStudy, buildOffice, buildJourney, buildStreet, WT } from "./web.js";

const T = window.YA_T, S = T.scenes, L = (n) => T.lines[n];
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
const H0 = V(0, 0, -500), G0 = V(-500, 0, 0), C0 = V(-500, 0, 60), A0 = V(-500, 0, 120), O0 = V(-500, 0, 200), P0 = V(-500, 0, 300);
const J0 = V(500, 0, 0), SV = V(500, 0, 150), T0 = V(500, 0, 300);
const wall = buildBrowserWall(scene, H0);
const town = K.buildTown(THREE, scene);
town.people.forEach((p) => { p.bubble.visible = false; p.clock.visible = false; });
town.queue.forEach((q) => (q.obj.visible = false)); town.terminal.x.visible = false; town.cashSign.visible = false;
const panels = cityPanels(scene, town);
const search = buildSearch(scene, G0), cart = buildCart(scene, C0), study = buildStudy(scene, A0), office = buildOffice(scene, O0);
const jr = buildJourney(scene, J0), srv = buildServerBlock(scene, SV), street = buildStreet(scene, T0);
srv.coin.visible = srv.acct.visible = false; srv.coin.scale.setScalar(0.001); srv.acct.scale.setScalar(0.001);
// apps: giant phone on a small plinth
const phone = buildPhone(scene); phone.group.position.copy(P0).add(V(0, 7.4, 0)); phone.group.rotation.set(-0.08, Math.PI / 4, 0, "YXZ");
{ const pl = new THREE.Group(); pl.position.copy(P0); scene.add(pl); K.box(16, 0.6, 16, K.std("#E9D5B5"), 0, -0.3, 0, pl); K.box(5, 0.8, 2.6, K.std("#334155"), 0, 0.4, 0, pl).rotation.y = Math.PI / 4; }
const spinners = phone.icons.filter((ic) => !ic.system).map((ic, i) => {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.9), new THREE.MeshBasicMaterial({ map: WT.spin, transparent: true, toneMapped: false, depthWrite: false }));
  m.position.set(ic.x, ic.y, 0.66); phone.group.add(m);
  const dim = new THREE.Mesh(new THREE.PlaneGeometry(1.12, 1.12), new THREE.MeshBasicMaterial({ color: "#0b1220", transparent: true, opacity: 0, toneMapped: false, depthWrite: false }));
  dim.position.set(ic.x, ic.y, 0.64); phone.group.add(dim);
  return { m, ic, i, dim };
});
// biasa: a web page assembles above the small phone of the server block
const PG = SV.clone().add(V(-5, 7.6, 6));
const page = new THREE.Group(); page.position.copy(PG); scene.add(page);
const pmat = (map, color) => new THREE.MeshBasicMaterial({ map: map || null, color: color || "#ffffff", transparent: true, toneMapped: false, side: THREE.DoubleSide });
const pBack = new THREE.Mesh(new THREE.PlaneGeometry(6, 8), pmat(null, "#F5F7FA")); page.add(pBack);
const blocks = [
  new THREE.Mesh(new THREE.PlaneGeometry(5.4, 1.1), pmat(null, "#0066DE")),
  new THREE.Mesh(new THREE.PlaneGeometry(2.5, 2.5), pmat(ICON.photo)),
  new THREE.Mesh(new THREE.PlaneGeometry(2.5, 2.5), pmat(ICON.play)),
  new THREE.Mesh(new THREE.PlaneGeometry(5.4, 1.2), pmat(ICON.card ? null : null, "#FF8A00")),
];
[[0, 3.1], [-1.35, 1.0], [1.35, 1.0], [0, -1.6]].forEach(([x, y], i) => { blocks[i].position.set(x, y, 0.05); page.add(blocks[i]); });
const btn = new THREE.Mesh(new THREE.PlaneGeometry(3, 1), pmat(null, "#22C55E")); btn.position.set(0, -3.1, 0.05); page.add(btn); blocks.push(btn);
const errPanel = new THREE.Mesh(new THREE.PlaneGeometry(9, 6.75), pmat(WT.err)); scene.add(errPanel);
const waitClock = K.sprite(K.TEX.clock, 2.4, scene); waitClock.visible = false;

// ---------------------------------------------------------------- shots
const ISO = [1, 0.82, 1];
const shopAt = WD(3, "shopping") - 0.35, errClose = WD(10, "je") - 0.25;
const req = { t0: WD(8, "request") - 0.35, dns: WD(8, "alamat") + 0.15, leave: WD(8, "lepas") - 0.2, knock: WD(8, "ketuk") + 0.05 };
const SHOTS = [
  { t0: 0, from: { p: H0.clone().add(V(-1, 12, 0)), h: 34 }, to: { p: H0.clone().add(V(0, 12.5, 0)), h: 27 }, dir: [0.35, 0.3, 1], fy: 0.2, bg: "#0f2a55", night: 0.4 },
  { t0: S.bandar, from: { p: V(0, 0, -6), h: 55 }, to: { p: V(0, 6, -10), h: 150 }, dir: ISO, fy: 0, bg: "#0b1530", night: 1 },
  { t0: S.google, from: { p: G0.clone().add(V(0, 4, 0)), h: 23 }, to: { p: G0.clone().add(V(0.5, 4, 0)), h: 19 }, dir: ISO, fy: 0, bg: "#cfe8f7" },
  { t0: shopAt, from: { p: C0.clone().add(V(0, 3, 0)), h: 24 }, to: { p: C0.clone().add(V(0, 3, 0)), h: 19 }, dir: ISO, fy: 0, bg: "#fde7d1" },
  { t0: S.assign, from: { p: A0.clone().add(V(0, 4.2, -3)), h: 18 }, to: { p: A0.clone().add(V(0, 4.4, -3.5)), h: 13 }, dir: ISO, fy: 0, bg: "#0f1d3a", night: 0.7 },
  { t0: S.office, from: { p: O0.clone().add(V(0, 3, 0)), h: 36 }, to: { p: O0.clone().add(V(1, 3, -1)), h: 28 }, dir: ISO, fy: 0, bg: "#dbeafe" },
  { t0: S.apps, from: { p: P0.clone().add(V(0, 7.4, 0)), h: 18 }, to: { p: P0.clone().add(V(0, 7.4, 0)), h: 15.5 }, dir: [1, 0.4, 1], fy: 0.06, bg: "#cfe8f7" },
  { t0: S.tanya, from: { p: P0.clone().add(V(0, 7.4, 0)), h: 28 }, to: { p: P0.clone().add(V(0, 7.4, 0)), h: 26 }, dir: [1, 0.4, 1], fy: 0.22, bg: "#cfe8f7" },
  { t0: S.request, follow: true, h0: 30, h1: 26, dir: ISO, fy: 0, bg: "#9fd3f5" },
  { t0: S.biasa, from: { p: SV.clone().add(V(-1, 5, 0.5)), h: 46 }, to: { p: SV.clone().add(V(-1, 5, 0.5)), h: 42 }, dir: ISO, fy: -0.02, bg: "#0f2a55" },
  { t0: S.error, from: { p: SV.clone().add(V(-1, 5, 0.5)), h: 44 }, to: { p: SV.clone().add(V(-1, 5, 0.5)), h: 41 }, dir: ISO, fy: -0.02, bg: "#2a0f1a" },
  { t0: errClose, from: { p: SV.clone().add(V(-5, 6, 6)), h: 24 }, to: { p: SV.clone().add(V(-5, 6, 6)), h: 21 }, dir: ISO, fy: 0, bg: "#2a0f1a" },
  { t0: S.faham, from: { p: T0.clone().add(V(0, 3, -2)), h: 36 }, to: { p: T0.clone().add(V(-2, 3, -2)), h: 31 }, dir: ISO, fy: 0.22, bg: "#9fd3f5" },
  { t0: S.akhir, from: { p: T0.clone().add(V(4, 3, -3)), h: 32 }, to: { p: T0.clone().add(V(2, 3, -3)), h: 28 }, dir: ISO, fy: 0.16, bg: "#9fd3f5" },
];
SHOTS.forEach((s, i) => (s.t1 = i + 1 < SHOTS.length ? SHOTS[i + 1].t0 : T.total));
function shotAt(t) { let s = SHOTS[0]; for (const x of SHOTS) if (t >= x.t0) s = x; return s; }

// polyline sampler (by length)
function along(pts, u) {
  const segs = []; let tot = 0;
  for (let i = 1; i < pts.length; i++) { const l = pts[i].distanceTo(pts[i - 1]); segs.push(l); tot += l; }
  let d = clamp01(u) * tot;
  for (let i = 0; i < segs.length; i++) { if (d <= segs[i] || i === segs.length - 1) return pts[i].clone().lerp(pts[i + 1], Math.min(1, d / segs[i])); d -= segs[i]; }
  return pts[pts.length - 1].clone();
}
function arrowPos(t) {
  const P = jr.path;
  if (t < req.t0) return P.home[0].clone();
  if (t < req.t0 + 1.0) return along(P.home, ease((t - req.t0) / 1.0));
  if (t < req.dns) return along(P.toDns, ease((t - req.t0 - 1.0) / (req.dns - req.t0 - 1.0)));
  if (t < req.leave) return P.toDns[2].clone().add(V(0, Math.sin((t - req.dns) * 6) * 0.15, 0));
  if (t < req.knock) return along(P.toDc, ease((t - req.leave) / (req.knock - req.leave)));
  const k = t - req.knock, end = P.toDc[3].clone();
  if (k < 0.95) end.z -= Math.max(0, Math.sin((k % 0.3) / 0.3 * Math.PI)) * 0.8;
  return end;
}

const tmp = new THREE.Vector3();
function frame(s, t) {
  const u = clamp01((t - s.t0) / Math.max(0.01, s.t1 - s.t0)), k = ease(u) * 0.6 + u * 0.4;
  let target, h;
  if (s.follow) { target = arrowPos(t - 0.1).add(V(0, 1.5, 0)); h = lerp(s.h0, s.h1, k); }
  else { target = s.from.p.clone().lerp(s.to.p, k); h = lerp(s.from.h, s.to.h, k); }
  target.y -= s.fy * h;
  const d = tmp.set(...s.dir).normalize();
  cam.position.copy(target).addScaledVector(d, 400); cam.up.set(0, 1, 0); cam.lookAt(target);
  const w = h * W / H; cam.left = -w / 2; cam.right = w / 2; cam.top = h / 2; cam.bottom = -h / 2; cam.updateProjectionMatrix();
  sun.position.copy(target).add(V(-35, 60, 30)); sun.target.position.copy(target);
  const sc = sun.shadow.camera, r = Math.max(h, w) * 0.85;
  sc.left = -r; sc.right = r; sc.top = r; sc.bottom = -r; sc.near = 1; sc.far = 240; sc.updateProjectionMatrix();
  scene.background.set(s.bg);
  const night = s.night || 0; hemi.intensity = lerp(1.15, 0.55, night); sun.intensity = lerp(2.5, 0.9, night);
}

// ---------------------------------------------------------------- world state at t
const W1 = WD(1, "tapi") - 0.25;
function state(t) {
  // hook: browser windows flip to error like dominoes, toward the camera
  wall.panels.forEach((p) => {
    const at = W1 + (p.ord / 6.5) * 2.4, f = t >= at;
    p.m.material.map = f ? WT.err : p.ok;
    const pop = f ? 1 + 0.18 * Math.sin(clamp01((t - at) / 0.25) * Math.PI) : 1;
    p.m.scale.setScalar(pop);
    p.m.position.y = p.y + Math.sin(t * 1.4 + p.ph) * 0.25;
  });
  // town: error spreads from the centre outward while the windows (internet) stay lit
  town.setWindows((x, z, seed) => seed > 0.3);
  const ringR = lerp(0, 170, span(t, WD(2, "semua") - 0.2, WD(2, "down") + 0.4));
  panels.forEach((p) => {
    const bad = t >= S.bandar && p.d < ringR;
    p.s.material.map = bad ? WT.err : p.ok;
    p.s.position.y = p.y + 1.2 + Math.sin(t * 2 + p.x) * 0.3;
    const near = Math.abs(p.d - ringR) < 12 ? 1.25 : 1; p.s.scale.set(7.5 * near, 5.6 * near, 1);
  });
  // google: endless spinner, person confused
  search.spin.material.rotation = -t * 6;
  const tb = WD(3, "Tak");
  search.bar.position.x = t > tb && t < tb + 0.4 ? Math.sin((t - tb) * 60) * 0.25 : 0;
  search.people.forEach((p, i) => { p.look(Math.sin(t * 2 + i) * 0.3); p.obj.position.y = Math.abs(Math.sin(t * 8 + i)) * 0.06; });
  search.q.visible = t > tb && t < S.assign; search.q.position.copy(G0).add(V(1.5, 3.4, 3));
  // shopping: cart rolls, then jams and shakes, goods tumble, van stops with "?"
  cart.spin.material.rotation = -t * 6;
  const roll = clamp01((t - shopAt) / 0.8), jam = WD(3, "Pun");
  cart.cart.position.x = -4 + 3 * ease(roll) + (t > jam ? Math.sin((t - jam) * 40) * 0.12 * Math.exp(-(t - jam) * 2) : 0);
  cart.goods.forEach((g, i) => {
    const fall = clamp01((t - jam - g.s * 1.2) / 0.5);
    g.b.position.y = g.y0 + (g.s > 0.6 ? -fall * fall * 2.2 : 0); g.b.position.x = g.x0 + (g.s > 0.6 ? fall * 3 : 0);
    g.b.rotation.z = g.s > 0.6 ? fall * 1.4 : 0;
  });
  cart.q.visible = t > WD(3, "asyik"); cart.q.scale.setScalar(2 * K.backOut(clamp01((t - WD(3, "asyik")) / 0.3)));
  // assignment: upload races to 99% then fails
  if (t >= S.assign - 0.2 && t < S.office + 0.2) {
    const bad = t >= WD(4, "tak");
    study.paint(bad ? 0.99 : lerp(0.35, 0.99, span(t, S.assign, WD(4, "portal"))), bad);
  }
  study.clock.material.rotation = -t * 9;
  study.person.look(t >= WD(4, "tak") ? Math.sin(t * 6) * 0.3 : 0);
  // office: emails fly, stall and drop; meeting wall cuts out; monitors die; "?" over workers
  const eStop = WD(5, "tak");
  office.mails.forEach((m) => {
    const a = S.office + m.d * 0.9, k = clamp01((t - a) / 1.6), kk = Math.min(k, clamp01((eStop - a) / 1.6));
    m.s.visible = t >= a && t < S.apps;
    const x = lerp(m.x0, m.x1, kk), z = lerp(m.z0, m.z1, kk), drop = t > eStop ? (t - eStop) : 0;
    m.s.position.copy(O0).add(V(x, m.y0 + Math.sin(kk * Math.PI) * 2 - drop * drop * 9, z));
    m.s.material.opacity = 1 - clamp01((drop - 0.6) / 0.3); m.s.material.color.setScalar(t > eStop ? 0.6 : 1);
  });
  const cut = WD(5, "meeting");
  office.wall.material.map = t >= WD(5, "terputus") - 0.1 ? WT.callOff : WT.callOn;
  office.monitors.forEach((m) => { m.mat.emissiveIntensity = t >= cut + m.ord * 1.2 ? 0 : 1.2; });
  office.workers.forEach((w) => { const at = cut + 0.4 + w.ord * 1.0; w.q.visible = t >= at && t < S.apps; w.q.scale.setScalar(1.3 * K.backOut(clamp01((t - at) / 0.3))); w.p.look(Math.sin(t + w.ord * 5) * 0.4); });
  // apps: every online app spins, then greys out
  const dn = WD(6, "down");
  spinners.forEach(({ m, ic, i, dim }) => {
    dim.material.opacity = t >= dn + i * 0.02 ? 0.62 : 0;
    const on = S.apps + 0.2 + (i % 7) * 0.12;
    m.visible = t >= on && t < dn + 0.1; m.rotation.z = -t * 6 - i;
      });
  // request journey
  const ap = arrowPos(t), ap2 = arrowPos(t + 0.05);
  const inJ = t >= S.request - 0.1 && t < S.biasa;
  jr.arrow.visible = inJ;
  if (inJ) {
    jr.arrow.position.copy(ap); if (ap2.distanceTo(ap) > 0.001) jr.arrow.lookAt(ap2);
    jr.trail.forEach((s, i) => { s.visible = t > req.t0; s.position.copy(arrowPos(t - 0.05 * (i + 1))); });
  } else jr.trail.forEach((s) => (s.visible = false));
  jr.tag.visible = inJ && t >= req.dns + 0.15;
  if (jr.tag.visible) { jr.tag.position.copy(ap).add(V(0, 2.2, 0)); const k = K.backOut(clamp01((t - req.dns - 0.15) / 0.3)); jr.tag.scale.set(3.6 * k, 1.2 * k, 1); }
  jr.book.rotation.y = t >= req.dns ? Math.sin((t - req.dns) * 3) * 0.6 : 0;
  jr.door.material.emissive = jr.door.material.emissive || new THREE.Color(0);
  jr.door.material.emissive.setHex(t >= req.knock && t < req.knock + 1 && ((t - req.knock) % 0.3) < 0.12 ? 0x0066de : 0x000000);
  // biasa: data flies back (server -> phone) and the page builds block by block
  const bi = t >= S.biasa && t < S.error;
  srv.tube.material.opacity = (bi || (t >= S.error && t < errClose)) ? 0.55 : 0;
  srv.pulses.forEach((s, i) => { s.visible = bi; if (bi) s.position.copy(srv.curve.getPoint(1 - (((t - S.biasa) * 0.6 + i / 10) % 1))); });
  page.visible = bi; page.quaternion.copy(cam.quaternion);
  const beats = [S.biasa + 0.3, WD(9, "gambar"), WD(9, "video"), WD(9, "harga"), WD(9, "Semua")];
  blocks.forEach((b, i) => { const k = clamp01((t - beats[i]) / 0.35); b.visible = t >= beats[i]; b.scale.setScalar(Math.max(0.001, K.backOut(k))); });
  pBack.scale.y = Math.max(0.001, ease(clamp01((t - S.biasa) / 0.3)));
  // error: racks go red, the request waits, gives up, error page slams down
  const er = t >= S.error;
  srv.rackMat.emissive.set(er ? "#ff3b4a" : "#ffffff"); srv.rackMat.emissiveIntensity = er ? 0.5 + 0.4 * Math.abs(Math.sin(t * 4)) : 0.6;
  const go = S.error + 0.3, arrive = S.error + 1.5, back = WD(10, "browser") - 0.2;
  if (er && t < errClose + 0.2) {
    jr.arrow.visible = true;
    const u = t < arrive ? ease((t - go) / (arrive - go)) : (t < back ? 1 : 1 - ease((t - back) / 0.8));
    const p = srv.curve.getPoint(clamp01(u)), p2 = srv.curve.getPoint(clamp01(u + (t < back ? 0.02 : -0.02)));
    jr.arrow.position.copy(p); jr.arrow.lookAt(p2);
    jr.trail.forEach((s, i) => { s.visible = true; s.position.copy(srv.curve.getPoint(clamp01(u - (t < back ? 1 : -1) * 0.025 * (i + 1)))); });
  }
  waitClock.visible = er && t >= arrive && t < back + 0.3;
  if (waitClock.visible) { waitClock.position.copy(srv.curve.getPoint(1)).add(V(0, 3.2, 0)); waitClock.material.rotation = -(t - arrive) * 7; }
  const eAt = WD(10, "Error") - 0.15;
  errPanel.visible = er && t >= eAt - 0.4;
  if (errPanel.visible) {
    const k = clamp01((t - eAt + 0.4) / 0.4);
    errPanel.position.copy(SV).add(V(-5, 5.4 + (1 - k * k) * 14, 6));
    const sq = t > eAt ? 1 + 0.25 * Math.exp(-(t - eAt) * 8) * Math.sin((t - eAt) * 30) : 1;
    errPanel.scale.set(sq, 2 - sq, 1); errPanel.quaternion.copy(cam.quaternion);
  }
  // street: data cars keep flowing (internet OK) while shop shutters roll down
  street.cars.forEach((c) => { const x = (((t * c.v + c.off) % 56) + 56) % 56 - 28; c.c.position.set(x, 0, c.lane); c.c.rotation.y = c.v > 0 ? 0 : Math.PI; });
  const tu = WD(12, "tutup") - 0.6;
  street.shops.forEach((s, i) => {
    const k = ease((t - tu - i * 0.16) / 0.5); s.sh.scale.y = Math.max(0.001, k);
    s.win.material.emissiveIntensity = 0.9 * (1 - k);
  });
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
