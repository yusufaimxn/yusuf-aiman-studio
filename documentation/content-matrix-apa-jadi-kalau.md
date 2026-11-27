# Content Matrix #2 — "Apa Jadi Kalau…?" (Tech Escalation Stories)

Yusuf & Aiman · *Technology, Made Understandable.* · Disediakan 27 Nov 2026
Fokus: tech umum (network, software, hardware, database, AI, infrastruktur). **Bukan cybersecurity.**

---

## 1. Kenapa format ni susah nak skip

| Prinsip | Cara kita guna |
|---|---|
| **Open loop** | Hook tanya soalan besar, jawapan penuh hanya di fasa akhir. |
| **Eskalasi masa** | Setiap fasa (Minit 1 → Jam 1 → Hari 1 → Minggu 1 → Bulan 1) lebih teruk / lebih pelik dari sebelumnya. |
| **Cliffhanger setiap fasa** | Ayat terakhir setiap fasa = teaser fasa seterusnya ("Tapi tu belum apa-apa. Hari ketiga…"). |
| **"Ni pernah jadi betul"** | Setiap senario dipaku pada **kejadian sebenar** (outage, bug, kebakaran). Ini yang buat orang terkejut dan percaya, dan elak kita reka cerita. |
| **Relate dulu, teknikal kemudian** | Mulakan dengan benda harian (WhatsApp, Waze, ATM, TikTok), baru buka "kenapa" teknikal. |
| **Twist di hujung** | Fasa akhir beri satu fakta yang orang tak sangka (contoh: GPS sebenarnya jam, bukan peta). |

**Peraturan fakta (wajib):** fasa yang berdasarkan kejadian sebenar sebut sumbernya. Fasa yang andaian (spekulasi "kalau berlaku hari ini") mesti dibingkaikan sebagai senario, contoh *"Kalau ikut apa yang jadi masa outage 2021…"*. Angka disahkan semula masa tulis skrip (proposal stage).

## 2. Format siri

| Kod | Siri | Struktur fasa | Durasi |
|---|---|---|---|
| **W1** | **Apa Jadi Kalau…?** | Garis masa: Minit 1 → Jam 1 → Hari 1 → Minggu 1 → (Bulan 1) | 60–90 s |
| **W2** | **Satu Kesilapan Kecil** | Kiraan detik/jam selepas satu bug/kesilapan kecil ("Saat 0… Saat 37… BOOM") | 45–75 s |
| **W3** | **Hari Bila ___ Mati** | Kisah benar outage besar, diceritakan ikut jam (jam 1, jam 3, jam 6…) | 60–90 s |
| **W4** | **Perjalanan 1 Saat** | Ikut perjalanan data dalam milisaat (tekan Send → sampai) | 45–60 s |

Peranan watak: **Aiman** = orang biasa yang panik/tertanya ("Habis tu ATM macam mana?!"), **Yusuf** = narrator tenang yang buka fasa seterusnya.

## 3. Pillar (agihan)

| Pillar | % | Contoh |
|---|---|---|
| Network & Internet | 25% | internet hilang, kabel dasar laut, WhatsApp down |
| Software & Bug | 25% | Y2K38, CrowdStrike, left-pad, Ariane 5 |
| Infrastruktur & Angkasa | 20% | GPS, solar storm, blackout, data centre terbakar |
| Database & Data | 15% | GitLab delete DB, Excel hilangkan 16,000 kes |
| AI | 10% | AI reka kes mahkamah, chatbot buat polisi sendiri |
| Hardware & Cip | 5% | cip hilang, peranan Malaysia |

---

## 4. Content Matrix

Priority: **P0** = buat dulu (hook paling kuat + fakta paling kukuh), **P1** = kuat, **P2** = simpanan.
Viral = anggaran potensi (★1–5) berdasarkan relatability + elemen terkejut, bukan data.

