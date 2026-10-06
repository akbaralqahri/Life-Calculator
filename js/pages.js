'use strict';
/* =====================================================================
 * Beranda, Pengaturan, ringkasan sidebar, dan pasang aplikasi (PWA).
 * ===================================================================== */

Object.assign(I18N.id, {
  homeSub: '12 kalkulator untuk gaji, rencana keuangan, dan hidupmu',
  greetMorning: 'Selamat pagi', greetNoon: 'Selamat siang', greetAfternoon: 'Selamat sore', greetNight: 'Selamat malam',
  homeHeroHint: 'Angka ini dipakai otomatis oleh FIRE, Cicilan, Zakat, Pesangon & lainnya.',
  sideNet: 'Gaji bersih / bln', sideHour: 'Nilai waktu',
  homeEmptyBig: 'Isi gajimu dulu', homeEmptyHint: 'Ketuk di sini untuk mulai. Gaji bersihmu dipakai otomatis oleh Nilai Waktu, FIRE, Cicilan, Zakat, Pesangon & lainnya.',
  homeEmptyCta: 'Isi gaji', sideEmpty: 'Belum diisi',
  homeNote: 'Semua hitungan berjalan di perangkatmu dan tersimpan di browser ini saja — tidak ada data yang dikirim ke server. Hasilnya estimasi edukatif, bukan nasihat keuangan, pajak, atau hukum.',
  installTitle: 'Pasang Life Calculator', installText: 'Buka dari layar utama seperti aplikasi, bisa dipakai tanpa internet.',
  installBtn: 'Pasang', installLater: 'Nanti', installIosTitle: 'Pasang di iPhone / iPad',
  installIos: ['Buka halaman ini di Safari.', 'Ketuk tombol Bagikan (kotak dengan panah ke atas).', 'Pilih "Tambah ke Layar Utama", lalu "Tambah".'],
  installOther: ['Buka menu browser (⋮ atau ⋯).', 'Pilih "Pasang aplikasi" / "Tambahkan ke layar utama".'],
  installed: 'Aplikasi sudah terpasang', installRow: 'Pasang aplikasi', installRowSub: 'Ikon di layar utama, bisa offline',
  display: 'Tampilan', darkMode: 'Mode gelap', darkSub: 'Tema gelap atau terang', privacyMode: 'Privacy mode', privacySub: 'Sembunyikan nominal rupiah',
  accentL: 'Warna tema', accentSub: 'Pilih warna aksen aplikasi', language: 'Bahasa',
  dataTitle: 'Data', exportL: 'Ekspor cadangan', exportSub: 'Simpan semua isian ke file .json', importL: 'Impor cadangan', importSub: 'Pulihkan dari file .json',
  resetL: 'Hapus semua isian', resetSub: 'Kembali ke angka bawaan', resetQ: 'Hapus semua isian di semua kalkulator dan kembali ke angka bawaan? Pengaturan tampilan tidak ikut terhapus.',
  resetOk: 'Ya, hapus', resetDone: 'Semua isian kembali ke bawaan', importDone: 'Cadangan dipulihkan', importBad: 'File cadangan tidak valid',
  storageNote: 'Isian tersimpan otomatis di browser ini (localStorage). Pakai ekspor/impor untuk memindahkan ke perangkat lain.',
  about: 'Tentang', aboutSub: 'Aturan {y} · Upah minimum {w}', sources: 'Dasar aturan',
  sourcesText: 'PPh 21 TER (PP 58/2023, PMK 168/2023), BPJS {y}, UMP/UMK {w} (keputusan gubernur; sebagian dari kompilasi Nafkah & Panduan Warga, CC BY 4.0).'
});
Object.assign(I18N.en, {
  homeSub: '12 calculators for your salary, money plans and life',
  greetMorning: 'Good morning', greetNoon: 'Good afternoon', greetAfternoon: 'Good afternoon', greetNight: 'Good evening',
  homeHeroHint: 'FIRE, Loans, Zakat, Severance & more use this figure automatically.',
  sideNet: 'Net salary / mo', sideHour: 'Time value',
  homeEmptyBig: 'Enter your salary first', homeEmptyHint: 'Tap here to start. Time Value, FIRE, Loans, Zakat, Severance & more use your net salary automatically.',
  homeEmptyCta: 'Enter salary', sideEmpty: 'Not filled in',
  homeNote: 'Everything is calculated on your device and stored in this browser only — nothing is sent to a server. Results are educational estimates, not financial, tax or legal advice.',
  installTitle: 'Install Life Calculator', installText: 'Open it from your home screen like an app, even offline.',
  installBtn: 'Install', installLater: 'Later', installIosTitle: 'Install on iPhone / iPad',
  installIos: ['Open this page in Safari.', 'Tap the Share button (square with an up arrow).', 'Choose "Add to Home Screen", then "Add".'],
  installOther: ['Open the browser menu (⋮ or ⋯).', 'Choose "Install app" / "Add to home screen".'],
  installed: 'The app is installed', installRow: 'Install app', installRowSub: 'Home screen icon, works offline',
  display: 'Display', darkMode: 'Dark mode', darkSub: 'Dark or light theme', privacyMode: 'Privacy mode', privacySub: 'Hide rupiah amounts',
  accentL: 'Accent color', accentSub: 'Pick the app accent', language: 'Language',
  dataTitle: 'Data', exportL: 'Export backup', exportSub: 'Save every input to a .json file', importL: 'Import backup', importSub: 'Restore from a .json file',
  resetL: 'Clear all inputs', resetSub: 'Back to the default numbers', resetQ: 'Clear the inputs of every calculator and go back to the defaults? Display settings are kept.',
  resetOk: 'Yes, clear', resetDone: 'All inputs are back to defaults', importDone: 'Backup restored', importBad: 'Not a valid backup file',
  storageNote: 'Inputs are saved automatically in this browser (localStorage). Use export/import to move them to another device.',
  about: 'About', aboutSub: '{y} rules · {w} minimum wages', sources: 'Rules used',
  sourcesText: 'PPh 21 TER (PP 58/2023, PMK 168/2023), {y} BPJS, {w} UMP/UMK (governor decrees; partly from the Nafkah & Panduan Warga compilations, CC BY 4.0).'
});

