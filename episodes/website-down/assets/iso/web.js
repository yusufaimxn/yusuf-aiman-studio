// Web-world pieces for "Apa Jadi Kalau Semua Website Dunia Down?" (generic UI, no real brands).
import * as THREE from "../vendor/three.module.js";
import { std, box, canvasTex, rr, FONT, person, sprite, rng, TEX } from "./kit.js";
import { ICON } from "./phone.js";

// ---------------------------------------------------------------- textures
export function browserTex(state, seed = 1) {
  const r = rng(seed * 13 + 5);
  return canvasTex(512, 384, (g) => {
    g.fillStyle = "#ffffff"; rr(g, 4, 4, 504, 376, 28); g.fill();
    g.fillStyle = state === "err" ? "#FF4D5E" : "#E2E8F0"; rr(g, 4, 4, 504, 56, 28); g.fill(); g.fillRect(4, 36, 504, 24);
    ["#FF5F57", "#FEBC2E", "#28C840"].forEach((c, i) => { g.fillStyle = state === "err" ? "#ffffff" : c; g.beginPath(); g.arc(34 + i * 28, 32, 9, 0, 7); g.fill(); });
    g.fillStyle = state === "err" ? "rgba(255,255,255,0.85)" : "#ffffff"; rr(g, 130, 16, 350, 32, 16); g.fill();
    if (state === "err") {
      g.fillStyle = "#FF4D5E"; g.beginPath(); g.arc(256, 180, 66, 0, 7); g.fill();
      g.strokeStyle = "#fff"; g.lineWidth = 18; g.lineCap = "round"; g.beginPath(); g.moveTo(226, 150); g.lineTo(286, 210); g.moveTo(286, 150); g.lineTo(226, 210); g.stroke();
      g.fillStyle = "#1F2937"; g.font = FONT(40); g.textAlign = "center"; g.fillText("TAK DAPAT DIBUKA", 256, 316);
    } else {
      const cols = ["#0066DE", "#FF8A00", "#22C55E", "#8B5CF6", "#00C2FF", "#E23B3B"];
      g.fillStyle = cols[Math.floor(r() * 6)]; rr(g, 28, 80, 456, 70, 14); g.fill();
      g.fillStyle = "#CBD5E1"; rr(g, 28, 168, 210, 150, 14); g.fill();
      g.fillStyle = cols[Math.floor(r() * 6)]; g.beginPath(); g.moveTo(40, 300); g.lineTo(110, 220); g.lineTo(160, 270); g.lineTo(190, 245); g.lineTo(226, 300); g.fill();
      g.fillStyle = "#E2E8F0"; for (let i = 0; i < 4; i++) { rr(g, 258, 172 + i * 32, 226 - (i % 2) * 60, 18, 9); g.fill(); }
      g.fillStyle = cols[Math.floor(r() * 6)]; rr(g, 258, 300, 130, 40, 20); g.fill();
    }
  });
}
const spinTex = canvasTex(256, 256, (g) => {
  g.fillStyle = "rgba(11,30,63,0.85)"; g.beginPath(); g.arc(128, 128, 120, 0, 7); g.fill();
  g.lineWidth = 26; g.lineCap = "round"; g.strokeStyle = "rgba(255,255,255,0.25)"; g.beginPath(); g.arc(128, 128, 70, 0, 7); g.stroke();
  g.strokeStyle = "#00C2FF"; g.beginPath(); g.arc(128, 128, 70, -Math.PI / 2, Math.PI * 0.6); g.stroke();
});
const searchTex = canvasTex(1024, 192, (g) => {
  g.fillStyle = "#ffffff"; rr(g, 6, 6, 1012, 180, 90); g.fill(); g.strokeStyle = "#CBD5E1"; g.lineWidth = 8; rr(g, 6, 6, 1012, 180, 90); g.stroke();
  g.strokeStyle = "#64748B"; g.lineWidth = 14; g.beginPath(); g.arc(100, 88, 34, 0, 7); g.stroke(); g.beginPath(); g.moveTo(124, 112); g.lineTo(150, 140); g.stroke();
  g.fillStyle = "#1F2937"; g.font = FONT(64, 700); g.fillText("cari apa-apa…", 190, 118);
});
const payTex = canvasTex(512, 192, (g) => { g.fillStyle = "#FF8A00"; rr(g, 6, 6, 500, 180, 60); g.fill(); g.fillStyle = "#fff"; g.font = FONT(96); g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("BAYAR", 256, 100); });
const mailTex = canvasTex(256, 256, (g) => {
  g.fillStyle = "#ffffff"; rr(g, 20, 54, 216, 148, 18); g.fill(); g.strokeStyle = "#0066DE"; g.lineWidth = 12; g.beginPath(); g.moveTo(30, 66); g.lineTo(128, 140); g.lineTo(226, 66); g.stroke();
});
const callTex = (on) => canvasTex(512, 320, (g) => {
  g.fillStyle = "#0B1E3F"; g.fillRect(0, 0, 512, 320);
  if (!on) { g.fillStyle = "#FF4D5E"; g.font = FONT(44); g.textAlign = "center"; g.fillText("TERPUTUS", 256, 176); return; }
  const C = ["#0066DE", "#FF8A00", "#22C55E", "#8B5CF6"];
  C.forEach((c, i) => { const x = 12 + (i % 2) * 250, y = 12 + Math.floor(i / 2) * 152; g.fillStyle = "#13294f"; rr(g, x, y, 238, 142, 14); g.fill();
    g.fillStyle = c; g.beginPath(); g.arc(x + 119, y + 60, 30, 0, 7); g.fill(); g.beginPath(); g.arc(x + 119, y + 140, 52, Math.PI, 0); g.fill(); });
});
const tagTex = canvasTex(384, 128, (g) => { g.fillStyle = "#22C55E"; rr(g, 4, 4, 376, 120, 40); g.fill(); g.fillStyle = "#fff"; g.font = FONT(56); g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("ALAMAT ✓", 192, 68); });
const labelTex = (text, bg, fg, w = 768, h = 160, px = 80) => canvasTex(w, h, (g) => { g.fillStyle = bg; rr(g, 6, 6, w - 12, h - 12, 36); g.fill(); g.fillStyle = fg; g.font = FONT(px); g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(text, w / 2, h / 2 + 4); });
export const WT = { spin: spinTex, mail: mailTex, callOn: callTex(true), callOff: callTex(false), tag: tagTex, err: browserTex("err", 0) };