| # | Tajuk / Hook | Pillar | Format | Fasa ringkas | Anchor fakta sebenar | Viral | Priority |
|---|---|---|---|---|---|---|---|
| 1 | **"Apa jadi kalau internet hilang dari bumi?"** | Network | W1 | Minit 1: WhatsApp, TikTok, DuitNow mati → Jam 1: kedai tak boleh terima bayaran → Hari 1: kapal terbang, logistik lambat → Minggu 1: barang dapur kurang → Twist: internet sebenarnya kabel bawah laut, bukan "awan" | Outage Facebook/WhatsApp/IG 4 Okt 2021 (~6 jam, punca BGP); Telegram dapat 70 juta pengguna baru dalam sehari; kabel dasar laut bawa >99% trafik antarabenua | ★★★★★ | **P0** |
| 2 | **"Ada satu tarikh komputer seluruh dunia boleh 'balik ke tahun 1901'"** (Y2K38) | Software | W1 (countdown) | Hari ni: kenapa nombor 2,147,483,647 → 11:14:07 pagi, 19 Jan 2038 (waktu Malaysia) → saat seterusnya jam sistem lama jadi 13 Dis 1901 → apa yang boleh terjejas (sistem lama, embedded) → Twist: nombor sama pernah "pecahkan" YouTube (Gangnam Style 2014) & buat Boeing 787 kena restart setiap 248 hari | 32-bit Unix time overflow 03:14:07 UTC 19 Jan 2038; Gangnam Style perlukan counter 64-bit (Dis 2014); FAA Airworthiness Directive 2015 (787, 248 hari) | ★★★★★ | **P0** |
| 3 | **"Satu update software matikan 8.5 juta komputer dalam satu pagi"** | Software | W3 | Minit 1: skrin biru (BSOD) → Jam 1: lapangan terbang, bank, hospital lumpuh → Hari 1: penerbangan dibatalkan → Minggu 1: Delta masih tak pulih, rugi USD500 juta → Twist: hanya <1% komputer Windows dunia | CrowdStrike, 19 Jul 2024; Microsoft anggar 8.5 juta peranti; Delta CEO: kos ~USD500 juta | ★★★★★ | **P0** |
| 4 | **"Apa jadi kalau GPS hilang? Bukan setakat Waze sesat…"** | Infrastruktur | W1 | Minit 1: Waze, Grab, food delivery sesat → Jam 1: kapal & kapal terbang guna backup → Hari 1: rangkaian telco & bank terganggu sebab GPS bagi **masa** tepat → Twist: jam satelit GPS lari 38 mikrosaat/hari sebab teori relativiti Einstein; tanpa betulkan, lokasi silap ~10 km sehari | NIST/RTI (2019): GPS hilang ≈ USD1 bilion/hari di AS; UK London Economics (2017): £5.2 bilion untuk 5 hari; Physics Today: relativiti & GPS | ★★★★★ | **P0** |
| 5 | **"Engineer ni terdelete database company, live depan dunia"** | Database | W3 | Jam 0: penat, taip arahan delete di server salah → Saat ke-…: 300GB hilang → Jam 1: 5 cara backup semua gagal → Jam 6+: selamat sebab satu salinan "terkebetulan" → Twist: GitLab streaming live proses recovery di YouTube | GitLab.com, 31 Jan 2017, postmortem rasmi GitLab | ★★★★☆ | **P0** |
| 6 | **"Apa jadi kalau WhatsApp hilang sehari?"** (kisah Korea) | Network | W1 + W3 | Jam 1: tak boleh chat → Jam 3: teksi (Kakao T), bayaran (Kakao Pay) pun mati → Hari 1: negara "beku" → Hari 2: CEO letak jawatan → Twist: semua sebab SATU data centre terbakar | Kebakaran data centre SK C&C Pangyo, 15 Okt 2022; KakaoTalk (≈90% rakyat Korea guna) down >10 jam, pulih penuh ~2 hari; co-CEO letak jawatan | ★★★★★ | P1 |
| 7 | **"Apa jadi kalau satu negara blackout serentak?"** | Infrastruktur | W3 | Minit 1: lampu isyarat, MRT/metro berhenti → Jam 1: ATM & kad tak boleh guna, orang beratur beli radio → Malam: gelap gelita → Hari 2: siasatan → Twist: punca bukan serangan, tapi "overvoltage" berantai | Blackout Iberia (Sepanyol & Portugal), 28 Apr 2025; laporan kerajaan Sepanyol (Jun 2025) & ENTSO-E: pelbagai faktor teknikal, bukan cyberattack | ★★★★☆ | P1 |
| 8 | **"Apa jadi kalau ribut matahari 1859 berlaku hari ini?"** | Infrastruktur | W1 | 1859: wayar telegraf keluar percikan api, operator boleh hantar mesej walaupun bateri dicabut → 1989: Quebec gelap 9 jam → 2022: Starlink hilang ~40 satelit → Hari ini: senario grid & satelit → Twist: aurora boleh nampak dekat khatulistiwa | Carrington Event 1859 (NOAA); blackout Quebec 13 Mac 1989; Starlink Feb 2022; Lloyd's (2013): kos AS USD0.6–2.6 trilion | ★★★★☆ | P1 |
| 9 | **"Kalau Google down 5 minit, internet dunia jadi apa?"** | Network | W2 | Minit 1: Google, YouTube, Gmail mati → Minit 2: trafik internet global jatuh 40% → Minit 5: kembali → Twist: separuh internet "bergantung" pada satu syarikat | Google outage 16 Ogos 2013, GoSquared: trafik global jatuh ~40% | ★★★★☆ | P1 |
| 10 | **"Kabel bawah laut putus. Satu negara terputus dari dunia 5 minggu"** | Network | W1 | Hari 1: tsunami/gunung berapi → Minggu 1: bank, kerajaan guna satelit kecil → Minggu 5: kabel dibaiki → Bonus: 2024 kabel Laut Merah rosak kena sauh kapal → Twist: kapal baiki kabel cuma beberapa puluh buah sedunia (sahkan angka) | Tonga, letusan Hunga Tonga Jan 2022; kabel Laut Merah Feb–Mac 2024 (Fortune, Cloudflare) | ★★★★☆ | P1 |
| 11 | **"11 baris code dipadam. Separuh internet developer rosak"** | Software | W2 | Minit 0: developer marah, padam package → Jam 1: ribuan projek (termasuk React/Babel) gagal build → Jam 2: npm buat keputusan luar biasa, pulihkan package → Twist: dunia software dibina atas "lego" orang lain | npm left-pad, 22 Mac 2016 | ★★★★☆ | P1 |
| 12 | **"Excel hilangkan 16,000 pesakit COVID"** | Database | W3 | Hari 1: data masuk Excel → Hari 7: angka pelik rendah → Hari 8: rupanya fail format lama had 65,536 baris → Twist: Excel bukan database | Public Health England, Okt 2020; ~16,000 kes tak dilaporkan (fail .XLS) | ★★★★☆ | P1 |
| 13 | **"Roket USD370 juta meletup dalam 37 saat sebab satu nombor"** | Software | W2 | Saat 0: lancar → Saat 36: nombor terlalu besar untuk "kotak" 16-bit → Saat 37: roket pusing & musnah → Bonus: NASA hilang kapal Mars USD125 juta sebab salah unit (pound vs newton) | Ariane 5 Flight 501, 4 Jun 1996 (laporan inkuiri); Mars Climate Orbiter 1999 (NASA JPL) | ★★★★☆ | P1 |
| 14 | **"Apa jadi kalau AI tak pernah wujud? Sehari dalam hidup kau"** | AI | W1 (pagi → malam) | 7 pagi: face unlock tak jalan → 8 pagi: inbox penuh spam → 9 pagi: Waze tak tahu jam sesak → Malam: FYP TikTok rawak → Twist: kau guna AI ratusan kali sehari tanpa sedar | Contoh AI harian (spam filter, ETA peta, recommendation, autocorrect) — sahkan angka spesifik dari sumber rasmi Google/Meta masa skrip | ★★★★☆ | P1 |
| 15 | **"Apa jadi kalau kau percaya AI 100%?"** | AI | W3 | Hari 1: lawyer guna ChatGPT cari kes → Minggu 1: hakim cari kes tu, tak wujud → Bulan 1: didenda USD5,000 → Bonus: chatbot Air Canada "reka" polisi, syarikat kena bayar → Twist: AI boleh *hallucinate* dengan yakin | Mata v. Avianca (SDNY, Jun 2023); Moffatt v. Air Canada (BC CRT, Feb 2024) | ★★★★☆ | P1 |
| 16 | **"Apa jadi kalau cip hilang? Malaysia sebenarnya 'kilang rahsia' dunia"** | Hardware | W1 | Minggu 1: kereta baru tak boleh siap → Bulan 1: harga console/phone naik → 2021: industri kereta rugi USD210 bilion → Twist: Malaysia pegang ~13% pasaran pemasangan & ujian cip dunia | AlixPartners (Sept 2021); MIDA/BNM: Malaysia ~13% global ATP | ★★★☆☆ | P1 |
| 17 | **"Satu saat 'tambahan' pernah crash Reddit & sistem airline"** | Software | W2 | 23:59:59 → 23:59:60 (saat yang pelik) → server Reddit, sistem check-in airline jammed → 2017 Cloudflare DNS tergendala → Twist: dunia setuju buang leap second menjelang 2035 | Leap second 30 Jun 2012; Cloudflare postmortem 1 Jan 2017; CGPM 2022 (sahkan sumber masa skrip) | ★★★☆☆ | P2 |
| 18 | **"Data centre terbakar. 3.6 juta website hilang"** | Infrastruktur | W3 | Jam 0: api di Strasbourg → Jam 3: satu bangunan musnah → Hari 1: website, game server hilang → Twist: "cloud" tu sebenarnya bangunan fizikal | OVHcloud SBG2, 10 Mac 2021; Netcraft: 3.6 juta laman web | ★★★☆☆ | P2 |
| 19 | **"Apa jadi bila kau tekan Send kat WhatsApp?"** | Network | W4 | 0 ms: mesej dienkripsi → 10 ms: ke tower → 50 ms: fiber/kabel → 100+ ms: server → sampai → Twist: mesej kau mungkin lalu bawah laut | Penerangan umum rangkaian; angka milisaat = anggaran, label "lebih kurang" | ★★★☆☆ | P2 |
| 20 | **"Apa jadi kalau internet laju macam 1999 (56k)?"** | Network | W1 | Video TikTok 15MB = ~35 minit nak load → gambar IG keluar baris demi baris → Twist: phone kau hari ni ~ribuan kali lebih laju | Pengiraan: 56 kbps ≈ 7 KB/s (andaian, tunjuk kira) | ★★★☆☆ | P2 |

