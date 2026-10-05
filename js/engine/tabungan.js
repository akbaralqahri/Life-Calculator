/**
 * Mesin hitung Target Tabungan & DCA. Fungsi murni tanpa DOM — dipakai aplikasi dan diuji di test/.
 * Bunga majemuk bulanan konsisten dengan FIRE: mr = (1 + r)^(1/12) − 1, setoran di AKHIR bulan.
 * Step-up: setoran naik g% tiap 12 bulan (bulan 1–12 = setoran awal, bulan 13–24 = ×(1+g), dst).
 */
/** Bunga bulanan efektif dari return tahunan (%). */
function savMonthlyRate(retPct) { return Math.pow(1 + (Number(retPct) || 0) / 100, 1 / 12) - 1; }
/** Setoran pada bulan ke-m (1-based) dengan kenaikan stepUp% per tahun. */
function savPmtAt(monthly, stepUpPct, m) { return monthly * Math.pow(1 + (Number(stepUpPct) || 0) / 100, Math.floor((m - 1) / 12)); }
function savMonths(n) { return Math.max(0, Math.round(Number(n) || 0)); }
/**
 * Nilai akhir: saldo awal tumbuh + setoran bulanan (akhir bulan) dengan step-up.
 * p: {initial, monthly, months, ret (%/thn), stepUp (%/thn)}
 */
function savFutureValue(p) {
  const n = savMonths(p.months);
  const mr = savMonthlyRate(p.ret);
  let bal = Math.max(0, Number(p.initial) || 0);
  for (let m = 1; m <= n; m++) bal = bal * (1 + mr) + savPmtAt(Math.max(0, Number(p.monthly) || 0), p.stepUp, m);
  return bal;
}
/** Target dalam nilai masa depan bila naik mengikuti inflasi (%/thn) selama `months` bulan. */
function savTargetFuture(target, inflPct, months) {
  return Math.max(0, Number(target) || 0) * Math.pow(1 + (Number(inflPct) || 0) / 100, savMonths(months) / 12);
}
/**
 * Setoran bulan PERTAMA yang dibutuhkan agar nilai akhir = target (sudah dalam nilai masa depan).
 * Nilai akhir linier terhadap setoran, jadi rumus tertutup: (target − saldo awal tumbuh) ÷ FV(setoran 1).
 * p: {target, initial, months, ret, stepUp}. 0 bila saldo awal sudah cukup.
 */
function savRequiredMonthly(p) {
  const n = savMonths(p.months);
  const grown = savFutureValue({ initial: p.initial, monthly: 0, months: n, ret: p.ret });
  const gap = (Number(p.target) || 0) - grown;
  if (gap <= 0) return 0;
  if (n === 0) return Infinity;
  const unit = savFutureValue({ initial: 0, monthly: 1, months: n, ret: p.ret, stepUp: p.stepUp });
  return gap / unit;
}
/** Setor sekali hari ini (di luar saldo awal) agar mencapai target tanpa setoran bulanan. */
function savLumpSum(p) {
  const n = savMonths(p.months);
  const pv = (Number(p.target) || 0) / Math.pow(1 + savMonthlyRate(p.ret), n);
  return Math.max(0, pv - Math.max(0, Number(p.initial) || 0));
}
/**
 * Deret saldo bulanan + ringkasan per tahun.
 * p: {initial, monthly, months, ret, stepUp, target (nilai hari ini), infl (%/thn; 0 = tanpa penyesuaian)}
 * → {points: [{m, pmt, deposits, paid, balance, target}], years: [...akhir tiap tahun & bulan terakhir],
 *    final, deposits (setoran saja), paid (saldo awal + setoran), gain, hitMonth (bulan pertama saldo ≥ target, atau null)}
 */
function savSeries(p) {
  const n = savMonths(p.months);
  const mr = savMonthlyRate(p.ret);
  const initial = Math.max(0, Number(p.initial) || 0);
  const monthly = Math.max(0, Number(p.monthly) || 0);
  const tgt = (m) => savTargetFuture(p.target, p.infl, m);
  let bal = initial, dep = 0, hit = tgt(0) > 0 && bal >= tgt(0) ? 0 : null;
  const points = [{ m: 0, pmt: 0, deposits: 0, paid: initial, balance: bal, target: tgt(0) }];
  for (let m = 1; m <= n; m++) {
    const pmt = savPmtAt(monthly, p.stepUp, m);
    bal = bal * (1 + mr) + pmt;
    dep += pmt;
    const tg = tgt(m);
    if (hit === null && tg > 0 && bal >= tg) hit = m;
    points.push({ m, pmt, deposits: dep, paid: initial + dep, balance: bal, target: tg });
  }
  const years = points.filter((x) => x.m > 0 && (x.m % 12 === 0 || x.m === n));
  return { points, years, final: bal, deposits: dep, paid: initial + dep, gain: bal - initial - dep, hitMonth: hit };
}
/**
 * Rencana lengkap untuk tampilan.
 * s: {mode 'target'|'sim', target, inflasi (bool), inflRate, years, months, initial, ret, stepUp, monthly}
 */
function savPlan(s) {
  const n = savMonths((Number(s.years) || 0) * 12 + (Number(s.months) || 0));
  const infl = s.inflasi ? Number(s.inflRate) || 0 : 0;
  const targetFut = savTargetFuture(s.target, infl, n);
  const base = { target: targetFut, initial: s.initial, months: n, ret: s.ret, stepUp: s.stepUp };
  const required = savRequiredMonthly(base);
  const requiredNoReturn = savRequiredMonthly(Object.assign({}, base, { ret: 0 }));
  const lump = savLumpSum(base);
  const monthly = s.mode === 'sim' ? Math.max(0, Number(s.monthly) || 0) : (isFinite(required) ? required : 0);
  const ser = savSeries({ initial: s.initial, monthly, months: n, ret: s.ret, stepUp: s.stepUp, target: s.target, infl });
  const lastPmt = n > 0 ? savPmtAt(monthly, s.stepUp, n) : 0;
  return {
    n, infl, targetFut, required, requiredNoReturn, lump, monthly, lastPmt,
    series: ser, final: ser.final, deposits: ser.deposits, gain: ser.gain, hitMonth: ser.hitMonth,
    already: required === 0, reached: ser.final >= targetFut - 0.5, shortfall: Math.max(0, targetFut - ser.final)
  };
}
if (typeof module === 'object' && module.exports) {
  module.exports = { savMonthlyRate, savPmtAt, savFutureValue, savTargetFuture, savRequiredMonthly, savLumpSum, savSeries, savPlan };
}
