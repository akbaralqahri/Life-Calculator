'use strict';
/* =====================================================================
 * Rencana → FIRE (Financial Independence, Retire Early).
 * Tampilan diambil dari Habit Tracker → Kalkulator FIRE; rumus di js/engine/fire.js.
 * "Dari habit hemat" diganti setoran tambahan per bulan yang diisi sendiri.
 * ===================================================================== */

// Teks dari Habit Tracker (Kalkulator FIRE)
Object.assign(I18N.id, {
  calcSubFire: 'Kapan kamu bisa bebas finansial?', tabFire: 'FIRE',
  fiScore: 'FI Readiness Score', fiProj: 'Proyeksi aset usia {a}', fiNeed: 'Kebutuhan FIRE ({m}×)', fiAgeAt: 'Proyeksi bebas finansial di usia {a}',
  fiAgeNone: 'Belum bebas finansial sebelum usia 80', fiEmpty: 'Isi pemasukan & alokasi pengeluaran untuk melihat simulasi.',
  fireData: 'Data FIRE', ageNow: 'Usia sekarang', ageTarget: 'Target usia pensiun', ageWarn: 'Target usia pensiun harus lebih besar dari usia sekarang.',
  useNet: 'Pakai gaji bersih', useNetSub: '{rp} / bln dari kalkulator Gaji Bersih', incomeL: 'Pemasukan / bulan', savingsL: 'Aset investasi saat ini',
  savingsHint: 'Reksa dana, saham, obligasi, deposito, dll. — di luar dana darurat.',
  allocTitle: 'Alokasi pemasukan', allocTotal: 'Total {p}%', allocWarn: 'Total alokasi sebaiknya tepat 100%.', aNeeds: 'Kebutuhan pokok', aEnt: 'Hiburan & gaya hidup',
  aInv: 'Investasi FIRE', aGold: 'Emas / dana darurat', perMonth: '{rp} / bln', perMonthShort: '/ bln',
  emergHint: 'Dana darurat ideal (6× pengeluaran): {rp}', emergMonths: ' · ±{n} bulan dari alokasi emas/darurat',
  assumeTitle: 'Asumsi', rReturn: 'Return investasi', rGrowth: 'Kenaikan pemasukan', rInfl: 'Inflasi', rPost: 'Return saat pensiun', perYear: '{p}% / thn',
  swrL: 'Tingkat penarikan aman (SWR)', swrHint: '4% = target 25× pengeluaran setahun. 3–3,5% lebih aman untuk masa pensiun dini yang panjang.',
  tSummary: 'Saran', tAcc: 'Akumulasi', tWdw: 'Pensiun',
  onTrack: 'Kamu di jalur yang tepat!', onTrackText: 'Dengan strategi sekarang, aset diproyeksikan {fb} di usia {a} — melebihi target {ft}.',
  onTrackTip: 'Kamu bisa bebas finansial mulai usia {e}, atau pensiun di usia {a} dengan gaya hidup lebih leluasa.',
  notYet: 'Target FIRE belum tercapai', shortfall: 'Kurang {rp} di usia {a}. Tiga jalan keluar:',
  opt1: 'Opsi 1 · Tambah investasi', opt1Text: 'Setoran investasi per bulan agar tetap pensiun di usia {a}:', opt1Note: 'Naik {rp} (jadi {p}% pemasukan), lalu naik {g}% tiap tahun.',
  opt2: 'Opsi 2 · Tunda pensiun', opt2Text: 'Dengan investasi {rp}/bln seperti sekarang, kamu siap pensiun di usia:', opt2Val: '{a} tahun', opt2Over: 'Di atas 80 tahun',
  opt2Note: 'Mundur {n} tahun dari target.', opt2OverNote: 'Perlu kombinasi dengan opsi lain.',
  opt3: 'Opsi 3 · Turunkan gaya hidup', opt3Text: 'Agar tetap pensiun di usia {a}, pengeluaran pokok + hiburan maksimal:', opt3Note: 'Turun {rp} (jadi {p}% pemasukan), dalam nilai uang hari ini.',
  accTitle: 'Proyeksi pertumbuhan aset', accSub: 'Tiga skenario sampai usia {a}.',
  accNote: 'Target naik tiap tahun karena inflasi {i}%: pengeluaran {now}/bln hari ini ≈ {then}/bln di usia {a}. Target = {m}× pengeluaran setahun ({s}% rule).',
  wdwTitle: 'Uji ketahanan dana pensiun', wdwSub: 'Penarikan naik mengikuti inflasi. Garis yang menyentuh 0 berarti dana habis.',
  runOut: 'Habis di usia {a}', lasts: 'Bertahan > 45 tahun', scRate: 'Return {r}% · inflasi {i}%', scOpt: 'Optimis', scMod: 'Moderat', scPes: 'Pesimis', scTarget: 'Target',
  boostTitle: 'Percepat FIRE-mu', boostHabit: 'Setoran tambahan', boostHabitText: 'Jika kamu menambah investasi {rp} per bulan (naik mengikuti inflasi):',
  boostFaster: 'Bebas finansial di usia {a} — {n} tahun lebih cepat', boostReach: 'Bebas finansial jadi tercapai di usia {a}', boostSame: 'Usia FIRE tetap {a} — coba tambah setorannya',
  boostNone: 'Masih belum tercapai sebelum usia 80', boostEmpty: 'Isi setoran tambahan (mis. dari bawa bekal atau kurangi jajan kopi) untuk melihat seberapa cepat kamu bebas finansial.',
  coastTitle: 'Coast FIRE', coastOk: 'Tercapai! Tanpa setoran baru pun, asetmu diproyeksikan tumbuh menjadi target di usia {a}.',
  coastNo: 'Butuh aset {rp} hari ini supaya — tanpa setoran baru — tetap mencapai target di usia {a}.',
  fireNowTitle: 'Angka FIRE hari ini', fireNowText: '{rp} = {m}× pengeluaran setahun ({y}), dalam nilai uang sekarang.',
  fireNote: 'Simulasi edukatif dengan asumsi tetap — bukan saran investasi. Skenario optimis/pesimis menggeser return ±2% dan inflasi ±1%.'
});
Object.assign(I18N.en, {
  calcSubFire: 'When can you be financially independent?', tabFire: 'FIRE',
  fiScore: 'FI Readiness Score', fiProj: 'Projected assets at {a}', fiNeed: 'FIRE number ({m}×)', fiAgeAt: 'Projected financial independence at {a}',
  fiAgeNone: 'Not financially independent before 80', fiEmpty: 'Enter your income & spending split to see the simulation.',
  fireData: 'FIRE details', ageNow: 'Current age', ageTarget: 'Target retirement age', ageWarn: 'Target retirement age must be above your current age.',
  useNet: 'Use net salary', useNetSub: '{rp} / mo from the Net Salary calculator', incomeL: 'Income / month', savingsL: 'Current invested assets',
  savingsHint: 'Mutual funds, stocks, bonds, deposits, etc. — excluding your emergency fund.',
  allocTitle: 'Income split', allocTotal: 'Total {p}%', allocWarn: 'The split should add up to exactly 100%.', aNeeds: 'Essentials', aEnt: 'Fun & lifestyle',
  aInv: 'FIRE investing', aGold: 'Gold / emergency fund', perMonth: '{rp} / mo', perMonthShort: '/ mo',
  emergHint: 'Ideal emergency fund (6× spending): {rp}', emergMonths: ' · ~{n} months from the gold/emergency share',
  assumeTitle: 'Assumptions', rReturn: 'Investment return', rGrowth: 'Income growth', rInfl: 'Inflation', rPost: 'Return in retirement', perYear: '{p}% / yr',
  swrL: 'Safe withdrawal rate (SWR)', swrHint: '4% = a target of 25× yearly spending. 3–3.5% is safer for a long early retirement.',
  tSummary: 'Advice', tAcc: 'Growth', tWdw: 'Retirement',
  onTrack: "You're on track!", onTrackText: 'With your current plan, assets are projected at {fb} by age {a} — above the {ft} target.',
  onTrackTip: 'You could be financially independent from age {e}, or retire at {a} with a more comfortable lifestyle.',
  notYet: 'FIRE target not reached yet', shortfall: 'Short by {rp} at age {a}. Three ways forward:',
  opt1: 'Option 1 · Invest more', opt1Text: 'Monthly investment needed to still retire at {a}:', opt1Note: 'Up {rp} ({p}% of income), then rising {g}% a year.',
  opt2: 'Option 2 · Retire later', opt2Text: 'Investing {rp}/mo as you do now, you can retire at:', opt2Val: 'Age {a}', opt2Over: 'Over 80',
  opt2Note: '{n} years later than planned.', opt2OverNote: 'Combine it with another option.',
  opt3: 'Option 3 · Spend less', opt3Text: 'To still retire at {a}, keep essentials + lifestyle at most:', opt3Note: "Down {rp} ({p}% of income), in today's money.",
  accTitle: 'Projected asset growth', accSub: 'Three scenarios up to age {a}.',
  accNote: 'The target rises every year with {i}% inflation: {now}/mo of spending today ≈ {then}/mo at age {a}. Target = {m}× yearly spending ({s}% rule).',
  wdwTitle: 'Retirement stress test', wdwSub: 'Withdrawals rise with inflation. A line that hits 0 means the money ran out.',
  runOut: 'Runs out at {a}', lasts: 'Lasts 45+ years', scRate: 'Return {r}% · inflation {i}%', scOpt: 'Optimistic', scMod: 'Moderate', scPes: 'Pessimistic', scTarget: 'Target',
  boostTitle: 'Reach FIRE sooner', boostHabit: 'Extra investment', boostHabitText: 'If you invest an extra {rp} a month (rising with inflation):',
  boostFaster: 'Financially independent at {a} — {n} years sooner', boostReach: 'Financial independence becomes reachable at {a}', boostSame: 'FIRE age stays at {a} — try a bigger amount',
  boostNone: 'Still not reached before 80', boostEmpty: 'Enter an extra amount (e.g. from packed lunches or fewer coffees) to see how much sooner you could be financially independent.',
  coastTitle: 'Coast FIRE', coastOk: 'Reached! Even without new contributions, your assets are projected to grow into the target by {a}.',
  coastNo: 'You need {rp} invested today to reach the target by {a} without new contributions.',
  fireNowTitle: 'Your FIRE number today', fireNowText: "{rp} = {m}× yearly spending ({y}), in today's money.",
  fireNote: 'An educational simulation with fixed assumptions — not investment advice. Optimistic/pessimistic scenarios shift returns by ±2% and inflation by ±1%.'
});

