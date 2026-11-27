"""Cut out character poses (rembg isnet-general-use) and place each on a uniform 640x800 canvas:
same scale per source image height, feet on the bottom edge, legs centred, so poses can be swapped in place.
Also bakes the blurred/darkened background plates and the RGB-split copies of the fictional Dato'."""
import sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance
from rembg import remove, new_session
EP = Path(__file__).resolve().parents[1]
SRC, OUT = EP / "assets/src", EP / "assets/images"
sess = new_session("isnet-general-use")
CW, CH = 640, 800

def cut(name):
    im = Image.open(SRC / f"{name}.png").convert("RGB")
    rgba = remove(im, session=sess, alpha_matting=False)
    a = np.array(rgba)[:, :, 3]
    a[a < 24] = 0
    rgba.putalpha(Image.fromarray(a))
    return rgba

def place(rgba, scale_h=870):
    a = np.array(rgba)[:, :, 3] > 0
    ys, xs = np.where(a)
    bottom = ys.max()
    s = scale_h / rgba.height
    # legs centre: columns with alpha in the lowest 22% of the figure
    top = ys.min(); band = a[int(bottom - (bottom - top) * 0.22):bottom + 1]
    cx = np.where(band.any(0))[0].mean()
    im = rgba.resize((round(rgba.width * s), round(rgba.height * s)), Image.LANCZOS)
    can = Image.new("RGBA", (CW, CH))
    can.alpha_composite(im, (round(CW / 2 - cx * s), round(CH - 6 - bottom * s)))
    return can

for f in sorted(SRC.glob("aiman-*.png")) + sorted(SRC.glob("yusuf-*.png")):
    out = OUT / f"{f.stem}.png"
    if out.exists() and "-f" not in sys.argv: continue
    place(cut(f.stem)).save(out, optimize=True); print("pose", out.name)

# fictional Dato' (half body): cut-out, cropped, plus red/cyan copies for the glitch
d = cut("dato-hartawan"); d = d.crop(d.getbbox()); d.thumbnail((620, 620), Image.LANCZOS)
d.save(OUT / "dato.png", optimize=True)
for nm, col in (("dato-r", (255, 40, 80)), ("dato-c", (0, 220, 255))):
    t = Image.new("RGBA", d.size, col + (0,)); t.putalpha(d.getchannel("A").point(lambda v: v * 0.55)); t.save(OUT / f"{nm}.png")
# fake-Yusuf for the loop ad: same pose cut-out, upper part
y = Image.open(OUT / "yusuf-explain.png"); y = y.crop(y.getbbox()); y = y.crop((0, 0, y.width, int(y.height * 0.62))); y.thumbnail((620, 620)); y.save(OUT / "yusuf-ad.png")
# background plates: overscan for slow push, soft blur + slight darken so characters and cards read
for nm in ("cafe-bg", "studio-bg"):
    im = Image.open(SRC / f"{nm}.png").convert("RGB").resize((1188, 2112), Image.LANCZOS)
    im = im.filter(ImageFilter.GaussianBlur(2.2)); im = ImageEnhance.Brightness(im).enhance(0.82)
    im.save(OUT / f"{nm.replace('-bg', '')}-plate.jpg", quality=88); print("plate", nm)
