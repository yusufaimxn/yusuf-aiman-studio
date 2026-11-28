// Work-world pieces for "Apa Jadi Kalau AI Ganti Semua Pekerjaan Manusia?" (generic, no real brands).
import * as THREE from "../vendor/three.module.js";
import { std, box, canvasTex, rr, FONT, person, sprite, rng, TEX } from "./kit.js";
import { plane, label, makePixels, DT } from "./data.js";

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const glowMat = (c, o = 1) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, toneMapped: false });
function grid(g, w, d, col = "#13294f", line = "rgba(0,194,255,0.3)") {
  const t = canvasTex(256, 256, (c) => { c.fillStyle = col; c.fillRect(0, 0, 256, 256); c.strokeStyle = line; c.lineWidth = 3; c.strokeRect(0, 0, 256, 256); });
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(w / 6, d / 6);
  const m = new THREE.MeshStandardMaterial({ map: t, roughness: 0.85 });
  const f = new THREE.Mesh(new THREE.BoxGeometry(w, 0.6, d), [std(col), std(col), m, std(col), std(col), std(col)]);
  f.position.y = -0.3; f.receiveShadow = true; g.add(f); return { f, m };
}
const tagTex = (text, bg, fg = "#fff", w = 512, h = 160, px = 74) => label(text, bg, fg, w, h, px);

// ---------------------------------------------------------------- textures
const screenHuman = canvasTex(256, 192, (g) => { g.fillStyle = "#F5F7FA"; g.fillRect(0, 0, 256, 192); g.fillStyle = "#94a3b8"; for (let i = 0; i < 6; i++) { rr(g, 22, 24 + i * 26, 200 - (i % 3) * 50, 12, 6); g.fill(); } });
const screenAI = canvasTex(256, 192, (g) => {
  g.fillStyle = "#0B1E3F"; g.fillRect(0, 0, 256, 192); g.strokeStyle = "#00C2FF"; g.lineWidth = 6;
  g.beginPath(); g.arc(128, 96, 46, 0, 7); g.stroke(); g.beginPath(); g.moveTo(128, 50); g.lineTo(128, 142); g.moveTo(90, 72); g.bezierCurveTo(110, 90, 146, 90, 166, 72); g.moveTo(90, 120); g.bezierCurveTo(110, 102, 146, 102, 166, 120); g.stroke();
  g.fillStyle = "#00C2FF"; g.font = FONT(30); g.textAlign = "center"; g.fillText("AI", 128, 184);
});
const screenMix = canvasTex(256, 192, (g) => { g.fillStyle = "#F5F7FA"; g.fillRect(0, 0, 256, 192); g.fillStyle = "#0066DE"; g.fillRect(0, 0, 256, 34); g.fillStyle = "#00C2FF"; for (let i = 0; i < 4; i++) { rr(g, 22, 54 + i * 32, 130, 14, 7); g.fill(); } g.fillStyle = "#22C55E"; g.beginPath(); g.arc(200, 120, 30, 0, 7); g.fill(); g.strokeStyle = "#fff"; g.lineWidth = 9; g.beginPath(); g.moveTo(186, 120); g.lineTo(197, 132); g.lineTo(216, 108); g.stroke(); });
const mailTex = canvasTex(128, 96, (g) => { g.fillStyle = "#ffffff"; rr(g, 4, 4, 120, 88, 12); g.fill(); g.strokeStyle = "#0066DE"; g.lineWidth = 8; g.beginPath(); g.moveTo(10, 12); g.lineTo(64, 56); g.lineTo(118, 12); g.stroke(); });
const docTex = canvasTex(192, 256, (g) => { g.fillStyle = "#ffffff"; g.fillRect(0, 0, 192, 256); g.fillStyle = "#0066DE"; g.fillRect(20, 20, 152, 26); g.fillStyle = "#94a3b8"; for (let i = 0; i < 6; i++) g.fillRect(20, 64 + i * 22, 152 - (i % 2) * 40, 10); g.fillStyle = "#FF8A00"; g.fillRect(24, 200, 30, 36); g.fillRect(64, 180, 30, 56); g.fillRect(104, 160, 30, 76); g.fillRect(144, 140, 30, 96); });
const designTex = canvasTex(256, 256, (g) => { g.fillStyle = "#fff7ed"; g.fillRect(0, 0, 256, 256); g.fillStyle = "#FF8A00"; g.beginPath(); g.arc(90, 100, 56, 0, 7); g.fill(); g.fillStyle = "#0066DE"; g.fillRect(130, 120, 100, 100); g.fillStyle = "#22C55E"; g.beginPath(); g.moveTo(30, 230); g.lineTo(100, 150); g.lineTo(160, 230); g.fill(); g.fillStyle = "#8B5CF6"; rr(g, 150, 30, 80, 60, 14); g.fill(); });
const slipTex = canvasTex(192, 256, (g) => { g.fillStyle = "#ffffff"; g.fillRect(0, 0, 192, 256); g.fillStyle = "#0B1E3F"; g.font = FONT(44); g.textAlign = "center"; g.fillText("GAJI", 96, 62); g.fillStyle = "#cbd5e1"; for (let i = 0; i < 5; i++) g.fillRect(24, 92 + i * 24, 144, 10); g.fillStyle = "#22C55E"; g.fillRect(24, 214, 144, 22); });
const heartTex = canvasTex(256, 256, (g) => { g.fillStyle = "#FF4D5E"; g.beginPath(); g.moveTo(128, 220); g.bezierCurveTo(20, 140, 20, 50, 82, 46); g.bezierCurveTo(110, 44, 124, 64, 128, 80); g.bezierCurveTo(132, 64, 146, 44, 174, 46); g.bezierCurveTo(236, 50, 236, 140, 128, 220); g.fill(); });
export const tickTex = canvasTex(256, 256, (g) => { g.fillStyle = "#22C55E"; g.beginPath(); g.arc(128, 128, 118, 0, 7); g.fill(); g.strokeStyle = "#fff"; g.lineWidth = 30; g.lineCap = "round"; g.lineJoin = "round"; g.beginPath(); g.moveTo(72, 132); g.lineTo(112, 172); g.lineTo(186, 92); g.stroke(); });
const walletTex = canvasTex(256, 192, (g) => { g.fillStyle = "#8b5a2b"; rr(g, 8, 30, 240, 150, 24); g.fill(); g.fillStyle = "#6b4220"; rr(g, 8, 30, 240, 50, 20); g.fill(); g.fillStyle = "rgba(255,255,255,0.85)"; g.font = FONT(46); g.textAlign = "center"; g.fillText("RM0", 128, 150); });
export const WT = { screenHuman, screenAI, screenMix, mail: mailTex, doc: docTex, design: designTex, slip: slipTex, heart: heartTex, tick: tickTex, wallet: walletTex,
  salah: tagTex("SALAH", "#FF4D5E"), lulus: tagTex("LULUS", "#22C55E"), kerja: tagTex("KERJA", "#0B1E3F", "#FF8A00", 512, 200, 110) };

