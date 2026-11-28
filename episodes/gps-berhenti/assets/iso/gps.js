// GPS-world pieces for "Apa Jadi Kalau Semua Satelit GPS Berhenti Berfungsi?" (generic, no real brands).
import * as THREE from "../vendor/three.module.js";
import { std, box, canvasTex, rr, FONT, person, sprite, rng, TEX } from "./kit.js";

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const basic = (o) => new THREE.MeshBasicMaterial({ transparent: true, toneMapped: false, ...o });
export const plane = (w, h, map, o = {}) => new THREE.Mesh(new THREE.PlaneGeometry(w, h), basic({ map, side: THREE.DoubleSide, ...o }));
function island(g, w, d, col = "#bfe0a6", side = "#8a6a4a") { box(w, 0.6, d, std(col), 0, -0.3, 0, g); box(w, 2.4, d, std(side), 0, -1.9, 0, g); }

// ---------------------------------------------------------------- textures
const mapTex = canvasTex(1024, 1024, (g) => {
  const r = rng(404);
  g.fillStyle = "#E8EEF4"; g.fillRect(0, 0, 1024, 1024);
  // river
  g.strokeStyle = "#9CC9F5"; g.lineWidth = 46; g.beginPath(); g.moveTo(-20, 760); g.bezierCurveTo(300, 640, 520, 980, 1050, 820); g.stroke();
  // blocks
  for (let x = 0; x < 1024; x += 128) for (let y = 0; y < 1024; y += 128) {
    const k = r();
    g.fillStyle = k < 0.16 ? "#BFE6B0" : k < 0.22 ? "#FCE7B2" : "#DCE3EC"; rr(g, x + 14, y + 14, 100, 100, 10); g.fill();
  }
  g.strokeStyle = "#ffffff"; g.lineWidth = 16;
  for (let i = 0; i <= 1024; i += 128) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 1024); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(1024, i); g.stroke(); }
  g.strokeStyle = "#FFC94D"; g.lineWidth = 22;
  g.beginPath(); g.moveTo(0, 384); g.lineTo(1024, 384); g.stroke(); g.beginPath(); g.moveTo(640, 0); g.lineTo(640, 1024); g.stroke();
  g.beginPath(); g.moveTo(0, 1024); g.lineTo(1024, 0); g.lineWidth = 18; g.stroke();
});
export const clockFace = canvasTex(512, 512, (g) => {
  g.fillStyle = "#ffffff"; g.beginPath(); g.arc(256, 256, 250, 0, 7); g.fill();
  g.strokeStyle = "#0B1E3F"; g.lineCap = "round";
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2, big = i % 5 === 0, r1 = big ? 196 : 214;
    g.lineWidth = big ? 16 : 5; g.beginPath(); g.moveTo(256 + Math.sin(a) * r1, 256 - Math.cos(a) * r1); g.lineTo(256 + Math.sin(a) * 232, 256 - Math.cos(a) * 232); g.stroke();
  }
});
const compassTex = canvasTex(256, 256, (g) => {
  g.fillStyle = "#F5F7FA"; g.beginPath(); g.arc(128, 128, 120, 0, 7); g.fill(); g.strokeStyle = "#0B1E3F"; g.lineWidth = 12; g.stroke();
  g.fillStyle = "#E23B3B"; g.beginPath(); g.moveTo(128, 26); g.lineTo(150, 128); g.lineTo(106, 128); g.fill();
  g.fillStyle = "#334155"; g.beginPath(); g.moveTo(128, 230); g.lineTo(150, 128); g.lineTo(106, 128); g.fill();
  g.fillStyle = "#0B1E3F"; g.beginPath(); g.arc(128, 128, 14, 0, 7); g.fill();
});
const chartTex = canvasTex(512, 384, (g) => {
  g.fillStyle = "#F3E6C4"; g.fillRect(0, 0, 512, 384); g.strokeStyle = "#C9B489"; g.lineWidth = 3;
  for (let i = 0; i < 512; i += 64) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 384); g.stroke(); }
  for (let i = 0; i < 384; i += 64) { g.beginPath(); g.moveTo(0, i); g.lineTo(512, i); g.stroke(); }
  g.fillStyle = "#B9D48F"; g.beginPath(); g.ellipse(120, 110, 80, 50, 0.4, 0, 7); g.fill(); g.beginPath(); g.ellipse(400, 290, 90, 60, -0.3, 0, 7); g.fill();
  g.strokeStyle = "#E23B3B"; g.lineWidth = 8; g.setLineDash([18, 14]); g.beginPath(); g.moveTo(150, 140); g.bezierCurveTo(250, 220, 300, 160, 380, 270); g.stroke();
});
const barsTex = (n, bad) => canvasTex(256, 256, (g) => {
  g.fillStyle = "rgba(11,30,63,0.9)"; rr(g, 8, 8, 240, 240, 48); g.fill();
  for (let i = 0; i < 4; i++) { g.fillStyle = i < n ? (bad ? "#FF8A00" : "#22C55E") : "rgba(255,255,255,0.18)"; rr(g, 40 + i * 48, 196 - (i + 1) * 36, 34, (i + 1) * 36, 8); g.fill(); }
  if (bad) { g.strokeStyle = "#FF4D5E"; g.lineWidth = 20; g.lineCap = "round"; g.beginPath(); g.moveTo(160, 40); g.lineTo(220, 100); g.moveTo(220, 40); g.lineTo(160, 100); g.stroke(); }
});
const earthTex = canvasTex(1024, 512, (g) => {
  const r = rng(77); g.fillStyle = "#1D6FD8"; g.fillRect(0, 0, 1024, 512);
  for (let i = 0; i < 26; i++) { g.fillStyle = r() > 0.3 ? "#4CBF6B" : "#E9C46A"; g.beginPath(); g.ellipse(r() * 1024, 90 + r() * 330, 30 + r() * 90, 20 + r() * 60, r() * 3, 0, 7); g.fill(); }
  g.fillStyle = "rgba(255,255,255,0.85)"; g.fillRect(0, 0, 1024, 26); g.fillRect(0, 486, 1024, 26);
});
const panelTex = canvasTex(256, 128, (g) => {
  g.fillStyle = "#1E3A8A"; g.fillRect(0, 0, 256, 128); g.strokeStyle = "#7FB2FF"; g.lineWidth = 3;
  for (let x = 0; x <= 256; x += 32) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 128); g.stroke(); }
  for (let y = 0; y <= 128; y += 32) { g.beginPath(); g.moveTo(0, y); g.lineTo(256, y); g.stroke(); }
});
const glowTex = canvasTex(256, 256, (g) => { const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128); gr.addColorStop(0, "rgba(0,194,255,0.9)"); gr.addColorStop(0.4, "rgba(0,194,255,0.35)"); gr.addColorStop(1, "rgba(0,194,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); });
const ringTex = canvasTex(512, 512, (g) => { g.strokeStyle = "#00C2FF"; g.lineWidth = 10; g.beginPath(); g.arc(256, 256, 244, 0, 7); g.stroke(); g.strokeStyle = "rgba(0,194,255,0.25)"; g.lineWidth = 26; g.beginPath(); g.arc(256, 256, 226, 0, 7); g.stroke(); });
const tickTex = canvasTex(256, 256, (g) => { g.fillStyle = "#22C55E"; g.beginPath(); g.arc(128, 128, 120, 0, 7); g.fill(); g.strokeStyle = "#fff"; g.lineWidth = 26; g.lineCap = "round"; g.lineJoin = "round"; g.beginPath(); g.moveTo(70, 132); g.lineTo(110, 172); g.lineTo(186, 90); g.stroke(); });
const bankSign = canvasTex(512, 128, (g) => { g.fillStyle = "#0B1E3F"; rr(g, 4, 4, 504, 120, 24); g.fill(); g.fillStyle = "#FFC94D"; g.font = FONT(78); g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("BANK", 256, 68); });
export const GT = { map: mapTex, clock: clockFace, compass: compassTex, chart: chartTex, bars4: barsTex(4, false), bars1: barsTex(1, true), glow: glowTex, ring: ringTex, tick: tickTex };

// ---------------------------------------------------------------- small builders
export function beam(parent, color = "#00C2FF", r = 0.12) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 1, 8, 1, true), basic({ color, opacity: 0.75, depthWrite: false }));
  parent.add(m); return m;
}
const UP = V(0, 1, 0);
export function setBeam(m, a, b) {
  const d = b.clone().sub(a), L = d.length();
  m.position.copy(a).addScaledVector(d, 0.5); m.scale.set(1, Math.max(0.001, L), 1);
  m.quaternion.setFromUnitVectors(UP, d.normalize());
}
// 3D clock (billboarded by the caller): face, rim, two hands; set(minutes), tint(k red)
export function makeClock(r, parent) {
  const g = new THREE.Group(); parent.add(g);
  const face = new THREE.Mesh(new THREE.CircleGeometry(r, 48), new THREE.MeshBasicMaterial({ map: clockFace, toneMapped: false, color: "#ffffff" })); g.add(face);
  const back = new THREE.Mesh(new THREE.CylinderGeometry(r * 1.1, r * 1.1, r * 0.25, 48), std("#0066DE", { flatShading: false, emissive: new THREE.Color("#0066DE"), emissiveIntensity: 0.25 }));
  back.rotation.x = Math.PI / 2; back.position.z = -r * 0.14; g.add(back);
  const handMat = new THREE.MeshBasicMaterial({ color: "#0B1E3F", toneMapped: false });
  const mk = (len, w) => { const p = new THREE.Group(); p.position.z = 0.02 * r; g.add(p); const h = new THREE.Mesh(new THREE.PlaneGeometry(w, len), handMat); h.position.y = len * 0.42; p.add(h); return p; };
  const hr = mk(r * 0.55, r * 0.11), mn = mk(r * 0.82, r * 0.07);
  const sec = mk(r * 0.85, r * 0.03); sec.children[0].material = new THREE.MeshBasicMaterial({ color: "#FF8A00", toneMapped: false });
  const cap = new THREE.Mesh(new THREE.CircleGeometry(r * 0.08, 20), new THREE.MeshBasicMaterial({ color: "#FF8A00", toneMapped: false })); cap.position.z = 0.04 * r; g.add(cap);
  return {
    group: g, face, back,
    set(min, secs = 0) { mn.rotation.z = -(min / 60) * Math.PI * 2; hr.rotation.z = -(min / 720) * Math.PI * 2; sec.rotation.z = -(secs / 60) * Math.PI * 2; },
    tint(k) { face.material.color.setRGB(1, 1 - 0.55 * k, 1 - 0.6 * k); back.material.color.set(k > 0.5 ? "#E23B3B" : "#0066DE"); back.material.emissive.set(k > 0.5 ? "#E23B3B" : "#0066DE"); },
  };
}
export function makeSatellite(parent, s = 1) {
  const g = new THREE.Group(); parent.add(g); g.scale.setScalar(s);
  const foil = std("#E8B04B", { metalness: 0.5, roughness: 0.4 });
  const body = new THREE.Group(); g.add(body);
  const bl = box(1.1, 2, 2, foil, -0.55, 0, 0, body), br = box(1.1, 2, 2, foil, 0.55, 0, 0, body);
  const pm = new THREE.MeshStandardMaterial({ map: panelTex, roughness: 0.4, metalness: 0.3, emissive: new THREE.Color("#2563eb"), emissiveIntensity: 0.35 });
  const panels = [];
  for (const sx of [-1, 1]) {
    const arm = box(1.2, 0.15, 0.15, std("#94a3b8"), sx * 1.7, 0, 0, g);
    const p = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.08, 1.8), pm); p.position.set(sx * 4.4, 0, 0); p.castShadow = true; g.add(p);
    panels.push({ p, arm, x0: sx * 4.4, sx });
  }
  const dish = new THREE.Mesh(new THREE.ConeGeometry(0.7, 0.5, 16, 1, true), std("#F5F7FA", { side: THREE.DoubleSide })); dish.position.set(0, -1.3, 0); dish.rotation.x = Math.PI; g.add(dish);
  const light = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 8), new THREE.MeshBasicMaterial({ color: "#00C2FF", toneMapped: false })); light.position.set(0, 1.15, 0.8); g.add(light);
  const halo = sprite(glowTex, 3.2, g); halo.position.copy(light.position);
  return { group: g, panels, pm, light, halo, bl, br, dish,
    power(k) { pm.emissiveIntensity = 0.35 * k; pm.color.setScalar(0.35 + 0.65 * k); light.material.color.set(k > 0.5 ? "#00C2FF" : "#334155"); halo.visible = k > 0.5; } };
}
export function makePin(parent, col = "#E23B3B", s = 1) {
  const g = new THREE.Group(); parent.add(g); g.scale.setScalar(s);
  const c = new THREE.Mesh(new THREE.ConeGeometry(0.55, 1.4, 16), std(col, { flatShading: false })); c.rotation.x = Math.PI; c.position.y = 0.7; c.castShadow = true; g.add(c);
  const b = new THREE.Mesh(new THREE.SphereGeometry(0.62, 16, 12), std(col, { flatShading: false })); b.position.y = 1.55; b.castShadow = true; g.add(b);
  const w = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 8), std("#ffffff")); w.position.set(0, 1.6, 0.48); g.add(w);
  return g;
}
function house(parent, x, z, col, roof, s = 1, ry = 0) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; g.scale.setScalar(s); parent.add(g);
  box(2.4, 1.8, 2.2, std(col), 0, 0.9, 0, g);
  const rf = new THREE.Mesh(new THREE.ConeGeometry(1.95, 1.1, 4), std(roof)); rf.rotation.y = Math.PI / 4; rf.position.y = 2.35; rf.scale.set(1, 1, 0.9); rf.castShadow = true; g.add(rf);
  box(0.6, 1, 0.05, std("#7c4a2a"), 0, 0.5, 1.11, g);
  return g;
}
const HC = ["#F8D7DA", "#FDE68A", "#D1FAE5", "#E0E7FF", "#FFEDD5", "#F5F5F4"], RC = ["#E23B3B", "#0066DE", "#F59E0B", "#22C55E", "#8B5CF6"];