---

## 5. Top 5 — pecahan fasa terperinci

### #1 Apa jadi kalau internet hilang dari bumi? (W1, ~80 s)
- **Hook (0–3 s):** Aiman: "Kalau internet hilang sekarang, benda pertama yang mati bukan TikTok."
- **Minit 1:** WhatsApp, TikTok, Gmail senyap. Aiman ingat WiFi rumah rosak.
- **Jam 1:** QR & kad tak boleh. Kedai minta tunai. *Anchor:* 2021 WhatsApp/FB/IG hilang 6 jam, Telegram dapat 70 juta pengguna sehari.
- **Hari 1:** Sistem tempahan penerbangan, logistik, gudang bergantung pada rangkaian. *(senario, rujuk impak CrowdStrike 2024)*
- **Minggu 1:** rantaian bekalan perlahan, rak kedai mula kosong. *(senario, label jelas)*
- **Twist:** "Internet bukan awan. Lebih 99% data antara benua lalu kabel bawah laut sebesar hos."
- **Loop ending:** "Nak tahu apa jadi bila kabel tu betul-betul putus? Part 2."

### #2 19 Januari 2038, jam 11:14:07 pagi (W1 countdown, ~70 s)
- **Hook:** Yusuf: "Ada satu saat dalam masa depan yang boleh buat komputer ingat sekarang tahun 1901."
- **Fasa 1:** komputer kira masa dalam saat sejak 1 Jan 1970.
- **Fasa 2:** sistem 32-bit maksimum 2,147,483,647.
- **Fasa 3:** 19 Jan 2038 03:14:07 UTC (11:14:07 pagi Malaysia) → saat seterusnya jam jadi 13 Dis 1901.
- **Fasa 4 (bukti nombor ni berbahaya):** Gangnam Style 2014 lepas had counter YouTube; Boeing 787 FAA arah restart setiap 248 hari.
- **Twist/akhir:** kebanyakan sistem moden dah 64-bit, tapi sistem lama & embedded masih risiko. (Jangan buat panik palsu.)

