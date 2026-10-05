'use strict';
/** Pesangon PHK — PP 35/2021, PP 36/2021, PP 68/2009 (angka dihitung manual di komentar). */
const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('../js/engine/pesangon.js');

test('masa kerja dari dua tanggal (hari terakhir ikut dihitung)', () => {
  // 1 Jan 2020 s.d. 31 Des 2020 = tepat 1 tahun
  let t = P.sevTenure('2020-01-01', '2020-12-31');
  assert.deepEqual([t.valid, t.years, t.months, t.days, t.totalMonths], [true, 1, 0, 0, 12]);
  // 1 Jan 2020 s.d. 30 Des 2020 = 11 bulan 30 hari → belum 1 tahun
  t = P.sevTenure('2020-01-01', '2020-12-30');
  assert.deepEqual([t.years, t.months, t.days], [0, 11, 30]);
  // 15 Mar 2018 s.d. 4 Okt 2026 → 15 Mar 2018 + 8 th 6 bln = 15 Sep 2026; s.d. 5 Okt (eksklusif) = 20 hari
  t = P.sevTenure('2018-03-15', '2026-10-04');
  assert.deepEqual([t.years, t.months, t.days], [8, 6, 20]);
  // 31 Jan s.d. 27 Feb 2026 → 31 Jan + 1 bln = 28 Feb (akhir bulan) → 1 bulan 0 hari
  t = P.sevTenure('2026-01-31', '2026-02-27');
  assert.deepEqual([t.totalMonths, t.days], [1, 0]);
  // tanggal terbalik / tidak valid
  assert.equal(P.sevTenure('2026-05-01', '2026-04-30').valid, false);
  assert.equal(P.sevTenure('', '2026-04-30').valid, false);
  assert.equal(P.sevTenure('2026-05-01', '2026-05-01').days, 1);
});

test('tabel UP (Pasal 40 ayat 2) di batas masa kerja', () => {
  // <1 th: 1 · 1 th: 2 · 2: 3 · 3: 4 · 7: 8 · tepat 8 th ke atas: 9
  assert.deepEqual([0, 0.99, 1, 2, 3, 7, 7.99, 8, 24, 40].map(P.sevUpMonths), [1, 1, 2, 3, 4, 8, 8, 9, 9, 9]);
});

test('tabel UPMK (Pasal 40 ayat 3) di batas masa kerja', () => {
  // <3: 0 · 3–<6: 2 · 6–<9: 3 · 9–<12: 4 · 12–<15: 5 · 15–<18: 6 · 18–<21: 7 · 21–<24: 8 · ≥24: 10
  assert.deepEqual([0, 2, 3, 5, 6, 8, 9, 12, 15, 18, 21, 23, 24, 30].map(P.sevUpmkMonths), [0, 0, 2, 2, 3, 3, 4, 5, 6, 7, 8, 8, 10, 10]);
});

test('pengali alasan PHK sesuai PP 35/2021', () => {
  const m = {};
  P.SEV_REASONS.forEach((r) => { m[r.id] = [r.up, r.upmk, r.pisah]; });
  assert.deepEqual(m.efRugi, [0.5, 1, false]);       // Pasal 43 (1)
  assert.deepEqual(m.efCegah, [1, 1, false]);        // Pasal 43 (2)
  assert.deepEqual(m.akuisisiSyarat, [0.5, 1, false]); // Pasal 42 (2)
  assert.deepEqual(m.fmTidakTutup, [0.75, 1, false]); // Pasal 45 (2)
  assert.deepEqual(m.sp3, [0.5, 1, false]);          // Pasal 52 (1)
  assert.deepEqual(m.resign, [0, 0, true]);          // Pasal 50
  assert.deepEqual(m.mangkir, [0, 0, true]);         // Pasal 51
  assert.deepEqual(m.ditahanTidakRugi, [0, 1, false]); // Pasal 54 (2)
  assert.deepEqual(m.sakit, [2, 1, false]);          // Pasal 55
  assert.deepEqual(m.pensiun, [1.75, 1, false]);     // Pasal 56
  assert.deepEqual(m.meninggal, [2, 1, false]);      // Pasal 57
  assert.equal(P.SEV_REASONS.length, 23);
  assert.equal(new Set(P.SEV_REASONS.map((r) => r.id)).size, 23);
});

