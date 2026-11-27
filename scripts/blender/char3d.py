"""Yusuf Aiman 3D character pipeline (Blender 5.3 as a Python module).

Run through the wrapper: scripts/char3d <command> [options]

Commands (each reads/writes characters/<name>/model/<name>.blend):
  mannequin  Build a grey PLACEHOLDER body to test the pipeline (never for production).
  import     Import a generated mesh (GLB/GLTF/FBX/OBJ), clean it, scale to height, feet on origin.
  rig        Build a Mixamo-named armature from landmarks.json and skin the mesh to it.
  face       Add the facial shape-key slots (expressions + visemes) to the head mesh.
  lipsync    Turn a voice line (MP3/WAV) into viseme keyframes with Rhubarb Lip Sync.
  render     Render a shot (shot JSON) to a transparent PNG sequence + WebM (VP9 alpha) for HyperFrames.

Rules (see CLAUDE.md): characters are locked; a model is only production-ready after the
owner approves it, and that is recorded in characters/<name>/model/APPROVAL.md.
"""
import argparse
import json
import math
import os
import shutil
import subprocess
import sys
from pathlib import Path

import bpy
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[2]
EXPRESSIONS = json.loads((ROOT / "characters/expressions.json").read_text())

# Every facial shape key a character head must provide (sculpted on the approved model).
FACE_KEYS = sorted({k for e in EXPRESSIONS["expressions"].values() for k in e}
                   | {k for v, e in EXPRESSIONS["visemes"].items() if not v.startswith("_") for k in e}
                   | {"eye_blink_L", "eye_blink_R"})

# Mixamo naming so Mixamo / other mocap clips retarget without renaming.
P = "mixamorig:"

# Default landmarks for the house proportions (about 4.5 heads tall, A-pose, facing -Y).
# z = fraction of total height, x = fraction of total height from the centre line (character's left is +X).
DEFAULT_LANDMARKS = {
    "hips": [0.0, 0.46], "spine": [0.0, 0.52], "spine1": [0.0, 0.58], "spine2": [0.0, 0.64],
    "neck": [0.0, 0.70], "head": [0.0, 0.73], "head_top": [0.0, 1.0],
    "shoulder": [0.05, 0.67], "arm": [0.13, 0.67], "forearm": [0.21, 0.55], "hand": [0.27, 0.44], "hand_end": [0.30, 0.38],
    "upleg": [0.075, 0.45], "leg": [0.075, 0.25], "foot": [0.075, 0.05], "toe": [0.075, 0.01], "toe_end_y": -0.08,
}


# ---------------------------------------------------------------- helpers
def model_dir(name):
    d = ROOT / "characters" / name / "model"
    d.mkdir(parents=True, exist_ok=True)
    return d


def blend_path(name):
    return model_dir(name) / f"{name}.blend"


def open_blend(name):
    p = blend_path(name)
    if not p.exists():
        sys.exit(f"{p} not found: run 'import' (or 'mannequin') first")
    bpy.ops.wm.open_mainfile(filepath=str(p))


def save_blend(name):
    bpy.ops.wm.save_as_mainfile(filepath=str(blend_path(name)), compress=True)
    print(f"saved {blend_path(name).relative_to(ROOT)}")


def landmarks(name):
    p = model_dir(name) / "landmarks.json"
    data = dict(DEFAULT_LANDMARKS)
    if p.exists():
        data.update(json.loads(p.read_text()))
    return data


def body_mesh():
    meshes = [o for o in bpy.data.objects if o.type == "MESH" and o.get("ya_role") == "body"]
    if not meshes:
        sys.exit("no mesh tagged ya_role=body; run 'import' first")
    return meshes[0]


def height_of(name):
    return float(json.loads((ROOT / "characters" / name / "model" / "meta.json").read_text())["height_m"])


def write_meta(name, **kw):
    p = model_dir(name) / "meta.json"
    meta = json.loads(p.read_text()) if p.exists() else {}
    meta.update(kw)
    p.write_text(json.dumps(meta, indent=2) + "\n")


def reset_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)


