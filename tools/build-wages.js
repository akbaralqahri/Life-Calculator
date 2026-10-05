'use strict';
/**
 * Membuat js/data/upah-minimum.js dari data/upah-minimum/<tahun>.json — hasil riset UMP & UMK
 * per provinsi (diambil dari Habit Tracker → dev/upah-minimum).
 *
 *   npm run wages          (tahun terbaru di folder)
 *   npm run wages -- 2027
 *
 * Setiap provinsi diperiksa: UMP > 0, nilai UMK > 0, tidak ada kab/kota ganda, dan jumlah
 * kab/kota cocok dengan jumlah resmi. Pembaruan tahunan: salin JSON tahun lalu, ganti
 * angkanya, jalankan skrip ini, lalu `npm test`.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIR = path.join(ROOT, 'data', 'upah-minimum');
const OUT = path.join(ROOT, 'js', 'data', 'upah-minimum.js');
// Urutan provinsi mengikuti kode wilayah BPS
const ORDER = ['Aceh', 'Sumatera Utara', 'Sumatera Barat', 'Riau', 'Jambi', 'Sumatera Selatan', 'Bengkulu', 'Lampung',
  'Kepulauan Bangka Belitung', 'Kepulauan Riau', 'DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'DI Yogyakarta', 'Jawa Timur', 'Banten',
  'Bali', 'Nusa Tenggara Barat', 'Nusa Tenggara Timur', 'Kalimantan Barat', 'Kalimantan Tengah', 'Kalimantan Selatan',
  'Kalimantan Timur', 'Kalimantan Utara', 'Sulawesi Utara', 'Sulawesi Tengah', 'Sulawesi Selatan', 'Sulawesi Tenggara',
  'Gorontalo', 'Sulawesi Barat', 'Maluku', 'Maluku Utara', 'Papua Barat', 'Papua Barat Daya', 'Papua', 'Papua Selatan',
  'Papua Tengah', 'Papua Pegunungan'];

function latestYear() {
  const years = fs.readdirSync(DIR).map((f) => (/^(\d{4})\.json$/.exec(f) || [])[1]).filter(Boolean).sort();
  if (!years.length) throw new Error('Tidak ada file <tahun>.json di ' + DIR);
  return years[years.length - 1];
}

/** Periksa data mentah → { provinces: [{ name, ump, src, regions: [[kab/kota, nilai, punyaUMK]] }] } */
function build(src) {
  const provinces = src.provinces || [];
  const errors = [];
  const seen = {};
  provinces.forEach((p) => {
    if (ORDER.indexOf(p.provinsi) === -1) errors.push('Nama provinsi tidak dikenal: ' + p.provinsi);
    if (seen[p.provinsi]) errors.push('Provinsi ganda: ' + p.provinsi);
    seen[p.provinsi] = true;
    if (!(p.ump > 0)) errors.push('UMP tidak valid: ' + p.provinsi);
    const names = {};
    (p.umk || []).forEach((r) => {
      if (!(r.nilai > 0)) errors.push('UMK tidak valid: ' + p.provinsi + ' / ' + r.wilayah);
      if (names[r.wilayah]) errors.push('Kab/kota ganda: ' + r.wilayah);
      names[r.wilayah] = true;
    });
    (p.ikut_ump || []).forEach((n) => {
      if (names[n]) errors.push('Kab/kota ganda (UMK & ikut UMP): ' + n);
      names[n] = true;
    });
    const count = Object.keys(names).length;
    if (p.jumlah_kabkota_resmi && count !== p.jumlah_kabkota_resmi) errors.push(p.provinsi + ': ' + count + ' kab/kota, seharusnya ' + p.jumlah_kabkota_resmi);
  });
  ORDER.forEach((n) => { if (!seen[n]) errors.push('Provinsi belum ada: ' + n); });
  if (errors.length) throw new Error('Data belum valid:\n- ' + errors.join('\n- '));
  return ORDER.map((name) => {
    const p = provinces.find((x) => x.provinsi === name);
    const regions = (p.umk || []).map((r) => [r.wilayah, r.nilai, true]).concat((p.ikut_ump || []).map((n) => [n, p.ump, false]));
    return { name, ump: p.ump, src: p.umk_source || p.ump_source || '', regions };
  });
}

function main() {
  const year = process.argv[2] || latestYear();
  const src = JSON.parse(fs.readFileSync(path.join(DIR, year + '.json'), 'utf8'));
  const provinces = build(src);
  const js = (v) => JSON.stringify(v);
  const lines = provinces.map((p) => '  { name: ' + js(p.name) + ', ump: ' + p.ump + ', src: ' + js(p.src) + ',\n    regions: [' +
    p.regions.map((r) => '[' + js(r[0]) + ', ' + r[1] + ', ' + r[2] + ']').join(', ') + '] }');
  const out = '/* Dibuat oleh tools/build-wages.js dari data/upah-minimum/' + year + '.json — jangan diedit manual.\n' +
    ' * UMP 38 provinsi & UMK seluruh kab/kota yang berlaku 1 Januari ' + year + '.\n' +
    ' * regions: [kab/kota, upah minimum yang berlaku, punya UMK sendiri (false = ikut UMP)] */\n' +
    'var WAGE_DATA = { year: ' + Number(year) + ', provinces: [\n' + lines.join(',\n') + '\n] };\n' +
    "if (typeof module === 'object' && module.exports) module.exports = { WAGE_DATA };\n";
  fs.writeFileSync(OUT, out);
  const n = provinces.reduce((a, p) => a + p.regions.length, 0);
  console.log('Upah minimum ' + year + ': ' + provinces.length + ' provinsi, ' + n + ' kab/kota → js/data/upah-minimum.js (' + (Buffer.byteLength(out) / 1024).toFixed(1) + ' KB)');
}

if (require.main === module) main();
module.exports = { build, ORDER };