### #3 Satu update matikan 8.5 juta komputer (W3, ~75 s)
- Minit 1 BSOD → Jam 1 lapangan terbang tulis boarding pass guna tangan → Hari 1 ribuan penerbangan batal → Minggu 1 Delta rugi ~USD500 juta → Twist: itu cuma <1% komputer Windows dunia. Fokus: konsep "update" & "kernel" secara mudah, bukan aspek keselamatan.

### #4 Apa jadi kalau GPS hilang? (W1, ~75 s)
- Minit 1 Waze/Grab sesat → Jam 1 kapal & pesawat backup → Hari 1 telco & bank sebab GPS = jam paling tepat → Twist: relativiti Einstein, 38 µs/hari, ~10 km sehari kalau tak dibetulkan. Angka ekonomi: ~USD1 bilion/hari (AS).

### #5 Engineer terdelete database live (W3, ~75 s)
- Malam lewat, engineer penat → arahan delete di server production (bukan backup) → stop selepas ~300GB hilang → 5 kaedah backup tak berfungsi → selamat dari salinan staging 6 jam lepas → GitLab streaming recovery live. Pengajaran: backup yang tak pernah diuji = tiada backup.

---

## 6. Jadual cadangan (4 short seminggu)

| Minggu | Video |
|---|---|
| 1 | #1 Internet hilang · #3 CrowdStrike · #2 Y2K38 · #9 Google 5 minit |
| 2 | #4 GPS · #5 GitLab · #6 Kakao · #11 left-pad |
| 3 | #7 Blackout · #13 Ariane 5 · #15 AI percaya 100% · #10 Kabel putus (Part 2 #1) |
| 4 | #8 Solar storm · #12 Excel · #14 AI tak wujud · #16 Cip Malaysia |

