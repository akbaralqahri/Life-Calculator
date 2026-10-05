'use strict';
/* =====================================================================
 * Hidup → Inflasi & Daya Beli: harga nanti, nilai hari ini, gaji vs inflasi,
 * dan tabungan (return riil). Rumus di js/engine/inflasi.js.
 * ===================================================================== */

Object.assign(I18N.id, {
  inflTitle: 'Inflasi & Daya Beli', inflShort: 'Inflasi', inflSub: 'Harga nanti, nilai uang hari ini & return riil',
  inflData: 'Hitung', inflMode: 'Mode', inflModeOpt: { nanti: 'Harga nanti', kini: 'Nilai kini', gaji: 'Gaji', tabungan: 'Tabungan' },
  inflModeHint: {
    nanti: 'Harga barang hari ini → perkiraan harganya beberapa tahun lagi.',
    kini: 'Uang yang akan kamu terima nanti → setara berapa dalam uang hari ini.',
    gaji: 'Kenaikan gaji tahunan vs inflasi → apakah daya belimu benar-benar naik.',
    tabungan: 'Saldo tabungan/deposito dengan bunga bersih → tumbuh riil atau menyusut.'
  },
  inflAmt: { nanti: 'Harga hari ini', kini: 'Uang di masa depan', tabungan: 'Saldo tabungan / deposito' },
  inflGaji: 'Gaji per bulan', inflUseNet: 'Pakai gaji bersih ({rp})', inflGajiNaik: 'Kenaikan gaji', inflRet: 'Bunga / return bersih',
  inflRetHint: 'Setelah pajak. Mis. deposito 4% − pajak 20% = 3,2%.', inflYears: 'Jangka waktu', inflRate: 'Inflasi',
  inflRateSub: 'Sasaran BI 2026: 2,5 ± 1% · rata-rata 2016–2025 ±2,9%/thn', inflPerYr: '{p}% / thn', inflPerYrS: '% / thn',
  inflHeroNanti: 'Harga {rp} hari ini, {n} lagi', inflHeroKini: '{rp} pada {n} lagi setara hari ini',
  inflHeroGaji: 'Kenaikan gaji riil per tahun', inflHeroTab: 'Return riil per tahun',
  inflUp: 'Kenaikan harga', inflDouble: 'Harga berlipat dua dalam', inflDoubleV: '±{n} tahun', inflLost: 'Daya beli hilang',
  inflGajiNom: 'Gaji {n} lagi', inflGajiReal: 'Nilai riil (uang hari ini)', inflGajiMin: 'Kenaikan minimal agar daya beli tetap', inflGajiNeed: 'Gaji yang dibutuhkan {n} lagi',
  inflTabNom: 'Saldo {n} lagi', inflTabReal: 'Daya beli (uang hari ini)', inflTabUp: 'Uangmu tumbuh riil', inflTabDown: 'Uangmu menyusut nilainya', inflTabFlat: 'Daya beli tetap',
  inflLossTitle: 'Uangmu kehilangan {p}% daya beli dalam {n}', inflLossSub: '{rp} yang didiamkan hari ini hanya setara {now} pada {n} lagi; barang seharga {rp} naik jadi {fut}.',
  inflZero: 'Dengan inflasi 0%, daya beli uangmu tidak berubah.',
  inflChartPrice: 'Harga naik vs daya beli turun', inflChartGaji: 'Gaji nominal vs riil', inflChartTab: 'Saldo nominal vs riil',
  inflSerPrice: 'Harga barang', inflSerPower: 'Daya beli uang', inflSerNom: 'Nominal', inflSerReal: 'Riil (uang hari ini)', inflSerNeed: 'Agar daya beli tetap',
  inflChartSub: 'Sumbu bawah: tahun ke-',
  inflTblTitle: 'Nilai dari tahun ke tahun', inflThYear: 'Tahun', inflThPrice: 'Harga nanti', inflThPower: 'Nilai hari ini', inflThLoss: 'Daya beli turun',
  inflThNom: 'Nominal', inflThReal: 'Nilai riil', inflThNeed: 'Agar daya beli tetap', inflThDiff: 'Riil vs awal',
  inflInsTitle: 'Bunga tabungan vs inflasi', inflInsSmall: 'perkiraan', inflInsSub: 'Return riil = (1 + bunga bersih) ÷ (1 + inflasi {i}%) − 1.',
  inflInsRow: 'Bruto {g}% · pajak {tx}% → bersih {n}%', inflInsMine: 'Isianmu', inflInsMineRow: 'Bersih {n}%',
  inflInsVal: '{rp} jadi {real} (uang hari ini) dalam {n}',
  inflIns: { tabungan: 'Tabungan bank', deposito: 'Deposito', sbn: 'SBN ritel (ORI/SR/SBR/ST)' },
  inflRealPos: 'riil +{p}%', inflRealNeg: 'riil −{p}%',
  inflSumVal: '−{p}% daya beli', inflSumSub: '{n} · inflasi {i}%',
  inflNote: 'Estimasi edukatif dengan inflasi tetap tiap tahun (majemuk) — bukan nasihat keuangan. Bawaan inflasi 3%/thn: inflasi Indonesia 2025 2,92% yoy (BPS, Jan 2026); sasaran inflasi 2026–2027 2,5 ± 1% (Bank Indonesia); rata-rata inflasi Desember-ke-Desember 2016–2025 ±2,9%/thn (BPS). Contoh instrumen (perkiraan Okt 2026, bisa berbeda tiap bank/seri): tabungan ±1% (sering habis oleh biaya admin); deposito ±4% — bunga penjaminan LPS 3,75% (Jul–Sep 2026); kupon SBN ritel ±5,5–6% (mis. ORI028 5,35–5,65%). Pajak bunga tabungan/deposito 20% final (PP 131/2000; tabungan/deposito ≤ Rp7,5 juta tidak dipotong), pajak kupon SBN 10% (PP 91/2021).'
});
Object.assign(I18N.en, {
  inflTitle: 'Inflation & Buying Power', inflShort: 'Inflation', inflSub: "Future prices, today's value & real returns",
  inflData: 'Calculate', inflMode: 'Mode', inflModeOpt: { nanti: 'Future price', kini: "Today's value", gaji: 'Salary', tabungan: 'Savings' },
  inflModeHint: {
    nanti: "Today's price of something → its estimated price years from now.",
    kini: "Money you'll receive later → what it's worth in today's money.",
    gaji: 'Yearly raises vs inflation → whether your buying power really grows.',
    tabungan: 'Savings/deposit balance at a net rate → growing in real terms or shrinking.'
  },
  inflAmt: { nanti: "Today's price", kini: 'Future amount', tabungan: 'Savings / deposit balance' },
  inflGaji: 'Monthly salary', inflUseNet: 'Use net salary ({rp})', inflGajiNaik: 'Salary raise', inflRet: 'Net interest / return',
  inflRetHint: 'After tax. E.g. a 4% deposit − 20% tax = 3.2%.', inflYears: 'Time horizon', inflRate: 'Inflation',
  inflRateSub: 'Bank Indonesia 2026 target: 2.5 ± 1% · 2016–2025 average ~2.9%/yr', inflPerYr: '{p}% / yr', inflPerYrS: '% / yr',
  inflHeroNanti: '{rp} today, {n} from now', inflHeroKini: "{rp} in {n} is worth today",
  inflHeroGaji: 'Real salary growth per year', inflHeroTab: 'Real return per year',
  inflUp: 'Price increase', inflDouble: 'Prices double in', inflDoubleV: '~{n} years', inflLost: 'Buying power lost',
  inflGajiNom: 'Salary in {n}', inflGajiReal: "Real value (today's money)", inflGajiMin: 'Minimum raise to keep buying power', inflGajiNeed: 'Salary needed in {n}',
  inflTabNom: 'Balance in {n}', inflTabReal: "Buying power (today's money)", inflTabUp: 'Your money grows in real terms', inflTabDown: 'Your money is losing value', inflTabFlat: 'Buying power unchanged',
  inflLossTitle: 'Your money loses {p}% of its buying power in {n}', inflLossSub: '{rp} kept idle today is worth only {now} in {n}; something costing {rp} rises to {fut}.',
  inflZero: 'With 0% inflation, your buying power stays the same.',
  inflChartPrice: 'Rising prices vs falling buying power', inflChartGaji: 'Nominal vs real salary', inflChartTab: 'Nominal vs real balance',
  inflSerPrice: 'Price', inflSerPower: 'Buying power', inflSerNom: 'Nominal', inflSerReal: "Real (today's money)", inflSerNeed: 'To keep buying power',
  inflChartSub: 'Bottom axis: year',
  inflTblTitle: 'Value over the years', inflThYear: 'Year', inflThPrice: 'Future price', inflThPower: "Today's value", inflThLoss: 'Buying power lost',
  inflThNom: 'Nominal', inflThReal: 'Real value', inflThNeed: 'To keep buying power', inflThDiff: 'Real vs start',
  inflInsTitle: 'Savings rates vs inflation', inflInsSmall: 'estimates', inflInsSub: 'Real return = (1 + net rate) ÷ (1 + {i}% inflation) − 1.',
  inflInsRow: 'Gross {g}% · tax {tx}% → net {n}%', inflInsMine: 'Your input', inflInsMineRow: 'Net {n}%',
  inflInsVal: "{rp} becomes {real} (today's money) in {n}",
  inflIns: { tabungan: 'Bank savings', deposito: 'Time deposit', sbn: 'Retail govt bonds (ORI/SR/SBR/ST)' },
  inflRealPos: 'real +{p}%', inflRealNeg: 'real −{p}%',
  inflSumVal: '−{p}% buying power', inflSumSub: '{n} · {i}% inflation',
  inflNote: 'An educational estimate with a constant yearly (compounded) inflation rate — not financial advice. Default inflation 3%/yr: Indonesia 2025 inflation 2.92% yoy (BPS, Jan 2026); 2026–2027 inflation target 2.5 ± 1% (Bank Indonesia); December-to-December average 2016–2025 ~2.9%/yr (BPS). Example instruments (estimates as of Oct 2026; vary by bank/series): savings ~1% (often eaten by admin fees); deposits ~4% — LPS guarantee rate 3.75% (Jul–Sep 2026); retail government bond coupons ~5.5–6% (e.g. ORI028 5.35–5.65%). Interest on savings/deposits is taxed 20% final (PP 131/2000; balances ≤ Rp7.5 million are exempt), retail bond coupons 10% (PP 91/2021).'
});

