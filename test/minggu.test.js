'use strict';
/** Hidup dalam Minggu — umur tepat, minggu terlewati, persen, jam kerja tersisa, grid. */
const test = require('node:test');
const assert = require('node:assert/strict');
const E = require('../js/engine/minggu.js');

const ymd = (a) => [a.years, a.months, a.days];

test('parse tanggal & validasi', () => {
  assert.deepEqual(E.lifeParse('1996-01-01'), { y: 1996, m: 1, d: 1 });
  assert.equal(E.lifeParse('2023-02-29'), null); // bukan kabisat
  assert.deepEqual(E.lifeParse('2024-02-29'), { y: 2024, m: 2, d: 29 });
  assert.equal(E.lifeParse('2024-13-01'), null);
  assert.equal(E.lifeParse(''), null);
  assert.equal(E.lifeParse('1/1/1996'), null);
  assert.equal(E.lifeAge('2030-01-01', '2026-10-05'), null); // lahir setelah hari ini
});

test('umur tepat: ulang tahun hari ini', () => {
  const a = E.lifeAge('1996-10-05', '2026-10-05');
  assert.deepEqual(ymd(a), [30, 0, 0]);
  assert.equal(a.ageYears, 30);
  // hari lahir itu sendiri
  assert.deepEqual(ymd(E.lifeAge('2026-10-05', '2026-10-05')), [0, 0, 0]);
});

test('umur tepat: belum ulang tahun tahun ini', () => {
  // lahir 6 Okt 1996, hari ini 5 Okt 2026 → 29 tahun 11 bulan; 6 Sep → 5 Okt = 29 hari
  assert.deepEqual(ymd(E.lifeAge('1996-10-06', '2026-10-05')), [29, 11, 29]);
  // lahir 1 Jan 1996, hari ini 5 Okt 2026 → 30 tahun 9 bulan 4 hari
  const a = E.lifeAge('1996-01-01', '2026-10-05');
  assert.deepEqual(ymd(a), [30, 9, 4]);
  // total hari: 1996-01-01 → 2026-10-05 = 11235 hari (Date.UTC)
  assert.equal(a.totalDays, 11235);
  // bagian tahun: 1 Jan 2026 → 5 Okt 2026 = 277 hari dari 365
  assert.ok(Math.abs(a.ageYears - (30 + 277 / 365)) < 1e-12);
  // akhir bulan: lahir 31 Jan, hari ini 28 Feb (bukan kabisat) → 1 bulan 0 hari
  assert.deepEqual(ymd(E.lifeAge('2025-01-31', '2025-02-28')), [0, 1, 0]);
});

test('umur tepat: lahir 29 Februari', () => {
  // tahun bukan kabisat: ulang tahun dianggap 28 Februari
  assert.deepEqual(ymd(E.lifeAge('2000-02-29', '2001-02-28')), [1, 0, 0]);
  assert.deepEqual(ymd(E.lifeAge('2000-02-29', '2001-02-27')), [0, 11, 29]); // 29 Jan → 27 Feb = 29 hari
  assert.deepEqual(ymd(E.lifeAge('2000-02-29', '2001-03-01')), [1, 0, 1]);
  assert.deepEqual(ymd(E.lifeAge('2000-02-29', '2004-02-29')), [4, 0, 0]);
  assert.deepEqual(ymd(E.lifeAge('2000-02-29', '2026-10-05')), [26, 7, 6]); // 29 Sep (dipotong dari 29) → 5 Okt
});

test('minggu terlewati, total minggu & persen', () => {
  // 11235 hari / 7 = 1605 minggu penuh → minggu ke-1606
  const s = E.lifeStats({ birth: '1996-01-01', today: '2026-10-05', lifeExp: 70, retireAge: 55, hoursPerWeek: 40 });
  assert.equal(s.weeksLived, 1605);
  assert.equal(s.weekNo, 1606);
  // 70 × 365,25 / 7 = 3652,5 → 3653 minggu
  assert.equal(s.totalWeeks, 3653);
  assert.equal(s.weeksLeft, 3653 - 1605);
  // 11235 / 25567,5 hari ≈ 43,94%
  assert.ok(Math.abs(s.pct - 11235 / 25567.5 * 100) < 1e-9);
  // hari tersisa: round(25567,5) = 25568 − 11235
  assert.equal(s.daysLeft, 25568 - 11235);
  assert.equal(s.sleepHours, 11235 * 8);
  assert.equal(s.heartbeats, 11235 * 1440 * 70);
});

