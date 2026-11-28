// Code-world pieces for "Apa Jadi Kalau Semua Developer Guna Bahasa Programming Yang Sama?" (names as plain text, no logos).
import * as THREE from "../vendor/three.module.js";
import { std, box, canvasTex, rr, FONT, person, sprite, rng, TEX } from "./kit.js";

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const basic = (o) => new THREE.MeshBasicMaterial({ transparent: true, toneMapped: false, ...o });
export const plane = (w, h, map, o = {}) => new THREE.Mesh(new THREE.PlaneGeometry(w, h), basic({ map, side: THREE.DoubleSide, ...o }));
function island(g, w, d, col = "#bfe0a6", side = "#8a6a4a") { box(w, 0.6, d, std(col), 0, -0.3, 0, g); box(w, 2.4, d, std(side), 0, -1.9, 0, g); }
export const label = (text, bg, fg, w = 512, h = 160, px = 78) => canvasTex(w, h, (g) => {
  g.fillStyle = bg; rr(g, 6, 6, w - 12, h - 12, 34); g.fill(); g.fillStyle = fg; g.font = FONT(px); g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(text, w / 2, h / 2 + 4);
});
const faceTex = (text, bg, fg, px = 70) => canvasTex(256, 256, (g) => {
  g.fillStyle = bg; g.fillRect(0, 0, 256, 256); g.strokeStyle = "rgba(255,255,255,0.35)"; g.lineWidth = 10; g.strokeRect(10, 10, 236, 236);
  g.fillStyle = fg; g.font = FONT(px); g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(text, 128, 134);
});
const bitTex = (ch) => canvasTex(128, 128, (g) => { g.fillStyle = "#00C2FF"; g.font = FONT(110); g.textAlign = "center"; g.textBaseline = "middle"; g.shadowColor = "#00C2FF"; g.shadowBlur = 18; g.fillText(ch, 64, 70); });
const bubbleTex = canvasTex(256, 192, (g) => {
  g.fillStyle = "#0B1E3F"; rr(g, 8, 8, 240, 140, 30); g.fill(); g.beginPath(); g.moveTo(60, 146); g.lineTo(90, 146); g.lineTo(56, 184); g.fill();
  g.fillStyle = "#00C2FF"; g.font = FONT(84); g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("</>", 128, 82);
});
const tickTex = canvasTex(256, 256, (g) => { g.fillStyle = "#22C55E"; g.beginPath(); g.arc(128, 128, 120, 0, 7); g.fill(); g.strokeStyle = "#fff"; g.lineWidth = 26; g.lineCap = "round"; g.lineJoin = "round"; g.beginPath(); g.moveTo(70, 132); g.lineTo(110, 172); g.lineTo(186, 90); g.stroke(); });
const glowTex = canvasTex(256, 256, (g) => { const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128); gr.addColorStop(0, "rgba(0,194,255,0.9)"); gr.addColorStop(0.4, "rgba(0,194,255,0.35)"); gr.addColorStop(1, "rgba(0,194,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); });
const redGlowTex = canvasTex(256, 256, (g) => { const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128); gr.addColorStop(0, "rgba(255,77,94,0.95)"); gr.addColorStop(0.45, "rgba(255,77,94,0.35)"); gr.addColorStop(1, "rgba(255,77,94,0)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); });
const gridTex = canvasTex(512, 512, (g) => { g.fillStyle = "#0B1E3F"; g.fillRect(0, 0, 512, 512); g.strokeStyle = "rgba(0,194,255,0.35)"; g.lineWidth = 3; for (let i = 0; i <= 512; i += 64) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 512); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(512, i); g.stroke(); } });
gridTex.wrapS = gridTex.wrapT = THREE.RepeatWrapping;
const lagTex = label("LAG", "#FF4D5E", "#ffffff", 384, 160, 100);
const smokeTex = canvasTex(128, 128, (g) => { const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, "rgba(120,130,150,0.9)"); gr.addColorStop(1, "rgba(120,130,150,0)"); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); });
export const CT = { bit0: bitTex("0"), bit1: bitTex("1"), bubble: bubbleTex, tick: tickTex, glow: glowTex, redGlow: redGlowTex, lag: lagTex, smoke: smokeTex };