# ---------------------------------------------------------------- mannequin (placeholder)
def cmd_mannequin(a):
    reset_scene()
    h = a.height
    L = {k: (v[0] * h, v[1] * h) if isinstance(v, list) else v * h for k, v in DEFAULT_LANDMARKS.items()}
    parts = []

    def capsule(p1, p2, r):
        p1, p2 = Vector(p1), Vector(p2)
        d = p2 - p1
        bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=d.length, vertices=24, location=(p1 + p2) / 2)
        c = bpy.context.object
        c.rotation_mode = "QUATERNION"
        c.rotation_quaternion = d.to_track_quat("Z", "Y")
        parts.append(c)
        for p in (p1, p2):
            bpy.ops.mesh.primitive_uv_sphere_add(radius=r, segments=24, ring_count=12, location=p)
            parts.append(bpy.context.object)

    head_r = (L["head_top"][1] - L["head"][1]) / 2
    bpy.ops.mesh.primitive_uv_sphere_add(radius=head_r, segments=48, ring_count=24, location=(0, 0, L["head"][1] + head_r))
    parts.append(bpy.context.object)
    capsule((0, 0, L["hips"][1]), (0, 0, L["spine2"][1]), 0.09 * h)
    capsule((0, 0, L["spine2"][1]), (0, 0, L["head"][1] + 0.02 * h), 0.035 * h)
    for s in (1, -1):
        capsule((s * L["arm"][0], 0, L["arm"][1]), (s * L["forearm"][0], 0, L["forearm"][1]), 0.03 * h)
        capsule((s * L["forearm"][0], 0, L["forearm"][1]), (s * L["hand"][0], 0, L["hand"][1]), 0.026 * h)
        capsule((s * L["upleg"][0], 0, L["upleg"][1]), (s * L["leg"][0], 0, L["leg"][1]), 0.045 * h)
        capsule((s * L["leg"][0], 0, L["leg"][1]), (s * L["foot"][0], 0, L["foot"][1]), 0.038 * h)
        capsule((s * L["foot"][0], 0, L["toe"][1]), (s * L["foot"][0], L["toe_end_y"], L["toe"][1]), 0.03 * h)
    for p in parts:
        p.select_set(True)
    bpy.context.view_layer.objects.active = parts[0]
    bpy.ops.object.join()
    body = bpy.context.object
    body.name = f"{a.character}_body"
    # Merge the overlapping primitives into one watertight surface so skinning works.
    rem = body.modifiers.new("remesh", "REMESH")
    rem.mode, rem.voxel_size = "VOXEL", 0.012 * h
    bpy.ops.object.modifier_apply(modifier="remesh")
    bpy.ops.object.shade_smooth()
    mat = bpy.data.materials.new("placeholder_grey")
    mat.diffuse_color = (0.55, 0.57, 0.6, 1)
    body.data.materials.append(mat)
    body["ya_role"] = "body"
    body["ya_placeholder"] = True
    write_meta(a.character, height_m=h, source="PLACEHOLDER mannequin (pipeline test only)", placeholder=True)
    save_blend(a.character)


