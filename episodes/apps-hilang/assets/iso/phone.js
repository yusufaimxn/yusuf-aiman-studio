// Phone-world pieces for "Apa Jadi Kalau Semua Apps Dalam Phone Kau Hilang?":
// giant phone with 3D app icons (generic glyphs, no real logos), bedroom diorama, OS exploded stack, server block.
import * as THREE from "../vendor/three.module.js";
import { std, box, canvasTex, rr, FONT, person, sprite, rng } from "./kit.js";

// ---------------------------------------------------------------- icon textures
function glyph(g, kind) {
  g.fillStyle = "#fff"; g.strokeStyle = "#fff"; g.lineCap = "round"; g.lineJoin = "round";
  const P = (pts) => { g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); g.fill(); };
  switch (kind) {
    case "chat": rr(g, 58, 66, 140, 104, 40); g.fill(); P([[86, 160], [70, 200], [124, 164]]); break;
    case "play": P([[100, 76], [100, 180], [186, 128]]); break;
    case "bag": rr(g, 64, 96, 128, 100, 16); g.fill(); g.lineWidth = 14; g.beginPath(); g.arc(128, 96, 32, Math.PI, 0); g.stroke(); break;
    case "card": rr(g, 52, 78, 152, 104, 16); g.fill(); g.fillStyle = "rgba(0,0,0,0.35)"; g.fillRect(52, 100, 152, 22); g.fillRect(70, 148, 50, 12); break;
    case "pin": g.beginPath(); g.arc(128, 104, 46, Math.PI, 0); g.lineTo(128, 200); g.closePath(); g.fill(); g.fillStyle = "rgba(0,0,0,0.3)"; g.beginPath(); g.arc(128, 104, 18, 0, 7); g.fill(); break;
    case "music": g.lineWidth = 14; g.beginPath(); g.moveTo(108, 170); g.lineTo(108, 74); g.lineTo(176, 62); g.lineTo(176, 156); g.stroke();
      g.beginPath(); g.arc(92, 172, 22, 0, 7); g.fill(); g.beginPath(); g.arc(160, 158, 22, 0, 7); g.fill(); break;
    case "mail": rr(g, 52, 80, 152, 100, 14); g.fill(); g.strokeStyle = "rgba(0,0,0,0.35)"; g.lineWidth = 10; g.beginPath(); g.moveTo(58, 88); g.lineTo(128, 140); g.lineTo(198, 88); g.stroke(); break;
    case "photo": rr(g, 54, 70, 148, 116, 16); g.fill(); g.fillStyle = "rgba(0,0,0,0.35)"; P([[66, 172], [112, 116], [150, 160], [168, 140], [192, 172]]); break;
    case "car": rr(g, 52, 118, 152, 50, 14); g.fill(); P([[82, 120], [100, 84], [156, 84], [176, 120]]); g.fillStyle = "rgba(0,0,0,0.4)"; g.beginPath(); g.arc(86, 170, 16, 0, 7); g.arc(170, 170, 16, 0, 7); g.fill(); break;
    case "heart": g.beginPath(); g.moveTo(128, 190); g.bezierCurveTo(40, 130, 70, 56, 128, 96); g.bezierCurveTo(186, 56, 216, 130, 128, 190); g.fill(); break;
    case "globe": g.lineWidth = 12; g.beginPath(); g.arc(128, 128, 62, 0, 7); g.stroke(); g.beginPath(); g.ellipse(128, 128, 26, 62, 0, 0, 7); g.stroke();
      g.beginPath(); g.moveTo(66, 128); g.lineTo(190, 128); g.stroke(); break;
    case "game": rr(g, 50, 96, 156, 72, 36); g.fill(); g.fillStyle = "rgba(0,0,0,0.4)"; g.fillRect(76, 126, 30, 10); g.fillRect(86, 116, 10, 30); g.beginPath(); g.arc(166, 124, 8, 0, 7); g.arc(150, 142, 8, 0, 7); g.fill(); break;
    case "cloud": g.beginPath(); g.arc(100, 140, 34, 0, 7); g.arc(140, 120, 44, 0, 7); g.arc(170, 146, 30, 0, 7); g.fill(); g.fillRect(100, 140, 70, 36); break;
    case "cal": rr(g, 62, 70, 132, 124, 16); g.fill(); g.fillStyle = "rgba(0,0,0,0.4)"; g.fillRect(62, 70, 132, 30); g.font = FONT(70); g.textAlign = "center"; g.fillText("7", 128, 178); break;
    case "star": { g.beginPath(); for (let i = 0; i < 10; i++) { const r = i % 2 ? 30 : 70, a = -Math.PI / 2 + i * Math.PI / 5; g.lineTo(128 + r * Math.cos(a), 132 + r * Math.sin(a)); } g.closePath(); g.fill(); break; }
    case "bolt": P([[140, 56], [84, 140], [124, 140], [110, 200], [172, 110], [130, 110]]); break;
    case "news": rr(g, 60, 66, 136, 124, 12); g.fill(); g.fillStyle = "rgba(0,0,0,0.35)"; for (let y = 90; y < 180; y += 24) g.fillRect(76, y, 104, 10); break;
    case "food": g.beginPath(); g.arc(128, 136, 64, 0, Math.PI); g.fill(); g.fillRect(56, 128, 144, 12); g.lineWidth = 10; g.beginPath(); g.moveTo(110, 110); g.quadraticCurveTo(100, 84, 116, 64); g.moveTo(146, 110); g.quadraticCurveTo(136, 84, 152, 64); g.stroke(); break;
    case "bank": P([[128, 58], [200, 98], [56, 98]]); for (const x of [72, 106, 140, 174]) g.fillRect(x - 8, 106, 18, 60); g.fillRect(56, 172, 144, 18); break;
    case "fit": g.lineWidth = 14; g.beginPath(); g.moveTo(52, 132); g.lineTo(96, 132); g.lineTo(114, 92); g.lineTo(142, 170); g.lineTo(160, 132); g.lineTo(204, 132); g.stroke(); break;
    case "phone": g.lineWidth = 0; g.beginPath(); g.moveTo(86, 64); g.lineTo(116, 64); g.lineTo(124, 104); g.lineTo(106, 116); g.quadraticCurveTo(122, 150, 148, 162);
      g.lineTo(160, 144); g.lineTo(196, 152); g.lineTo(196, 182); g.quadraticCurveTo(80, 196, 72, 76); g.closePath(); g.fill(); break;
    case "cam": rr(g, 52, 88, 152, 100, 18); g.fill(); g.fillRect(100, 72, 56, 24); g.fillStyle = "rgba(0,0,0,0.45)"; g.beginPath(); g.arc(128, 138, 32, 0, 7); g.fill(); break;
    case "gear": { g.beginPath(); for (let i = 0; i < 16; i++) { const r = i % 2 ? 54 : 70, a = i * Math.PI / 8; g.lineTo(128 + r * Math.cos(a), 128 + r * Math.sin(a)); } g.closePath(); g.fill();
      g.fillStyle = "rgba(0,0,0,0.45)"; g.beginPath(); g.arc(128, 128, 24, 0, 7); g.fill(); break; }
  }
}
const ICON_BG = { chat: ["#34D399", "#16A34A"], play: ["#F87171", "#DC2626"], bag: ["#FDBA74", "#F97316"], card: ["#60A5FA", "#1D4ED8"], pin: ["#4ADE80", "#15803D"],
  music: ["#C084FC", "#7C3AED"], mail: ["#7DD3FC", "#0284C7"], photo: ["#FDE68A", "#F59E0B"], car: ["#475569", "#0F172A"], heart: ["#F9A8D4", "#DB2777"],
  globe: ["#67E8F9", "#0891B2"], game: ["#A5B4FC", "#4F46E5"], cloud: ["#BAE6FD", "#38BDF8"], cal: ["#FCA5A5", "#EF4444"], star: ["#FCD34D", "#EA580C"],
  bolt: ["#FDE047", "#CA8A04"], news: ["#CBD5E1", "#475569"], food: ["#FB923C", "#C2410C"], bank: ["#93C5FD", "#1E3A8A"], fit: ["#86EFAC", "#059669"],
  phone: ["#4ADE80", "#16A34A"], cam: ["#9CA3AF", "#374151"], gear: ["#D1D5DB", "#6B7280"], chat2: ["#7DD3FC", "#2563EB"] };
