/**
 * Mesin hitung Karier: gaji bersih (PPh 21 TER & BPJS), nilai waktu, upah minimum,
 * dan dua tawaran kerja. Fungsi murni tanpa DOM — dipakai aplikasi dan diuji di test/.
 * Diambil dari Habit Tracker (WebApp.html, blok CALC) tanpa perubahan rumus.
 */
const PTKP_CAT = { 'TK/0': 'A', 'TK/1': 'A', 'K/0': 'A', 'TK/2': 'B', 'TK/3': 'B', 'K/1': 'B', 'K/2': 'B', 'K/3': 'C' };
function terRate(table, bruto) {
  for (let i = 0; i < table.length; i++) {
    if (table[i][0] === null || bruto <= table[i][0]) return table[i][1];
  }
  return table[table.length - 1][1];
}
function progressiveTax(pkp, brackets) {
  let rest = pkp, prev = 0, tax = 0;
  for (let i = 0; i < brackets.length && rest > 0; i++) {
    const cap = brackets[i][0] === null ? Infinity : brackets[i][0];
    const part = Math.min(rest, cap - prev);
    if (part <= 0) continue;
    tax += part * brackets[i][1] / 100;
    rest -= part;
    prev = cap;
  }
  return Math.floor(tax);
}
/**
 * Gaji bersih karyawan tetap (PP 58/2023 & PMK 168/2023, BPJS).
 * inp: {gaji, tunjangan, tidakTetap, thr, ptkp, kes, jht, jp, jkk, dtp}
 * cfg: nilai sheet Config (persen ditulis 1 = 1%); ter: {A,B,C}; brackets: Pasal 17
 */