// ---------------------------------------------------------------- AI brain (glowing core) + robot helper
export function brain(parent, s = 1) {
  const g = new THREE.Group(); parent.add(g);
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1 * s, 1), new THREE.MeshStandardMaterial({ color: "#0B1E3F", emissive: new THREE.Color("#00C2FF"), emissiveIntensity: 0.9, flatShading: true, roughness: 0.4 }));
  const wire = new THREE.Mesh(new THREE.IcosahedronGeometry(1.25 * s, 1), new THREE.MeshBasicMaterial({ color: "#00C2FF", wireframe: true, transparent: true, opacity: 0.6, toneMapped: false }));
  g.add(core); g.add(wire); const glow = sprite(DT.glow, 6 * s, g);
  return { g, core, wire, glow };
}
export function robot(parent, s = 1) {
  const g = new THREE.Group(); g.scale.setScalar(s); parent.add(g);
  const white = std("#F5F7FA", { flatShading: false }), dark = std("#334155");
  box(0.7, 0.7, 0.5, dark, 0, 0.35, 0, g);
  const body = box(0.9, 0.85, 0.6, white, 0, 1.15, 0, g);
  const head = new THREE.Group(); head.position.y = 1.85; g.add(head);
  box(0.8, 0.55, 0.6, white, 0, 0, 0, head);
  const visor = box(0.62, 0.22, 0.05, std("#0B1E3F", { emissive: new THREE.Color("#00C2FF"), emissiveIntensity: 1.2 }), 0, 0.02, 0.31, head);
  box(0.05, 0.3, 0.05, dark, 0, 0.42, 0, head); const tip = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 8), glowMat("#00C2FF")); tip.position.y = 0.6; head.add(tip);
  const arms = [-1, 1].map((sd) => { const a = new THREE.Group(); a.position.set(sd * 0.55, 1.45, 0); g.add(a); box(0.18, 0.7, 0.18, white, 0, -0.35, 0, a); return a; });
  return { g, head, visor, arms, body };
}

