'use strict';
/** PWA & ikon: daftar cache service worker sama dengan index.html, manifest valid, ikon sesuai logo. */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const icons = require('../tools/build-icons.js');

const ROOT = path.join(__dirname, '..');
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');

test('service worker menyimpan semua file yang dimuat index.html', () => {
  const html = read('index.html');
  const sw = read('sw.js');
  const core = JSON.parse('[' + /const CORE = \[([\s\S]*?)\];/.exec(sw)[1].replace(/'/g, '"').replace(/,\s*$/, '') + ']');
  const needed = [...html.matchAll(/(?:src|href)="((?:js|css|assets)\/[^"]+|manifest\.webmanifest)"/g)].map((m) => m[1])
    .filter((f) => !/apple-touch-icon/.test(f));
  needed.forEach((f) => assert.ok(core.includes(f), 'sw.js CORE belum memuat ' + f));
  core.filter((f) => f !== './').forEach((f) => assert.ok(fs.existsSync(path.join(ROOT, f)), 'file di CORE tidak ada: ' + f));
});

test('manifest & ikon PWA lengkap', () => {
  const m = JSON.parse(read('manifest.webmanifest'));
  assert.equal(m.display, 'standalone');
  assert.ok(m.icons.some((i) => i.sizes === '192x192') && m.icons.some((i) => i.sizes === '512x512'));
  assert.ok(m.icons.some((i) => i.purpose === 'maskable'));
  m.icons.forEach((i) => assert.ok(fs.existsSync(path.join(ROOT, i.src)), i.src));
});

test('ikon PNG sama dengan hasil render logo di js/app.js (jalankan npm run icons bila gagal)', () => {
  const { LOGO, logoSvg } = icons.loadLogo();
  icons.PNGS.forEach((f) => {
    const png = icons.decodePng(fs.readFileSync(path.join(ROOT, 'assets', 'icons', f.file)));
    assert.equal(png.w, f.size);
    assert.ok(png.px.equals(icons.render(LOGO, f.size, f.square, f.scale)), f.file + ' usang');
  });
  assert.equal(read('assets/icons/favicon.svg'), icons.svgFile(logoSvg));
  // sudut membulat transparan, tengah ubin tidak
  const p = icons.decodePng(fs.readFileSync(path.join(ROOT, 'assets', 'icons', 'icon-192.png')));
  assert.equal(p.px[3], 0);
  assert.equal(p.px[(96 * 192 + 96) * 4 + 3], 255);
});