# ---------------------------------------------------------------- import
def cmd_import(a):
    src = Path(a.input).resolve()
    reset_scene()
    ext = src.suffix.lower()
    if ext in (".glb", ".gltf"):
        bpy.ops.import_scene.gltf(filepath=str(src))
    elif ext == ".fbx":
        bpy.ops.import_scene.fbx(filepath=str(src))
    elif ext == ".obj":
        bpy.ops.wm.obj_import(filepath=str(src))
    else:
        sys.exit(f"unsupported format {ext}")
    meshes = [o for o in bpy.data.objects if o.type == "MESH"]
    if not meshes:
        sys.exit("no mesh in file")
    # Drop any rig/empties the generator added; keep geometry and materials.
    for o in list(bpy.data.objects):
        if o.type != "MESH":
            bpy.data.objects.remove(o)
    for o in meshes:
        o.select_set(True)
    bpy.context.view_layer.objects.active = meshes[0]
    if len(meshes) > 1:
        bpy.ops.object.join()
    body = bpy.context.object
    body.parent = None
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    # Clean: merge duplicate verts, recalc normals.
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.mesh.remove_doubles(threshold=1e-5)
    bpy.ops.mesh.normals_make_consistent(inside=False)
    bpy.ops.object.mode_set(mode="OBJECT")
    # Up axis: generators usually give Y-up already converted by the glTF importer. Scale to height.
    bb = [body.matrix_world @ Vector(c) for c in body.bound_box]
    zmin, zmax = min(v.z for v in bb), max(v.z for v in bb)
    cx = (min(v.x for v in bb) + max(v.x for v in bb)) / 2
    cy = (min(v.y for v in bb) + max(v.y for v in bb)) / 2
    s = a.height / (zmax - zmin)
    body.location = (-cx * s, -cy * s, -zmin * s)
    body.scale = (s, s, s)
    if a.rotate_z:
        body.rotation_euler.z = math.radians(a.rotate_z)
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    if a.decimate and len(body.data.polygons) > a.decimate:
        d = body.modifiers.new("decimate", "DECIMATE")
        d.ratio = a.decimate / len(body.data.polygons)
        bpy.ops.object.modifier_apply(modifier="decimate")
    bpy.ops.object.shade_smooth()
    body.name = f"{a.character}_body"
    body["ya_role"] = "body"
    dst = model_dir(a.character) / "source" / src.name
    dst.parent.mkdir(exist_ok=True)
    if src != dst:
        shutil.copy2(src, dst)
    write_meta(a.character, height_m=a.height, source=str(dst.relative_to(ROOT)), placeholder=False,
               faces=len(body.data.polygons))
    print(f"imported {src.name}: {len(body.data.polygons)} faces, height {a.height} m")
    save_blend(a.character)


# ---------------------------------------------------------------- rig
def cmd_rig(a):
    open_blend(a.character)
    body = body_mesh()
    for o in list(bpy.data.objects):
        if o.type == "ARMATURE":
            bpy.data.objects.remove(o)
    body.modifiers.clear()
    body.vertex_groups.clear()
    h = height_of(a.character)
    L = landmarks(a.character)

    def pt(key, side=1, y=0.0):
        x, z = L[key]
        return Vector((side * x * h, y, z * h))

    arm_data = bpy.data.armatures.new(f"{a.character}_rig")
    rig = bpy.data.objects.new(f"{a.character}_rig", arm_data)
    bpy.context.collection.objects.link(rig)
    bpy.context.view_layer.objects.active = rig
    bpy.ops.object.mode_set(mode="EDIT")
    eb = arm_data.edit_bones

    def bone(n, head, tail, parent=None, connect=False):
        b = eb.new(P + n)
        b.head, b.tail = head, tail
        if parent:
            b.parent = eb[P + parent]
            b.use_connect = connect
        return b

    bone("Hips", pt("hips"), pt("spine"))
    bone("Spine", pt("spine"), pt("spine1"), "Hips", True)
    bone("Spine1", pt("spine1"), pt("spine2"), "Spine", True)
    bone("Spine2", pt("spine2"), pt("neck"), "Spine1", True)
    bone("Neck", pt("neck"), pt("head"), "Spine2", True)
    bone("Head", pt("head"), pt("head_top"), "Neck", True)
    for side, S in ((1, "Left"), (-1, "Right")):
        bone(f"{S}Shoulder", pt("shoulder", side), pt("arm", side), "Spine2")
        bone(f"{S}Arm", pt("arm", side), pt("forearm", side, 0.01 * h), f"{S}Shoulder", True)
        bone(f"{S}ForeArm", pt("forearm", side, 0.01 * h), pt("hand", side), f"{S}Arm", True)
        bone(f"{S}Hand", pt("hand", side), pt("hand_end", side), f"{S}ForeArm", True)
        bone(f"{S}UpLeg", pt("upleg", side), pt("leg", side, -0.01 * h), "Hips")
        bone(f"{S}Leg", pt("leg", side, -0.01 * h), pt("foot", side), f"{S}UpLeg", True)
        bone(f"{S}Foot", pt("foot", side), pt("toe", side, L["toe_end_y"] * h * 0.5), f"{S}Leg", True)
        bone(f"{S}ToeBase", pt("toe", side, L["toe_end_y"] * h * 0.5), pt("toe", side, L["toe_end_y"] * h), f"{S}Foot", True)
    bpy.ops.armature.select_all(action="SELECT")
    bpy.ops.armature.calculate_roll(type="GLOBAL_POS_Y")
    bpy.ops.object.mode_set(mode="OBJECT")
    # Skin with Blender's bone-heat automatic weights; fall back to envelopes if heat fails.
    bpy.ops.object.select_all(action="DESELECT")
    body.select_set(True)
    rig.select_set(True)
    bpy.context.view_layer.objects.active = rig
    try:
        bpy.ops.object.parent_set(type="ARMATURE_AUTO")
    except RuntimeError as e:
        print("automatic weights failed, using envelopes:", e)
        bpy.ops.object.parent_set(type="ARMATURE_ENVELOPE")
    empty = [b.name for b in arm_data.bones
             if b.name not in body.vertex_groups or not any(
                 g.group == body.vertex_groups[b.name].index for v in body.data.vertices for g in v.groups)]
    if empty:
        print("WARNING bones with no skin weights:", ", ".join(empty))
    rig["ya_role"] = "rig"
    write_meta(a.character, rig="mixamo-named, from landmarks.json", unweighted_bones=empty)
    save_blend(a.character)