export const LANGS = [
  { name: "Python", bg: "#2F6DB5", fg: "#FFD43B", px: 54 },
  { name: "Java", bg: "#E76F00", fg: "#ffffff", px: 70 },
  { name: "C++", bg: "#00599C", fg: "#ffffff", px: 84 },
  { name: "JavaScript", bg: "#F0DB4F", fg: "#1F2937", px: 36 },
];
// language cube: name on the three faces the iso camera sees
export function langCube(parent, L, s = 2.4) {
  const t = faceTex(L.name, L.bg, L.fg, L.px), side = new THREE.MeshStandardMaterial({ map: t, roughness: 0.5, emissive: new THREE.Color(L.bg), emissiveIntensity: 0.25 });
  const m = new THREE.Mesh(new THREE.BoxGeometry(s, s, s), side); m.castShadow = true; parent.add(m); return m;
}
const floorGrid = (g, w, d) => {
  const t = gridTex.clone(); t.needsUpdate = true; t.repeat.set(w / 8, d / 8);
  const f = new THREE.Mesh(new THREE.BoxGeometry(w, 0.6, d), [std("#13294f"), std("#13294f"), new THREE.MeshStandardMaterial({ map: t, roughness: 0.8, emissive: new THREE.Color("#0B1E3F"), emissiveIntensity: 0.4 }), std("#0b1530"), std("#13294f"), std("#13294f")]);
  f.position.y = -0.3; f.receiveShadow = true; g.add(f); return f;
};

// ---------------------------------------------------------------- core: four language cubes merge into one
export function buildCore(scene, at) {
  const g = new THREE.Group(); g.position.copy(at); scene.add(g);
  floorGrid(g, 60, 60);
  const cubes = LANGS.map((L) => langCube(g, L, 3.2));
  const one = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 5), new THREE.MeshStandardMaterial({ map: faceTex("SATU", "#0066DE", "#ffffff", 76), roughness: 0.4, emissive: new THREE.Color("#00C2FF"), emissiveIntensity: 0.5 }));
  one.castShadow = true; g.add(one);
  const glow = sprite(glowTex, 16, g); const what = sprite(TEX.what, 3.4, g);
  const pad = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 5, 0.6, 32), std("#13294f", { emissive: new THREE.Color("#00C2FF"), emissiveIntensity: 0.3 })); pad.position.y = 0.3; g.add(pad);
  // bug: small beetle
  const bug = new THREE.Group(); g.add(bug);
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.55, 14, 10), std("#E23B3B", { flatShading: false })); body.scale.set(1.3, 0.7, 1); body.position.y = 0.45; bug.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 10, 8), std("#1F2937")); head.position.set(0.75, 0.42, 0); bug.add(head);
  const legs = []; for (let i = 0; i < 6; i++) { const l = box(0.08, 0.08, 0.9, std("#1F2937"), -0.35 + (i % 3) * 0.35, 0.25, (i < 3 ? 1 : -1) * 0.45, bug); legs.push(l); }
  for (const s of [-1, 1]) { const a = box(0.05, 0.05, 0.6, std("#1F2937"), 1.05, 0.65, s * 0.2, bug); a.rotation.y = s * 0.6; }
  const crackGlow = sprite(redGlowTex, 20, g); crackGlow.visible = false;
  return { group: g, cubes, one, glow, what, bug, legs, crackGlow };
}

