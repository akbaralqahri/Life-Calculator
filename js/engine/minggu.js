/**
 * Mesin hitung Hidup dalam Minggu. Fungsi murni tanpa DOM — dipakai aplikasi dan diuji di test/.
 * Semua tanggal berupa teks 'yyyy-mm-dd' dan dihitung dengan Date.UTC (tanpa masalah zona waktu).
 * "Hari ini" selalu diberikan sebagai parameter supaya bisa diuji.
 * Ulang tahun 29 Februari di tahun bukan kabisat dianggap jatuh pada 28 Februari.
 */
const LIFE_DAY_MS = 86400000;
const LIFE_YEAR_DAYS = 365.25;
const LIFE_HIJRI_YEAR_DAYS = 354.367; // satu tahun Hijriah ≈ 354,367 hari → Lebaran datang ±11 hari lebih awal tiap tahun
const LIFE_PHASES = ['kecil', 'sekolah', 'kuliah', 'kerja', 'pensiun'];

/** 'yyyy-mm-dd' → {y, m, d} atau null bila tidak valid (mis. 2023-02-29). */
function lifeParse(s) {
  if (s && typeof s === 'object' && s.y) return s;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || ''));
  if (!m) return null;
  const y = +m[1], mo = +m[2], d = +m[3];
  if (mo < 1 || mo > 12 || d < 1 || d > lifeDim(y, mo)) return null;
  return { y, m: mo, d };
}
/** Jumlah hari dalam bulan m (1–12) tahun y. */
function lifeDim(y, m) { return new Date(Date.UTC(y, m, 0)).getUTCDate(); }
/** Nomor hari sejak 1970-01-01 (UTC). */
function lifeDayNum(p) { return Math.round(Date.UTC(p.y, p.m - 1, p.d) / LIFE_DAY_MS); }
/** Tanggal + n bulan; hari dipotong ke akhir bulan (31 Jan + 1 bln = 28/29 Feb). */
function lifeAddMonths(p, n) {
  const tot = p.y * 12 + (p.m - 1) + n;
  const y = Math.floor(tot / 12), m = tot - y * 12 + 1;
  return { y, m, d: Math.min(p.d, lifeDim(y, m)) };
}

/**
 * Umur tepat pada tanggal today.
 * → { years, months, days, totalDays, ageYears (desimal: tahun + bagian tahun sejak ulang tahun terakhir) }
 *   atau null bila tanggal tidak valid / lahir setelah today.
 */
function lifeAge(birth, today) {
  const b = lifeParse(birth), t = lifeParse(today);
  if (!b || !t) return null;
  const tn = lifeDayNum(t), bn = lifeDayNum(b);
  if (bn > tn) return null;
  let M = (t.y - b.y) * 12 + (t.m - b.m);
  while (M > 0 && lifeDayNum(lifeAddMonths(b, M)) > tn) M--;
  const years = Math.floor(M / 12);
  const last = lifeDayNum(lifeAddMonths(b, years * 12));
  const next = lifeDayNum(lifeAddMonths(b, (years + 1) * 12));
  return {
    years, months: M - years * 12, days: tn - lifeDayNum(lifeAddMonths(b, M)), totalDays: tn - bn,
    ageYears: years + (tn - last) / (next - last)
  };
}

/** Jam kerja tersisa sampai pensiun = jam/minggu × minggu kerja/thn × tahun ke pensiun (0 bila sudah lewat). */
function lifeWorkHoursLeft(hoursPerWeek, ageYears, retireAge, weeksPerYear) {
  const yrs = Math.max(0, (Number(retireAge) || 0) - (Number(ageYears) || 0));
  return Math.max(0, Number(hoursPerWeek) || 0) * (weeksPerYear === undefined ? 48 : weeksPerYear) * yrs;
}

/** Fase hidup pada usia a (tahun bulat): kecil 0–5, sekolah 6–17, kuliah/awal kerja 18–22, kerja sampai pensiun, pensiun. */
function lifePhase(a, retireAge) {
  if (a < 6) return 'kecil';
  if (a < 18) return 'sekolah';
  if (a < 23) return 'kuliah';
  if (a < retireAge) return 'kerja';
  return 'pensiun';
}

/**
 * Ringkasan hidup dalam minggu.
 * o: { birth, today, lifeExp (thn), retireAge, hoursPerWeek, workWeeks (bawaan 48), bpm (bawaan 70), sleepHours (bawaan 8) }
 * → null bila tanggal tidak valid.
 */
function lifeStats(o) {
  const age = lifeAge(o.birth, o.today);
  if (!age) return null;
  const exp = Math.max(0, Number(o.lifeExp) || 0);
  const expDays = exp * LIFE_YEAR_DAYS;
  const weeksLived = Math.floor(age.totalDays / 7);
  const totalWeeks = Math.round(expDays / 7);
  const yearsLeft = Math.max(0, exp - age.ageYears);
  const sleep = o.sleepHours === undefined ? 8 : o.sleepHours;
  return {
    age, weeksLived, weekNo: weeksLived + 1, totalWeeks,
    pct: expDays > 0 ? Math.max(0, Math.min(100, age.totalDays / expDays * 100)) : 100,
    weeksLeft: Math.max(0, totalWeeks - weeksLived),
    daysLeft: Math.max(0, Math.round(expDays) - age.totalDays),
    yearsLeft, beyond: age.ageYears >= exp,
    weekendsLeft: Math.max(0, totalWeeks - weeksLived),
    lebaranLeft: Math.floor(yearsLeft * LIFE_YEAR_DAYS / LIFE_HIJRI_YEAR_DAYS),
    sleepHours: age.totalDays * sleep,
    heartbeats: age.totalDays * 1440 * (o.bpm === undefined ? 70 : o.bpm),
    yearsToRetire: Math.max(0, (Number(o.retireAge) || 0) - age.ageYears),
    workHoursLeft: lifeWorkHoursLeft(o.hoursPerWeek, age.ageYears, o.retireAge, o.workWeeks)
  };
}

/**
 * Baris grid (satu baris = satu tahun usia, 52 kotak).
 * Jumlah baris = harapan hidup dibulatkan ke atas; bila usia sudah melewatinya, sampai usia sekarang + 2.
 * → { rows: [{ age, phase, lived (0–52 kotak terlewati), cap (0–52 kotak di dalam harapan hidup) }], nowRow, nowCol }
 */
function lifeGrid(ageYears, lifeExp, retireAge) {
  const a = Math.max(0, Number(ageYears) || 0);
  const exp = Math.max(0, Number(lifeExp) || 0);
  const nowRow = Math.floor(a);
  const nowCol = Math.min(51, Math.floor((a - nowRow) * 52));
  const n = Math.min(120, Math.max(1, Math.ceil(exp), nowRow + 3));
  const rows = [];
  for (let i = 0; i < n; i++) {
    rows.push({
      age: i, phase: lifePhase(i, retireAge),
      lived: i < nowRow ? 52 : i === nowRow ? nowCol : 0,
      cap: i + 1 <= exp ? 52 : i < exp ? Math.round((exp - i) * 52) : 0
    });
  }
  return { rows, nowRow, nowCol };
}

if (typeof module === 'object' && module.exports) {
  module.exports = { LIFE_PHASES, lifeParse, lifeDim, lifeDayNum, lifeAddMonths, lifeAge, lifeWorkHoursLeft, lifePhase, lifeStats, lifeGrid };
}
