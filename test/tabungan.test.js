'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const S = require('../js/engine/tabungan.js');

const near = (a, b, tol) => assert.ok(Math.abs(a - b) <= (tol === undefined ? 1e-6 : tol), a + ' ≉ ' + b);
// return tahunan yang membuat bunga bulanan tepat 1%: (1,01^12 − 1) × 100 = 12,6825030…%
const R1 = (Math.pow(1.01, 12) - 1) * 100;

test('bunga bulanan konsisten dengan FIRE: (1+r)^(1/12) − 1', () => {
  near(S.savMonthlyRate(R1), 0.01, 1e-12);
  near(S.savMonthlyRate(12), Math.pow(1.12, 1 / 12) - 1, 1e-15);
  assert.equal(S.savMonthlyRate(0), 0);
});

test('FV anuitas tepat (setoran akhir bulan)', () => {
  // Rp1.000.000 × 12 bulan, i = 1%: 1.000.000 × (1,01^12 − 1) / 0,01 = 12.682.503,01
  near(S.savFutureValue({ initial: 0, monthly: 1e6, months: 12, ret: R1, stepUp: 0 }), 12682503.0133, 1e-3);
  // saldo awal Rp10 jt ikut tumbuh: 10.000.000 × 1,01^12 = 11.268.250,30
  near(S.savFutureValue({ initial: 1e7, monthly: 0, months: 12, ret: R1 }), 11268250.3013, 1e-3);
});

test('return 0: nilai akhir = jumlah setoran', () => {
  assert.equal(S.savFutureValue({ initial: 5e6, monthly: 1e6, months: 24, ret: 0 }), 29e6);
  // butuh Rp24 jt dalam 24 bulan tanpa return → Rp1 jt/bln
  near(S.savRequiredMonthly({ target: 24e6, initial: 0, months: 24, ret: 0 }), 1e6);
});

test('step-up: setoran naik tiap 12 bulan', () => {
  // 100 × 12 + 110 × 12 = 2.520 (return 0, naik 10%/thn)
  near(S.savFutureValue({ initial: 0, monthly: 100, months: 24, ret: 0, stepUp: 10 }), 2520);
  assert.equal(S.savPmtAt(100, 10, 12), 100);
  near(S.savPmtAt(100, 10, 13), 110);
  near(S.savPmtAt(100, 10, 25), 121);
  // kebalikannya: target 2.520 → setoran awal 100
  near(S.savRequiredMonthly({ target: 2520, initial: 0, months: 24, ret: 0, stepUp: 10 }), 100);
});

test('required monthly = kebalikan FV (round-trip)', () => {
  const cases = [
    { target: 150e6, initial: 10e6, months: 60, ret: 6.5, stepUp: 0 },
    { target: 500e6, initial: 0, months: 180, ret: 10, stepUp: 5 },
    { target: 35e6, initial: 2e6, months: 7, ret: 4.5, stepUp: 3 }
  ];
  cases.forEach((c) => {
    const pmt = S.savRequiredMonthly(c);
    near(S.savFutureValue(Object.assign({}, c, { monthly: pmt })), c.target, 1e-4);
  });
  // rumus tertutup tanpa saldo awal: 12.682.503,01 / 12 bln @1% → Rp1.000.000
  near(S.savRequiredMonthly({ target: 12682503.0133, initial: 0, months: 12, ret: R1 }), 1e6, 1e-3);
});

test('target sudah tercapai oleh tabungan awal → 0', () => {
  assert.equal(S.savRequiredMonthly({ target: 10e6, initial: 10e6, months: 12, ret: 0 }), 0);
  assert.equal(S.savRequiredMonthly({ target: 10e6, initial: 9.5e6, months: 12, ret: 6 }), 0); // 9,5 jt × 1,06 = 10,07 jt
  assert.equal(S.savLumpSum({ target: 10e6, initial: 12e6, months: 12, ret: 5 }), 0);
  const P = S.savPlan({ mode: 'target', target: 10e6, inflasi: false, inflRate: 4, years: 1, months: 0, initial: 12e6, ret: 5, stepUp: 0, monthly: 0 });
  assert.equal(P.required, 0);
  assert.ok(P.already && P.reached);
  assert.equal(P.series.hitMonth, 0);
});

test('lump sum = nilai kini target − saldo awal', () => {
  // 11.268.250,30 / 1,01^12 = 10.000.000; dikurangi saldo awal 4 jt → 6 jt
  near(S.savLumpSum({ target: 11268250.3013, initial: 4e6, months: 12, ret: R1 }), 6e6, 1e-3);
  near(S.savLumpSum({ target: 5e6, initial: 0, months: 36, ret: 0 }), 5e6);
});

test('target ikut inflasi', () => {
  // Rp100 jt, inflasi 4%, 3 tahun → 100 × 1,04^3 = 112,4864 jt
  near(S.savTargetFuture(100e6, 4, 36), 112486400, 1e-3);
  near(S.savTargetFuture(100e6, 4, 18), 100e6 * Math.pow(1.04, 1.5), 1e-3);
  assert.equal(S.savTargetFuture(100e6, 0, 120), 100e6);
});

test('savSeries & savPlan: ringkasan per tahun dan mode simulasi', () => {
  const ser = S.savSeries({ initial: 1e6, monthly: 1e6, months: 30, ret: 0, stepUp: 0, target: 20e6, infl: 0 });
  assert.equal(ser.points.length, 31);
  assert.deepEqual(ser.years.map((y) => y.m), [12, 24, 30]);
  assert.equal(ser.final, 31e6);
  assert.equal(ser.deposits, 30e6);
  assert.equal(ser.gain, 0);
  assert.equal(ser.hitMonth, 19); // 1 jt + 19 × 1 jt = 20 jt
  const sim = S.savPlan({ mode: 'sim', target: 50e6, inflasi: false, inflRate: 4, years: 2, months: 6, initial: 1e6, ret: 0, stepUp: 0, monthly: 1e6 });
  assert.equal(sim.n, 30);
  assert.equal(sim.final, 31e6);
  assert.ok(!sim.reached);
  assert.equal(sim.shortfall, 19e6);
  near(sim.required, 49e6 / 30);
  // mode target: hasil akhir = target (sudah termasuk inflasi)
  const tg = S.savPlan({ mode: 'target', target: 100e6, inflasi: true, inflRate: 4, years: 5, months: 0, initial: 5e6, ret: 8, stepUp: 5, monthly: 0 });
  near(tg.final, tg.targetFut, 1e-3);
  near(tg.targetFut, 100e6 * Math.pow(1.04, 5), 1e-3);
  assert.ok(tg.reached);
  assert.ok(tg.requiredNoReturn > tg.required);
});