// ---------------------------------------------------------------- office: developers sharing code
export function buildOffice(scene, at) {
  const g = new THREE.Group(); g.position.copy(at); scene.add(g);
  island(g, 30, 22, "#E2E8F0", "#94a3b8");
  box(30, 6, 0.4, std("#F5F7FA"), 0, 3, -10.8, g); box(0.4, 6, 22, std("#E0E7FF"), -14.8, 3, 0, g);
  const desks = [], r = rng(4);
  for (let i = 0; i < 6; i++) {
    const x = -9 + (i % 3) * 9, z = -4 + Math.floor(i / 3) * 8;
    box(4.4, 0.2, 2.4, std("#c08457"), x, 1.5, z, g); box(0.2, 1.4, 0.2, std("#475569"), x - 2, 0.7, z, g); box(0.2, 1.4, 0.2, std("#475569"), x + 2, 0.7, z, g);
    const mon = box(2.2, 1.4, 0.15, std("#111827", { emissive: new THREE.Color("#00C2FF"), emissiveIntensity: 0.8 }), x, 2.4, z - 0.6, g);
    const p = person(80 + i, false); p.obj.position.set(x, 0, z + 1.6); p.obj.rotation.y = Math.PI; g.add(p.obj);
    const tick = sprite(tickTex, 1.6, g); tick.position.set(x, 5, z); tick.visible = false;
    desks.push({ x, z, mon, p, tick });
  }
  const plants = [[-13, -9], [13, -9], [13, 9]].map(([x, z]) => { const c = new THREE.Mesh(new THREE.ConeGeometry(0.9, 2.4, 7), std("#4ade80")); c.position.set(x, 1.2, z); c.castShadow = true; g.add(c); return c; });
  const bubbles = []; for (let i = 0; i < 8; i++) { const b = sprite(bubbleTex, 2.6, g); b.scale.set(2.6, 1.95, 1); b.visible = false; bubbles.push(b); }
  return { group: g, desks, bubbles };
}

// ---------------------------------------------------------------- student: one book, everything pops out
export function buildStudent(scene, at) {
  const g = new THREE.Group(); g.position.copy(at); scene.add(g);
  const pad = new THREE.Mesh(new THREE.CylinderGeometry(10, 10, 0.6, 40), std("#13294f", { emissive: new THREE.Color("#00C2FF"), emissiveIntensity: 0.15 })); pad.position.y = -0.3; pad.receiveShadow = true; g.add(pad);
  const st = person(31, false); st.obj.scale.setScalar(1.6); g.add(st.obj);
  const book = box(1.1, 0.25, 0.8, std("#FF8A00", { emissive: new THREE.Color("#FF8A00"), emissiveIntensity: 0.4 }), 0, 2, 0.75, g); book.rotation.x = -0.5;
  const items = [];
  // app (phone)
  const ph = new THREE.Group(); g.add(ph); box(1.6, 2.8, 0.2, std("#111827"), 0, 0, 0, ph); box(1.4, 2.5, 0.05, std("#0066DE", { emissive: new THREE.Color("#0066DE"), emissiveIntensity: 0.6 }), 0, 0, 0.13, ph); items.push(ph);
  // website (browser)
  const wb = new THREE.Group(); g.add(wb); box(3.4, 2.4, 0.15, std("#F5F7FA"), 0, 0, 0, wb); box(3.4, 0.5, 0.17, std("#0066DE"), 0, 0.95, 0.01, wb); box(1.4, 1.2, 0.18, std("#FF8A00"), -0.8, -0.3, 0.02, wb); items.push(wb);
  // game controller
  const gc = new THREE.Group(); g.add(gc); box(2.6, 0.5, 1.4, std("#8B5CF6"), 0, 0, 0, gc); for (const x of [-0.7, 0.7]) { const b = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.2, 10), std(x < 0 ? "#22C55E" : "#E23B3B")); b.position.set(x, 0.3, 0); gc.add(b); } items.push(gc);
  // robot
  const rb = new THREE.Group(); g.add(rb); box(1.4, 1.6, 1, std("#94a3b8"), 0, 0, 0, rb); box(1, 0.9, 0.9, std("#cbd5e1"), 0, 1.3, 0, rb); for (const x of [-0.25, 0.25]) box(0.2, 0.2, 0.05, std("#00C2FF", { emissive: new THREE.Color("#00C2FF"), emissiveIntensity: 1 }), x, 1.35, 0.47, rb); items.push(rb);
  const slots = [V(-4.5, 4.5, 2), V(4.5, 5, 1), V(-4, 1.6, 4), V(4.2, 1.8, 4)];
  items.forEach((it, i) => { it.position.copy(slots[i]); it.visible = false; it.traverse((o) => { if (o.isMesh) o.castShadow = true; }); });
  return { group: g, st, book, items, slots };
}