export const ICON = {};
for (const k of Object.keys(ICON_BG)) {
  ICON[k] = canvasTex(256, 256, (g) => {
    const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, ICON_BG[k][0]); gr.addColorStop(1, ICON_BG[k][1]);
    g.fillStyle = gr; rr(g, 4, 4, 248, 248, 60); g.fill(); glyph(g, k === "chat2" ? "chat" : k);
  });
}
const xTex = canvasTex(256, 256, (g) => {
  g.fillStyle = "#FF4D5E"; g.beginPath(); g.arc(128, 128, 112, 0, 7); g.fill();
  g.strokeStyle = "#fff"; g.lineWidth = 30; g.lineCap = "round"; g.beginPath(); g.moveTo(80, 80); g.lineTo(176, 176); g.moveTo(176, 80); g.lineTo(80, 176); g.stroke();
});
const slotTex = canvasTex(256, 256, (g) => {
  g.strokeStyle = "rgba(255,255,255,0.85)"; g.lineWidth = 10; g.setLineDash([26, 18]); rr(g, 14, 14, 228, 228, 56); g.stroke();
});
function wallTex() {
  return canvasTex(512, 1024, (g) => {
    const gr = g.createLinearGradient(0, 0, 512, 1024); gr.addColorStop(0, "#1C5FD0"); gr.addColorStop(0.55, "#0B3A8A"); gr.addColorStop(1, "#0B1E3F"); g.fillStyle = gr; g.fillRect(0, 0, 512, 1024);
    g.fillStyle = "rgba(0,194,255,0.18)"; g.beginPath(); g.arc(420, 260, 260, 0, 7); g.fill(); g.fillStyle = "rgba(255,138,0,0.12)"; g.beginPath(); g.arc(60, 820, 220, 0, 7); g.fill();
      });
}
const statusTex = (col) => canvasTex(256, 64, (g) => {
  g.fillStyle = col; for (let i = 0; i < 4; i++) g.fillRect(14 + i * 22, 44 - i * 10, 14, 10 + i * 10);
  rr(g, 130, 16, 92, 36, 8); g.lineWidth = 6; g.strokeStyle = col; g.stroke(); g.fillRect(138, 24, 66, 20); g.fillRect(224, 26, 8, 16);
});
export const TX = { x: xTex, slot: slotTex, statusW: statusTex("#ffffff"), statusG: statusTex("#4ADE80") };
function labelTex(text, bg, fg, w = 512, h = 160, px = 96) {
  return canvasTex(w, h, (g) => { g.fillStyle = bg; rr(g, 6, 6, w - 12, h - 12, 40); g.fill(); g.fillStyle = fg; g.font = FONT(px); g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(text, w / 2, h / 2 + 4); });
}

