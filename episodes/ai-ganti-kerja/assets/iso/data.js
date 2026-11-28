// Data-world pieces for "Apa Jadi Kalau Semua Data Dunia Hilang?" (generic, no real brands).
import * as THREE from "../vendor/three.module.js";
import { std, box, canvasTex, rr, FONT, person, sprite, rng, TEX } from "./kit.js";

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const basic = (o) => new THREE.MeshBasicMaterial({ transparent: true, toneMapped: false, ...o });
export const plane = (w, h, map, o = {}) => new THREE.Mesh(new THREE.PlaneGeometry(w, h), basic({ map, side: THREE.DoubleSide, ...o }));
function island(g, w, d, col = "#bfe0a6", side = "#8a6a4a") { box(w, 0.6, d, std(col), 0, -0.3, 0, g); box(w, 2.4, d, std(side), 0, -1.9, 0, g); }
export const label = (text, bg, fg, w = 512, h = 160, px = 78) => canvasTex(w, h, (g) => {
  g.fillStyle = bg; rr(g, 6, 6, w - 12, h - 12, 34); g.fill(); g.fillStyle = fg; g.font = FONT(px); g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(text, w / 2, h / 2 + 4);
});
const gridTex = canvasTex(512, 512, (g) => { g.fillStyle = "#0B1E3F"; g.fillRect(0, 0, 512, 512); g.strokeStyle = "rgba(0,194,255,0.35)"; g.lineWidth = 3; for (let i = 0; i <= 512; i += 64) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 512); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(512, i); g.stroke(); } });
gridTex.wrapS = gridTex.wrapT = THREE.RepeatWrapping;
const floorGrid = (g, w, d) => {
  const t = gridTex.clone(); t.needsUpdate = true; t.repeat.set(w / 8, d / 8);
  const f = new THREE.Mesh(new THREE.BoxGeometry(w, 0.6, d), [std("#13294f"), std("#13294f"), new THREE.MeshStandardMaterial({ map: t, roughness: 0.8, emissive: new THREE.Color("#0B1E3F"), emissiveIntensity: 0.4 }), std("#0b1530"), std("#13294f"), std("#13294f")]);
  f.position.y = -0.3; f.receiveShadow = true; g.add(f); return f;
};
export const photoTex = (seed) => canvasTex(256, 256, (g) => {
  const r = rng(seed * 31 + 7), SK = [["#7cc4f5", "#cfe8f7"], ["#FF8A00", "#FDE68A"], ["#8B5CF6", "#F472B6"], ["#0B1E3F", "#1C5FD0"]][Math.floor(r() * 4)];
  const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, SK[0]); gr.addColorStop(1, SK[1]); g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
  g.fillStyle = "#FFF5C2"; g.beginPath(); g.arc(60 + r() * 140, 60 + r() * 30, 22, 0, 7); g.fill();
  g.fillStyle = ["#22C55E", "#15803d", "#334155"][Math.floor(r() * 3)]; g.beginPath(); g.moveTo(0, 256); g.lineTo(0, 170); g.lineTo(70 + r() * 30, 110 + r() * 40); g.lineTo(150, 180); g.lineTo(200 + r() * 30, 120); g.lineTo(256, 170); g.lineTo(256, 256); g.fill();
});
const iconTex = (kind) => canvasTex(256, 256, (g) => {
  const col = { doc: "#0066DE", photo: "#22C55E", video: "#E23B3B", db: "#8B5CF6" }[kind];
  g.fillStyle = col; rr(g, 8, 8, 240, 240, 40); g.fill(); g.fillStyle = "#ffffff"; g.strokeStyle = "#ffffff"; g.lineWidth = 14;
  if (kind === "doc") { rr(g, 70, 46, 116, 164, 14); g.fill(); g.fillStyle = col; for (let i = 0; i < 4; i++) g.fillRect(90, 80 + i * 28, 76 - (i % 2) * 24, 12); }
  if (kind === "photo") { rr(g, 50, 66, 156, 124, 14); g.fill(); g.fillStyle = col; g.beginPath(); g.moveTo(64, 176); g.lineTo(110, 112); g.lineTo(140, 150); g.lineTo(160, 130); g.lineTo(192, 176); g.fill(); g.beginPath(); g.arc(168, 98, 12, 0, 7); g.fill(); }
  if (kind === "video") { g.beginPath(); g.moveTo(96, 70); g.lineTo(190, 128); g.lineTo(96, 186); g.fill(); }
  if (kind === "db") { for (let i = 0; i < 3; i++) { g.beginPath(); g.ellipse(128, 76 + i * 48, 64, 22, 0, 0, 7); g.fill(); g.fillRect(64, 76 + i * 48, 128, 30); } }
});
const chatTex = (seed, mine) => canvasTex(384, 160, (g) => {
  g.fillStyle = mine ? "#22C55E" : "#F5F7FA"; rr(g, 6, 6, 372, 130, 40); g.fill(); g.fillStyle = mine ? "rgba(255,255,255,0.85)" : "#94a3b8";
  const r = rng(seed); for (let i = 0; i < 2; i++) { rr(g, 34, 34 + i * 44, 180 + r() * 130, 22, 11); g.fill(); }
});
const crossTex = canvasTex(256, 256, (g) => { g.fillStyle = "#ffffff"; rr(g, 6, 6, 244, 244, 40); g.fill(); g.fillStyle = "#E23B3B"; g.fillRect(98, 40, 60, 176); g.fillRect(40, 98, 176, 60); });
const recordTex = (blank) => canvasTex(512, 384, (g) => {
  g.fillStyle = "#0B1E3F"; g.fillRect(0, 0, 512, 384);
  if (blank) { g.strokeStyle = "rgba(255,255,255,0.18)"; g.lineWidth = 4; g.setLineDash([16, 12]); rr(g, 30, 30, 452, 324, 18); g.stroke(); return; }
  g.fillStyle = "#00C2FF"; g.beginPath(); g.arc(80, 80, 40, 0, 7); g.fill(); g.fillStyle = "#e2e8f0";
  for (let i = 0; i < 6; i++) { rr(g, 150, 50 + i * 46, 300 - (i % 3) * 60, 22, 11); g.fill(); }
  g.strokeStyle = "#22C55E"; g.lineWidth = 8; g.beginPath(); g.moveTo(30, 330); for (let x = 30; x < 480; x += 30) g.lineTo(x, 330 - ((x / 30) % 4 === 1 ? 50 : 0)); g.stroke();
});
const tableTex = (blank) => canvasTex(512, 384, (g) => {
  g.fillStyle = "#0B1E3F"; g.fillRect(0, 0, 512, 384);
  if (blank) { g.fillStyle = "rgba(255,77,94,0.9)"; g.font = FONT(64); g.textAlign = "center"; g.fillText("KOSONG", 256, 210); return; }
  g.fillStyle = "#0066DE"; g.fillRect(20, 20, 472, 48);
  for (let i = 0; i < 6; i++) { g.fillStyle = i % 2 ? "#13294f" : "#1b3566"; g.fillRect(20, 76 + i * 48, 472, 44); g.fillStyle = "#00C2FF"; rr(g, 36, 90 + i * 48, 120, 16, 8); g.fill(); g.fillStyle = "#22C55E"; rr(g, 330, 90 + i * 48, 140 - (i % 3) * 30, 16, 8); g.fill(); }
});
const xTex = canvasTex(256, 256, (g) => { g.fillStyle = "#FF4D5E"; g.beginPath(); g.arc(128, 128, 118, 0, 7); g.fill(); g.strokeStyle = "#fff"; g.lineWidth = 28; g.lineCap = "round"; g.beginPath(); g.moveTo(84, 84); g.lineTo(172, 172); g.moveTo(172, 84); g.lineTo(84, 172); g.stroke(); });
const bitTex = (ch) => canvasTex(128, 128, (g) => { g.fillStyle = "#00C2FF"; g.font = FONT(110); g.textAlign = "center"; g.textBaseline = "middle"; g.shadowColor = "#00C2FF"; g.shadowBlur = 18; g.fillText(ch, 64, 70); });
const glowTex = canvasTex(256, 256, (g) => { const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128); gr.addColorStop(0, "rgba(0,194,255,0.9)"); gr.addColorStop(0.4, "rgba(0,194,255,0.35)"); gr.addColorStop(1, "rgba(0,194,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); });
const redGlowTex = canvasTex(256, 256, (g) => { const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128); gr.addColorStop(0, "rgba(255,120,60,0.95)"); gr.addColorStop(0.45, "rgba(255,77,94,0.4)"); gr.addColorStop(1, "rgba(255,77,94,0)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); });
const platterTex = canvasTex(512, 512, (g) => { const gr = g.createRadialGradient(256, 256, 30, 256, 256, 250); gr.addColorStop(0, "#e2e8f0"); gr.addColorStop(0.5, "#94a3b8"); gr.addColorStop(1, "#cbd5e1"); g.fillStyle = gr; g.beginPath(); g.arc(256, 256, 250, 0, 7); g.fill(); g.strokeStyle = "rgba(255,255,255,0.4)"; for (let r = 60; r < 250; r += 14) { g.lineWidth = 2; g.beginPath(); g.arc(256, 256, r, 0, 7); g.stroke(); } g.fillStyle = "#475569"; g.beginPath(); g.arc(256, 256, 40, 0, 7); g.fill(); });
const worldTex = canvasTex(1024, 512, (g) => {
  g.fillStyle = "#1D6FD8"; g.fillRect(0, 0, 1024, 512); const r = rng(5);
  const blobs = [[200, 160, 120, 80], [260, 330, 70, 110], [520, 150, 90, 60], [540, 300, 80, 110], [700, 170, 170, 90], [820, 370, 70, 50]];
  g.fillStyle = "#4CBF6B"; blobs.forEach(([x, y, w, h]) => { g.beginPath(); g.ellipse(x, y, w, h, r() - 0.5, 0, 7); g.fill(); });
});
export const DT = { bit0: bitTex("0"), bit1: bitTex("1"), glow: glowTex, redGlow: redGlowTex, x: xTex, recOk: recordTex(false), recBlank: recordTex(true), tabOk: tableTex(false), tabBlank: tableTex(true), cross: crossTex };

// ---------------------------------------------------------------- pixel dissolve: a pool of tiny cubes per object
export function makePixels(parent, n, color) {
  const mat = new THREE.MeshBasicMaterial({ color, transparent: true, toneMapped: false });
  const r = rng(n * 13 + color.length);
  return Array.from({ length: n }, () => { const m = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.35), mat.clone()); m.visible = false; parent.add(m); return { m, v: V((r() - 0.5) * 2, 0.5 + r() * 1.5, (r() - 0.5) * 2).normalize(), s: 2 + r() * 4, o: V((r() - 0.5), (r() - 0.5), (r() - 0.5)) }; });
}
export function burst(px, at, t, t0, dur = 1.0, rev = false) {
  px.forEach((p) => {
    let k = (t - t0) / dur; if (rev) k = 1 - k;
    p.m.visible = k > 0 && k < 1;
    if (!p.m.visible) return;
    p.m.position.copy(at).add(p.o).addScaledVector(p.v, k * p.s); p.m.material.opacity = 1 - k; p.m.rotation.set(k * 6, k * 4, 0);
  });
}

// ---------------------------------------------------------------- data city with floating data blocks
export function buildDataCity(scene, at) {
  const g = new THREE.Group(); g.position.copy(at); scene.add(g);
  floorGrid(g, 70, 70);
  const r = rng(3), blds = [];
  for (let x = -30; x <= 30; x += 7.5) for (let z = -30; z <= 30; z += 7.5) {
    if (Math.hypot(x, z) < 8 || r() < 0.25) continue;
    const h = 2 + r() * 7, mat = std("#cbd5e1", { emissive: new THREE.Color("#00C2FF"), emissiveIntensity: 0.2 });
    blds.push(box(4.4, h, 4.4, mat, x, h / 2, z, g));
  }
  const KINDS = ["doc", "photo", "video", "db"], tex = Object.fromEntries(KINDS.map((k) => [k, iconTex(k)]));
  const items = [];
  const slots = [[0, 9, 0, "db", 4.5], [-9, 10, -3, "photo", 3.4], [8, 11, -6, "video", 3.4], [-4, 13, 9, "doc", 3], [11, 8, 7, "photo", 3], [-13, 7, 10, "video", 2.6], [3, 14, -14, "doc", 2.6], [-15, 12, -12, "db", 2.6], [14, 13, -15, "photo", 2.4], [16, 9, 15, "doc", 2.4]];
  slots.forEach(([x, y, z, k, s], i) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(s, s, s * 0.35), new THREE.MeshStandardMaterial({ map: tex[k], roughness: 0.5, emissive: new THREE.Color("#ffffff"), emissiveMap: tex[k], emissiveIntensity: 0.35 }));
    m.position.set(x, y, z); m.castShadow = true; g.add(m);
    const ghost = new THREE.Mesh(new THREE.BoxGeometry(s, s, s * 0.35), new THREE.MeshBasicMaterial({ color: "#00C2FF", wireframe: true, transparent: true, opacity: 0 })); ghost.position.copy(m.position); g.add(ghost);
    items.push({ m, ghost, kind: k, base: V(x, y, z), i, px: makePixels(g, 14, { doc: "#0066DE", photo: "#22C55E", video: "#E23B3B", db: "#8B5CF6" }[k]) });
  });
  const glow = sprite(glowTex, 30, g); glow.position.y = 6;
  return { group: g, blds, items, glow };
}

