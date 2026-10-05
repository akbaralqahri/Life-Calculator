'use strict';
/**
 * Smoke test seluruh tampilan: semua script di index.html dijalankan di VM Node (urutan sama
 * seperti browser), lalu setiap layar & ringkasan Beranda digambar dalam ID/EN, mode gelap,
 * privacy mode, dan dengan input kosong/ekstrem. Menangkap error runtime & nama global ganda.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script defer src="([^"]+)"><\/script>/g)].map((m) => m[1]);

function makeApp() {
  const mem = {};
  const noop = () => {};
  const el = () => ({ innerHTML: '', classList: { toggle: noop, add: noop, remove: noop }, style: { setProperty: noop }, setAttribute: noop, remove: noop, appendChild: noop, querySelector: () => null, offsetWidth: 0, insertAdjacentHTML: noop });
  const document = {
    addEventListener: noop, readyState: 'complete', title: '', activeElement: null,
    body: el(), documentElement: el(), querySelector: () => el(), querySelectorAll: () => [], getElementById: () => null, createElement: el
  };
  const ctx = {
    console, Math, Number, String, JSON, Date, Intl, Object, Array, Map, Set, isFinite, isNaN, parseInt, parseFloat, encodeURIComponent, decodeURIComponent,
    document, navigator: { language: 'id-ID', userAgent: 'node', platform: 'node', maxTouchPoints: 0 },
    location: { hash: '', protocol: 'http:' },
    localStorage: { getItem: (k) => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = String(v); }, removeItem: (k) => { delete mem[k]; } },
    matchMedia: () => ({ matches: false }), requestAnimationFrame: noop, setTimeout: (f) => 0, clearTimeout: noop,
    addEventListener: noop, scrollTo: noop
  };
  ctx.window = ctx;
  vm.createContext(ctx);
  scripts.forEach((src) => {
    const file = path.join(ROOT, src);
    if (process.env.LC_PARTIAL && !fs.existsSync(file)) return; // saat pengembangan: lewati kalkulator yang belum dibuat
    assert.ok(fs.existsSync(file), 'file ada: ' + src);
    vm.runInContext(fs.readFileSync(file, 'utf8'), ctx, { filename: src });
  });
  return ctx;
}
const run = (ctx, code) => vm.runInContext(code, ctx);

test('semua script termuat tanpa error & 12 kalkulator terdaftar di grupnya', () => {
  const ctx = makeApp();
  const ids = run(ctx, 'Object.keys(CALCS)');
  const grouped = run(ctx, 'GROUPS.flatMap((g) => g.calcs)');
  if (!process.env.LC_PARTIAL) assert.deepEqual([...ids].sort(), [...grouped].sort(), 'setiap kalkulator di GROUPS terdaftar');
  if (!process.env.LC_PARTIAL) assert.equal(grouped.length, 12);
  run(ctx, 'Object.values(CALCS).forEach((d) => { ["title", "short", "sub"].forEach((k) => { if (t(d[k]) === d[k]) throw new Error(d.id + ": teks " + k + " belum ada"); }); })');
  run(ctx, 'Object.values(CALCS).forEach((d) => { if (!ICONS[d.icon]) throw new Error(d.id + ": ikon tidak ada"); })');
});

test('setiap layar & ringkasan Beranda tergambar di ID/EN, gelap, privacy', () => {
  const ctx = makeApp();
  const views = run(ctx, 'Object.keys(VIEWS)');
  for (const lang of ['id', 'en']) {
    for (const privacy of [false, true]) {
      run(ctx, 'S.prefs.lang = ' + JSON.stringify(lang) + '; S.prefs.privacy = ' + privacy + '; S.prefs.theme = "dark";');
      for (const v of views) {
        const out = run(ctx, 'VIEWS[' + JSON.stringify(v) + ']()');
        assert.equal(typeof out, 'string', v);
        assert.ok(out.length > 200, v + ' tidak kosong');
        assert.ok(!/undefined|NaN|\[object Object\]/.test(out.replace(/data-[a-z-]+="[^"]*"/g, '')), v + ' (' + lang + ') tidak memuat undefined/NaN: ' +
          (out.match(/.{60}(undefined|NaN|\[object Object\]).{40}/) || [''])[0]);
        if (privacy) assert.ok(!/Rp \d{1,3}\.\d{3}/.test(out.replace(/value="[^"]*"/g, '').replace(/<option[^>]*>[^<]*<\/option>/g, '')), v + ': nominal tersembunyi saat privacy');
      }
      run(ctx, 'Object.keys(CALCS).forEach((id) => { const s = CALCS[id].summary(); if (!s || typeof s.value !== "string") throw new Error(id + ": summary"); })');
    }
  }
});

test('data-live unik & tanpa input di dalamnya', () => {
  const ctx = makeApp();
  for (const v of run(ctx, 'Object.keys(CALCS)')) {
    const out = run(ctx, 'VIEWS[' + JSON.stringify(v) + ']()');
    const names = [...out.matchAll(/data-live="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(new Set(names).size, names.length, v + ': data-live ganda ' + names.filter((n, i) => names.indexOf(n) !== i).join(','));
    // cari input di dalam blok data-live (perkiraan: tag pembuka s.d. penutup elemen yang sama tidak bisa diurai regex — cek bahwa
    // tidak ada data-m/data-n/data-s/data-r/data-x/data-d di antara data-live dan elemen sibling berikutnya pada hero)
    const heroBlock = (out.match(/data-live="hero"[\s\S]*?<\/section>/) || [''])[0];
    assert.ok(!/data-(m|n|s|r|x|d)="/.test(heroBlock), v + ': hero tanpa input');
  }
});

test('input kosong & ekstrem tidak membuat layar error', () => {
  const ctx = makeApp();
  const ids = run(ctx, 'Object.keys(CALCS)');
  const zero = (o) => Object.keys(o).forEach((k) => {
    if (typeof o[k] === 'number') o[k] = 0;
  });
  run(ctx, 'globalThis.__zero = ' + zero.toString());
  for (const id of ids) {
    run(ctx, '__zero(inp(' + JSON.stringify(id) + '))');
  }
  for (const id of ids) {
    assert.doesNotThrow(() => run(ctx, 'VIEWS[' + JSON.stringify(id) + ']()'), id + ' dengan semua angka 0');
    assert.doesNotThrow(() => run(ctx, 'CALCS[' + JSON.stringify(id) + '].summary()'), id + ' summary dengan angka 0');
  }
  assert.doesNotThrow(() => run(ctx, 'VIEWS.home()'));
  // nilai tersimpan rusak dibersihkan oleh sanitize/clean
  const ctx2 = makeApp();
  for (const id of run(ctx2, 'Object.keys(CALCS)')) {
    run(ctx2, 'localStorage.setItem("lc-' + id + '", JSON.stringify({ a: 1, gaji: "x", tawaran: "rusak", jenjang: 5 })); delete S.data[' + JSON.stringify(id) + '];');
    assert.doesNotThrow(() => run(ctx2, 'VIEWS[' + JSON.stringify(id) + ']()'), id + ' dengan data rusak');
  }
});
