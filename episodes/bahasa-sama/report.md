# Production report: Apa Jadi Kalau Semua Developer Guna Bahasa Programming Yang Sama?

Siri "Apa jadi kalau…?" · #05 · Bahasa Melayu · render 2026-11-28

## Deliverables
| Fail | Spesifikasi |
|---|---|
| `bahasa-sama_9x16.mp4` | 1080×1920, 30 fps, H.264 + AAC 48 kHz, 73.7 s, −14.6 LUFS |
| `bahasa-sama_cover_9x16.png` | Cover 1080×1920 (frame 1.0 s: tajuk + empat kiub bahasa) |
| `bahasa-sama.srt` | Sari kata |

## Input
- Skrip: Claude Doc #05 versi yang diedit pengguna (11 baris, Yusuf sahaja). Suara: 11 MP3 ElevenLabs dari pengguna, dipakai tanpa ubah (hanya senyap hujung dipotong, kenyaringan dinormalkan).
- Gaya (arahan pengguna): tiada Aiman; Yusuf suara latar dari frame pertama dan muncul di skrin hanya masa CTA.
- 28 shot kamera dalam 11 dunia isometric 3D yang dibina dalam kod (Three.js r170, `assets/iso/code.js`): kiub bahasa bercantum, office developer, student dengan satu buku, neraca SENANG vs LAJU, litar lumba (lag), phone panas, kod berselirat, bug + bandar merah, toolbox, chip CPU dengan 0/1, corong penterjemah. Nama bahasa sebagai teks biasa, tiada logo rasmi.
- SFX: whoosh setiap cut, pop, thud, sizzle, alarm, kaca pecah, ratchet, impact 0/1 (Pixabay + bunyi yang dijana sendiri dengan FFmpeg).

## Fakta (di belakang tabir, tak dipapar)
- Bahasa dibina untuk tujuan berbeza: C/C++ untuk prestasi dan kawalan hardware, JavaScript ialah bahasa yang browser jalankan untuk web, Python mudah dibaca dan popular untuk data/AI, Java untuk sistem besar dan banyak app Android.
- Ada tukar-ganti antara mudah digunakan dan prestasi; bahasa yang lebih mudah selalunya guna lebih banyak kerja CPU (game lebih perlahan, phone lebih panas). Ini permudahan.
- Jika semua perisian bergantung pada satu bahasa/runtime, satu kelemahan di situ boleh kena semua sistem serentak (risiko monokultur).
- Semua kod akhirnya dijalankan sebagai arahan mesin (binari) oleh CPU, melalui compiler atau interpreter. Nota: bahasa mesin ada beberapa jenis ikut jenis CPU (x86, ARM); video permudahkan jadi "satu bahasa: 0 dan 1".

## QC (dijalankan pada fail sebenar)
| # | Semakan | Keputusan | Bukti |
|---|---|---|---|
| 1 | `hyperframes check` | LULUS, 0 ralat | lint, runtime, layout, motion, craft, audio: 0 ralat |
| 2 | Codec / saiz / fps | LULUS | ffprobe: h264, 1080×1920, 30/1, yuv420p, AAC 48 kHz |
| 3 | Durasi | LULUS | 73.7 s vs 73.63 s dirancang |
| 4 | Sync suara | LULUS | korelasi silang 11 baris: offset maksimum 0 ms |
| 5 | Hitam / beku | LULUS | blackdetect & freezedetect: tiada |
| 6 | Kenyaringan | LULUS | −14.6 LUFS, true peak −1.2 dBTP |
| 7 | Aset hilang | LULUS | render tanpa ralat |
| 8 | Bacaan teks | LULUS | 2 pusingan snapshot (32 frame) + 14 frame render disemak |
| 9 | Framing watak | LULUS | Yusuf seorang, hanya di CTA; kepala tak terpotong |
| 10 | Konsistensi watak | LULUS | hanya pose rujukan pengguna dipakai |

## Had yang diketahui
- Durasi 73.7 s, lebih dari sasaran bawah 1 minit: MP3 yang dibekalkan sahaja ≈ 71 s (ayat diedit jadi lebih panjang dan bacaan santai) dan audio tak boleh dipercepat.
- Watak 2.5D tanpa lip-sync. Orang kecil dalam dunia isometric ialah figura generik.
- Masa perkataan caption dianggar dari pengesanan senyap.
- Tiada muzik latar berlesen; hanya hum + SFX.
