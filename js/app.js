'use strict';
/* =====================================================================
 * Life Calculator — js/app.js (inti)
 * Ikon, teks ID/EN, state & penyimpanan (localStorage), tema, navigasi,
 * komponen form, dan event. Setiap kalkulator (js/calc/*.js) mendaftar
 * lewat calc({...}); rumus murninya ada di js/engine/*.js (diuji di test/).
 * ===================================================================== */

const APP = { name: 'Life Calculator', version: '1.0.1' };

/* ============================ IKON (garis, 24×24) ============================ */
const ICONS = {
  grid: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  home: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  calc: 'M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM8 6h8M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14v4M8 18h4',
  sliders: 'M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3M14 2v4M8 10v4M16 18v4',
  plus: 'M12 5v14M5 12h14', minus: 'M5 12h14', check: 'M20 6 9 17l-5-5', x: 'M18 6 6 18M6 6l12 12',
  chevL: 'm15 18-6-6 6-6', chevR: 'm9 18 6-6-6-6', chevD: 'm6 9 6 6 6-6',
  flame: 'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4',
  alert: 'M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01',
  note: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8',
  calendar: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  clock: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2',
  wallet: 'M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4',
  sparkles: 'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z',
  download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
  upload: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12',
  palette: 'M13.5 6.5h.01M17.5 10.5h.01M8.5 7.5h.01M6.5 12.5h.01M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.65-.75 1.65-1.69 0-.44-.18-.84-.44-1.13-.29-.29-.44-.65-.44-1.13a1.64 1.64 0 0 1 1.67-1.67h2c3.05 0 5.56-2.5 5.56-5.56C21.97 6.01 17.46 2 12 2z',
  moon: 'M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z',
  sun: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41',
  eye: 'M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  eyeOff: 'M9.88 9.88a3 3 0 1 0 4.24 4.24M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.53 13.53 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61M2 2l20 20',
  globe: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z',
  info: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 16v-4M12 8h.01',
  user: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  trophy: 'M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3',
  star: 'M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2-6.2 3.2 1.2-6.8-5-4.9 6.9-1z',
  arrowUp: 'M12 19V5M5 12l7-7 7 7', arrowDown: 'M12 5v14M19 12l-7 7-7-7',
  target: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4z',
  heart: 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7z',
  briefcase: 'M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16M4 6h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z',
  graduation: 'M22 10 12 5 2 10l10 5 10-5zM6 12v5c3 3 9 3 12 0v-5',
  gift: 'M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z',
  coins: 'M8 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM18.09 10.37A6 6 0 1 1 10.34 18M7 6h1v4M16.71 13.88l.7.71-2.82 2.82',
  sprout: 'M7 20h10M10 20c5.5-2.5.8-6.4 3-10M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8zM14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z',
  moonStar: 'M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9zM19 3v4M21 5h-4',
  coffee: 'M10 2v2M14 2v2M6 2v2M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1',
  table: 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM3 9h18M3 15h18M9 3v18',
  refresh: 'M21 12a9 9 0 0 1-15.5 6.2L3 16M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5M3 21v-5h5',
  trash: 'M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
  trendDown: 'M22 17l-8.5-8.5-5 5L2 7M16 17h6v-6',
  trendUp: 'M22 7l-8.5 8.5-5-5L2 17M16 7h6v6',
  external: 'M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6',
  scale: 'M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1zM2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1zM7 21h10M12 3v18M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2',
  logOut: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  hourglass: 'M5 22h14M5 2h14M17 22v-4.17a2 2 0 0 0-.59-1.42L12 12l-4.41 4.41A2 2 0 0 0 7 17.83V22M7 2v4.17a2 2 0 0 0 .59 1.42L12 12l4.41-4.41A2 2 0 0 0 17 6.17V2',
  percent: 'M19 5 5 19M6.5 4a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM17.5 15a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z',
  baby: 'M9 12h.01M15 12h.01M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1',
  smile: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01',
  phone: 'M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM12 18h.01'
};

/* LOGO:BEGIN — "Kalkulator Hidup": ubin hijau dengan ＋ − × ＝ (garis membulat), tanda sama
   dengan berwarna emas = hasil. Satu-satunya sumber logo: `npm run icons` membuat PNG & SVG
   di assets/icons/ dari blok ini. Koordinat 0–100. tiles = warna ubin per Warna tema. */
const LOGO = {
  tile: '#0b776b', ink: '#ffffff', gold: '#ffc233', rx: 23, w: 7,
  glyphs: [
    { c: 'ink', segs: [[25, 34, 43, 34], [34, 25, 34, 43]] },
    { c: 'ink', segs: [[57, 34, 75, 34]] },
    { c: 'ink', segs: [[27.5, 59.5, 40.5, 72.5], [40.5, 59.5, 27.5, 72.5]] },
    { c: 'gold', segs: [[57, 61, 75, 61], [57, 71, 75, 71]] }
  ],
  tiles: { emerald: '#0b776b', blue: '#296fd3', violet: '#7758f5', rose: '#ca406e', amber: '#a16309', cyan: '#0a7b89', indigo: '#4f5bd5', slate: '#5b6b87' }
};
function logoSvg(size, square, tile, scale) {
  const k = scale || 1;
  const p = (v) => +(50 + (v - 50) * k).toFixed(2);
  const paths = LOGO.glyphs.map((g) => '<path d="' + g.segs.map((s) => 'M' + p(s[0]) + ' ' + p(s[1]) + 'L' + p(s[2]) + ' ' + p(s[3])).join('') +
    '" stroke="' + LOGO[g.c] + '"/>').join('');
  return '<svg class="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="' + size + '" height="' + size + '" aria-hidden="true">' +
    '<rect class="logo-tile" width="100" height="100"' + (square ? '' : ' rx="' + LOGO.rx + '"') + ' fill="' + (tile || LOGO.tile) + '"/>' +
    '<g fill="none" stroke-width="' + +(LOGO.w * k).toFixed(2) + '" stroke-linecap="round">' + paths + '</g></svg>';
}
/* LOGO:END */

