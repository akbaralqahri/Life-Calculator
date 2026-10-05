'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const E = require('../js/engine/pendidikan.js');

const near = (a, b, tol) => assert.ok(Math.abs(a - b) <= (tol === undefined ? 1e-6 : tol), a + ' ≉ ' + b);
const R1 = (Math.pow(1.01, 12) - 1) * 100; // return tahunan → bunga bulanan tepat 1%
const lv = (key, on, usia, pangkal, tahunan, lama) => ({ key, on, usia, pangkal, tahunan, lama });

test('biaya masa depan majemuk', () => {
  // Rp20 jt, inflasi 10%, 3 tahun → 20 × 1,1^3 = 26,62 jt
  near(E.eduFutureCost(20e6, 10, 3), 26.62e6, 1e-3);
  assert.equal(E.eduFutureCost(20e6, 10, 0), 20e6);
  assert.equal(E.eduFutureCost(20e6, 0, 12), 20e6);
});

test('setoran bulanan tepat (anuitas)', () => {
  // FV 12.682.503,01 dalam 12 bln @1%/bln → Rp1.000.000
  near(E.eduRequiredMonthly(12682503.0133, 12, R1), 1e6, 1e-3);
  // return 0 → dibagi rata: 12 jt / 24 bln = 500 rb
  near(E.eduRequiredMonthly(12e6, 24, 0), 5e5);
  assert.equal(E.eduRequiredMonthly(0, 24, 8), 0);
});

test('0 bulan tersisa → null (lump sum), tidak dibagi nol', () => {
  assert.equal(E.eduRequiredMonthly(10e6, 0, 8), null);
  assert.equal(E.eduRequiredMonthly(10e6, 0, 0), null);
});

test('dana saat masuk: pangkal + tahun pertama, atau seluruh jenjang', () => {
  const sd = lv('sd', true, 6, 20e6, 10e6, 3);
  // 2 tahun lagi, inflasi 10%: (20 + 10) × 1,21 = 36,3 jt
  near(E.eduNeedAtEntry(sd, 10, 2, false), 36.3e6, 1e-3);
  // seluruh jenjang: 20×1,21 + 10×(1,21 + 1,331 + 1,4641) = 24,2 + 40,051 = 64,251 jt
  near(E.eduNeedAtEntry(sd, 10, 2, true), 64.251e6, 1e-3);
});

test('rencana: setoran per jenjang & usia masuk = usia sekarang', () => {
  const P = E.eduPlan({
    usia: 6, inflasi: 0, ret: 0, dana: 0, full: false,
    jenjang: [lv('sd', true, 6, 20e6, 10e6, 6), lv('smp', true, 12, 12e6, 12e6, 3)]
  });
  const sd = P.levels[0], smp = P.levels[1];
  assert.equal(sd.status, 'now');
  assert.equal(sd.months, 0);
  assert.equal(sd.monthly, 0);
  assert.equal(sd.lump, 30e6); // harus siap sekaligus
  assert.equal(smp.status, 'future');
  assert.equal(smp.months, 72);
  near(smp.monthly, 24e6 / 72); // (12 + 12) jt / 72 bln
  near(P.monthly, 24e6 / 72);
  assert.equal(P.lumpNow, 30e6);
  assert.equal(P.nearest.key, 'sd');
  assert.ok(Number.isFinite(P.monthly));
});

test('jenjang lewat & tidak aktif diabaikan, sedang berjalan tidak ditabung', () => {
  const P = E.eduPlan({
    usia: 13, inflasi: 10, ret: 8, dana: 0, full: false,
    jenjang: [lv('tk', true, 4, 5e6, 5e6, 2), lv('sd', true, 6, 20e6, 10e6, 6), lv('smp', true, 12, 12e6, 12e6, 3),
      lv('sma', false, 15, 15e6, 15e6, 3), lv('s1', true, 18, 30e6, 25e6, 4)]
  });
  assert.deepEqual(P.levels.map((x) => x.status), ['past', 'past', 'ongoing', 'off', 'future']);
  assert.equal(P.active.length, 1);
  assert.equal(P.nearest.key, 's1');
  // S1 5 tahun lagi: (30 + 25) × 1,1^5 = 88,578 jt
  near(P.needTotal, 55e6 * Math.pow(1.1, 5), 1e-3);
  near(P.monthly, E.eduRequiredMonthly(55e6 * Math.pow(1.1, 5), 60, 8), 1e-6);
});

test('dana awal dialokasikan ke jenjang terdekat dulu', () => {
  // return 0, inflasi 0 → nilai kini = kebutuhan. SD (2 thn lagi) butuh 30 jt, SMP (8 thn lagi) butuh 24 jt.
  const P = E.eduPlan({
    usia: 4, inflasi: 0, ret: 0, dana: 40e6, full: false,
    jenjang: [lv('smp', true, 12, 12e6, 12e6, 3), lv('sd', true, 6, 20e6, 10e6, 6)]
  });
  const smp = P.levels[0], sd = P.levels[1];
  assert.equal(sd.alloc, 30e6);
  assert.equal(sd.remaining, 0);
  assert.equal(sd.monthly, 0);
  assert.equal(smp.alloc, 10e6);
  assert.equal(smp.remaining, 14e6);
  near(smp.monthly, 14e6 / 96);
  assert.equal(P.surplus, 0);
  // dana berlebih → surplus, setoran 0
  const Q = E.eduPlan({ usia: 4, inflasi: 0, ret: 0, dana: 60e6, full: false, jenjang: [lv('sd', true, 6, 20e6, 10e6, 6)] });
  assert.equal(Q.monthly, 0);
  assert.equal(Q.surplus, 30e6);
});

test('alokasi memperhitungkan pertumbuhan dana: alokasi × (1+i)^n', () => {
  // 1 tahun lagi @1%/bln, kebutuhan 11.268.250,30 → nilai kini 10 jt; dana 5 jt menutup separuh
  const P = E.eduPlan({ usia: 5, inflasi: 0, ret: R1, dana: 5e6, full: false, jenjang: [lv('sd', true, 6, 11268250.3013, 0, 6)] });
  const sd = P.levels[0];
  near(sd.alloc, 5e6, 1e-6);
  near(sd.remaining, 11268250.3013 / 2, 1e-3);
  near(sd.monthly, E.eduRequiredMonthly(11268250.3013 / 2, 12, R1), 1e-6);
});

test('jadwal setoran turun saat jenjang dimulai', () => {
  const P = E.eduPlan({ usia: 4, inflasi: 0, ret: 0, dana: 0, full: false, jenjang: [lv('sd', true, 6, 24e6, 0, 6), lv('smp', true, 8, 24e6, 0, 3)] });
  const sch = E.eduSchedule(P, 4);
  assert.deepEqual(sch.map((x) => x.age), [4, 5, 6, 7, 8]);
  near(sch[0].v, 1e6 + 5e5); // SD 24 jt/24 bln + SMP 24 jt/48 bln
  near(sch[2].v, 5e5);
  assert.equal(sch[4].v, 0);
});