function greeting() {
  const h = new Date().getHours();
  return t(h >= 4 && h < 11 ? 'greetMorning' : h < 15 ? 'greetNoon' : h < 18 ? 'greetAfternoon' : 'greetNight');
}
/** Ringkasan aman: kalkulator yang gagal menghitung tidak merusak Beranda. */
function safeSummary(id) {
  try { return CALCS[id].summary ? CALCS[id].summary() : null; } catch (e) { return null; }
}

/* ============================ BERANDA ============================ */
VIEWS.home = function () {
  const r = netSalary();
  const tv = timeValue();
  const fire = CALCS.fire ? fireCalc() : null;
  let html = '<header class="page-head"><div class="grow"><div class="page-sub">' + esc(greeting()) + '</div><h1 class="page-title">' + APP.name + '</h1><div class="page-sub">' + esc(t('homeSub')) + '</div></div>' +
    '<button type="button" class="icon-btn" data-act="privacy" aria-label="Privacy mode" aria-pressed="' + S.prefs.privacy + '">' + ic(S.prefs.privacy ? 'eyeOff' : 'eye', 20) + '</button>' +
    '<button type="button" class="icon-btn" data-act="theme" aria-label="' + esc(t('darkMode')) + '">' + ic(S.prefs.theme === 'dark' ? 'sun' : 'moon', 20) + '</button></header>';
  html += '<div class="home-top">';
  if (gajiEmpty()) {
    html += '<button type="button" class="calc-hero home-hero" data-act="fillGaji"><span class="lbl"><i class="pulse-dot" aria-hidden="true"></i>' + esc(t('gajiEmptyLbl')) + '</span>' +
      '<span class="big">' + esc(t('homeEmptyBig')) + '</span>' + heroLine(esc(t('homeEmptyHint'))) +
      '<span class="hero-cta">' + ic('wallet', 18) + esc(t('homeEmptyCta')) + ic('chevR', 18) + '</span></button>';
  } else html += '<button type="button" class="calc-hero home-hero" data-act="nav" data-v="gaji"><span class="lbl">' + esc(t('netMonthly')) + '</span><span class="big">' + esc(rp(r.thp)) + '</span>' +
    heroCells([[t('valueTime'), esc(rp(tv.perHour)) + ' <small>' + esc(t('perHour')) + '</small>'], [t('fiScore'), fire && !fire.R.empty ? num(Math.floor(fire.R.readiness), 0) + '%' : '–']]) +
    heroLine(esc(t('homeHeroHint'))) + '</button>';
  html += installCardHtml() + '</div>';
  GROUPS.forEach((g) => {
    html += '<div class="section-title"><span>' + esc(t(g.label)) + '</span><small>' + esc(t(g.sub)) + '</small></div><div class="calc-grid">';
    g.calcs.filter((c) => CALCS[c]).forEach((c) => {
      const d = CALCS[c];
      const s = safeSummary(c);
      html += '<button type="button" class="calc-tile" data-act="nav" data-v="' + c + '"><span class="tile" style="--hc:' + d.color + '">' + ic(d.icon, 22) + '</span>' +
        '<span class="ct-txt"><b>' + esc(t(d.title)) + '</b>' + (s ? '<span class="ct-val">' + esc(s.value) + '</span>' + (s.sub ? '<span class="ct-sub">' + esc(s.sub) + '</span>' : '') : '<span class="ct-sub">' + esc(t(d.sub)) + '</span>') +
        '</span>' + ic('chevR', 18) + '</button>';
    });
    html += '</div>';
  });
  return html + '<p class="foot-note" style="text-align:left;padding:18px 4px 0;max-width:720px">' + esc(t('homeNote')) + '</p>';
};
/** Kartu kecil di bawah sidebar desktop. */
function sideSummaryHtml() {
  const r = netSalary();
  const tv = timeValue();
  if (gajiEmpty()) {
    return '<button type="button" class="side-level" data-act="fillGaji"><span class="row"><span class="lv-mini">' + ic('wallet', 20) + '</span><span><span class="dim" style="font-size:12px;display:block">' + esc(t('sideNet')) + '</span>' +
      '<b style="display:block;font-size:15px">' + esc(t('sideEmpty')) + '</b></span></span>' +
      '<span class="link-btn" style="min-height:0;padding:0;font-size:12px">' + esc(t('homeEmptyCta')) + ' ' + ic('chevR', 14) + '</span></button>';
  }
  return '<button type="button" class="side-level" data-act="nav" data-v="gaji"><span class="row"><span class="lv-mini">' + ic('wallet', 20) + '</span><span><span class="dim" style="font-size:12px;display:block">' + esc(t('sideNet')) + '</span>' +
    '<b style="display:block;font-size:15px" class="num">' + esc(rp(r.thp)) + '</b></span></span>' +
    '<span class="dim" style="font-size:12px">' + esc(t('sideHour')) + ' <b class="num" style="color:var(--text)">' + esc(rp(tv.perHour)) + '</b> ' + esc(t('perHour')) + '</span></button>';
}