const ACCENTS = {
  emerald: ['#0f9e8e', '#2fd6b0'], blue: ['#2f7ef0', '#5c9dff'], violet: ['#7c5cff', '#9a82ff'], rose: ['#e5497d', '#f5739e'],
  amber: ['#e0890c', '#f2a93d'], cyan: ['#0fb5c9', '#3fd0e0'], indigo: ['#4f5bd5', '#7a86f5'], slate: ['#5b6b87', '#93a3bf']
};

/* ============================ TEKS (ID / EN) ============================ */
// Setiap kalkulator menambahkan teksnya sendiri dengan Object.assign(I18N.id, {...}).
const I18N = {
  id: {
    save: 'Simpan', cancel: 'Batal', close: 'Tutup', back: 'Kembali', retry: 'Coba lagi', saved: 'Tersimpan',
    navHome: 'Beranda', navSettings: 'Pengaturan', navSettingsShort: 'Setelan', allCalcs: 'Semua kalkulator',
    grpKarier: 'Karier', grpRencana: 'Rencana', grpHidup: 'Hidup',
    grpKarierSub: 'Gaji, nilai waktu & pekerjaan', grpRencanaSub: 'Tujuan & investasi', grpHidupSub: 'Utang, zakat & waktu hidup',
    confirm: 'Konfirmasi', perMonthShort: '/ bln', perYearShort: '/ thn', yearsN: '{n} tahun', monthsN: '{n} bulan',
    fromCalc: 'dari {name}', useFrom: 'Pakai angka {name}', open: 'Buka'
  },
  en: {
    save: 'Save', cancel: 'Cancel', close: 'Close', back: 'Back', retry: 'Try again', saved: 'Saved',
    navHome: 'Home', navSettings: 'Settings', navSettingsShort: 'Settings', allCalcs: 'All calculators',
    grpKarier: 'Career', grpRencana: 'Plans', grpHidup: 'Life',
    grpKarierSub: 'Salary, time value & work', grpRencanaSub: 'Goals & investing', grpHidupSub: 'Debt, zakat & life time',
    confirm: 'Confirm', perMonthShort: '/ mo', perYearShort: '/ yr', yearsN: (v) => (v.n === 1 ? '1 year' : v.n + ' years'), monthsN: (v) => (v.n === 1 ? '1 month' : v.n + ' months'),
    fromCalc: 'from {name}', useFrom: 'Use the {name} figure', open: 'Open'
  }
};

/* ============================ STATE ============================ */
const S = {
  view: 'home',
  prefs: { theme: '', accent: 'emerald', lang: 'id', privacy: false, last: {} }, // last = kalkulator terakhir per grup
  data: {},   // input tiap kalkulator, disimpan di localStorage 'lc-<id>'
  ui: {},     // status tampilan (tab, buka/tutup) — tidak disimpan
  installEvt: null
};
/** Aksi klik (data-act) — tiap bagian menambahkan aksinya sendiri. */
const ACT = {};
/** Penanganan input/change khusus: fungsi (el) → true bila sudah ditangani. */
const HOOKS = { input: [], change: [] };
/** Layar: id → fungsi yang mengembalikan HTML. */
const VIEWS = {};
/** Kalkulator terdaftar: id → definisi (lihat calc()). */
const CALCS = {};
const GROUPS = [
  { id: 'karier', icon: 'briefcase', label: 'grpKarier', sub: 'grpKarierSub', calcs: ['gaji', 'waktu', 'bandingkan', 'pesangon'] },
  { id: 'rencana', icon: 'target', label: 'grpRencana', sub: 'grpRencanaSub', calcs: ['fire', 'tabungan', 'pendidikan', 'darurat'] },
  { id: 'hidup', icon: 'heart', label: 'grpHidup', sub: 'grpHidupSub', calcs: ['cicilan', 'inflasi', 'zakat', 'minggu'] }
];

