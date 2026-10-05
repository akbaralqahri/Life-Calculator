'use strict';
/* =====================================================================
 * Hidup → Hidup dalam Minggu: setiap kotak = satu minggu hidupmu.
 * Grid ringan: satu <div> per tahun usia, 52 kotak digambar dengan CSS
 * background + mask berulang (gaya di css/minggu.css). Rumus di js/engine/minggu.js.
 * ===================================================================== */

Object.assign(I18N.id, {
  lwTitle: 'Hidup dalam Minggu', lwShort: 'Minggu', lwSub: 'Setiap kotak = satu minggu hidupmu',
  lwHeroLbl: 'Minggu hidupmu', lwWeekNo: 'Minggu ke-{x}', lwOf: 'dari ±{y}', lwWeeksLeft: 'Minggu tersisa', lwDaysLeft: 'Hari tersisa',
  lwAge: 'Usia', lwAgeTxt: '{y} tahun {m} bulan {d} hari', lwPctLine: '{p}% dari harapan hidup {e} tahun',
  lwBeyond: 'Kamu sudah melewati rata-rata harapan hidup — setiap minggu adalah bonus.',
  lwBirthday: 'Selamat ulang tahun!',
  lwData: 'Data kamu', lwBirth: 'Tanggal lahir', lwBirthHint: 'Bawaan diambil dari usia di Kalkulator FIRE. Tidak dikirim ke mana pun.',
  lwBirthBad: 'Tanggal lahir tidak boleh setelah hari ini.', lwSex: 'Jenis kelamin', lwMale: 'Laki-laki', lwFemale: 'Perempuan',
  lwOwnExp: 'Atur harapan hidup sendiri', lwOwnExpSub: 'Bawaan BPS 2024: laki-laki {l} · perempuan {p} tahun', lwExpL: 'Harapan hidup', lwYearsSfx: 'tahun',
  lwRetFire: 'Pakai usia pensiun dari FIRE', lwRetFireSub: 'Usia {a} dari Kalkulator FIRE', lwRetL: 'Usia pensiun',
  lwRetHint: 'Usia pensiun Jaminan Pensiun BPJS Ketenagakerjaan: 59 tahun (2025–2027), naik 1 tahun tiap 3 tahun sampai 65 (PP 45/2015).',
  lwHoursAuto: 'Pakai jam kerja dari Nilai Waktu', lwHoursAutoSub: '{h} jam / minggu ({j} jam × {d} hari)', lwHoursL: 'Jam kerja per minggu', lwHoursSfx: 'jam',
  lwGridTitle: 'Hidupmu dalam minggu', lwGridSmall: '1 baris = 1 tahun', lwGridAria: 'Grid minggu hidup: minggu ke-{x} dari ±{y}',
  lwPh: { kecil: 'Masa kecil (0–5)', sekolah: 'Sekolah (6–17)', kuliah: 'Kuliah / awal kerja (18–22)', kerja: 'Bekerja', pensiun: 'Pensiun' },
  lwPhWork: 'Bekerja (23–{a})', lwPhRet: 'Pensiun ({a}+)', lwNowLeg: 'Minggu ini', lwOutLeg: 'Di luar harapan hidup',
  lwGridHint: '52 kotak per baris. Kotak berwarna penuh = minggu yang sudah kamu jalani. Kotak pucat = minggu yang masih menanti.',
  lwFacts: 'Dalam angka',
  lwWeekend: '±{n} akhir pekan lagi', lwWeekendP: 'Cukup untuk banyak perjalanan, kumpul keluarga, atau hobi baru.',
  lwLebaran: '±{n} kali Lebaran lagi', lwLebaranP: 'Kalender Hijriah ±11 hari lebih pendek, jadi Lebaran datang sedikit lebih sering daripada sisa tahunmu.',
  lwBonus: 'Setiap akhir pekan adalah bonus', lwBonusP: 'Statistik hanya rata-rata — isi minggu-minggumu dengan orang & hal yang kamu sayangi.',
  lwSleep: '{h} jam tidur sudah dilewati', lwSleepP: '±{y} tahun, dengan asumsi 8 jam sehari. Tidur cukup bukan waktu yang terbuang.',
  lwWork: '±{h} jam kerja lagi sampai pensiun di usia {a}', lwWorkP: '{j} jam/minggu × 48 minggu kerja/thn × {y} tahun.',
  lwWorkRp: 'Dengan nilai waktumu {rp}/jam, setara ±{tot}.', lwWorkLink: 'Lihat Nilai Waktu',
  lwWorkDone: 'Usia pensiun sudah lewat', lwWorkDoneP: 'Jam-jammu kini sepenuhnya milikmu sendiri.',
  lwHeart: 'Jantungmu sudah berdetak ±{n} miliar kali', lwHeartP: 'Rata-rata ±70 kali per menit, tanpa libur sejak hari pertama.',
  lwNote: 'Harapan hidup adalah rata-rata statistik, bukan ramalan — gaya hidup, kesehatan, dan keberuntungan membuat setiap orang berbeda. Bawaan: Angka Harapan Hidup saat lahir menurut jenis kelamin, BPS 2024 (laki-laki 70,32 · perempuan 74,21 tahun). Rilis IPM BPS (5 Nov 2025) mencatat UHH nasional 2025 74,47 tahun dengan metode berbeda — ubah sendiri bila perlu. Orang yang sudah dewasa biasanya punya harapan hidup sisa lebih tinggi dari angka saat lahir.',
  lwSumVal: 'Minggu ke-{x}', lwSumSub: '{p}% dari ±{y} minggu'
});
Object.assign(I18N.en, {
  lwTitle: 'Life in Weeks', lwShort: 'Weeks', lwSub: 'Every box is one week of your life',
  lwHeroLbl: 'Your weeks', lwWeekNo: 'Week {x}', lwOf: 'of ~{y}', lwWeeksLeft: 'Weeks left', lwDaysLeft: 'Days left',
  lwAge: 'Age', lwAgeTxt: '{y} years {m} months {d} days', lwPctLine: '{p}% of a {e}-year life expectancy',
  lwBeyond: "You've passed the average life expectancy — every week is a bonus.",
  lwBirthday: 'Happy birthday!',
  lwData: 'Your details', lwBirth: 'Date of birth', lwBirthHint: 'Defaults to the age in the FIRE calculator. Never sent anywhere.',
  lwBirthBad: 'Date of birth cannot be after today.', lwSex: 'Sex', lwMale: 'Male', lwFemale: 'Female',
  lwOwnExp: 'Set my own life expectancy', lwOwnExpSub: 'BPS 2024 default: male {l} · female {p} years', lwExpL: 'Life expectancy', lwYearsSfx: 'years',
  lwRetFire: 'Use the FIRE retirement age', lwRetFireSub: 'Age {a} from the FIRE calculator', lwRetL: 'Retirement age',
  lwRetHint: 'BPJS Ketenagakerjaan pension age: 59 (2025–2027), rising 1 year every 3 years up to 65 (PP 45/2015).',
  lwHoursAuto: 'Use work hours from Time Value', lwHoursAutoSub: '{h} hours / week ({j} h × {d} days)', lwHoursL: 'Work hours per week', lwHoursSfx: 'h',
  lwGridTitle: 'Your life in weeks', lwGridSmall: '1 row = 1 year', lwGridAria: 'Life-in-weeks grid: week {x} of ~{y}',
  lwPh: { kecil: 'Early childhood (0–5)', sekolah: 'School (6–17)', kuliah: 'College / first job (18–22)', kerja: 'Working', pensiun: 'Retired' },
  lwPhWork: 'Working (23–{a})', lwPhRet: 'Retired ({a}+)', lwNowLeg: 'This week', lwOutLeg: 'Beyond life expectancy',
  lwGridHint: '52 boxes per row. Solid boxes are weeks you have lived. Pale boxes are weeks still ahead.',
  lwFacts: 'By the numbers',
  lwWeekend: '~{n} more weekends', lwWeekendP: 'Plenty of room for trips, family time, or a new hobby.',
  lwLebaran: '~{n} more Eid celebrations', lwLebaranP: 'The Hijri year is ~11 days shorter, so Eid comes slightly more often than your remaining years.',
  lwBonus: 'Every weekend is a bonus', lwBonusP: 'Statistics are only averages — fill your weeks with the people & things you love.',
  lwSleep: '{h} hours of sleep so far', lwSleepP: '~{y} years, assuming 8 hours a day. Good sleep is not wasted time.',
  lwWork: '~{h} work hours left until retiring at {a}', lwWorkP: '{j} h/week × 48 work weeks/yr × {y} years.',
  lwWorkRp: 'At your time value of {rp}/hour, that is worth ~{tot}.', lwWorkLink: 'See Time Value',
  lwWorkDone: 'Retirement age has passed', lwWorkDoneP: 'Your hours are now entirely your own.',
  lwHeart: 'Your heart has beaten ~{n} billion times', lwHeartP: 'About 70 beats a minute, without a day off since day one.',
  lwNote: 'Life expectancy is a statistical average, not a prediction — lifestyle, health and luck make everyone different. Default: life expectancy at birth by sex, BPS 2024 (male 70.32 · female 74.21 years). The BPS HDI release (5 Nov 2025) puts the 2025 national figure at 74.47 years using a different method — adjust it if you like. Adults usually have a higher remaining life expectancy than the at-birth figure.',
  lwSumVal: 'Week {x}', lwSumSub: '{p}% of ~{y} weeks'
});

