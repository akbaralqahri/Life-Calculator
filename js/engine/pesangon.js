/**
 * Mesin hitung Pesangon PHK & uang kompensasi PKWT. Fungsi murni tanpa DOM — diuji di test/pesangon.test.js.
 *
 * Dasar: PP 35/2021 Pasal 40–59 (UP, UPMK, UPH, pengali per alasan PHK) dan Pasal 15–17 (kompensasi PKWT);
 * PP 36/2021 Pasal 17 (upah sehari = upah sebulan ÷ 25 untuk 6 hari kerja, ÷ 21 untuk 5 hari kerja);
 * PP 68/2009 & PMK 16/PMK.03/2010 (PPh 21 final atas uang pesangon: 0% / 5% / 15% / 25%).
 */

/**
 * Alasan PHK → pengali uang pesangon (up, × Pasal 40 ayat 2) dan UPMK (upmk, × Pasal 40 ayat 3).
 * Semua alasan berhak UPH (Pasal 40 ayat 4). pisah = berhak uang pisah (besaran menurut PK/PP/PKB).
 */
const SEV_REASONS = [
  { id: 'efRugi', up: 0.5, upmk: 1, pisah: false, pasal: '43 (1)' },
  { id: 'efCegah', up: 1, upmk: 1, pisah: false, pasal: '43 (2)' },
  { id: 'merger', up: 1, upmk: 1, pisah: false, pasal: '41' },
  { id: 'akuisisi', up: 1, upmk: 1, pisah: false, pasal: '42 (1)' },
  { id: 'akuisisiSyarat', up: 0.5, upmk: 1, pisah: false, pasal: '42 (2)' },
  { id: 'tutupRugi', up: 0.5, upmk: 1, pisah: false, pasal: '44 (1)' },
  { id: 'tutupBukanRugi', up: 1, upmk: 1, pisah: false, pasal: '44 (2)' },
  { id: 'fmTutup', up: 0.5, upmk: 1, pisah: false, pasal: '45 (1)' },
  { id: 'fmTidakTutup', up: 0.75, upmk: 1, pisah: false, pasal: '45 (2)' },
  { id: 'pkpuRugi', up: 0.5, upmk: 1, pisah: false, pasal: '46 (1)' },
  { id: 'pkpuBukanRugi', up: 1, upmk: 1, pisah: false, pasal: '46 (2)' },
  { id: 'pailit', up: 0.5, upmk: 1, pisah: false, pasal: '47' },
  { id: 'pengusahaLanggar', up: 1, upmk: 1, pisah: false, pasal: '48' },
  { id: 'pengusahaTidakTerbukti', up: 0, upmk: 0, pisah: true, pasal: '49' },
  { id: 'resign', up: 0, upmk: 0, pisah: true, pasal: '50' },
  { id: 'mangkir', up: 0, upmk: 0, pisah: true, pasal: '51' },
  { id: 'sp3', up: 0.5, upmk: 1, pisah: false, pasal: '52 (1)' },
  { id: 'mendesak', up: 0, upmk: 0, pisah: true, pasal: '52 (2)' },
  { id: 'ditahanRugi', up: 0, upmk: 0, pisah: true, pasal: '54 (1), (4)' },
  { id: 'ditahanTidakRugi', up: 0, upmk: 1, pisah: false, pasal: '54 (2), (5)' },
  { id: 'sakit', up: 2, upmk: 1, pisah: false, pasal: '55' },
  { id: 'pensiun', up: 1.75, upmk: 1, pisah: false, pasal: '56' },
  { id: 'meninggal', up: 2, upmk: 1, pisah: false, pasal: '57' }
];
/** Lapisan PPh 21 final pesangon (PP 68/2009 Pasal 2): [batas atas, tarif %]. */
const SEV_TAX_LAYERS = [[50000000, 0], [100000000, 5], [500000000, 15], [null, 25]];

const SEV_DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
function sevParse(k) {
  const m = SEV_DATE_RE.exec(String(k || ''));
  if (!m) return null;
  const d = Date.UTC(+m[1], +m[2] - 1, +m[3]);
  return isFinite(d) ? d : null;
}
/** Tambah n bulan (hari dipotong ke akhir bulan bila perlu, mis. 31 Jan + 1 bln = 28/29 Feb). */
function sevAddMonths(ms, n) {
  const d = new Date(ms);
  const y = d.getUTCFullYear(), m = d.getUTCMonth() + n, day = d.getUTCDate();
  const last = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  return Date.UTC(y, m, Math.min(day, last));
}
/**
 * Masa kerja dari tanggal mulai s.d. tanggal berakhir (hari terakhir bekerja, ikut dihitung).
 * → { valid, years, months (sisa bulan), days, totalMonths (bulan penuh), monthsExact (bulan + hari/30) }
 */