// ---------------------------------------------------------------- space: earth + orbiting satellites
export function buildSpace(scene, at) {
  const g = new THREE.Group(); g.position.copy(at); scene.add(g);
  const earth = new THREE.Mesh(new THREE.SphereGeometry(14, 48, 32), new THREE.MeshStandardMaterial({ map: earthTex, roughness: 0.9 }));
  g.add(earth);
  const atm = sprite(glowTex, 40, g); atm.material.opacity = 0.55;
  const r = rng(9), stars = [];
  const sg = new THREE.BufferGeometry(), pos = [];
  for (let i = 0; i < 500; i++) pos.push((r() - 0.5) * 260, (r() - 0.5) * 260, -60 - r() * 120);
  sg.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  const st = new THREE.Points(sg, new THREE.PointsMaterial({ color: "#ffffff", size: 2.2, sizeAttenuation: false, transparent: true, opacity: 0.85 }));
  g.add(st); stars.push(st);
  const sats = [];
  const orbits = [[0.3, 0.2, 24, 0], [1.4, -0.35, 26, 1.7], [2.4, 0.5, 23, 3.1], [-0.9, 0.1, 25, 4.4], [0.9, 0.7, 27, 5.5], [-2.2, -0.6, 24, 2.3]];
  orbits.forEach(([ry, rx, R, ph], i) => {
    const pivot = new THREE.Group(); pivot.rotation.set(rx, ry, 0); g.add(pivot);
    const s = makeSatellite(pivot, 1.0); s.R = R; s.ph = ph; s.pivot = pivot; s.i = i;
    s.beam = beam(g, "#00C2FF", 0.08); s.beam.visible = false;
    sats.push(s);
  });
  return { group: g, earth, atm, sats, stars,
    update(t, power) {
      earth.rotation.y = t * 0.08;
      sats.forEach((s) => {
        const a = s.ph + t * 0.25; s.group.position.set(Math.cos(a) * s.R, Math.sin(a * 0.5) * 2, Math.sin(a) * s.R);
        s.group.lookAt(g.localToWorld(V(0, 0, 0))); s.group.rotateX(-Math.PI / 2);
        s.power(power(s.i));
      });
    } };
}

