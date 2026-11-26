"""CPU render benchmark: a simple isometric tech scene (desk, laptop, server rack) at 1920x1080.
Run: .venv/bin/python scripts/blender/benchmark.py <out_dir>"""
import bpy, sys, time, os, math
out = sys.argv[1] if len(sys.argv) > 1 else "renders/bench"
os.makedirs(out, exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
def mat(name, hexc, emit=0.0, rough=0.45):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    h = hexc.lstrip('#'); rgb = [((int(h[i:i+2],16)/255)**2.2) for i in (0,2,4)] + [1]
    b.inputs["Base Color"].default_value = rgb; b.inputs["Roughness"].default_value = rough
    if emit: b.inputs["Emission Color"].default_value = rgb; b.inputs["Emission Strength"].default_value = emit
    return m
def cube(name, loc, scale, m, bevel=0.04):
    bpy.ops.mesh.primitive_cube_add(location=loc); o = bpy.context.object; o.name = name
    o.scale = scale; bpy.ops.object.transform_apply(scale=True)
    md = o.modifiers.new("bev", "BEVEL"); md.width = bevel; md.segments = 3
    o.data.materials.append(m); bpy.ops.object.shade_smooth(); return o
floor = cube("floor", (0,0,-0.1), (4,4,0.1), mat("floor","#F5F7FA"), 0.08)
cube("desk", (0,0,0.75), (1.2,0.6,0.04), mat("desk","#1F2937"))
for x in (-1.1,1.1):
    cube(f"leg{x}", (x,0,0.37), (0.04,0.55,0.37), mat("leg","#0B1E3F"))
cube("laptop_base", (0,0,0.81), (0.35,0.24,0.015), mat("lap","#9CA3AF"), 0.01)
lid = cube("laptop_lid", (0,-0.24,1.03), (0.35,0.012,0.22), mat("screen","#0066DE", emit=3), 0.01)
for i in range(4):
    cube(f"rack{i}", (2.2,1.5-i*0.0,0.5+i*0.5), (0.4,0.4,0.22), mat(f"r{i}","#0B1E3F"))
    cube(f"led{i}", (2.2,1.09,0.5+i*0.5), (0.3,0.01,0.02), mat(f"l{i}","#00C2FF", emit=8), 0.002)
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.25, location=(-1.6,1.2,0.25)); s = bpy.context.object
s.data.materials.append(mat("orb","#FF8A00")); bpy.ops.object.shade_smooth()
# lights: key/fill/rim (brand 3-point)
for n,loc,en,size in [("key",(3,-3,5),900,3),("fill",(-4,-2,3),300,4),("rim",(-1,4,4),500,2)]:
    bpy.ops.object.light_add(type='AREA', location=loc); l = bpy.context.object; l.name = n
    l.data.energy = en; l.data.size = size
    l.rotation_euler = (bpy.context.object.location - bpy.context.object.location).to_track_quat('Z','Y').to_euler()
    d = l.location; l.rotation_euler = (math.atan2(math.hypot(d.x,d.y), d.z), 0, math.atan2(d.y,d.x)+math.pi/2)
world = bpy.data.worlds.new("w"); sc.world = world; world.use_nodes = True
world.node_tree.nodes["Background"].inputs[0].default_value = (0.02,0.05,0.12,1); world.node_tree.nodes["Background"].inputs[1].default_value = 0.6
# isometric-ish orthographic camera
bpy.ops.object.camera_add(location=(7,-7,6.2)); cam = bpy.context.object
cam.rotation_euler = (math.radians(54.7), 0, math.radians(45)); cam.data.type='ORTHO'; cam.data.ortho_scale = 6.5
sc.camera = cam
sc.render.resolution_x, sc.render.resolution_y = 1920, 1080
sc.render.image_settings.file_format = 'PNG'
results = {}
ENGINES = [("CYCLES", 32), ("CYCLES", 128), ("BLENDER_EEVEE", 32), ("BLENDER_WORKBENCH", 0)]
only = os.environ.get("BENCH_ENGINES")
if only: ENGINES = [e for e in ENGINES if f"{e[0]}_{e[1]}" in only.split(",")]
for engine, samples in ENGINES:
    try:
        sc.render.engine = engine
        if engine == "CYCLES":
            sc.cycles.device = 'CPU'; sc.cycles.samples = samples; sc.cycles.use_denoising = True
        elif engine == "BLENDER_EEVEE":
            sc.eevee.taa_render_samples = samples
        sc.render.filepath = os.path.join(out, f"{engine.lower()}_{samples}.png")
        t = time.time(); bpy.ops.render.render(write_still=True); dt = time.time() - t
        results[f"{engine}_{samples}"] = round(dt, 1)
    except Exception as e:
        results[f"{engine}_{samples}"] = f"FAILED: {str(e)[:120]}"
    print("BENCH", engine, samples, results[f"{engine}_{samples}"], flush=True)
print("RESULTS", results)