// ---------------------------------------------------------------- giant phone with gallery grid + chat bubbles
export function buildGallery(scene, at) {
  const g = new THREE.Group(); g.position.copy(at); scene.add(g);
  floorGrid(g, 34, 30);
  const ph = new THREE.Group(); ph.position.set(-2, 8.5, 0); ph.rotation.y = Math.PI / 4; g.add(ph);
  box(8.4, 16, 0.8, std("#1F2937", { flatShading: false }), 0, 0, 0, ph);
  const scr = box(7.6, 15, 0.1, std("#F5F7FA", { emissive: new THREE.Color("#ffffff"), emissiveIntensity: 0.25 }), 0, 0, 0.45, ph);
  const tiles = [];
  for (let i = 0; i < 15; i++) {
    const x = -2.4 + (i % 3) * 2.4, y = 5.2 - Math.floor(i / 3) * 2.4;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 2.2), new THREE.MeshBasicMaterial({ map: photoTex(i + 1), toneMapped: false, transparent: true })); m.position.set(x, y, 0.52); ph.add(m);
    const empty = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 2.2), new THREE.MeshBasicMaterial({ color: "#E2E8F0", toneMapped: false })); empty.position.set(x, y, 0.505); ph.add(empty);
    tiles.push({ m, x, y, i, px: makePixels(g, 6, ["#22C55E", "#0066DE", "#FF8A00", "#8B5CF6"][i % 4]) });
  }
  const chats = [];
  for (let i = 0; i < 5; i++) { const c = plane(4.2, 1.75, chatTex(i + 3, i % 2 === 1)); g.add(c); chats.push({ c, i, base: V(7 + (i % 2) * 1.6, 3 + i * 2.6, 4 - (i % 2) * 1.2), px: makePixels(g, 8, i % 2 ? "#22C55E" : "#e2e8f0") }); }
  const what = sprite(TEX.what, 3.6, g); what.position.set(-2, 19, 0); what.visible = false;
  return { group: g, ph, tiles, chats, what };
}

