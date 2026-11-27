// Yusuf Aiman Studio: code-built 3D characters for Three.js (r170).
// One rig for every character: joints are Object3D groups, so poses, gestures, walking
// and facial animation are plain rotations/scales driven from timeline time.
//
//   const yusuf = buildCharacter(THREE, YUSUF);
//   scene.add(yusuf.root);
//   yusuf.pose({ ...POSES.explain }, 1);   // blend weight 0..1
//   yusuf.face({ expression: "happy", viseme: "D", blink: 0 });
//
// Units: metres-ish; total height ~1.7. Character faces +Z.

export const YUSUF = {
  name: "yusuf",
  skin: "#f2b48a", skinShade: "#e39a72",
  hair: "#2a201d", brow: "#2a201d", beard: "#4a3a33",
  eye: "#111014",
  shirt: "#1f1d22", pants: "#2a2729", shoes: "#f3f1ee", soles: "#d9d6d2",
  watch: "#b9bec6", watchFace: "#3b4048",
  hairStyle: "quiff", goatee: true, glasses: false, headphones: false, hoodie: false,
};

export const AIMAN = {
  name: "aiman",
  skin: "#f4bf98", skinShade: "#e6a57f",
  hair: "#3a2a24", brow: "#3a2a24", beard: null,
  eye: "#111014",
  shirt: "#e8d6c2", pants: "#2e2a2a", shoes: "#f3f1ee", soles: "#3a3a3e",
  watch: null,
  hairStyle: "curly", goatee: false, glasses: true, headphones: true, hoodie: true,
};

// Joint rotations in radians (x, y, z). Missing joints stay at rest.
const d = Math.PI / 180;
export const POSES = {
  // Rest = arms straight down. +x on shoulder/elbow swings the arm forward-up (toward camera).
  idle:    { shoulderL: [0, 0, 8 * d], shoulderR: [0, 0, -8 * d], elbowL: [-8 * d, 0, 0], elbowR: [-8 * d, 0, 0] },
  explain: { shoulderL: [-35 * d, 0, 18 * d], elbowL: [-80 * d, 0, 0], wristL: [0, 25 * d, 0],
             shoulderR: [0, 0, -8 * d], elbowR: [-10 * d, 0, 0], head: [0, 6 * d, 3 * d] },
  present: { shoulderL: [-30 * d, 0, 40 * d], elbowL: [-45 * d, 0, 0],
             shoulderR: [-30 * d, 0, -40 * d], elbowR: [-45 * d, 0, 0], chest: [-4 * d, 0, 0] },
  point:   { shoulderR: [-85 * d, 0, -15 * d], elbowR: [-5 * d, 0, 0], shoulderL: [0, 0, 8 * d], head: [0, -10 * d, 0] },
  think:   { shoulderR: [-40 * d, 0, 10 * d], elbowR: [-125 * d, 0, 0], shoulderL: [-25 * d, 0, -25 * d], elbowL: [-90 * d, 0, 0],
             head: [8 * d, 0, -8 * d] },
  wave:    { shoulderR: [0, 0, -150 * d], elbowR: [0, 0, 30 * d], shoulderL: [0, 0, 8 * d] },
  thumbsUp:{ shoulderR: [-45 * d, 0, -10 * d], elbowR: [-90 * d, 0, 0], shoulderL: [0, 0, 8 * d] },
};

// Mouth shapes (Rhubarb Lip Sync letters) -> jaw open, width, roundness, smile.
export const VISEMES = {
  X: [0.0, 1.0, 0.0, 0.5], A: [0.0, 0.9, 0.0, 0.2], B: [0.18, 1.0, 0.0, 0.3], C: [0.45, 1.05, 0.1, 0.3],
  D: [0.85, 1.0, 0.0, 0.3], E: [0.45, 0.75, 0.6, 0.1], F: [0.2, 0.55, 1.0, 0.0], G: [0.12, 1.0, 0.0, 0.2], H: [0.5, 1.0, 0.0, 0.3],
};