/** Contoh instrumen (perkiraan Okt 2026): [kunci, bunga bruto %, pajak %]. */
const INFL_INSTR = [['tabungan', 1, 20], ['deposito', 4, 20], ['sbn', 5.75, 10]];
const INFL_MODES = ['nanti', 'kini', 'gaji', 'tabungan'];
const INFL_MILESTONES = [5, 10, 15, 20, 30];

calc({
  id: 'inflasi', icon: 'trendUp', color: '#a35f00', title: 'inflTitle', short: 'inflShort', sub: 'inflSub',
  defaults: { mode: 'nanti', nominal: 1000000, gaji: 10000000, gajiNaik: 5, ret: 3.2, tahun: 10, infl: 3 },
  clean(o) {
    if (INFL_MODES.indexOf(o.mode) < 0) o.mode = 'nanti';
    ['nominal', 'gaji'].forEach((k) => { o[k] = clamp(Math.round(o[k]), 0, 999999999999999); });
    o.gajiNaik = clamp(Math.round(o.gajiNaik * 100) / 100, 0, 50);
    o.ret = clamp(Math.round(o.ret * 100) / 100, 0, 50);
    o.tahun = clamp(Math.round(o.tahun), 1, 50);
    o.infl = clamp(Math.round(o.infl * 2) / 2, 0, 15);
    return o;
  },
  view: inflasiView,
  summary() {
    const s = inp('inflasi');
    return { value: t('inflSumVal', { p: num(inflLoss(s.infl, s.tahun), 1) }), sub: t('inflSumSub', { n: t('yearsN', { n: s.tahun }), i: num(s.infl, 1) }) };
  }
});

