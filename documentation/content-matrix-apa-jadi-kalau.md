# Content Matrix #2 — "Apa Jadi Kalau…?" (v2)

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
| **W2** | **Apa Jadi Kalau… (kiraan saat)** | Kiraan detik selepas satu kesilapan kecil ("Saat 0… Saat 37… BOOM") | 45–75 s |
| **W3** | **Apa Jadi Kalau… (kisah benar)** | Kisah benar yang pernah jadi, diceritakan ikut jam (jam 1, jam 3, jam 6…) | 60–90 s |

Semua tajuk guna pembuka **"Apa jadi kalau…?"** (v2, permintaan user 27 Nov 2026). Format W4 lama digabung ke W1.

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

## 4. Content Matrix (v2: semua "Apa jadi kalau…?", bahasa mudah)

Peraturan bahasa v2: tajuk mesti boleh faham oleh mak cik di kedai kopi. Istilah teknikal hanya muncul **selepas** diterangkan dengan benda harian (contoh: "kabel bawah laut" dulu, baru "submarine cable").

Priority: **P0** = buat dulu, **P1** = kuat, **P2** = simpanan. Viral = anggaran (★1–5), bukan data.

| # | Tajuk "Apa jadi kalau…?" | Fasa (bahasa mudah) | Benda betul yang pernah jadi | Viral | Priority |
|---|---|---|---|---|---|
| 1 | **Apa jadi kalau internet hilang dari bumi?** | Minit 1: WhatsApp & TikTok senyap → Jam 1: QR & kad tak boleh bayar, kedai minta duit tunai → Hari 1: flight & penghantaran barang kelam-kabut → Minggu 1: rak kedai mula kosong → Twist: internet bukan "awan", tapi kabel bawah laut | 2021: WhatsApp, FB, IG hilang 6 jam serentak; Telegram dapat 70 juta user baru dalam sehari | ★★★★★ | **P0** |
| 2 | **Apa jadi kalau jam semua komputer tiba-tiba balik ke tahun 1901?** | Hari ni: komputer kira masa macam "kira saat sejak 1970" → Ada nombor paling besar yang komputer lama boleh simpan → 19 Jan 2038, 11:14:07 pagi (waktu Malaysia) nombor tu penuh → Saat seterusnya jam "pusing balik" ke 1901 → Twist: benda sama pernah jadi pada view YouTube Gangnam Style & kapal terbang Boeing 787 | Masalah "Tahun 2038"; YouTube terpaksa besarkan kaunter view (2014); Boeing 787 diarah restart setiap 248 hari (2015) | ★★★★★ | **P0** |
| 3 | **Apa jadi kalau satu update phone/laptop tersilap, dihantar ke seluruh dunia?** | Minit 1: berjuta komputer keluar skrin biru → Jam 1: airport tulis boarding pass guna tangan, bank & hospital tergendala → Hari 1: ribuan flight batal → Minggu 1: satu airline rugi ~USD500 juta (lebih RM2 bilion) → Twist: itu baru kurang 1% komputer dunia | CrowdStrike, 19 Jul 2024: 8.5 juta komputer Windows; Delta rugi ~USD500 juta | ★★★★★ | **P0** |
| 4 | **Apa jadi kalau GPS hilang?** | Minit 1: Waze, Grab, Foodpanda sesat → Jam 1: kapal & kapal terbang guna cara lama → Hari 1: line phone & bank pun terganggu, sebab GPS bagi **masa** paling tepat → Twist: jam kat satelit GPS bergerak laju sikit (teori Einstein); kalau tak dibetulkan, lokasi kau silap 10 km sehari | Kajian AS: GPS hilang ≈ USD1 bilion rugi sehari; UK: £5.2 bilion untuk 5 hari | ★★★★★ | **P0** |
| 5 | **Apa jadi kalau kau tertekan "delete" semua data company?** | Malam: pekerja penat, padam fail kat komputer salah → Beberapa saat: 300GB data hilang → Jam 1: 5 cara backup, satu pun tak jalan → Jam 6+: selamat sebab ada satu salinan "kebetulan" → Twist: company tu siarkan proses pulih secara live di YouTube | GitLab, 31 Jan 2017 (laporan rasmi GitLab) | ★★★★☆ | **P0** |
| 6 | **Apa jadi kalau WhatsApp hilang sehari?** | Jam 1: tak boleh chat → Jam 3: app teksi & e-wallet pun mati (sebab satu company) → Hari 1: satu negara "beku" → Hari 2: bos company letak jawatan → Twist: semua sebab SATU bangunan simpan data terbakar | Korea, 15 Okt 2022: KakaoTalk (app chat ~90% rakyat Korea) mati >10 jam, pulih penuh ~2 hari | ★★★★★ | P1 |
| 7 | **Apa jadi kalau satu negara tiba-tiba blackout?** | Minit 1: lampu isyarat & tren berhenti → Jam 1: ATM & kad tak boleh guna, orang beratur beli radio → Malam: gelap satu negara → Hari 2: semua tuduh kena hack → Twist: rupanya sebab voltan elektrik "terlebih", bukan serangan | Sepanyol & Portugal, 28 Apr 2025; siasatan rasmi: masalah teknikal grid, bukan serangan | ★★★★☆ | P1 |
| 8 | **Apa jadi kalau ribut matahari paling kuat berlaku hari ini?** | 1859: wayar telegraf keluar api, mesej boleh dihantar walaupun bateri dicabut → 1989: satu wilayah Kanada gelap 9 jam → 2022: puluhan satelit internet jatuh → Hari ini: senario satelit & elektrik → Twist: aurora boleh nampak dari tempat dekat khatulistiwa | Peristiwa Carrington 1859; Quebec 1989; Starlink Feb 2022 (~40 satelit) | ★★★★☆ | P1 |
| 9 | **Apa jadi kalau Google mati 5 minit?** | Minit 1: Google, YouTube, Gmail tak boleh buka → Minit 2: trafik internet SELURUH DUNIA jatuh 40% → Minit 5: hidup balik → Twist: hampir separuh internet bergantung pada satu company | Google down ~5 minit, 16 Ogos 2013 | ★★★★☆ | P1 |
| 10 | **Apa jadi kalau kabel internet bawah laut putus?** | Hari 1: gunung berapi meletus → Minggu 1: satu negara hampir terputus dari dunia, bank guna satelit → Minggu 5: kapal khas baru siap baiki → Bonus: 2024 kabel putus kena sauh kapal → Twist: kabel tu sebesar hos paip je | Tonga, Jan 2022 (sambungan pulih ~5 minggu); Laut Merah, Feb–Mac 2024 | ★★★★☆ | P1 |
| 11 | **Apa jadi kalau seorang programmer padam 11 baris code?** | Minit 0: dia geram, padam code kecil dia dari internet → Jam 1: ribuan app & website gagal dibina → Jam 2: syarikat terpaksa "hidupkan" balik code tu → Twist: app moden dibina macam Lego, guna kepingan orang lain | npm "left-pad", 22 Mac 2016 | ★★★★☆ | P1 |
| 12 | **Apa jadi kalau Excel kau "penuh"?** | Hari 1: data pesakit masuk Excel → Hari 7: angka nampak rendah pelik → Hari 8: rupanya Excel versi lama ada had baris, data selebihnya hilang → Twist: Excel bukan tempat simpan data besar | England, Okt 2020: ~16,000 kes COVID tak dilaporkan (had 65,536 baris) | ★★★★☆ | P1 |
| 13 | **Apa jadi kalau satu nombor terlalu besar untuk komputer roket?** | Saat 0: roket berlepas → Saat 36: nombor kelajuan terlalu besar untuk "kotak" yang disediakan → Saat 37: roket pusing & meletup → Bonus: NASA hilang kapal ke Marikh sebab satu team guna inci, satu lagi guna sentimeter (pound vs newton) | Ariane 5, 4 Jun 1996; Mars Climate Orbiter 1999 (USD125 juta) | ★★★★☆ | P1 |
| 14 | **Apa jadi kalau AI tak pernah wujud?** | 7 pagi: face unlock tak jalan → 8 pagi: inbox penuh email spam → 9 pagi: Waze tak tahu jalan jam → Malam: FYP TikTok jadi rawak → Twist: kau guna AI banyak kali sehari tanpa sedar | AI harian: tapis spam, anggaran masa sampai, cadangan video, autocorrect (angka disahkan masa proposal) | ★★★★☆ | P1 |
| 15 | **Apa jadi kalau kau percaya 100% apa AI cakap?** | Hari 1: lawyer suruh ChatGPT cari kes mahkamah → Minggu 1: hakim cari kes tu, rupanya tak wujud → Bulan 1: lawyer didenda → Bonus: chatbot airline "reka" polisi, airline kena bayar → Twist: AI boleh tipu dengan yakin (hallucination) | Mata v. Avianca, AS 2023 (denda USD5,000); Air Canada, Kanada 2024 | ★★★★☆ | P1 |
| 16 | **Apa jadi kalau cip komputer habis di dunia?** | Minggu 1: kereta baru tak boleh siap → Bulan 1: harga phone & console naik → 2021: industri kereta rugi USD210 bilion → Twist: Malaysia antara tempat paling penting dunia untuk pasang & uji cip | Kekurangan cip 2021; Malaysia ~13% pasaran pasang & uji cip dunia (MIDA/BNM) | ★★★☆☆ | P1 |
| 17 | **Apa jadi kalau satu minit ada 61 saat?** | 11:59:59 malam → 11:59:60 (saat "tambahan") → server Reddit & sistem check-in airline jam → 2017: Cloudflare pun kena → Twist: dunia setuju buang saat tambahan ni menjelang 2035 | Leap second 2012 & 2017 (sahkan sumber masa proposal) | ★★★☆☆ | P2 |
| 18 | **Apa jadi kalau bangunan "cloud" terbakar?** | Jam 0: api di Perancis → Jam 3: satu bangunan habis → Hari 1: 3.6 juta website hilang → Twist: "cloud" sebenarnya komputer dalam bangunan betul | OVHcloud Strasbourg, 10 Mac 2021 | ★★★☆☆ | P2 |
| 19 | **Apa jadi kalau kau tekan Send kat WhatsApp?** | Sekelip mata: mesej dikunci → ke menara telco → lalu kabel → ke server → sampai ke kawan → Twist: mesej kau mungkin lalu bawah laut dulu | Cara rangkaian berfungsi (masa dalam milisaat = anggaran, label "lebih kurang") | ★★★☆☆ | P2 |
| 20 | **Apa jadi kalau internet kau selaju tahun 1999?** | Satu video TikTok = ~35 minit nak load → gambar IG keluar sebaris-sebaris → Twist: internet hari ni ribuan kali lebih laju | Pengiraan: modem 56k ≈ 7 KB sesaat (tunjuk cara kira) | ★★★☆☆ | P2 |