// ---------------------------------------------------------------- office floor inside a city ring
export function buildOffice(scene, at) {
  const g = new THREE.Group(); g.position.copy(at); scene.add(g);
  const floor = grid(g, 30, 22, "#dbe4f0", "rgba(11,30,63,0.12)");
  box(30, 6, 0.4, std("#F5F7FA"), 0, 3, -11, g); box(0.4, 6, 22, std("#e2e8f0"), -15, 3, 0, g);
  const r = rng(4), desks = [];
  for (let row = 0; row < 3; row++) for (let c = 0; c < 4; c++) {
    const x = -9 + c * 6, z = -6 + row * 6, d = new THREE.Group(); d.position.set(x, 0, z); g.add(d);
    box(2.6, 0.12, 1.3, std("#c08a5a"), 0, 0.85, 0, d); box(0.12, 0.85, 1.1, std("#475569"), -1.15, 0.42, 0, d); box(0.12, 0.85, 1.1, std("#475569"), 1.15, 0.42, 0, d);
    box(0.1, 0.5, 0.1, std("#334155"), 0, 1.15, -0.35, d);
    const mon = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.95, 0.08), [std("#111827"), std("#111827"), std("#111827"), std("#111827"), new THREE.MeshBasicMaterial({ map: screenHuman, toneMapped: false }), std("#111827")]);
    mon.position.set(0, 1.75, -0.35); d.add(mon);
    box(0.9, 0.05, 0.3, std("#e5e7eb"), 0, 0.94, 0.2, d);
    box(0.8, 0.12, 0.8, std("#1F2937"), 0, 0.55, 1.2, d);
    const p = person(20 + row * 4 + c, false); p.obj.position.set(0, 0, 1.25); p.obj.rotation.y = Math.PI; d.add(p.obj); p.look(0);
    const ring = new THREE.Mesh(new THREE.RingGeometry(1.8, 2.2, 40), glowMat("#00C2FF", 0)); ring.rotation.x = -Math.PI / 2; ring.position.y = 0.03; d.add(ring);
    const bot = robot(d, 0.8); bot.g.position.set(1.9, 0, 0.6); bot.g.rotation.y = -0.6; bot.g.visible = false;
    desks.push({ d, mon, p, ring, bot, x, z, dist: Math.hypot(x - 0, z - 6), i: desks.length });
  }
  // hero desk = front middle-ish (row 2, col 1)
  const hero = desks[9];
  const what = sprite(TEX.what, 1.2, g); what.visible = false;
  const mails = Array.from({ length: 8 }, () => { const s = sprite(mailTex, 0.9, g); s.visible = false; return s; });
  const papers = Array.from({ length: 10 }, (_, i) => { const p = box(0.9, 0.04, 1.2, std("#ffffff"), 0, 0, 0, g); p.visible = false; return p; });
  const report = plane(1.4, 1.85, docTex); report.visible = false; g.add(report);
  const canvasP = plane(1.8, 1.8, designTex); canvasP.visible = false; g.add(canvasP);
  const ai = brain(g, 1.1); ai.g.position.set(hero.x, 4.6, hero.z - 0.4);
  // city ring around the office
  const city = [], cr = rng(9);
  const kinds = ["office", "factory", "shop", "bank"];
  for (let i = 0; i < 70; i++) {
    const a = cr() * Math.PI * 2, R = 26 + cr() * 70, x = Math.cos(a) * R, z = Math.sin(a) * R;
    if (city.some((c) => Math.hypot(c.x - x, c.z - z) < 9)) continue;
    const w = 6 + cr() * 4, h = 5 + cr() * 22, k = kinds[Math.floor(cr() * 4)];
    const mat = std(k === "factory" ? "#94a3b8" : k === "shop" ? "#fde68a" : k === "bank" ? "#e2e8f0" : "#cbd5e1", { emissive: new THREE.Color("#00C2FF"), emissiveIntensity: 0 });
    const bh = k === "factory" ? h * 0.4 : h, b = box(w, bh, w, mat, x, bh / 2, z, g), parts = [[b, bh]];
    if (k === "factory") parts.push([box(1.2, h * 0.7, 1.2, std("#64748b"), x + w * 0.3, h * 0.35, z - w * 0.3, g), h * 0.7]);
    city.push({ b, mat, x, z, d: Math.hypot(x, z), k, parts });
  }
  const ground = new THREE.Mesh(new THREE.CircleGeometry(110, 64), std("#1b2d55")); ground.rotation.x = -Math.PI / 2; ground.position.y = -0.62; ground.receiveShadow = true; g.add(ground);
  const wave = new THREE.Mesh(new THREE.RingGeometry(0.96, 1, 96), glowMat("#00C2FF", 0.85)); wave.rotation.x = -Math.PI / 2; wave.position.y = 0.4; wave.visible = false; g.add(wave);
  return { group: g, floor, desks, hero, what, mails, papers, report, canvasP, ai, city, wave };
}

