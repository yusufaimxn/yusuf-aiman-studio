# Production report: Apa Jadi Kalau Semua Apps Dalam Phone Kau Hilang?

Siri "Apa jadi kalau…?" · #02 · Bahasa Melayu · render 2026-11-28

## Deliverables
| Fail | Spesifikasi |
|---|---|
| `apps-hilang_9x16.mp4` | 1080×1920, 30 fps, H.264 + AAC 48 kHz, 60.4 s, −14.2 LUFS |
| `apps-hilang_cover_9x16.png` | Cover 1080×1920 (frame 0.55 s: tajuk + phone gergasi + Aiman) |
| `apps-hilang.srt` | Sari kata |

## Input
- Skrip: Claude Doc "Skrip & Storyboard #02" versi yang diedit pengguna (10 baris). Suara: 10 MP3 ElevenLabs dari pengguna, dipakai tanpa ubah (hanya senyap hujung dipotong, kenyaringan dinormalkan).
- Gaya baru (arahan pengguna): kebanyakan scene isometric 3D, sedikit conversation, satu konteks, tiada angka/sumber di skrin.
- Scene 3D dibina dalam kod (Three.js r170): `assets/iso/phone.js` (phone gergasi + icon app generik, bilik, exploded view hardware/OS/apps, blok server) + `kit.js` (bandar, orang kecil). Icon app semuanya rekaan generik, bukan logo sebenar.
- Watak 2.5D (pose rujukan pengguna) muncul pada hook, "install balik" dan ending sahaja.

## Fakta (di belakang tabir, tak dipapar)
- OS (Android/iOS) = system software yang urus hardware; apps = application software di atas OS. Buang apps, OS masih boot.
- Phone, Camera, Settings ialah system apps yang datang dengan OS, sebab itu ia kekal dalam cerita.
- Baki bank dan akaun disimpan dalam server syarikat; install semula + login, akaun kembali.
- Had: ayat 09 ("semua akan ada balik") ialah ayat pengguna. Sejarah chat WhatsApp sebenarnya disimpan dalam phone dan cuma kembali kalau ada backup (Google Drive / iCloud). Akaun dan baki bank memang kembali.

## QC (dijalankan pada fail sebenar)
| # | Semakan | Keputusan | Bukti |
|---|---|---|---|
| 1 | `hyperframes check` | LULUS, 0 ralat | amaran tinggal: klip SFX bertindih, safe-zone tajuk & caption |
| 2 | Codec / saiz / fps | LULUS | ffprobe: h264, 1080×1920, 30/1, yuv420p, AAC 48 kHz |
| 3 | Durasi | LULUS | 60.4 s vs 60.36 s dirancang |
| 4 | Sync suara | LULUS | korelasi silang 10 baris: offset maksimum 0 ms |
| 5 | Hitam / beku | LULUS | blackdetect & freezedetect: tiada |
| 6 | Kenyaringan | LULUS | −14.2 LUFS, true peak −1.2 dBTP |
| 7 | Aset hilang | LULUS | render tanpa ralat, semua aset dimuat |
| 8 | Bacaan teks | LULUS | 5 pusingan snapshot + 11 frame render disemak |
| 9 | Framing watak | LULUS | kepala tak terpotong; close-up Aiman pada hook, two-shot pada install balik & ending |
| 10 | Konsistensi watak | LULUS | hanya pose rujukan pengguna dipakai |

## Had yang diketahui
- Durasi 60.4 s (sasaran bawah 60 s): suara sahaja ≈ 49 s; 0.4 s lebihan untuk end card.
- Watak 2.5D tanpa lip-sync. Orang kecil dalam dunia isometric ialah figura generik, bukan Yusuf/Aiman.
- Masa perkataan caption dianggar dari pengesanan senyap.
- Tiada muzik latar berlesen; hanya hum (FFmpeg) + SFX Pixabay.
