'use strict';
/** Dana Darurat — rekomendasi bulan, target, waktu tercapai, setoran, tangga likuiditas. */
const test = require('node:test');
const assert = require('node:assert/strict');
const E = require('../js/engine/darurat.js');

const near = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= (tol || 1e-6), (msg || '') + ' ' + a + ' ≈ ' + b);

test('tabel rekomendasi bulan (batas atas rentang)', () => {
  // [status, tanggungan, anak] → [min, max]
  const cases = [
    [['tetap', 'lajang', 0], [3, 6]],
    [['tetap', 'menikah', 0], [6, 9]],
    [['tetap', 'anak', 1], [9, 12]],
    [['tetap', 'anak', 2], [9, 12]],
    [['kontrak', 'lajang', 0], [3, 9]],      // +0–3
    [['freelance', 'lajang', 0], [6, 12]],   // +3–6
    [['freelance', 'menikah', 0], [9, 15]],
    [['freelance', 'anak', 2], [12, 18]],
    [['tetap', 'anak', 3], [10, 13]],        // anak ke-3: +1
    [['tetap', 'anak', 9], [12, 15]],        // anak di atas 2 maks. +3
    [['freelance', 'anak', 9], [15, 21]],
    [['tetap', 'lajang', 4], [3, 6]]         // jumlah anak diabaikan bila bukan 'anak'
  ];
  cases.forEach(([args, mm]) => {
    const r = E.emergRecommend(...args);
    assert.deepEqual([r.min, r.max], mm, args.join('/'));
    assert.equal(r.months, mm[1], args.join('/') + ' target = batas atas');
  });
  // nilai tidak dikenal → lajang / tetap
  assert.deepEqual([E.emergRecommend('x', 'y', 0).min, E.emergRecommend('x', 'y', 0).max], [3, 6]);
});

test('target = bulan × pengeluaran; jumlah rincian; progres', () => {
  assert.equal(E.emergTarget(6, 5000000), 30000000);
  assert.equal(E.emergTarget(0, 5000000), 0);
  assert.equal(E.emergTarget(6, -1), 0);
  assert.equal(E.emergSum([4000000, 0, 300000, 600000, 500000]), 5400000);
  assert.equal(E.emergSum([1000, -50, 'x', null]), 1000);
  assert.equal(E.emergProgress(15000000, 30000000), 50);
  assert.equal(E.emergProgress(45000000, 30000000), 100);
  assert.equal(E.emergProgress(0, 0), 0);
});

test('waktu tercapai: sudah tercapai → 0, setoran 0 → null, return 0', () => {
  assert.equal(E.emergMonthsToGoal(30000000, 0, 30000000, 4.5), 0);
  assert.equal(E.emergMonthsToGoal(40000000, 1000000, 30000000, 0), 0);
  assert.equal(E.emergMonthsToGoal(5000000, 0, 30000000, 4.5), null);
  assert.equal(E.emergMonthsToGoal(5000000, 0, 30000000, 0), null);
  // return 0: (30 jt − 6 jt) / 2 jt = 12 bulan tepat
  assert.equal(E.emergMonthsToGoal(6000000, 2000000, 30000000, 0), 12);
  // (30 jt − 5 jt) / 2 jt = 12,5 → 13 bulan
  assert.equal(E.emergMonthsToGoal(5000000, 2000000, 30000000, 0), 13);
  // terlalu lama (> 600 bulan) → null
  assert.equal(E.emergMonthsToGoal(0, 1000, 1e9, 0), null);
});

test('waktu tercapai dengan return majemuk', () => {
  // r = 1,06^(1/12) − 1 ≈ 0,486755%/bln. Saldo setelah n bulan = 0 + 1 jt × ((1+r)^n − 1)/r.
  // n = 12 → (1,06 − 1)/0,00486755 ≈ 12,3265 jt  → target 12,3 jt tercapai di bulan ke-12, 12,4 jt di bulan ke-13
  const r = E.emergMonthlyRate(6);
  near(r, Math.pow(1.06, 1 / 12) - 1);
  near(1000000 * (0.06 / r), 12326528, 2);
  assert.equal(E.emergMonthsToGoal(0, 1000000, 12300000, 6), 12);
  assert.equal(E.emergMonthsToGoal(0, 1000000, 12400000, 6), 13);
  // dengan return, waktunya tidak lebih lama daripada tanpa return
  assert.ok(E.emergMonthsToGoal(5000000, 2000000, 30000000, 5) <= 13);
});

test('setoran agar tercapai dalam N bulan', () => {
  // return 0: (30 jt − 6 jt) / 12 = 2 jt
  assert.equal(E.emergDepositFor(6000000, 30000000, 12, 0), 2000000);
  // sudah tercapai → 0
  assert.equal(E.emergDepositFor(30000000, 30000000, 12, 5), 0);
  // return 6%: 12,3265 jt dalam 12 bulan dari 0 → 1 jt/bln (kebalikan contoh di atas)
  near(E.emergDepositFor(0, 12326528, 12, 6), 1000000, 1);
  // saldo awal ikut tumbuh: 10 jt × 1,06 = 10,6 jt; sisa 1,7265 jt / (0,06/r) → ±140.064
  const r = E.emergMonthlyRate(6);
  near(E.emergDepositFor(10000000, 12326528, 12, 6), (12326528 - 10600000) * r / 0.06, 1);
  // setoran hasil hitungan memang mencapai target tepat di bulan ke-N
  const dep = E.emergDepositFor(5000000, 30000000, 12, 4.5);
  assert.equal(E.emergMonthsToGoal(5000000, dep + 0.01, 30000000, 4.5), 12);
});

test('jadwal saldo', () => {
  const s = E.emergSchedule(1000000, 500000, 0, 3);
  assert.deepEqual(s.map((x) => x.v), [1000000, 1500000, 2000000, 2500000]);
});

test('tangga likuiditas: 1× pengeluaran tunai, sisanya separuh RDPU separuh deposito/emas', () => {
  // target 6 × 5 jt = 30 jt → tunai 5 jt, RDPU 12,5 jt, deposito 12,5 jt
  assert.deepEqual(E.emergLadder(30000000, 5000000), { cash: 5000000, mmf: 12500000, term: 12500000 });
  // target 3 × 5 jt → 5 / 5 / 5 (RDPU = sepertiga)
  assert.deepEqual(E.emergLadder(15000000, 5000000), { cash: 5000000, mmf: 5000000, term: 5000000 });
  // target lebih kecil dari pengeluaran sebulan → semua tunai
  assert.deepEqual(E.emergLadder(3000000, 5000000), { cash: 3000000, mmf: 0, term: 0 });
  const l = E.emergLadder(60000000, 5000000);
  assert.equal(l.cash + l.mmf + l.term, 60000000);
  assert.ok(l.mmf / 60000000 >= 1 / 3 && l.mmf / 60000000 <= 0.5);
});
