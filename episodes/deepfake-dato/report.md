# Production report: Muka Dia Betul. Tapi Dia Tak Pernah Cakap Benda Ni.

Siri F1 "Aiman Hampir Kena Scam" · Ep 2 · Bahasa Melayu · render 2026-11-27

## Deliverables
| Fail | Spesifikasi |
|---|---|
| `deepfake-dato_9x16.mp4` | 1080×1920, 30 fps, H.264 + AAC 48 kHz, 83.1 s, −14 LUFS |
| `deepfake-dato_cover_9x16.png` | Cover TikTok 1080×1920 (frame 10.9 s: cop PALSU) |
| `deepfake-dato.srt` | Sari kata, ≤ 2 baris × 42 aksara |
(Tiada versi 16:9: short = tegak sahaja, ikut arahan pengguna.)

## Input
- Skrip `script.txt` 13 baris (diluluskan). Suara: 13 MP3 dari ElevenLabs (Yusuf = Shahrul, Aiman = Ashraf), dipakai tanpa ubah; hanya senyap hujung dipotong dan kenyaringan akhir dinormalkan.
- Latar: Café & Studio kosong tegak (ASSET_01/02 dari pengguna), dikaburkan sedikit + digelapkan untuk bacaan grafik. Tech World = grid brand (CSS).
- Watak: 12 pose dari pengguna (Aiman 7, Yusuf 5) dipotong dengan rembg, skala & kedudukan kaki diseragamkan. Dato' Hartawan (ASSET_03, watak rekaan).

## Babak
| # | Babak | Masa | Env |
|---|---|---|---|
| 1 | hook: iklan Dato', pause, MUKA ✓ SUARA ✓, glitch, PALSU | 0.00–12.43 | Café |
| 2 | how: video = bukti?, pipeline deepfake, 6 wajah rekaan | 12.43–29.88 | Tech World |
| 3 | facts: 5 video VIP, 100x, 454 kes, RM2.72 juta | 29.88–46.10 | Tech World |
| 4 | flow: Learn More → borang → app → agent; borang dah dihantar | 46.10–57.22 | Café |
| 5 | tips: 3 tanda bahaya, semak SC/BNM, 997 | 57.22–75.63 | Studio |
| 6 | loop: okay faham → iklan "Yusuf" palsu → CTA share | 75.63–83.02 | Café |

## Aset dan status
| Aset | Status |
|---|---|
| Pose Yusuf/Aiman, latar Café/Studio, Dato' Hartawan | Production (dari pengguna) |
| Grafik (telefon iklan, pipeline AI, kad data, carta aliran, kad SC/BNM/997) | Production: HTML/SVG token brand |
| SFX | Pixabay Content License (pakej sama Ep 1) |
| Muzik latar | TIADA (tiada sumber berlesen di sini). Tambah lagu dalam app TikTok. |
| "AI Profit Rasmi", Dato' Hartawan, angka RM500→RM5,000 | Rekaan; dilabel "CONTOH · BUKAN VIDEO SEBENAR" |

## Fakta & sumber
- PDRM kesan 5 video deepfake VIP, janji pulangan sampai 100x: The Star/Bernama, 12 Mac 2025.
- Aliran Learn More → borang → app → agent minta transfer; AI lip-sync: SC media release, 22 Jul 2024.
- 2024: 454 kes, RM2.72 juta (CCID): Malay Mail, 4 Ogos 2025.
- SC Investor Alert List & BNM Financial Consumer Alert List: amaran BNM/SC, The Vibes 14 Okt 2026.
- 997 = NSRC: malaysia.gov.my.

## QC (dijalankan pada fail sebenar)
| # | Semakan | Keputusan | Bukti |
|---|---|---|---|
| 1 | Skema episod | LULUS | `validate_episode.py` → OK |
| 2 | `hyperframes check` (lint, runtime, layout, contrast, craft, audio) | LULUS, 0 ralat | amaran tinggal: teks kecil di UI telefon (hiasan), klip SFX bertindih (disengajakan) |
| 3 | Codec / saiz / fps | LULUS | ffprobe: h264, 1080×1920, 30/1, yuv420p, AAC 48 kHz |
| 4 | Durasi | LULUS | 83.10 s vs 83.02 s dirancang (≤ 0.1 s) |
| 5 | Sync suara | LULUS | korelasi silang 13 baris: offset maksimum 0 ms |
| 6 | Hitam / beku | LULUS | blackdetect & freezedetect: tiada |
| 7 | Kenyaringan | LULUS | −14.1 LUFS, true peak −1.3 dBTP |
| 8 | Aset hilang | LULUS | semua aset dalam breakdown wujud |
| 9 | Bacaan teks & kedudukan | LULUS | 25 frame disemak secara visual; caption tidak bertindih grafik |
| 10 | Konsistensi watak | LULUS | hanya render rujukan pengguna dipakai, tiada lukisan semula |

## Had yang diketahui
- Watak 2.5D: pose bertukar (squash-pop) dan badan "hop" ikut frasa; tiada lip-sync kerana imej pegun.
- Masa perkataan caption dianggar dari pengesanan senyap (model transkripsi disekat di sini).
- Dato' Hartawan dalam aset pengguna nampak seiras gaya Yusuf (rambut, janggut). Dilabel jelas sebagai contoh rekaan.
