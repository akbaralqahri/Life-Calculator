'use strict';
/* =====================================================================
 * Rencana → Target Tabungan & DCA.
 * Mode Target (target → setoran/bln) dan Simulasi (setoran/bln → hasil akhir).
 * Rumus di js/engine/tabungan.js (bunga majemuk bulanan sama dengan FIRE).
 * ===================================================================== */

Object.assign(I18N.id, {
  savTitle: 'Target Tabungan & DCA', savShort: 'Tabungan', savSub: 'Berapa yang harus disisihkan tiap bulan?',
  savModeTarget: 'Target', savModeSim: 'Simulasi', savModeL: 'Mode hitung',
  savGoal: 'Tujuan', savPresetL: 'Pilih tujuan', savNameL: 'Nama tujuan', savTargetL: 'Target (nilai uang hari ini)',
  savInflL: 'Sesuaikan inflasi', savInflSub: 'Target naik {p}% / thn → {rp} saat jatuh tempo', savInflRate: 'Inflasi',
  savYearsL: 'Jangka waktu', savMonthsL: '+ bulan', savDurHint: 'Total {d} (1 bulan – 40 tahun).',
  savInitL: 'Tabungan yang sudah ada', savInitHint: 'Dana yang sudah terkumpul untuk tujuan ini, ikut tumbuh dengan return.',
  savInvest: 'Setoran & investasi', savMonthlyL: 'Setoran per bulan', savRetL: 'Perkiraan return', savRetChips: 'Perkiraan return per instrumen',
  savStepL: 'Kenaikan setoran per tahun', savStepHint: 'Opsional (step-up). Mis. 5% bila setoran naik mengikuti kenaikan gaji.',
  savHeroNeed: 'Setoran per bulan yang dibutuhkan', savHeroNeedStep: 'Setoran bulan pertama yang dibutuhkan', savHeroSim: 'Perkiraan nilai akhir · {d}',
  savPaid: 'Total disetor (+ tabungan awal)', savGain: 'Hasil investasi', savTargetAt: 'Target {name}', savLastPmt: 'Setoran bulan terakhir',
  savAlready: 'Sudah tercapai oleh tabungan yang ada', savHit: 'Target tercapai di bulan ke-{m}', savShortBy: 'Kurang {rp} dari target',
  savResTitle: 'Ringkasan', savStReached: 'Tercapai', savStShort: 'Belum tercapai',
  savNeedLine: '{rp} / bln selama {d}', savNeedSub: '≈ {p}% dari gaji bersih rata-rata ({net}/bln)', savNeedSubNo: 'Setoran di akhir tiap bulan, return {r}% / thn.',
  savStepLine: 'Naik {p}% tiap tahun — bulan terakhir {rp}.',
  savAlreadySub: 'Tabungan {rp} tumbuh {r}% / thn menjadi ±{fv} — cukup tanpa setoran baru.',
  savSimOk: 'Target tercapai di bulan ke-{m}', savSimOkSub: 'Nilai akhir {fv} vs target {tg}.',
  savSimNo: 'Kurang {rp} dari target', savSimNoSub: 'Butuh {need}/bln (bukan {cur}) agar target {tg} tercapai.',
  savNoRet: 'Tanpa return, butuh {rp} / bln', savNoRetSub: 'Return {r}% menghemat {d} per bulan.', savNoRetSame: 'Sama dengan setoran di atas karena return 0%.',
  savLump: 'Atau setor sekali {rp} hari ini', savLumpSub: 'Lump sum di luar tabungan yang ada, dibiarkan tumbuh {r}% / thn selama {d}.',
  savLumpZero: 'Tabungan yang ada sudah cukup — tidak perlu setoran tambahan.',
  savRowTarget: 'Target (nilai hari ini)', savRowTargetFut: 'Target saat jatuh tempo (inflasi {p}%)', savRowInit: 'Tabungan awal',
  savRowDep: 'Setoran bulanan (jumlah)', savRowGain: 'Hasil investasi', savRowFinal: 'Nilai akhir',
  savChart: 'Saldo vs total setoran', savSerBal: 'Saldo', savSerPaid: 'Total disetor', savSerTarget: 'Target',
  savAxisM: 'Sumbu X: bulan ke-', savAxisY: 'Sumbu X: tahun ke-',
  savTbl: 'Rincian per tahun', savThYear: 'Tahun', savThPmt: 'Setoran / bln', savThPaid: 'Total disetor', savThBal: 'Saldo', savPartial: '{y} (+{m} bln)',
  savDurWarn: 'Jangka waktu minimal 1 bulan.', savSumSim: 'Nilai akhir {d}', savSumTarget: '{name} · {rp} dalam {d}',
  savPresets: { nikah: 'Dana nikah', rumah: 'DP rumah', liburan: 'Liburan', ibadah: 'Umrah', gadget: 'Gadget / kendaraan', lain: 'Lainnya' },
  savInstr: { tab: 'Tabungan', depo: 'Deposito', rdpu: 'RDPU', sbn: 'SBN / obligasi', campur: 'RD campuran', saham: 'Saham / indeks' },
  savNote: 'Simulasi edukatif — bukan saran investasi. Bunga majemuk bulanan (1 + r)^(1/12) − 1, setoran di akhir bulan, sebelum pajak & biaya. ' +
    'Return instrumen adalah perkiraan per Oktober 2026: tabungan ±0–1%; deposito ±4–4,5% (bunga penjaminan LPS bank umum 3,75% berlaku 1 Okt 2026–31 Jan 2027, bunga di atasnya tidak dijamin; pajak bunga 20%); ' +
    'RDPU ±4–5%; SBN/obligasi ±5,5–6,5% (kupon ORI029 2026: 5,45–5,80%, pajak 10%); reksa dana campuran & saham berfluktuasi, rata-rata jangka panjang tidak dijamin. ' +
    'Preset tujuan: umrah paket reguler 12 hari ±Rp32–38 jt (2026); biaya haji reguler 2026 yang dibayar jemaah Rp54,1 jt dengan antrean bertahun-tahun; ' +
    'rata-rata biaya nikah ±Rp150–190 jt untuk 250–300 tamu (survei 2021); DP rumah 20% dari Rp750 jt. Semua angka bawaan bisa diubah.'
});
Object.assign(I18N.en, {
  savTitle: 'Savings Goal & DCA', savShort: 'Savings', savSub: 'How much should you set aside each month?',
  savModeTarget: 'Goal', savModeSim: 'Simulate', savModeL: 'Mode',
  savGoal: 'Goal', savPresetL: 'Pick a goal', savNameL: 'Goal name', savTargetL: "Target (today's money)",
  savInflL: 'Adjust for inflation', savInflSub: 'Target rises {p}% / yr → {rp} when due', savInflRate: 'Inflation',
  savYearsL: 'Time frame', savMonthsL: '+ months', savDurHint: 'Total {d} (1 month – 40 years).',
  savInitL: 'Already saved', savInitHint: 'Money already set aside for this goal; it grows with the return.',
  savInvest: 'Contributions & investing', savMonthlyL: 'Monthly contribution', savRetL: 'Expected return', savRetChips: 'Estimated return by instrument',
  savStepL: 'Yearly contribution increase', savStepHint: 'Optional (step-up). E.g. 5% if contributions rise with your salary.',
  savHeroNeed: 'Monthly contribution needed', savHeroNeedStep: 'First-month contribution needed', savHeroSim: 'Projected final value · {d}',
  savPaid: 'Total put in (incl. savings)', savGain: 'Investment growth', savTargetAt: 'Target {name}', savLastPmt: 'Last-month contribution',
  savAlready: 'Already reached with your current savings', savHit: 'Goal reached in month {m}', savShortBy: '{rp} short of the goal',
  savResTitle: 'Summary', savStReached: 'Reached', savStShort: 'Not reached',
  savNeedLine: '{rp} / mo for {d}', savNeedSub: '≈ {p}% of your average net salary ({net}/mo)', savNeedSubNo: 'Paid at the end of each month, {r}% / yr return.',
  savStepLine: 'Rising {p}% a year — {rp} in the last month.',
  savAlreadySub: '{rp} growing at {r}% / yr becomes ~{fv} — enough without new contributions.',
  savSimOk: 'Goal reached in month {m}', savSimOkSub: 'Final value {fv} vs target {tg}.',
  savSimNo: '{rp} short of the goal', savSimNoSub: 'You need {need}/mo (not {cur}) to reach {tg}.',
  savNoRet: 'With no return, you need {rp} / mo', savNoRetSub: 'A {r}% return saves you {d} a month.', savNoRetSame: 'Same as above because the return is 0%.',
  savLump: 'Or invest {rp} once, today', savLumpSub: 'A lump sum on top of your savings, left to grow at {r}% / yr for {d}.',
  savLumpZero: 'Your current savings are enough — no extra deposit needed.',
  savRowTarget: "Target (today's money)", savRowTargetFut: 'Target when due ({p}% inflation)', savRowInit: 'Starting savings',
  savRowDep: 'Monthly contributions (sum)', savRowGain: 'Investment growth', savRowFinal: 'Final value',
  savChart: 'Balance vs total contributed', savSerBal: 'Balance', savSerPaid: 'Total contributed', savSerTarget: 'Target',
  savAxisM: 'X axis: month', savAxisY: 'X axis: year',
  savTbl: 'Year by year', savThYear: 'Year', savThPmt: 'Monthly', savThPaid: 'Contributed', savThBal: 'Balance', savPartial: '{y} (+{m} mo)',
  savDurWarn: 'The time frame must be at least 1 month.', savSumSim: 'Final value in {d}', savSumTarget: '{name} · {rp} in {d}',
  savPresets: { nikah: 'Wedding', rumah: 'House down payment', liburan: 'Holiday', ibadah: 'Umrah', gadget: 'Gadget / vehicle', lain: 'Other' },
  savInstr: { tab: 'Savings acct', depo: 'Time deposit', rdpu: 'Money market', sbn: 'Gov. bonds', campur: 'Balanced fund', saham: 'Stocks / index' },
  savNote: 'An educational simulation — not investment advice. Monthly compounding (1 + r)^(1/12) − 1, contributions at month end, before tax & fees. ' +
    'Instrument returns are estimates as of October 2026: savings ~0–1%; time deposits ~4–4.5% (LPS guaranteed rate for commercial banks 3.75% from 1 Oct 2026–31 Jan 2027, interest above it is not insured; 20% tax); ' +
    'money market funds ~4–5%; government/other bonds ~5.5–6.5% (ORI029 2026 coupon 5.45–5.80%, 10% tax); balanced and equity funds fluctuate, long-run averages are not guaranteed. ' +
    'Goal presets: regular 12-day umrah package ~Rp32–38M (2026); 2026 regular hajj cost paid by pilgrims Rp54.1M with a multi-year queue; ' +
    'average wedding ~Rp150–190M for 250–300 guests (2021 survey); 20% down payment on a Rp750M home. All defaults can be changed.'
});

