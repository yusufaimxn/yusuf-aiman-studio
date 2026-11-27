"""Write breakdown.json from timing.json (scene times follow the supplied voiceover)."""
import json
from pathlib import Path
EP = Path(__file__).resolve().parents[1]
T = json.load(open(EP / "timing.json"))
META = {
 "hook": ("hook", "Iklan video Dato' (rekaan) janji RM500 jadi RM5,000; Yusuf pause: muka & suara betul, tapi dia tak pernah cakap.", "Telefon iklan video berlabel CONTOH, pause, tag MUKA/SUARA, glitch RGB, cop PALSU.", ["Labur RM500, dapat RM5,000?!", "Muka betul. Suara betul.", "Tapi dia tak pernah cakap benda ni.", "CONTOH · BUKAN VIDEO SEBENAR"]),
 "how": ("explain", "Deepfake: AI belajar dari video & suara sedia ada, jana mulut & suara baru ikut skrip scammer; sesiapa pun boleh dipalsukan.", "Kad 'Video = bukti?', pipeline input → cip AI + mesh wajah → video output dengan mulut & suara baru, kad skrip scammer, grid 6 wajah rekaan bercakap.", ["Video = bukti? Belum tentu.", "APA ITU DEEPFAKE", "Sesiapa pun boleh dipalsukan"]),
 "facts": ("explain", "PDRM kesan 5 video deepfake VIP janji untung sampai 100x; 2024: 454 kes, RM2.72 juta.", "Kad polis + 5 jubin VIP cop PALSU, 100x, kaunter 454, kad RM2.72 juta, sumber.", ["Polis kesan 5 video deepfake orang kenamaan", "100x", "TAHUN 2024", "454 kes penipuan deepfake", "RM2.72 juta"]),
 "flow": ("explain", "Aliran scam: Learn More → borang → download app → agent minta transfer; Aiman dah isi borang.", "Carta aliran 4 nod, nod agent merah berdenyut, cop SUDAH DIHANTAR pada borang.", ["MACAM MANA DIA TIPU", "Tekan Learn More", "Isi borang", "Download app", "Agent call"]),
 "tips": ("takeaway", "3 tanda bahaya, jangan percaya muka, semak SC Investor Alert List & BNM Financial Consumer Alert List, 997 jika hilang duit.", "3 kad tanda bahaya, tajuk semak, 2 kad semakan, kad 997 NSRC.", ["3 TANDA BAHAYA", "Jangan percaya muka. Semak syarikat dulu.", "SC Investor Alert List", "BNM Financial Consumer Alert List", "997 NSRC"]),
 "loop": ("outro", "Aiman faham, lalu iklan sama muncul dengan 'Yusuf' palsu; CTA share.", "Okay faham, telefon iklan (Yusuf, label CONTOH), glitch, CTA share.", ["Okay, faham!", "Eh, ni video Yusuf pulak?!", "SHARE kat group family"]),
}
EMO = {"surprised": "terkejut", "calm": "tenang"}
scenes = []
for s in T["scenes"]:
    p, goal, vis, ost = META[s["id"]]
    dl = [dict(speaker=l["speaker"].lower(), text=l["text"]) for l in T["lines"] if l["n"] in s["lines"]]
    scenes.append(dict(id=s["id"], purpose=p, start_s=s["start"], duration_s=s["duration"], goal=goal, visual=vis,
        environment={"hook":"07 Café","how":"10 Tech World (grid)","facts":"10 Tech World (grid)","flow":"07 Café","tips":"01 Main Studio","loop":"07 Café"}[s["id"]],
        characters=[dict(name="aiman", pose="pose library (see compositions/cast.html)"), dict(name="yusuf", pose="pose library (see compositions/cast.html)")],
        dialogue=dl, on_screen_text=ost,
        assets=[dict(path=str(x.relative_to(EP)), status="production") for x in sorted((EP / "assets/images").glob("*.png"))] +
               [dict(path=l["file"], status="production") for l in T["lines"] if l["n"] in s["lines"]]))
json.dump(dict(slug="deepfake-dato", total_duration_s=T["total"], scenes=scenes), open(EP / "breakdown.json", "w"), indent=1, ensure_ascii=False)
print("ok", len(scenes))