// ---------------------------------------------------------------- factory: conveyor + robot arms
export function buildFactory(scene, at) {
  const g = new THREE.Group(); g.position.copy(at); scene.add(g);
  grid(g, 30, 22);
  box(26, 0.9, 2.6, std("#334155"), 0, 0.45, 0, g); const belt = box(26, 0.08, 2.2, std("#111827"), 0, 0.95, 0, g);
  const boxes = Array.from({ length: 9 }, (_, i) => box(1.3, 1.1, 1.3, std(["#c08a5a", "#d6a46e"][i % 2]), 0, 1.55, 0, g));
  const arms = [-5, 5].map((x, i) => {
    const base = new THREE.Group(); base.position.set(x, 0, -3.2); g.add(base);
    box(1.6, 0.8, 1.6, std("#FF8A00"), 0, 0.4, 0, base);
    const sh = new THREE.Group(); sh.position.y = 0.9; base.add(sh);
    box(0.6, 3.2, 0.6, std("#FF8A00"), 0, 1.6, 0, sh);
    const el = new THREE.Group(); el.position.y = 3.2; sh.add(el);
    box(0.5, 0.5, 3.2, std("#F5F7FA"), 0, 0, 1.6, el);
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 8), glowMat("#00C2FF")); lamp.position.set(0, 0, 3.3); el.add(lamp);
    return { base, sh, el, i };
  });
  const idle = person(77, false); idle.obj.position.set(9, 0, 5); idle.obj.rotation.y = -0.8; g.add(idle.obj);
  const lights = [-8, 0, 8].map((x) => { const l = sprite(DT.glow, 6, g); l.position.set(x, 6, -6); return l; });
  return { group: g, boxes, arms, idle, lights };
}

// ---------------------------------------------------------------- shop: shelves, self-checkout, robot cart; goes dark and piles up later
export function buildShop(scene, at) {
  const g = new THREE.Group(); g.position.copy(at); scene.add(g);
  grid(g, 30, 22, "#e5e7eb", "rgba(11,30,63,0.1)");
  box(30, 7, 0.4, std("#fef3c7"), 0, 3.5, -11, g); box(0.4, 7, 22, std("#fde68a"), -15, 3.5, 0, g);
  const sign = plane(8, 1.8, tagTex("KEDAI", "#22C55E")); sign.position.set(0, 6, -10.7); g.add(sign);
  const r = rng(12), goods = [], pile = [];
  for (let s = 0; s < 3; s++) {
    const x = -8 + s * 6; box(4.6, 4, 1.2, std("#94a3b8"), x, 2, -6, g);
    for (let k = 0; k < 3; k++) box(4.6, 0.1, 1.3, std("#e2e8f0"), x, 0.9 + k * 1.3, -5.9, g);
    for (let k = 0; k < 12; k++) goods.push(box(0.6, 0.8, 0.6, std(["#E23B3B", "#0066DE", "#22C55E", "#FF8A00", "#8B5CF6"][Math.floor(r() * 5)]), x - 1.8 + (k % 4) * 1.2, 1.4 + Math.floor(k / 4) * 1.3, -5.6, g));
  }
  for (let k = 0; k < 40; k++) { const b = box(1, 1, 1, std(["#c08a5a", "#d6a46e", "#a16207"][k % 3]), 5 + (k % 5) * 1.05, 0.5 + Math.floor(k / 10) * 1.02, 2 + (Math.floor(k / 5) % 2) * 1.05, g); b.visible = false; pile.push(b); }
  const kiosk = new THREE.Group(); kiosk.position.set(-6, 0, 4); g.add(kiosk);
  box(1.6, 2.6, 1, std("#F5F7FA"), 0, 1.3, 0, kiosk);
  const kscr = plane(1.2, 0.9, screenAI); kscr.position.set(0, 2.2, 0.51); kiosk.add(kscr);
  const cart = robot(g, 1.1); cart.g.position.set(0, 0, 3);
  const lampMat = std("#fff7d6", { emissive: new THREE.Color("#fff3c4"), emissiveIntensity: 1 });
  const lamps = [-6, 0, 6].map((x) => box(4, 0.2, 0.6, lampMat, x, 6.6, -2, g));
  const shopper = person(88, true); shopper.obj.position.set(-2, 0, 6); g.add(shopper.obj);
  return { group: g, goods, pile, kiosk, kscr, cart, lampMat, shopper, sign };
}