const plane = (w, h, map, o = {}) => new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map, transparent: true, toneMapped: false, side: THREE.DoubleSide, ...o }));
function island(g, w, d, col = "#bfe0a6", side = "#8a6a4a") {
  box(w, 0.6, d, std(col), 0, -0.3, 0, g); box(w, 2.4, d, std(side), 0, -1.9, 0, g);
}

// ---------------------------------------------------------------- hook: wall of floating browser windows
export function buildBrowserWall(scene, at) {
  const g = new THREE.Group(); g.position.copy(at); scene.add(g);
  const okT = [], panels = [];
  for (let i = 0; i < 6; i++) okT.push(browserTex("ok", i + 1));
  const r = rng(99);
  for (let row = 0; row < 5; row++) for (let col = 0; col < 4; col++) {
    const m = plane(5.2, 3.9, okT[(row * 4 + col) % 6]);
    const x = -8.6 + col * 5.7 + (r() - 0.5) * 0.8, y = 3 + row * 4.4 + (r() - 0.5) * 0.6, z = -row * 1.2 + (r() - 0.5) * 2;
    m.position.set(x, y, z); m.rotation.y = (r() - 0.5) * 0.4; g.add(m);
    panels.push({ m, x, y, z, ok: okT[(row * 4 + col) % 6], ord: row * 4 + (3 - col) * 0.6 + r() * 1.5, ph: r() * 6 });
  }
  return { group: g, panels };
}

