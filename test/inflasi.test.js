'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inflFuture, inflPresent, inflRealReturn, inflLoss, inflDoubleYears, inflAfterTax, inflSeries } = require('../js/engine/inflasi.js');

const near = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= (tol === undefined ? 1e-6 : tol), (msg || '') + ' ' + a + ' ≠ ' + b);

test('Nilai majemuk tepat', () => {
  // 1.000.000 × 1,03^10 = 1.343.916,38
  near(inflFuture(1e6, 3, 10), 1343916.38, 0.01);
  // 100.000 × 1,1^2 = 121.000
  near(inflFuture(100000, 10, 2), 121000, 1e-6);
  // 1.000.000 ÷ 1,05^10 = 613.913,25
  near(inflPresent(1e6, 5, 10), 613913.25, 0.01);
  assert.equal(inflFuture(1e6, 3, 0), 1e6);
});

test('Future dan present saling kebalikan', () => {
  [[1e6, 3, 10], [25e6, 7.5, 30], [123456, 0.5, 50]].forEach((c) => {
    near(inflPresent(inflFuture(c[0], c[1], c[2]), c[1], c[2]), c[0], 1e-6);
    near(inflFuture(inflPresent(c[0], c[1], c[2]), c[1], c[2]), c[0], 1e-6);
  });
});

test('Return riil (Fisher)', () => {
  // (1,05 / 1,03) − 1 = 1,9417…%
  near(inflRealReturn(5, 3), 1.941747572815534, 1e-9);
  near(inflRealReturn(3, 3), 0, 1e-12);
  assert.ok(inflRealReturn(1, 3) < 0); // tabungan 1% kalah dari inflasi 3%
  near(inflRealReturn(4, 0), 4, 1e-12);
});

test('Pajak bunga & daya beli hilang', () => {
  near(inflAfterTax(4, 20), 3.2, 1e-12);   // deposito 4% − pajak 20% = 3,2%
  near(inflAfterTax(5.75, 10), 5.175, 1e-12);
  // 1 − 1/1,03^10 = 25,59%
  near(inflLoss(3, 10), 25.590609, 1e-5);
  near(inflDoubleYears(3), 23.4498, 1e-4); // ln2 / ln1,03
});

test('Inflasi 0: tidak ada perubahan', () => {
  assert.equal(inflFuture(5e6, 0, 20), 5e6);
  assert.equal(inflPresent(5e6, 0, 20), 5e6);
  assert.equal(inflLoss(0, 30), 0);
  assert.equal(inflDoubleYears(0), null);
  inflSeries(1e6, 0, 5, 0).forEach((r) => { assert.equal(r.price, 1e6); assert.equal(r.power, 1e6); assert.equal(r.real, 1e6); });
});

test('Deret tahunan', () => {
  const s = inflSeries(10e6, 3, 10, 5); // gaji 10 jt naik 5%/thn, inflasi 3%
  assert.equal(s.length, 11);
  assert.equal(s[0].nominal, 10e6);
  near(s[10].nominal, 10e6 * Math.pow(1.05, 10), 1e-6);
  near(s[10].real, 10e6 * Math.pow(1.05 / 1.03, 10), 1e-6);
  near(s[10].price, inflFuture(10e6, 3, 10), 1e-6);
  near(s[10].power, inflPresent(10e6, 3, 10), 1e-6);
  assert.equal(inflSeries(1, 3, 0).length, 1);
});
