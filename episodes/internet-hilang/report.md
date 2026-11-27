# Production report: Apa Jadi Kalau Internet Hilang Dari Bumi?

Siri "Apa jadi kalau…?" · #1 · Bahasa Melayu · render 2026-11-27

## Deliverables
| Fail | Spesifikasi |
|---|---|
| `internet-hilang_9x16.mp4` | 1080×1920, 30 fps, H.264 + AAC 48 kHz, 110.9 s, −14.2 LUFS |
| `internet-hilang_cover_9x16.png` | Cover 1080×1920 (frame 7.6 s: tajuk + Yusuf & Aiman) |
| `internet-hilang.srt` | Sari kata |
(Short = tegak sahaja.)

## Input
- Skrip: Claude Doc "Script & Storyboard" versi yang diedit pengguna (16 baris). Suara: 16 MP3 ElevenLabs dari pengguna, dipakai tanpa ubah (hanya senyap dipotong, kenyaringan dinormalkan).
- Watak: pose rujukan pengguna (cut-out rembg). Latar kafe dari pengguna.
- Scene isometric 3D: dibina dalam kod (Three.js r170, `assets/iso/kit.js` boleh guna semula): kedai mamak, jalan & bandar, lapangan terbang, gudang, pasar raya, "migrasi" ke Telegram (ikon generik, bukan logo sebenar), laut + kabel, jerung, kapal & sauh.

## Fakta & sumber
- Outage 4 Okt 2021 ≈ 6 jam, 3.5 bilion pengguna: Reuters/The Star 6 Okt 2021; punca BGP/DNS: Meta Engineering 5 Okt 2021.
- +70 juta pengguna baru Telegram: dakwaan Pavel Durov (dilabel "menurut pengasas Telegram").
- >99% data antara benua lalu kabel bawah laut: TeleGeography 2023.
- Saiz ≈ hos paip; 0 kes gigitan ikan/jerung 2007–2014; ≈2/3 kerosakan dari bot nelayan & sauh: TeleGeography FAQ (data ICPC).
- Fasa "Sehari" dan "Seminggu" ialah senario (dilabel SENARIO di skrin), bukan peristiwa sebenar.

## QC (dijalankan pada fail sebenar)
| # | Semakan | Keputusan | Bukti |
|---|---|---|---|
| 1 | `hyperframes check` | LULUS, 0 ralat | amaran tinggal: klip SFX bertindih, safe-zone counter/caption |
| 2 | Codec / saiz / fps | LULUS | ffprobe: h264, 1080×1920, 30/1, yuv420p, AAC 48 kHz |
| 3 | Durasi | LULUS | 110.9 s vs 110.85 s dirancang |
| 4 | Sync suara | LULUS | korelasi silang 16 baris: offset maksimum 0 ms |
| 5 | Hitam / beku | LULUS | blackdetect & freezedetect: tiada |
| 6 | Kenyaringan | LULUS | −14.2 LUFS, true peak −1.2 dBTP |
| 7 | Aset hilang | LULUS | semua aset dimuat (render tanpa ralat) |
| 8 | Bacaan teks | LULUS | 3 pusingan snapshot + 16 frame render disemak |
| 9 | Framing watak | LULUS | kepala tak terpotong, zoom pada yang bercakap, two-shot bila berbual |
| 10 | Konsistensi watak | LULUS | hanya pose rujukan pengguna dipakai |

## Had yang diketahui
- Watak 2.5D tanpa lip-sync (imej pegun, pose bertukar ikut frasa).
- Masa perkataan caption dianggar dari pengesanan senyap.
- Tiada muzik latar berlesen; hanya hum/underwater (dijana FFmpeg) + SFX Pixabay. Tambah lagu dalam app TikTok jika mahu.
- Scene 3D ialah low-poly buatan kod, render CPU (~27 min untuk video penuh).