Object.assign(I18N.id, {
  fireTitle: 'Kalkulator FIRE', fireShort: 'FIRE', extraL: 'Setoran tambahan / bulan',
  extraHint: 'Mis. dari berhemat — lihat Nilai Waktu → Biaya kebiasaan kecil.', sumFireAge: 'Bebas finansial di usia {a}'
});
Object.assign(I18N.en, {
  fireTitle: 'FIRE Calculator', fireShort: 'FIRE', extraL: 'Extra investment / month',
  extraHint: 'E.g. from cutting back — see Time Value → The cost of small habits.', sumFireAge: 'Financially independent at {a}'
});

const FIRE_PCT = [['needsPct', 'aNeeds', '#5b6b87'], ['entPct', 'aEnt', '#c23a6b'], ['invPct', 'aInv', 'var(--accent)'], ['goldPct', 'aGold', 'var(--amber)']];
const FIRE_RATES = [['expectedReturn', 'rReturn', 1, 20], ['incomeGrowthRate', 'rGrowth', 0, 15], ['inflationRate', 'rInfl', 1, 10], ['retirementReturn', 'rPost', 1, 15]];
const FIRE_SC = () => [['optimis', 'scOpt', '#46b974'], ['base', 'scMod', 'var(--accent)'], ['pesimis', 'scPes', '#f2a93d']];