// Expressions: brow raise/frown/inner, eye open (1 = normal), mouth smile (-1 frown .. 1 grin), head tilt.
export const EXPRESSIONS = {
  neutral:   { brow: 0, frown: 0, inner: 0, eyeOpen: 1, smile: 0.35 },
  happy:     { brow: 0.2, frown: 0, inner: 0, eyeOpen: 0.95, smile: 0.8 },
  bigSmile:  { brow: 0.35, frown: 0, inner: 0, eyeOpen: 0.85, smile: 1 },
  surprised: { brow: 1, frown: 0, inner: 0, eyeOpen: 1.3, smile: 0 },
  thinking:  { brow: 0.4, frown: 0.3, inner: 0, eyeOpen: 0.9, smile: 0.1, asym: 0.6 },
  serious:   { brow: 0, frown: 0.6, inner: 0, eyeOpen: 0.9, smile: 0 },
  worried:   { brow: 0.2, frown: 0, inner: 1, eyeOpen: 1, smile: -0.4 },
  confident: { brow: 0.1, frown: 0.2, inner: 0, eyeOpen: 0.8, smile: 0.6, asym: 0.3 },
  sad:       { brow: 0, frown: 0, inner: 0.9, eyeOpen: 0.75, smile: -0.7 },
  angry:     { brow: 0, frown: 1, inner: 0, eyeOpen: 0.85, smile: -0.5 },
};