// ---------------------------------------------------------------- bank hall with ATM + robot teller
export function buildBankHall(scene, at) {
  const g = new THREE.Group(); g.position.copy(at); scene.add(g);
  grid(g, 30, 22, "#e2e8f0", "rgba(11,30,63,0.1)");
  box(30, 8, 0.6, std("#F5F7FA"), 0, 4, -10, g);
  for (let i = 0; i < 6; i++) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.6, 7, 16), std("#ffffff")); c.position.set(-12.5 + i * 5, 3.5, -8.4); c.castShadow = true; g.add(c); }
  box(30, 1.2, 2, std("#cbd5e1"), 0, 8.2, -8.4, g);
  const counter = box(14, 1.4, 1.4, std("#0B1E3F"), 0, 0.7, -3, g);
  const tellers = [-4, 0, 4].map((x) => { const b = robot(g, 1.1); b.g.position.set(x, 0, -4.6); return b; });
  const atms = [-11, -8].map((x) => { const a = box(2, 3.2, 1.2, std("#0066DE"), x, 1.6, 2, g); const s = plane(1.4, 1, screenAI); s.position.set(x, 2.3, 2.61); g.add(s); return a; });
  return { group: g, tellers };
}

// ---------------------------------------------------------------- profit tower + payslips
export function buildProfit(scene, at) {
  const g = new THREE.Group(); g.position.copy(at); scene.add(g);
  grid(g, 30, 22);
  box(6, 18, 6, std("#1F2937", { emissive: new THREE.Color("#00C2FF"), emissiveIntensity: 0.15 }), -7, 9, -5, g);
  const bars = [0, 1, 2, 3, 4].map((i) => { const m = std(i === 4 ? "#22C55E" : "#00C2FF", { emissive: new THREE.Color(i === 4 ? "#22C55E" : "#00C2FF"), emissiveIntensity: 0.4 }); const b = box(1.6, 1, 1.6, m, -1 + i * 2.2, 0.5, -4, g); return b; });
  const arrow = new THREE.Group(); g.add(arrow);
  const shaft = box(0.5, 0.5, 1, glowMat("#22C55E"), 0, 0, 0, arrow); const head = new THREE.Mesh(new THREE.ConeGeometry(0.9, 1.6, 4), glowMat("#22C55E")); arrow.add(head);
  const slips = Array.from({ length: 6 }, (_, i) => { const p = plane(1.6, 2.1, slipTex); p.position.set(-5 + i * 2, 1.6, 5); g.add(p); return { p, px: makePixels(g, 10, i % 2 ? "#ffffff" : "#22C55E"), at: p.position.clone() }; });
  const workers = [0, 1, 2].map((i) => { const p = person(30 + i, false); p.obj.position.set(-4 + i * 4, 0, 7.5); p.obj.rotation.y = Math.PI * 0.85; g.add(p.obj); return p; });
  return { group: g, bars, arrow, shaft, head, slips, workers };
}

