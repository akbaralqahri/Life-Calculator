'use strict';
/* =====================================================================
 * Hidup → Cicilan & KPR: KPR, kendaraan, KTA (anuitas / flat / efektif),
 * bunga fix lalu floating, rasio cicilan vs gaji, dana awal, amortisasi,
 * dan pelunasan dipercepat. Rumus di js/engine/cicilan.js.
 * ===================================================================== */

Object.assign(I18N.id, {
  cicTitle: 'Kalkulator Cicilan & KPR', cicShort: 'Cicilan', cicSub: 'KPR, kendaraan & KTA · anuitas, flat, efektif',
  cicData: 'Data pinjaman', cicJenis: 'Jenis pinjaman', cicJenisHint: 'Memilih jenis mengisi angka bawaan yang wajar — semuanya tetap bisa diubah.',
  cicJenisOpt: { kpr: 'KPR', kendaraan: 'Kendaraan', kta: 'KTA' },
  cicHarga: { kpr: 'Harga rumah', kendaraan: 'Harga kendaraan (OTR)', kta: 'Jumlah pinjaman' },
  cicDp: 'Uang muka (DP)', cicDpSub: 'DP {dp} · pokok pinjaman {p}', cicTenor: 'Tenor', cicYears: 'tahun',
  cicMetode: 'Metode bunga', cicMetodeOpt: { anuitas: 'Anuitas', flat: 'Flat', efektif: 'Efektif' },
  cicMetodeHint: {
    anuitas: 'Cicilan tetap per fase; porsi bunga besar di awal. Umum untuk KPR.',
    flat: 'Bunga dihitung dari pokok awal sepanjang tenor. Umum untuk kredit kendaraan & KTA.',
    efektif: 'Pokok tetap + bunga dari sisa pokok, jadi cicilan menurun tiap bulan.'
  },
  cicBungaFlat: 'Bunga flat', cicFlatEq: 'Setara bunga efektif ±{p}% / thn.', cicBungaFix: 'Bunga masa fix', cicLamaFix: 'Lama fix',
  cicBungaFloat: 'Bunga floating setelah masa fix', cicFloatHint: 'Perkiraan; bank menyesuaikan floating mengikuti SBDK & suku bunga acuan.', cicPerYr: '% / thn',
  cicAdv: 'Opsi lanjutan', cicProvisi: 'Biaya provisi', cicProvisiHint: 'Persen dari pokok pinjaman, biasanya 0,5–1%.',
  cicBiaya: 'Biaya admin, notaris & lainnya', cicBiayaHint: {
    kpr: 'Mis. notaris/PPAT, appraisal, asuransi jiwa & kebakaran, BPHTB. Isi perkiraanmu.',
    kendaraan: 'Mis. biaya admin & asuransi kendaraan yang dibayar di muka.', kta: 'Biaya admin di luar provisi (bila ada).'
  },
  cicExtra: 'Bayar ekstra per bulan', cicExtraHint: 'Dipakai langsung mengurangi pokok; cicilan tetap sehingga lunas lebih cepat.',
  cicHeroPay: 'Cicilan per bulan', cicHeroFix: 'Cicilan per bulan · masa fix {n} thn ({r}%)', cicHeroFirst: 'Cicilan bulan pertama',
  cicAfterFloat: 'Setelah floating ({r}%)', cicLastPay: 'Cicilan terakhir', cicPokok: 'Pokok pinjaman', cicTotInt: 'Total bunga',
  cicTotPaid: 'Total dibayar', cicPayoff: 'Lunas dalam', cicPayoffExtra: 'Lunas dalam (dengan bayar ekstra)', cicEmpty: 'Isi harga & tenor untuk melihat cicilan.',
  cicRatioTitle: 'Rasio cicilan vs penghasilan', cicUseNet: 'Pakai gaji bersih', cicUseNetSub: '{rp} / bln dari kalkulator Gaji Bersih',
  cicIncome: 'Penghasilan bersih / bulan', cicIncomeHint: 'Boleh gabungan penghasilan suami-istri (joint income).',
  cicOfIncome: 'dari penghasilan bersih', cicStSafe: 'Aman', cicStWatch: 'Waspada', cicStHeavy: 'Berat',
  cicRatioFix: 'Masa fix ({r}%)', cicRatioFloat: 'Setelah floating ({r}%)', cicRatioFirst: 'Cicilan terbesar',
  cicRatioRule: 'Patokan: ≤ 30% aman · 30–40% waspada · > 40% berat. Dihitung dari cicilan terbesar.',
  cicNoIncome: 'Isi penghasilan bersih untuk melihat rasio dan plafon aman.',
  cicMaxLoan: 'Plafon pinjaman maksimal aman', cicMaxPrice: 'Harga maksimal (plafon + DP {dp})',
  cicMaxHint: 'Cicilan 30% penghasilan ({rp}/bln) pada bunga {r}% selama {n} — konservatif.',
  cicUpTitle: 'Dana awal yang perlu disiapkan', cicUpDp: 'Uang muka ({p}%)', cicUpProv: 'Provisi ({p}%)', cicUpOther: 'Admin, notaris & lainnya', cicUpTotal: 'Total dana awal',
  cicUpKta: 'Pada KTA, provisi & admin biasanya dipotong dari dana yang cair.',
  cicChart: 'Sisa pokok & bunga per tahun', cicChartSub: 'Sumbu bawah: tahun ke-', cicSerBal: 'Sisa pokok', cicSerInt: 'Bunga kumulatif', cicSerBase: 'Sisa pokok tanpa bayar ekstra',
  cicExtraTitle: 'Pelunasan dipercepat', cicExtraNone: 'Isi "Bayar ekstra per bulan" di Opsi lanjutan untuk melihat seberapa cepat pinjaman lunas dan bunga yang dihemat.',
  cicExtraOpen: 'Buka opsi lanjutan', cicExtraRes: 'Lunas {d} lebih cepat', cicExtraSave: 'Hemat bunga {rp} dengan bayar ekstra {x}/bln',
  cicExtraNo: 'Belum mempercepat pelunasan', cicTenorNormal: 'Tenor normal', cicTenorFast: 'Dengan bayar ekstra', cicIntNormal: 'Total bunga normal', cicIntFast: 'Total bunga dengan ekstra',
  cicTblTitle: 'Tabel amortisasi per tahun', cicTblSmall: 'dalam rupiah', cicTblExtra: 'termasuk bayar ekstra',
  cicThYear: 'Tahun', cicThPay: 'Cicilan/bln', cicThPrin: 'Pokok dibayar', cicThInt: 'Bunga dibayar', cicThBal: 'Sisa pokok',
  cicSumSub: '{p}% penghasilan · {n}', cicSumSubNo: 'Tenor {n}',
  cicNote: 'Estimasi edukatif, bukan nasihat keuangan. Bunga bulanan = tarif tahunan ÷ 12 (konvensi bank di Indonesia). Bawaan (perkiraan Okt 2026, ubah sesuai penawaran bankmu): KPR promo fix ±2,5–5% selama 1–5 tahun lalu floating ±11–14% mengikuti SBDK (mis. SBDK KPR BTN 7,95% & floating BCA ±11%, Agu 2026 — Kontan, industry.co.id); kredit kendaraan flat ±1,7–3,75% untuk promo tenor 1–4 tahun, ±4–6% untuk 5 tahun (Bisnis.com, Feb 2026); KTA ±0,6–1,5% per bulan. Anuitas: cicilan dihitung ulang dari sisa pokok & sisa tenor saat masa fix habis. Bayar ekstra: cicilan dianggap tetap dan tanpa penalti; pada bunga flat, bunga bulan yang tidak dijalani dianggap tidak ditagih — cek aturan pelunasan dipercepat di bankmu. Rasio 30% adalah patokan umum perencanaan keuangan; bank biasanya membatasi ±30–40% penghasilan.'
});
Object.assign(I18N.en, {
  cicTitle: 'Loan & Mortgage Calculator', cicShort: 'Loans', cicSub: 'Mortgage, vehicle & personal loans · annuity, flat, declining',
  cicData: 'Loan details', cicJenis: 'Loan type', cicJenisHint: 'Picking a type fills in sensible defaults — you can change all of them.',
  cicJenisOpt: { kpr: 'Mortgage', kendaraan: 'Vehicle', kta: 'Personal' },
  cicHarga: { kpr: 'House price', kendaraan: 'Vehicle price (OTR)', kta: 'Loan amount' },
  cicDp: 'Down payment', cicDpSub: 'DP {dp} · loan principal {p}', cicTenor: 'Term', cicYears: 'years',
  cicMetode: 'Interest method', cicMetodeOpt: { anuitas: 'Annuity', flat: 'Flat', efektif: 'Declining' },
  cicMetodeHint: {
    anuitas: 'Fixed payment per phase; interest makes up most of the early payments. Common for mortgages.',
    flat: 'Interest is charged on the original principal for the whole term. Common for vehicle & personal loans.',
    efektif: 'Fixed principal + interest on the remaining balance, so payments fall every month.'
  },
  cicBungaFlat: 'Flat rate', cicFlatEq: 'Equivalent to ~{p}% / yr effective.', cicBungaFix: 'Fixed-period rate', cicLamaFix: 'Fixed period',
  cicBungaFloat: 'Floating rate after the fixed period', cicFloatHint: 'An estimate; banks reset floating rates with their prime lending rate (SBDK) & the policy rate.', cicPerYr: '% / yr',
  cicAdv: 'Advanced options', cicProvisi: 'Provision fee', cicProvisiHint: 'Percent of the loan principal, usually 0.5–1%.',
  cicBiaya: 'Admin, notary & other fees', cicBiayaHint: {
    kpr: 'E.g. notary/PPAT, appraisal, life & fire insurance, BPHTB. Enter your estimate.',
    kendaraan: 'E.g. admin fee & vehicle insurance paid up front.', kta: 'Admin fees on top of the provision fee (if any).'
  },
  cicExtra: 'Extra payment per month', cicExtraHint: 'Goes straight to the principal; the regular payment stays the same, so you finish sooner.',
  cicHeroPay: 'Monthly payment', cicHeroFix: 'Monthly payment · {n}-yr fixed period ({r}%)', cicHeroFirst: 'First monthly payment',
  cicAfterFloat: 'After floating ({r}%)', cicLastPay: 'Last payment', cicPokok: 'Loan principal', cicTotInt: 'Total interest',
  cicTotPaid: 'Total paid', cicPayoff: 'Paid off in', cicPayoffExtra: 'Paid off in (with extra payments)', cicEmpty: 'Enter a price & term to see the payment.',
  cicRatioTitle: 'Payment-to-income ratio', cicUseNet: 'Use net salary', cicUseNetSub: '{rp} / mo from the Net Salary calculator',
  cicIncome: 'Net income / month', cicIncomeHint: "You can use a couple's combined (joint) income.",
  cicOfIncome: 'of net income', cicStSafe: 'Safe', cicStWatch: 'Caution', cicStHeavy: 'Heavy',
  cicRatioFix: 'Fixed period ({r}%)', cicRatioFloat: 'After floating ({r}%)', cicRatioFirst: 'Largest payment',
  cicRatioRule: 'Rule of thumb: ≤ 30% safe · 30–40% caution · > 40% heavy. Based on the largest payment.',
  cicNoIncome: 'Enter your net income to see the ratio and a safe loan limit.',
  cicMaxLoan: 'Maximum safe loan', cicMaxPrice: 'Maximum price (loan + DP {dp})',
  cicMaxHint: 'A payment of 30% of income ({rp}/mo) at {r}% over {n} — conservative.',
  cicUpTitle: 'Cash needed up front', cicUpDp: 'Down payment ({p}%)', cicUpProv: 'Provision ({p}%)', cicUpOther: 'Admin, notary & other', cicUpTotal: 'Total up-front cash',
  cicUpKta: 'For personal loans, provision & admin fees are usually deducted from the disbursed amount.',
  cicChart: 'Remaining principal & interest by year', cicChartSub: 'Bottom axis: year', cicSerBal: 'Remaining principal', cicSerInt: 'Cumulative interest', cicSerBase: 'Remaining principal without extra payments',
  cicExtraTitle: 'Paying off early', cicExtraNone: 'Enter an "Extra payment per month" under Advanced options to see how much sooner you finish and how much interest you save.',
  cicExtraOpen: 'Open advanced options', cicExtraRes: 'Paid off {d} sooner', cicExtraSave: 'Save {rp} in interest by paying an extra {x}/mo',
  cicExtraNo: 'Not paying off any sooner yet', cicTenorNormal: 'Normal term', cicTenorFast: 'With extra payments', cicIntNormal: 'Total interest, normal', cicIntFast: 'Total interest with extra',
  cicTblTitle: 'Yearly amortization table', cicTblSmall: 'in rupiah', cicTblExtra: 'incl. extra payments',
  cicThYear: 'Year', cicThPay: 'Payment/mo', cicThPrin: 'Principal paid', cicThInt: 'Interest paid', cicThBal: 'Balance',
  cicSumSub: '{p}% of income · {n}', cicSumSubNo: '{n} term',
  cicNote: 'An educational estimate, not financial advice. Monthly interest = annual rate ÷ 12 (Indonesian bank convention). Defaults (estimates as of Oct 2026 — change them to match your offer): promo fixed mortgage rates ~2.5–5% for 1–5 years, then floating ~11–14% following the prime lending rate (e.g. BTN mortgage SBDK 7.95% & BCA floating ~11%, Aug 2026 — Kontan, industry.co.id); vehicle loans ~1.7–3.75% flat for 1–4-year promos, ~4–6% for 5 years (Bisnis.com, Feb 2026); personal loans ~0.6–1.5% a month. Annuity: the payment is recalculated from the remaining balance & term when the fixed period ends. Extra payments: the regular payment is kept and no penalty is assumed; for flat loans, interest for months not used is assumed waived — check your bank\'s early-repayment rules. The 30% ratio is a common planning rule; banks usually cap payments at ~30–40% of income.'
});