// ---------------------------------------------------------------- town: a website panel floating above each building
export function cityPanels(scene, town) {
  const okT = [1, 2, 3, 4].map((s) => browserTex("ok", s + 10));
  const out = [];
  town.towers.forEach((tw, i) => {
    if (i % 2) return;
    const h = tw.group.children[0].geometry.parameters.height;
    const s = sprite(okT[i % 4], 7.5, scene); s.scale.set(7.5, 5.6, 1); s.position.set(tw.x, h + 4.2, tw.z);
    out.push({ s, x: tw.x, z: tw.z, y: h + 4.2, ok: okT[i % 4], d: Math.hypot(tw.x, tw.z) });
  });
  return out;
}

// ---------------------------------------------------------------- search island + shopping island
export function buildSearch(scene, at) {
  const g = new THREE.Group(); g.position.copy(at); scene.add(g);
  island(g, 18, 14);
  const hill = new THREE.Mesh(new THREE.CylinderGeometry(4, 6, 1.4, 10), std("#a3d48a")); hill.position.set(-3, 0.7, -2); hill.castShadow = hill.receiveShadow = true; g.add(hill);
  const bar = new THREE.Group(); bar.position.set(0, 5.5, -2); g.add(bar);
  box(13, 2.6, 0.6, std("#ffffff"), 0, 0, 0, bar);
  const face = plane(12.6, 2.36, searchTex); face.position.z = 0.31; bar.add(face);
  const spin = sprite(spinTex, 2.6, scene); spin.position.copy(at).add(new THREE.Vector3(0, 9.6, -2));
  const p = person(21); p.obj.position.set(1.5, 0, 3); p.obj.rotation.y = Math.PI + 0.3; p.obj.scale.setScalar(1.3); g.add(p.obj);
  const p2 = person(22); p2.obj.position.set(-4, 0, 4); p2.obj.rotation.y = Math.PI - 0.4; p2.obj.scale.setScalar(1.3); g.add(p2.obj);
  for (const [x, z] of [[7, 4], [-7, -4], [6.5, -5]]) { const tr = new THREE.Mesh(new THREE.ConeGeometry(1, 2.6, 7), std("#4ade80")); tr.position.set(x, 1.3, z); tr.castShadow = true; g.add(tr); }
  const q = sprite(TEX.what, 1.6, scene); q.visible = false;
  return { group: g, bar, spin, people: [p, p2], q };
}
export function buildCart(scene, at) {
  const g = new THREE.Group(); g.position.copy(at); scene.add(g);
  island(g, 20, 14, "#e2e8f0", "#94a3b8");
  const cart = new THREE.Group(); cart.position.set(-1, 0, 0); g.add(cart);
  const metal = std("#cbd5e1", { metalness: 0.5, roughness: 0.35 }), red = std("#E23B3B");
  box(6, 0.2, 3.6, metal, 0, 1.6, 0, cart);
  for (const [x, z, w, d] of [[0, 1.8, 6, 0.15], [0, -1.8, 6, 0.15], [3, 0, 0.15, 3.6], [-3, 0, 0.15, 3.6]]) box(w, 2.6, d, new THREE.MeshStandardMaterial({ color: "#94a3b8", transparent: true, opacity: 0.55 }), x, 2.9, z, cart);
  box(0.25, 2.8, 0.25, metal, -3.4, 3.2, 1.6, cart); box(0.25, 2.8, 0.25, metal, -3.4, 3.2, -1.6, cart); box(0.4, 0.4, 3.6, red, -3.6, 4.6, 0, cart);
  for (const [x, z] of [[2.4, 1.4], [2.4, -1.4], [-2.4, 1.4], [-2.4, -1.4]]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.3, 12), std("#111827")); w.rotation.x = Math.PI / 2; w.position.set(x, 0.45, z); cart.add(w); box(0.15, 1.2, 0.15, metal, x, 1.0, z, cart); }
  const goods = []; const r = rng(5); const GC = ["#0066DE", "#FF8A00", "#22C55E", "#8B5CF6", "#F472B6", "#FCD34D"];
  for (let i = 0; i < 9; i++) { const b = box(1.2 + r() * 0.5, 1 + r() * 0.9, 1.1, std(GC[i % 6]), -2 + (i % 3) * 2, 2.3 + Math.floor(i / 3) * 0.9, -1 + (i % 2) * 1.6, cart); b.rotation.y = r() - 0.5; goods.push({ b, y0: b.position.y, x0: b.position.x, s: r() }); }
  const pay = plane(5, 1.9, payTex); pay.position.set(5, 3.6, 3.6); pay.rotation.y = 0.2; g.add(pay);
  const spin = sprite(spinTex, 2.6, scene); spin.position.copy(at).add(new THREE.Vector3(-1, 8.2, 0));
  // delivery van with "?"
  const van = new THREE.Group(); van.position.set(6, 0, -3.5); van.rotation.y = 0.3; g.add(van);
  box(4.4, 2.6, 2.2, std("#F5F7FA"), -0.4, 1.7, 0, van); box(1.6, 1.8, 2.2, std("#0066DE"), 2.4, 1.3, 0, van);
  for (const [x, z] of [[-1.8, 1.1], [-1.8, -1.1], [2.2, 1.1], [2.2, -1.1]]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.3, 10), std("#111827")); w.rotation.x = Math.PI / 2; w.position.set(x, 0.45, z); van.add(w); }
  const q = sprite(TEX.what, 2, scene); q.position.copy(at).add(new THREE.Vector3(6, 5.4, -3.5)); q.visible = false;
  return { group: g, cart, goods, spin, q };
}