// ---------------------------------------------------------------- map island (tiles that can break apart) + blue dot
export function buildMapWorld(scene, at) {
  const g = new THREE.Group(); g.position.copy(at); scene.add(g);
  const N = 8, SZ = 7, HALF = (N * SZ) / 2, tiles = [];
  const r = rng(21);
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
    const tg = new THREE.Group(); g.add(tg);
    const cx = -HALF + SZ / 2 + i * SZ, cz = -HALF + SZ / 2 + j * SZ; tg.position.set(cx, 0, cz);
    const tex = mapTex.clone(); tex.needsUpdate = true; tex.repeat.set(1 / N, 1 / N); tex.offset.set(i / N, 1 - (j + 1) / N);
    const top = new THREE.Mesh(new THREE.BoxGeometry(SZ, 0.6, SZ), [std("#cbd5e1"), std("#cbd5e1"), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9 }), std("#94a3b8"), std("#cbd5e1"), std("#cbd5e1")]);
    top.position.y = -0.3; top.receiveShadow = true; tg.add(top);
    box(SZ, 1.6, SZ, std("#8a6a4a"), 0, -1.4, 0, tg);
    if (Math.hypot(cx, cz) > 6 && r() > 0.25) {
      const n = 1 + Math.floor(r() * 2);
      for (let k = 0; k < n; k++) {
        if (r() > 0.75) { const hh = 2 + r() * 5; box(1.8 + r(), hh, 1.8 + r(), std(HC[Math.floor(r() * 6)]), (r() - 0.5) * 3.6, hh / 2, (r() - 0.5) * 3.6, tg); }
        else house(tg, (r() - 0.5) * 3.6, (r() - 0.5) * 3.6, HC[Math.floor(r() * 6)], RC[Math.floor(r() * 5)], 0.8, Math.floor(r() * 4) * Math.PI / 2);
      }
    }
    tiles.push({ g: tg, cx, cz, seed: r(), d: Math.hypot(cx, cz) });
  }
  // blue dot
  const dot = new THREE.Group(); g.add(dot); dot.position.set(0, 1.0, 0);
  const discTex = canvasTex(256, 256, (g) => { g.fillStyle = "rgba(11,30,63,0.25)"; g.beginPath(); g.arc(128, 132, 124, 0, 7); g.fill(); g.fillStyle = "#ffffff"; g.beginPath(); g.arc(128, 128, 118, 0, 7); g.fill(); });
  const halo = sprite(discTex, 2.7, dot); halo.material.depthTest = false; halo.renderOrder = 5;
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.95, 24, 16), std("#0066DE", { flatShading: false, emissive: new THREE.Color("#0066DE"), emissiveIntensity: 0.6, depthTest: false, transparent: true })); core.renderOrder = 6; dot.add(core);
  const pulse = new THREE.Mesh(new THREE.RingGeometry(1.2, 1.6, 48), basic({ color: "#0066DE", opacity: 0.6, side: THREE.DoubleSide, depthWrite: false })); pulse.rotation.x = -Math.PI / 2; pulse.position.y = 0.06; g.add(pulse);
  const acc = new THREE.Mesh(new THREE.CircleGeometry(1, 64), basic({ color: "#00C2FF", opacity: 0.22, depthWrite: false })); acc.rotation.x = -Math.PI / 2; acc.position.y = 0.08; g.add(acc);
  const accEdge = new THREE.Mesh(new THREE.RingGeometry(0.97, 1, 96), basic({ color: "#0066DE", opacity: 0.8, side: THREE.DoubleSide, depthWrite: false })); accEdge.rotation.x = -Math.PI / 2; accEdge.position.y = 0.1; g.add(accEdge);
  const what = sprite(TEX.what, 3, g); what.visible = false;
  const tick = sprite(tickTex, 2.6, g); tick.visible = false;
  // satellites high above the map (hook beams + trilateration)
  const SATP = [V(-16, 30, -12), V(18, 33, -8), V(-2, 36, 18), V(12, 28, 16)];
  const sats = SATP.map((p, i) => { const s = makeSatellite(g, 0.9); s.group.position.copy(p); s.group.rotation.y = 0.6 + i; s.beam = beam(g, "#00C2FF", 0.1); s.beam.visible = false; s.p = p; return s; });
  const bigClock = makeClock(9, g); bigClock.group.visible = false;
  return { group: g, tiles, dot, core, pulse, acc, accEdge, what, tick, sats, bigClock, SZ };
}

