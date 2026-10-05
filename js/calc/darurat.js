'use strict';
/* =====================================================================
 * Rencana → Dana Darurat: rekomendasi jumlah bulan dari profil, target,
 * waktu tercapai, setoran yang dibutuhkan, dan tangga likuiditas (di mana menyimpannya).
 * Rumus di js/engine/darurat.js. Bisa memakai angka dari Kalkulator FIRE.
 * ===================================================================== */

Object.assign(I18N.id, {
  emTitle: 'Dana Darurat', emShort: 'Darurat', emSub: 'Berapa yang ideal untukmu?',
  emHeroLbl: 'Target dana darurat · {n} bulan pengeluaran', emHave: 'Sudah terkumpul · {p}%', emShortfall: 'Kurang',
  emReached: 'Dana darurat sudah tercapai — tinggal dijaga & diisi ulang bila terpakai.',
  emEta: 'Tercapai ±{d} lagi ({date}) dengan setoran sekarang', emNever: 'Belum ada setoran rutin — isi setoran per bulan untuk melihat kapan tercapai.',
  emTooLong: 'Dengan setoran sekarang butuh lebih dari 50 tahun — coba naikkan setoran.',
  emEmpty: 'Isi pengeluaran wajib per bulan untuk menghitung target.',
  emProfile: 'Profil', emStatus: 'Status kerja', emStTetap: 'Karyawan tetap', emStKontrak: 'Kontrak', emStFree: 'Freelance & usaha',
  emDep: 'Tanggungan', emDepSingle: 'Lajang', emDepMarried: 'Menikah', emDepKids: 'Menikah + anak', emKids: 'Jumlah anak',
  emOwn: 'Atur target bulan sendiri', emOwnSub: 'Rekomendasi untuk profilmu: {n} bulan', emOwnL: 'Target dana darurat', emMonthsSfx: 'bulan',
  emExpTitle: 'Pengeluaran wajib per bulan', emUseFire: 'Pakai angka dari FIRE', emUseFireSub: '{rp} / bln — kebutuhan pokok + hiburan dari Kalkulator FIRE',
  emPokok: 'Kebutuhan pokok', emPokokHint: 'Makan, sewa/KPR, listrik, air, internet, pulsa, kebutuhan rumah tangga.',
  emCicilan: 'Cicilan & utang', emAsuransi: 'Asuransi & kesehatan', emAsuransiHint: 'BPJS mandiri, premi asuransi, obat rutin.', emTransport: 'Transportasi', emLain: 'Lain-lain wajib',
  emLainHint: 'Biaya sekolah anak, kiriman ke orang tua, dll. Hiburan & belanja keinginan tidak usah dimasukkan.', emTotal: 'Total pengeluaran wajib',
  emFundTitle: 'Dana & setoran', emHaveL: 'Dana darurat yang sudah ada', emHaveHint: 'Hanya yang mudah dicairkan: tabungan, RDPU, deposito, emas. Bukan saham atau properti.',
  emUseGold: 'Setoran dari alokasi FIRE', emUseGoldSub: '{rp} / bln — porsi emas / dana darurat di Kalkulator FIRE', emDepositL: 'Setoran per bulan',
  emRetL: 'Imbal hasil tempat menyimpan', emRetHint: 'RDPU ±4–5% / thn (bersih), deposito ±3–4,5% (dipotong pajak 20%), tabungan biasa ±0–1%.',
  emWhyTitle: 'Kenapa {n} bulan?', emWhyHead: 'Rekomendasi: {n} bulan', emWhyRange: 'Rentang wajar {a}–{b} bulan · target memakai batas atas supaya lebih aman',
  emWhyBase: { lajang: 'Lajang', menikah: 'Menikah, belum punya anak', anak: 'Menikah + anak' }, emWhyBaseV: '{a}–{b} bulan',
  emWhyJob: { tetap: 'Karyawan tetap', kontrak: 'Karyawan kontrak', freelance: 'Freelance & usaha' }, emWhyJobV: '+{a}–{b} bulan', emWhyJobNone: '+0 bulan',
  emWhyKids: 'Anak ke-3 dst. (+1 bulan per anak, maks. +3)', emWhyKidsV: '+{n} bulan',
  emWhyOwn: 'Kamu memakai target sendiri: {n} bulan.',
  emWhyNote: 'Aturan: lajang 3–6 bln · menikah 6–9 bln · menikah + anak 9–12 bln; kontrak +0–3 bln, freelance/usaha +3–6 bln karena penghasilan tidak tetap; maksimal 24 bulan.',
  emWhenTitle: 'Kapan tercapai?', emDepNow: 'Setoran sekarang', emEtaRow: 'Perkiraan tercapai', emEtaDone: 'Sudah tercapai', emEtaNever: 'Tidak tercapai tanpa setoran',
  emEtaLong: 'Lebih dari 50 tahun', emNeedIn: 'Setoran agar tercapai dalam {n} bulan', emNeedHead: '{rp} / bln agar tercapai dalam 12 bulan',
  emNeedSub: 'Sudah memperhitungkan dana yang ada & imbal hasil {p}% / thn.', emNeedDone: 'Target sudah tercapai — setoran bisa dialihkan ke investasi jangka panjang.',
  emChartLbl: 'Proyeksi saldo dana darurat', emBalance: 'Saldo', emTarget: 'Target',
  emWhereTitle: 'Simpan di mana', emWhereSub: 'Tangga likuiditas — makin bawah makin lambat cair, makin tinggi imbal hasilnya.',
  emTier1: 'Tabungan terpisah', emTier2: 'Reksa dana pasar uang (RDPU)', emTier3: 'Deposito 1–3 bulan / emas',
  emTier1D: '1× pengeluaran · bisa ditarik hari itu juga. Pisahkan dari rekening gaji supaya tidak terpakai.',
  emTier2D: 'Separuh sisanya · cair T+1/T+2 hari kerja. Pilih yang terdaftar & diawasi OJK.',
  emTier3D: 'Separuh sisanya · deposito ber-ARO (dijamin LPS sesuai ketentuan) atau emas batangan untuk lapis terakhir.',
  emUseTitle: 'Kapan boleh dipakai', emYesTitle: 'Boleh', emNoTitle: 'Jangan',
  emYes: ['Kehilangan pekerjaan / penghasilan berhenti', 'Sakit atau kecelakaan yang tidak ditanggung asuransi', 'Perbaikan mendesak rumah atau kendaraan untuk bekerja', 'Keadaan darurat keluarga inti'],
  emNo: ['Liburan, gawai baru, atau diskon besar', 'Membeli investasi atau "peluang" mendadak', 'Pengeluaran rutin yang bisa direncanakan (pajak tahunan, sekolah)'],
  emRefill: 'Setelah dipakai, isi ulang dulu sebelum kembali menabung untuk tujuan lain.',
  emNote: 'Estimasi edukatif, bukan nasihat keuangan. Rentang bulan mengikuti panduan umum perencana keuangan Indonesia; sesuaikan dengan kondisimu (mis. penyakit kronis, satu-satunya pencari nafkah). Simpanan bank dijamin LPS sampai Rp2 miliar per nasabah per bank bila bunganya tidak melebihi tingkat bunga penjaminan (UU 24/2004 jo. UU 4/2023).',
  emSumSub: 'Terkumpul {p}% · {eta}', emSumDone: 'Sudah tercapai', emSumEta: 'tercapai ±{d}', emSumNever: 'belum ada setoran'
});
Object.assign(I18N.en, {
  emTitle: 'Emergency Fund', emShort: 'Emergency', emSub: 'How much is right for you?',
  emHeroLbl: 'Emergency fund target · {n} months of spending', emHave: 'Saved so far · {p}%', emShortfall: 'Still needed',
  emReached: 'Your emergency fund is complete — keep it safe and refill it after use.',
  emEta: 'Reached in ~{d} ({date}) at your current pace', emNever: 'No monthly contribution yet — add one to see when you will get there.',
  emTooLong: 'At this pace it takes more than 50 years — try contributing more.',
  emEmpty: 'Enter your essential monthly spending to calculate a target.',
  emProfile: 'Profile', emStatus: 'Employment', emStTetap: 'Permanent', emStKontrak: 'Contract', emStFree: 'Freelance & business',
  emDep: 'Dependants', emDepSingle: 'Single', emDepMarried: 'Married', emDepKids: 'Married + kids', emKids: 'Number of children',
  emOwn: 'Set my own target', emOwnSub: 'Recommended for your profile: {n} months', emOwnL: 'Emergency fund target', emMonthsSfx: 'months',
  emExpTitle: 'Essential spending per month', emUseFire: 'Use the FIRE figure', emUseFireSub: '{rp} / mo — essentials + lifestyle from the FIRE calculator',
  emPokok: 'Essentials', emPokokHint: 'Food, rent/mortgage, utilities, internet, phone, household needs.',
  emCicilan: 'Loan instalments', emAsuransi: 'Insurance & health', emAsuransiHint: 'Self-paid BPJS, insurance premiums, regular medication.', emTransport: 'Transport', emLain: 'Other essentials',
  emLainHint: "School fees, support for parents, etc. Leave out fun & wants.", emTotal: 'Total essential spending',
  emFundTitle: 'Savings & contributions', emHaveL: 'Emergency fund you already have', emHaveHint: 'Only easy-to-withdraw money: savings, money market funds, deposits, gold. Not stocks or property.',
  emUseGold: 'Contribution from FIRE split', emUseGoldSub: '{rp} / mo — the gold / emergency share in the FIRE calculator', emDepositL: 'Monthly contribution',
  emRetL: 'Return where it is kept', emRetHint: 'Money market funds ~4–5% / yr (net), deposits ~3–4.5% (20% tax withheld), regular savings ~0–1%.',
  emWhyTitle: 'Why {n} months?', emWhyHead: 'Recommended: {n} months', emWhyRange: 'Reasonable range {a}–{b} months · the target uses the upper end to be safe',
  emWhyBase: { lajang: 'Single', menikah: 'Married, no children', anak: 'Married + children' }, emWhyBaseV: '{a}–{b} months',
  emWhyJob: { tetap: 'Permanent employee', kontrak: 'Contract employee', freelance: 'Freelance & business' }, emWhyJobV: '+{a}–{b} months', emWhyJobNone: '+0 months',
  emWhyKids: '3rd child onwards (+1 month each, max +3)', emWhyKidsV: '+{n} months',
  emWhyOwn: 'You are using your own target: {n} months.',
  emWhyNote: 'Rule: single 3–6 mo · married 6–9 mo · married + kids 9–12 mo; contract +0–3 mo, freelance/business +3–6 mo for irregular income; capped at 24 months.',
  emWhenTitle: 'When will you get there?', emDepNow: 'Current contribution', emEtaRow: 'Estimated completion', emEtaDone: 'Already reached', emEtaNever: 'Not without contributions',
  emEtaLong: 'More than 50 years', emNeedIn: 'Needed to finish in {n} months', emNeedHead: '{rp} / mo to finish in 12 months',
  emNeedSub: 'Accounts for your current savings & a {p}% / yr return.', emNeedDone: 'Target reached — you can redirect contributions to long-term investing.',
  emChartLbl: 'Projected emergency fund balance', emBalance: 'Balance', emTarget: 'Target',
  emWhereTitle: 'Where to keep it', emWhereSub: 'A liquidity ladder — lower rungs take longer to withdraw but earn more.',
  emTier1: 'Separate savings account', emTier2: 'Money market fund (RDPU)', emTier3: '1–3 month deposits / gold',
  emTier1D: '1× monthly spending · withdraw the same day. Keep it apart from your salary account.',
  emTier2D: 'Half of the rest · paid out T+1/T+2 business days. Pick one registered with & supervised by OJK.',
  emTier3D: 'Half of the rest · auto-rollover deposits (LPS-insured within its rules) or gold bars as the last rung.',
  emUseTitle: 'When to use it', emYesTitle: 'Yes', emNoTitle: 'No',
  emYes: ['Job loss / income stops', 'Illness or accident not covered by insurance', 'Urgent home repair or the vehicle you need for work', 'An emergency in your immediate family'],
  emNo: ['Holidays, new gadgets or big sales', 'Buying investments or a sudden "opportunity"', 'Regular costs you can plan for (annual taxes, school fees)'],
  emRefill: 'After using it, refill it first before saving for other goals.',
  emNote: 'An educational estimate, not financial advice. Month ranges follow common Indonesian financial-planner guidance; adjust for your situation (e.g. chronic illness, sole breadwinner). Bank deposits are insured by LPS up to Rp2 billion per customer per bank if the rate does not exceed the guarantee rate (Law 24/2004 as amended by Law 4/2023).',
  emSumSub: '{p}% saved · {eta}', emSumDone: 'Reached', emSumEta: 'reached in ~{d}', emSumNever: 'no contributions yet'
});