const BASE = { status: 'pkwtt', mulai: '2016-01-01', akhir: '2025-12-31', upah: 10000000, cutiHari: 0, hariKerja: 5, biayaPulang: 0, lainUph: 0, uangPisah: 0 };
const calc = (o) => P.sevCalc(Object.assign({}, BASE, o));

test('total per alasan: masa kerja 10 tahun, upah 10 jt', () => {
  // 10 th → UP 9 bln, UPMK 4 bln
  // efisiensi rugi: 0,5 × 9 × 10 jt = 45 jt + UPMK 40 jt = 85 jt bruto
  let r = calc({ alasan: 'efRugi' });
  assert.equal(r.upMonths, 9);
  assert.equal(r.upmkMonths, 4);
  assert.equal(r.up, 45000000);
  assert.equal(r.upmk, 40000000);
  assert.equal(r.gross, 85000000);
  // PPh: 50 jt × 0% + 35 jt × 5% = 1.750.000
  assert.equal(r.tax, 1750000);
  assert.equal(r.net, 83250000);
  // pensiun: 1,75 × 9 × 10 jt = 157,5 jt + 40 jt = 197,5 jt
  r = calc({ alasan: 'pensiun' });
  assert.equal(r.gross, 197500000);
  // meninggal: 2 × 90 jt + 40 jt = 220 jt
  assert.equal(calc({ alasan: 'meninggal' }).gross, 220000000);
  // force majeure tidak tutup: 0,75 × 90 jt = 67,5 jt + 40 jt = 107,5 jt
  assert.equal(calc({ alasan: 'fmTidakTutup' }).gross, 107500000);
  // resign: hanya UPH + uang pisah
  r = calc({ alasan: 'resign', uangPisah: 5000000, cutiHari: 6 });
  assert.equal(r.up + r.upmk, 0);
  // cuti 6 hari × (10 jt ÷ 21) = 2.857.142,86; + uang pisah 5 jt
  assert.ok(Math.abs(r.gross - (60000000 / 21 + 5000000)) < 1e-6);
  // uang pisah diabaikan untuk alasan yang tidak berhak
  assert.equal(calc({ alasan: 'efCegah', uangPisah: 5000000 }).pisah, 0);
  // ditahan, tidak merugikan perusahaan: hanya UPMK 4 × 10 jt
  assert.equal(calc({ alasan: 'ditahanTidakRugi' }).gross, 40000000);
});

test('UPH: cuti ÷ 21 (5 hari kerja) atau ÷ 25 (6 hari kerja) + ongkos pulang + lain', () => {
  // 10 jt ÷ 25 = 400.000/hari × 5 hari = 2 jt
  let r = calc({ alasan: 'efCegah', cutiHari: 5, hariKerja: 6, biayaPulang: 1500000, lainUph: 500000 });
  assert.equal(r.daily, 400000);
  assert.equal(r.uphCuti, 2000000);
  assert.equal(r.uph, 4000000);
  // 10,5 jt ÷ 21 = 500.000/hari × 3 = 1,5 jt
  r = calc({ alasan: 'efCegah', upah: 10500000, cutiHari: 3, hariKerja: 5 });
  assert.equal(r.daily, 500000);
  assert.equal(r.uphCuti, 1500000);
  assert.equal(P.sevDailyWage(0, 5), 0);
});