/** Bawaan per jenis pinjaman (perkiraan Okt 2026, lihat cicNote). */
const CICILAN_PRESETS = {
  kpr: { harga: 750000000, dpPct: 20, tenor: 20, metode: 'anuitas', bungaFix: 5, lamaFix: 3, bungaFloat: 11, provisi: 1, biayaLain: 7500000 },
  kendaraan: { harga: 300000000, dpPct: 25, tenor: 5, metode: 'flat', bungaFix: 5, lamaFix: 5, bungaFloat: 5, provisi: 0, biayaLain: 2500000 },
  kta: { harga: 50000000, dpPct: 0, tenor: 3, metode: 'flat', bungaFix: 10, lamaFix: 3, bungaFloat: 10, provisi: 1, biayaLain: 0 }
};
const CICILAN_METHODS = ['anuitas', 'flat', 'efektif'];

calc({
  id: 'cicilan', icon: 'home', color: '#0e7490', title: 'cicTitle', short: 'cicShort', sub: 'cicSub',
  defaults: Object.assign({ jenis: 'kpr' }, CICILAN_PRESETS.kpr, { extra: 0, useNet: true, income: 15000000 }),
  ui: { adv: false },
  clean(o) {
    if (!CICILAN_PRESETS[o.jenis]) o.jenis = 'kpr';
    if (CICILAN_METHODS.indexOf(o.metode) < 0) o.metode = 'anuitas';
    ['harga', 'biayaLain', 'extra', 'income'].forEach((k) => { o[k] = clamp(Math.round(o[k]), 0, 999999999999999); });
    o.dpPct = clamp(Math.round(o.dpPct), 0, 90);
    o.tenor = clamp(Math.round(o.tenor), 1, 35);
    o.lamaFix = clamp(Math.round(o.lamaFix), 0, 35);
    ['bungaFix', 'bungaFloat'].forEach((k) => { o[k] = clamp(Math.round(o[k] * 100) / 100, 0, 40); });
    o.provisi = clamp(Math.round(o.provisi * 100) / 100, 0, 10);
    return o;
  },
  onSet(key, v) {
    if (key === 'jenis' && CICILAN_PRESETS[v]) Object.assign(inp('cicilan'), CICILAN_PRESETS[v]);
  },
  view: cicilanView,
  summary() {
    const c = cicilanCalc();
    if (!c.base.monthsToPayoff) return { value: '–', sub: t('cicEmpty') };
    const n = t('yearsN', { n: c.s.tenor });
    return {
      value: rp(c.base.payFirst) + ' ' + t('perMonthShort'),
      sub: c.ratio.pct !== null ? t('cicSumSub', { p: num(c.ratio.pct, 0), n: n }) : t('cicSumSubNo', { n: n })
    };
  }
});

