'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { loanPmt, loanSchedule, loanMaxPrincipal, loanExtraEffect, loanFlatToEffective, loanRatio } = require('../js/engine/cicilan.js');

const near = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= (tol === undefined ? 1 : tol), (msg || '') + ' ' + a + ' ≠ ' + b);

test('PMT anuitas: 500 jt, 20 thn, 10%/thn', () => {
  // r = 10%/12 = 0,0083333…; n = 240; (1+r)^240 = 7,328074…
  // PMT = 500.000.000 × r × 7,328074 / 6,328074 = 4.825.108,23
  near(loanPmt(500e6, 0.1 / 12, 240), 4825108.23, 0.01);
  const s = loanSchedule({ principal: 500e6, years: 20, method: 'anuitas', fixedRate: 10, fixedYears: 0, floatRate: 10 });
  near(s.pay1, 4825108.23, 0.01);
  assert.equal(s.pay2, null);
  assert.equal(s.monthsToPayoff, 240);
  assert.equal(s.months[239].balance, 0);
  // total bayar = 240 × PMT; total bunga = total bayar − pokok
  near(s.totalPaid, 240 * 4825108.225370044, 1);
  near(s.totalInterest, 240 * 4825108.225370044 - 500e6, 1);
  assert.equal(s.years.length, 20);
  near(s.years[19].cumInterest, s.totalInterest, 0.01);
});

test('PMT bunga 0% = pokok ÷ n', () => {
  assert.equal(loanPmt(120e6, 0, 12), 10e6);
  const s = loanSchedule({ principal: 120e6, years: 1, method: 'anuitas', fixedRate: 0, fixedYears: 1, floatRate: 0 });
  assert.equal(s.pay1, 10e6);
  assert.equal(s.totalInterest, 0);
  assert.equal(s.totalPaid, 120e6);
});

test('Anuitas: cicilan dihitung ulang setelah masa fix (sisa pokok & sisa tenor)', () => {
  const o = { principal: 600e6, years: 20, method: 'anuitas', fixedRate: 5, fixedYears: 3, floatRate: 11 };
  const s = loanSchedule(o);
  near(s.pay1, loanPmt(600e6, 0.05 / 12, 240), 1e-6);
  // sisa pokok setelah 36 bulan = nilai kini 204 cicilan pay1 pada 5%
  const r = 0.05 / 12;
  const bal36 = s.pay1 * (1 - Math.pow(1 + r, -204)) / r;
  near(s.months[35].balance, bal36, 0.01);
  near(s.pay2, loanPmt(bal36, 0.11 / 12, 204), 0.01);
  assert.ok(s.pay2 > s.pay1);
  assert.equal(s.months[36].rate, 11);
  assert.equal(s.monthsToPayoff, 240);
  assert.equal(s.months[239].balance, 0);
});

test('Flat: bunga = pokok × tarif × tahun, cicilan = (pokok + bunga) ÷ n', () => {
  // 225 jt, 5%/thn, 5 thn: bunga = 225 jt × 5% × 5 = 56,25 jt; cicilan = 281,25 jt ÷ 60 = 4.687.500
  const s = loanSchedule({ principal: 225e6, years: 5, method: 'flat', fixedRate: 5, fixedYears: 0, floatRate: 11 });
  near(s.pay1, 4687500, 1e-6);
  near(s.totalInterest, 56.25e6, 1e-3);
  near(s.totalPaid, 281.25e6, 1e-3);
  assert.equal(s.monthsToPayoff, 60);
  assert.equal(s.pay2, null); // flat: satu tarif, floating diabaikan
});

test('Efektif (pokok tetap): cicilan menurun', () => {
  // 120 jt, 12%/thn (1%/bln), 12 bln: pokok 10 jt/bln
  // bulan 1 = 10 jt + 1,2 jt = 11,2 jt; bulan 12 = 10 jt + 0,1 jt = 10,1 jt
  // total bunga = 1% × (120 + 110 + … + 10) jt = 1% × 780 jt = 7,8 jt
  const s = loanSchedule({ principal: 120e6, years: 1, method: 'efektif', fixedRate: 12, fixedYears: 1, floatRate: 12 });
  near(s.payFirst, 11.2e6, 1e-6);
  near(s.payLast, 10.1e6, 1e-6);
  near(s.totalInterest, 7.8e6, 1e-3);
  assert.equal(s.payMax, s.payFirst);
});