// ---------------------------------------------------------------- taman (housing estate) + rider + grab junction
export function buildTaman(scene, at) {
  const g = new THREE.Group(); g.position.copy(at); scene.add(g);
  island(g, 64, 52, "#bfe0a6");
  const asphalt = std("#3b4252");
  const ROWZ = [-18, -6, 6, 18], COLX = [-26, 0, 26];
  ROWZ.forEach((z) => box(56, 0.06, 3.4, asphalt, 0, 0.03, z, g));
  COLX.forEach((x) => box(3.4, 0.06, 40, asphalt, x, 0.03, 0, g));
  const r = rng(55), houses = [];
  for (const z of [-12, 0, 12]) for (const sx of [-1, 1]) for (let k = 0; k < 5; k++) {
    const x = sx * (4 + k * 4.4), zz = z + (r() > 0.5 ? -2.2 : 2.2) * 0;
    const h = house(g, x, z - 2.4, HC[(k + (z > 0 ? 2 : 0)) % 6], RC[(k + sx + 2) % 5], 0.95, 0); houses.push(h);
    const h2 = house(g, x, z + 2.4, HC[(k + 3) % 6], RC[(k + 1) % 5], 0.95, Math.PI); houses.push(h2);
  }
  for (let i = 0; i < 14; i++) { const tr = new THREE.Mesh(new THREE.ConeGeometry(0.9, 2.2, 7), std("#4ade80")); tr.position.set(-30 + r() * 60, 1.1, (r() > 0.5 ? 1 : -1) * (23 + r() * 2)); tr.castShadow = true; g.add(tr); }
  // rider (generic food delivery: orange box, no logo)
  const bike = new THREE.Group(); g.add(bike);
  box(1.8, 0.5, 0.45, std("#1F2937"), 0, 0.75, 0, bike);
  for (const x of [-0.75, 0.75]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.25, 14), std("#111827")); w.rotation.x = Math.PI / 2; w.position.set(x, 0.42, 0); bike.add(w); }
  const rp = person(7, false); rp.obj.position.set(0, 0.6, 0); rp.obj.rotation.y = Math.PI / 2; bike.add(rp.obj);
  box(0.9, 0.9, 0.9, std("#FF8A00"), -0.75, 1.55, 0, bike);
  const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 8), std("#FF8A00")); helmet.position.set(0, 2.38, 0); bike.add(helmet);
  // rider loop path (circles the estate), trail dots
  const P = (x, z) => V(x, 0.1, z);
  const path = [P(-26, 22), P(-26, 6), P(0, 6), P(0, -6), P(-26, -6), P(-26, -18), P(26, -18), P(26, -6), P(0, -6), P(0, 6), P(26, 6), P(26, 18), P(0, 18), P(0, 6), P(-26, 6), P(-26, 18), P(-8, 18)];
  const trail = []; for (let i = 0; i < 120; i++) { const d = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 6), new THREE.MeshBasicMaterial({ color: "#FF8A00", toneMapped: false })); d.visible = false; g.add(d); trail.push(d); }
  // customer waiting at the right house
  const cust = person(12, true); cust.obj.position.set(13, 0, 8.6); g.add(cust.obj);
  const custClock = sprite(TEX.clock, 1.8, g); custClock.position.set(13, 3.4, 8.6);
  const homePin = makePin(g, "#22C55E", 1.3); homePin.position.set(13, 3.2, 10.6);
  const riderQ = sprite(TEX.what, 2.6, g); riderQ.visible = false;
  // grab junction (right side): generic car stops at the wrong corner, pin hops, passenger waves at the right one
  const car = new THREE.Group(); g.add(car);
  box(3, 1, 1.6, std("#0EA5E9"), 0, 0.75, 0, car); box(1.7, 0.8, 1.5, std("#e2e8f0"), -0.2, 1.6, 0, car);
  for (const [x, z] of [[-1, 0.8], [1, 0.8], [-1, -0.8], [1, -0.8]]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.25, 12), std("#111827")); w.rotation.x = Math.PI / 2; w.position.set(x, 0.38, z); car.add(w); }
  const carPin = makePin(g, "#E23B3B", 1.5);
  const pax = person(23, true); pax.obj.position.set(23.6, 0, -8.6); g.add(pax.obj);
  const paxBang = sprite(TEX.bang, 2, g); paxBang.position.set(23.6, 3.6, -8.6);
  const carQ = sprite(TEX.what, 2.6, g); carQ.visible = false;
  return { group: g, bike, rp, path, trail, cust, custClock, homePin, riderQ, car, carPin, pax, paxBang, carQ };
}