/** Angka Harapan Hidup saat lahir menurut jenis kelamin, BPS 2024 (tabel AHH menurut provinsi & jenis kelamin). */
const LIFE_BPS = { L: 70.32, P: 74.21, year: 2024 };

calc({
  id: 'minggu', icon: 'hourglass', color: '#9d3fb5', title: 'lwTitle', short: 'lwShort', sub: 'lwSub',
  defaults: { lahir: '', kelamin: 'L', harapanSendiri: false, harapan: 72, pensiunFire: true, pensiun: 59, jamAuto: true, jamMinggu: 40 },
  clean(o) {
    if (!lifeParse(o.lahir)) o.lahir = '';
    o.kelamin = o.kelamin === 'P' ? 'P' : 'L';
    o.harapan = clamp(Math.round(o.harapan * 10) / 10, 1, 120);
    o.pensiun = clamp(Math.round(o.pensiun), 30, 90);
    o.jamMinggu = clamp(Math.round(o.jamMinggu), 0, 112);
    return o;
  },
  onSet(key, v) {
    const o = inp('minggu');
    if (key === 'harapanSendiri' && v) o.harapan = LIFE_BPS[o.kelamin];
    if (key === 'pensiunFire' && !v) o.pensiun = clamp(inp('fire').targetAge, 30, 90);
    if (key === 'jamAuto' && !v) { const w = inp('waktu'); o.jamMinggu = w.jamKerja * w.hariKerja; }
  },
  view: lifeView,
  summary() {
    const c = lifeCalc();
    return { value: t('lwSumVal', { x: num(c.s.weekNo, 0) }), sub: t('lwSumSub', { p: num(c.s.pct, 1), y: num(c.s.totalWeeks, 0) }) };
  }
});