test('Efektif: tarif floating berlaku setelah masa fix', () => {
  // 120 jt, 2 thn: fix 6% 1 thn lalu 12%. Bulan 13: sisa 60 jt → 5 jt + 60 jt × 1% = 5,6 jt
  const s = loanSchedule({ principal: 120e6, years: 2, method: 'efektif', fixedRate: 6, fixedYears: 1, floatRate: 12 });
  near(s.months[12].pay, 5.6e6, 1e-6);
  near(s.pay2, 5.6e6, 1e-6);
});

test('Bayar ekstra memendekkan tenor & mengurangi total bunga', () => {
  const o = { principal: 600e6, years: 20, method: 'anuitas', fixedRate: 5, fixedYears: 3, floatRate: 11, extra: 1e6 };
  const e = loanExtraEffect(o);
  assert.ok(e.fast.monthsToPayoff < e.base.monthsToPayoff);
  assert.ok(e.monthsSaved > 0);
  assert.ok(e.interestSaved > 0);
  near(e.fast.totalInterest, e.base.totalInterest - e.interestSaved, 1e-3);
  // cicilan terjadwal tetap sama (yang berubah tenornya)
  near(e.fast.pay1, e.base.pay1, 1e-9);
  near(e.fast.pay2, e.base.pay2, 1e-9);
  // semua pokok terbayar
  near(e.fast.totalPaid - e.fast.totalInterest, 600e6, 0.01);
  // flat & efektif juga lebih cepat lunas
  ['flat', 'efektif'].forEach((m) => {
    const x = loanExtraEffect(Object.assign({}, o, { method: m }));
    assert.ok(x.monthsSaved > 0 && x.interestSaved > 0, m);
  });
});

test('Plafon maksimal = kebalikan PMT', () => {
  const pay = loanPmt(500e6, 0.1 / 12, 240);
  near(loanMaxPrincipal(pay, 10, 20), 500e6, 0.01);
  assert.equal(loanMaxPrincipal(1e6, 0, 10), 120e6); // bunga 0%: cicilan × n
  // flat: 4.687.500 / (1/60 + 5%/12) = 225 jt
  near(loanMaxPrincipal(4687500, 5, 5, 'flat'), 225e6, 0.01);
  assert.equal(loanMaxPrincipal(0, 10, 20), 0);
});

test('Kasus tepi: pokok 0 dan tenor 0', () => {
  const s = loanSchedule({ principal: 0, years: 20, method: 'anuitas', fixedRate: 5, fixedYears: 3, floatRate: 11 });
  assert.equal(s.pay1, 0);
  assert.equal(s.monthsToPayoff, 0);
  assert.equal(s.totalInterest, 0);
  assert.deepEqual(s.years, []);
  const z = loanSchedule({ principal: 100e6, years: 0, method: 'anuitas', fixedRate: 5 });
  assert.equal(z.monthsToPayoff, 0);
  assert.equal(loanPmt(0, 0.01, 12), 0);
  // lama fix melebihi tenor dibatasi tenor
  const f = loanSchedule({ principal: 100e6, years: 2, method: 'anuitas', fixedRate: 5, fixedYears: 10, floatRate: 11 });
  assert.equal(f.fixedMonths, 24);
  assert.equal(f.pay2, null);
});

test('Bunga flat → efektif setara', () => {
  // flat 5%, 5 thn → cicilan per Rp1 = (1 + 0,25)/60; tarif anuitas yang menghasilkan cicilan sama ±9,15%
  const e = loanFlatToEffective(5, 5);
  near(loanPmt(1, e / 1200, 60), 1.25 / 60, 1e-9);
  assert.ok(e > 8.9 && e < 9.2, String(e));
  assert.equal(loanFlatToEffective(0, 5), 0);
});

test('Rasio cicilan vs penghasilan', () => {
  assert.equal(loanRatio(3e6, 10e6).status, 'safe');   // 30% → aman
  assert.equal(loanRatio(3.5e6, 10e6).status, 'watch'); // 35% → waspada
  assert.equal(loanRatio(4.1e6, 10e6).status, 'heavy'); // 41% → berat
  near(loanRatio(2.5e6, 10e6).pct, 25, 1e-9);
  assert.equal(loanRatio(1e6, 0).status, 'none');
});