// ---------------------------------------------------------------- hospital cut-away
export function buildHospital(scene, at) {
  const g = new THREE.Group(); g.position.copy(at); scene.add(g);
  island(g, 30, 24, "#E2E8F0", "#94a3b8");
  box(30, 8, 0.4, std("#F5F7FA"), 0, 4, -11.8, g); box(0.4, 8, 24, std("#DBEAFE"), -14.8, 4, 0, g);
  const sign = plane(4, 4, crossTex); sign.position.set(-6, 9.8, -11.5); g.add(sign);
  const bed = new THREE.Group(); bed.position.set(-6, 0, -4); g.add(bed);
  box(6, 0.8, 3, std("#F5F7FA"), 0, 1.4, 0, bed); box(6.2, 0.6, 3.2, std("#94a3b8"), 0, 0.6, 0, bed); box(1.6, 0.4, 2.4, std("#ffffff"), -2, 2, 0, bed);
  const pat = person(51, false); pat.obj.rotation.z = Math.PI / 2; pat.obj.position.set(1.4, 2.1, 0); bed.add(pat.obj);
  const monStand = box(0.3, 4, 0.3, std("#475569"), 2, 2, -6, g);
  const mon = plane(6, 4.5, DT.recOk); mon.position.set(2, 6.2, -6); g.add(mon);
  // filing cabinet with drawers
  const cab = new THREE.Group(); cab.position.set(10, 0, -8); g.add(cab);
  box(4, 6, 3, std("#94a3b8", { metalness: 0.3 }), 0, 3, 0, cab);
  const drawers = [0, 1, 2].map((i) => { const d = new THREE.Group(); d.position.set(0, 1.2 + i * 1.9, 1.5); cab.add(d); box(3.6, 1.6, 2.8, std("#cbd5e1", { metalness: 0.3 }), 0, 0, -1.3, d); box(1, 0.2, 0.2, std("#334155"), 0, 0, 0.15, d); const papers = box(3.2, 0.6, 2.4, std("#ffffff"), 0, 0.4, -1.3, d); return { d, papers }; });
  const doc = person(52, false); doc.obj.position.set(5, 0, 2); doc.obj.rotation.y = -0.6; g.add(doc.obj); doc.body.material = std("#ffffff");
  const what = sprite(TEX.what, 2.2, g); what.position.set(5, 3.8, 2); what.visible = false;
  const recPx = makePixels(g, 16, "#00C2FF");
  return { group: g, mon, drawers, doc, what, recPx };
}