// ---------------------------------------------------------------- sea + ship, sky + plane
export function buildSea(scene, at) {
  const g = new THREE.Group(); g.position.copy(at); scene.add(g);
  const sea = new THREE.Mesh(new THREE.BoxGeometry(120, 1, 120), std("#1E6FD9", { flatShading: false, roughness: 0.4 })); sea.position.y = -0.5; sea.receiveShadow = true; g.add(sea);
  const r = rng(3), waves = [];
  for (let i = 0; i < 90; i++) { const w = box(1.6 + r() * 1.5, 0.08, 0.25, std("#BFE3FF"), (r() - 0.5) * 80, 0.05, (r() - 0.5) * 80, g); w.castShadow = false; waves.push({ w, x0: w.position.x, z0: w.position.z, ph: r() * 6 }); }
  const ship = new THREE.Group(); g.add(ship);
  const hull = box(14, 2.2, 4.2, std("#E23B3B"), 0, 0.6, 0, ship); box(14.2, 0.7, 4.4, std("#1F2937"), 0, -0.2, 0, ship);
  const bow = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.1, 2.2, 3), std("#E23B3B")); bow.rotation.y = Math.PI / 6 + Math.PI; bow.position.set(7.4, 0.6, 0); bow.scale.set(1.2, 1, 1); ship.add(bow);
  box(3, 3.6, 3.6, std("#F5F7FA"), -5, 3.4, 0, ship); box(3.2, 0.4, 3.8, std("#0B1E3F"), -5, 4.9, 0, ship);
  const CC = ["#0066DE", "#FF8A00", "#22C55E", "#F59E0B", "#8B5CF6"];
  for (let i = 0; i < 4; i++) for (let k = 0; k < 2; k++) box(2.2, 1.3, 1.6, std(CC[(i + k * 2) % 5]), -1.4 + i * 2.4, 2.35 + k * 1.3, (k % 2 ? 0.85 : -0.85), ship);
  const compass = sprite(compassTex, 4, g); compass.position.set(0, 9, 0);
  const chart = plane(9, 6.75, chartTex); g.add(chart); chart.visible = false;
  return { group: g, ship, waves, compass, chart };
}
export function buildSky(scene, at) {
  const g = new THREE.Group(); g.position.copy(at); scene.add(g);
  const r = rng(8), clouds = [];
  for (let i = 0; i < 26; i++) {
    const c = new THREE.Group(); const n = 3 + Math.floor(r() * 3);
    for (let k = 0; k < n; k++) { const s = new THREE.Mesh(new THREE.SphereGeometry(1.6 + r() * 1.6, 10, 8), std("#ffffff", { flatShading: true, emissive: new THREE.Color("#ffffff"), emissiveIntensity: 0.15 })); s.position.set(k * 2 - n, r() * 0.8, (r() - 0.5) * 2); c.add(s); }
    c.position.set((r() - 0.5) * 120, -6 - r() * 6, (r() - 0.5) * 60); g.add(c); clouds.push({ c, x0: c.position.x, v: 2 + r() * 3 });
  }
  const jet = new THREE.Group(); g.add(jet);
  const fus = new THREE.Mesh(new THREE.CapsuleGeometry(0.9, 8, 4, 12), std("#f8fafc")); fus.rotation.z = Math.PI / 2; fus.castShadow = true; jet.add(fus);
  box(2.6, 0.18, 11, std("#cbd5e1"), 0.4, -0.2, 0, jet); box(1.2, 2.2, 0.2, std("#0066DE"), -4.4, 1.3, 0, jet); box(1.3, 0.15, 4, std("#cbd5e1"), -4.4, 0.3, 0, jet);
  for (const s of [-1, 1]) { const e = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.4, 10), std("#94a3b8")); e.rotation.z = Math.PI / 2; e.position.set(1, -0.7, s * 2.6); jet.add(e); }
  const win = box(1.2, 0.5, 1.4, std("#0B1E3F", { emissive: new THREE.Color("#00C2FF"), emissiveIntensity: 0.6 }), 4.3, 0.4, 0, jet);
  const compass = sprite(compassTex, 3.2, g);
  return { group: g, clouds, jet, compass };
}

