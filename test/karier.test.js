'use strict';
/**
 * Gaji bersih, nilai waktu, upah minimum & dua tawaran — angka acuan sama dengan
 * Habit Tracker (dev/test/m5-salary.test.js), jadi hasil port dijamin identik.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const ctx = require('../js/engine/karier.js');
const { TARIF } = require('../js/data/tarif.js');
const { WAGE_DATA } = require('../js/data/upah-minimum.js');

const plain = (x) => JSON.parse(JSON.stringify(x));
const payload = { config: TARIF.config, ter: TARIF.ter, brackets: TARIF.brackets };
const BASE = { gaji: 0, tunjangan: 0, tidakTetap: 0, thr: 0, ptkp: 'TK/0', kes: true, jht: true, jp: true, jkk: 'SANGAT_RENDAH', dtp: false };
function calc(inp) { return plain(ctx.calcSalary(Object.assign({}, BASE, inp), payload.config, payload.ter, payload.brackets)); }

test('M5.1 kasus 1 — Rp8 jt + tunjangan Rp1,5 jt, TK/0 (TER A 2%)', () => {
  const r = calc({ gaji: 8000000, tunjangan: 1500000 });
  assert.equal(r.premi, 431300, 'BPJS Kes 4% + JKK 0,24% + JKM 0,3%');
  assert.equal(r.bruto, 9931300);
  assert.equal(r.kat, 'A');
  assert.equal(r.rate, 2);
  assert.equal(r.pph, 198626);
  assert.equal(r.bpjs, 380000);
  assert.equal(r.thp, 8921374);
  assert.equal(r.year.biayaJabatan, 5958780);
  assert.equal(r.year.pkp, 55796000);
  assert.equal(r.year.pph, 2789800);
  assert.equal(r.year.pphDec, 604914);
  assert.equal(r.thpDec, 8515086);
  assert.equal(r.thpYear, 106650200);
});

test('M5.2 kasus 2 — Rp15 jt, K/1: batas upah BPJS Kes & JP, TER B 6%, Pasal 17 dua lapis', () => {
  const r = calc({ gaji: 15000000, ptkp: 'K/1' });
  assert.equal(r.emp.kes, 480000, '4% × batas Rp12 jt');
  assert.equal(r.ee.kes, 120000);
  assert.equal(Math.round(r.ee.jp), 110863, '1% × batas Rp11.086.300');
  assert.equal(r.bruto, 15561000);
  assert.equal(r.kat, 'B');
  assert.equal(r.rate, 6);
  assert.equal(r.pph, 933660);
  assert.equal(Math.round(r.thp), 13535477);
  assert.equal(r.year.biayaJabatan, 6000000, 'biaya jabatan maks Rp6 jt');
  assert.equal(r.year.ptkp, 63000000);
  assert.equal(r.year.pkp, 112801000);
  assert.equal(r.year.pph, 10920150);
  assert.equal(Math.round(r.year.pphDec), 649890);
});

test('M5.3 kasus 3 — Rp5 jt, TK/0: TER 0% tapi Desember tetap kena penyesuaian', () => {
  const r = calc({ gaji: 5000000 });
  assert.equal(r.bruto, 5227000);
  assert.equal(r.rate, 0);
  assert.equal(r.pph, 0);
  assert.equal(r.thp, 4800000);
  assert.equal(r.year.pkp, 3787000);
  assert.equal(r.year.pph, 189350);
  assert.equal(r.thpDec, 4610650);
});

test('M5.4 kasus 4 — THR satu bulan gaji: bulan THR kena TER 8%', () => {
  const r = calc({ gaji: 8000000, tunjangan: 1500000, thr: 9500000 });
  assert.equal(r.thrMonth.bruto, 19431300);
  assert.equal(r.thrMonth.rate, 8);
  assert.equal(r.thrMonth.pph, 1554504);
  assert.equal(r.thrMonth.thp, 17065496);
  assert.equal(r.year.biayaJabatan, 6000000);
  assert.equal(r.year.pkp, 65255000);
  assert.equal(r.year.pph, 3788250);
  assert.equal(r.year.paidJanNov, 3540764);
  assert.equal(r.year.pphDec, 247486);
  assert.equal(r.thpDec, 8872514);
  assert.equal(r.thpYear, 115151750);
});

test('M5.5 kasus 5 — insentif PPh 21 DTP (bruto ≤ Rp10 jt): PPh Rp0 sepanjang tahun', () => {
  const r = calc({ gaji: 7000000, dtp: true });
  assert.equal(r.bruto, 7317800);
  assert.equal(r.dtp, true);
  assert.equal(r.pphRaw, 91472, 'tanpa DTP: TER A 1,25%');
  assert.equal(r.pph, 0);
  assert.equal(r.thp, 6720000);
  assert.equal(r.thpDec, 6720000);
  const over = calc({ gaji: 12000000, dtp: true });
  assert.equal(over.dtp, false, 'bruto > Rp10 jt tidak memenuhi syarat');
  assert.ok(over.pph > 0);
});

test('M5.6 kasus 6 — tunjangan tidak tetap menambah bruto tapi bukan dasar iuran BPJS', () => {
  const r = calc({ gaji: 6000000, tidakTetap: 2000000 });
  assert.equal(r.upah, 6000000);
  assert.equal(r.pay, 8000000);
  assert.equal(r.bpjs, 240000);
  assert.equal(r.bruto, 8272400);
  assert.equal(r.rate, 1.5);
  assert.equal(r.pph, 124086);
  assert.equal(r.thp, 7635914);
});

test('M5.7 kategori TER mengikuti status PTKP & BPJS bisa dimatikan', () => {
  assert.equal(calc({ gaji: 9000000, ptkp: 'TK/1' }).kat, 'A');
  assert.equal(calc({ gaji: 9000000, ptkp: 'K/0' }).kat, 'A');
  assert.equal(calc({ gaji: 9000000, ptkp: 'TK/2' }).kat, 'B');
  assert.equal(calc({ gaji: 9000000, ptkp: 'K/2' }).kat, 'B');
  assert.equal(calc({ gaji: 9000000, ptkp: 'K/3' }).kat, 'C');
  const off = calc({ gaji: 9000000, kes: false, jht: false, jp: false });
  assert.equal(off.bpjs, 0);
  assert.equal(off.premi, 9000000 * 0.0054, 'tanpa BPJS Kes: hanya JKK + JKM');
  assert.equal(calc({ gaji: 0 }).thp, 0);
});

test('M5.8 tarif progresif Pasal 17 & batas TER', () => {
  const b = payload.brackets;
  assert.equal(ctx.progressiveTax(60000000, b), 3000000);
  assert.equal(ctx.progressiveTax(250000000, b), 3000000 + 28500000);
  assert.equal(ctx.progressiveTax(500000000, b), 31500000 + 62500000);
  assert.equal(ctx.progressiveTax(6000000000, b), 94000000 + 1350000000 + 350000000);
  assert.equal(ctx.terRate(payload.ter.A, 5400000), 0, 'batas atas inklusif');
  assert.equal(ctx.terRate(payload.ter.A, 5400001), 0.25);
  assert.equal(ctx.terRate(payload.ter.A, 2e9), 34);
  assert.equal(ctx.terRate(payload.ter.C, 6600000), 0);
});

test('M5.9 nilai waktu: gaji bersih rata-rata ÷ jam kerja per bulan', () => {
  const r = calc({ gaji: 8000000, tunjangan: 1500000 });
  const tv = plain(ctx.calcTime(r.avgNet, 8, 5));
  assert.equal(Math.round(tv.hoursMonth * 100) / 100, 173.33);
  assert.equal(Math.round(tv.perHour), 51274);
  assert.equal(Math.round(tv.perMin), 855);
  assert.equal(Math.round(tv.perDay), 410193);
  const six = plain(ctx.calcTime(r.avgNet, 8, 6));
  assert.ok(six.perHour < tv.perHour);
});

// ============================ PEMBANDING UPAH MINIMUM ============================
const SAMPLE_WAGES = { year: 2026, provinces: [
  { name: 'DKI Jakarta', ump: 5729876, regions: [['Kota Jakarta Selatan', 5729876, false]] },
  { name: 'Jawa Barat', ump: 2317601, regions: [['Kota Bekasi', 5999443, true], ['Kabupaten Pangandaran', 2351250, true], ['Kabupaten Contoh', 2317601, false]] },
  { name: 'Jawa Tengah', ump: 2327386, regions: [['Kota Semarang', 3701709, true]] }
] };
test('M5.16 pembanding upah minimum: kelipatan, status, peringkat, setara kota lain', () => {
  const idx = plain(ctx.wageIndex(SAMPLE_WAGES));
  assert.equal(idx.regions.length, 5);
  assert.deepEqual(idx.byKey['Jawa Barat|'], { prov: 'Jawa Barat', region: '', value: 2317601, kind: 'UMP' });
  assert.equal(idx.byKey['Jawa Barat|Kota Bekasi'].kind, 'UMK');
  assert.equal(idx.byKey['Jawa Barat|Kabupaten Contoh'].kind, 'UMP', 'kab/kota tanpa UMK memakai UMP');
  const cmp = (u, w) => plain(ctx.wageCompare(u, w));
  assert.deepEqual(cmp(5999443, 5999443), { ratio: 1, diff: 0, status: 'at' });
  assert.equal(cmp(5999442, 5999443).status, 'below', 'kurang Rp1 pun sudah di bawah');
  assert.equal(cmp(6299000, 5999443).status, 'at', '< 1,05× masih "sekitar"');
  assert.equal(cmp(9500000, 5999443).status, 'above');
  assert.equal(Math.round(cmp(9500000, 5999443).diff), 3500557);
  assert.equal(ctx.wageCompare(1, 0), null);
  const rank = plain(ctx.wageRank(4000000, idx.regions));
  assert.deepEqual(rank, { met: 3, total: 5, pct: 60 }, 'UMK ≤ upah: Pangandaran, Contoh, Semarang');
  assert.equal(Math.round(ctx.wageEquivalent(8000000, 5729876, 3701709)), 5168292, 'Rp8 jt Jakarta ≈ Rp5,17 jt Semarang');
  assert.equal(ctx.wageEquivalent(8000000, 0, 3701709), 0);
});

test('M5.17 dua tawaran kerja memakai mesin gaji yang sama + upah minimum kotanya', () => {
  const idx = ctx.wageIndex(SAMPLE_WAGES);
  const base = Object.assign({}, BASE, { gaji: 1, tunjangan: 1, tidakTetap: 500000, thr: 9000000 });
  const res = plain(ctx.compareOffers([
    { nama: 'A', gaji: 8000000, tunjangan: 1500000, lokasi: 'Jawa Tengah|Kota Semarang' },
    { nama: 'B', gaji: 15000000, tunjangan: 0, lokasi: 'DKI Jakarta|Kota Jakarta Selatan' }
  ], base, payload.config, payload.ter, payload.brackets, idx));
  assert.equal(res[0].r.thp, calc({ gaji: 8000000, tunjangan: 1500000 }).thp, 'THR & tunjangan tidak tetap diabaikan');
  assert.equal(Math.round(res[1].r.thp), Math.round(calc({ gaji: 15000000 }).thp));
  assert.equal(res[0].wage.kind, 'UMK');
  assert.equal(Math.round(res[0].cmp.ratio * 100) / 100, 2.57, 'Rp9,5 jt ÷ UMK Semarang');
  assert.equal(res[1].wage.kind, 'UMP');
  const none = plain(ctx.compareOffers([{ gaji: 5000000, tunjangan: 0, lokasi: '' }], base, payload.config, payload.ter, payload.brackets, idx));
  assert.equal(none[0].wage, null);
  assert.equal(none[0].cmp, null);
});

test('M5.20 data upah minimum 2026: 38 provinsi, 514 kab/kota, angka kunci sesuai SK', () => {
  const d = WAGE_DATA;
  assert.equal(d.year, 2026);
  assert.equal(d.provinces.length, 38);
  const regions = d.provinces.flatMap((p) => p.regions.map((r) => [p.name].concat(r)));
  assert.equal(regions.length, 514, '416 kabupaten + 98 kota');
  assert.equal(regions.filter((r) => r[3]).length, 256, 'kab/kota dengan UMK sendiri');
  const ump = {};
  d.provinces.forEach((p) => { ump[p.name] = p.ump; });
  const umk = (prov, reg) => regions.find((r) => r[0] === prov && r[1] === reg)[2];
  assert.equal(ump['DKI Jakarta'], 5729876);
  assert.equal(ump['Jawa Barat'], 2317601, 'UMP terendah');
  assert.equal(ump['Jawa Tengah'], 2327386.07);
  assert.equal(ump['Sumatera Utara'], 3228971, 'diumumkan Gubernur 19 Des 2025');
  assert.equal(umk('Jawa Barat', 'Kota Bekasi'), 5999443);
  assert.equal(umk('Jawa Timur', 'Kota Surabaya'), 5288796);
  assert.equal(umk('Jawa Tengah', 'Kota Semarang'), 3701709);
  assert.equal(umk('Riau', 'Kota Dumai'), 4431174.69);
  assert.equal(umk('Kepulauan Riau', 'Kota Batam'), 5357982);
  assert.equal(umk('Papua Tengah', 'Kabupaten Mimika'), 5005678);
  assert.equal(umk('DKI Jakarta', 'Kota Jakarta Selatan'), 5729876, 'DKI tanpa UMK');
  assert.equal(umk('Lampung', 'Kabupaten Tulang Bawang Barat'), 3047734, 'baris ganda di file sumber diperbaiki');
  assert.ok(d.provinces.every((p) => p.regions.every((r) => r[1] >= p.ump)), 'tidak ada UMK di bawah UMP');
  const max = regions.reduce((a, b) => (b[2] > a[2] ? b : a));
  assert.equal(max[1], 'Kota Bekasi', 'UMK tertinggi 2026');
  assert.equal(new Set(regions.map((r) => r[0] + '|' + r[1])).size, 514, 'tidak ada kab/kota ganda');
  const idx = ctx.wageIndex(d);
  assert.equal(idx.byKey['Jawa Barat|Kota Bekasi'].kind, 'UMK');
  assert.equal(idx.byKey['DKI Jakarta|'].kind, 'UMP');
});

test('biaya kebiasaan kecil: harian → bulanan, jam kerja, nilai bila diinvestasikan', () => {
  // Rp35.000 × 5 hari × 52 minggu = Rp9.100.000 setahun = Rp758.333/bln
  const h = ctx.calcHabitCost(35000, 5, 50000, 10, 8);
  assert.equal(h.perYear, 9100000);
  assert.equal(Math.round(h.perMonth), 758333);
  assert.equal(h.hoursYear, 182, 'Rp9,1 jt ÷ Rp50.000/jam');
  assert.equal(Math.round(h.paid), 91000000, '120 bulan disetor');
  // FV anuitas bulanan, bunga efektif (1,08)^(1/12) − 1
  const mr = Math.pow(1.08, 1 / 12) - 1;
  assert.equal(Math.round(h.invested), Math.round(h.perMonth * (Math.pow(1 + mr, 120) - 1) / mr));
  assert.ok(h.invested > h.paid);
  const flat = ctx.calcHabitCost(10000, 7, 0, 2, 0);
  assert.equal(flat.invested, flat.paid, 'tanpa return: hasil = setoran');
  assert.equal(flat.hoursYear, 0, 'nilai waktu 0 → tidak dibagi nol');
});