const EMERG_STATUS = ['tetap', 'kontrak', 'freelance'];
const EMERG_DEPS = ['lajang', 'menikah', 'anak'];
const EMERG_EXP = [['pokok', 'emPokok', 'emPokokHint'], ['cicilan', 'emCicilan'], ['asuransi', 'emAsuransi', 'emAsuransiHint'], ['transport', 'emTransport'], ['lain', 'emLain', 'emLainHint']];
const EMERG_TIERS = [['cash', 'emTier1', 'emTier1D', 'var(--accent)'], ['mmf', 'emTier2', 'emTier2D', '#4e8fe0'], ['term', 'emTier3', 'emTier3D', 'var(--amber)']];

calc({
  id: 'darurat', icon: 'shield', color: '#c2452f', title: 'emTitle', short: 'emShort', sub: 'emSub',
  defaults: {
    status: 'tetap', tanggungan: 'lajang', anak: 1, bulanSendiri: false, bulan: 6,
    pakaiFire: false, pokok: 3500000, cicilan: 0, asuransi: 250000, transport: 500000, lain: 400000,
    ada: 5000000, setoranFire: false, setoran: 1000000, ret: 4.5
  },
  clean(o) {
    if (EMERG_STATUS.indexOf(o.status) < 0) o.status = 'tetap';
    if (EMERG_DEPS.indexOf(o.tanggungan) < 0) o.tanggungan = 'lajang';
    o.anak = clamp(Math.round(o.anak), 1, 5);
    o.bulan = clamp(Math.round(o.bulan), 1, 36);
    ['pokok', 'cicilan', 'asuransi', 'transport', 'lain', 'ada', 'setoran'].forEach((k) => { o[k] = clamp(Math.round(o[k]), 0, 999999999999999); });
    o.ret = clamp(o.ret, 0, 15);
    return o;
  },
  onSet(key, v) {
    const o = inp('darurat');
    // mulai dari rekomendasi saat target sendiri dinyalakan
    if (key === 'bulanSendiri' && v) o.bulan = emergRecommend(o.status, o.tanggungan, o.anak).months;
    // mulai dari angka FIRE saat beralih ke isian sendiri
    if (key === 'setoranFire' && !v) { const g = Math.round(fireCalc().R.monthlyGold); if (g > 0) o.setoran = g; }
  },
  view: emergView,
  summary() {
    const c = emergCalc();
    if (c.target <= 0) return { value: '–', sub: t('emEmpty') };
    const eta = c.eta === 0 ? t('emSumDone') : c.eta === null ? t('emSumNever') : t('emSumEta', { d: emergDur(c.eta) });
    return { value: compactRp(c.target), sub: t('emSumSub', { p: num(Math.floor(c.pct), 0), eta }) };
  }
});