// ---------------------------------------------------------------- balance scale: SENANG vs LAJU
export function buildScale(scene, at) {
  const g = new THREE.Group(); g.position.copy(at); scene.add(g);
  floorGrid(g, 34, 24);
  box(3, 0.6, 3, std("#334155"), 0, 0.3, 0, g);
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.5, 10, 12), std("#94a3b8", { metalness: 0.4 })); post.position.y = 5.3; post.castShadow = true; g.add(post);
  const beam = new THREE.Group(); beam.position.y = 10.3; g.add(beam);
  box(16, 0.45, 0.45, std("#FFC94D", { metalness: 0.3 }), 0, 0, 0, beam);
  const pivot = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 12), std("#FF8A00")); beam.add(pivot);
  const pans = [-7.5, 7.5].map((x, i) => {
    const hang = new THREE.Group(); hang.position.x = x; beam.add(hang);
    for (const dz of [-1, 1]) box(0.06, 4.4, 0.06, std("#475569"), 0, -2.2, dz * 1.4, hang);
    const pan = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 1.8, 0.5, 24), std(i ? "#FF8A00" : "#22C55E", { flatShading: false })); pan.position.y = -4.4; pan.castShadow = true; hang.add(pan);
    const lb = plane(4.6, 1.44, label(i ? "LAJU" : "SENANG", i ? "#FF8A00" : "#22C55E", "#ffffff")); lb.position.y = -2.2; hang.add(lb);
    const icon = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.4, 1.4), std(i ? "#E23B3B" : "#0066DE")); icon.position.y = -3.4; hang.add(icon);
    return { hang, lb };
  });
  const what = sprite(TEX.what, 3, g); what.position.set(0, 14, 0); what.visible = false;
  return { group: g, beam, pans, what };
}

// ---------------------------------------------------------------- race track (lag) + hot phone
export function buildRace(scene, at) {
  const g = new THREE.Group(); g.position.copy(at); scene.add(g);
  island(g, 40, 30, "#86d06a");
  const track = new THREE.Mesh(new THREE.TorusGeometry(10, 2.2, 4, 64), std("#3b4252")); track.rotation.x = Math.PI / 2; track.scale.set(1.3, 1, 0.12); track.position.y = 0.05; track.receiveShadow = true; g.add(track);
  for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2; box(0.6, 0.12, 0.25, std(i % 2 ? "#E23B3B" : "#ffffff"), Math.cos(a) * 13 * 1.0, 0.15, Math.sin(a) * 10 * 1.0, g).rotation.y = -a; }
  const car = new THREE.Group(); g.add(car);
  box(3, 0.8, 1.6, std("#E23B3B"), 0, 0.6, 0, car); box(1.4, 0.6, 1.4, std("#1F2937"), -0.3, 1.25, 0, car); box(0.3, 0.6, 1.8, std("#1F2937"), -1.4, 1.2, 0, car);
  for (const [x, z] of [[-1, 0.85], [1, 0.85], [-1, -0.85], [1, -0.85]]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.3, 12), std("#111827")); w.rotation.x = Math.PI / 2; w.position.set(x, 0.42, z); car.add(w); }
  const lag = plane(4.8, 2, lagTex); g.add(lag); lag.visible = false;
  const stands = box(14, 3, 3, std("#cbd5e1"), 0, 1.5, -13.5, g);
  return { group: g, car, lag };
}
export function buildHotPhone(scene, at) {
  const g = new THREE.Group(); g.position.copy(at); scene.add(g);
  floorGrid(g, 26, 26);
  const ph = new THREE.Group(); ph.position.y = 7; ph.rotation.y = Math.PI / 4; g.add(ph);
  const bodyMat = std("#1F2937", { flatShading: false, emissive: new THREE.Color("#ff3b1f"), emissiveIntensity: 0 });
  box(6, 12, 0.7, bodyMat, 0, 0, 0, ph);
  const scr = box(5.4, 11, 0.1, std("#0B1E3F", { emissive: new THREE.Color("#0066DE"), emissiveIntensity: 0.5 }), 0, 0, 0.4, ph);
  // thermometer on screen
  box(1.2, 7, 0.1, std("#F5F7FA"), -1.2, 0.5, 0.47, ph);
  const merc = box(0.8, 1, 0.12, std("#E23B3B", { emissive: new THREE.Color("#E23B3B"), emissiveIntensity: 0.6 }), -1.2, -2.5, 0.5, ph); merc.geometry.translate(0, 0.5, 0);
  const bulb = new THREE.Mesh(new THREE.CircleGeometry(1, 20), new THREE.MeshBasicMaterial({ color: "#E23B3B" })); bulb.position.set(-1.2, -3.4, 0.52); ph.add(bulb);
  // battery
  box(1.4, 3, 0.1, std("#F5F7FA"), 1.5, 1.5, 0.47, ph);
  const batt = box(1.1, 2.7, 0.12, std("#22C55E", { emissive: new THREE.Color("#22C55E"), emissiveIntensity: 0.5 }), 1.5, 0.15, 0.5, ph); batt.geometry.translate(0, 1.35, 0);
  const heat = [0, 1, 2, 3, 4].map((i) => { const s = sprite(redGlowTex, 4, g); s.material.opacity = 0; return s; });
  return { group: g, ph, bodyMat, merc, batt, heat };
}

