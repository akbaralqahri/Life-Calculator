/**
 * Mesin hitung Inflasi & Daya Beli. Fungsi murni tanpa DOM — dipakai aplikasi dan diuji di test/.
 * Semua tarif dalam persen per tahun, bunga majemuk tahunan.
 */

/** Harga/nilai nominal setelah `years` tahun naik `rate`% per tahun: amount × (1 + r)^n. */
function inflFuture(amount, rate, years) {
  return (Number(amount) || 0) * Math.pow(1 + (Number(rate) || 0) / 100, Math.max(0, Number(years) || 0));
}
/** Nilai hari ini dari uang di masa depan: amount ÷ (1 + r)^n. */
function inflPresent(amount, rate, years) {
  return (Number(amount) || 0) / Math.pow(1 + (Number(rate) || 0) / 100, Math.max(0, Number(years) || 0));
}
/** Return riil (persen) — rumus Fisher: (1 + nominal) ÷ (1 + inflasi) − 1. */
function inflRealReturn(nominal, infl) {
  return ((1 + (Number(nominal) || 0) / 100) / (1 + (Number(infl) || 0) / 100) - 1) * 100;
}
/** Persen daya beli yang hilang setelah n tahun: 1 − 1 ÷ (1 + i)^n. */
function inflLoss(rate, years) {
  return (1 - inflPresent(1, rate, years)) * 100;
}
/** Tahun sampai harga berlipat dua: ln 2 ÷ ln(1 + i). null bila inflasi ≤ 0. */
function inflDoubleYears(rate) {
  const r = (Number(rate) || 0) / 100;
  return r > 0 ? Math.log(2) / Math.log(1 + r) : null;
}
/** Bunga bersih setelah pajak (persen): bruto × (1 − pajak). */
function inflAfterTax(gross, tax) {
  return (Number(gross) || 0) * (1 - (Number(tax) || 0) / 100);
}
/**
 * Deret tahunan 0…years.
 * amount = nominal awal; infl = inflasi %; growth = pertumbuhan nominal % (gaji naik / bunga bersih; 0 = uang diam).
 * price  = amount × (1+i)^y   (harga barang senilai amount hari ini)
 * power  = amount ÷ (1+i)^y   (daya beli uang yang tidak tumbuh, dalam uang hari ini)
 * nominal= amount × (1+g)^y   (gaji/saldo nominal)
 * real   = nominal ÷ (1+i)^y  (nilai riil gaji/saldo dalam uang hari ini)
 */
function inflSeries(amount, infl, years, growth) {
  const out = [];
  const n = Math.max(0, Math.round(Number(years) || 0));
  for (let y = 0; y <= n; y++) {
    const nominal = inflFuture(amount, growth || 0, y);
    out.push({ year: y, price: inflFuture(amount, infl, y), power: inflPresent(amount, infl, y), nominal, real: inflPresent(nominal, infl, y) });
  }
  return out;
}

if (typeof module === 'object' && module.exports) {
  module.exports = { inflFuture, inflPresent, inflRealReturn, inflLoss, inflDoubleYears, inflAfterTax, inflSeries };
}