/** Angka turunan sesuai mode. amount = nominal yang dipakai mode; growth = pertumbuhan nominal (gaji/tabungan). */
function inflasiCalc() {
  const s = inp('inflasi');
  const amount = s.mode === 'gaji' ? s.gaji : s.nominal;
  const growth = s.mode === 'gaji' ? s.gajiNaik : s.mode === 'tabungan' ? s.ret : 0;
  return { s, amount, growth, series: inflSeries(amount, s.infl, s.tahun, growth), loss: inflLoss(s.infl, s.tahun), real: inflRealReturn(growth, s.infl) };
}
const inflasiSigned = (p, d) => (p > 0.0049 ? '+' : p < -0.0049 ? '−' : '') + num(Math.abs(p), d === undefined ? 2 : d);
const inflasiN = (n) => t('yearsN', { n: n });
/** Rupiah penuh, ringkas bila ≥ 1 miliar (muat di sel kecil). */
const inflasiMoney = (n) => (Math.abs(n) < 1e9 ? rp(n) : compactRp(n));

function inflasiHeroHtml(c) {
  const s = c.s, last = c.series[c.series.length - 1], n = inflasiN(s.tahun);
  let h;
  if (s.mode === 'nanti') {
    const dbl = inflDoubleYears(s.infl);
    h = '<span class="lbl">' + esc(t('inflHeroNanti', { rp: rp(c.amount), n: n })) + '</span><span class="big">' + esc(rp(last.price)) + '</span><span class="sep"></span>' +
      heroLine(esc(t('inflUp')), inflasiSigned((last.price / Math.max(1, c.amount) - 1) * 100, 1) + '%') +
      (dbl ? heroLine(esc(t('inflDouble')), esc(t('inflDoubleV', { n: num(dbl, 1) }))) : '');
  } else if (s.mode === 'kini') {
    h = '<span class="lbl">' + esc(t('inflHeroKini', { rp: rp(c.amount), n: n })) + '</span><span class="big">' + esc(rp(last.power)) + '</span><span class="sep"></span>' +
      heroLine(esc(t('inflLost')), num(c.loss, 1) + '%');
  } else if (s.mode === 'gaji') {
    h = '<span class="lbl">' + esc(t('inflHeroGaji')) + '</span><span class="big">' + inflasiSigned(c.real) + '<small>%</small></span>' +
      heroCells([[t('inflGajiNom', { n: n }), esc(inflasiMoney(last.nominal))], [t('inflGajiReal'), esc(inflasiMoney(last.real))]]) +
      heroLine(esc(t('inflGajiMin')), esc(t('inflPerYr', { p: num(s.infl, 1) }))) + heroLine(esc(t('inflGajiNeed', { n: n })), esc(rp(last.price)));
  } else {
    h = '<span class="lbl">' + esc(t('inflHeroTab')) + '</span><span class="big">' + inflasiSigned(c.real) + '<small>%</small></span>' +
      heroCells([[t('inflTabNom', { n: n }), esc(inflasiMoney(last.nominal))], [t('inflTabReal'), esc(inflasiMoney(last.real))]]) +
      heroLine(esc(Math.abs(c.real) < 0.005 ? t('inflTabFlat') : c.real > 0 ? t('inflTabUp') : t('inflTabDown')));
  }
  return h;
}