/** Preset tujuan: [kunci, target hari ini, tahun, bulan] */
const SAV_PRESETS = [['nikah', 150000000, 3, 0], ['rumah', 150000000, 5, 0], ['liburan', 20000000, 1, 0], ['ibadah', 35000000, 2, 0], ['gadget', 25000000, 1, 6], ['lain', 50000000, 3, 0]];
/** Chip instrumen: [kunci, perkiraan return %/thn] */
const SAV_INSTR = [['tab', 1], ['depo', 4.5], ['rdpu', 5], ['sbn', 6.5], ['campur', 8], ['saham', 10]];
const SAV_MAX_M = 480;

calc({
  id: 'tabungan', icon: 'coins', color: '#2f7d3b', title: 'savTitle', short: 'savShort', sub: 'savSub',
  defaults: {
    mode: 'target', preset: 'rumah', nama: 'DP rumah', target: 150000000, inflasi: true, inflRate: 4, inflTouched: false,
    years: 5, months: 0, initial: 10000000, ret: 6.5, stepUp: 0, monthly: 2000000
  },
  clean(o) {
    if (o.mode !== 'sim') o.mode = 'target';
    if (!SAV_PRESETS.some((p) => p[0] === o.preset)) o.preset = 'lain';
    ['target', 'initial', 'monthly'].forEach((k) => { o[k] = clamp(Math.round(o[k]), 0, 999999999999999); });
    // inflasi bawaan mengikuti kalkulator FIRE sampai pengguna mengubahnya sendiri
    if (!o.inflTouched && CALCS.fire) o.inflRate = inp('fire').inflationRate;
    o.inflRate = clamp(o.inflRate, 0, 30);
    o.ret = clamp(o.ret, 0, 30);
    o.stepUp = clamp(o.stepUp, 0, 50);
    o.years = clamp(Math.round(o.years), 0, 40);
    o.months = clamp(Math.round(o.months), 0, 11);
    if (o.years * 12 + o.months < 1) o.months = 1;
    if (o.years * 12 + o.months > SAV_MAX_M) { o.years = 40; o.months = 0; }
    return o;
  },
  onSet(key) {
    if (key === 'inflRate') inp('tabungan').inflTouched = true;
  },
  view: tabunganView,
  summary() {
    const s = tabunganState(), P = savPlan(s);
    const d = savDurTxt(P.n);
    if (s.mode === 'sim') return { value: compactRp(P.final), sub: t('savSumSim', { d: d }) + ' · ' + t(P.reached ? 'savStReached' : 'savStShort') };
    return { value: rp(P.required) + ' ' + t('perMonthShort'), sub: t('savSumTarget', { name: s.nama || t('savGoal'), rp: compactRp(P.targetFut), d: d }) };
  }
});