// ---------------------------------------------------------------- spaghetti code wall + confused student
export function buildSpaghetti(scene, at) {
  const g = new THREE.Group(); g.position.copy(at); scene.add(g);
  floorGrid(g, 34, 26);
  const r = rng(12), tubes = [];
  const COLS = ["#00C2FF", "#FF8A00", "#22C55E", "#E23B3B", "#8B5CF6", "#FFC94D"];
  for (let i = 0; i < 26; i++) {
    const pts = []; let p = V(-12 + r() * 24, 0.5 + r() * 2, -8 + r() * 6);
    for (let k = 0; k < 7; k++) { pts.push(p.clone()); p = p.clone().add(V((r() - 0.5) * 10, 1.2 + r() * 2.2, (r() - 0.5) * 6)); }
    const c = new THREE.CatmullRomCurve3(pts), geo = new THREE.TubeGeometry(c, 80, 0.18, 6);
    const m = new THREE.Mesh(geo, std(COLS[i % 6], { flatShading: false, emissive: new THREE.Color(COLS[i % 6]), emissiveIntensity: 0.4 })); m.castShadow = true; g.add(m);
    m.geometry.setDrawRange(0, 0); tubes.push({ m, n: geo.index.count, d: r() });
  }
  const st = person(33, false); st.obj.scale.setScalar(1.6); st.obj.position.set(0, 0, 6); g.add(st.obj);
  const smoke = [0, 1, 2, 3].map(() => { const s = sprite(smokeTex, 1.6, g); s.visible = false; return s; });
  const what = sprite(TEX.what, 2.2, g); what.visible = false;
  return { group: g, tubes, st, smoke, what };
}

// ---------------------------------------------------------------- world city (all systems), goes red from the centre
export function buildCity(scene, at) {
  const g = new THREE.Group(); g.position.copy(at); scene.add(g);
  floorGrid(g, 90, 90);
  const r = rng(77), blds = [];
  const SIGNS = [["BANK", "#0B1E3F", "#FFC94D"], ["HOSPITAL", "#E23B3B", "#ffffff"], ["AIRPORT", "#0066DE", "#ffffff"], ["TELCO", "#8B5CF6", "#ffffff"]];
  const signTex = SIGNS.map(([t, b, f]) => label(t, b, f, 512, 160, t.length > 5 ? 64 : 80));
  for (let x = -40; x <= 40; x += 8) for (let z = -40; z <= 40; z += 8) {
    const d = Math.hypot(x, z); if (d < 9 || r() < 0.2) continue;
    const h = 3 + r() * (d < 25 ? 10 : 6);
    const mat = std("#cbd5e1", { emissive: new THREE.Color("#00C2FF"), emissiveIntensity: 0.25 });
    const b = box(4.6, h, 4.6, mat, x + (r() - 0.5) * 1.5, h / 2, z + (r() - 0.5) * 1.5, g);
    const bd = { b, mat, d, h, sign: null, alert: null };
    if (r() > 0.78) { const s = plane(4.6, 1.44, signTex[Math.floor(r() * 4)]); s.position.set(b.position.x, h + 1.4, b.position.z); g.add(s); bd.sign = s; }
    if (r() > 0.6) { const a = sprite(TEX.bang, 2.4, g); a.position.set(b.position.x, h + 3.2, b.position.z); a.visible = false; bd.alert = a; }
    blds.push(bd);
  }
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.96, 1, 96), basic({ color: "#FF4D5E", side: THREE.DoubleSide, depthWrite: false, opacity: 0.9 })); ring.rotation.x = -Math.PI / 2; ring.position.y = 0.2; g.add(ring);
  return { group: g, blds, ring, signs: signTex };
}