function inflasiInputHtml(c) {
  const s = c.s;
  let h = fSegField('inflasi.mode', t('inflMode'), INFL_MODES.map((k) => [k, L('inflModeOpt')[k]]), { hint: esc(L('inflModeHint')[s.mode]) });
  if (s.mode === 'gaji') {
    const thp = Math.round(netSalary().thp);
    h += fMoney('inflasi.gaji', t('inflGaji')) +
      (thp > 0 && thp !== s.gaji ? '<button type="button" class="link-btn" data-act="set" data-k="inflasi.gaji" data-num="1" data-v="' + thp + '">' + ic('wallet', 18) +
        esc(t('inflUseNet', { rp: rp(thp) })) + '</button>' : '') +
      fNum('inflasi.gajiNaik', t('inflGajiNaik'), { min: 0, max: 50, dec: true, suffix: t('inflPerYrS') });
  } else {
    h += fMoney('inflasi.nominal', L('inflAmt')[s.mode]);
    if (s.mode === 'tabungan') h += fNum('inflasi.ret', t('inflRet'), { min: 0, max: 50, dec: true, suffix: t('inflPerYrS'), hint: esc(t('inflRetHint')) });
  }
  h += '<div style="margin-top:10px">' + fSlider('inflasi.tahun', t('inflYears'), 1, 50, 1, (v) => inflasiN(v)) +
    fSlider('inflasi.infl', t('inflRate'), 0, 15, 0.5, (v) => t('inflPerYr', { p: num(v, 1) }), { sub: () => esc(t('inflRateSub')) }) + '</div>';
  return card(t('inflData'), h, { order: 2, tight: true });
}

function inflasiLossHtml(c) {
  const s = c.s, last = c.series[c.series.length - 1], n = inflasiN(s.tahun);
  const body = s.infl > 0 ?
    callout('trendDown', esc(t('inflLossTitle', { p: num(c.loss, 1), n: n })), esc(t('inflLossSub', { rp: rp(c.amount), now: rp(last.power), n: n, fut: rp(last.price) })), 'warn') :
    callout('info', esc(t('inflZero')), '', 'plain');
  return '<div style="order:3" data-live="inflLoss">' + body + '</div>';
}

function inflasiChartHtml(c) {
  const s = c.s;
  const xy = (k) => c.series.map((r) => ({ x: r.year, v: r[k] }));
  let ser, title;
  if (s.mode === 'gaji' || s.mode === 'tabungan') {
    title = t(s.mode === 'gaji' ? 'inflChartGaji' : 'inflChartTab');
    ser = [{ name: t('inflSerNom'), color: 'var(--amber)', data: xy('nominal') }, { name: t('inflSerReal'), color: 'var(--accent)', width: 3, area: true, data: xy('real') },
      { name: t('inflSerNeed'), color: '#5b6b87', dash: true, data: xy('price') }];
  } else {
    title = t('inflChartPrice');
    ser = [{ name: t('inflSerPrice'), color: 'var(--amber)', width: 3, data: xy('price') }, { name: t('inflSerPower'), color: 'var(--accent)', width: 3, area: true, data: xy('power') }];
  }
  return card(title, '<div data-live="inflChart">' + lineChart(ser, title) + '</div><p class="hint" style="margin-top:6px">' + esc(t('inflChartSub')) + '</p>', { order: 4 });
}