calc({
  id: 'fire', icon: 'flame', color: '#c46a00', title: 'fireTitle', short: 'fireShort', sub: 'calcSubFire',
  defaults: {
    currentAge: 30, targetAge: 45, incomeAuto: true, monthlyIncome: 4000000, currentSavings: 100000000,
    needsPct: 50, entPct: 15, invPct: 25, goldPct: 10,
    expectedReturn: 10, incomeGrowthRate: 5, inflationRate: 4, retirementReturn: 6, swr: 4, extraMonthly: 500000
  },
  ui: { tab: 'summary' },
  clean(o) {
    o.currentAge = clamp(Math.round(o.currentAge), 15, 80);
    o.targetAge = clamp(Math.round(o.targetAge), 16, 90);
    ['monthlyIncome', 'currentSavings', 'extraMonthly'].forEach((k) => { o[k] = clamp(Math.round(o[k]), 0, 999999999999999); });
    ['needsPct', 'entPct', 'invPct', 'goldPct'].forEach((k) => { o[k] = clamp(Math.round(o[k]), 0, 100); });
    FIRE_RATES.forEach((x) => { o[x[0]] = clamp(Math.round(o[x[0]] * 2) / 2, x[2], x[3]); });
    if ([3, 3.5, 4].indexOf(o.swr) < 0) o.swr = 4;
    return o;
  },
  onSet(key, v) {
    if (key === 'incomeAuto' && !v) inp('fire').monthlyIncome = Math.round(netSalary().avgNet); // mulai dari gaji bersih, lalu bisa diubah
  },
  view: fireView,
  summary() {
    const c = fireCalc();
    if (c.R.empty) return { value: '–', sub: t('fiEmpty') };
    return { value: 'FI ' + num(Math.floor(c.R.readiness), 0) + '%', sub: c.R.fiAge !== null ? t('sumFireAge', { a: c.R.fiAge }) : t('fiAgeNone') };
  }
});