// ---------------------------------------------------------------- giant phone
// local frame: screen faces +z, centre at origin. 4x5 grid + dock of 4.
const GRID = ["chat", "play", "bag", "card", "pin", "music", "mail", "photo", "car", "heart", "globe", "game", "cloud", "cal", "star", "bolt", "news", "food", "bank", "fit"];
const DOCK = ["phone", "cam", "gear", "chat2"];
const SYSTEM = new Set(["phone", "cam", "gear"]);
export function buildPhone(scene) {
  const g = new THREE.Group(); scene.add(g);
  const body = box(6.6, 12.6, 0.7, std("#111827", { roughness: 0.4, metalness: 0.3 }), 0, 0, 0, g);
  box(6.8, 12.8, 0.5, std("#9CA3AF", { roughness: 0.35, metalness: 0.6 }), 0, 0, -0.12, g);
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(6.0, 12.0), new THREE.MeshBasicMaterial({ map: wallTex(), toneMapped: false, color: new THREE.Color(1, 1, 1) }));
  wall.position.z = 0.36; g.add(wall);
  const status = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.375), new THREE.MeshBasicMaterial({ map: TX.statusW, transparent: true, toneMapped: false }));
  status.position.set(2.0, 5.55, 0.37); g.add(status);
  const icons = [];
  const geo = new THREE.BoxGeometry(1.08, 1.08, 0.24);
  const add = (kind, x, y, k) => {
    const side = std(ICON_BG[kind === "chat2" ? "chat2" : kind][1]);
    const face = new THREE.MeshBasicMaterial({ map: ICON[kind], transparent: true, toneMapped: false });
    const m = new THREE.Mesh(geo, [side, side, side, side, face, side]); m.castShadow = true;
    m.position.set(x, y, 0.5); g.add(m);
    const ghost = new THREE.Mesh(new THREE.PlaneGeometry(1.08, 1.08), new THREE.MeshBasicMaterial({ map: ICON[kind], transparent: true, opacity: 0, toneMapped: false, depthWrite: false }));
    ghost.position.set(x, y, 0.38); g.add(ghost);
    const slot = new THREE.Mesh(new THREE.PlaneGeometry(1.15, 1.15), new THREE.MeshBasicMaterial({ map: TX.slot, transparent: true, opacity: 0, toneMapped: false, depthWrite: false }));
    slot.position.set(x, y, 0.385); g.add(slot);
    const r = rng(k * 31 + 7);
    icons.push({ kind, mesh: m, ghost, slot, x, y, k, system: SYSTEM.has(kind), dx: (r() - 0.5) * 10, dy: 7 + r() * 6, dz: 5 + r() * 6, spin: (r() - 0.5) * 8 });
  };
  GRID.forEach((kind, i) => add(kind, -2.1 + (i % 4) * 1.4, 2.9 - Math.floor(i / 4) * 1.55, i));
  DOCK.forEach((kind, i) => add(kind, -2.1 + i * 1.4, -4.85, 20 + i));
  box(5.6, 1.45, 0.05, new THREE.MeshBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.18 }), 0, -4.85, 0.37, g);
  const xs = {};
  for (const k of ["chat", "card", "pin"]) {
    const ic = icons.find((v) => v.kind === k);
    const x = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.9), new THREE.MeshBasicMaterial({ map: TX.x, transparent: true, opacity: 1, toneMapped: false, depthWrite: false }));
    x.position.set(ic.x + 0.42, ic.y + 0.42, 0.62); x.visible = false; g.add(x); xs[k] = x;
  }
  // "alive" pulse ring
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.9, 1.0, 64), new THREE.MeshBasicMaterial({ color: "#4ADE80", transparent: true, opacity: 0, side: THREE.DoubleSide, toneMapped: false, depthWrite: false }));
  ring.position.z = 0.6; g.add(ring);
  const ring2 = ring.clone(); ring2.material = ring.material.clone(); g.add(ring2);
  return { group: g, icons, wall, status, xs, rings: [ring, ring2] };
}
// icon position at flight progress k (0 = on the screen, 1 = gone)
export function placeIcon(ic, k, t) {
  const m = ic.mesh;
  if (k <= 0) { m.position.set(ic.x, ic.y, 0.5); m.rotation.set(0, 0, 0); m.scale.setScalar(1); m.visible = true; return; }
  if (k >= 1) { m.visible = false; return; }
  m.visible = true;
  const pop = Math.min(1, k / 0.12);                       // little pop off the glass first
  const f = Math.max(0, (k - 0.12) / 0.88);
  m.position.set(ic.x + ic.dx * f * f, ic.y + ic.dy * f + 3 * f * f, 0.5 + 1.2 * pop + ic.dz * f);
  m.rotation.set(f * ic.spin * 0.6, f * ic.spin, f * ic.spin * 0.3);
  m.scale.setScalar((1 + 0.25 * Math.sin(pop * Math.PI)) * (1 - f * 0.7));
}

