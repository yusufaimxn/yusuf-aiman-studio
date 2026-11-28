# Production report: Apa Jadi Kalau Semua Satelit GPS Berhenti Berfungsi?

Siri "Apa jadi kalau…?" · #04 · Bahasa Melayu · render 2026-11-28

## Deliverables
| Fail | Spesifikasi |
|---|---|
| `gps-berhenti_9x16.mp4` | 1080×1920, 30 fps, H.264 + AAC 48 kHz, 72.0 s, −14.2 LUFS |
| `gps-berhenti_cover_9x16.png` | Cover 1080×1920 (frame 0.9 s: tajuk + bumi + satelit) |
| `gps-berhenti.srt` | Sari kata |

## Input
- Skrip: Claude Doc #04 versi yang diedit pengguna (12 baris). Suara: 12 MP3 ElevenLabs dari pengguna, dipakai tanpa ubah (hanya senyap hujung dipotong, kenyaringan dinormalkan).
- Gaya baru (arahan pengguna): hook dibaca Yusuf terus atas 3D isometric, Aiman cuma "Jam?!", Yusuf muncul di skrin hanya di ending; struktur dopamine loop (stakes → soalan → head fake "bukan peta, tapi jam" → re-hook).
- 29 shot kamera dalam 7 dunia isometric 3D yang dibina dalam kod (Three.js r170, `assets/iso/gps.js`): angkasa + bumi, peta dengan titik biru (pecah jadi kepingan), taman perumahan + rider + kereta, laut + kapal, langit + kapal terbang, menara telco/bank/grid elektrik dengan jam, satelit exploded view dengan jam atom. Semua rekaan generik, tiada logo jenama.
- SFX: whoosh setiap cut, power-down satelit, motor, ombak, jet, kaca pecah, tick jam (Pixabay + bunyi yang dijana sendiri dengan FFmpeg).

## Fakta (di belakang tabir, tak dipapar)
- Satelit GPS membawa jam atom dan memancar isyarat bermasa. Phone hanya menerima (tak hantar ke satelit), dengar beberapa satelit dan kira jarak dari beza masa sampai, lalu tentukan lokasi.
- Tanpa GPS, phone masih boleh agak lokasi guna WiFi dan menara telco, kurang tepat: sebab itu titik biru jadi bulatan besar.
- Kapal dan kapal terbang ada navigasi lain (radar, inertial, alat bantu darat, carta), lebih lambat dan manual.
- Rangkaian telco, sistem kewangan dan grid elektrik banyak guna masa GPS untuk sync; mereka ada jam simpanan, jadi kesannya beransur ("lama-lama jam lari").
- Andaian cerita: semua satelit navigasi berhenti. Phone moden juga guna Galileo, BeiDou, GLONASS; kalau GPS saja mati, phone masih boleh guna yang lain.

## QC (dijalankan pada fail sebenar)
| # | Semakan | Keputusan | Bukti |
|---|---|---|---|
| 1 | `hyperframes check` | LULUS, 0 ralat | amaran tinggal: klip SFX bertindih (lint), canvas sampai tepi frame (disengajakan) |
| 2 | Codec / saiz / fps | LULUS | ffprobe: h264, 1080×1920, 30/1, yuv420p, AAC 48 kHz |
| 3 | Durasi | LULUS | 72.0 s vs 71.99 s dirancang |
| 4 | Sync suara | LULUS | korelasi silang 12 baris: offset maksimum 0 ms |
| 5 | Hitam / beku | LULUS | blackdetect & freezedetect: tiada |
| 6 | Kenyaringan | LULUS | −14.2 LUFS, true peak −1.3 dBTP |
| 7 | Aset hilang | LULUS | render tanpa ralat |
| 8 | Bacaan teks | LULUS | 3 pusingan snapshot (38 frame) + 14 frame render disemak |
| 9 | Framing watak | LULUS | satu watak per frame; kepala tak terpotong |
| 10 | Konsistensi watak | LULUS | hanya pose rujukan pengguna dipakai |

## Had yang diketahui
- Durasi 72 s, lebih dari sasaran bawah 1 minit: MP3 yang dibekalkan sahaja ≈ 70 s (ayat diedit jadi lebih panjang dan bacaan perlahan) dan audio tak boleh dipercepat. Untuk bawah 60 s, perlu pendekkan ayat 09, 10, 11 (paling panjang).
- Watak 2.5D tanpa lip-sync. Orang kecil dalam dunia isometric ialah figura generik.
- Masa perkataan caption dianggar dari pengesanan senyap.
- Tiada muzik latar berlesen; hanya hum + SFX.