// ---------------------------------------------------------------- quiet plaza: people with empty wallets, giant "?"
export function buildPlaza(scene, at) {
  const g = new THREE.Group(); g.position.copy(at); scene.add(g);
  grid(g, 36, 28, "#1b2d55", "rgba(0,194,255,0.2)");
  const r = rng(21), people = [];
  for (let i = 0; i < 14; i++) { const p = person(40 + i, false); const a = i / 14 * Math.PI * 2, R = 5 + r() * 7; p.obj.position.set(Math.cos(a) * R, 0, Math.sin(a) * R); p.obj.rotation.y = -a - Math.PI / 2; g.add(p.obj); const w = sprite(walletTex, 1.1, g); w.visible = false; people.push({ p, w, a }); }
  const shops = [-12, -4, 4, 12].map((x) => { const m = std("#fde68a", { emissive: new THREE.Color("#ffd27a"), emissiveIntensity: 0.6 }); box(6, 5, 5, m, x, 2.5, -11, g); return m; });
  const big = sprite(TEX.what, 9, g); big.visible = false;
  return { group: g, people, shops, big };
}

// ---------------------------------------------------------------- money loop: salary → shop → factory → salary
export function buildLoop(scene, at) {
  const g = new THREE.Group(); g.position.copy(at); scene.add(g);
  grid(g, 34, 28);
  const R = 9, track = new THREE.Mesh(new THREE.TorusGeometry(R, 0.35, 10, 90), new THREE.MeshStandardMaterial({ color: "#0B1E3F", emissive: new THREE.Color("#00C2FF"), emissiveIntensity: 0.8 }));
  track.rotation.x = -Math.PI / 2; track.position.y = 0.6; g.add(track);
  const stations = [["GAJI", "#22C55E"], ["KEDAI", "#FF8A00"], ["KILANG", "#0066DE"]].map(([t, c], i) => {
    const a = i / 3 * Math.PI * 2 - Math.PI / 2, x = Math.cos(a) * R, z = Math.sin(a) * R;
    box(3.4, 2.6, 3.4, std(c), x, 1.3, z, g); const s = sprite(tagTex(t, c), 4.2, g); s.position.set(x, 4.4, z); return { x, z };
  });
  const coins = Array.from({ length: 16 }, () => { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.16, 20), std("#E8B04B", { metalness: 0.6, roughness: 0.3, emissive: new THREE.Color("#7a5200"), emissiveIntensity: 0.4 })); c.castShadow = true; g.add(c); return c; });
  const shards = Array.from({ length: 10 }, (_, i) => { const a = i / 10 * Math.PI * 2; const s = box(1.6, 0.5, 0.5, std("#FF4D5E", { emissive: new THREE.Color("#FF4D5E"), emissiveIntensity: 0.8 }), Math.cos(a) * R, 0.6, Math.sin(a) * R, g); s.rotation.y = -a; s.visible = false; return { s, a }; });
  const redGlow = sprite(DT.redGlow, 26, g); redGlow.position.y = 1; redGlow.visible = false;
  return { group: g, R, track, coins, shards, redGlow };
}

// ---------------------------------------------------------------- stage: robot vs person, KERJA card that splits into TUGAS cards
export const TASKS = [["TAIP", "#00C2FF", 1], ["SUSUN DATA", "#00C2FF", 1], ["RINGKAS", "#00C2FF", 1], ["CHECK", "#FF8A00", 0], ["KEPUTUSAN", "#FF8A00", 0], ["LAYAN ORANG", "#FF8A00", 0]];
export function buildStage(scene, at) {
  const g = new THREE.Group(); g.position.copy(at); scene.add(g);
  grid(g, 30, 22);
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(9, 9.4, 0.6, 48), std("#0B1E3F", { emissive: new THREE.Color("#00C2FF"), emissiveIntensity: 0.15 })); disc.position.y = 0.3; disc.receiveShadow = true; g.add(disc);
  const bot = robot(g, 2); bot.g.position.set(-5.5, 0.6, 0); bot.g.rotation.y = Math.PI / 2;
  const hum = person(5, false); hum.obj.scale.setScalar(2); hum.obj.position.set(5.5, 0.6, 0); hum.obj.rotation.y = -Math.PI / 2; g.add(hum.obj);
  const card = plane(5.6, 2.2, WT.kerja); card.position.set(0, 5, 0); g.add(card);
  const cardPx = makePixels(g, 26, "#FF8A00");
  const tasks = TASKS.map(([t, c, ai], i) => { const m = plane(4.2, 1.2, tagTex(t, "#0B1E3F", c, 640, 180, 70)); m.visible = false; g.add(m); const tk = sprite(tickTex, 1, g); tk.visible = false; return { m, t, ai, i, tk }; });
  const what = sprite(TEX.what, 2.4, g); what.position.set(0, 8.6, 0); what.visible = false;
  return { group: g, bot, hum, card, cardPx, tasks, what };
}

