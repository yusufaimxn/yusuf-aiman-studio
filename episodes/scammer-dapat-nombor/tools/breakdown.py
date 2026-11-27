"""Write breakdown.json from timing.json (scene times follow the supplied voiceover)."""
import json
from pathlib import Path
EP = Path(__file__).resolve().parents[1]
T = json.load(open(EP / "timing.json"))
META = {
 "hook": ("hook", "Penonton rasa cemas yang sama: scammer tahu nama penuh, dan nak tahu macam mana.", "Panggilan masuk berdering, gelembung 'Hello, Encik Aiman bin Rahman?', jeda (pause), soalan + 3 slot kosong.", ["Dia tahu nama penuh aku?!", "Macam mana scammer dapat nombor kau?"]),
 "leak": ("explain", "Cara 1: kebocoran data telco 2017 (46.2 juta akaun) dan data bocor dijual berulang kali.", "Pelayan telco isometrik retak, fail terbang, kaunter 46,200,000, cip data (No. telefon, No. IC, Alamat, Data kad SIM), carta 46.2 juta vs ~32 juta penduduk, SIM berbilang, kitaran dijual.", ["1 · DATA BOCOR", "2017", "46,200,000", "Sumber: Malay Mail & The Star, Okt 2017", "Penduduk Malaysia (2017) ≈32 juta"]),
 "callerid": ("explain", "Cara 2: app caller ID mengumpul nama dari contact list penggunanya, jadi orang lain boleh nampak nama penuh kita.", "Nama tersembunyi berkocak, 3 telefon kawan → pangkalan nama → kad 'Carian nombor' memaparkan nama penuh.", ["2 · APP CALLER ID", "Pangkalan nama app caller ID", "Carian nombor"]),
 "public": ("example", "Cara 3: kita sendiri kongsi nombor di iklan, group dan borang cabutan bertuah.", "Tiga kad: iklan jual barang, group jual beli, borang 'MENANG iPhone!'; borang dizum dan dicop 'DIKONGSI'.", ["3 · KITA SENDIRI KONGSI", "DIKONGSI"]),
 "tips": ("takeaway", "Tahu nama penuh bukan bukti; letak telefon, call semula nombor rasmi; hilang duit → call 997 (NSRC).", "Persamaan 'Tahu nama penuh ≠ Dari bank atau polis', 3 langkah (letak telefon, call nombor rasmi, Semak Mule), kad 997.", ["Tahu nama penuh kau ≠ Dari bank atau polis", "Semak nombor: Semak Mule", "997 · NSRC"]),
 "loop": ("outro", "Ringkasan 3 cara, lalu telefon berdering semula supaya video berulang ke awal.", "Senarai semak 3 cara, kemudian kad panggilan masuk yang sama seperti frame pertama.", ["3 cara dia dapat nombor kau"]),
}
EMO = {"surprised": "terkejut", "calm": "tenang"}
scenes = []
for s in T["scenes"]:
    p, goal, vis, ost = META[s["id"]]
    dl = [dict(speaker=l["speaker"].lower(), text=l["text"]) for l in T["lines"] if l["n"] in s["lines"]]
    scenes.append(dict(id=s["id"], purpose=p, start_s=s["start"], duration_s=s["duration"], goal=goal, visual=vis,
        environment="studio gradient + grid isometrik (CSS)",
        characters=[dict(name="aiman", expression="neutral (reference)", pose="hands in pockets"), dict(name="yusuf", expression="neutral (reference)", pose="hands in pockets")],
        dialogue=dl, on_screen_text=ost,
        assets=[dict(path="assets/images/aiman.png", status="placeholder"), dict(path="assets/images/yusuf.png", status="placeholder")] +
               [dict(path=l["file"], status="production") for l in T["lines"] if l["n"] in s["lines"]]))
json.dump(dict(slug="scammer-dapat-nombor", total_duration_s=T["total"], scenes=scenes), open(EP / "breakdown.json", "w"), indent=1, ensure_ascii=False)
print("ok", len(scenes))
