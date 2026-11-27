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
  skin: "#f6bf98", skinShade: "#e8a07c",
  hair: "#2b211e", brow: "#2b211e", beard: "#3a2b26",
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
  const skin = (mats.skinP ||= new THREE.MeshPhysicalMaterial({ color: spec.skin, roughness: 0.5, sheen: 0.5, sheenColor: new THREE.Color("#ffd2b8"), sheenRoughness: 0.6 }));
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
  const torso = mesh(lathe([[0.0, -0.11], [0.215, -0.11], [0.225, -0.05], [0.22, 0.08], [0.23, 0.2], [0.245, 0.3], [0.24, 0.37], [0.2, 0.425], [0.1, 0.455], [0.0, 0.46]]),
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
  const HR = 0.2;
  const headGeo = new THREE.SphereGeometry(HR, 72, 54);
  const pos = headGeo.attributes.position, v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const ny = v.y / HR, nz = v.z / HR;
    const low = Math.max(0, -ny);
    const cheek = Math.exp(-((ny + 0.3) ** 2) / 0.09) * 0.09 * (0.4 + 0.6 * Math.max(0, nz));
    const w = 1.06 + cheek - 0.16 * low ** 2.2;
    v.x *= w; v.z *= (0.97 + cheek * 0.5 - 0.05 * low ** 2); v.y *= 1.02;
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  headGeo.computeVertexNormals();
  const HC = 0.2;                                              // head centre height above neck joint
  const skinP = skin;
  mesh(headGeo, skinP, head, 0, HC, 0);
  // front surface depth of the shaped head, used to seat facial features
  const ray = new THREE.Raycaster(); const headMesh = new THREE.Mesh(headGeo);
  const surfZ = (x, y) => { ray.set(new THREE.Vector3(x, y - HC, 1), new THREE.Vector3(0, 0, -1)); const h = ray.intersectObject(headMesh)[0]; return h ? h.point.z : 0.15; };
  for (const s of [1, -1]) {                                             // big round ears that stick out
    const ear = g(s > 0 ? "earL" : "earR", head, s * 0.205, HC - 0.03, -0.005);
    ear.rotation.y = s * 0.45;
    mesh(sphere(0.056, 28), skinP, ear, 0, 0, 0, 0.42, 1.0, 0.82);
    mesh(sphere(0.034, 20), M("skinShade", spec.skinShade, 0.65), ear, s * 0.012, -0.004, 0.008, 0.3, 0.95, 0.7);
  }
  mesh(sphere(0.026, 28), skinP, head, 0, HC - 0.045, surfZ(0, HC - 0.045) + 0.004, 1.25, 0.95, 0.95);   // small round nose
  const blushM = (mats.blush ||= new THREE.MeshStandardMaterial({ color: "#f29a86", roughness: 0.8, transparent: true, opacity: 0.28, depthWrite: false }));
  for (const s of [1, -1]) mesh(sphere(0.035, 20), blushM, head, s * 0.115, HC - 0.06, surfZ(s * 0.115, HC - 0.06) - 0.012, 1.2, 0.7, 0.5).castShadow = false;

  const EY = HC - 0.005, EX = 0.082;
  const eyes = [];
  for (const s of [1, -1]) {
    const e = g(s > 0 ? "eyeL" : "eyeR", head, s * EX, EY, surfZ(s * EX, EY) - 0.004);
    mesh(sphere(0.022, 24), M("eye", spec.eye, 0.1), e, 0, 0, 0, 0.82, 1.18, 0.45);
    const hl = new THREE.Mesh(sphere(0.0062, 12), new THREE.MeshBasicMaterial({ color: "#ffffff" }));
    hl.position.set(0.006, 0.01, 0.009); e.add(hl);
    eyes.push(e);
  }
  const BY = EY + 0.062;
  const brows = [];
  for (const s of [1, -1]) {                                              // thin arched brows
    const b = g(s > 0 ? "browL" : "browR", head, s * 0.082, BY, surfZ(s * 0.082, BY) - 0.002);
    const bm = mesh(new THREE.TorusGeometry(0.042, 0.0085, 10, 24, Math.PI * 0.62), M("brow", spec.brow, 0.8), b, 0, -0.03, 0, 1, 1, 0.6);
    bm.rotation.z = Math.PI / 2 - Math.PI * 0.31 + s * 0.12;
    b.rotation.y = s * 0.32;
    brows.push(b);
  }
  const MY = HC - 0.1;
  const mouth = g("mouth", head, 0, MY, surfZ(0, MY) + 0.002);
  const mouthIn = mesh(sphere(0.034, 24), M("mouthIn", "#5b1d22", 0.8), mouth, 0, 0, -0.008, 1, 0.1, 0.4);
  const tongue = mesh(sphere(0.02, 16), M("tongue", "#c4545a", 0.7), mouth, 0, -0.012, -0.004, 1.1, 0.4, 0.5);
  const teeth = mesh(sphere(0.026, 16), M("teeth", "#fbf7f2", 0.35), mouth, 0, 0.009, -0.004, 1, 0.25, 0.4);
  const lip = mesh(new THREE.TorusGeometry(0.04, 0.0058, 8, 36, Math.PI * 0.8), M("lip", "#5e2a26", 0.6), mouth, 0, 0.012, 0.0);
  lip.rotation.z = Math.PI + Math.PI * 0.1;                                // U shape = closed smile
  if (spec.goatee) {                                                       // chin goatee + soul patch
    const bm = M("beard", spec.beard, 0.95);
    const gy = HC - 0.158;
    mesh(sphere(0.024, 24), bm, head, 0, gy, surfZ(0, gy) - 0.009, 1.2, 0.7, 0.45);
    mesh(sphere(0.012, 16), bm, head, 0, HC - 0.127, surfZ(0, HC - 0.127) - 0.004, 0.9, 1.1, 0.45);
  }

  // ---- hair: one sculpted shell around the head (thick swept quiff on top, short faded sides, nape at the back)
  const hairShell = (style) => {
    const geo = new THREE.SphereGeometry(HR * 1.0, 96, 72);
    const p = geo.attributes.position, n = new THREE.Vector3(), cols = [];
    const cH = new THREE.Color(spec.hair), cS = new THREE.Color(spec.skin), tmp = new THREE.Color();
    const sstep = (e0, e1, x) => { const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };
    for (let i = 0; i < p.count; i++) {
      n.fromBufferAttribute(p, i).normalize();
      const { x, y, z } = n;
      // hairline height (unit-sphere y) around the head: high on the forehead, ear-top on the sides, low at the nape
      const front = sstep(0.15, 0.85, z), back = sstep(0.0, 0.75, -z);
      const hl = style === "quiff" ? (0.5 * front + -0.08 * (1 - front - back) + -0.55 * back)
                                   : (0.42 * front + -0.15 * (1 - front - back) + -0.5 * back);
      const inHair = sstep(hl, hl + 0.1, y);
      let t;
      if (style === "quiff") {
        const side = sstep(0.55, 0.85, Math.abs(x)) * (1 - sstep(0.55, 0.8, y));   // faded sides
        const top = sstep(0.35, 0.9, y);
        const quiff = Math.exp(-(((z - 0.55) ** 2) / 0.12 + ((y - 0.7) ** 2) / 0.1)) * (1 + 0.35 * x);  // volume at front-top, swept to one side
        const waves = 0.012 * Math.sin(22 * (z * 0.75 - x * 0.65) + 3 * y) * top;
        t = (0.026 + 0.034 * top + 0.06 * quiff + waves) * (1 - 0.8 * side);
      } else {
        const curls = 0.02 * Math.sin(17 * x + 5) * Math.sin(15 * z + 2) * Math.sin(13 * y + 1);
        t = 0.03 + 0.06 * sstep(0.0, 0.8, y) + Math.abs(curls) * 1.6;
      }
      const r = HR * 0.9 + (HR * 0.16 + t) * inHair;                          // outside the hair region: tucked inside the skull
      const sx = 1.06, sy = 1.02;
      p.setXYZ(i, x * r * sx, y * r * sy, z * r);
      // short faded sides read as skin-tinted stubble; the rest is full hair colour
      const fadeSide = style === "quiff" ? sstep(0.55, 0.85, Math.abs(x)) * (1 - sstep(0.5, 0.75, y)) * (1 - sstep(0.1, 0.6, -z)) : 0;
      tmp.copy(cH).lerp(cS, 0.42 * fadeSide);
      cols.push(tmp.r, tmp.g, tmp.b);
    }
    geo.setAttribute("color", new THREE.Float32BufferAttribute(cols, 3));
    geo.computeVertexNormals();
    return geo;
  };
  const hairMat = new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.42, sheen: 0.6, sheenColor: new THREE.Color("#6b5a52"), sheenRoughness: 0.4 });
  mesh(hairShell(spec.hairStyle), hairMat, head, 0, HC, -0.004);
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
    const sh = g("shoulder" + L, chest, s * 0.225, 0.12, 0);
    mesh(sphere(0.082, 24), shirt, sh, 0, -0.01, 0, 1, 1, 0.95);                                     // shoulder / sleeve cap
    mesh(new THREE.CylinderGeometry(0.08, 0.077, 0.11, 24), shirt, sh, 0, -0.065, 0);      // sleeve
    if (!spec.hoodie) mesh(new THREE.TorusGeometry(0.073, 0.008, 8, 28), shirt, sh, 0, -0.12, 0).rotation.x = Math.PI / 2;
    limb(0.058, 0.052, 0.15, armMat, sh, -0.06);                                            // upper arm
    const el = g("elbow" + L, sh, 0, -0.22, 0);
    limb(0.052, 0.046, 0.15, armMat, el, 0);                                                // forearm
    const wr = g("wrist" + L, el, 0, -0.17, 0);
    if (spec.hoodie) mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.035, 20), M("cuff", spec.shirt, 0.95), el, 0, -0.15, 0);
    // chunky cartoon hand: palm + mitten fingers + thumb
    mesh(sphere(0.05, 24), skin, wr, 0, -0.045, 0, 0.85, 1.05, 0.62);
    for (let f = 0; f < 4; f++) mesh(capsule(0.0125, 0.034, 12), skin, wr, (f - 1.5) * 0.022, -0.1 + Math.abs(f - 1.5) * 0.006, 0.004);
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
    limb(0.095, 0.083, 0.26, pants, hp, 0);
    const kn = g("knee" + L, hp, 0, -0.3, 0);
    limb(0.083, 0.07, 0.25, pants, kn, 0);
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