function inflasiTableHtml(c) {
  const s = c.s;
  const ys = INFL_MILESTONES.indexOf(s.tahun) >= 0 ? INFL_MILESTONES.slice() : INFL_MILESTONES.concat([s.tahun]).sort((a, b) => a - b);
  const rowsOf = (cells) => ys.map((y) => {
    const r = { year: y, price: inflFuture(c.amount, s.infl, y), power: inflPresent(c.amount, s.infl, y), nominal: inflFuture(c.amount, c.growth, y) };
    r.real = inflPresent(r.nominal, s.infl, y);
    return '<tr' + (y === s.tahun ? ' style="font-weight:800"' : '') + '><th scope="row">' + esc(inflasiN(y)) + '</th>' + cells(r).map((x) => '<td>' + x + '</td>').join('') + '</tr>';
  }).join('');
  let head, body;
  if (s.mode === 'gaji' || s.mode === 'tabungan') {
    head = ['inflThNom', 'inflThReal', s.mode === 'gaji' ? 'inflThNeed' : 'inflThDiff'];
    body = rowsOf((r) => [esc(compactRp(r.nominal)), esc(compactRp(r.real)),
      s.mode === 'gaji' ? esc(compactRp(r.price)) : inflasiSigned((r.real / Math.max(1, c.amount) - 1) * 100, 1) + '%']);
  } else {
    head = ['inflThPrice', 'inflThPower', 'inflThLoss'];
    body = rowsOf((r) => [esc(compactRp(r.price)), esc(compactRp(r.power)), '−' + num(inflLoss(s.infl, r.year), 1) + '%']);
  }
  return card(t('inflTblTitle'), '<div class="tbl-wrap" data-live="inflTbl"><table class="cmp-table"><thead><tr><th scope="col" style="text-align:left">' + esc(t('inflThYear')) + '</th>' +
    head.map((k) => '<th scope="col">' + esc(t(k)) + '</th>').join('') + '</tr></thead><tbody>' + body + '</tbody></table></div>', { order: 5 });
}

function inflasiInstrHtml(c) {
  const s = c.s, n = inflasiN(s.tahun);
  const base = s.mode === 'gaji' ? 10000000 : c.amount || 10000000;
  const item = (name, sub, net) => {
    const real = inflRealReturn(net, s.infl);
    const val = inflPresent(inflFuture(base, net, s.tahun), s.infl, s.tahun);
    return '<div><span><b>' + esc(name) + '</b><small>' + esc(sub) + '</small><small>' + esc(t('inflInsVal', { rp: inflasiMoney(base), real: inflasiMoney(val), n: n })) + '</small></span>' +
      '<b class="' + (real >= 0 ? 'ok' : 'bad') + '">' + esc(t(real >= 0 ? 'inflRealPos' : 'inflRealNeg', { p: num(Math.abs(real), 2) })) + '</b></div>';
  };
  let rows = INFL_INSTR.map((x) => {
    const net = inflAfterTax(x[1], x[2]);
    return item(L('inflIns')[x[0]], t('inflInsRow', { g: num(x[1], 2), tx: x[2], n: num(net, 2) }), net);
  }).join('');
  if (s.mode === 'tabungan') rows += item(t('inflInsMine'), t('inflInsMineRow', { n: num(s.ret, 2) }), s.ret);
  return card(t('inflInsTitle'), '<p class="hint">' + esc(t('inflInsSub', { i: num(s.infl, 1) })) + '</p><div class="fire-sc" data-live="inflIns">' + rows + '</div>',
    { order: 6, small: esc(t('inflInsSmall')) });
}

function inflasiView() {
  const c = inflasiCalc();
  const top = hero(inflasiHeroHtml(c), { order: 1, label: t('inflTitle') });
  // HP: hero → input → hasil (urut order); desktop: kiri hasil, kanan input
  return cols(top, inflasiLossHtml(c) + inflasiChartHtml(c) + inflasiTableHtml(c), inflasiInputHtml(c) + inflasiInstrHtml(c), note(esc(t('inflNote')), 7));
}