function sevTenure(start, end) {
  const a = sevParse(start), b0 = sevParse(end);
  if (a === null || b0 === null || b0 < a) return { valid: false, years: 0, months: 0, days: 0, totalMonths: 0, monthsExact: 0 };
  const b = b0 + 86400000; // hari terakhir ikut dihitung
  const d1 = new Date(a), d2 = new Date(b);
  let m = (d2.getUTCFullYear() - d1.getUTCFullYear()) * 12 + (d2.getUTCMonth() - d1.getUTCMonth());
  while (m > 0 && sevAddMonths(a, m) > b) m--;
  while (sevAddMonths(a, m + 1) <= b) m++;
  const days = Math.round((b - sevAddMonths(a, m)) / 86400000);
  return { valid: true, years: Math.floor(m / 12), months: m % 12, days, totalMonths: m, monthsExact: m + days / 30 };
}
/** Uang pesangon (bulan upah) menurut masa kerja penuh — PP 35/2021 Pasal 40 ayat (2). */
function sevUpMonths(years) {
  const y = Math.max(0, Math.floor(years || 0));
  return y < 8 ? y + 1 : 9;
}
/** UPMK (bulan upah) — PP 35/2021 Pasal 40 ayat (3). */
function sevUpmkMonths(years) {
  const y = Math.max(0, Math.floor(years || 0));
  if (y < 3) return 0;
  if (y >= 24) return 10;
  return Math.floor(y / 3) + 1;
}
/** Upah sehari — PP 36/2021 Pasal 17: ÷ 25 (6 hari kerja/minggu) atau ÷ 21 (5 hari kerja/minggu). */
function sevDailyWage(upah, hariKerja) { return Math.max(0, upah || 0) / (hariKerja === 6 ? 25 : 21); }
/** Uang kompensasi PKWT — PP 35/2021 Pasal 15–16: masa kerja (bulan) ÷ 12 × 1 bulan upah; minimal 1 bulan. */
function sevKompensasi(upah, monthsExact) {
  const m = Math.max(0, monthsExact || 0);
  return m < 1 ? 0 : Math.max(0, upah || 0) * m / 12;
}
/** PPh 21 final atas pesangon (progresif per lapisan). */
function sevTax(gross) {
  let rest = Math.max(0, gross || 0), prev = 0, tax = 0;
  const layers = [];
  SEV_TAX_LAYERS.forEach((l) => {
    const cap = l[0] === null ? Infinity : l[0];
    const base = Math.max(0, Math.min(rest, cap - prev));
    const part = base * l[1] / 100;
    layers.push({ from: prev, to: l[0], rate: l[1], base, tax: part });
    tax += part;
    rest -= base;
    prev = cap;
  });
  return { tax, layers };
}
function sevReason(id) { return SEV_REASONS.find((r) => r.id === id) || SEV_REASONS[0]; }
/**
 * Hitung hak PHK / kompensasi PKWT.
 * o: { status: 'pkwtt'|'pkwt', mulai, akhir, upah, alasan, cutiHari, hariKerja (5|6),
 *      biayaPulang, lainUph, uangPisah, pkwtFinal (kompensasi PKWT dipajaki sebagai pesangon) }
 */
function sevCalc(o) {
  const ten = sevTenure(o.mulai, o.akhir);
  const upah = Math.max(0, o.upah || 0);
  const pkwt = o.status === 'pkwt';
  const r = sevReason(o.alasan);
  const daily = sevDailyWage(upah, o.hariKerja);
  const res = {
    tenure: ten, upah, pkwt, reason: r, daily,
    upMonths: sevUpMonths(ten.years), upmkMonths: sevUpmkMonths(ten.years),
    up: 0, upmk: 0, uphCuti: 0, biayaPulang: 0, lainUph: 0, uph: 0, pisah: 0, kompensasi: 0
  };
  if (ten.valid) {
    if (pkwt) res.kompensasi = sevKompensasi(upah, ten.monthsExact);
    else {
      res.up = r.up * res.upMonths * upah;
      res.upmk = r.upmk * res.upmkMonths * upah;
      res.uphCuti = Math.max(0, o.cutiHari || 0) * daily;
      res.biayaPulang = Math.max(0, o.biayaPulang || 0);
      res.lainUph = Math.max(0, o.lainUph || 0);
      res.uph = res.uphCuti + res.biayaPulang + res.lainUph;
      res.pisah = r.pisah ? Math.max(0, o.uangPisah || 0) : 0;
    }
  }
  res.gross = res.up + res.upmk + res.uph + res.pisah + res.kompensasi;
  res.taxable = pkwt && !o.pkwtFinal ? res.gross - res.kompensasi : res.gross;
  const tx = sevTax(res.taxable);
  res.tax = tx.tax;
  res.layers = tx.layers;
  res.net = res.gross - res.tax;
  return res;
}
/** Total untuk setiap alasan PHK dengan input yang sama (kartu perbandingan). */
function sevCompare(o) {
  return SEV_REASONS.map((r) => Object.assign({ id: r.id }, sevCalc(Object.assign({}, o, { status: 'pkwtt', alasan: r.id }))));
}

if (typeof module === 'object' && module.exports) {
  module.exports = { SEV_REASONS, SEV_TAX_LAYERS, sevTenure, sevAddMonths, sevUpMonths, sevUpmkMonths, sevDailyWage, sevKompensasi, sevTax, sevReason, sevCalc, sevCompare };
}