// ---------------------------------------------------------------- strip: telco tower, bank, power grid (each with a clock)
export function buildGridStrip(scene, at) {
  const g = new THREE.Group(); g.position.copy(at); scene.add(g);
  island(g, 64, 20, "#d9f0c8");
  // telco tower (x -20)
  const tw = new THREE.Group(); tw.position.set(-20, 0, 0); g.add(tw);
  const steel = std("#94a3b8", { metalness: 0.4 });
  for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { const leg = box(0.3, 14, 0.3, steel, x * 0.8, 7, z * 0.8, tw); leg.rotation.z = -x * 0.05; leg.rotation.x = z * 0.05; }
  for (let y = 2; y < 14; y += 2.4) box(2, 0.15, 2, steel, 0, y, 0, tw);
  for (let k = 0; k < 3; k++) { const a = box(0.5, 1.8, 0.25, std("#F5F7FA"), 0, 12.5, 0, tw); a.position.set(Math.cos(k * 2.1) * 1.1, 12.5, Math.sin(k * 2.1) * 1.1); a.rotation.y = -k * 2.1; }
  box(3, 1.6, 2.4, std("#E2E8F0"), 2.8, 0.8, 1.6, tw);
  const bars = plane(3, 3, GT.bars4); bars.position.set(-20 + 4, 9, 2); g.add(bars);
  const people = [];
  for (let i = 0; i < 3; i++) { const p = person(60 + i, true); p.obj.position.set(-24 + i * 1.6, 0, 5); p.obj.rotation.y = 0.4; g.add(p.obj); people.push(p); }
  // bank (x 0)
  const bk = new THREE.Group(); g.add(bk);
  box(11, 0.6, 7, std("#E5E7EB"), 0, 0.3, -1.5, bk); box(10, 5.4, 6, std("#F5F5F4"), 0, 3.3, -2, bk);
  for (let i = 0; i < 5; i++) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 5.2, 10), std("#FFFFFF")); c.position.set(-4 + i * 2, 3.2, 1.4); c.castShadow = true; bk.add(c); }
  const pd = new THREE.Mesh(new THREE.CylinderGeometry(6.6, 6.6, 1.6, 3), std("#E5E7EB")); pd.rotation.set(Math.PI / 2, 0, Math.PI / 2); pd.scale.set(1, 1, 0.55); pd.position.set(0, 6.9, -0.4); pd.castShadow = true; bk.add(pd);
  const bs = plane(4.6, 1.15, bankSign); bs.position.set(0, 6.55, 1.9); bk.add(bs);
  box(16, 0.4, 1.4, std("#334155"), 0, 0.6, 5.6, bk);
  const cubes = [];
  for (let i = 0; i < 9; i++) { const c = box(0.9, 0.9, 0.9, std(["#0066DE", "#22C55E", "#FF8A00"][i % 3], { emissive: new THREE.Color(["#0066DE", "#22C55E", "#FF8A00"][i % 3]), emissiveIntensity: 0.35 }), 0, 1.25, 5.6, bk); cubes.push({ c, off: i / 9 }); }
  // power grid (x 20): pylons + wires + houses with lights
  const gr = new THREE.Group(); gr.position.set(20, 0, 0); g.add(gr);
  const PY = [[-8, -4], [0, -4], [8, -4]], wires = [];
  PY.forEach(([x, z]) => {
    const p = new THREE.Group(); p.position.set(x, 0, z); gr.add(p);
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.9, 10, 4), steel); leg.position.y = 5; leg.castShadow = true; p.add(leg);
    box(5, 0.25, 0.3, steel, 0, 9, 0, p); box(3.6, 0.25, 0.3, steel, 0, 7.4, 0, p);
  });
  for (const [y, dx] of [[8.8, -2.2], [8.8, 2.2], [7.2, -1.6], [7.2, 1.6]]) for (let k = 0; k < 2; k++) {
    const w = beam(gr, "#1F2937", 0.05); w.material = new THREE.MeshBasicMaterial({ color: "#1F2937" });
    setBeam(w, V(PY[k][0] + dx, y, -4), V(PY[k + 1][0] + dx, y, -4)); wires.push(w);
  }
  const homes = [];
  for (let i = 0; i < 5; i++) {
    const h = house(gr, -9 + i * 4.4, 4.5, HC[i % 6], RC[i % 5], 1, 0);
    const wm = new THREE.MeshStandardMaterial({ color: "#fff7d6", emissive: new THREE.Color("#ffd27a"), emissiveIntensity: 1.2 });
    const wnd = box(1.2, 0.7, 0.05, wm, 0, 1.1, 1.12, h); homes.push({ h, wm, i });
  }
  // clocks + satellite overhead
  const clocks = [[-20, 17.5, 0], [0, 11.5, 0], [20, 13, 0]].map(([x, y, z]) => { const c = makeClock(2.6, g); c.group.position.set(x, y, z); return c; });
  const sat = makeSatellite(g, 0.9); sat.group.position.set(0, 30, -6);
  const beams = clocks.map(() => { const b = beam(g, "#00C2FF", 0.12); b.visible = false; return b; });
  return { group: g, bars, people, cubes, homes, wires, clocks, sat, beams };
}