/** Semua angka turunan dari input (dipakai tampilan & ringkasan Beranda). */
function cicilanCalc() {
  const s = inp('cicilan');
  const kta = s.jenis === 'kta';
  const flat = s.metode === 'flat';
  const dp = kta ? 0 : Math.round(s.harga * s.dpPct / 100);
  const principal = Math.max(0, s.harga - dp);
  const o = {
    principal, years: s.tenor, method: s.metode, fixedRate: s.bungaFix,
    fixedYears: flat ? s.tenor : Math.min(s.lamaFix, s.tenor), floatRate: flat ? s.bungaFix : s.bungaFloat, extra: s.extra
  };
  const e = loanExtraEffect(o);
  const income = s.useNet ? netSalary().avgNet : s.income;
  const ratio = loanRatio(e.base.payMax, income);
  // plafon aman: cicilan 30% penghasilan pada bunga floating (konservatif: tarif tertinggi)
  const safeRate = flat ? s.bungaFix : Math.max(s.bungaFix, s.bungaFloat);
  const maxLoan = income > 0 ? loanMaxPrincipal(income * 0.3, safeRate, s.tenor, s.metode) : 0;
  const provisi = principal * s.provisi / 100;
  return {
    s, kta, flat, dp, principal, o, base: e.base, R: e.fast, monthsSaved: e.monthsSaved, interestSaved: e.interestSaved,
    income, ratio, safeRate, maxLoan, maxPrice: maxLoan + dp, provisi, upfront: dp + provisi + s.biayaLain,
    flatEq: flat ? loanFlatToEffective(s.bungaFix, s.tenor) : null
  };
}
/** Lama dalam bulan → "12 tahun 4 bulan". */
function cicilanDur(m) {
  const y = Math.floor(m / 12), r = m % 12;
  return [y ? t('yearsN', { n: y }) : '', r || !y ? t('monthsN', { n: r }) : ''].filter(Boolean).join(' ');
}
/** Angka rupiah tanpa "Rp" untuk tabel (ikut privacy mode). */
function cicilanAmt(n) { return S.prefs.privacy ? '•••' : ID_NUM.format(Math.round(n || 0)); }
const cicilanPct = (v) => num(v, 2);