/* ============================ PASANG APLIKASI ============================ */
function isStandalone() { return (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true; }
function isIos() { return /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); }
function installCardHtml() {
  if (isStandalone() || store('lc-install-hide') || (!S.installEvt && !isIos())) return '';
  return '<section class="card install-card"><span class="set-ic set-logo">' + logoSvg(40) + '</span><span class="grow"><b>' + esc(t('installTitle')) + '</b><span>' + esc(t('installText')) + '</span></span>' +
    '<span class="install-actions"><button type="button" class="btn btn-ghost" data-act="installHide">' + esc(t('installLater')) + '</button><button type="button" class="btn btn-primary" data-act="install">' + esc(t('installBtn')) + '</button></span></section>';
}
Object.assign(ACT, {
  install: () => {
    if (S.installEvt) {
      const e = S.installEvt;
      e.prompt();
      e.userChoice.then(() => { S.installEvt = null; render(); }).catch(() => {});
      return;
    }
    const steps = isIos() ? L('installIos') : L('installOther');
    openSheet(sheetHead(isIos() ? t('installIosTitle') : t('installTitle')) + '<div class="install-preview">' + logoSvg(64) + '<span>' + APP.name + '</span></div>' +
      '<ol class="install-steps">' + steps.map((s) => '<li><span>' + esc(s) + '</span></li>').join('') + '</ol>' +
      '<div class="sheet-foot"><button type="button" class="btn btn-primary" data-act="sheetClose">' + esc(t('close')) + '</button></div>', { label: t('installTitle') });
  },
  installHide: () => { store('lc-install-hide', true); render(); }
});