// ---------------------------------------------------------------- bedroom diorama around the phone
export function buildRoom(scene, at) {
  const g = new THREE.Group(); g.position.copy(at); scene.add(g);
  box(18, 0.6, 18, std("#E9D5B5"), 0, -0.3, 0, g);                          // wooden floor slab
  for (let i = -8; i <= 8; i += 2) box(0.05, 0.02, 18, std("#D6BF98"), i, 0.01, 0, g);
  box(18, 14, 0.5, std("#DCEBFA"), 0, 7, -9, g);                            // back wall
  box(0.5, 14, 18, std("#C7DDF5"), -9, 7, 0, g);                            // left wall
  // window on the left wall (morning light)
  const win = box(0.2, 5, 6, new THREE.MeshBasicMaterial({ color: "#FFF4D6", toneMapped: false }), -8.7, 8, -1, g);
  box(0.3, 0.3, 6.4, std("#ffffff"), -8.6, 10.6, -1, g); box(0.3, 0.3, 6.4, std("#ffffff"), -8.6, 5.4, -1, g); box(0.3, 5.2, 0.25, std("#ffffff"), -8.6, 8, -1, g);
  // bed
  box(5, 1.2, 7.5, std("#8B5E3C"), -6, 0.6, -5, g); box(4.8, 0.7, 7.2, std("#F5F7FA"), -6, 1.55, -5, g);
  box(4.9, 0.5, 4.6, std("#0066DE"), -6, 1.95, -3.6, g); box(3.2, 0.6, 1.4, std("#ffffff"), -6, 2.1, -8, g);
  box(5, 3.2, 0.4, std("#8B5E3C"), -6, 1.6, -8.9, g);
  // side table + lamp, rug, desk
  box(1.6, 1.4, 1.6, std("#C08457"), -2.6, 0.7, -8, g);
  const lamp = new THREE.Mesh(new THREE.ConeGeometry(0.6, 0.8, 12, 1, true), std("#FF8A00", { emissive: new THREE.Color("#FFB45E"), emissiveIntensity: 0.6, side: THREE.DoubleSide })); lamp.position.set(-2.6, 2.4, -8); g.add(lamp);
  box(0.1, 0.9, 0.1, std("#334155"), -2.6, 1.8, -8, g);
  const rug = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.4, 0.06, 32), std("#FDBA74")); rug.position.set(-1, 0.04, 2); rug.receiveShadow = true; g.add(rug);
  box(5, 0.3, 2.2, std("#F5F7FA"), 5.5, 2.4, -7.6, g); for (const x of [3.3, 7.7]) box(0.25, 2.4, 2, std("#CBD5E1"), x, 1.2, -7.6, g);
  box(2.2, 1.4, 0.15, std("#1F2937", { emissive: new THREE.Color("#0B3A8A"), emissiveIntensity: 0.5 }), 5.5, 3.4, -8.1, g);
  const plant = new THREE.Mesh(new THREE.ConeGeometry(0.9, 2.2, 7), std("#22C55E")); plant.position.set(7.6, 1.7, -4.6); plant.castShadow = true; g.add(plant);
  box(1, 0.8, 1, std("#C2410C"), 7.6, 0.4, -4.6, g);
  // tiny person sitting on the bed edge, holding a phone
  const p = person(11, true); p.obj.position.set(-4.2, 1.9, -0.6); p.obj.rotation.y = 1.2; p.obj.scale.setScalar(1.15); g.add(p.obj);
  // the giant phone stands on a low dock in front-right
  box(5, 0.5, 2.4, std("#334155"), 1.6, 0.25, -1.4, g).rotation.y = Math.PI / 4;
  const ph = buildPhone(scene);
  ph.group.rotation.set(-0.1, Math.PI / 4, 0, "YXZ");
  ph.group.position.copy(at).add(new THREE.Vector3(1.6, 6.9, -1.4));
  return { group: g, phone: ph, person: p, win };
}