// ---------------------------------------------------------------- toolbox: tools labelled with languages
export function buildToolbox(scene, at) {
  const g = new THREE.Group(); g.position.copy(at); scene.add(g);
  island(g, 30, 22, "#E9D5B5", "#a16207");
  const tb = new THREE.Group(); g.add(tb);
  box(7, 3, 3.6, std("#E23B3B"), 0, 1.5, 0, tb);
  const lid = new THREE.Group(); lid.position.set(0, 3, -1.8); tb.add(lid);
  box(7.2, 0.5, 3.8, std("#C62828"), 0, 0.25, 1.8, lid); box(2.4, 0.5, 0.4, std("#1F2937"), 0, 0.75, 1.8, lid);
  const steel = std("#cbd5e1", { metalness: 0.6, roughness: 0.35 });
  const mk = (build, L) => { const t = new THREE.Group(); g.add(t); build(t); const lb = plane(3.6, 1.12, label(L.name, L.bg, L.fg, 512, 160, L.name.length > 6 ? 56 : 76)); t.add(lb); t.lb = lb; t.traverse((o) => { if (o.isMesh && o !== lb) o.castShadow = true; }); return t; };
  const hammer = mk((t) => { box(0.35, 4, 0.35, std("#a16207"), 0, 0, 0, t); box(2, 0.8, 0.8, steel, 0, 2.1, 0, t); }, LANGS[2]);
  const driver = mk((t) => { box(0.6, 1.8, 0.6, std("#FFC94D"), 0, -1, 0, t); box(0.18, 2.4, 0.18, steel, 0, 1.1, 0, t); }, LANGS[0]);
  const wrench = mk((t) => { box(0.4, 3.6, 0.2, steel, 0, 0, 0, t); box(1.2, 0.8, 0.2, steel, 0, 2, 0, t); box(0.4, 0.5, 0.22, std("#E9D5B5"), 0, 2.2, 0, t); }, LANGS[1]);
  const brush = mk((t) => { box(0.3, 3, 0.3, std("#8B5CF6"), 0, 0, 0, t); box(1, 1, 0.4, std("#F0DB4F"), 0, 1.9, 0, t); }, LANGS[3]);
  const tools = [hammer, driver, wrench, brush];
  // work bench: plank with nail and screw
  const plank = box(9, 0.6, 3, std("#c08457"), 9, 0.3, 4, g);
  const nail = new THREE.Group(); nail.position.set(7, 0.6, 4); g.add(nail); box(0.12, 1.6, 0.12, steel, 0, 0.8, 0, nail); box(0.45, 0.1, 0.45, steel, 0, 1.6, 0, nail);
  const screw = new THREE.Group(); screw.position.set(11, 0.6, 4); g.add(screw); box(0.16, 1.4, 0.16, steel, 0, 0.7, 0, screw); const sh = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.15, 12), steel); sh.position.y = 1.45; screw.add(sh);
  return { group: g, tb, lid, tools, nail, screw };
}