// ---------------------------------------------------------------- airport gate scanner
export function buildGate(scene, at) {
  const g = new THREE.Group(); g.position.copy(at); scene.add(g);
  island(g, 34, 26, "#E5E7EB", "#94a3b8");
  for (let x = -16; x < 17; x += 4) box(0.1, 0.05, 26, std("#cbd5e1"), x, 0.03, 0, g);
  const gate = new THREE.Group(); g.add(gate);
  const lightMat = std("#22C55E", { emissive: new THREE.Color("#22C55E"), emissiveIntensity: 1 });
  box(0.8, 5, 1.6, std("#F5F7FA"), -2.4, 2.5, 0, gate); box(0.8, 5, 1.6, std("#F5F7FA"), 2.4, 2.5, 0, gate); box(5.6, 0.8, 1.6, std("#F5F7FA"), 0, 5.4, 0, gate);
  const bar = box(5.4, 0.3, 1.7, lightMat, 0, 5.95, 0, gate);
  const glass = box(4, 1.2, 0.1, std("#7dd3fc", { transparent: true, opacity: 0.6 }), 0, 1.4, 0, gate);
  const pax = [0, 1, 2, 3].map((i) => { const p = person(60 + i, true); p.obj.position.set(0, 0, 3 + i * 1.8); p.obj.rotation.y = Math.PI; g.add(p.obj); return p; });
  const x = sprite(xTex, 2.6, g); x.position.set(0, 8.2, 0); x.visible = false;
  // plane behind the glass wall
  box(34, 6, 0.3, std("#BFDBFE", { transparent: true, opacity: 0.5 }), 0, 3, -8, g);
  const jet = new THREE.Group(); jet.position.set(4, 0, -14); g.add(jet);
  const fus = new THREE.Mesh(new THREE.CapsuleGeometry(1.2, 12, 4, 12), std("#f8fafc")); fus.rotation.z = Math.PI / 2; fus.position.y = 2.2; jet.add(fus);
  box(3, 0.2, 14, std("#cbd5e1"), 0.4, 2, 0, jet); box(1.4, 2.8, 0.25, std("#0066DE"), -6, 4, 0, jet);
  return { group: g, lightMat, bar, pax, x };
}