test('masa kerja < 1 tahun: UP 1 bulan, UPMK 0', () => {
  // 1 Mar – 31 Agu 2026 = 6 bulan
  const r = calc({ alasan: 'efCegah', mulai: '2026-03-01', akhir: '2026-08-31', upah: 6000000 });
  assert.equal(r.tenure.years, 0);
  assert.equal(r.upMonths, 1);
  assert.equal(r.upmkMonths, 0);
  assert.equal(r.gross, 6000000);
  assert.equal(r.tax, 0);
});

test('kompensasi PKWT proporsional (Pasal 16)', () => {
  // 12 bulan → 1 bulan upah
  assert.equal(P.sevKompensasi(6000000, 12), 6000000);
  // 6 bulan → 6/12 × 6 jt = 3 jt
  assert.equal(P.sevKompensasi(6000000, 6), 3000000);
  // 18 bulan → 18/12 × 6 jt = 9 jt
  assert.equal(P.sevKompensasi(6000000, 18), 9000000);
  // < 1 bulan → tidak berhak
  assert.equal(P.sevKompensasi(6000000, 0.9), 0);
  // dari tanggal: 1 Jan – 30 Jun 2026 = 6 bulan → 3 jt; tidak ada UP/UPMK
  const r = calc({ status: 'pkwt', mulai: '2026-01-01', akhir: '2026-06-30', upah: 6000000, alasan: 'efCegah', cutiHari: 10 });
  assert.equal(r.kompensasi, 3000000);
  assert.equal(r.up + r.upmk + r.uph, 0);
  assert.equal(r.gross, 3000000);
  // 6 bulan 15 hari → (6 + 15/30)/12 × 6 jt = 3.250.000
  assert.equal(calc({ status: 'pkwt', mulai: '2026-01-01', akhir: '2026-07-15', upah: 6000000 }).kompensasi, 3250000);
});

test('PPh 21 final pesangon per lapisan (PP 68/2009)', () => {
  // 120 jt → 50 jt × 0% + 50 jt × 5% + 20 jt × 15% = 0 + 2,5 jt + 3 jt = 5,5 jt
  assert.equal(P.sevTax(120000000).tax, 5500000);
  assert.equal(P.sevTax(50000000).tax, 0);
  // 100 jt → 2,5 jt
  assert.equal(P.sevTax(100000000).tax, 2500000);
  // 600 jt → 0 + 2,5 jt + 400 jt × 15% = 60 jt + 100 jt × 25% = 25 jt → 87,5 jt
  assert.equal(P.sevTax(600000000).tax, 87500000);
  assert.equal(P.sevTax(0).tax, 0);
  assert.equal(P.sevTax(-1).tax, 0);
  assert.deepEqual(P.sevTax(120000000).layers.map((l) => l.base), [50000000, 50000000, 20000000, 0]);
});

test('kompensasi PKWT: pilihan pajak final atau tidak', () => {
  // 18 bulan × upah 80 jt → kompensasi 120 jt
  const o = { status: 'pkwt', mulai: '2025-01-01', akhir: '2026-06-30', upah: 80000000 };
  assert.equal(calc(Object.assign({ pkwtFinal: true }, o)).tax, 5500000);
  const r = calc(Object.assign({ pkwtFinal: false }, o));
  assert.equal(r.tax, 0);
  assert.equal(r.net, 120000000);
});

test('input kosong / tanggal tidak valid → semua 0', () => {
  let r = calc({ upah: 0, alasan: 'pensiun' });
  assert.equal(r.gross, 0);
  assert.equal(r.net, 0);
  r = calc({ akhir: '2015-01-01', alasan: 'pensiun' });
  assert.equal(r.tenure.valid, false);
  assert.equal(r.gross, 0);
  r = P.sevCalc({});
  assert.equal(r.net, 0);
  // alasan tak dikenal → alasan pertama
  assert.equal(P.sevReason('xx').id, 'efRugi');
  // perbandingan: 23 alasan
  assert.equal(P.sevCompare(BASE).length, 23);
});