/** Nilai efektif: tanggal lahir (bawaan dari usia FIRE), harapan hidup, usia pensiun, jam kerja. */
function lifeCalc() {
  const o = inp('minggu');
  const today = todayKey();
  if (!o.lahir) { o.lahir = (+today.slice(0, 4) - clamp(Math.round(inp('fire').currentAge) || 0, 0, 100)) + '-01-01'; persist('minggu'); }
  const bad = !lifeAge(o.lahir, today);
  const birth = bad ? today.slice(0, 4) + '-01-01' : o.lahir;
  const w = inp('waktu');
  const lifeExp = o.harapanSendiri ? o.harapan : LIFE_BPS[o.kelamin] || LIFE_BPS.L;
  const retireAge = o.pensiunFire ? inp('fire').targetAge : o.pensiun;
  const hours = o.jamAuto ? w.jamKerja * w.hariKerja : o.jamMinggu;
  const s = lifeStats({ birth, today, lifeExp, retireAge, hoursPerWeek: hours });
  return { o, today, bad, lifeExp, retireAge, hours, s, grid: lifeGrid(s.age.ageYears, lifeExp, retireAge) };
}

function lifeHeroHtml(c) {
  const s = c.s, a = s.age;
  const bday = a.months === 0 && a.days === 0 && a.totalDays > 0;
  return '<span class="lbl">' + esc(t('lwHeroLbl')) + '</span><span class="big">' + esc(t('lwWeekNo', { x: num(s.weekNo, 0) })) +
    ' <small>' + esc(t('lwOf', { y: num(s.totalWeeks, 0) })) + '</small></span>' +
    '<div class="fire-bar"><i style="width:' + s.pct.toFixed(1) + '%;background:#ffc233"></i></div>' +
    heroCells([[t('lwWeeksLeft'), esc(num(s.weeksLeft, 0))], [t('lwDaysLeft'), esc(num(s.daysLeft, 0))]]) +
    heroLine(esc(t('lwAge')), esc(t('lwAgeTxt', { y: a.years, m: a.months, d: a.days }))) +
    heroLine(esc(s.beyond ? t('lwBeyond') : t('lwPctLine', { p: num(s.pct, 1), e: num(c.lifeExp, 2) }))) +
    (bday ? heroLine(esc(t('lwBirthday'))) : '');
}
/** Grid: satu div per tahun; --lw = gradien (terlewati · tersisa · di luar harapan hidup), kotak dari mask CSS. */
function lifeGridHtml(c) {
  const g = c.grid;
  const pc = (k) => +(k / 52 * 100).toFixed(3);
  const rowsHtml = g.rows.map((r) => {
    const L1 = pc(r.lived), K = pc(Math.max(r.lived, r.cap));
    const grad = 'linear-gradient(90deg,var(--lw-' + r.phase + ') 0 ' + L1 + '%,var(--lw-' + r.phase + '-soft) ' + L1 + '% ' + K + '%,var(--lw-out) ' + K + '% 100%)';
    return '<div class="lw-r" data-a="' + (r.age % 5 === 0 ? r.age : '') + '" style="--lw:' + grad + '">' +
      (r.age === g.nowRow ? '<i class="lw-now" style="--c:' + g.nowCol + '"></i>' : '') + '</div>';
  }).join('');
  return '<div class="lw-grid" role="img" aria-label="' + esc(t('lwGridAria', { x: num(c.s.weekNo, 0), y: num(c.s.totalWeeks, 0) })) + '">' + rowsHtml + '</div>';
}
function lifeLegendHtml(c) {
  const ph = L('lwPh');
  const ret = Math.round(c.retireAge);
  const label = (k) => (k === 'kerja' ? (ret > 23 ? t('lwPhWork', { a: ret - 1 }) : ph.kerja) : k === 'pensiun' ? t('lwPhRet', { a: Math.max(23, ret) }) : ph[k]);
  return '<div class="lw-legend">' + LIFE_PHASES.map((k) => '<span><i style="background:var(--lw-' + k + ')"></i>' + esc(label(k)) + '</span>').join('') +
    '<span><i class="lw-now-dot"></i>' + esc(t('lwNowLeg')) + '</span><span><i style="background:var(--lw-out);box-shadow:inset 0 0 0 1px var(--line-2)"></i>' + esc(t('lwOutLeg')) + '</span></div>';
}
function lifeFactsHtml(c) {
  const s = c.s;
  const fx = (icon, title, body) => '<div class="fx-row"><span class="set-ic">' + ic(icon, 20) + '</span><div class="grow"><b>' + esc(title) + '</b>' + body + '</div></div>';
  let h = s.beyond ? fx('sun', t('lwBonus'), '<p>' + esc(t('lwBonusP')) + '</p>') :
    fx('sun', t('lwWeekend', { n: num(s.weekendsLeft, 0) }), '<p>' + esc(t('lwWeekendP')) + '</p>') +
    fx('moonStar', t('lwLebaran', { n: num(s.lebaranLeft, 0) }), '<p>' + esc(t('lwLebaranP')) + '</p>');
  if (s.yearsToRetire > 0) {
    const tv = timeValue();
    h += fx('briefcase', t('lwWork', { h: num(s.workHoursLeft, 0), a: num(c.retireAge, 0) }),
      '<p>' + esc(t('lwWorkP', { j: num(c.hours, 0), y: num(s.yearsToRetire, 1) })) + '</p>' +
      (tv.perHour > 0 ? '<p class="fx-res">' + esc(t('lwWorkRp', { rp: rp(tv.perHour), tot: compactRp(s.workHoursLeft * tv.perHour) })) + '</p>' : '') +
      '<button type="button" class="link-btn" style="min-height:36px;padding:0" data-act="nav" data-v="waktu">' + esc(t('lwWorkLink')) + ' ' + ic('chevR', 16) + '</button>');
  } else h += fx('briefcase', t('lwWorkDone'), '<p>' + esc(t('lwWorkDoneP')) + '</p>');
  h += fx('moon', t('lwSleep', { h: num(s.sleepHours, 0) }), '<p>' + esc(t('lwSleepP', { y: num(s.sleepHours / 24 / 365.25, 1) })) + '</p>');
  h += fx('heart', t('lwHeart', { n: num(s.heartbeats / 1e9, 2) }), '<p>' + esc(t('lwHeartP')) + '</p>');
  return h;
}