// ---------------------------------------------------------------- reveal: exploded satellite with an atomic clock inside
export function buildReveal(scene, at) {
  const g = new THREE.Group(); g.position.copy(at); scene.add(g);
  const r = rng(5), sg = new THREE.BufferGeometry(), pos = [];
  for (let i = 0; i < 400; i++) pos.push((r() - 0.5) * 160, (r() - 0.5) * 160, -40 - r() * 60);
  sg.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.add(new THREE.Points(sg, new THREE.PointsMaterial({ color: "#ffffff", size: 2, sizeAttenuation: false, transparent: true, opacity: 0.8 })));
  const sat = makeSatellite(g, 2.2);
  const core = new THREE.Group(); g.add(core);
  const cyl = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 2.6, 24), std("#0B1E3F", { flatShading: false, emissive: new THREE.Color("#00C2FF"), emissiveIntensity: 0.9 })); core.add(cyl);
  const nucleus = new THREE.Mesh(new THREE.SphereGeometry(0.55, 20, 14), new THREE.MeshBasicMaterial({ color: "#FF8A00", toneMapped: false })); nucleus.position.y = 2.6; core.add(nucleus);
  const rings = [0, 1, 2].map((k) => { const t = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.07, 8, 64), new THREE.MeshBasicMaterial({ color: "#00C2FF", toneMapped: false })); t.position.y = 2.6; t.rotation.set(k * 1.05, k * 0.6, 0); core.add(t); return t; });
  const electrons = rings.map(() => { const e = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 8), new THREE.MeshBasicMaterial({ color: "#ffffff", toneMapped: false })); core.add(e); return e; });
  const glow = sprite(glowTex, 12, core); glow.position.y = 2.6;
  const clock = makeClock(3.2, g); clock.group.visible = false;
  return { group: g, sat, core, rings, electrons, nucleus, glow, clock };
}