/** Nilai efektif: pengeluaran & setoran (bisa dari FIRE), rekomendasi, target, waktu tercapai. */
function emergCalc() {
  const o = inp('darurat');
  const fire = o.pakaiFire || o.setoranFire ? fireCalc().R : null;
  const rec = emergRecommend(o.status, o.tanggungan, o.anak);
  const months = o.bulanSendiri ? Math.max(1, o.bulan) : rec.months;
  const expense = o.pakaiFire ? Math.max(0, fire.monthlyExpenses) : emergSum(EMERG_EXP.map((x) => o[x[0]]));
  const deposit = o.setoranFire ? Math.max(0, fire.monthlyGold) : o.setoran;
  const target = emergTarget(months, expense);
  const have = Math.max(0, o.ada);
  return {
    o, rec, months, expense, deposit, target, have,
    pct: emergProgress(have, target), short: Math.max(0, target - have),
    eta: emergMonthsToGoal(have, deposit, target, o.ret),
    need12: emergDepositFor(have, target, 12, o.ret)
  };
}
/** n bulan → "8 bulan" / "2 tahun 3 bulan". */
function emergDur(n) {
  if (n < 24) return t('monthsN', { n });
  const y = Math.floor(n / 12), m = n % 12;
  return t('yearsN', { n: y }) + (m ? ' ' + t('monthsN', { n: m }) : '');
}
/** Bulan-tahun n bulan dari sekarang: "Agustus 2027". */
function emergMonthLabel(n, short) {
  const k = todayKey();
  const tot = +k.slice(0, 4) * 12 + (+k.slice(5, 7) - 1) + n;
  const y = Math.floor(tot / 12);
  return monthName(tot - y * 12 + 1, short) + ' ' + (short ? "'" + String(y).slice(2) : y);
}