// ---------------------------------------------------------------- exploded phone: hardware / OS / apps as shops
export function buildStack(scene, at) {
  const g = new THREE.Group(); g.position.copy(at); scene.add(g);
  const hw = new THREE.Group(); g.add(hw);
  box(7, 0.4, 13, std("#15803D"), 0, 0, 0, hw);
  const chip = std("#111827", { roughness: 0.4 });
  box(2, 0.4, 2, chip, -1.2, 0.35, -3, hw); box(1.4, 0.3, 1, chip, 1.6, 0.3, -3.5, hw); box(1, 0.3, 1.4, chip, 1.8, 0.3, -1.4, hw);
  box(5, 0.6, 5, std("#9CA3AF", { metalness: 0.4, roughness: 0.4 }), 0, 0.45, 2.6, hw);                 // battery
  box(1, 0.6, 1, std("#1F2937"), -2.2, 0.45, -5.6, hw);
  for (let i = 0; i < 9; i++) box(0.08, 0.05, 2.8, std("#FCD34D"), -2.8 + i * 0.7, 0.23, -1, hw);
  const osMat = std("#0B3A8A", { emissive: new THREE.Color("#00C2FF"), emissiveIntensity: 0.25, roughness: 0.5 });
  const os = new THREE.Group(); g.add(os);
  box(7, 0.6, 13, osMat, 0, 0, 0, os);
  const osLabel = new THREE.Mesh(new THREE.PlaneGeometry(5, 1.56), new THREE.MeshBasicMaterial({ map: labelTex("OS", "rgba(0,0,0,0)", "#ffffff", 512, 160, 130), transparent: true, toneMapped: false }));
  osLabel.rotation.x = -Math.PI / 2; osLabel.position.set(0, 0.31, 4.4); os.add(osLabel);
  // grid lines on the OS slab = the "plots" shops stand on
  for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) {
    const pl = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.6), new THREE.MeshBasicMaterial({ map: TX.slot, transparent: true, opacity: 0.9, toneMapped: false, depthWrite: false }));
    pl.rotation.x = -Math.PI / 2; pl.position.set(-1.6 + j * 3.2, 0.32, -4.6 + i * 3.0); os.add(pl);
  }
  const shops = [];
  const COLS = [["#FECACA", "#E23B3B"], ["#D1FAE5", "#16A34A"], ["#E0E7FF", "#4F46E5"], ["#FEF3C7", "#F59E0B"], ["#CFFAFE", "#0891B2"], ["#FCE7F3", "#DB2777"]];
  const KINDS = ["chat", "card", "pin", "play", "bag", "music"];
  for (let i = 0; i < 6; i++) {
    const s = new THREE.Group(); s.position.set(-1.6 + (i % 2) * 3.2, 0.3, -4.6 + Math.floor(i / 2) * 3.0); os.add(s);
    box(2.3, 2.0, 2.2, std(COLS[i][0]), 0, 1.0, 0, s);
    const roof = box(2.6, 0.35, 2.5, std(COLS[i][1]), 0, 2.15, 0, s);
    const sg = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.1), new THREE.MeshBasicMaterial({ map: ICON[KINDS[i]], transparent: true, toneMapped: false }));
    sg.position.set(0.0, 1.15, 1.12); s.add(sg);
    const sg2 = sg.clone(); sg2.rotation.y = Math.PI / 2; sg2.position.set(1.16, 1.15, 0); s.add(sg2);
    shops.push(s);
  }
  return { group: g, hw, os, osMat, shops };
}