# ---------------------------------------------------------------- face
def cmd_face(a):
    open_blend(a.character)
    body = body_mesh()
    if not body.data.shape_keys:
        body.shape_key_add(name="Basis", from_mix=False)
    keys = body.data.shape_keys.key_blocks
    added = [k for k in FACE_KEYS if k not in keys]
    for k in added:
        body.shape_key_add(name=k, from_mix=False)
    # Keys start identical to Basis: they must be sculpted on the approved model.
    unsculpted = [k for k in FACE_KEYS if all(
        (keys[k].data[i].co - keys["Basis"].data[i].co).length < 1e-6 for i in range(0, len(keys["Basis"].data), 50))]
    write_meta(a.character, face_keys=FACE_KEYS, face_keys_unsculpted=unsculpted)
    print(f"{len(added)} shape keys added; {len(unsculpted)}/{len(FACE_KEYS)} still need sculpting")
    save_blend(a.character)


def set_face(body, weights, frame):
    keys = body.data.shape_keys.key_blocks
    for k in FACE_KEYS:
        if k in keys:
            keys[k].value = float(weights.get(k, 0.0))
            keys[k].keyframe_insert("value", frame=frame)


# ---------------------------------------------------------------- lipsync
def rhubarb_bin():
    exe = shutil.which("rhubarb") or os.environ.get("RHUBARB")
    if exe:
        return exe
    for c in (ROOT / "tools/rhubarb").glob("**/rhubarb*"):
        if c.is_file() and os.access(c, os.X_OK):
            return str(c)
    sys.exit("Rhubarb Lip Sync not found: run scripts/setup-3d.sh or set RHUBARB=/path/to/rhubarb")


def mouth_cues(audio, dialog=None):
    tmp = Path(bpy.app.tempdir or "/tmp") / (Path(audio).stem + ".wav")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(audio), "-ac", "1", "-ar", "22050", str(tmp)], check=True)
    # 'phonetic' is language-independent (needed for Malay); 'pocketSphinx' is English-only but
    # can use the exact dialog text.
    recognizer = os.environ.get("RHUBARB_RECOGNIZER", "phonetic")
    cmd = [rhubarb_bin(), "-f", "json", "-r", recognizer, "--extendedShapes", "GHX", "-q", str(tmp)]
    if dialog and recognizer == "pocketSphinx":
        d = tmp.with_suffix(".txt")
        d.write_text(dialog)
        cmd[1:1] = ["--dialogFile", str(d)]
    out = subprocess.run(cmd, check=True, capture_output=True, text=True).stdout
    return json.loads(out)["mouthCues"]


def cmd_lipsync(a):
    cues = mouth_cues(a.audio, a.dialog)
    out = Path(a.out) if a.out else Path(a.audio).with_suffix(".visemes.json")
    out.write_text(json.dumps({"audio": Path(a.audio).name, "fps": a.fps, "cues": cues}, indent=1))
    print(f"{len(cues)} mouth cues -> {out}")


