# Production report: Apa Jadi Kalau Semua Website Dunia Down?

Siri "Apa jadi kalau…?" · #03 · Bahasa Melayu · render 2026-11-28

## Deliverables
| Fail | Spesifikasi |
|---|---|
| `website-down_9x16.mp4` | 1080×1920, 30 fps, H.264 + AAC 48 kHz, 71.9 s, −14.4 LUFS |
| `website-down_cover_9x16.png` | Cover 1080×1920 (frame 1.0 s: tajuk + dinding website + WiFi penuh + Aiman) |
| `website-down.srt` | Sari kata |

## Input
- Skrip: Claude Doc "#03" versi yang diedit pengguna (12 baris). Suara: 12 MP3 ElevenLabs dari pengguna, dipakai tanpa ubah (hanya senyap hujung dipotong, kenyaringan dinormalkan).
- Struktur: akibat dulu (Google, shopping, student portal, office, apps dalam phone), kemudian sebab di hujung (request → buku alamat → ketuk pintu server → server tak jawab → Error), tutup dengan analogi jalan = internet, kedai = website.
- Scene isometric 3D dibina dalam kod (Three.js r170): `assets/iso/web.js` (dinding browser, bandar, search, troli, meja student, office, perjalanan request ke DNS dan server, jalan dengan kedai bertutup) + kit phone dari ep #02. Semua logo/website rekaan generik.
- Satu watak per frame (arahan pengguna): Aiman close-up pada hook, "apasal apps pun kena?" dan "ibarat jalan…"; Yusuf close-up pada ending. Tiada two-shot.

## Fakta (di belakang tabir, tak dipapar)
- Browser/app hantar request: cari alamat IP melalui DNS ("buku alamat"), kemudian sambung ke server dan minta kandungan (HTTP).
- Banyak apps dalam phone guna API/server web yang sama, jadi bila server web down, apps itu pun gagal walaupun internet ada.
- Kalau server tak jawab, browser hanya boleh tunjuk mesej ralat (timeout / tak dapat sambung).
- Analogi internet = jalan, website = kedai ialah permudahan; sambungan masih elok, cuma destinasi tak melayan.

## QC (dijalankan pada fail sebenar)
| # | Semakan | Keputusan | Bukti |
|---|---|---|---|
| 1 | `hyperframes check` | LULUS, 0 ralat | amaran tinggal: klip SFX bertindih, safe-zone tajuk & caption |
| 2 | Codec / saiz / fps | LULUS | ffprobe: h264, 1080×1920, 30/1, yuv420p, AAC 48 kHz |
| 3 | Durasi | LULUS (catatan) | 71.9 s vs 71.8 s dirancang (beza 0.1 s, pembundaran frame) |
| 4 | Sync suara | LULUS | korelasi silang 12 baris: offset maksimum 0 ms |
| 5 | Hitam / beku | LULUS | blackdetect & freezedetect: tiada |
| 6 | Kenyaringan | LULUS | −14.4 LUFS, true peak −1.2 dBTP |
| 7 | Aset hilang | LULUS | render tanpa ralat, semua aset dimuat |
| 8 | Bacaan teks | LULUS | snapshot + 14 frame render disemak (contact sheet) |
| 9 | Framing watak | LULUS | satu watak per frame, kepala tak terpotong, shade gelap bawah |
| 10 | Konsistensi watak | LULUS | hanya pose rujukan pengguna dipakai |

## Had yang diketahui
- Durasi 71.9 s, lebih dari sasaran bawah 1 minit: suara yang dibekalkan sahaja ≈ 70 s (baris skrip diedit jadi lebih panjang) dan audio tak boleh dipercepat. Untuk bawah 60 s, perlu pendekkan/buang baris (cadangan: 05 office atau 09 biasa).
- Watak 2.5D tanpa lip-sync. Orang kecil dalam dunia isometric ialah figura generik.
- Masa perkataan caption dianggar dari pengesanan senyap.
- Tiada muzik latar berlesen; hanya hum (FFmpeg) + SFX Pixabay.