/* ============================ UTIL ============================ */
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const esc = (s) => String(s === null || s === undefined ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
function ic(name, size, sw) {
  const d = ICONS[name] || ICONS.target;
  return '<svg class="ic" width="' + (size || 20) + '" height="' + (size || 20) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (sw || 2) +
    '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + d + '"/></svg>';
}
function dict() { return I18N[S.prefs.lang] || I18N.id; }
function t(key, vars) {
  let v = dict()[key];
  if (v === undefined) v = I18N.id[key];
  if (v === undefined) return key;
  if (typeof v === 'function') return v(vars || {});
  if (!vars) return v;
  return String(v).replace(/\{(\w+)\}/g, (m, k) => (vars[k] !== undefined ? vars[k] : m));
}
/** Nilai mentah dari kamus (objek/array pilihan). */
function L(key) { return dict()[key] || I18N.id[key]; }
function en() { return S.prefs.lang === 'en'; }

// --- angka & rupiah ---
function nf(d) { return new Intl.NumberFormat(en() ? 'en-US' : 'id-ID', { maximumFractionDigits: d || 0 }); }
function num(n, d) { return nf(d).format(n || 0); }
const ID_NUM = new Intl.NumberFormat('id-ID');
function rp(n) { return S.prefs.privacy ? 'Rp •••' : (n < 0 ? '−' : '') + 'Rp ' + ID_NUM.format(Math.round(Math.abs(n || 0))); }
function compactNum(n) {
  const a = Math.abs(n);
  const u = en() ? [[1e12, 'T'], [1e9, 'B'], [1e6, 'M'], [1e3, 'K']] : [[1e12, ' T'], [1e9, ' M'], [1e6, ' Jt'], [1e3, ' Rb']];
  for (let i = 0; i < u.length; i++) {
    if (a >= u[i][0]) { const v = n / u[i][0]; return num(v, Math.abs(v) >= 100 ? 0 : 1) + u[i][1]; }
  }
  return num(n, 0);
}
function compactRp(n) { return S.prefs.privacy ? 'Rp •••' : 'Rp ' + compactNum(n); }
function pctTxt(v, d) { return num(v, d === undefined ? 2 : d); }
/** Kelipatan selalu satu desimal: 1,0× · 2,6× (≥ 10× tanpa desimal). */
function ratioTxt(x) {
  return new Intl.NumberFormat(en() ? 'en-US' : 'id-ID', { minimumFractionDigits: x < 10 ? 1 : 0, maximumFractionDigits: x < 10 ? 1 : 0 }).format(x);
}
/** Teks angka untuk kotak isian (koma desimal di Bahasa Indonesia). */
function numField(v) { return v === null || v === undefined || v === '' ? '' : (en() ? String(v) : String(v).replace('.', ',')); }
function parseNum(s) {
  const x = String(s || '').trim().replace(/\s/g, '').replace(',', '.');
  return x === '' || x === '.' || x === '-' ? NaN : Number(x);
}
// --- tanggal ---
const MON_ID = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const MON_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
function monthName(m, short) { const a = en() ? MON_EN : MON_ID; return short ? a[m - 1].slice(0, 3) : a[m - 1]; }
function todayKey() { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
/** 'yyyy-MM-dd' → "5 Oktober 2026" */
function fmtDate(k) { if (!k) return ''; return +k.slice(8, 10) + ' ' + monthName(+k.slice(5, 7)) + ' ' + k.slice(0, 4); }

// --- warna ---
function hexRgb(h) { const n = parseInt(h.slice(1, 7), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
function rgbHex(r, g, b) { return '#' + [r, g, b].map((x) => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, '0')).join(''); }
function shade(h, k) { const c = hexRgb(h); return rgbHex(c[0] * (1 - k), c[1] * (1 - k), c[2] * (1 - k)); }
function lum(h) { return hexRgb(h).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }).reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0); }
function contrast(a, b) { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
function alpha(h, a) { const c = hexRgb(h); return 'rgba(' + c.join(',') + ',' + a + ')'; }

/** localStorage aman: baca bila val tidak diberikan; null bila diblokir/rusak. */
function store(key, val) {
  try {
    if (val === undefined) return JSON.parse(localStorage.getItem(key) || 'null');
    if (val === null) localStorage.removeItem(key); else localStorage.setItem(key, JSON.stringify(val));
  } catch (e) { return null; }
  return val;
}

/* ============================ KALKULATOR: DAFTAR & INPUT ============================ */
/**
 * Daftarkan kalkulator.
 * def: { id, icon, color, title, short, sub   (kunci teks I18N)
 *        defaults: {...}       input bawaan (tipe tiap nilai dipakai untuk validasi)
 *        clean(o) → o          validasi tambahan (opsional, mis. batas usia)
 *        ui: {...}             status tampilan bawaan (tab aktif, dll.)
 *        view() → html         isi halaman di bawah judul & tab grup
 *        summary() → {value, sub}  ringkasan untuk kartu di Beranda
 *        onSet(path, value)    dipanggil setelah input berubah (opsional) }
 */
function calc(def) {
  CALCS[def.id] = def;
  VIEWS[def.id] = () => calcPage(def);
}
function groupOf(id) { return GROUPS.find((g) => g.calcs.indexOf(id) >= 0) || null; }

/** Samakan tipe nilai tersimpan dengan bawaannya (angka/boolean/teks/array/objek). */
function sanitize(defaults, saved) {
  const out = {};
  Object.keys(defaults).forEach((k) => {
    const d = defaults[k], v = saved ? saved[k] : undefined;
    if (v === undefined || v === null) out[k] = clone(d);
    else if (typeof d === 'number') out[k] = typeof v === 'number' && isFinite(v) ? v : clone(d);
    else if (typeof d === 'boolean') out[k] = !!v;
    else if (typeof d === 'string') out[k] = String(v).slice(0, 200);
    else if (Array.isArray(d)) out[k] = Array.isArray(v) ? clone(v) : clone(d);
    else if (d && typeof d === 'object') out[k] = v && typeof v === 'object' && !Array.isArray(v) ? sanitize(d, v) : clone(d);
    else out[k] = v;
  });
  return out;
}
function clone(x) { return x && typeof x === 'object' ? JSON.parse(JSON.stringify(x)) : x; }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

/** Input tersimpan milik kalkulator id (dibaca sekali dari localStorage). */
function inp(id) {
  if (!S.data[id]) {
    const def = CALCS[id];
    let o = sanitize(def.defaults || {}, store('lc-' + id));
    if (def.clean) o = def.clean(o) || o;
    S.data[id] = o;
  }
  return S.data[id];
}
const saveTimers = {};
function persist(id) {
  clearTimeout(saveTimers[id]);
  saveTimers[id] = setTimeout(() => { store('lc-' + id, S.data[id]); }, 250);
}
function ui(id) {
  if (!S.ui[id]) S.ui[id] = Object.assign({}, (CALCS[id] && CALCS[id].ui) || {});
  return S.ui[id];
}
/** 'gaji.tawaran.0.gaji' → [objek induk, kunci terakhir] pada input kalkulator. */
function resolvePath(path, store) {
  const parts = path.split('.');
  let o = store === 'ui' ? ui(parts[0]) : inp(parts[0]);
  for (let i = 1; i < parts.length - 1; i++) {
    if (o[parts[i]] === undefined || o[parts[i]] === null) return [null, ''];
    o = o[parts[i]];
  }
  return [o, parts[parts.length - 1]];
}
function getPath(path) { const r = resolvePath(path); return r[0] ? r[0][r[1]] : undefined; }
function setPath(path, value) {
  const r = resolvePath(path);
  if (!r[0]) return;
  r[0][r[1]] = value;
  const id = path.split('.')[0];
  const def = CALCS[id];
  if (def && def.onSet) def.onSet(path.slice(id.length + 1), value);
  persist(id);
}

/* ============================ TEMA ============================ */
function applyTheme() {
  const dark = S.prefs.theme === 'dark';
  document.body.classList.toggle('dark', dark);
  const pair = ACCENTS[S.prefs.accent] || ACCENTS.emerald;
  const base = pair[dark ? 1 : 0];
  let fill, ink, on, ha, hb;
  if (!dark) {
    fill = base;
    let k = 0;
    while (contrast(fill, '#ffffff') < 4.6 && k < 20) { fill = shade(base, (++k) * 0.04); }
    ink = fill; on = '#ffffff'; ha = fill; hb = shade(fill, 0.28);
  } else {
    fill = base; ink = base; on = contrast(base, '#0b1513') >= 4.5 ? '#0b1513' : '#ffffff';
    ha = shade(base, 0.55); hb = shade(base, 0.72);
  }
  const r = document.documentElement.style;
  r.setProperty('--accent', base);
  r.setProperty('--accent-fill', fill);
  r.setProperty('--accent-ink', ink);
  r.setProperty('--on-accent', on);
  r.setProperty('--accent-soft', alpha(base, dark ? 0.16 : 0.12));
  r.setProperty('--accent-shadow', alpha(base, dark ? 0.18 : 0.26));
  r.setProperty('--hero-a', ha);
  r.setProperty('--hero-b', hb);
  r.setProperty('--logo-tile', LOGO.tiles[S.prefs.accent] || LOGO.tile); // sama di mode terang & gelap
  document.body.style.setProperty('--accent', base);
  const meta = $('#themeColor');
  if (meta) meta.setAttribute('content', dark ? '#0c1110' : '#f0f3f2');
  document.documentElement.lang = en() ? 'en' : 'id';
}
function setPrefs(patch) {
  Object.assign(S.prefs, patch);
  store('lc-prefs', S.prefs);
  applyTheme();
  renderShell();
  render();
}

/* ============================ TOAST & SHEET ============================ */
function toast(msg, opts) {
  const o = opts || {};
  const el = document.createElement('div');
  el.className = 'toast ' + (o.type || '');
  el.innerHTML = '<span>' + esc(msg) + '</span>' + (o.action ? '<button type="button">' + esc(o.action) + '</button>' : '');
  if (o.action) el.querySelector('button').addEventListener('click', () => { el.remove(); o.onAction(); });
  $('#toasts').appendChild(el);
  setTimeout(() => { el.style.transition = 'opacity .3s'; el.style.opacity = '0'; setTimeout(() => el.remove(), 320); }, o.ms || 2600);
}
let sheetCloseCb = null;
function openSheet(html, opts) {
  const o = opts || {};
  closeSheet(true);
  const layer = $('#layer');
  layer.innerHTML = '<div class="layer" data-act="sheetBg"><div class="sheet" role="dialog" aria-modal="true" aria-label="' + esc(o.label || '') + '">' +
    '<div class="sheet-grip"></div>' + html + '</div></div>';
  sheetCloseCb = o.onClose || null;
  const first = layer.querySelector('[autofocus]') || layer.querySelector('input, textarea, select, button:not([data-act="sheetClose"])');
  if (first && !o.noFocus) setTimeout(() => { try { first.focus({ preventScroll: true }); } catch (e) {} }, 60);
  document.body.style.overflow = 'hidden';
  return layer.querySelector('.sheet');
}
function closeSheet(silent) {
  const layer = $('#layer');
  if (!layer.innerHTML) return;
  layer.innerHTML = '';
  document.body.style.overflow = '';
  const cb = sheetCloseCb;
  sheetCloseCb = null;
  if (cb && !silent) cb();
}
function sheetHead(title, sub) {
  return '<div class="sheet-head"><div><div class="sheet-title">' + esc(title) + '</div>' + (sub ? '<div class="sheet-sub">' + esc(sub) + '</div>' : '') +
    '</div><button type="button" class="icon-btn flat" data-act="sheetClose" aria-label="' + esc(t('close')) + '">' + ic('x', 20) + '</button></div>';
}
function confirmBox(text, okLabel, danger) {
  return new Promise((resolve) => {
    openSheet(sheetHead(t('confirm')) + '<p style="margin-top:12px;line-height:1.55">' + esc(text) + '</p>' +
      '<div class="sheet-foot"><button type="button" class="btn btn-ghost" data-act="sheetClose">' + esc(t('cancel')) + '</button>' +
      '<button type="button" class="btn ' + (danger === false ? 'btn-primary' : 'btn-danger') + '" id="cfmOk">' + esc(okLabel) + '</button></div>', { onClose: () => resolve(false), noFocus: true });
    $('#cfmOk').addEventListener('click', () => { sheetCloseCb = null; closeSheet(true); resolve(true); });
  });
}

/* ============================ KOMPONEN ============================ */
// Konvensi: bagian hasil yang berubah saat mengetik/menggeser dibungkus data-live="nama-unik"
// (tanpa input di dalamnya). Saat input berubah hanya bagian itu yang diperbarui, jadi
// kursor & slider tidak terganggu. Klik, pilihan, dan selesai mengetik menggambar ulang penuh.
const fieldId = (path) => 'f-' + path.replace(/\./g, '-');
const hintHtml = (h) => (h ? '<span class="hint">' + h + '</span>' : '');
/** Isian rupiah (titik ribuan otomatis). opts: {hint (HTML), live (hint di-update)} */
function fMoney(path, label, opts) {
  const o = opts || {};
  const v = getPath(path);
  return '<div class="field"><label class="label" for="' + fieldId(path) + '">' + esc(label) + '</label><div class="input-group"><span class="pre">Rp</span>' +
    '<input id="' + fieldId(path) + '" type="text" inputmode="numeric" autocomplete="off" data-m="' + path + '" value="' + (v ? ID_NUM.format(v) : '') + '" placeholder="0"></div>' +
    (o.live ? '<span class="hint" data-live="' + o.live + '">' + (o.hint || '') + '</span>' : hintHtml(o.hint)) + '</div>';
}
/** Isian angka. opts: {min, max, suffix, prefix, hint, dec (boleh desimal)} */
function fNum(path, label, opts) {
  const o = opts || {};
  const v = getPath(path);
  return '<div class="field"><label class="label" for="' + fieldId(path) + '">' + esc(label) + '</label><div class="input-group">' +
    (o.prefix ? '<span class="pre">' + esc(o.prefix) + '</span>' : '') +
    '<input id="' + fieldId(path) + '" type="text" inputmode="' + (o.dec ? 'decimal' : 'numeric') + '" autocomplete="off" data-n="' + path + '"' +
    (o.min !== undefined ? ' data-min="' + o.min + '"' : '') + (o.max !== undefined ? ' data-max="' + o.max + '"' : '') + (o.dec ? ' data-dec="1"' : '') +
    ' value="' + esc(numField(v)) + '">' + (o.suffix ? '<span class="post">' + esc(o.suffix) + '</span>' : '') + '</div>' + hintHtml(o.hint) + '</div>';
}
/** Isian teks bebas. opts: {max, placeholder} */
function fText(path, label, opts) {
  const o = opts || {};
  return '<div class="field"><label class="label" for="' + fieldId(path) + '">' + esc(label) + '</label><input class="input" id="' + fieldId(path) + '" data-x="' + path + '" maxlength="' + (o.max || 40) +
    '" value="' + esc(getPath(path)) + '"' + (o.placeholder ? ' placeholder="' + esc(o.placeholder) + '"' : '') + '></div>';
}
/** Isian tanggal. opts: {min, max, hint} */
function fDate(path, label, opts) {
  const o = opts || {};
  return '<div class="field"><label class="label" for="' + fieldId(path) + '">' + esc(label) + '</label><input class="input" type="date" id="' + fieldId(path) + '" data-d="' + path + '" value="' + esc(getPath(path)) + '"' +
    (o.min ? ' min="' + o.min + '"' : '') + (o.max ? ' max="' + o.max + '"' : '') + '>' + hintHtml(o.hint) + '</div>';
}
/** Pilihan dropdown. options: [[nilai, label], ...]; nilai angka disimpan sebagai angka. */
function fSelect(path, label, options, opts) {
  const o = opts || {};
  const v = getPath(path);
  const isNum = typeof v === 'number';
  return '<div class="field"><label class="label" for="' + fieldId(path) + '">' + esc(label) + '</label><select class="input" id="' + fieldId(path) + '" data-s="' + path + '"' + (isNum ? ' data-num="1"' : '') + '>' +
    options.map((x) => '<option value="' + esc(x[0]) + '"' + (String(x[0]) === String(v) ? ' selected' : '') + '>' + esc(x[1]) + '</option>').join('') + '</select>' + hintHtml(o.hint) + '</div>';
}
function switchBtn(act, on, label, extra) {
  return '<button type="button" class="switch" role="switch" data-act="' + act + '"' + (extra || '') + ' aria-checked="' + !!on + '" aria-label="' + esc(label) + '"><span class="tk"><span class="kn"></span></span></button>';
}
/** Baris dengan sakelar untuk input boolean. sub = teks kecil (HTML aman). */
function fToggle(path, label, sub, opts) {
  const o = opts || {};
  return '<div class="tog-row"' + (o.first ? ' style="border-top:0"' : '') + '><span class="tt"><b>' + esc(label) + '</b>' + (sub ? '<span' + (o.live ? ' data-live="' + o.live + '"' : '') + '>' + sub + '</span>' : '') + '</span>' +
    switchBtn('tog', getPath(path), label, ' data-k="' + path + '"') + '</div>';
}
/** Tombol segmen untuk satu input. options: [[nilai, label], ...] */
function fSeg(path, options, opts) {
  const o = opts || {};
  const v = getPath(path);
  return '<div class="seg' + (o.fit ? ' fit' : '') + '" role="group"' + (o.label ? ' aria-label="' + esc(o.label) + '"' : '') + (o.style ? ' style="' + o.style + '"' : '') + '>' + options.map((x) =>
    '<button type="button" data-act="set" data-k="' + path + '" data-v="' + esc(x[0]) + '"' + (typeof x[0] === 'number' ? ' data-num="1"' : '') + ' aria-pressed="' + (String(v) === String(x[0])) + '">' + esc(x[1]) + '</button>').join('') + '</div>';
}
/** Seg + label sebagai field. */
function fSegField(path, label, options, opts) {
  return '<div class="field"><span class="label">' + esc(label) + '</span>' + fSeg(path, options, Object.assign({ label: label }, opts)) + hintHtml(opts && opts.hint) + '</div>';
}
/** Slider. fmt(v) → teks nilai; opts: {dot (warna), sub(v) → teks kecil, live} */
function fSlider(path, label, min, max, step, fmt, opts) {
  const o = opts || {};
  const v = getPath(path);
  const id = fieldId(path);
  return '<div class="fr-row"><div class="fr-top"><label for="' + id + '">' + (o.dot ? '<i class="fdot" style="background:' + o.dot + '"></i>' : '') + esc(label) + '</label>' +
    '<b data-live="sv-' + id + '">' + esc(fmt(v)) + '</b></div><input type="range" id="' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + v + '" data-r="' + path + '">' +
    (o.sub ? '<div class="fr-sub" data-live="ss-' + id + '">' + o.sub(v) + '</div>' : '') + '</div>';
}
/** Baris rincian: label kiri, nilai kanan. cls: 'neg' | 'total' */
function row(label, value, cls) { return '<div class="row ' + (cls || '') + '"><span>' + esc(label) + '</span><b class="' + (cls === 'neg' ? 'neg' : '') + '">' + value + '</b></div>'; }
/** Kartu. opts: {order, cls, small (teks kanan judul), live, id, noTitleGap} */
function card(title, body, opts) {
  const o = opts || {};
  return '<section class="card ' + (o.cls || '') + '"' + (o.order ? ' style="order:' + o.order + '"' : '') + (o.live ? ' data-live="' + o.live + '"' : '') + '>' +
    (title ? '<div class="card-title"' + (o.tight ? ' style="margin-bottom:0"' : '') + '><span>' + esc(title) + '</span>' + (o.small ? '<small>' + o.small + '</small>' : '') + '</div>' : '') + body + '</section>';
}
function callout(icon, title, sub, cls) {
  return '<div class="callout ' + (cls || '') + '">' + ic(icon, 22) + '<span><b>' + title + '</b>' + (sub ? '<small>' + sub + '</small>' : '') + '</span></div>';
}
/** Bilah bertumpuk + legenda. parts: [{label, value, color}] */
function stackbar(parts, total) {
  const sum = total || parts.reduce((a, p) => a + Math.max(0, p.value), 0) || 1;
  const pc = (x) => Math.max(0, Math.round(x / sum * 1000) / 10);
  return '<div class="stackbar" aria-hidden="true">' + parts.map((p) => '<i style="width:' + pc(p.value) + '%;background:' + p.color + '"></i>').join('') + '</div>' +
    '<div class="legend-rows" style="margin-top:12px">' + parts.map((p) => '<div class="lr"><i style="background:' + p.color + '"></i><span>' + esc(p.label) + '</span><b>' +
      esc(rp(p.value)) + ' · ' + num(pc(p.value), 1) + '%</b></div>').join('') + '</div>';
}
function progress(pct, label) {
  const p = clamp(pct || 0, 0, 100);
  return '<div class="mini-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + Math.floor(p) + '"' + (label ? ' aria-label="' + esc(label) + '"' : '') +
    '><i style="width:' + p.toFixed(1) + '%"></i></div>';
}
/** Langkah sumbu yang "bulat" (1 / 2 / 2,5 / 5 × 10ⁿ) supaya label grafik rapi. */
function niceStep(v) {
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const m = v / p;
  return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * p;
}
/**
 * Grafik garis ringan: SVG melebar penuh, label HTML supaya ukuran teks sama di semua lebar layar.
 * series: [{name, color, data: [{x, v}], dash, width, area}]
 */
function lineChart(series, label, opts) {
  const o = opts || {};
  const xs = series[0].data.map((d) => d.x);
  const n = xs.length;
  const max = 4 * niceStep(Math.max(1, ...series.map((s) => Math.max(...s.data.map((d) => d.v)))) / 4);
  const X = (i) => (n > 1 ? i / (n - 1) * 1000 : 500);
  const Y = (v) => 400 - Math.max(0, v) / max * 400;
  let svg = '<svg viewBox="0 0 1000 400" preserveAspectRatio="none" aria-hidden="true">';
  [0, 0.25, 0.5, 0.75, 1].forEach((f) => { svg += '<line class="gl" x1="0" x2="1000" y1="' + (400 - f * 400) + '" y2="' + (400 - f * 400) + '"/>'; });
  series.forEach((s) => {
    const d = s.data.map((p, i) => (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(p.v).toFixed(1)).join('');
    if (s.area) svg += '<path d="' + d + 'L' + X(n - 1).toFixed(1) + ' 400L0 400Z" style="fill:' + s.color + ';opacity:.14" stroke="none"/>';
    svg += '<path d="' + d + '" style="stroke:' + s.color + '" stroke-width="' + (s.width || 2) + '"' +
      (s.dash ? ' stroke-dasharray="6 5"' : '') + ' fill="none" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"/>';
  });
  svg += '</svg>';
  let lbl = '';
  const yfmt = o.yfmt || compactNum;
  if (!S.prefs.privacy || o.notMoney) [0.25, 0.5, 0.75, 1].forEach((f) => { lbl += '<span class="gy" style="top:calc(10px + (100% - 34px) * ' + (1 - f) + ')">' + esc(yfmt(max * f)) + '</span>'; });
  // ±6 label sumbu X; label terakhir selalu tampil, yang terlalu dekat dengannya dibuang
  const step = Math.max(1, Math.ceil((n - 1) / 5));
  const ticks = [];
  for (let i = 0; i < n; i += step) ticks.push(i);
  if (ticks[ticks.length - 1] !== n - 1) {
    if (ticks.length > 1 && n - 1 - ticks[ticks.length - 1] < step / 2) ticks.pop();
    ticks.push(n - 1);
  }
  ticks.forEach((i) => { lbl += '<span class="gx" style="left:calc(48px + (100% - 56px) * ' + (n > 1 ? i / (n - 1) : 0.5) + ')">' + esc(xs[i]) + '</span>'; });
  return '<div class="lchart" role="img" aria-label="' + esc(label) + '">' + svg + lbl + '</div>' +
    (series.length > 1 || o.legend ? '<div class="lc-legend">' + series.map((s) => '<span><i style="background:' + s.color + '"></i>' + esc(s.name) + '</span>').join('') + '</div>' : '');
}
/** Hero hijau di atas tiap kalkulator. */
function hero(html, opts) {
  const o = opts || {};
  return '<section class="calc-hero span2"' + (o.order ? ' style="order:' + o.order + '"' : '') + ' data-live="' + (o.live || 'hero') + '"' + (o.label ? ' aria-label="' + esc(o.label) + '"' : '') + '>' + html + '</section>';
}
function heroCells(cells) {
  return '<div class="cells">' + cells.map((c) => '<div><small>' + esc(c[0]) + '</small><b>' + c[1] + '</b></div>').join('') + '</div>';
}
function heroLine(label, value) { return '<span class="ln"><span>' + label + '</span>' + (value !== undefined ? '<b>' + value + '</b>' : '') + '</span>'; }
function note(text, order) { return '<p class="hint span2" style="' + (order ? 'order:' + order + ';' : '') + 'margin:4px 4px 0">' + text + '</p>'; }
/** Dua kolom di desktop (kiri hasil, kanan input), satu kolom urut "order" di HP. */
function cols(top, left, right, bottom) {
  return '<div class="calc-cols">' + (top || '') + '<div class="col">' + left + '</div><div class="col">' + right + '</div>' + (bottom || '') + '</div>';
}

/* ============================ NAVIGASI & SHELL ============================ */
function calcTitle(id) { return t(CALCS[id].title); }
function calcPage(def) {
  const g = groupOf(def.id);
  const tabs = g ? '<div class="seg fit calc-tabs" role="tablist" aria-label="' + esc(t(g.label)) + '">' + g.calcs.filter((c) => CALCS[c]).map((c) =>
    '<button type="button" role="tab" data-act="nav" data-v="' + c + '" aria-selected="' + (c === def.id) + '" aria-pressed="' + (c === def.id) + '">' + esc(t(CALCS[c].short)) + '</button>').join('') + '</div>' : '';
  return '<header class="page-head"><div class="grow"><h1 class="page-title">' + esc(t(def.title)) + '</h1><div class="page-sub">' + esc(t(def.sub)) + '</div></div>' +
    '<button type="button" class="icon-btn" data-act="privacy" aria-label="Privacy mode" aria-pressed="' + S.prefs.privacy + '">' + ic(S.prefs.privacy ? 'eyeOff' : 'eye', 20) + '</button></header>' +
    tabs + def.view();
}
function navRoot(v) { const g = groupOf(v); return g ? g.id : v; }
function renderShell() {
  const root = navRoot(S.view);
  const side = (v, icon, label, on) => '<button type="button" class="side-item' + (on ? ' on' : '') + '" data-act="nav" data-v="' + v + '"' + (on ? ' aria-current="page"' : '') + '>' + ic(icon, 20) + '<span>' + esc(label) + '</span></button>';
  let nav = side('home', 'grid', t('navHome'), S.view === 'home');
  GROUPS.forEach((g) => {
    nav += '<div class="side-group">' + esc(t(g.label)) + '</div>' + g.calcs.filter((c) => CALCS[c]).map((c) => side(c, CALCS[c].icon, t(CALCS[c].title), S.view === c)).join('');
  });
  nav += '<div class="side-group"></div>' + side('settings', 'sliders', t('navSettings'), S.view === 'settings');
  $('#sidebar').innerHTML = '<button type="button" class="brand" data-act="nav" data-v="home"><span class="brand-mark">' + logoSvg(38) + '</span><span>' + APP.name + '</span></button>' +
    '<nav class="side-nav" aria-label="Navigasi">' + nav + '</nav><div class="side-spacer"></div>' + (typeof sideSummaryHtml === 'function' ? sideSummaryHtml() : '');
  const items = [{ v: 'home', icon: 'grid', label: 'navHome' }].concat(GROUPS.map((g) => ({ v: g.id, icon: g.icon, label: g.label })), [{ v: 'settings', icon: 'sliders', label: 'navSettingsShort' }]);
  $('#bottomNav').innerHTML = items.map((n) => {
    const on = root === n.v;
    return '<button type="button" class="nav-item' + (on ? ' on' : '') + '" data-act="nav" data-v="' + n.v + '"' + (on ? ' aria-current="page"' : '') + '>' +
      '<span class="pill">' + ic(n.icon, 20) + '</span><span>' + esc(t(n.label)) + '</span></button>';
  }).join('');
}
/** Tujuan nav: nama grup → kalkulator terakhir yang dibuka di grup itu. */
function resolveView(v) {
  const g = GROUPS.find((x) => x.id === v);
  if (g) { const last = S.prefs.last[g.id]; return CALCS[last] && g.calcs.indexOf(last) >= 0 ? last : g.calcs[0]; }
  return VIEWS[v] ? v : 'home';
}
function go(v) {
  const view = resolveView(v);
  if (view === S.view) { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
  if (location.hash.slice(1) !== view) location.hash = view === 'home' ? '' : view;
  else showView(view);
}
function showView(view) {
  S.view = view;
  const g = groupOf(view);
  if (g && S.prefs.last[g.id] !== view) { S.prefs.last[g.id] = view; store('lc-prefs', S.prefs); }
  document.title = (view === 'home' ? '' : (CALCS[view] ? calcTitle(view) : t('navSettings')) + ' · ') + APP.name;
  renderShell();
  render();
  const el = $('#view');
  el.classList.remove('on'); void el.offsetWidth; el.classList.add('on');
  window.scrollTo(0, 0);
}
function onHash() {
  const v = decodeURIComponent(location.hash.replace(/^#\/?/, '')) || 'home';
  showView(VIEWS[v] ? v : 'home');
}
/** Gambar ulang seluruh layar aktif (fokus & isi input yang sedang diketik dipertahankan). */
function render() {
  const el = $('#view');
  const fn = VIEWS[S.view];
  if (!fn || !el) return;
  const a = document.activeElement;
  const id = a && a.id && el.contains(a) ? a.id : '';
  const typing = id && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA') && a.type !== 'date' && a.type !== 'range';
  const val = typing ? a.value : null;
  const selRange = typing && typeof a.selectionStart === 'number' ? [a.selectionStart, a.selectionEnd] : null;
  el.innerHTML = fn();
  if (id) {
    const n = document.getElementById(id);
    if (n && n !== a) {
      if (typing && n.value !== val) n.value = val;
      try { n.focus({ preventScroll: true }); if (selRange) n.setSelectionRange(selRange[0], selRange[1]); } catch (e) {}
    }
  }
}
/** Perbarui hanya bagian [data-live] — dipakai saat mengetik & menggeser slider. */
function patch() {
  const el = $('#view');
  const fn = VIEWS[S.view];
  if (!fn || !el) return;
  const tmp = document.createElement('div');
  tmp.innerHTML = fn();
  const fresh = new Map();
  $$('[data-live]', tmp).forEach((n) => fresh.set(n.dataset.live, n));
  $$('[data-live]', el).forEach((n) => {
    const f = fresh.get(n.dataset.live);
    if (!f) return;
    if (n.innerHTML !== f.innerHTML) n.innerHTML = f.innerHTML;
    const st = f.getAttribute('style') || '';
    if ((n.getAttribute('style') || '') !== st) n.setAttribute('style', st);
    if (n.className !== f.className) n.className = f.className;
  });
}

/* ============================ EVENT ============================ */
Object.assign(ACT, {
  nav: (b) => go(b.dataset.v),
  sheetClose: () => closeSheet(),
  sheetBg: (b, e) => { if (e.target === b) closeSheet(); },
  privacy: () => setPrefs({ privacy: !S.prefs.privacy }),
  theme: () => setPrefs({ theme: S.prefs.theme === 'dark' ? 'light' : 'dark' }),
  accent: (b) => setPrefs({ accent: b.dataset.v }),
  lang: (b) => setPrefs({ lang: b.dataset.v }),
  /** Sakelar input boolean: data-k="kalkulator.kunci" */
  tog: (b) => { setPath(b.dataset.k, !getPath(b.dataset.k)); render(); },
  /** Set nilai input: data-k, data-v (data-num = angka) */
  set: (b) => { setPath(b.dataset.k, b.dataset.num ? Number(b.dataset.v) : b.dataset.v); render(); },
  /** Status tampilan: data-k="kalkulator.flag" (toggle) atau dengan data-v (set) */
  ui: (b) => {
    const r = resolvePath(b.dataset.k, 'ui');
    r[0][r[1]] = b.dataset.v === undefined ? !r[0][r[1]] : b.dataset.v;
    render();
  }
});
/** Format isian rupiah dengan titik ribuan; kursor tetap setelah digit yang sama. */
function fmtMoneyInput(el) {
  const pos = el.selectionStart === null ? el.value.length : el.selectionStart;
  const before = el.value.slice(0, pos).replace(/\D/g, '').length;
  const digits = el.value.replace(/\D/g, '').replace(/^0+(?=\d)/, '').slice(0, 15);
  const txt = digits ? ID_NUM.format(Number(digits)) : '';
  if (el.value !== txt) {
    el.value = txt;
    let i = 0, seen = 0;
    while (i < txt.length && seen < before) { if (/\d/.test(txt[i])) seen++; i++; }
    try { el.setSelectionRange(i, i); } catch (e) {}
  }
  return Number(digits || 0);
}
function numBounds(el) {
  return [el.dataset.min !== undefined ? Number(el.dataset.min) : -Infinity, el.dataset.max !== undefined ? Number(el.dataset.max) : Infinity];
}
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-act]');
  if (!b || b.disabled) return;
  const fn = ACT[b.dataset.act];
  if (fn) fn(b, e);
});
document.addEventListener('input', (e) => {
  const el = e.target;
  const d = el.dataset || {};
  if (HOOKS.input.some((h) => h(el))) return;
  if (d.m) { setPath(d.m, fmtMoneyInput(el)); patch(); return; }
  if (d.n) {
    let v = parseNum(el.value);
    if (!d.dec) v = Math.round(v);
    const b = numBounds(el);
    if (isFinite(v) && v >= b[0] && v <= b[1]) { setPath(d.n, v); patch(); }
    return;
  }
  if (d.r) { setPath(d.r, Number(el.value)); patch(); return; }
  if (d.x) { setPath(d.x, el.value); patch(); return; }
  if (d.d) { if (el.value) { setPath(d.d, el.value); patch(); } }
});
document.addEventListener('change', (e) => {
  const el = e.target;
  const d = el.dataset || {};
  if (HOOKS.change.some((h) => h(el))) return;
  if (d.n) { // selesai mengetik angka: rapikan ke rentang yang valid
    let v = parseNum(el.value);
    if (!d.dec) v = Math.round(v);
    const b = numBounds(el);
    if (isFinite(v)) setPath(d.n, clamp(v, b[0], b[1]));
    render();
    return;
  }
  if (d.s) { setPath(d.s, d.num ? Number(el.value) : el.value); render(); return; }
  if (d.m || d.d || d.x) { render(); return; }
  if (d.r) { render(); }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && $('#layer').innerHTML) closeSheet();
});
window.addEventListener('hashchange', onHash);
// Data diubah di tab/jendela lain (mis. aplikasi terpasang + tab browser): baca ulang & gambar ulang.
window.addEventListener('storage', (e) => {
  if (!e.key || e.key.indexOf('lc-') !== 0) return;
  if (e.key === 'lc-prefs') {
    const p = store('lc-prefs');
    if (p) { Object.assign(S.prefs, p); applyTheme(); }
  } else delete S.data[e.key.slice(3)];
  renderShell();
  render();
});

/* ============================ BOOT ============================ */
function boot() {
  const cached = store('lc-prefs');
  if (cached) Object.assign(S.prefs, cached, { last: Object.assign({}, cached.last) });
  if (!S.prefs.theme) S.prefs.theme = window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  applyTheme();
  const b = $('#boot');
  try { onHash(); } catch (e) {
    // jangan biarkan layar memuat berputar terus: tampilkan penyebabnya
    if (b) b.outerHTML = '<div class="boot-error"><h1>Aplikasi gagal dimuat</h1><p>Coba muat ulang halaman.</p><p class="hint">' + esc(e && e.message) + '</p></div>';
    throw e;
  }
  if (b) b.remove();
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => {}); });
  }
}
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); S.installEvt = e; if (S.view === 'home' || S.view === 'settings') render(); });
window.addEventListener('appinstalled', () => { S.installEvt = null; store('lc-installed', true); render(); });
// Semua <script defer> (kalkulator) selesai dijalankan sebelum DOMContentLoaded.
document.addEventListener('DOMContentLoaded', boot);