function cicilanHeroHtml(c) {
  const b = c.base, s = c.s;
  if (!b.monthsToPayoff) return '<span class="lbl">' + esc(t('cicHeroPay')) + '</span><span class="big">–</span>' + heroLine(esc(t('cicEmpty')));
  const lbl = s.metode === 'efektif' ? t('cicHeroFirst') : b.pay2 !== null ? t('cicHeroFix', { n: s.lamaFix, r: cicilanPct(s.bungaFix) }) : t('cicHeroPay');
  let h = '<span class="lbl">' + esc(lbl) + '</span><span class="big">' + esc(rp(b.payFirst)) + ' <small>' + esc(t('perMonthShort')) + '</small></span>';
  h += heroCells([[t('cicPokok'), esc(compactRp(c.principal))], [t('cicTotInt'), esc(compactRp(c.R.totalInterest))]]);
  h += '<span class="sep"></span>';
  if (b.pay2 !== null && s.metode === 'anuitas') h += heroLine(esc(t('cicAfterFloat', { r: cicilanPct(s.bungaFloat) })), esc(rp(b.pay2)));
  if (s.metode === 'efektif') h += heroLine(esc(t('cicLastPay')), esc(rp(b.payLast)));
  h += heroLine(esc(t('cicTotPaid')), esc(rp(c.R.totalPaid)));
  h += heroLine(esc(t(s.extra > 0 && c.monthsSaved > 0 ? 'cicPayoffExtra' : 'cicPayoff')), esc(cicilanDur(c.R.monthsToPayoff)));
  return h;
}