// ---------------------------------------------------------------- student room at night: upload stuck at 99%
export function buildStudy(scene, at) {
  const g = new THREE.Group(); g.position.copy(at); scene.add(g);
  box(14, 0.6, 14, std("#a1887f"), 0, -0.3, 0, g);
  box(14, 10, 0.4, std("#3b4a6b"), 0, 5, -7, g); box(0.4, 10, 14, std("#2f3d5c"), -7, 5, 0, g);
  box(0.2, 3.4, 4.4, new THREE.MeshBasicMaterial({ color: "#1e3a8a" }), -6.75, 6.4, -1, g);
  const moon = new THREE.Mesh(new THREE.CircleGeometry(0.6, 20), new THREE.MeshBasicMaterial({ color: "#fef3c7" })); moon.position.set(-6.6, 7.2, -0.2); moon.rotation.y = Math.PI / 2; g.add(moon);
  box(7, 0.3, 3.2, std("#c08457"), 0, 3, -4.8, g); for (const x of [-3.2, 3.2]) box(0.3, 3, 3, std("#8b5e3c"), x, 1.5, -4.8, g);
  box(3.4, 0.15, 2.2, std("#334155"), 0, 3.25, -4.6, g);
  const cv = document.createElement("canvas"); cv.width = 512; cv.height = 320; const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
  const scr = plane(3.4, 2.1, tex, { transparent: false }); scr.position.set(0, 4.4, -5.6); scr.rotation.x = -0.15; g.add(scr);
  box(3.6, 2.3, 0.1, std("#1F2937"), 0, 4.4, -5.68, g).rotation.x = -0.15;
  const lamp = new THREE.PointLight("#ffcf8a", 30, 12, 2); lamp.position.set(2.6, 5.4, -4.5); g.add(lamp);
  const lampHead = new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.7, 12), std("#FF8A00", { emissive: new THREE.Color("#FFB45E"), emissiveIntensity: 1 })); lampHead.position.set(2.6, 4.4, -4.6); g.add(lampHead);
  box(1.8, 0.3, 1.8, std("#0066DE"), 0, 1.8, -2.4, g); box(1.8, 2, 0.3, std("#0066DE"), 0, 2.7, -1.5, g);
  const p = person(33, false); p.obj.position.set(0, 1.0, -2.7); p.obj.rotation.y = Math.PI; p.obj.scale.setScalar(1.25); g.add(p.obj);
  const clock = sprite(TEX.clock, 2.2, scene); clock.position.copy(at).add(new THREE.Vector3(3.5, 7.8, -6.7));
  const bed = box(4, 1, 6, std("#1e40af"), 4.5, 0.5, 3.5, g);
  const paint = (pct, bad, t) => {
    const c = cv.getContext("2d");
    c.fillStyle = "#F5F7FA"; c.fillRect(0, 0, 512, 320);
    c.fillStyle = "#0066DE"; c.fillRect(0, 0, 512, 54); c.fillStyle = "#fff"; c.font = FONT(30); c.fillText("PORTAL PELAJAR", 24, 38);
    c.fillStyle = "#1F2937"; c.font = FONT(30, 700); c.fillText("Hantar assignment", 24, 118);
    c.fillStyle = "#E2E8F0"; rr(c, 24, 160, 464, 44, 22); c.fill();
    c.fillStyle = bad ? "#FF4D5E" : "#22C55E"; rr(c, 24, 160, Math.max(44, 464 * pct), 44, 22); c.fill();
    c.fillStyle = bad ? "#FF4D5E" : "#1F2937"; c.font = FONT(34); c.fillText(bad ? "GAGAL · 99%" : Math.floor(pct * 100) + "%", 24, 262);
    tex.needsUpdate = true;
  };
  return { group: g, paint, clock, person: p };
}