function calcSalary(inp, cfg, ter, brackets) {
  const P = (k) => (Number(cfg[k]) || 0) / 100;
  const upah = Math.max(0, inp.gaji) + Math.max(0, inp.tunjangan);
  const pay = upah + Math.max(0, inp.tidakTetap || 0);
  const thr = Math.max(0, inp.thr || 0);
  const kesBase = Math.min(upah, cfg.BPJS_KES_BATAS_UPAH);
  const jpBase = Math.min(upah, cfg.JP_BATAS_UPAH);
  const emp = {
    kes: inp.kes ? kesBase * P('BPJS_KES_PERUSAHAAN') : 0,
    jht: inp.jht ? upah * P('JHT_PERUSAHAAN') : 0,
    jp: inp.jp ? jpBase * P('JP_PERUSAHAAN') : 0,
    jkk: upah * P('JKK_' + (inp.jkk || 'SANGAT_RENDAH')),
    jkm: upah * P('JKM')
  };
  const ee = {
    kes: inp.kes ? kesBase * P('BPJS_KES_PEKERJA') : 0,
    jht: inp.jht ? upah * P('JHT_PEKERJA') : 0,
    jp: inp.jp ? jpBase * P('JP_PEKERJA') : 0
  };
  const premi = emp.kes + emp.jkk + emp.jkm;
  const bpjs = ee.kes + ee.jht + ee.jp;
  const bruto = pay + premi;
  const kat = PTKP_CAT[inp.ptkp] || 'A';
  const rate = terRate(ter[kat], bruto);
  const dtp = !!inp.dtp && bruto <= cfg.DTP_BATAS_BRUTO;
  const pphRaw = Math.floor(bruto * rate / 100);
  const pph = dtp ? 0 : pphRaw;
  const thp = pay - bpjs - pph;
  let thrMonth = null;
  if (thr > 0) {
    const b = bruto + thr;
    const r = terRate(ter[kat], b);
    const p = dtp ? 0 : Math.floor(b * r / 100);
    thrMonth = { bruto: b, rate: r, pph: p, thp: pay + thr - bpjs - p };
  }
  const brutoY = bruto * 12 + thr;
  const biayaJabatan = Math.min(brutoY * P('BIAYA_JABATAN'), cfg.BIAYA_JABATAN_MAKS);
  const iuranPensiun = (ee.jht + ee.jp) * 12;
  const neto = brutoY - biayaJabatan - iuranPensiun;
  const deps = Math.min(3, Number(String(inp.ptkp).split('/')[1]) || 0);
  const ptkp = cfg.PTKP_DASAR + (String(inp.ptkp).charAt(0) === 'K' ? cfg.PTKP_KAWIN : 0) + deps * cfg.PTKP_TANGGUNGAN;
  const pkp = Math.max(0, Math.floor((neto - ptkp) / 1000) * 1000);
  const pphYear = dtp ? 0 : progressiveTax(pkp, brackets);
  const paidJanNov = thrMonth ? pph * 10 + thrMonth.pph : pph * 11;
  const pphDec = dtp ? 0 : pphYear - paidJanNov;
  const thpDec = pay - bpjs - pphDec;
  const thpYear = thp * (thrMonth ? 10 : 11) + (thrMonth ? thrMonth.thp : 0) + thpDec;
  const empTotal = emp.kes + emp.jht + emp.jp + emp.jkk + emp.jkm;
  return {
    upah, pay, thr, premi, bruto, kat, rate, dtp, pphRaw, pph, ee, emp, bpjs, thp, thrMonth,
    year: { bruto: brutoY, biayaJabatan, iuranPensiun, neto, ptkp, pkp, pph: pphYear, paidJanNov, pphDec },
    thpDec, thpYear, avgNet: thpYear / 12, empTotal, companyCost: pay + empTotal
  };
}
/** Nilai waktu dari gaji bersih rata-rata per bulan. */
function calcTime(avgNet, jam, hari) {
  const hoursMonth = jam * hari * 52 / 12;
  const perHour = hoursMonth > 0 ? avgNet / hoursMonth : 0;
  return { hoursMonth, perHour, perMin: perHour / 60, perDay: perHour * jam };
}
/** Indeks upah minimum. Kunci 'Provinsi|Kab/Kota'; 'Provinsi|' = UMP provinsi. */
function wageIndex(data) {
  const byKey = {};
  const regions = [];
  const provinces = (data && data.provinces) || [];
  provinces.forEach((p) => {
    byKey[p.name + '|'] = { prov: p.name, region: '', value: p.ump, kind: 'UMP' };
    p.regions.forEach((r) => {
      const e = { prov: p.name, region: r[0], value: r[1], kind: r[2] ? 'UMK' : 'UMP' };
      byKey[p.name + '|' + r[0]] = e;
      regions.push(e);
    });
  });
  return { year: (data && data.year) || 0, provinces, byKey, regions };
}
/** Upah dibanding upah minimum: kelipatan, selisih, status (below < 1× · at 1–1,05× · above). */
function wageCompare(upah, minWage) {
  if (!(minWage > 0)) return null;
  const ratio = upah / minWage;
  return { ratio, diff: upah - minWage, status: ratio < 1 ? 'below' : ratio < 1.05 ? 'at' : 'above' };
}
/** Jumlah kab/kota yang upah minimumnya tidak lebih dari upah ini. */
function wageRank(upah, regions) {
  const total = regions.length;
  const met = regions.filter((r) => r.value <= upah).length;
  return { met, total, pct: total ? met / total * 100 : 0 };
}
/** Perkiraan daya beli: nilai di kota asal dipindah ke kota tujuan memakai rasio upah minimum. */
function wageEquivalent(amount, fromWage, toWage) {
  return fromWage > 0 ? amount * toWage / fromWage : 0;
}
/** Dua tawaran kerja: gaji bersih (mesin PPh 21 & BPJS yang sama) + posisi terhadap upah minimum kotanya. */
function compareOffers(offers, base, cfg, ter, brackets, idx) {
  return offers.map((o) => {
    const r = calcSalary(Object.assign({}, base, { gaji: o.gaji, tunjangan: o.tunjangan, tidakTetap: 0, thr: 0 }), cfg, ter, brackets);
    const w = idx && idx.byKey[o.lokasi] ? idx.byKey[o.lokasi] : null;
    return { r, wage: w, cmp: w ? wageCompare(r.upah, w.value) : null };
  });
}
/** Biaya kebiasaan kecil: pengeluaran harian → per bulan/tahun, jam kerja, dan nilai bila diinvestasikan. */
function calcHabitCost(perDay, daysWeek, perHour, years, ret) {
  const perYear = perDay * daysWeek * 52;
  const perMonth = perYear / 12;
  const mr = Math.pow(1 + ret / 100, 1 / 12) - 1;
  const n = Math.max(0, Math.round(years * 12));
  const invested = mr > 0 ? perMonth * (Math.pow(1 + mr, n) - 1) / mr : perMonth * n;
  return { perMonth, perYear, hoursYear: perHour > 0 ? perYear / perHour : 0, invested, paid: perMonth * n };
}
if (typeof module === 'object' && module.exports) {
  module.exports = { PTKP_CAT, terRate, progressiveTax, calcSalary, calcTime, wageIndex, wageCompare, wageRank, wageEquivalent, compareOffers, calcHabitCost };
}