function cicilanInputHtml(c) {
  const s = c.s, u = ui('cicilan');
  const yr = t('cicYears');
  let h = fSegField('cicilan.jenis', t('cicJenis'), ['kpr', 'kendaraan', 'kta'].map((k) => [k, L('cicJenisOpt')[k]]), { hint: esc(t('cicJenisHint')) }) +
    fMoney('cicilan.harga', L('cicHarga')[s.jenis]);
  if (!c.kta) {
    h += '<div style="margin-top:10px">' + fSlider('cicilan.dpPct', t('cicDp'), 0, 90, 1, (v) => v + '%',
      { sub: () => esc(t('cicDpSub', { dp: rp(c.dp), p: rp(c.principal) })) }) + '</div>';
  }
  h += fNum('cicilan.tenor', t('cicTenor'), { min: 1, max: 35, suffix: yr }) +
    fSegField('cicilan.metode', t('cicMetode'), CICILAN_METHODS.map((k) => [k, L('cicMetodeOpt')[k]]), { hint: esc(L('cicMetodeHint')[s.metode]) });
  if (c.flat) {
    h += fNum('cicilan.bungaFix', t('cicBungaFlat'), { min: 0, max: 40, dec: true, suffix: t('cicPerYr') }) +
      '<p class="hint" data-live="cicFlatEq" style="margin-top:6px">' + (s.bungaFix > 0 ? esc(t('cicFlatEq', { p: num(c.flatEq, 1) })) : '') + '</p>';
  } else {
    h += '<div class="row2">' + fNum('cicilan.bungaFix', t('cicBungaFix'), { min: 0, max: 40, dec: true, suffix: t('cicPerYr') }) +
      fNum('cicilan.lamaFix', t('cicLamaFix'), { min: 0, max: 35, suffix: yr }) + '</div>' +
      fNum('cicilan.bungaFloat', t('cicBungaFloat'), { min: 0, max: 40, dec: true, suffix: t('cicPerYr'), hint: esc(t('cicFloatHint')) });
  }
  h += '<button type="button" class="disclose" data-act="ui" data-k="cicilan.adv" aria-expanded="' + !!u.adv + '" style="border-top:1px solid var(--line);margin-top:14px"><span>' +
    esc(t('cicAdv')) + '</span>' + ic('chevD', 20) + '</button>';
  if (u.adv) {
    h += fNum('cicilan.provisi', t('cicProvisi'), { min: 0, max: 10, dec: true, suffix: '%', hint: esc(t('cicProvisiHint')) }) +
      fMoney('cicilan.biayaLain', t('cicBiaya'), { hint: esc(L('cicBiayaHint')[s.jenis]) }) +
      fMoney('cicilan.extra', t('cicExtra'), { hint: esc(t('cicExtraHint')) });
  }
  return card(t('cicData'), h, { order: 2, tight: true });
}