// ---------------------------------------------------------------- office
export function buildOffice(scene, at) {
  const g = new THREE.Group(); g.position.copy(at); scene.add(g);
  box(26, 0.6, 20, std("#e5e7eb"), 0, -0.3, 0, g);
  box(26, 9, 0.4, std("#dbeafe"), 0, 4.5, -10, g); box(0.4, 9, 20, std("#c7d2fe"), -13, 4.5, 0, g);
  const wall = plane(10, 6.25, WT.callOn, { transparent: false }); wall.position.set(1, 5, -9.75); g.add(wall);
  box(10.4, 6.6, 0.2, std("#111827"), 1, 5, -9.9, g);
  const monitors = [], workers = [];
  const r = rng(12);
  for (let row = 0; row < 3; row++) for (let col = 0; col < 4; col++) {
    const x = -8 + col * 5.2, z = -4 + row * 5;
    box(3.6, 0.2, 2, std("#f8fafc"), x, 2.2, z, g); box(0.2, 2.2, 1.8, std("#94a3b8"), x - 1.6, 1.1, z, g); box(0.2, 2.2, 1.8, std("#94a3b8"), x + 1.6, 1.1, z, g);
    const mm = std("#0B1E3F", { emissive: new THREE.Color("#3b82f6"), emissiveIntensity: 1.2 });
    const m = box(1.8, 1.2, 0.12, mm, x, 3.2, z - 0.6, g); monitors.push({ m, mat: mm, ord: r() });
    const p = person(70 + row * 4 + col); p.obj.position.set(x + (r() - 0.5) * 0.6, 0, z + 1.4); p.obj.rotation.y = Math.PI; g.add(p.obj);
    const q = sprite(TEX.what, 1.3, scene); q.position.copy(at).add(new THREE.Vector3(x, 3.4, z + 1.4)); q.visible = false;
    workers.push({ p, q, ord: r() });
  }
  const mails = [];
  for (let i = 0; i < 8; i++) { const s = sprite(mailTex, 1.6, scene); s.visible = false; mails.push({ s, x0: -16, y0: 7 + r() * 3, z0: -8 + r() * 14, x1: -8 + (i % 4) * 5.2, z1: -4 + (i % 3) * 5, d: r() }); }
  return { group: g, wall, monitors, workers, mails, at };
}