function lifeView() {
  const c = lifeCalc();
  const o = c.o, w = inp('waktu');
  const top = hero(lifeHeroHtml(c), { order: 1, label: t('lwHeroLbl') });
  const data = card(t('lwData'), fDate('minggu.lahir', t('lwBirth'), { min: '1900-01-01', max: c.today, hint: esc(t('lwBirthHint')) }) +
    '<p class="hint warn" data-live="lwBad">' + (c.bad ? esc(t('lwBirthBad')) : '') + '</p>' +
    fSegField('minggu.kelamin', t('lwSex'), [['L', t('lwMale')], ['P', t('lwFemale')]]) +
    '<div style="margin-top:12px">' + fToggle('minggu.harapanSendiri', t('lwOwnExp'), esc(t('lwOwnExpSub', { l: num(LIFE_BPS.L, 2), p: num(LIFE_BPS.P, 2) }))) +
    (o.harapanSendiri ? fNum('minggu.harapan', t('lwExpL'), { min: 1, max: 120, dec: true, suffix: t('lwYearsSfx') }) : '') +
    fToggle('minggu.pensiunFire', t('lwRetFire'), esc(t('lwRetFireSub', { a: inp('fire').targetAge }))) +
    (o.pensiunFire ? '' : fNum('minggu.pensiun', t('lwRetL'), { min: 30, max: 90, suffix: t('lwYearsSfx'), hint: esc(t('lwRetHint')) })) +
    fToggle('minggu.jamAuto', t('lwHoursAuto'), esc(t('lwHoursAutoSub', { h: w.jamKerja * w.hariKerja, j: w.jamKerja, d: w.hariKerja }))) +
    (o.jamAuto ? '' : fNum('minggu.jamMinggu', t('lwHoursL'), { min: 0, max: 112, suffix: t('lwHoursSfx') })) + '</div>', { order: 2, tight: true });
  const grid = card(t('lwGridTitle'), '<div data-live="lwGrid">' + lifeGridHtml(c) + lifeLegendHtml(c) + '</div>' +
    '<p class="hint" style="margin-top:8px">' + esc(t('lwGridHint')) + '</p>', { order: 3, small: esc(t('lwGridSmall')) });
  const facts = card(t('lwFacts'), '<div data-live="lwFacts">' + lifeFactsHtml(c) + '</div>', { order: 4 });
  // HP: hero → data → grid → fakta; desktop: kiri grid, kanan data + fakta
  return cols(top, grid, data + facts, note(esc(t('lwNote')), 5));
}