/** Input efektif (jangka waktu dijaga 1–480 bulan walau sedang diketik). */
function tabunganState() {
  const s = Object.assign({}, inp('tabungan'));
  const n = s.years * 12 + s.months;
  if (n < 1) { s.years = 0; s.months = 1; }
  if (n > SAV_MAX_M) { s.years = 40; s.months = 0; }
  return s;
}
/** "2 tahun 6 bulan" */
function savDurTxt(n) {
  const y = Math.floor(n / 12), m = n % 12;
  return [y ? t('yearsN', { n: y }) : '', m ? t('monthsN', { n: m }) : ''].filter(Boolean).join(' ') || t('monthsN', { n: 0 });
}
function savPctTxt(v) { return num(v, 1) + '%'; }

Object.assign(ACT, {
  /** Preset tujuan: isi nama, target, dan jangka waktu bawaan. */
  tabunganPreset: (b) => {
    const p = SAV_PRESETS.find((x) => x[0] === b.dataset.v);
    if (!p) return;
    setPath('tabungan.preset', p[0]);
    setPath('tabungan.nama', L('savPresets')[p[0]]);
    setPath('tabungan.target', p[1]);
    setPath('tabungan.years', p[2]);
    setPath('tabungan.months', p[3]);
    render();
  },
  /** Chip instrumen → return perkiraan. */
  tabunganRet: (b) => { setPath('tabungan.ret', Number(b.dataset.v)); render(); }
});