function cicilanRatioHtml(c) {
  const s = c.s, b = c.base;
  let h = '<section class="card" style="order:3"><div class="card-title" style="margin-bottom:0"><span>' + esc(t('cicRatioTitle')) + '</span></div>' +
    '<div style="margin-top:6px">' + fToggle('cicilan.useNet', t('cicUseNet'), esc(t('cicUseNetSub', { rp: rp(netSalary().avgNet) })), { first: true }) + '</div>' +
    (s.useNet ? '' : fMoney('cicilan.income', t('cicIncome'), { hint: esc(t('cicIncomeHint')) }));
  let live;
  if (c.ratio.pct === null) live = '<p class="hint" style="margin-top:10px">' + esc(t('cicNoIncome')) + '</p>';
  else if (!b.monthsToPayoff) live = '<p class="hint" style="margin-top:10px">' + esc(t('cicEmpty')) + '</p>';
  else {
    const st = c.ratio.status;
    const pill = st === 'safe' ? ['above', 'cicStSafe'] : st === 'watch' ? ['at', 'cicStWatch'] : ['below', 'cicStHeavy'];
    const pctOf = (p) => num(p / c.income * 100, 1) + '%';
    let rows = '';
    if (b.pay2 !== null) {
      rows += row(t('cicRatioFix', { r: cicilanPct(s.bungaFix) }), esc(rp(b.pay1)) + ' · ' + pctOf(b.pay1)) +
        row(t('cicRatioFloat', { r: cicilanPct(s.bungaFloat) }), esc(rp(b.pay2)) + ' · ' + pctOf(b.pay2));
    } else rows += row(t('cicRatioFirst'), esc(rp(b.payMax)) + ' · ' + pctOf(b.payMax));
    rows += row(t('cicMaxLoan'), esc(rp(c.maxLoan)), 'total') + (c.kta ? '' : row(t('cicMaxPrice', { dp: compactRp(c.dp) }), esc(rp(c.maxPrice))));
    live = '<div class="wage-pos"><div class="wp-big"><b>' + num(c.ratio.pct, 1) + '%</b><span>' + esc(t('cicOfIncome')) + '</span></div>' +
      '<span class="st-pill ' + pill[0] + '">' + esc(t(pill[1])) + '</span></div>' +
      '<p class="hint" style="margin-top:8px">' + esc(t('cicRatioRule')) + '</p><div class="rows" style="margin-top:6px">' + rows + '</div>' +
      '<p class="hint" style="margin-top:6px">' + esc(t('cicMaxHint', { rp: rp(c.income * 0.3), r: cicilanPct(c.safeRate), n: t('yearsN', { n: s.tenor }) })) + '</p>';
  }
  return h + '<div data-live="cicRatio">' + live + '</div></section>';
}