def apply_visemes(body, cues, fps, start_frame, expression):
    base = EXPRESSIONS["expressions"].get(expression, {})
    for c in cues:
        w = dict(base)
        for k, v in EXPRESSIONS["visemes"][c["value"]].items():
            w[k] = max(w.get(k, 0), v)
        f = start_frame + round(c["start"] * fps)
        set_face(body, w, f)


# ---------------------------------------------------------------- render
CAMERAS = {  # (distance in heights, target height fraction, lens mm) for the brand shot sizes
    "closeup": (0.55, 0.86, 85), "head_shoulders": (0.8, 0.82, 70), "upper_body": (1.1, 0.74, 50),
    "medium": (1.5, 0.66, 50), "three_quarter": (1.6, 0.55, 40), "full": (2.1, 0.5, 35),
}


def setup_gpu(scene, engine):
    scene.render.engine = {"cycles": "CYCLES", "eevee": "BLENDER_EEVEE", "workbench": "BLENDER_WORKBENCH"}[engine]
    if engine != "cycles":
        return "n/a"
    prefs = bpy.context.preferences.addons["cycles"].preferences
    for backend in ("OPTIX", "CUDA", "HIP", "METAL", "ONEAPI"):
        try:
            prefs.compute_device_type = backend
            prefs.refresh_devices()
        except TypeError:
            continue
        gpus = [d for d in prefs.devices if d.type == backend]
        if gpus:
            for d in prefs.devices:
                d.use = d.type == backend
            scene.cycles.device = "GPU"
            return f"{backend}: " + ", ".join(d.name for d in gpus)
    scene.cycles.device = "CPU"
    return "CPU (no GPU found)"