// ---------------------------------------------------------------- request journey: phone -> router -> cable -> DNS -> server door
export function buildJourney(scene, at) {
  const g = new THREE.Group(); g.position.copy(at); scene.add(g);
  box(96, 1, 18, std("#bfe0a6"), 40, -0.5, 0, g);
  box(96, 0.3, 2.4, std("#475569"), 40, 0.05, 4.8, g);
  const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 60, 12), std("#0B1E3F", { emissive: new THREE.Color("#00C2FF"), emissiveIntensity: 0.5 }));
  cable.rotation.z = Math.PI / 2; cable.position.set(38, 0.5, 4.8); g.add(cable);
  // home: little house + phone stand + router
  box(7, 4, 6, std("#fde68a"), -2, 2, -3, g); const roof = new THREE.Mesh(new THREE.ConeGeometry(5.4, 2.6, 4), std("#E23B3B")); roof.position.set(-2, 5.3, -3); roof.rotation.y = Math.PI / 4; g.add(roof);
  const ph = box(1.2, 2.2, 0.2, std("#111827", { emissive: new THREE.Color("#1C5FD0"), emissiveIntensity: 1 }), 1, 1.6, 2.4, g); ph.rotation.y = Math.PI / 4;
  box(1.4, 0.6, 1, std("#1F2937", { emissive: new THREE.Color("#22C55E"), emissiveIntensity: 0.8 }), 6, 0.5, 2.4, g);
  box(0.1, 1, 0.1, std("#1F2937"), 5.6, 1.2, 2.4, g); box(0.1, 1, 0.1, std("#1F2937"), 6.4, 1.2, 2.4, g);
  // DNS: "buku alamat" tower
  const dns = new THREE.Group(); dns.position.set(36, 0, -1); g.add(dns);
  box(7, 9, 6, std("#e0e7ff"), 0, 4.5, 0, dns); box(7.4, 0.5, 6.4, std("#4F46E5"), 0, 9.2, 0, dns);
  const book = new THREE.Group(); book.position.set(0, 11.6, 0); dns.add(book);
  box(3.6, 3.6, 0.6, std("#4F46E5"), -0.2, 0, 0, book); box(3.2, 3.4, 0.5, std("#ffffff"), 0.1, 0, 0.1, book);
  const dl = plane(7.6, 1.6, labelTex("BUKU ALAMAT", "#4F46E5", "#ffffff")); dl.position.set(0, 7.2, 3.05); dns.add(dl);
  box(2, 3, 0.2, std("#312e81"), 1.6, 1.5, 3.05, dns);
  // server building with a big door
  const dc = new THREE.Group(); dc.position.set(72, 0, -1); g.add(dc);
  box(14, 9, 8, std("#0B1E3F"), 0, 4.5, 0, dc); box(14.4, 0.6, 8.4, std("#0066DE"), 0, 9.3, 0, dc);
  const sl = plane(8, 1.7, labelTex("SERVER", "#0066DE", "#ffffff")); sl.position.set(0, 7.4, 4.05); dc.add(sl);
  const door = box(3.2, 4.4, 0.3, std("#334155"), -2, 2.2, 4.1, dc);
  for (let i = 0; i < 5; i++) box(0.4, 0.4, 0.1, std("#22C55E", { emissive: new THREE.Color("#22C55E"), emissiveIntensity: 1.2 }), 2 + i * 0.9, 3.6, 4.08, dc);
  for (const [x, z] of [[14, -6], [22, -5], [50, -6], [58, -5], [88, -5]]) { const tr = new THREE.Mesh(new THREE.ConeGeometry(1.2, 3, 7), std("#4ade80")); tr.position.set(x, 1.5, z); tr.castShadow = true; g.add(tr); }
  // the request: glowing arrow + trail
  const arrow = new THREE.Group(); scene.add(arrow);
  const head = new THREE.Mesh(new THREE.ConeGeometry(0.7, 1.8, 16), new THREE.MeshBasicMaterial({ color: "#7DF9FF", toneMapped: false })); head.rotation.x = Math.PI / 2; arrow.add(head);
  const glow = sprite(spinTex, 0.1, arrow); glow.visible = false;
  const trail = []; for (let i = 0; i < 8; i++) { const s = new THREE.Mesh(new THREE.SphereGeometry(0.32 - i * 0.03, 10, 8), new THREE.MeshBasicMaterial({ color: "#00C2FF", transparent: true, opacity: 0.8 - i * 0.09, toneMapped: false })); scene.add(s); trail.push(s); }
  const tag = sprite(tagTex, 1, scene); tag.scale.set(3.6, 1.2, 1); tag.visible = false;
  const W = (x, y, z) => new THREE.Vector3(x, y, z).add(at);
  const path = { home: [W(1, 2.4, 2.4), W(6, 1.6, 2.6), W(8, 0.9, 4.8)], toDns: [W(8, 0.9, 4.8), W(33, 0.9, 4.8), W(36, 2.2, 3.4)], toDc: [W(36, 2.2, 3.4), W(40, 0.9, 4.8), W(66, 0.9, 4.8), W(70, 2.4, 4.0)] };
  return { group: g, arrow, trail, tag, path, door, book, at };
}

