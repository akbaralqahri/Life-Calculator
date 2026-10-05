# Life Calculator

12 kalkulator keuangan & kehidupan dalam satu web app. Ditulis dengan **HTML, CSS, dan JavaScript murni**
(tanpa framework, tanpa build step), sehingga bisa langsung di-deploy ke **Vercel** sebagai situs statis.
Kalkulatornya diambil dari Habit Tracker (Gaji Bersih, Nilai Waktu, FIRE, Bandingkan + UMR 2026) dengan
tampilan dan rumus yang sama, ditambah 8 kalkulator baru.

| Grup | Kalkulator |
|---|---|
| **Karier** | **Gaji Bersih** (PPh 21 TER & BPJS 2026, posisi vs UMK/UMP, setara di kota lain) · **Nilai Waktu** (nilai per jam, harga dalam jam kerja, biaya kebiasaan kecil) · **Bandingkan** 2 tawaran kerja · **Pesangon** PHK (PP 35/2021, PPh final) |
| **Rencana** | **FIRE** (3 skenario, 4% rule, 3 opsi rekomendasi, Coast FIRE) · **Target Tabungan & DCA** · **Dana Pendidikan Anak** · **Dana Darurat** |
| **Hidup** | **Cicilan & KPR** (anuitas/flat/efektif, fix-floating, DSR) · **Inflasi & Daya Beli** · **Zakat** (penghasilan, maal, fitrah) · **Hidup dalam Minggu** |

- Angka antarkalkulator terhubung: gaji bersih otomatis dipakai FIRE, Cicilan (rasio cicilan), Zakat, Pesangon, dll.
- Bahasa Indonesia & Inggris, mode gelap, 8 warna tema, *privacy mode* (sembunyikan nominal).
- Semua hitungan berjalan di browser. Isian tersimpan di `localStorage`; tidak ada server/database.
  Cadangan bisa diekspor/impor sebagai `.json` (Pengaturan → Data).
- Bisa dipasang sebagai aplikasi (PWA) di Android, iPhone, dan desktop, serta tetap terbuka tanpa internet.

---

## 1. Coba di komputer

**Syarat:** Node.js 20+ (hanya untuk server lokal & tes; aplikasinya sendiri tidak butuh Node).

```bash
npm run dev
```

Buka http://localhost:5173. Port bisa diganti dengan variabel `PORT`.

Tes otomatis (rumus, data UMR, semua tampilan dalam ID/EN, PWA):

```bash
npm test
```

## 2. Deploy ke Vercel

Proyek ini situs statis murni: **tidak ada build command**, output directory = folder root.
`vercel.json` sudah berisi header keamanan & cache, dan `.vercelignore` membuang folder tes/alat.

### Cara A — lewat GitHub (disarankan, otomatis deploy setiap push)

1. Buat repo baru di GitHub, lalu dari folder ini:
   ```bash
   git init
   ```
   ```bash
   git add . && git commit -m "Life Calculator"
   ```
   ```bash
   git remote add origin https://github.com/<akun>/life-calculator.git && git push -u origin main
   ```
2. Buka [vercel.com/new](https://vercel.com/new) → **Import** repo tersebut.
3. **Framework Preset: Other**. Kosongkan *Build Command* dan *Install Command*, *Output Directory* biarkan kosong/`.`.
4. **Deploy**. Setiap `git push` ke `main` otomatis membuat deployment baru.

### Cara B — Vercel CLI

```bash
npx vercel
```

Ikuti pertanyaannya (pilih *Other*, tanpa build). Untuk produksi:

```bash
npx vercel --prod
```

### Setelah deploy

- Saat merilis versi baru, naikkan `VERSION` di `sw.js` (mis. `lc-1.0.1`) supaya cache offline pengguna diperbarui.
- Domain sendiri: Vercel → Project → **Settings → Domains**.

## 3. Pembaruan aturan tiap tahun

| Data | File | Keterangan |
|---|---|---|
| Tarif PPh 21 TER, PTKP, BPJS, batas upah JP | `js/data/tarif.js` | Batas upah Jaminan Pensiun biasanya naik tiap Maret |
| UMP & UMK | `data/upah-minimum/<tahun>.json` → `npm run wages` | Salin JSON tahun lalu, ganti angkanya; skrip memeriksa 38 provinsi & jumlah kab/kota |
| Harga emas (nisab zakat), bunga KPR, harapan hidup, dll. | bawaan di `js/calc/<kalkulator>.js` | Semua bisa diubah pengguna di aplikasi; perbarui bawaannya bila perlu |

Setelah mengubah angka, jalankan `npm test`. Logo ada di blok `LOGO` di `js/app.js`; setelah mengubahnya jalankan
`npm run icons`.

## 4. Struktur proyek

```
index.html              kerangka halaman, memuat semua script (defer, urutan penting)
css/app.css             seluruh gaya (token warna Habit Tracker, mode gelap)
js/app.js               inti: ikon, teks ID/EN, state & localStorage, tema, navigasi (#hash), komponen form, event
js/pages.js             Beranda, Pengaturan, pasang aplikasi (PWA)
js/data/                tarif.js (PPh 21 & BPJS) · upah-minimum.js (dibuat npm run wages)
js/engine/<id>.js       rumus murni tiap kalkulator (tanpa DOM, diuji di test/)
js/calc/<id>.js         tampilan & teks tiap kalkulator, didaftarkan dengan calc({...})
sw.js, manifest.webmanifest, assets/icons/   PWA
data/upah-minimum/      sumber data UMP/UMK (JSON, lengkap dengan sumber per provinsi)
tools/                  dev-server.js · build-wages.js · build-icons.js
test/                   node --test
vercel.json, .vercelignore
```

### Menambah kalkulator baru

1. Tulis rumus di `js/engine/<id>.js` (fungsi murni, akhiri dengan `module.exports` bersyarat) + tes di `test/<id>.test.js`.
2. Tulis tampilan di `js/calc/<id>.js`: teks `Object.assign(I18N.id/en, …)`, lalu `calc({ id, icon, color, title, short, sub, defaults, view, summary })`.
   Bagian hasil yang berubah saat mengetik dibungkus `data-live="…"` (tanpa input di dalamnya).
3. Tambahkan `<script defer>` di `index.html`, id di `GROUPS` (`js/app.js`), dan path di `CORE` (`sw.js`).
   `npm test` memeriksa ketiganya.

## 5. Catatan

- Semua hasil adalah **estimasi edukatif**, bukan nasihat keuangan, pajak, hukum, atau fatwa. Dasar aturan
  disebut di catatan bawah tiap kalkulator.
- Data UMP/UMK 2026: 25 provinsi dibaca dari keputusan gubernur/rilis resmi; 13 provinsi dari kompilasi
  [Nafkah](https://github.com/adenaufal/nafkah) dan [Panduan Warga](https://panduanwarga.org)
  ([CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)). Rincian & sumber per provinsi di `data/upah-minimum/2026.json`.
- Data hanya ada di browser yang dipakai. Menghapus data situs/riwayat browser akan menghapus isian; pakai
  **Ekspor cadangan** sebelum berganti perangkat.

© 2026 [@akbaralqahri](https://www.instagram.com/akbaralqahri/). All rights reserved.