// ---------------------------------------------------------------- CPU chip with 0/1 flowing on traces
export function buildChip(scene, at) {
  const g = new THREE.Group(); g.position.copy(at); scene.add(g);
  const board = new THREE.Mesh(new THREE.BoxGeometry(44, 1, 44), std("#0f5132", { flatShading: false })); board.position.y = -0.5; board.receiveShadow = true; g.add(board);
  const chip = box(12, 1.4, 12, std("#1F2937", { flatShading: false, emissive: new THREE.Color("#00C2FF"), emissiveIntensity: 0.05 }), 0, 0.7, 0, g);
  box(8, 0.2, 8, std("#94a3b8", { metalness: 0.6 }), 0, 1.5, 0, g);
  const cpuLb = plane(5, 1.56, label("CPU", "#0B1E3F", "#00C2FF", 512, 160, 96)); cpuLb.rotation.x = -Math.PI / 2; cpuLb.position.set(0, 1.62, 0); g.add(cpuLb);
  const gold = std("#E8B04B", { metalness: 0.7, roughness: 0.3 });
  for (let i = 0; i < 10; i++) for (const s of [-1, 1]) { box(0.3, 0.2, 1.6, gold, -5.4 + i * 1.2, 0.1, s * 7, g); box(1.6, 0.2, 0.3, gold, s * 7, 0.1, -5.4 + i * 1.2, g); }
  const traces = [], tr = std("#E8B04B", { metalness: 0.5 });
  for (let i = 0; i < 8; i++) {
    const z = -5.4 + i * 1.55, x0 = -21, x1 = -7.8;
    box(x1 - x0, 0.08, 0.25, tr, (x0 + x1) / 2, 0.04, z, g); traces.push({ a: V(x0, 0.3, z), b: V(x1, 0.3, z) });
    box(x1 - x0, 0.08, 0.25, tr, -(x0 + x1) / 2, 0.04, z, g); traces.push({ a: V(-x1, 0.3, z), b: V(-x0, 0.3, z) });
  }
  const bits = []; for (let i = 0; i < 48; i++) { const s = sprite(i % 2 ? CT.bit1 : CT.bit0, 1.3, g); s.visible = false; bits.push(s); }
  const big0 = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.9, 12, 32), std("#00C2FF", { flatShading: false, emissive: new THREE.Color("#00C2FF"), emissiveIntensity: 0.6 })); big0.scale.set(0.8, 1.2, 1); g.add(big0);
  const big1 = new THREE.Group(); g.add(big1); box(1.8, 6, 1.8, std("#00C2FF", { flatShading: false, emissive: new THREE.Color("#00C2FF"), emissiveIntensity: 0.6 }), 0, 0, 0, big1); box(1.8, 1.6, 1.8, std("#00C2FF", { emissive: new THREE.Color("#00C2FF"), emissiveIntensity: 0.6 }), -1, 2.3, 0, big1).rotation.z = 0.6;
  big0.visible = big1.visible = false;
  const glow = sprite(glowTex, 26, g); glow.position.y = 2; glow.material.opacity = 0;
  return { group: g, chip, traces, bits, big0, big1, glow };
}

// ---------------------------------------------------------------- translator funnel: languages in, 0/1 out, into a chip
export function buildFunnel(scene, at) {
  const g = new THREE.Group(); g.position.copy(at); scene.add(g);
  floorGrid(g, 40, 40);
  const funnel = new THREE.Mesh(new THREE.CylinderGeometry(6, 1.2, 7, 32, 1, true), std("#94a3b8", { flatShading: false, metalness: 0.5, roughness: 0.35, side: THREE.DoubleSide })); funnel.position.y = 13; funnel.castShadow = true; g.add(funnel);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(6, 0.3, 8, 48), std("#FF8A00")); rim.rotation.x = Math.PI / 2; rim.position.y = 16.5; g.add(rim);
  const lb = plane(7.6, 1.6, label("PENTERJEMAH", "#0B1E3F", "#00C2FF", 768, 160, 70)); lb.position.set(0, 13, 6.5); g.add(lb);
  const spout = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 2.5, 20), std("#64748b", { metalness: 0.5 })); spout.position.y = 8.3; g.add(spout);
  const chip = box(7, 1.2, 7, std("#1F2937", { emissive: new THREE.Color("#00C2FF"), emissiveIntensity: 0.05 }), 0, 0.6, 0, g);
  const gold = std("#E8B04B", { metalness: 0.7 }); for (let i = 0; i < 6; i++) for (const s of [-1, 1]) { box(0.3, 0.2, 1.2, gold, -2.5 + i, 0.1, s * 4, g); box(1.2, 0.2, 0.3, gold, s * 4, 0.1, -2.5 + i, g); }
  const cubes = LANGS.map((L) => langCube(g, L, 2.4));
  const bits = []; for (let i = 0; i < 30; i++) { const s = sprite(i % 2 ? CT.bit1 : CT.bit0, 1.4, g); s.visible = false; bits.push(s); }
  const glow = sprite(glowTex, 14, g); glow.position.y = 1.5; glow.material.opacity = 0;
  return { group: g, cubes, bits, chip, glow, lb };
}