def cmd_render(a):
    shot = json.loads(Path(a.shot).read_text())
    name = shot["character"]
    open_blend(name)
    body, h = body_mesh(), height_of(name)
    rig = next((o for o in bpy.data.objects if o.get("ya_role") == "rig"), None)
    scene = bpy.context.scene
    fps = shot.get("fps", 30)
    scene.render.fps = fps
    W, H = shot.get("resolution", [1080, 1920])
    scene.render.resolution_x, scene.render.resolution_y = W, H
    scene.render.resolution_percentage = shot.get("scale_percent", 100)
    scene.render.film_transparent = True
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    device = setup_gpu(scene, shot.get("engine", "eevee"))
    if scene.render.engine == "CYCLES":
        scene.cycles.samples = shot.get("samples", 64)
        scene.cycles.use_denoising = True
    # Expression + lip sync
    frames = shot.get("frames")
    if body.data.shape_keys:
        if shot.get("audio"):
            cues = mouth_cues(ROOT / shot["audio"], shot.get("dialog"))
            apply_visemes(body, cues, fps, 1, shot.get("expression", "01_neutral"))
            frames = frames or math.ceil(cues[-1]["end"] * fps) + 1
        else:
            set_face(body, EXPRESSIONS["expressions"].get(shot.get("expression", "01_neutral"), {}), 1)
    frames = frames or fps * 2
    scene.frame_start, scene.frame_end = 1, frames
    # Body motion: an action from characters/<name>/model/actions.blend or a Mixamo FBX clip.
    if rig and shot.get("clip"):
        clip = ROOT / shot["clip"]
        before = set(bpy.data.actions)
        bpy.ops.import_scene.fbx(filepath=str(clip), automatic_bone_orientation=True)
        new = [x for x in bpy.data.actions if x not in before]
        for o in [o for o in bpy.data.objects if o.select_get() and o != rig]:
            bpy.data.objects.remove(o)
        if new:
            rig.animation_data_create().action = new[0]
    # Static pose override (degrees, bone-local XYZ), e.g. {"LeftArm": [0, 0, 40]}; applied on top of any clip.
    if rig and shot.get("pose"):
        for bn, rot in shot["pose"].items():
            pb = rig.pose.bones[P + bn]
            pb.rotation_mode = "XYZ"
            pb.rotation_euler = [math.radians(v) for v in rot]
            pb.keyframe_insert("rotation_euler", frame=1)
    # Camera
    dist, tz, lens = CAMERAS[shot.get("camera", "medium")]
    yaw = math.radians(shot.get("yaw_deg", 0))
    cam = bpy.data.objects.new("cam", bpy.data.cameras.new("cam"))
    scene.collection.objects.link(cam)
    cam.data.lens = lens
    target = Vector((0, 0, tz * h))
    cam.location = target + Vector((math.sin(yaw) * dist * h, -math.cos(yaw) * dist * h, shot.get("cam_height", 0.0) * h))
    cam.rotation_euler = (target - cam.location).to_track_quat("-Z", "Y").to_euler()
    scene.camera = cam
    # Lighting preset: brand soft key + cool rim (#00C2FF) to match the 2.5D look.
    for nm, loc, energy, col in (("key", (-1.5, -2.0, 2.4), 300, (1, 0.96, 0.9)),
                                 ("fill", (2.0, -1.5, 1.2), 90, (0.9, 0.95, 1)),
                                 ("rim", (1.2, 2.0, 2.0), 260, (0.0, 0.76, 1.0))):
        L = bpy.data.objects.new(nm, bpy.data.lights.new(nm, "AREA"))
        L.data.energy, L.data.color, L.data.size = energy * h * h, col, 1.5 * h
        L.location = Vector(loc) * h
        L.rotation_euler = (Vector((0, 0, 0.6 * h)) - L.location).to_track_quat("-Z", "Y").to_euler()
        scene.collection.objects.link(L)
    world = bpy.data.worlds.new("w")
    world.color = (0.6, 0.62, 0.66)
    scene.world = world
    out = ROOT / shot.get("out", f"renders/char3d/{name}/{Path(a.shot).stem}")
    out.mkdir(parents=True, exist_ok=True)
    scene.render.filepath = str(out / "f_")
    print(f"render {name} {frames} frames {W}x{H} engine={scene.render.engine} device={device}")
    bpy.ops.render.render(animation=True)
    webm = out.with_suffix(".webm")
    cmd = ["ffmpeg", "-y", "-loglevel", "error", "-framerate", str(fps), "-i", str(out / "f_%04d.png")]
    if shot.get("audio"):
        cmd += ["-i", str(ROOT / shot["audio"]), "-c:a", "libopus", "-shortest"]
    cmd += ["-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "0", "-crf", "24", "-auto-alt-ref", "0", str(webm)]
    subprocess.run(cmd, check=True)
    print(f"wrote {webm.relative_to(ROOT)} (VP9 with alpha) and PNG frames in {out.relative_to(ROOT)}")
    if body.get("ya_placeholder"):
        print("NOTE: rendered with the PLACEHOLDER mannequin; not for production")


# ---------------------------------------------------------------- cli
def main(argv):
    ap = argparse.ArgumentParser(prog="char3d")
    sp = ap.add_subparsers(dest="cmd", required=True)
    m = sp.add_parser("mannequin"); m.add_argument("character"); m.add_argument("--height", type=float, default=1.0)
    i = sp.add_parser("import"); i.add_argument("character"); i.add_argument("input")
    i.add_argument("--height", type=float, default=1.0, help="metres; house scale 1.0 = one character height")
    i.add_argument("--rotate-z", type=float, default=0, help="degrees, if the model does not face -Y")
    i.add_argument("--decimate", type=int, default=150000, help="max faces (0 = keep)")
    r = sp.add_parser("rig"); r.add_argument("character")
    f = sp.add_parser("face"); f.add_argument("character")
    l = sp.add_parser("lipsync"); l.add_argument("audio"); l.add_argument("--dialog"); l.add_argument("--out"); l.add_argument("--fps", type=int, default=30)
    rd = sp.add_parser("render"); rd.add_argument("shot", help="shot JSON, see templates/char3d-shot.json")
    a = ap.parse_args(argv)
    {"mannequin": cmd_mannequin, "import": cmd_import, "rig": cmd_rig, "face": cmd_face,
     "lipsync": cmd_lipsync, "render": cmd_render}[a.cmd](a)


if __name__ == "__main__":
    main(sys.argv[1:])