// ---------------------------------------------------------------- bank + vault (cash turns into data)
export function buildBank(scene, at) {
  const g = new THREE.Group(); g.position.copy(at); scene.add(g);
  floorGrid(g, 40, 34);
  // vault room: back wall with round door facing +z/+x
  box(24, 12, 1, std("#64748b", { metalness: 0.3 }), 0, 6, -8, g);
  box(1, 12, 18, std("#475569", { metalness: 0.3 }), -12, 6, 1, g);
  const hinge = new THREE.Group(); hinge.position.set(-4.4, 6, -7.3); g.add(hinge);
  const door = new THREE.Group(); door.position.set(4.4, 0, 0); hinge.add(door);
  const dm = new THREE.Mesh(new THREE.CylinderGeometry(4.4, 4.4, 1, 40), std("#94a3b8", { flatShading: false, metalness: 0.7, roughness: 0.3 })); dm.rotation.x = Math.PI / 2; dm.position.z = 0.4; door.add(dm);
  const wheel = new THREE.Group(); wheel.position.z = 1.1; door.add(wheel);
  for (let k = 0; k < 3; k++) { const s = box(5, 0.35, 0.35, std("#E8B04B", { metalness: 0.6 }), 0, 0, 0, wheel); s.rotation.z = k * Math.PI / 3; }
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.5, 20), std("#E8B04B", { metalness: 0.6 })); hub.rotation.x = Math.PI / 2; wheel.add(hub);
  // inside: server + screen (behind the door)
  const inner = new THREE.Group(); inner.position.set(0, 0, -11); g.add(inner);
  box(10, 12, 6, std("#0b1530"), 0, 6, -1, inner);
  const screen = plane(7.2, 5.4, DT.tabOk); screen.position.set(0, 6, 2.1); inner.add(screen);
  const hole = new THREE.Mesh(new THREE.CircleGeometry(4.2, 40), new THREE.MeshBasicMaterial({ color: "#050b1e" })); hole.position.set(0, 6, -7.45); g.add(hole);
  // cash pallets in front, turn into data cubes
  const cash = [], r = rng(8);
  for (let i = 0; i < 12; i++) {
    const m = new THREE.MeshStandardMaterial({ color: "#22C55E", roughness: 0.6, emissive: new THREE.Color("#00C2FF"), emissiveIntensity: 0 });
    const b = box(1.8, 0.9, 1, m, -5 + (i % 4) * 2.2, 0.45 + Math.floor(i / 8) * 0.95, 2 + (Math.floor(i / 4) % 2) * 1.3, g);
    cash.push({ b, m, base: b.position.clone(), d: r(), px: makePixels(g, 6, "#00C2FF") });
  }
  const alarm = sprite(redGlowTex, 18, g); alarm.position.set(0, 10, -6); alarm.visible = false;
  const what = sprite(TEX.what, 3, g); what.position.set(0, 13.5, -6); what.visible = false;
  return { group: g, hinge, wheel, screen, cash, alarm, what, hole };
}