function cicilanUpfrontHtml(c) {
  const s = c.s;
  const body = '<div class="rows" data-live="cicUp">' + (c.kta ? '' : row(t('cicUpDp', { p: s.dpPct }), esc(rp(c.dp)))) +
    row(t('cicUpProv', { p: cicilanPct(s.provisi) }), esc(rp(c.provisi))) + row(t('cicUpOther'), esc(rp(s.biayaLain))) +
    row(t('cicUpTotal'), esc(rp(c.upfront)), 'total') + '</div>' +
    (c.kta ? '<p class="hint" style="margin-top:6px">' + esc(t('cicUpKta')) + '</p>' : '<p class="hint" style="margin-top:6px">' + esc(L('cicBiayaHint')[s.jenis]) + '</p>');
  return card(t('cicUpTitle'), body, { order: 4, tight: true });
}

function cicilanChartHtml(c) {
  const b = c.base, R = c.R;
  if (!b.monthsToPayoff) return '';
  const n = b.years.length;
  const at = (arr, i, key, fill) => (i === 0 ? (key === 'balance' ? c.principal : 0) : arr[i - 1] ? arr[i - 1][key] : fill);
  const xs = [];
  for (let i = 0; i <= n; i++) xs.push(i);
  const ser = [
    { name: t('cicSerBal'), color: 'var(--accent)', width: 3, area: true, data: xs.map((i) => ({ x: i, v: at(R.years, i, 'balance', 0) })) },
    { name: t('cicSerInt'), color: 'var(--amber)', data: xs.map((i) => ({ x: i, v: at(R.years, i, 'cumInterest', R.totalInterest) })) }
  ];
  if (c.monthsSaved > 0) ser.push({ name: t('cicSerBase'), color: '#5b6b87', dash: true, data: xs.map((i) => ({ x: i, v: at(b.years, i, 'balance', 0) })) });
  return card(t('cicChart'), '<div data-live="cicChart">' + lineChart(ser, t('cicChart')) + '</div><p class="hint" style="margin-top:6px">' + esc(t('cicChartSub')) + '</p>', { order: 5, small: esc(t('cicTblSmall')) });
}

