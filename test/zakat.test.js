'use strict';
/** Zakat — nisab, zakat penghasilan, zakat maal, zakat fitrah (angka dihitung manual di komentar). */
const test = require('node:test');
const assert = require('node:assert/strict');
const Z = require('../js/engine/zakat.js');

test('nisab = 85 gram × harga emas', () => {
  // 85 × 2.581.000 = 219.385.000
  assert.equal(Z.zakatNisab(2581000), 219385000);
  // 85 × 1.000.000 = 85.000.000
  assert.equal(Z.zakatNisab(1000000), 85000000);
  assert.equal(Z.zakatNisab(0), 0);
  assert.equal(Z.zakatNisab(-5), 0);
  assert.equal(Z.zakatNisab(NaN), 0);
});

test('SK BAZNAS 15/2026: nisab bulanan × 12 = nisab tahunan', () => {
  // 7.640.144 × 12 = 91.681.728
  assert.equal(Z.ZAKAT_REF.nisabBulanBaznas * 12, Z.ZAKAT_REF.nisabTahunBaznas);
  // 50.000 = 2,5 kg × 20.000
  assert.equal(Z.ZAKAT_REF.fitrahKg * Z.ZAKAT_REF.hargaBeras, Z.ZAKAT_REF.fitrahBaznas);
});

test('zakat penghasilan bruto: 2,5% dan ambang tepat di nisab', () => {
  // gaji 10.000.000 + lain 2.000.000 = 12.000.000/bln ≥ 7.640.144 → zakat 300.000/bln
  let r = Z.zakatIncome({ metode: 'bruto', gaji: 10000000, lain: 2000000, bonus: 0, nisabBulan: 7640144 });
  assert.equal(r.wajib, true);
  assert.equal(r.perMonth, 300000);
  assert.equal(r.perYear, 3600000);
  // tepat di nisab → wajib: 7.640.144 × 2,5% = 191.003,6
  r = Z.zakatIncome({ metode: 'bruto', gaji: 7640144, nisabBulan: 7640144 });
  assert.equal(r.wajib, true);
  assert.ok(Math.abs(r.perMonth - 191003.6) < 1e-6);
  // 1 rupiah di bawah nisab → belum wajib, zakat 0
  r = Z.zakatIncome({ metode: 'bruto', gaji: 7640143, nisabBulan: 7640144 });
  assert.equal(r.wajib, false);
  assert.equal(r.perMonth, 0);
  assert.equal(r.perYear, 0);
  assert.equal(r.gap, 1);
});

test('zakat penghasilan: bonus/THR ikut dihitung setahun', () => {
  // 7.000.000 × 12 + 12.000.000 = 96.000.000 → rata-rata 8.000.000 ≥ 7.640.144 → wajib
  // zakat bulanan 175.000, zakat bonus 300.000, setahun 175.000 × 12 + 300.000 = 2.400.000 (= 2,5% × 96 jt)
  const r = Z.zakatIncome({ metode: 'bruto', gaji: 7000000, bonus: 12000000, nisabBulan: 7640144 });
  assert.equal(r.wajib, true);
  assert.equal(r.avg, 8000000);
  assert.equal(r.perMonth, 175000);
  assert.equal(r.onBonus, 300000);
  assert.equal(r.perYear, 2400000);
});

test('zakat penghasilan neto: dikurangi kebutuhan pokok & cicilan', () => {
  // 15.000.000 − 5.000.000 − 2.000.000 = 8.000.000 ≥ nisab → 200.000/bln
  let r = Z.zakatIncome({ metode: 'neto', gaji: 15000000, kebutuhan: 5000000, cicilan: 2000000, nisabBulan: 7640144 });
  assert.equal(r.monthly, 8000000);
  assert.equal(r.perMonth, 200000);
  // kebutuhan & cicilan diabaikan pada metode bruto
  r = Z.zakatIncome({ metode: 'bruto', gaji: 15000000, kebutuhan: 5000000, cicilan: 2000000, nisabBulan: 7640144 });
  assert.equal(r.monthly, 15000000);
  // neto tidak pernah negatif
  r = Z.zakatIncome({ metode: 'neto', gaji: 3000000, kebutuhan: 5000000, nisabBulan: 7640144 });
  assert.equal(r.monthly, 0);
  assert.equal(r.wajib, false);
});