/* ============================ PENGATURAN ============================ */
VIEWS.settings = function () {
  const p = S.prefs;
  const setRow = (icon, title, sub, right, attrs) => '<div class="set-row"' + (attrs || '') + '><span class="set-ic">' + ic(icon, 20) + '</span><span class="set-txt"><b>' + esc(title) + '</b>' + (sub ? '<span>' + esc(sub) + '</span>' : '') + '</span>' + (right || '') + '</div>';
  const btnRow = (act, icon, title, sub, cls) => '<button type="button" class="set-row ' + (cls || '') + '" data-act="' + act + '"><span class="set-ic">' + ic(icon, 20) + '</span><span class="set-txt"><b>' + esc(title) + '</b><span>' + esc(sub) + '</span></span>' + ic('chevR', 20) + '</button>';
  let html = '<header class="page-head"><div class="grow"><h1 class="page-title">' + esc(t('navSettings')) + '</h1></div></header><div class="settings-grid"><div class="stack">';
  html += card(t('display'), setRow('moon', t('darkMode'), t('darkSub'), switchBtn('theme', p.theme === 'dark', t('darkMode'))) +
    setRow('eyeOff', t('privacyMode'), t('privacySub'), switchBtn('privacy', p.privacy, t('privacyMode'))) +
    '<div class="set-row" style="flex-wrap:wrap"><span class="set-ic">' + ic('palette', 20) + '</span><span class="set-txt"><b>' + esc(t('accentL')) + '</b><span>' + esc(t('accentSub')) + '</span></span>' +
    '<div class="accent-grid" style="width:100%">' + Object.keys(ACCENTS).map((k) => '<button type="button" class="accent-opt" style="--c:' + ACCENTS[k][p.theme === 'dark' ? 1 : 0] + '" data-act="accent" data-v="' + k + '" aria-pressed="' + (p.accent === k) + '" aria-label="' + k + '"></button>').join('') + '</div></div>' +
    '<div class="set-row" style="flex-wrap:wrap"><span class="set-ic">' + ic('globe', 20) + '</span><span class="set-txt"><b>' + esc(t('language')) + '</b></span>' +
    '<div class="seg" style="width:100%;margin-top:4px"><button type="button" data-act="lang" data-v="id" aria-pressed="' + (p.lang === 'id') + '">Indonesia</button><button type="button" data-act="lang" data-v="en" aria-pressed="' + (p.lang === 'en') + '">English</button></div></div>');
  html += '</div><div class="stack">';
  html += card(t('dataTitle'), btnRow('exportData', 'download', t('exportL'), t('exportSub')) + btnRow('importData', 'upload', t('importL'), t('importSub')) +
    btnRow('resetData', 'trash', t('resetL'), t('resetSub'), 'danger') + '<p class="hint" style="margin-top:6px">' + esc(t('storageNote')) + '</p>' +
    '<input type="file" id="importFile" accept="application/json,.json" hidden>');
  const installRow = isStandalone() ? setRow('check', t('installed'), '', '') : btnRow('install', 'phone', t('installRow'), t('installRowSub'));
  html += card(t('about'), installRow +
    '<div class="set-row"><span class="set-ic set-logo">' + logoSvg(40) + '</span><span class="set-txt"><b>' + APP.name + ' v' + APP.version + '</b><span>' + esc(t('aboutSub', { y: TARIF.config.TAHUN_ATURAN, w: WAGE_DATA.year })) + '</span></span></div>' +
    '<p class="hint" style="margin-top:6px"><b>' + esc(t('sources')) + ':</b> ' + esc(t('sourcesText', { y: TARIF.config.TAHUN_ATURAN, w: WAGE_DATA.year })) + '</p>');
  html += '<p class="foot-note">© 2026 <a href="https://www.instagram.com/akbaralqahri/" target="_blank" rel="noopener noreferrer">@akbaralqahri</a>. All rights reserved.</p></div></div>';
  return html;
};
function downloadText(filename, text, type) {
  const blob = new Blob([text], { type: type || 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
Object.assign(ACT, {
  exportData: () => {
    const data = {};
    Object.keys(CALCS).forEach((id) => { data[id] = inp(id); });
    downloadText('life-calculator-' + todayKey() + '.json', JSON.stringify({ app: 'life-calculator', version: APP.version, exported: new Date().toISOString(), prefs: S.prefs, data }, null, 2));
  },
  importData: () => { const f = $('#importFile'); if (f) { f.value = ''; f.click(); } },
  resetData: () => {
    confirmBox(t('resetQ'), t('resetOk')).then((ok) => {
      if (!ok) return;
      Object.keys(CALCS).forEach((id) => { store('lc-' + id, null); delete S.data[id]; });
      S.ui = {};
      renderShell(); render();
      toast(t('resetDone'), { type: 'good' });
    });
  }
});
HOOKS.change.push((el) => {
  if (el.id !== 'importFile' || !el.files || !el.files[0]) return false;
  el.files[0].text().then((txt) => {
    const o = JSON.parse(txt);
    if (!o || o.app !== 'life-calculator' || !o.data || typeof o.data !== 'object') throw new Error('bad');
    Object.keys(CALCS).forEach((id) => {
      if (!o.data[id]) return;
      store('lc-' + id, o.data[id]);
      delete S.data[id];
      inp(id); // validasi ulang
      persist(id);
    });
    if (o.prefs && typeof o.prefs === 'object') {
      const p = o.prefs;
      setPrefs({ theme: p.theme === 'dark' ? 'dark' : 'light', accent: ACCENTS[p.accent] ? p.accent : S.prefs.accent, lang: p.lang === 'en' ? 'en' : 'id', privacy: !!p.privacy });
    } else { renderShell(); render(); }
    toast(t('importDone'), { type: 'good' });
  }).catch(() => toast(t('importBad'), { type: 'error' }));
  return true;
});
