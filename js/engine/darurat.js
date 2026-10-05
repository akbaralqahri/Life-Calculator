/**
 * Mesin hitung Dana Darurat. Fungsi murni tanpa DOM — dipakai aplikasi dan diuji di test/.
 * Rekomendasi bulan mengikuti panduan perencana keuangan Indonesia yang umum:
 *   lajang 3–6 bln · menikah 6–9 bln · menikah + anak 9–12 bln,
 *   kontrak +0–3 bln · freelance/usaha +3–6 bln · anak ke-3 dst. +1 bln per anak (maks. +3).
 * Target memakai BATAS ATAS rentang (lebih aman), maksimal 24 bulan.
 */
const EMERG_BASE = { lajang: [3, 6], menikah: [6, 9], anak: [9, 12] };
const EMERG_JOB = { tetap: [0, 0], kontrak: [0, 3], freelance: [3, 6] };
const EMERG_MAX_MONTHS = 24;

/** Bunga bulanan majemuk yang setara dengan return tahunan (%). */
function emergMonthlyRate(annualPct) {
  const r = Number(annualPct) || 0;
  return r > 0 ? Math.pow(1 + r / 100, 1 / 12) - 1 : 0;
}

/**
 * Rekomendasi jumlah bulan. status: 'tetap' | 'kontrak' | 'freelance';
 * tanggungan: 'lajang' | 'menikah' | 'anak'; anak: jumlah anak (dipakai bila tanggungan 'anak').
 * → { min, max, months (= max, dibatasi 24), base: [a,b], job: [a,b], kids }
 */
function emergRecommend(status, tanggungan, anak) {
  const base = EMERG_BASE[tanggungan] || EMERG_BASE.lajang;
  const job = EMERG_JOB[status] || EMERG_JOB.tetap;
  const n = tanggungan === 'anak' ? Math.max(0, Math.round(Number(anak) || 0)) : 0;
  const kids = Math.min(3, Math.max(0, n - 2));
  const min = Math.min(EMERG_MAX_MONTHS, base[0] + job[0] + kids);
  const max = Math.min(EMERG_MAX_MONTHS, base[1] + job[1] + kids);
  return { min, max, months: max, base: base.slice(), job: job.slice(), kids };
}

/** Target dana darurat = bulan × pengeluaran wajib per bulan. */
function emergTarget(months, monthlyExpense) {
  return Math.max(0, Number(months) || 0) * Math.max(0, Number(monthlyExpense) || 0);
}

/** Jumlah rincian pengeluaran (nilai negatif/tidak valid dianggap 0). */
function emergSum(list) {
  return (list || []).reduce((a, v) => a + Math.max(0, Number(v) || 0), 0);
}

/** Persen terkumpul, dibatasi 0–100 (target 0 → 100 bila sudah ada dana, selain itu 0). */
function emergProgress(current, target) {
  if (!(target > 0)) return current > 0 ? 100 : 0;
  return Math.max(0, Math.min(100, (Math.max(0, current) / target) * 100));
}

/**
 * Berapa bulan sampai dana ≥ target, dengan setoran tiap akhir bulan dan return bulanan majemuk.
 * 0 bila sudah tercapai. null bila tidak pernah: setoran 0 (bunga RDPU ±setara inflasi, jadi tidak
 * diandalkan untuk menutup kekurangan) atau lebih dari maxMonths (bawaan 600 = 50 tahun).
 */
function emergMonthsToGoal(current, monthly, target, annualPct, maxMonths) {
  const cur = Math.max(0, Number(current) || 0);
  const dep = Math.max(0, Number(monthly) || 0);
  const tgt = Math.max(0, Number(target) || 0);
  if (cur >= tgt) return 0;
  if (dep <= 0) return null;
  const cap = maxMonths || 600;
  const r = emergMonthlyRate(annualPct);
  if (r === 0) {
    const n = Math.ceil((tgt - cur) / dep - 1e-9);
    return n <= cap ? n : null;
  }
  let bal = cur;
  for (let m = 1; m <= cap; m++) {
    bal = bal * (1 + r) + dep;
    if (bal >= tgt - 1e-6) return m;
  }
  return null;
}

/** Setoran per bulan agar dana ≥ target dalam n bulan (anuitas, setoran akhir bulan). 0 bila sudah tercapai. */
function emergDepositFor(current, target, months, annualPct) {
  const cur = Math.max(0, Number(current) || 0);
  const tgt = Math.max(0, Number(target) || 0);
  const n = Math.max(1, Math.round(Number(months) || 1));
  const r = emergMonthlyRate(annualPct);
  const g = Math.pow(1 + r, n);
  const need = tgt - cur * g;
  if (need <= 0) return 0;
  return r === 0 ? need / n : need * r / (g - 1);
}

/** Saldo tiap bulan (bulan 0..n) dengan setoran & return — untuk grafik. */
function emergSchedule(current, monthly, annualPct, months) {
  const r = emergMonthlyRate(annualPct);
  const dep = Math.max(0, Number(monthly) || 0);
  let bal = Math.max(0, Number(current) || 0);
  const out = [{ m: 0, v: bal }];
  for (let m = 1; m <= Math.max(0, Math.round(months || 0)); m++) {
    bal = bal * (1 + r) + dep;
    out.push({ m, v: bal });
  }
  return out;
}

/**
 * Tangga likuiditas: 1× pengeluaran di tabungan terpisah (cair hari itu), sisanya dibagi dua:
 * separuh di RDPU (T+1/T+2), separuh di deposito 1–3 bulan / emas. Hasilnya RDPU ±⅓–½ target.
 * → { cash, mmf, term } (jumlah = target)
 */
function emergLadder(target, monthlyExpense) {
  const tgt = Math.max(0, Number(target) || 0);
  const cash = Math.min(tgt, Math.max(0, Number(monthlyExpense) || 0));
  const rest = tgt - cash;
  const mmf = rest / 2;
  return { cash, mmf, term: rest - mmf };
}

if (typeof module === 'object' && module.exports) {
  module.exports = { EMERG_BASE, EMERG_JOB, emergMonthlyRate, emergRecommend, emergTarget, emergSum, emergProgress, emergMonthsToGoal, emergDepositFor, emergSchedule, emergLadder };
}