function savHeroHtml(s, P) {
  const name = s.nama || t('savGoal');
  if (s.mode === 'sim') {
    return '<span class="lbl">' + esc(t('savHeroSim', { d: savDurTxt(P.n) })) + '</span><span class="big">' + esc(rp(P.final)) + '</span>' +
      heroCells([[t('savPaid'), esc(rp(s.initial + P.deposits))], [t('savGain'), esc(rp(P.gain))]]) +
      heroLine(esc(t('savTargetAt', { name: name })), esc(rp(P.targetFut))) +
      heroLine(esc(P.reached ? t('savHit', { m: P.hitMonth }) : t('savShortBy', { rp: rp(P.shortfall) })));
  }
  return '<span class="lbl">' + esc(t(s.stepUp > 0 ? 'savHeroNeedStep' : 'savHeroNeed')) + '</span><span class="big">' + esc(rp(P.required)) + ' <small>' + esc(t('perMonthShort')) + '</small></span>' +
    heroCells([[t('savPaid'), esc(rp(s.initial + P.deposits))], [t('savGain'), esc(rp(P.gain))]]) +
    heroLine(esc(t('savTargetAt', { name: name })), esc(rp(P.targetFut))) +
    (P.already ? heroLine(esc(t('savAlready'))) : s.stepUp > 0 ? heroLine(esc(t('savLastPmt')), esc(rp(P.lastPmt))) : '');
}
function savResultHtml(s, P) {
  const r = num(s.ret, 1), d = savDurTxt(P.n);
  let h = '';
  if (s.mode === 'sim') {
    h += '<div style="display:flex;justify-content:flex-end;margin-bottom:10px"><span class="st-pill ' + (P.reached ? 'above' : 'below') + '">' + esc(t(P.reached ? 'savStReached' : 'savStShort')) + '</span></div>';
    h += P.reached ? callout('check', esc(t('savSimOk', { m: P.hitMonth })), esc(t('savSimOkSub', { fv: rp(P.final), tg: rp(P.targetFut) })))
      : callout('alert', esc(t('savSimNo', { rp: rp(P.shortfall) })), esc(t('savSimNoSub', { need: rp(P.required), cur: rp(P.monthly), tg: rp(P.targetFut) })), 'bad');
  } else if (P.already) {
    h += callout('check', esc(t('savAlready')), esc(t('savAlreadySub', { rp: rp(s.initial), r: r, fv: rp(P.final) })));
  } else {
    const net = typeof netSalary === 'function' ? netSalary().avgNet : 0;
    h += callout('target', esc(t('savNeedLine', { rp: rp(P.required), d: d })),
      esc(net > 0 ? t('savNeedSub', { p: num(P.required / net * 100, 1), net: rp(net) }) : t('savNeedSubNo', { r: r })) +
      (s.stepUp > 0 ? '<br>' + esc(t('savStepLine', { p: num(s.stepUp, 1), rp: rp(P.lastPmt) })) : ''));
  }
  if (!P.already) {
    h += '<div style="margin-top:10px">' + callout('coins', esc(t('savNoRet', { rp: rp(P.requiredNoReturn) })),
      esc(s.ret > 0 ? t('savNoRetSub', { r: r, d: rp(Math.max(0, P.requiredNoReturn - P.required)) }) : t('savNoRetSame')), 'plain') + '</div>';
  }
  h += '<div style="margin-top:10px">' + callout('trendUp', esc(P.lump > 0 ? t('savLump', { rp: rp(P.lump) }) : t('savLumpZero')),
    P.lump > 0 ? esc(t('savLumpSub', { r: r, d: d })) : '', 'plain') + '</div>';
  h += '<div class="rows" style="margin-top:8px">' + row(t('savRowTarget'), esc(rp(s.target))) +
    (P.infl > 0 ? row(t('savRowTargetFut', { p: num(P.infl, 1) }), esc(rp(P.targetFut))) : '') +
    row(t('savRowInit'), esc(rp(s.initial))) + row(t('savRowDep'), esc(rp(P.deposits))) + row(t('savRowGain'), esc(rp(P.gain))) +
    row(t('savRowFinal'), esc(rp(P.final)), 'total') + '</div>';
  return h;
}
function savChartHtml(s, P) {
  const monthly = P.n <= 36;
  const pts = P.series.points.filter((p) => monthly || p.m % 12 === 0 || p.m === P.n);
  const xl = (m) => (monthly ? m : m % 12 === 0 ? m / 12 : num(m / 12, 1));
  const ser = [
    { name: t('savSerBal'), color: 'var(--accent)', width: 3, area: true, data: pts.map((p) => ({ x: xl(p.m), v: p.balance })) },
    { name: t('savSerPaid'), color: '#5b6b87', dash: true, data: pts.map((p) => ({ x: xl(p.m), v: p.paid })) },
    { name: t('savSerTarget'), color: '#e8604c', dash: true, data: pts.map((p) => ({ x: xl(p.m), v: p.target })) }
  ];
  return lineChart(ser, t('savChart')) + '<p class="hint" style="margin-top:6px">' + esc(t(monthly ? 'savAxisM' : 'savAxisY')) + '</p>';
}
function savTableHtml(P) {
  return '<div class="tbl-wrap"><table class="cmp-table"><thead><tr><th scope="col" style="text-align:left">' + esc(t('savThYear')) + '</th><th scope="col">' + esc(t('savThPmt')) +
    '</th><th scope="col">' + esc(t('savThPaid')) + '</th><th scope="col">' + esc(t('savThBal')) + '</th></tr></thead><tbody>' +
    P.series.years.map((y) => {
      const yr = Math.ceil(y.m / 12), part = y.m % 12;
      const lbl = part ? (y.m < 12 ? t('monthsN', { n: part }) : t('savPartial', { y: Math.floor(y.m / 12), m: part })) : String(yr);
      return '<tr><th scope="row">' + esc(lbl) + '</th><td>' + esc(compactRp(y.pmt)) + '</td><td>' + esc(compactRp(y.paid)) + '</td><td' + (y.balance >= y.target - 0.5 ? ' class="win"' : '') + '>' + esc(compactRp(y.balance)) + '</td></tr>';
    }).join('') + '</tbody></table></div>';
}