// ---------------------------------------------------------------- data centre rows + a hard disk close-up
export function buildDataCentre(scene, at) {
  const g = new THREE.Group(); g.position.copy(at); scene.add(g);
  floorGrid(g, 50, 40);
  const leds = [], ledMat = [0, 1, 2].map((k) => new THREE.MeshBasicMaterial({ color: ["#22C55E", "#00C2FF", "#FF8A00"][k], toneMapped: false }));
  for (let row = 0; row < 4; row++) for (let i = 0; i < 9; i++) {
    const x = -18 + i * 4.4, z = -12 + row * 8;
    box(3.6, 7, 2.6, std("#334155", { metalness: 0.3 }), x, 3.5, z, g);
    for (let k = 0; k < 6; k++) { const l = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.15, 0.05), ledMat[(i + k + row) % 3]); l.position.set(x - 1.2 + (k % 3) * 0.5, 1.2 + k * 0.9, z + 1.33); g.add(l); leds.push({ l, s: (i * 7 + k * 3 + row) % 11 }); }
  }
  return { group: g, leds };
}
export function buildDisk(scene, at) {
  const g = new THREE.Group(); g.position.copy(at); scene.add(g);
  const base = box(14, 1.4, 18, std("#94a3b8", { metalness: 0.6, roughness: 0.35 }), 0, 0.7, 0, g);
  const platter = new THREE.Mesh(new THREE.CylinderGeometry(5.8, 5.8, 0.25, 64), new THREE.MeshStandardMaterial({ map: platterTex, metalness: 0.8, roughness: 0.2 })); platter.position.set(0, 1.6, -2); g.add(platter);
  const arm = new THREE.Group(); arm.position.set(5, 1.95, 6); g.add(arm);
  box(1.2, 0.3, 8, std("#334155", { metalness: 0.5 }), 0, 0, -3.6, arm); const pv = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.8, 20), std("#475569")); arm.add(pv);
  const bits = []; for (let i = 0; i < 30; i++) { const s = sprite(i % 2 ? DT.bit1 : DT.bit0, 1.2, g); s.visible = false; bits.push(s); }
  return { group: g, platter, arm, bits };
}