// ---------------------------------------------------------------- phone -> server (where money + accounts live)
const coinTex = canvasTex(256, 256, (g) => {
  g.fillStyle = "#F59E0B"; g.beginPath(); g.arc(128, 128, 112, 0, 7); g.fill(); g.fillStyle = "#FCD34D"; g.beginPath(); g.arc(128, 128, 88, 0, 7); g.fill();
  g.fillStyle = "#B45309"; g.font = FONT(96); g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("RM", 128, 134);
});
const acctTex = canvasTex(256, 256, (g) => {
  g.fillStyle = "#ffffff"; rr(g, 10, 30, 236, 196, 36); g.fill();
  g.fillStyle = "#0066DE"; g.beginPath(); g.arc(80, 112, 38, 0, 7); g.fill(); g.beginPath(); g.arc(80, 200, 62, Math.PI, 0); g.fill();
  g.fillStyle = "#CBD5E1"; g.fillRect(136, 86, 90, 18); g.fillRect(136, 120, 70, 18); g.fillRect(136, 154, 84, 18);
});
const ledTex = canvasTex(128, 256, (g) => {
  g.fillStyle = "#0f172a"; g.fillRect(0, 0, 128, 256);
  for (let r = 0; r < 10; r++) { g.fillStyle = "#1e293b"; g.fillRect(8, 8 + r * 24, 112, 18); g.fillStyle = r % 3 ? "#22C55E" : "#00C2FF"; g.fillRect(96, 13 + r * 24, 10, 8); g.fillRect(80, 13 + r * 24, 10, 8); }
});
export function buildServerBlock(scene, at) {
  const g = new THREE.Group(); g.position.copy(at); scene.add(g);
  box(40, 1, 26, std("#E2E8F0"), 0, -0.5, 0, g);
  for (let x = -18; x <= 18; x += 3) box(0.08, 0.02, 26, std("#CBD5E1"), x, 0.01, 0, g);
  // small phone lying on a pad (left front)
  box(5, 0.5, 5, std("#CBD5E1"), -5, 0.25, 6, g);
  const ph = new THREE.Group(); ph.position.set(-5, 0.7, 6); ph.rotation.y = Math.PI / 4; g.add(ph);
  box(2.2, 0.3, 4.2, std("#111827", { roughness: 0.4 }), 0, 0, 0, ph);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 4.0), new THREE.MeshBasicMaterial({ color: "#1C5FD0", toneMapped: false })); scr.rotation.x = -Math.PI / 2; scr.position.y = 0.16; ph.add(scr);
  // data centre (right back): cutaway with racks
  const dc = new THREE.Group(); dc.position.set(6, 0, -5); g.add(dc);
  box(14, 0.4, 10, std("#CBD5E1"), 0, 0.2, 0, dc);
  box(14, 8, 0.4, std("#0B1E3F"), 0, 4, -5, dc); box(0.4, 8, 10, std("#12305e"), -7, 4, 0, dc);
  box(14.4, 0.5, 10.4, std("#0066DE"), 0, 8.2, 0, dc).material.transparent = false;
  const rackMat = new THREE.MeshStandardMaterial({ map: ledTex, emissive: new THREE.Color("#ffffff"), emissiveMap: ledTex, emissiveIntensity: 0.6, roughness: 0.6 });
  const racks = [];
  for (let r = 0; r < 2; r++) for (let i = 0; i < 4; i++) racks.push(box(2, 5.5, 1.6, [std("#1e293b"), std("#1e293b"), std("#1e293b"), std("#1e293b"), rackMat, std("#1e293b")], -4.5 + i * 3, 3.15, -2.6 + r * 4, dc));
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(7, 2.2), new THREE.MeshBasicMaterial({ map: labelTex("SERVER", "#0066DE", "#ffffff", 512, 160, 92), transparent: true, toneMapped: false }));
  sign.position.set(0, 10.2, -4.6); dc.add(sign);
  // pulses along an arc phone -> data centre
  const A = new THREE.Vector3(-5, 1.5, 6).add(at), C = new THREE.Vector3(3, 6.5, -4).add(at), B = new THREE.Vector3(-1, 13, 1).add(at);
  const curve = new THREE.QuadraticBezierCurve3(A, B, C);
  const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 48, 0.12, 8, false), new THREE.MeshBasicMaterial({ color: "#00C2FF", transparent: true, opacity: 0.0, toneMapped: false }));
  scene.add(tube);
  const pulses = [];
  for (let i = 0; i < 10; i++) { const s = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 8), new THREE.MeshBasicMaterial({ color: "#7DF9FF", toneMapped: false })); s.visible = false; scene.add(s); pulses.push(s); }
  const coin = sprite(coinTex, 3.2, scene), acct = sprite(acctTex, 3.6, scene); coin.visible = acct.visible = false;
  return { group: g, curve, tube, pulses, coin, acct, rackMat, sign };
}