/** Nilai efektif untuk simulasi (pemasukan otomatis dari Gaji Bersih, usia dibatasi). */
function fireCalc() {
  const s = Object.assign({}, inp('fire'));
  if (s.incomeAuto) s.monthlyIncome = Math.round(netSalary().avgNet);
  return { s, R: calcFire(s, s.extraMonthly) };
}

function fireHeroHtml(s, R) {
  const pct = R.empty ? 0 : R.readiness;
  return '<span class="lbl">' + esc(t('fiScore')) + '</span><span class="big">' + (R.empty ? '–' : num(Math.floor(pct), 0) + '<small>%</small>') + '</span>' +
    '<div class="fire-bar"><i style="width:' + pct.toFixed(1) + '%;background:' + (R.done ? '#ffffff' : '#ffc233') + '"></i></div>' +
    heroCells([[t('fiProj', { a: R.retireAge }), esc(compactRp(R.base.finalBalance))], [t('fiNeed', { m: num(R.mult, 1) }), esc(R.empty ? '–' : compactRp(R.base.finalTarget))]]) +
    heroLine(esc(R.empty ? t('fiEmpty') : R.fiAge !== null ? t('fiAgeAt', { a: R.fiAge }) : t('fiAgeNone')));
}
function fireSummaryHtml(s, R) {
  if (R.empty) return '<p class="hint" style="margin-top:14px">' + esc(t('fiEmpty')) + '</p>';
  if (R.years === 0) return '<p class="hint warn" style="margin-top:14px">' + esc(t('ageWarn')) + '</p>';
  const b = (x, color) => '<b' + (color ? ' style="color:' + color + '"' : '') + '>' + esc(x) + '</b>';
  if (R.done) {
    return '<div class="fire-banner"><div class="fb-ic" style="background:var(--accent-soft);color:var(--accent-ink)">' + ic('check', 28, 2.6) + '</div>' +
      '<h3 style="color:var(--accent-ink)">' + esc(t('onTrack')) + '</h3><p>' + t('onTrackText', { fb: b(rp(R.base.finalBalance)), a: s.targetAge, ft: b(rp(R.base.finalTarget)) }) + '</p>' +
      '<p class="fb-tip">' + esc(t('onTrackTip', { e: R.fiAge, a: s.targetAge })) + '</p></div>';
  }
  const opt = (cls, icon, title, text, val, nt) => '<div class="fire-opt ' + cls + '"><span class="fo-ic">' + ic(icon, 20) + '</span><div class="grow"><h4>' + esc(title) + '</h4>' +
    '<p>' + esc(text) + '</p><div class="fo-val">' + val + '</div>' + (nt ? '<p class="fo-note">' + esc(nt) + '</p>' : '') + '</div></div>';
  const rec = R.rec;
  return '<div class="fire-banner"><div class="fb-ic" style="background:var(--danger-soft);color:var(--danger)">' + ic('alert', 26) + '</div>' +
    '<h3>' + esc(t('notYet')) + '</h3><p>' + t('shortfall', { rp: b(rp(R.base.finalTarget - R.base.finalBalance), 'var(--danger)'), a: s.targetAge }) + '</p></div>' +
    opt('o1', 'coins', t('opt1'), t('opt1Text', { a: s.targetAge }), esc(rp(rec.investment)) + ' <small>' + esc(t('perMonthShort')) + '</small>',
      t('opt1Note', { rp: rp(Math.max(0, rec.investment - R.monthlyInvestment)), p: num(rec.investmentPct, 1), g: num(s.incomeGrowthRate, 1) })) +
    opt('o2', 'calendar', t('opt2'), t('opt2Text', { rp: rp(R.monthlyInvestment) }), esc(rec.ageCapped ? t('opt2Over') : t('opt2Val', { a: rec.age })),
      rec.ageCapped ? t('opt2OverNote') : t('opt2Note', { n: rec.age - s.targetAge })) +
    opt('o3', 'trendDown', t('opt3'), t('opt3Text', { a: s.targetAge }), esc(rp(rec.expense)) + ' <small>' + esc(t('perMonthShort')) + '</small>',
      t('opt3Note', { rp: rp(Math.max(0, R.monthlyExpenses - rec.expense)), p: num(rec.expensePct, 1) }));
}
function fireAccHtml(s, R) {
  if (R.empty) return '<p class="hint" style="margin-top:14px">' + esc(t('fiEmpty')) + '</p>';
  if (R.years === 0) return '<p class="hint warn" style="margin-top:14px">' + esc(t('ageWarn')) + '</p>';
  const ser = FIRE_SC().map((x) => ({ name: t(x[1]), color: x[2], dash: x[0] !== 'base', width: x[0] === 'base' ? 3 : 2, data: R[x[0]].acc.map((d) => ({ x: d.age, v: d.balance })) }));
  ser.push({ name: t('scTarget'), color: '#e8604c', dash: true, data: R.base.acc.map((d) => ({ x: d.age, v: d.target })) });
  const finals = [R.optimis.finalBalance, R.base.finalBalance, R.pesimis.finalBalance, R.base.finalTarget];
  return '<div class="fire-sec"><h3>' + esc(t('accTitle')) + '</h3><p class="hint">' + esc(t('accSub', { a: R.retireAge })) + '</p></div>' + lineChart(ser, t('accTitle')) +
    '<div class="fire-mini">' + ser.map((x, i) => '<div><small><i style="background:' + x.color + '"></i>' + esc(x.name) + '</small><b>' + esc(compactRp(finals[i])) + '</b></div>').join('') + '</div>' +
    '<p class="hint" style="margin-top:12px">' + esc(t('accNote', { i: num(s.inflationRate, 1), now: rp(R.monthlyExpenses), then: rp(R.base.finalExpense), a: R.retireAge, m: num(R.mult, 1), s: num(s.swr, 1) })) + '</p>';
}
function fireWdwHtml(s, R) {
  if (R.empty) return '<p class="hint" style="margin-top:14px">' + esc(t('fiEmpty')) + '</p>';
  const sc = FIRE_SC();
  const ser = sc.map((x) => ({ name: t(x[1]), color: x[2], dash: x[0] !== 'base', width: x[0] === 'base' ? 3 : 2, data: R[x[0]].wdw.map((d) => ({ x: d.age, v: d.balance })) }));
  return '<div class="fire-sec"><h3>' + esc(t('wdwTitle')) + '</h3><p class="hint">' + esc(t('wdwSub')) + '</p></div>' + lineChart(ser, t('wdwTitle')) +
    '<div class="fire-sc">' + sc.map((x) => {
      const r = R[x[0]];
      return '<div><span><b><i style="background:' + x[2] + '"></i>' + esc(t(x[1])) + '</b><small>' + esc(t('scRate', { r: num(r.post, 1), i: num(r.inf, 1) })) + '</small></span>' +
        '<b class="' + (r.runOut ? 'bad' : 'ok') + '">' + esc(r.runOut ? t('runOut', { a: r.runOut }) : t('lasts')) + '</b></div>';
    }).join('') + '</div>';
}
/** Percepat FIRE: setoran tambahan, Coast FIRE, angka FIRE hari ini (tanpa input di dalamnya). */
function fireExtraHtml(s, R) {
  const fx = (icon, title, body) => '<div class="fx-row"><span class="set-ic">' + ic(icon, 20) + '</span><div class="grow"><b>' + esc(title) + '</b>' + body + '</div></div>';
  let h;
  if (s.extraMonthly <= 0 || R.empty) h = fx('coins', t('boostHabit'), '<p>' + esc(R.empty ? t('fiEmpty') : t('boostEmpty')) + '</p>');
  else {
    const res = R.fiAgeHabit === null ? t('boostNone') : R.fiAge === null ? t('boostReach', { a: R.fiAgeHabit }) :
      R.fiAgeHabit < R.fiAge ? t('boostFaster', { a: R.fiAgeHabit, n: R.fiAge - R.fiAgeHabit }) : t('boostSame', { a: R.fiAge });
    h = fx('coins', t('boostHabit'), '<p>' + esc(t('boostHabitText', { rp: rp(s.extraMonthly) })) + '</p><p class="fx-res">' + esc(res) + '</p>');
  }
  if (R.empty) return h;
  const cp = R.coast > 0 ? Math.min(100, s.currentSavings / R.coast * 100) : 100;
  h += fx('sprout', t('coastTitle'), '<p>' + esc(R.coastOk ? t('coastOk', { a: R.retireAge }) : t('coastNo', { rp: compactRp(R.coast), a: R.retireAge })) + '</p>' +
    progress(cp) + '<small class="dim">' + num(Math.floor(cp), 0) + '%</small>');
  h += fx('target', t('fireNowTitle'), '<p>' + esc(t('fireNowText', { rp: rp(R.fireNow), m: num(R.mult, 1), y: rp(R.monthlyExpenses * 12) })) + '</p>');
  return h;
}
function fireView() {
  const c = fireCalc();
  const s = c.s, R = c.R, f = inp('fire');
  const tab = ui('fire').tab;
  const nominal = { needsPct: R.monthlyNeeds, entPct: R.monthlyEnt, invPct: R.monthlyInvestment, goldPct: R.monthlyGold };
  const top = hero(fireHeroHtml(s, R), { order: 1, label: t('fiScore') });
  const data = card(t('fireData'), '<div class="fire-ages">' + fNum('fire.currentAge', t('ageNow'), { min: 15, max: 80 }) + fNum('fire.targetAge', t('ageTarget'), { min: 16, max: 90 }) + '</div>' +
    '<p class="hint warn" data-live="ageWarn">' + (s.targetAge <= s.currentAge ? esc(t('ageWarn')) : '') + '</p>' +
    '<div style="margin-top:12px">' + fToggle('fire.incomeAuto', t('useNet'), esc(t('useNetSub', { rp: rp(netSalary().avgNet) })) + gajiLink(), { live: 'incomeAuto' }) + '</div>' +
    (f.incomeAuto ? '' : fMoney('fire.monthlyIncome', t('incomeL'), { hint: manualOnlyHint() })) + fMoney('fire.currentSavings', t('savingsL'), { hint: esc(t('savingsHint')) }), { order: 2, tight: true });
  const alloc = '<section class="card" style="order:3"><div class="card-title" style="margin-bottom:4px"><span>' + esc(t('allocTitle')) + '</span>' +
    '<span data-live="alloc"><span class="fire-pill ' + (R.totalAlloc === 100 ? 'ok' : R.totalAlloc < 100 ? 'under' : 'over') + '">' + esc(t('allocTotal', { p: R.totalAlloc })) + '</span></span></div>' +
    FIRE_PCT.map((x) => fSlider('fire.' + x[0], t(x[1]), 0, 100, 1, (v) => v + '%', { dot: x[2], sub: () => esc(t('perMonth', { rp: rp(nominal[x[0]]) })) })).join('') +
    '<p class="hint warn" data-live="allocWarn">' + (R.totalAlloc === 100 ? '' : esc(t('allocWarn'))) + '</p>' +
    '<p class="hint" data-live="emerg" style="margin-top:8px">' + (R.empty ? '' : esc(t('emergHint', { rp: rp(R.emergency) }) + (R.emergencyMonths ? t('emergMonths', { n: R.emergencyMonths }) : ''))) + '</p></section>';
  const assume = '<section class="card" style="order:4"><div class="card-title" style="margin-bottom:4px"><span>' + esc(t('assumeTitle')) + '</span></div>' +
    FIRE_RATES.map((x) => fSlider('fire.' + x[0], t(x[1]), x[2], x[3], 0.5, (v) => t('perYear', { p: num(v, 1) }))).join('') +
    fSegField('fire.swr', t('swrL'), [3, 3.5, 4].map((v) => [v, num(v, 1) + '%']), { hint: esc(t('swrHint')) }) + '</section>';
  const results = '<section class="card" style="order:5"><div class="seg" role="group" aria-label="FIRE">' +
    [['summary', 'tSummary'], ['acc', 'tAcc'], ['wdw', 'tWdw']].map((x) => '<button type="button" data-act="ui" data-k="fire.tab" data-v="' + x[0] + '" aria-pressed="' + (tab === x[0]) + '">' + esc(t(x[1])) + '</button>').join('') +
    '</div><div data-live="fireBody">' + (tab === 'acc' ? fireAccHtml(s, R) : tab === 'wdw' ? fireWdwHtml(s, R) : fireSummaryHtml(s, R)) + '</div></section>';
  const extra = '<section class="card" style="order:6"><div class="card-title" style="margin-bottom:0"><span>' + esc(t('boostTitle')) + '</span></div>' +
    fMoney('fire.extraMonthly', t('extraL'), { hint: esc(t('extraHint')) }) + '<div data-live="fireExtra" style="margin-top:6px">' + fireExtraHtml(s, R) + '</div></section>';
  // HP: input dulu lalu hasil (urut order); desktop: kiri hasil, kanan input
  return cols((f.incomeAuto && gajiEmpty() ? needGajiCard() : '') + top, results + extra, data + alloc + assume, note(esc(t('fireNote')), 7));
}