function emergHeroHtml(c) {
  if (c.target <= 0) {
    return '<span class="lbl">' + esc(t('emHeroLbl', { n: c.months })) + '</span><span class="big">–</span>' + heroLine(esc(t('emEmpty')));
  }
  const line = c.eta === 0 ? t('emReached') : c.eta === null ? (c.deposit > 0 ? t('emTooLong') : t('emNever')) : t('emEta', { d: emergDur(c.eta), date: emergMonthLabel(c.eta) });
  return '<span class="lbl">' + esc(t('emHeroLbl', { n: c.months })) + '</span><span class="big">' + esc(rp(c.target)) + '</span>' +
    '<div class="fire-bar"><i style="width:' + c.pct.toFixed(1) + '%;background:' + (c.pct >= 100 ? '#ffffff' : '#ffc233') + '"></i></div>' +
    heroCells([[t('emHave', { p: num(Math.floor(c.pct), 0) }), esc(rp(c.have))], [t('emShortfall'), esc(rp(c.short))]]) +
    heroLine(esc(line));
}
function emergWhyHtml(c) {
  const r = c.rec, o = c.o;
  const range = (a, b) => (a === b ? t('emWhyJobNone') : t('emWhyJobV', { a, b }));
  return callout('shield', esc(t('emWhyHead', { n: r.months })), esc(t('emWhyRange', { a: r.min, b: r.max }))) +
    '<div class="rows" style="margin-top:8px">' + row(L('emWhyBase')[o.tanggungan], esc(t('emWhyBaseV', { a: r.base[0], b: r.base[1] }))) +
    row(L('emWhyJob')[o.status], esc(range(r.job[0], r.job[1]))) + (r.kids ? row(t('emWhyKids'), esc(t('emWhyKidsV', { n: r.kids }))) : '') + '</div>' +
    (o.bulanSendiri ? '<p class="hint" style="margin-top:8px;font-weight:700;color:var(--text)">' + esc(t('emWhyOwn', { n: c.months })) + '</p>' : '') +
    '<p class="hint" style="margin-top:8px">' + esc(t('emWhyNote')) + '</p>';
}
function emergWhenHtml(c) {
  if (c.target <= 0) return '<p class="hint">' + esc(t('emEmpty')) + '</p>';
  const etaTxt = c.eta === 0 ? t('emEtaDone') : c.eta === null ? (c.deposit > 0 ? t('emEtaLong') : t('emEtaNever')) : emergDur(c.eta) + ' · ' + emergMonthLabel(c.eta);
  let h = (c.eta === 0 ? callout('check', esc(t('emEtaDone')), esc(t('emNeedDone'))) :
    callout('target', esc(t('emNeedHead', { rp: rp(c.need12) })), esc(t('emNeedSub', { p: num(c.o.ret, 1) })))) +
    '<div class="rows" style="margin-top:8px">' + row(t('emDepNow'), esc(rp(c.deposit)) + ' ' + esc(t('perMonthShort'))) + row(t('emEtaRow'), esc(etaTxt)) +
    (c.eta === 0 ? '' : [6, 24].map((n) => row(t('emNeedIn', { n }), esc(rp(emergDepositFor(c.have, c.target, n, c.o.ret))))).join('')) + '</div>';
  if (c.eta !== 0) {
    const n = c.eta === null ? 24 : Math.min(120, Math.max(12, c.eta + 2));
    const sch = emergSchedule(c.have, c.deposit, c.o.ret, n);
    const xs = sch.map((p) => emergMonthLabel(p.m, true));
    h += '<div style="margin-top:10px">' + lineChart([
      { name: t('emBalance'), color: 'var(--accent)', width: 3, area: true, data: sch.map((p, i) => ({ x: xs[i], v: p.v })) },
      { name: t('emTarget'), color: '#e8604c', dash: true, data: sch.map((p, i) => ({ x: xs[i], v: c.target })) }], t('emChartLbl')) + '</div>';
  }
  return h;
}
function emergWhereHtml(c) {
  if (c.target <= 0) return '<p class="hint">' + esc(t('emEmpty')) + '</p>';
  const l = emergLadder(c.target, c.expense);
  return stackbar(EMERG_TIERS.map((x) => ({ label: t(x[1]), value: l[x[0]], color: x[3] })), c.target) +
    EMERG_TIERS.map((x, i) => '<div class="fx-row"' + (i ? '' : ' style="margin-top:8px"') + '><span class="set-ic" style="background:color-mix(in srgb, ' + x[3] + ' 22%, transparent);color:var(--text)"><b>' + (i + 1) + '</b></span>' +
      '<div class="grow"><b>' + esc(t(x[1])) + ' · ' + esc(rp(l[x[0]])) + '</b><p>' + esc(t(x[2])) + '</p></div></div>').join('');
}
function emergUseHtml() {
  const li = (icon, color, txt) => '<div class="lr" style="align-items:flex-start;padding:4px 0"><span style="color:' + color + ';margin-top:1px">' + ic(icon, 16, 2.6) + '</span><span>' + esc(txt) + '</span></div>';
  return '<div class="legend-rows"><b style="display:block;font-size:13px;margin-bottom:2px">' + esc(t('emYesTitle')) + '</b>' + L('emYes').map((x) => li('check', 'var(--accent-ink)', x)).join('') +
    '<b style="display:block;font-size:13px;margin:10px 0 2px">' + esc(t('emNoTitle')) + '</b>' + L('emNo').map((x) => li('x', 'var(--danger)', x)).join('') + '</div>' +
    '<p class="hint" style="margin-top:10px">' + esc(t('emRefill')) + '</p>';
}