// ---------------------------------------------------------------- human-only stations: check, decide, care, sign
export function buildHuman(scene, at) {
  const g = new THREE.Group(); g.position.copy(at); scene.add(g);
  grid(g, 40, 26, "#dbe4f0", "rgba(11,30,63,0.12)");
  const ST = [V(-14, 0, 0), V(-4.5, 0, 0), V(4.5, 0, 0), V(14, 0, 0)];
  // 1 check: robot output on a screen, human reviews
  const s1 = new THREE.Group(); s1.position.copy(ST[0]); g.add(s1);
  const bot = robot(s1, 1.2); bot.g.position.set(-2, 0, -1); bot.g.rotation.y = 0.5;
  const scr = plane(3.2, 2.2, DT.tabOk); scr.position.set(0.6, 3.4, -1.6); s1.add(scr); box(0.2, 2.4, 0.2, std("#334155"), 0.6, 1.2, -1.7, s1);
  const salah = sprite(WT.salah, 3, s1); salah.position.set(0.6, 5.4, -1.2); salah.visible = false;
  const p1 = person(61, false); p1.obj.position.set(1.8, 0, 1.4); p1.obj.rotation.y = Math.PI + 0.5; s1.add(p1.obj);
  const tick1 = sprite(tickTex, 1.6, s1); tick1.position.set(1.8, 3, 1.4); tick1.visible = false;
  // 2 decide: big button
  const s2 = new THREE.Group(); s2.position.copy(ST[1]); g.add(s2);
  box(2, 1.4, 2, std("#334155"), 0, 0.7, 0, s2); const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.4, 24), std("#22C55E", { emissive: new THREE.Color("#22C55E"), emissiveIntensity: 0.4 })); btn.position.y = 1.6; s2.add(btn);
  const p2 = person(62, false); p2.obj.position.set(0, 0, 2); p2.obj.rotation.y = Math.PI; s2.add(p2.obj);
  const lulus = sprite(WT.lulus, 3, s2); lulus.position.set(0, 4, 0); lulus.visible = false;
  // 3 care: customer + staff, heart
  const s3 = new THREE.Group(); s3.position.copy(ST[2]); g.add(s3);
  const p3 = person(63, false), c3 = person(64, false); p3.obj.position.set(-1, 0, 0); p3.obj.rotation.y = Math.PI / 2; c3.obj.position.set(1, 0, 0); c3.obj.rotation.y = -Math.PI / 2; s3.add(p3.obj); s3.add(c3.obj);
  const heart = sprite(heartTex, 1.8, s3); heart.position.set(0, 3, 0); heart.visible = false;
  // 4 sign: document + signature line + stamp
  const s4 = new THREE.Group(); s4.position.copy(ST[3]); g.add(s4);
  box(3, 0.12, 2, std("#c08a5a"), 0, 1.1, 0, s4); box(0.12, 1.1, 1.6, std("#475569"), -1.3, 0.55, 0, s4); box(0.12, 1.1, 1.6, std("#475569"), 1.3, 0.55, 0, s4);
  const paper = box(1.6, 0.03, 2, std("#ffffff"), 0, 1.18, 0, s4);
  const sig = box(1, 0.02, 0.08, std("#0066DE"), -0.1, 1.21, 0.5, s4); sig.scale.x = 0.001;
  const stamp = box(0.5, 0.02, 0.5, std("#FF4D5E"), 0.45, 1.21, -0.5, s4); stamp.visible = false;
  const p4 = person(65, false); p4.obj.position.set(0, 0, 1.8); p4.obj.rotation.y = Math.PI; s4.add(p4.obj);
  const glows = [ST[0], ST[1], ST[2], ST[3]].map((p) => { const s = sprite(DT.glow, 1, g); s.material = s.material.clone(); s.position.copy(p).add(V(0, 2, 0)); s.visible = false; return s; });
  return { group: g, ST, bot, scr, salah, p1, tick1, btn, lulus, heart, sig, stamp, p3, c3, glows };
}