test('persen dibatasi 0–100 & usia melewati harapan hidup', () => {
  const s = E.lifeStats({ birth: '1940-01-01', today: '2026-10-05', lifeExp: 70, retireAge: 60, hoursPerWeek: 40 });
  assert.equal(s.pct, 100);
  assert.equal(s.weeksLeft, 0);
  assert.equal(s.daysLeft, 0);
  assert.equal(s.yearsLeft, 0);
  assert.equal(s.lebaranLeft, 0);
  assert.equal(s.beyond, true);
  // harapan hidup 0 → 100%
  assert.equal(E.lifeStats({ birth: '2000-01-01', today: '2026-10-05', lifeExp: 0 }).pct, 100);
  // lahir hari ini → 0%
  assert.equal(E.lifeStats({ birth: '2026-10-05', today: '2026-10-05', lifeExp: 70 }).pct, 0);
  // grid tetap ditampilkan sampai usia sekarang + 2 (86 → baris 0..88)
  const g = E.lifeGrid(s.age.ageYears, 70, 60);
  assert.equal(g.rows.length, 89);
  assert.equal(g.nowRow, 86);
  assert.equal(g.rows[75].cap, 0);
});

test('jam kerja tersisa sampai pensiun', () => {
  // 40 jam × 48 minggu × (55 − 30) tahun = 48.000 jam
  assert.equal(E.lifeWorkHoursLeft(40, 30, 55), 48000);
  assert.equal(E.lifeWorkHoursLeft(40, 30, 55, 50), 50000);
  // pensiun sudah lewat → 0
  assert.equal(E.lifeWorkHoursLeft(40, 60, 55), 0);
  assert.equal(E.lifeWorkHoursLeft(0, 30, 55), 0);
  const s = E.lifeStats({ birth: '1960-01-01', today: '2026-10-05', lifeExp: 74, retireAge: 58, hoursPerWeek: 40 });
  assert.equal(s.workHoursLeft, 0);
  assert.equal(s.yearsToRetire, 0);
});

test('Lebaran tersisa ≈ tahun tersisa × 365,25 / 354,367', () => {
  // usia tepat 30 (ulang tahun hari ini), harapan 70 → 40 tahun → 41,2 → 41 kali
  const s = E.lifeStats({ birth: '1996-10-05', today: '2026-10-05', lifeExp: 70 });
  assert.equal(s.yearsLeft, 40);
  assert.equal(s.lebaranLeft, 41);
});

test('grid: fase hidup, kotak terlewati, batas harapan hidup', () => {
  assert.deepEqual([0, 5, 6, 17, 18, 22, 23, 54, 55, 80].map((a) => E.lifePhase(a, 55)),
    ['kecil', 'kecil', 'sekolah', 'sekolah', 'kuliah', 'kuliah', 'kerja', 'kerja', 'pensiun', 'pensiun']);
  // usia 30 + 277/365 → baris 30, kolom floor(0,7589 × 52) = 39
  const g = E.lifeGrid(30 + 277 / 365, 70.3, 55);
  assert.equal(g.rows.length, 71); // ceil(70,3)
  assert.equal(g.nowRow, 30);
  assert.equal(g.nowCol, 39);
  assert.equal(g.rows[29].lived, 52);
  assert.equal(g.rows[30].lived, 39);
  assert.equal(g.rows[31].lived, 0);
  assert.equal(g.rows[69].cap, 52);
  assert.equal(g.rows[70].cap, 16); // 0,3 × 52 = 15,6 → 16
  // usia 0
  const g0 = E.lifeGrid(0, 0, 55);
  assert.equal(g0.rows.length, 3);
  assert.equal(g0.nowCol, 0);
});