export function buildCharacter(THREE, spec) {
  const mats = {};
  const M = (key, color, rough = 0.62, extra = {}) =>
    (mats[key] ||= new THREE.MeshStandardMaterial({ color, roughness: rough, ...extra }));
  const skin = M("skin", spec.skin, 0.5);
  const hairM = M("hair", spec.hair, 0.45);
  const joints = {};
  const meshes = [];

  const g = (name, parent, x = 0, y = 0, z = 0) => {
    const o = new THREE.Group(); o.name = name; o.position.set(x, y, z);
    if (parent) parent.add(o); joints[name] = o; return o;
  };
  const mesh = (geo, mat, parent, x = 0, y = 0, z = 0, sx = 1, sy = 1, sz = 1) => {
    const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.scale.set(sx, sy, sz);
    m.castShadow = true; m.receiveShadow = true; parent.add(m); meshes.push(m); return m;
  };
  const sphere = (r, seg = 32) => new THREE.SphereGeometry(r, seg, Math.round(seg * 0.75));
  const capsule = (r, len, seg = 24) => new THREE.CapsuleGeometry(r, len, 10, seg);
  // Smooth body part from a (radius, height) profile, revolved around Y.
  const lathe = (pts, seg = 48) => new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), seg);
  // Tapered limb between two radii (cylinder + rounded ends), along -Y from the joint.
  const limb = (r1, r2, len, mat, parent, y0 = 0) => {
    const c = mesh(new THREE.CylinderGeometry(r1, r2, len, 24, 1, true), mat, parent, 0, y0 - len / 2, 0);
    mesh(sphere(r1, 24), mat, parent, 0, y0, 0);
    mesh(sphere(r2, 24), mat, parent, 0, y0 - len, 0);
    return c;
  };

  // ---- skeleton (character faces +Z)
  const root = new THREE.Group(); root.name = spec.name;
  const hips = g("hips", root, 0, 0.74, 0);
  const spine = g("spine", hips, 0, 0.04, 0);
  const chest = g("chest", spine, 0, 0.24, 0);
  const neck = g("neck", chest, 0, 0.2, 0);
  const head = g("head", neck, 0, 0.025, 0);

  // ---- torso: one smooth shirt shape (lathe), flattened front-to-back
  const shirt = M("shirt", spec.shirt, spec.hoodie ? 0.9 : 0.8);
  const torso = mesh(lathe([[0.0, -0.1], [0.19, -0.1], [0.205, -0.04], [0.2, 0.08], [0.21, 0.2], [0.225, 0.3], [0.215, 0.38], [0.17, 0.43], [0.09, 0.455], [0.0, 0.46]]),
    shirt, spine, 0, 0, 0, 1, 1, 0.72);
  if (spec.hoodie) {
    mesh(new THREE.TorusGeometry(0.1, 0.05, 14, 32), shirt, chest, 0, 0.19, -0.02, 1.15, 1, 1).rotation.x = Math.PI / 2;
    mesh(new THREE.CapsuleGeometry(0.06, 0.12, 8, 16), M("pocket", spec.shirt, 0.95), spine, 0, 0.02, 0.135, 1, 1, 0.35).rotation.z = Math.PI / 2;
    for (const s of [1, -1]) mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.12, 8), M("cord", "#f5efe6", 0.6), chest, s * 0.03, 0.08, 0.15);
  } else {
    mesh(new THREE.TorusGeometry(0.068, 0.014, 10, 32), M("collar", spec.shirt, 0.85), chest, 0, 0.205, 0.0, 1.15, 1, 0.85).rotation.x = Math.PI / 2;
  }
  mesh(new THREE.CylinderGeometry(0.052, 0.058, 0.1, 24), skin, neck, 0, 0.0, 0);

  // ---- head: one sphere, fuller cheeks and jaw (vertex shaping, no seams)
  const headGeo = new THREE.SphereGeometry(0.2, 64, 48);
  const pos = headGeo.attributes.position, v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const low = Math.max(0, -v.y / 0.2);                      // 0 at equator .. 1 at chin
    const cheek = Math.exp(-((v.y + 0.07) ** 2) / 0.004) * 0.1; // cheek bulge band
    const w = 1 + cheek - 0.1 * low * low;
    v.x *= w * 1.04; v.z *= (1 + cheek * 0.6) * 0.96; v.y *= 1.04;
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  headGeo.computeVertexNormals();
  const HC = 0.2;                                              // head centre height above neck joint
  mesh(headGeo, skin, head, 0, HC, 0);
  const surfZ = (x, y) => { // approximate front surface depth of the shaped head
    const r = 0.2, yy = (y - HC) / 1.04, xx = x / 1.06;
    return Math.sqrt(Math.max(0, r * r - xx * xx - yy * yy)) * 0.97;
  };
  for (const s of [1, -1]) {
    const ear = mesh(sphere(0.048, 24), skin, head, s * 0.2, HC - 0.02, -0.01, 0.5, 0.95, 0.75);
    mesh(sphere(0.026, 16), M("skinShade", spec.skinShade, 0.6), ear, s * 0.014, 0, 0.012, 0.55, 1, 0.6);
  }
  mesh(sphere(0.03, 24), skin, head, 0, HC - 0.035, surfZ(0, HC - 0.035) + 0.008, 1.15, 0.95, 0.9);  // nose

  const EY = HC + 0.0, EX = 0.072;
  const eyes = [];
  for (const s of [1, -1]) {
    const e = g(s > 0 ? "eyeL" : "eyeR", head, s * EX, EY, surfZ(s * EX, EY) - 0.006);
    mesh(sphere(0.03, 24), M("eye", spec.eye, 0.12), e, 0, 0, 0, 0.8, 1.12, 0.5);
    const hl = new THREE.Mesh(sphere(0.0085, 12), new THREE.MeshBasicMaterial({ color: "#ffffff" }));
    hl.position.set(s * -0.007 + 0.006, 0.013, 0.013); e.add(hl);
    eyes.push(e);
  }
  const BY = EY + 0.062;
  const brows = [];
  for (const s of [1, -1]) {
    const b = g(s > 0 ? "browL" : "browR", head, s * 0.074, BY, surfZ(s * 0.074, BY) - 0.004);
    const bm = mesh(capsule(0.0145, 0.048, 12), M("brow", spec.brow, 0.75), b, 0, 0, 0, 1, 1, 0.7);
    bm.rotation.z = Math.PI / 2 + s * 0.12; bm.rotation.y = s * -0.35;
    brows.push(b);
  }
  const MY = HC - 0.088;
  const mouth = g("mouth", head, 0, MY, surfZ(0, MY) + 0.004);
  const mouthIn = mesh(sphere(0.036, 24), M("mouthIn", "#5b1d22", 0.8), mouth, 0, 0, -0.006, 1, 0.1, 0.4);
  const tongue = mesh(sphere(0.022, 16), M("tongue", "#c4545a", 0.7), mouth, 0, -0.012, -0.002, 1.1, 0.4, 0.5);
  const teeth = mesh(sphere(0.028, 16), M("teeth", "#fbf7f2", 0.35), mouth, 0, 0.01, -0.002, 1, 0.25, 0.4);
  const lip = mesh(new THREE.TorusGeometry(0.036, 0.0068, 8, 32, Math.PI), M("lip", "#6a2e2a", 0.6), mouth, 0, 0.006, 0.0);
  lip.rotation.z = Math.PI;                                     // U shape = smile
  if (spec.goatee) {
    const gy = HC - 0.15;
    mesh(sphere(0.022, 24), M("beard", spec.beard, 0.95), head, 0, gy, surfZ(0, gy) - 0.006, 1.2, 0.7, 0.4);
  }

  // ---- hair
  if (spec.hairStyle === "quiff") {
    // top cap stops at the hairline in front; a back shell covers the back of the head to the nape
    mesh(new THREE.SphereGeometry(0.214, 48, 32, 0, Math.PI * 2, 0, Math.PI * 0.36), hairM, head, 0, HC + 0.012, -0.01, 1.07, 1.1, 1.02);
    mesh(new THREE.SphereGeometry(0.214, 48, 32, Math.PI, Math.PI, 0, Math.PI * 0.74), hairM, head, 0, HC + 0.005, -0.006, 1.07, 1.06, 1.04).geometry = new THREE.SphereGeometry(0.214, 48, 32, Math.PI - 0.45, Math.PI + 0.9, 0, Math.PI * 0.7);
    for (const s of [1, -1]) mesh(sphere(0.06, 20), hairM, head, s * 0.165, HC + 0.04, -0.03, 0.5, 1.1, 1.3); // short sides
    // wavy quiff: overlapping strands swept up and back
    const strands = [[0, 0.205, 0.1, 0.085, -0.5], [-0.07, 0.195, 0.085, 0.075, -0.4], [0.075, 0.19, 0.08, 0.075, -0.45],
                     [0.02, 0.235, 0.03, 0.09, -0.3], [-0.09, 0.21, 0.01, 0.08, -0.2], [0.1, 0.205, 0.0, 0.08, -0.2],
                     [0, 0.22, -0.07, 0.095, 0], [-0.08, 0.185, -0.1, 0.08, 0.2], [0.08, 0.185, -0.1, 0.08, 0.2], [0.0, 0.17, -0.15, 0.09, 0.4]];
    for (const [x, y, z, r, tilt] of strands) {
      const m = mesh(sphere(r, 28), hairM, head, x, HC + y - 0.02, z, 1.05, 0.62, 1.15);
      m.rotation.x = tilt;
    }
  } else {
    mesh(new THREE.SphereGeometry(0.222, 48, 32, 0, Math.PI * 2, 0, Math.PI * 0.38), hairM, head, 0, HC + 0.012, -0.01, 1.07, 1.08, 1.03);
    mesh(new THREE.SphereGeometry(0.222, 48, 32, Math.PI, Math.PI, 0, Math.PI * 0.72), hairM, head, 0, HC + 0.005, -0.006, 1.07, 1.05, 1.05);
    for (let i = 0; i < 26; i++) {                               // curls (golden-angle layout, deterministic)
      const a = i * 2.39996, r = 0.19 + (i % 3) * 0.012, yy = 0.13 + ((i * 37) % 13) / 110;
      const zc = Math.cos(a) * r;
      if (zc > 0.1 && yy < 0.16) continue;                       // keep the forehead clear
      mesh(sphere(0.05 + (i % 4) * 0.006, 20), hairM, head, Math.sin(a) * r * 1.05, HC + yy, zc * 0.95, 1.1, 0.85, 1);
    }
  }
  if (spec.glasses) {
    const fr = M("glasses", "#1d1d22", 0.35);
    for (const s of [1, -1]) mesh(new THREE.TorusGeometry(0.044, 0.0055, 10, 36), fr, head, s * EX, EY, surfZ(s * EX, EY) + 0.016);
    mesh(capsule(0.004, 0.03, 8), fr, head, 0, EY + 0.006, surfZ(0, EY) + 0.02).rotation.z = Math.PI / 2;
    for (const s of [1, -1]) mesh(capsule(0.004, 0.16, 8), fr, head, s * 0.115, EY + 0.004, 0.08).rotation.x = Math.PI / 2;
  }
  if (spec.headphones) {
    const hp = M("headphones", "#3a3d44", 0.45);
    for (const s of [1, -1]) mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.04, 28), hp, chest, s * 0.095, 0.25, 0.07).rotation.z = Math.PI / 2;
    mesh(new THREE.TorusGeometry(0.1, 0.013, 10, 32, Math.PI), hp, chest, 0, 0.24, 0.02).rotation.x = Math.PI / 2;
  }

  // ---- arms: joints hang straight down at rest (A-pose comes from POSES.idle)
  const armMat = spec.hoodie ? shirt : skin;
  for (const [s, L] of [[1, "L"], [-1, "R"]]) {
    const sh = g("shoulder" + L, chest, s * 0.205, 0.13, 0);
    mesh(sphere(0.075, 24), shirt, sh, 0, -0.01, 0);                                     // shoulder / sleeve cap
    mesh(new THREE.CylinderGeometry(0.072, 0.07, 0.11, 24), shirt, sh, 0, -0.065, 0);      // sleeve
    if (!spec.hoodie) mesh(new THREE.TorusGeometry(0.066, 0.008, 8, 28), shirt, sh, 0, -0.12, 0).rotation.x = Math.PI / 2;
    limb(0.052, 0.047, 0.15, armMat, sh, -0.06);                                            // upper arm
    const el = g("elbow" + L, sh, 0, -0.22, 0);
    limb(0.047, 0.042, 0.15, armMat, el, 0);                                                // forearm
    const wr = g("wrist" + L, el, 0, -0.17, 0);
    if (spec.hoodie) mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.035, 20), M("cuff", spec.shirt, 0.95), el, 0, -0.15, 0);
    // chunky cartoon hand: palm + mitten fingers + thumb
    mesh(sphere(0.05, 24), skin, wr, 0, -0.045, 0, 0.85, 1.05, 0.62);
    mesh(capsule(0.03, 0.03, 16), skin, wr, 0, -0.095, 0.0, 1.35, 1, 0.75);
    const th = mesh(capsule(0.016, 0.03, 12), skin, wr, -s * 0.0, -0.04, 0.035);
    th.rotation.x = 0.6;
    if (L === "L" && spec.watch) {
      mesh(new THREE.TorusGeometry(0.047, 0.011, 10, 32), M("watch", spec.watch, 0.25, { metalness: 0.85 }), el, 0, -0.135, 0).rotation.x = Math.PI / 2;
      mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.014, 24), M("watchFace", spec.watchFace, 0.2, { metalness: 0.6 }), el, s * 0.0, -0.135, 0.05).rotation.x = Math.PI / 2;
    }
  }

  // ---- legs: joggers with cuffs, chunky sneakers
  const pants = M("pants", spec.pants, 0.88);
  mesh(lathe([[0, 0.02], [0.2, 0.02], [0.205, -0.04], [0.19, -0.1], [0.15, -0.14], [0, -0.15]]), pants, hips, 0, 0, 0, 1, 1, 0.75);
  for (const [s, L] of [[1, "L"], [-1, "R"]]) {
    const hp = g("hip" + L, hips, s * 0.095, -0.06, 0);
    limb(0.088, 0.075, 0.26, pants, hp, 0);
    const kn = g("knee" + L, hp, 0, -0.3, 0);
    limb(0.075, 0.066, 0.25, pants, kn, 0);
    mesh(new THREE.CylinderGeometry(0.06, 0.058, 0.04, 24), M("cuffP", spec.pants, 0.95), kn, 0, -0.29, 0);
    const an = g("ankle" + L, kn, 0, -0.32, 0);
    mesh(sphere(0.075, 28), M("shoe", spec.shoes, 0.55), an, 0, -0.03, 0.04, 0.95, 0.62, 1.5);
    mesh(capsule(0.04, 0.12, 16), M("sole", spec.soles, 0.7), an, 0, -0.065, 0.04, 2.05, 0.55, 1).rotation.x = Math.PI / 2;
  }

  // ---- animation API (pure functions of their arguments)
  function resetPose() { for (const j of Object.values(joints)) j.rotation.set(0, 0, 0); }
  function pose(p, w = 1) {
    for (const [k, r] of Object.entries(p)) {
      const j = joints[k]; if (!j) continue;
      j.rotation.x += r[0] * w; j.rotation.y += r[1] * w; j.rotation.z += r[2] * w;
    }
  }
  const eyeRest = eyes.map((e) => e.position.clone());
  const browRest = brows.map((b) => b.position.clone());
  function face({ expression = "neutral", viseme = "X", blink = 0, talk = 1, look = [0, 0] } = {}) {
    const e = EXPRESSIONS[expression] || EXPRESSIONS.neutral;
    const asym = e.asym || 0;
    brows.forEach((b, i) => {
      const s = i === 0 ? 1 : -1;
      b.position.y = browRest[i].y + 0.022 * e.brow * (1 + s * asym * 0.6) - 0.01 * e.frown + 0.004 * e.inner;
      b.rotation.z = s * (0.3 * e.frown - 0.35 * e.inner);
    });
    const open = Math.max(0.06, e.eyeOpen * (1 - blink));
    eyes.forEach((ey, i) => { ey.scale.y = open; ey.position.x = eyeRest[i].x + look[0] * 0.008; ey.position.y = eyeRest[i].y + look[1] * 0.006; });
    const [jaw, wid, round, vsmile] = VISEMES[viseme] || VISEMES.X;
    const j = jaw * talk;
    const w = wid * (1 - 0.35 * round);
    mouthIn.visible = j > 0.04;
    mouthIn.scale.set(w, 0.12 + j * 0.8, 0.4);
    mouthIn.position.y = -0.01 * j;
    tongue.visible = j > 0.3; tongue.position.y = -0.012 - 0.012 * j;
    teeth.visible = j > 0.12; teeth.scale.set(w * 0.9, 0.25, 0.4);
    const sm = e.smile * (1 - 0.7 * j) + vsmile * 0.15;
    lip.visible = j < 0.3;
    lip.scale.set(w * (0.9 + 0.25 * Math.max(0, sm)), Math.max(0.12, Math.abs(sm)) * (sm >= 0 ? 1 : -1), 1);
    mouth.rotation.z = asym * 0.12;
  }
  resetPose();
  return { root, joints, pose, resetPose, face, meshes, spec };
}

// Walk cycle: phase in cycles (0..1 per stride pair). Returns a pose dict.
export function walkPose(phase, amount = 1) {
  const a = Math.sin(phase * Math.PI * 2), b = Math.cos(phase * Math.PI * 2);
  const k = amount;
  return {
    hipL: [-0.45 * a * k, 0, 0], hipR: [0.45 * a * k, 0, 0],
    kneeL: [Math.max(0, b) * 0.7 * k, 0, 0], kneeR: [Math.max(0, -b) * 0.7 * k, 0, 0],
    shoulderL: [0.35 * a * k, 0, 0], shoulderR: [-0.35 * a * k, 0, 0],
    spine: [0, 0.06 * a * k, 0], hips: [0, -0.06 * a * k, 0],
  };
}