test('zakat penghasilan: nilai 0 & nisab 0 tidak wajib', () => {
  let r = Z.zakatIncome({ metode: 'bruto', gaji: 0, nisabBulan: 7640144 });
  assert.equal(r.wajib, false);
  assert.equal(r.perYear, 0);
  r = Z.zakatIncome({ metode: 'bruto', gaji: 0, nisabBulan: 0 });
  assert.equal(r.wajib, false);
  r = Z.zakatIncome({});
  assert.equal(r.perYear, 0);
});

test('zakat maal: 2,5% harta bersih bila ≥ nisab & sudah haul', () => {
  // harga emas 1.000.000 → nisab 85.000.000
  // kas 50 jt + emas 20 g × 1 jt = 20 jt + perak 100 g × 15.000 = 1,5 jt + investasi 30 jt + piutang 5 jt + usaha 3,5 jt = 110 jt
  // utang jatuh tempo 10 jt → bersih 100 jt ≥ 85 jt → zakat 2.500.000
  const base = { kas: 50000000, emasGram: 20, hargaEmas: 1000000, perakGram: 100, hargaPerak: 15000, investasi: 30000000, piutang: 5000000, usaha: 3500000, utang: 10000000, haul: true };
  let r = Z.zakatMaal(base);
  assert.equal(r.total, 110000000);
  assert.equal(r.bersih, 100000000);
  assert.equal(r.nisab, 85000000);
  assert.equal(r.wajib, true);
  assert.equal(r.zakat, 2500000);
  // utang mengurangi harta: utang 20 jt → bersih 90 jt → zakat 2.250.000
  r = Z.zakatMaal(Object.assign({}, base, { utang: 20000000 }));
  assert.equal(r.bersih, 90000000);
  assert.equal(r.zakat, 2250000);
  // utang 26 jt → bersih 84 jt < nisab 85 jt → tidak wajib
  r = Z.zakatMaal(Object.assign({}, base, { utang: 26000000 }));
  assert.equal(r.capai, false);
  assert.equal(r.zakat, 0);
  assert.equal(r.gap, 1000000);
  // tepat di nisab (utang 25 jt → bersih 85 jt) → wajib 2.125.000
  r = Z.zakatMaal(Object.assign({}, base, { utang: 25000000 }));
  assert.equal(r.wajib, true);
  assert.equal(r.zakat, 2125000);
});

test('zakat maal: belum haul = 0, utang > harta = 0, semua 0', () => {
  const base = { kas: 200000000, hargaEmas: 1000000, haul: false };
  let r = Z.zakatMaal(base);
  assert.equal(r.capai, true);
  assert.equal(r.wajib, false);
  assert.equal(r.zakat, 0);
  r = Z.zakatMaal({ kas: 10000000, utang: 50000000, hargaEmas: 1000000, haul: true });
  assert.equal(r.bersih, 0);
  assert.equal(r.zakat, 0);
  r = Z.zakatMaal({ haul: true, hargaEmas: 0 });
  assert.equal(r.wajib, false);
  assert.equal(r.zakat, 0);
  // harga emas 0 → nisab tak bisa dihitung → tidak dinyatakan wajib
  r = Z.zakatMaal({ kas: 100000000, haul: true, hargaEmas: 0 });
  assert.equal(r.wajib, false);
});

test('zakat fitrah: jiwa × nominal, atau 2,5 kg × harga beras', () => {
  // 4 jiwa × 50.000 = 200.000; beras 4 × 2,5 = 10 kg
  let r = Z.zakatFitrah(4, 'uang', 50000, 20000);
  assert.equal(r.total, 200000);
  assert.equal(r.berasKg, 10);
  // mode beras: 2,5 × 18.000 = 45.000 per jiwa; 3 jiwa = 135.000
  r = Z.zakatFitrah(3, 'beras', 50000, 18000);
  assert.equal(r.perJiwa, 45000);
  assert.equal(r.total, 135000);
  r = Z.zakatFitrah(0, 'uang', 50000, 20000);
  assert.equal(r.total, 0);
});