function tabunganView() {
  const raw = inp('tabungan');
  const s = tabunganState();
  const P = savPlan(s);
  const dur = raw.years * 12 + raw.months;
  const top = hero(savHeroHtml(s, P), { order: 1, label: t(s.mode === 'sim' ? 'savHeroSim' : 'savHeroNeed', { d: savDurTxt(P.n) }) });
  const presets = '<div class="field"><span class="label">' + esc(t('savPresetL')) + '</span><div class="chips">' + SAV_PRESETS.map((p) =>
    '<button type="button" class="chip" data-act="tabunganPreset" data-v="' + p[0] + '" aria-pressed="' + (s.preset === p[0]) + '">' + esc(L('savPresets')[p[0]]) + '</button>').join('') + '</div></div>';
  const goal = card(t('savGoal'), fSegField('tabungan.mode', t('savModeL'), [['target', t('savModeTarget')], ['sim', t('savModeSim')]]) + presets +
    fText('tabungan.nama', t('savNameL'), { max: 40 }) + fMoney('tabungan.target', t('savTargetL')) +
    '<div style="margin-top:12px">' + fToggle('tabungan.inflasi', t('savInflL'), esc(t('savInflSub', { p: num(s.inflRate, 1), rp: rp(savTargetFuture(s.target, s.inflRate, P.n)) })), { live: 'savInflSub' }) + '</div>' +
    (s.inflasi ? fNum('tabungan.inflRate', t('savInflRate'), { min: 0, max: 30, dec: true, suffix: '% / ' + (en() ? 'yr' : 'thn') }) : '') +
    '<div class="row2">' + fNum('tabungan.years', t('savYearsL'), { min: 0, max: 40, suffix: en() ? 'yrs' : 'tahun' }) + fNum('tabungan.months', t('savMonthsL'), { min: 0, max: 11, suffix: en() ? 'mo' : 'bln' }) + '</div>' +
    '<p class="hint" data-live="savDur" style="margin-top:6px">' + esc(t('savDurHint', { d: savDurTxt(P.n) })) + '</p>' +
    '<p class="hint warn" data-live="savDurWarn">' + (dur < 1 ? esc(t('savDurWarn')) : '') + '</p>' +
    fMoney('tabungan.initial', t('savInitL'), { hint: esc(t('savInitHint')) }), { order: 2, tight: true });
  const chips = '<div class="field"><span class="label">' + esc(t('savRetChips')) + '</span><div class="chips">' + SAV_INSTR.map((x) =>
    '<button type="button" class="chip" data-act="tabunganRet" data-v="' + x[1] + '" aria-pressed="' + (s.ret === x[1]) + '">' + esc(L('savInstr')[x[0]]) + ' ±' + esc(num(x[1], 1)) + '%</button>').join('') + '</div></div>';
  const invest = card(t('savInvest'), (s.mode === 'sim' ? fMoney('tabungan.monthly', t('savMonthlyL')) : '') +
    fNum('tabungan.ret', t('savRetL'), { min: 0, max: 30, dec: true, suffix: '% / ' + (en() ? 'yr' : 'thn') }) + chips +
    fNum('tabungan.stepUp', t('savStepL'), { min: 0, max: 50, dec: true, suffix: '% / ' + (en() ? 'yr' : 'thn'), hint: esc(t('savStepHint')) }), { order: 3, tight: true });
  const res = card(t('savResTitle'), '<div data-live="savRes">' + savResultHtml(s, P) + '</div>', { order: 4 });
  const chart = card(t('savChart'), '<div data-live="savChart">' + savChartHtml(s, P) + '</div>', { order: 5 });
  const tbl = card(t('savTbl'), '<div data-live="savTbl">' + savTableHtml(P) + '</div>', { order: 6 });
  // HP: hero → input → hasil; desktop: kiri hasil, kanan input
  return cols(top, res + chart + tbl, goal + invest, note(esc(t('savNote')), 7));
}