---

## 5. Top 5 — pecahan fasa terperinci (bahasa mudah)

### #1 Apa jadi kalau internet hilang dari bumi? (~80 s)
- **Hook:** Aiman: "Kalau internet hilang sekarang, benda pertama yang susah bukan TikTok… tapi nak beli nasi lemak."
- **Minit 1:** WhatsApp, TikTok senyap. Aiman ingat WiFi rumah rosak.
- **Jam 1:** QR & kad tak jalan. Kedai minta tunai. *Betul pernah jadi:* 2021, WhatsApp/FB/IG hilang 6 jam, 70 juta orang lari ke Telegram dalam sehari.
- **Hari 1:** flight & penghantaran barang bergantung pada internet. *(senario, rujuk 2024 bila satu update rosakkan airport)*
- **Minggu 1:** bekalan barang lambat. *(senario, label jelas)*
- **Twist:** "Internet bukan awan. Hampir semua data antara negara lalu kabel bawah laut."
- **Ending:** "Nak tahu apa jadi bila kabel tu betul-betul putus? Part 2."

### #2 Apa jadi kalau jam semua komputer balik ke tahun 1901? (~70 s)
- **Hook:** Yusuf: "Ada satu saat dalam masa depan yang boleh buat komputer ingat sekarang tahun 1901."
- **Fasa 1:** komputer tak faham "tarikh", dia cuma kira saat sejak 1 Jan 1970.
- **Fasa 2:** komputer lama simpan nombor tu dalam "kotak" yang ada had (2,147,483,647).
- **Fasa 3:** 19 Jan 2038, 11:14:07 pagi waktu Malaysia, kotak penuh. Saat seterusnya nombor terbalik, jam jadi 13 Dis 1901.
- **Fasa 4 (bukti):** view Gangnam Style pernah lepas had yang sama; Boeing 787 kena restart setiap 248 hari sebab masalah serupa.
- **Akhir:** kebanyakan phone & komputer moden dah selamat; yang risiko ialah sistem lama dan mesin terbenam. (Jangan buat panik palsu.)

### #3 Apa jadi kalau satu update tersilap dihantar ke seluruh dunia? (~75 s)
- Minit 1 skrin biru → Jam 1 airport tulis boarding pass guna tangan → Hari 1 ribuan flight batal → Minggu 1 satu airline rugi ~USD500 juta → Twist: itu cuma kurang 1% komputer Windows dunia. Terangkan "update" & kenapa ada update yang boleh "masuk dalam jantung" komputer, guna analogi mudah.

### #4 Apa jadi kalau GPS hilang? (~75 s)
- Minit 1 Waze/Grab sesat → Jam 1 kapal & pesawat guna cara lama → Hari 1 line phone & bank terganggu sebab GPS = jam paling tepat → Twist: teori Einstein buat jam satelit laju 38 mikrosaat sehari; tak betulkan = silap ~10 km sehari.

### #5 Apa jadi kalau kau tertekan "delete" semua data company? (~75 s)
- Malam, pekerja penat → padam di komputer salah → ~300GB hilang → 5 cara backup tak jalan → selamat dari salinan 6 jam lepas → company siar live. Pengajaran mudah: backup yang tak pernah dicuba = macam tak ada backup.

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