// ---------------------------------------------------------------- road (internet) vs shops (websites)
export function buildStreet(scene, at) {
  const g = new THREE.Group(); g.position.copy(at); scene.add(g);
  box(56, 1, 26, std("#bfe0a6"), 0, -0.5, 0, g);
  box(56, 0.08, 7, std("#334155"), 0, 0.04, 3, g);
  for (let x = -26; x < 27; x += 4) box(2, 0.1, 0.25, std("#f5f7fa"), x, 0.1, 3, g);
  box(56, 0.12, 2, std("#d8dee9"), 0, 0.06, -1.5, g);
  const KIND = ["bag", "play", "news", "food", "globe", "music"], COL = ["#FED7AA", "#FECACA", "#E2E8F0", "#FDE68A", "#CFFAFE", "#E9D5FF"];
  const shops = [];
  for (let i = 0; i < 6; i++) {
    const x = -20 + i * 8, s = new THREE.Group(); s.position.set(x, 0, -6); g.add(s);
    box(7, 5.2, 6, std(COL[i]), 0, 2.6, 0, s); box(7.6, 0.5, 6.6, std("#475569"), 0, 5.4, 0, s);
    const win = box(5.4, 3, 0.1, new THREE.MeshStandardMaterial({ color: "#fff7d6", emissive: new THREE.Color("#ffd27a"), emissiveIntensity: 0.9 }), 0, 1.9, 3.02, s);
    const sign = plane(1.8, 1.8, ICON[KIND[i]]); sign.position.set(0, 4.4, 3.06); s.add(sign);
    const sh = new THREE.Group(); sh.position.set(0, 3.5, 3.12); s.add(sh);
    const shm = box(5.6, 3.2, 0.12, std("#94a3b8", { metalness: 0.4, roughness: 0.5 }), 0, -1.6, 0, sh);
    for (let k = 0; k < 6; k++) box(5.6, 0.06, 0.16, std("#64748b"), 0, -0.3 - k * 0.5, 0.02, sh);
    sh.scale.y = 0.001;
    shops.push({ s, sh, win });
  }
  const cars = []; const r = rng(31);
  for (let i = 0; i < 12; i++) {
    const c = new THREE.Group(); g.add(c);
    const col = ["#00C2FF", "#22C55E", "#FF8A00", "#8B5CF6"][i % 4];
    box(2.2, 0.8, 1.2, std(col, { emissive: new THREE.Color(col), emissiveIntensity: 0.5 }), 0, 0.6, 0, c); box(1.2, 0.6, 1.1, std("#e2e8f0"), -0.2, 1.2, 0, c);
    cars.push({ c, lane: i % 2 ? 1.5 : 4.5, off: r() * 56, v: (i % 2 ? -1 : 1) * (9 + r() * 4) });
  }
  return { group: g, shops, cars };
}
