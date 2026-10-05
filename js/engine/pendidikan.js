/**
 * Mesin hitung Dana Pendidikan Anak. Fungsi murni tanpa DOM — dipakai aplikasi dan diuji di test/.
 * Biaya naik mengikuti inflasi pendidikan (majemuk tahunan); dana dikumpulkan dengan setoran
 * bulanan (akhir bulan) yang tumbuh dengan return investasi: mr = (1 + r)^(1/12) − 1 (sama dengan FIRE).
 */
function eduMonthlyRate(retPct) { return Math.pow(1 + (Number(retPct) || 0) / 100, 1 / 12) - 1; }
/** Biaya masa depan: biaya hari ini × (1 + inflasi)^tahun. */
function eduFutureCost(costToday, inflPct, years) {
  return Math.max(0, Number(costToday) || 0) * Math.pow(1 + (Number(inflPct) || 0) / 100, Math.max(0, Number(years) || 0));
}
/**
 * Setoran bulanan tetap agar terkumpul `fv` dalam `months` bulan (anuitas, setoran akhir bulan).
 * months ≤ 0 → null (tidak ada waktu menabung: harus disiapkan sekaligus, tidak dibagi nol).
 */
function eduRequiredMonthly(fv, months, retPct) {
  const n = Math.round(Number(months) || 0);
  const need = Math.max(0, Number(fv) || 0);
  if (need === 0) return 0;
  if (n <= 0) return null;
  const mr = eduMonthlyRate(retPct);
  return mr > 0 ? need * mr / (Math.pow(1 + mr, n) - 1) : need / n;
}
/**
 * Dana yang perlu siap saat masuk jenjang (nilai masa depan), y = tahun lagi sampai masuk.
 * full = false → uang pangkal + biaya tahun pertama; full = true → uang pangkal + seluruh biaya
 * tahunan selama `lama` tahun (tiap tahun naik inflasi, tanpa diskonto — asumsi konservatif).
 */
function eduNeedAtEntry(lv, inflPct, y, full) {
  const years = full ? Math.max(1, Math.round(lv.lama || 1)) : 1;
  let need = eduFutureCost(lv.pangkal, inflPct, y);
  for (let k = 0; k < years; k++) need += eduFutureCost(lv.tahunan, inflPct, y + k);
  return need;
}
/**
 * Rencana per jenjang.
 * s: {usia, inflasi (%), ret (%), dana (dana pendidikan yang sudah ada), full (bool),
 *     jenjang: [{key, on, usia (usia masuk), pangkal, tahunan, lama}]}
 * Status: off (tidak aktif) · past (usia ≥ masuk + lama) · ongoing (sedang berjalan, dibayar dari arus kas)
 *         · now (masuk tahun ini: 0 bulan, butuh lump sum) · future.
 * Dana yang ada dialokasikan ke jenjang terdekat dulu (nilai kini dari kebutuhan, ikut tumbuh dengan return).
 */
function eduPlan(s) {
  const age = Math.max(0, Number(s.usia) || 0);
  const mr = eduMonthlyRate(s.ret);
  const list = (s.jenjang || []).map((lv, i) => {
    const entry = Number(lv.usia) || 0;
    const lama = Math.max(1, Math.round(Number(lv.lama) || 1));
    const base = { key: lv.key, idx: i, entry, lama, yearsTo: Math.max(0, entry - age), months: 0, need: 0, entryFut: 0, yearlyFut: 0, alloc: 0, remaining: 0, monthly: 0, lump: 0 };
    if (!lv.on) return Object.assign(base, { status: 'off' });
    if (age >= entry + lama) return Object.assign(base, { status: 'past' });
    if (age > entry) return Object.assign(base, { status: 'ongoing', yearlyFut: eduFutureCost(lv.tahunan, 0, 0) });
    const y = entry - age;
    return Object.assign(base, {
      status: y === 0 ? 'now' : 'future', months: y * 12,
      need: eduNeedAtEntry(lv, s.inflasi, y, !!s.full),
      entryFut: eduFutureCost(lv.pangkal, s.inflasi, y), yearlyFut: eduFutureCost(lv.tahunan, s.inflasi, y)
    });
  });
  // alokasi dana yang ada: jenjang terdekat dulu
  let left = Math.max(0, Number(s.dana) || 0);
  list.filter((x) => x.status === 'now' || x.status === 'future').sort((a, b) => a.entry - b.entry || a.idx - b.idx).forEach((x) => {
    const growth = Math.pow(1 + mr, x.months);
    const pv = x.need / growth;
    x.alloc = Math.min(left, pv);
    left -= x.alloc;
    x.remaining = Math.max(0, x.need - x.alloc * growth);
    if (x.remaining < 0.5) x.remaining = 0;
    const m = eduRequiredMonthly(x.remaining, x.months, s.ret);
    if (m === null) { x.monthly = 0; x.lump = x.remaining; } else x.monthly = m;
  });
  const act = list.filter((x) => x.status === 'now' || x.status === 'future');
  const nearest = act.slice().sort((a, b) => a.entry - b.entry || a.idx - b.idx)[0] || null;
  return {
    levels: list, active: act, nearest,
    monthly: act.reduce((a, x) => a + x.monthly, 0),
    needTotal: act.reduce((a, x) => a + x.need, 0),
    lumpNow: act.reduce((a, x) => a + x.lump, 0),
    surplus: left
  };
}
/** Total setoran per bulan menurut usia anak (setoran tiap jenjang berhenti saat jenjang itu dimulai). */
function eduSchedule(plan, age, toAge) {
  const out = [];
  const end = Math.max(age, toAge === undefined ? Math.max(age, ...plan.active.map((x) => x.entry)) : toAge);
  for (let a = age; a <= end; a++) out.push({ age: a, v: plan.active.filter((x) => x.entry > a).reduce((s, x) => s + x.monthly, 0) });
  return out;
}
if (typeof module === 'object' && module.exports) {
  module.exports = { eduMonthlyRate, eduFutureCost, eduRequiredMonthly, eduNeedAtEntry, eduPlan, eduSchedule };
}
