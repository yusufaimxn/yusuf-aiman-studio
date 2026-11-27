# Storyboard: Macam mana scammer dapat nombor telefon kau

Tegak 1080×1920, 30 fps (landscape 1920×1080 dijana daripada susun atur yang sama). Masa ialah **anggaran** (~150 patah/minit); selepas MP3 masuk, setiap babak ikut tempoh audio sebenar.
Watak: 2.5D cut-out dari spec terkunci. Ekspresi baru (terkejut, keliru) belum ada sebagai aset produksi, jadi akan ditanda placeholder dalam laporan jika belum siap.

| Babak | Baris | Anggaran | Tujuan | Visual |
|---|---|---|---|---|
| 1 hook | 01–02 | 0–7 s | hook | Tiada logo. Telefon Aiman berdering penuh skrin, caller "Nombor tak dikenali". Teks besar: **"DIA TAHU NAMA PENUH AKU?!"** Aiman terkejut (zoom-in kamera cepat). Yusuf masuk dari kanan, tangan "pause", skrin beku, kesan "rewind" ringkas. |
| 2 leak | 03–05 | 7–25 s | explain | Kad nombor **1 · DATA BOCOR**. Ikon pelayan telco isometrik retak, fail mengalir keluar. Kaunter animasi 0 → **46,200,000** dengan label "2017". Baris 04: Aiman di sebelah grafik penduduk "~32 juta"; baris 05: satu orang dengan 3 kad SIM, kemudian fail data berpindah tangan berulang (gelung anak panah). |
| 3 callerid | 06–07 | 25–37 s | explain | Kad **2 · APP CALLER ID**. Diagram: banyak telefon hantar contact list → satu pangkalan data → skrin telefon scammer keluar "AIMAN BIN ..." (nama dikaburkan, rekaan). Kawan Aiman save kontak "Aiman (nama penuh)". |
| 4 public | 08–09 | 37–46 s | example | Kad **3 · KITA SENDIRI KONGSI**. Tiga panel muncul berturutan: iklan jual barang dengan nombor, post group Facebook, borang "Menang iPhone!". Baris 09: Aiman muka bersalah, borang itu bergoyang. |
| 5 tips | 10–11 | 46–58 s | takeaway | Teks: **"Tahu nama penuh ≠ bank / polis"**. Ikon letak telefon → dail nombor rasmi. Kad tambahan kecil: "Semak nombor: Semak Mule (PDRM)". Baris 11: kad besar **997 · NSRC** berdenyut biru #0066DE. |
| 6 loop | 12 | 58–63 s | outro | Aiman lega, kemudian telefon berdering semula: potong terus ke rangka pembukaan supaya video berulang. Caption soalan komen. |

## Aset diperlukan
| Aset | Status |
|---|---|
| Yusuf & Aiman 2.5D (neutral, tunjuk, pause) | ikut pipeline watak semasa; ekspresi baru = placeholder sehingga siap |
| UI telefon panggilan masuk, kad nombor, kaunter, ikon SIM, pelayan, pangkalan data | dibina dalam SVG/HTML (brand tokens) |
| Persekitaran: studio utama, latar isometrik ringkas | plate Blender sedia ada atau latar gradien brand |
| SFX: deringan, whoosh, rewind, pop | perlu sumber berlesen (belum ada) |
| Suara 01–12 | menunggu MP3 dari ElevenLabs |

## Nota ketepatan
Nama pada skrin scammer adalah rekaan dan dikaburkan. Tiada logo telco, bank atau app sebenar dipaparkan.