Siri bersambung: #1 → #10 (kabel), #2 → #17 (leap second), #3 → #11 (left-pad) untuk tarik penonton ke video seterusnya.

## 7. Sumber (disemak 27 Nov 2026)

- Facebook outage 2021 & Telegram 70 juta: [The Star](https://www.thestar.com.my/tech/tech-news/2021/10/06/telegram-founder-says-over-70-million-new-users-joined-during-facebook-outage), [BleepingComputer](https://www.bleepingcomputer.com/news/technology/facebook-outage-leads-to-massive-user-exodus-to-telegram-signal/amp/)
- Kabel dasar laut 99%: [TeleGeography mythbusting](https://blog.telegeography.com/2023-mythbusting-part-3), [ITU](https://www.itu.int/en/mediacentre/backgrounders/pages/submarine-cable-resilience.aspx)
- Y2K38: [Epoch Converter](https://www.epochconverter.com/year-2038-problem), [Hackaday](https://hackaday.com/2025/07/22/the-epochalypse-y2k-but-38-years-later)
- Gangnam Style 64-bit: [Guinness World Records](https://guinnessworldrecords.com/world-records/381953-first-youtube-video-to-require-a-64-bit-counter), [TechCrunch](https://techcrunch.com/2014/12/03/gangnam-style-has-been-viewed-so-many-times-it-broke-youtubes-code/)
- Boeing 787 248 hari: [Federal Register AD 2015-10066](https://www.federalregister.gov/documents/2015/05/01/2015-10066/airworthiness-directives-the-boeing-company-airplanes), [Engadget](https://www.engadget.com/2015-05-01-boeing-787-dreamliner-software-bug.html)
- CrowdStrike: [Bloomberg 8.5 juta](https://www.bloomberg.com/news/articles/2024-07-20/crowdstrike-crash-affected-8-5-million-microsoft-windows-devices), [Fortune <1%](https://fortune.com/2024/07/20/crowdstrike-global-outage-less-than-1-percent-all-microsoft-windows-devices/), [CIO Dive Delta $500M](https://www.ciodive.com/news/delta-crowdstrike-outage-costs/722970/)
- GPS: [NIST/RTI report](https://www.nist.gov/document/economic-benefits-global-positioning-system-gps-final-report), [UK GOV/London Economics](https://www.gov.uk/government/publications/the-economic-impact-on-the-uk-of-a-disruption-to-gnss), [Physics Today relativity](https://physicstoday.aip.org/features/relativity-and-the-global-positioning-system), [Penn State](https://www.e-education.psu.edu/geog862/node/1714)
- GitLab: [postmortem rasmi](https://about.gitlab.com/blog/postmortem-of-database-outage-of-january-31/), [The Register](https://www.theregister.com/2017/02/01/gitlab_data_loss/)
- Kakao: [Korea Times](https://www.koreatimes.co.kr/southkorea/society/20221016/fire-at-data-center-causes-unprecedented-massive-service-disruption), [Korea Times pulih ~2 hari](https://www.koreatimes.co.kr/southkorea/society/20221017/kakao-ready-for-complete-recovery-nearly-2-days-after-fire), [The Register](https://www.theregister.com/2022/10/17/sk_cc_naver_kaako_fire/)
- Blackout Iberia: [Euronews](https://www.euronews.com/2025/06/17/spain-says-aprils-blackout-was-caused-by-multiple-technical-failures-and-rules-out-cyberat), [Carbon Brief](https://www.carbonbrief.org/qa-what-we-do-and-do-not-know-about-the-blackout-in-spain-and-portugal/), [heise ENTSO-E](https://heise.de/-11224775)
- Carrington/solar storm: [NOAA NESDIS](https://nesdis.noaa.gov/node/108), [Live Science](https://www.livescience.com/carrington-event), [Quartz/Lloyd's](https://qz.com/93836/the-biggest-threat-to-the-global-economy-could-come-from-outer-space)
- Google 2013: [GoSquared](https://www.gosquared.com/blog/googles-downtime-40-drop-in-traffic), [Smithsonian](https://www.smithsonianmag.com/smart-news/what-happens-to-the-internet-when-google-goes-down-420693/)
- Kabel Laut Merah: [Fortune](https://fortune.com/2024/03/04/internet-cables-cut-red-sea/), [Cloudflare Q1 2024](https://blog.cloudflare.com/q1-2024-internet-disruption-summary), [CSIS](https://www.csis.org/analysis/red-sea-cable-damage-reveals-soft-underbelly-global-economy)
- left-pad: [The Register](https://www.theregister.com/2016/03/23/npm_left_pad_chaos), [Quartz](https://qz.com/646467/how-one-programmer-broke-the-internet-by-deleting-a-tiny-piece-of-code/)
- Excel PHE: [The Register](https://www.theregister.com/2020/10/05/excel_england_coronavirus_contact_error/)
- Ariane 5: [UMN](https://www-users.cse.umn.edu/~arnold/disasters/ariane.html); Mars Climate Orbiter: [NASA JPL](https://www.jpl.nasa.gov/news/mars-climate-orbiter-team-finds-likely-cause-of-loss/)
- AI: [ABA Journal Mata v. Avianca](https://abajournal.com/web/article/lawyers-who-doubled-down-and-defended-chatgpts-fake-cases-must-pay-5k-judge-says)
- Cip: [CNBC $210B](https://www.cnbc.com/2021/09/23/chip-shortage-expected-to-cost-auto-industry-210-billion-in-2021.html), [BNM EMR2024](https://www.bnm.gov.my/publications/emr2024/box1), [MIDA](https://www.mida.gov.my/beyond-assembly-lines-powering-malaysias-rise-in-semiconductor-and-high-tech-frontiers/)
- OVH: [Netcraft](https://www.netcraft.com/blog/ovh-fire)

**Nota ketelitian:** butiran yang ditanda "sahkan" (Air Canada, Tonga 5 minggu, leap second, bilangan kapal baiki kabel, angka AI harian, peranan kilang Malaysia dalam kekurangan 2021) akan disahkan semula dengan sumber utama dalam Content Development Proposal sebelum skrip ditulis.