function cicilanExtraHtml(c) {
  const s = c.s;
  let live;
  if (!(s.extra > 0) || !c.base.monthsToPayoff) {
    live = '<p class="hint">' + esc(t('cicExtraNone')) + '</p>' +
      (ui('cicilan').adv ? '' : '<button type="button" class="link-btn" data-act="ui" data-k="cicilan.adv" data-v="1">' + esc(t('cicExtraOpen')) + ic('chevR', 18) + '</button>');
    return card(t('cicExtraTitle'), live, { order: 6 });
  }
  live = (c.monthsSaved > 0 ?
    callout('trendDown', esc(t('cicExtraRes', { d: cicilanDur(c.monthsSaved) })), esc(t('cicExtraSave', { rp: rp(c.interestSaved), x: rp(s.extra) }))) :
    callout('info', esc(t('cicExtraNo')), '', 'plain')) +
    '<div class="rows" style="margin-top:8px">' + row(t('cicTenorNormal'), esc(cicilanDur(c.base.monthsToPayoff))) + row(t('cicTenorFast'), esc(cicilanDur(c.R.monthsToPayoff))) +
    row(t('cicIntNormal'), esc(rp(c.base.totalInterest))) + row(t('cicIntFast'), esc(rp(c.R.totalInterest)), 'total') + '</div>';
  return card(t('cicExtraTitle'), '<div data-live="cicExtra">' + live + '</div>', { order: 6 });
}

function cicilanTableHtml(c) {
  const R = c.R;
  if (!R.monthsToPayoff) return '';
  const head = '<thead><tr><th scope="col" style="text-align:left">' + esc(t('cicThYear')) + '</th><th scope="col">' + esc(t('cicThPay')) + '</th><th scope="col">' +
    esc(t('cicThPrin')) + '</th><th scope="col">' + esc(t('cicThInt')) + '</th><th scope="col">' + esc(t('cicThBal')) + '</th></tr></thead>';
  const body = R.years.map((y) => '<tr><th scope="row">' + y.year + '</th><td>' + cicilanAmt(y.payAvg) + '</td><td>' + cicilanAmt(y.principal) + '</td><td>' +
    cicilanAmt(y.interest) + '</td><td>' + cicilanAmt(y.balance) + '</td></tr>').join('');
  return card(t('cicTblTitle'), '<div class="tbl-wrap" data-live="cicTbl"><table class="cmp-table">' + head + '<tbody>' + body + '</tbody></table></div>',
    { order: 7, cls: 'span2', small: esc(c.s.extra > 0 && c.monthsSaved > 0 ? t('cicTblExtra') : t('cicTblSmall')) });
}

function cicilanView() {
  const c = cicilanCalc();
  const top = hero(cicilanHeroHtml(c), { order: 1, label: t('cicHeroPay') });
  // HP: hero → input → hasil (urut order); desktop: kiri hasil, kanan input
  return cols(top, cicilanRatioHtml(c) + cicilanChartHtml(c) + cicilanExtraHtml(c),
    cicilanInputHtml(c) + cicilanUpfrontHtml(c), cicilanTableHtml(c) + note(esc(t('cicNote')), 8));
}