// ---------------------------------------------------------------- world map: data centres on several continents, copies hop between them
export function buildWorld(scene, at) {
  const g = new THREE.Group(); g.position.copy(at); scene.add(g);
  const map = new THREE.Mesh(new THREE.BoxGeometry(80, 1.2, 40), [std("#155bb5"), std("#155bb5"), new THREE.MeshStandardMaterial({ map: worldTex, roughness: 0.9 }), std("#0b3a7a"), std("#155bb5"), std("#155bb5")]);
  map.position.y = -0.6; map.receiveShadow = true; g.add(map);
  const SITES = [V(-24, 0, -8), V(-19, 0, 10), V(1, 0, -8), V(3, 0, 6), V(17, 0, -6), V(24, 0, 11)];
  const dcs = SITES.map((p, i) => {
    const d = new THREE.Group(); d.position.copy(p); g.add(d);
    const mat = std("#1F2937", { emissive: new THREE.Color("#00C2FF"), emissiveIntensity: 0.6 });
    box(4.2, 3, 3.2, mat, 0, 1.5, 0, d); box(4.4, 0.3, 3.4, std("#94a3b8"), 0, 3.15, 0, d);
    const glow = sprite(glowTex, 9, d); glow.position.y = 2;
    return { d, mat, glow, p, boom: sprite(redGlowTex, 1, d) };
  });
  dcs.forEach((x) => (x.boom.visible = false));
  const arcs = [];
  for (let i = 0; i < dcs.length; i++) for (let j = i + 1; j < dcs.length; j++) {
    if ((i + j) % 2 === 0 && j - i > 2) continue;
    const a = dcs[i].p.clone().add(V(0, 3.2, 0)), b = dcs[j].p.clone().add(V(0, 3.2, 0)), mid = a.clone().lerp(b, 0.5).add(V(0, 5 + a.distanceTo(b) * 0.25, 0));
    const c = new THREE.QuadraticBezierCurve3(a, mid, b);
    const tube = new THREE.Mesh(new THREE.TubeGeometry(c, 40, 0.12, 6), new THREE.MeshBasicMaterial({ color: "#00C2FF", transparent: true, opacity: 0, toneMapped: false })); g.add(tube);
    const pkt = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 0.9), new THREE.MeshBasicMaterial({ color: "#ffffff", toneMapped: false })); pkt.visible = false; g.add(pkt);
    arcs.push({ c, tube, pkt, i, j });
  }
  return { group: g, dcs, arcs };
}
