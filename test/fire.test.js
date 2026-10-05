'use strict';
/** FIRE — angka acuan sama dengan Habit Tracker (identik dengan runFireSimulation proyek Financial tracker). */
const test = require('node:test');
const assert = require('node:assert/strict');
const ctx = require('../js/engine/fire.js');

const FIRE_BASE = { needsPct: 50, entPct: 15, invPct: 25, goldPct: 10, expectedReturn: 10, inflationRate: 4, retirementReturn: 6, incomeGrowthRate: 5, swr: 4 };
function fire(inp, extra) { return ctx.calcFire(Object.assign({}, FIRE_BASE, inp), extra || 0); }

test('M5.12 FIRE identik dengan runFireSimulation proyek Financial tracker (3 kasus acuan)', () => {
  // Angka acuan dihasilkan dari runFireSimulation (appscript/WebApp.html proyek Financial tracker)
  const cases = [
    [{ currentAge: 30, targetAge: 45, monthlyIncome: 20000000, currentSavings: 100000000 },
      { fb: 3049130683, ft: 7023679671, fe: 23412266, ok: false, recInv: 12552140, recAge: 55, recExp: 5643580, runOut: [73, 58, 53], acc5: 580191396, wdw10: 1097370924 }],
    [{ currentAge: 30, targetAge: 45, monthlyIncome: 8921374, currentSavings: 100000000 },
      { fb: 1591512611, ft: 3133043660, fe: 10443479, ok: false, recInv: 5159445, recAge: 54, recExp: 2945702, runOut: [84, 61, 54], acc5: 348016411, wdw10: 903888594 }],
    [{ currentAge: 25, targetAge: 55, monthlyIncome: 15000000, needsPct: 40, entPct: 10, invPct: 40, currentSavings: 50000000 },
      { fb: 20627517084, ft: 7297644398, fe: 24325481, ok: true, recInv: 0, recAge: 55, recExp: 0, runOut: [null, null, 88], acc5: 583493975, wdw10: 32407394962 }]
  ];
  cases.forEach(([inp, e], i) => {
    const R = fire(inp);
    const msg = 'kasus ' + (i + 1);
    assert.equal(Math.round(R.base.finalBalance), e.fb, msg);
    assert.equal(Math.round(R.base.finalTarget), e.ft, msg);
    assert.equal(Math.round(R.base.finalExpense), e.fe, msg);
    assert.equal(R.done, e.ok, msg);
    assert.equal(Math.round(R.rec.investment), e.recInv, msg);
    assert.equal(R.rec.age, e.recAge, msg);
    assert.equal(Math.round(R.rec.expense), e.recExp, msg);
    assert.deepEqual([R.optimis.runOut, R.base.runOut, R.pesimis.runOut], e.runOut, msg);
    assert.equal(Math.round(R.base.acc[5].balance), e.acc5, msg);
    assert.equal(Math.round(R.base.wdw[10].balance), e.wdw10, msg);
  });
  assert.equal(Math.round(fire(cases[1][0]).readiness * 100) / 100, 50.8);
});

test('M5.13 FIRE: rekomendasi konsisten — setoran Opsi 1 cukup, usia Opsi 2 = usia FIRE', () => {
  const inp = { currentAge: 30, targetAge: 45, monthlyIncome: 8921374, currentSavings: 100000000 };
  const R = fire(inp);
  // Opsi 1: investasi rekomendasi (persen dari pemasukan) membuat target tercapai tepat di usia target
  const pct = R.rec.investment / inp.monthlyIncome * 100;
  assert.ok(fire(Object.assign({}, inp, { invPct: pct + 0.01 })).done);
  assert.ok(!fire(Object.assign({}, inp, { invPct: pct - 0.5 })).done);
  // Opsi 2 & usia FIRE: tahun pertama aset ≥ target
  assert.equal(R.fiAge, R.rec.age);
  assert.ok(fire(Object.assign({}, inp, { targetAge: R.fiAge })).done);
  assert.ok(!fire(Object.assign({}, inp, { targetAge: R.fiAge - 1 })).done);
  // Opsi 3: pengeluaran maksimal (nilai hari ini) × 12 ÷ 4% ≈ aset proyeksi bila disetarakan inflasi
  assert.ok(Math.abs(R.rec.expense * Math.pow(1.04, 15) * 12 * 25 - R.base.finalBalance) < 1);
});

test('M5.14 FIRE: SWR, Coast FIRE, dana darurat, percepatan habit hemat & kasus tepi', () => {
  const inp = { currentAge: 30, targetAge: 45, monthlyIncome: 10000000, currentSavings: 100000000 };
  const R4 = fire(inp);
  assert.equal(R4.fireNow, 6500000 * 12 * 25, 'angka FIRE hari ini = 25× pengeluaran setahun');
  const R3 = fire(Object.assign({}, inp, { swr: 3 }));
  assert.equal(Math.round(R3.mult * 1000) / 1000, 33.333);
  assert.ok(R3.base.finalTarget > R4.base.finalTarget && R3.readiness < R4.readiness, 'SWR lebih kecil → target lebih besar');
  assert.equal(Math.round(R4.coast), Math.round(R4.base.finalTarget / Math.pow(1.1, 15)), 'Coast = target ÷ (1+r)^tahun');
  assert.equal(fire(Object.assign({}, inp, { currentSavings: Math.ceil(R4.coast) })).coastOk, true);
  assert.equal(R4.emergency, 6500000 * 6);
  assert.equal(R4.emergencyMonths, 39, 'Rp39 jt ÷ Rp1 jt (10%) per bulan');
  // habit hemat Rp825rb/bln diinvestasikan → lebih cepat
  const RH = fire(inp, 825000);
  assert.ok(RH.fiAgeHabit < RH.fiAge);
  assert.equal(fire(inp, 0).fiAgeHabit, null);
  // kasus tepi
  const empty = fire(Object.assign({}, inp, { monthlyIncome: 0 }));
  assert.equal(empty.empty, true);
  assert.equal(empty.fiAge, null);
  const same = fire(Object.assign({}, inp, { targetAge: 30 }));
  assert.equal(same.years, 0);
  assert.equal(same.rec.investment, 0, 'tanpa sisa tahun, rekomendasi tidak dihitung');
  assert.equal(same.base.finalBalance, 100000000);
  const late = fire({ currentAge: 50, targetAge: 55, monthlyIncome: 10000000, currentSavings: 0, invPct: 5, needsPct: 70, entPct: 20, goldPct: 5 });
  assert.equal(late.rec.ageCapped, true, 'tidak tercapai sampai usia 80');
  assert.equal(late.fiAge, null);
});