function emergView() {
  const c = emergCalc();
  const o = c.o;
  const top = hero(emergHeroHtml(c), { order: 1, label: t('emHeroLbl', { n: c.months }) });
  // --- input ---
  const profile = card(t('emProfile'),
    fSegField('darurat.status', t('emStatus'), [['tetap', t('emStTetap')], ['kontrak', t('emStKontrak')], ['freelance', t('emStFree')]]) +
    fSegField('darurat.tanggungan', t('emDep'), [['lajang', t('emDepSingle')], ['menikah', t('emDepMarried')], ['anak', t('emDepKids')]]) +
    (o.tanggungan === 'anak' ? fSegField('darurat.anak', t('emKids'), [[1, '1'], [2, '2'], [3, '3'], [4, '4'], [5, '5+']]) : '') +
    '<div style="margin-top:12px">' + fToggle('darurat.bulanSendiri', t('emOwn'), esc(t('emOwnSub', { n: c.rec.months }))) + '</div>' +
    (o.bulanSendiri ? fNum('darurat.bulan', t('emOwnL'), { min: 1, max: 36, suffix: t('emMonthsSfx') }) : ''), { order: 2, tight: true });
  const fire = o.pakaiFire || o.setoranFire ? fireCalc().R : null;
  const fireExp = fire ? fire.monthlyExpenses : fireCalc().R.monthlyExpenses;
  const expense = '<section class="card" style="order:3"><div class="card-title" style="margin-bottom:0"><span>' + esc(t('emExpTitle')) + '</span>' +
    '<small data-live="emExpTot">' + esc(rp(c.expense)) + '</small></div>' +
    '<div style="margin-top:8px">' + fToggle('darurat.pakaiFire', t('emUseFire'), esc(t('emUseFireSub', { rp: rp(fireExp) })), { first: true }) + '</div>' +
    (o.pakaiFire ? '<button type="button" class="link-btn" data-act="nav" data-v="fire">' + esc(t('open')) + ' FIRE ' + ic('chevR', 16) + '</button>' :
      EMERG_EXP.map((x) => fMoney('darurat.' + x[0], t(x[1]), x[2] ? { hint: esc(t(x[2])) } : {})).join('') +
      '<div class="rows" style="margin-top:8px" data-live="emExpRows">' + row(t('emTotal'), esc(rp(c.expense)), 'total') + '</div>') + '</section>';
  const goldNow = fire ? fire.monthlyGold : fireCalc().R.monthlyGold;
  const fund = card(t('emFundTitle'), fMoney('darurat.ada', t('emHaveL'), { hint: esc(t('emHaveHint')) }) +
    '<div style="margin-top:12px">' + fToggle('darurat.setoranFire', t('emUseGold'), esc(t('emUseGoldSub', { rp: rp(goldNow) }))) + '</div>' +
    (o.setoranFire ? '' : fMoney('darurat.setoran', t('emDepositL'))) +
    fNum('darurat.ret', t('emRetL'), { min: 0, max: 15, dec: true, suffix: '% / ' + (en() ? 'yr' : 'thn'), hint: esc(t('emRetHint')) }), { order: 4, tight: true });
  // --- hasil ---
  const why = card(t('emWhyTitle', { n: c.rec.months }), '<div data-live="emWhy">' + emergWhyHtml(c) + '</div>', { order: 5 });
  const when = card(t('emWhenTitle'), '<div data-live="emWhen">' + emergWhenHtml(c) + '</div>', { order: 6 });
  const where = card(t('emWhereTitle'), '<p class="hint" style="margin:-6px 0 10px">' + esc(t('emWhereSub')) + '</p><div data-live="emWhere">' + emergWhereHtml(c) + '</div>', { order: 7 });
  const use = card(t('emUseTitle'), emergUseHtml(), { order: 8 });
  // HP: hero → input → hasil; desktop: kiri hasil, kanan input
  return cols(top, when + where + why + use, profile + expense + fund, note(esc(t('emNote')), 9));
}
