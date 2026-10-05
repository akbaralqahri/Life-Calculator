'use strict';
/**
 * Logo & ikon aplikasi — dibuat dari blok LOGO di js/app.js (satu sumber untuk app dan ikon).
 *
 *   npm run icons
 *
 * Hasil di assets/icons/:
 *   favicon.svg            ikon tab browser (vektor)
 *   icon-192.png           ikon PWA / Android
 *   icon-512.png           ikon PWA besar & gambar pratinjau tautan
 *   icon-maskable-512.png  ikon Android adaptif (ubin penuh, isi diperkecil ke zona aman 80%)
 *   apple-touch-icon.png   180 px untuk "Tambah ke Layar Utama" di iPhone/iPad
 *
 * Tanpa dependensi: PNG digambar dengan anti-aliasing analitis (jarak titik piksel ke tepi
 * bentuk) lalu dikodekan dengan zlib bawaan Node — diadaptasi dari Habit Tracker.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const zlib = require('zlib');

const ROOT = path.join(__dirname, '..');
const APP = path.join(ROOT, 'js', 'app.js');
const OUT = path.join(ROOT, 'assets', 'icons');

const PNGS = [
  { file: 'icon-192.png', size: 192 },
  { file: 'icon-512.png', size: 512 },
  { file: 'icon-maskable-512.png', size: 512, square: true, scale: 0.78 },
  { file: 'apple-touch-icon.png', size: 180, square: true }
];

/** LOGO & logoSvg() dari js/app.js. */
function loadLogo() {
  const src = fs.readFileSync(APP, 'utf8');
  const m = /\/\* LOGO:BEGIN[\s\S]*?\*\/([\s\S]*?)\/\* LOGO:END \*\//.exec(src);
  if (!m) throw new Error('Blok LOGO:BEGIN … LOGO:END tidak ditemukan di js/app.js');
  const ctx = vm.createContext({});
  vm.runInContext(m[1] + '\nthis.LOGO = LOGO; this.logoSvg = logoSvg;', ctx);
  return { LOGO: ctx.LOGO, logoSvg: ctx.logoSvg };
}

function rgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
/** Jarak titik ke ruas garis. */
function segDist(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1, dy = y2 - y1;
  const len2 = dx * dx + dy * dy;
  const k = len2 ? clamp01(((px - x1) * dx + (py - y1) * dy) / len2) : 0;
  return Math.hypot(px - (x1 + k * dx), py - (y1 + k * dy));
}

/** Piksel RGBA size×size. Cakupan tepi = 0,5 − jarak bertanda (px). */
function render(LOGO, size, square, scale) {
  const s = size / 100, k = scale || 1;
  const tile = rgb(LOGO.tile);
  const h = size / 2, rx = square ? 0 : LOGO.rx * s;
  const half = LOGO.w * k * s / 2;
  const P = (v) => (50 + (v - 50) * k) * s;
  const segs = [];
  LOGO.glyphs.forEach((g) => g.segs.forEach((q) => segs.push({ x1: P(q[0]), y1: P(q[1]), x2: P(q[2]), y2: P(q[3]), c: rgb(LOGO[g.c]) })));
  const px = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const X = x + 0.5, Y = y + 0.5;
      let cover = 1;
      if (rx > 0) {
        const qx = Math.abs(X - h) - (h - rx), qy = Math.abs(Y - h) - (h - rx);
        cover = clamp01(0.5 - (Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - rx));
      }
      const c = tile.slice();
      for (const g of segs) {
        const a = clamp01(0.5 - (segDist(X, Y, g.x1, g.y1, g.x2, g.y2) - half));
        if (a > 0) for (let i = 0; i < 3; i++) c[i] = c[i] * (1 - a) + g.c[i] * a;
      }
      const o = (y * size + x) * 4;
      px[o] = Math.round(c[0]); px[o + 1] = Math.round(c[1]); px[o + 2] = Math.round(c[2]);
      px[o + 3] = Math.round(cover * 255);
    }
  }
  return px;
}

// ---- PNG (RGBA 8-bit, filter 0) ----
const CRC = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();
function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC[(c ^ buf[i]) & 255] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}
function chunk(type, data) {
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, 'ascii');
  data.copy(out, 8);
  out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length);
  return out;
}
function encodePng(px, size) {
  const stride = size * 4;
  const raw = Buffer.alloc((stride + 1) * size); // byte filter tiap baris = 0
  for (let y = 0; y < size; y++) px.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))
  ]);
}
/** Kebalikan encodePng (hanya format yang ditulis skrip ini) — dipakai tes. */
function decodePng(buf) {
  let off = 8, w = 0, h = 0;
  const idat = [];
  while (off < buf.length) {
    const len = buf.readUInt32BE(off), type = buf.toString('ascii', off + 4, off + 8);
    const data = buf.subarray(off + 8, off + 8 + len);
    if (type === 'IHDR') { w = data.readUInt32BE(0); h = data.readUInt32BE(4); }
    if (type === 'IDAT') idat.push(data);
    off += 12 + len;
  }
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const px = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    const at = y * (w * 4 + 1);
    if (raw[at] !== 0) throw new Error('Filter PNG baris ' + y + ' tidak didukung');
    raw.copy(px, y * w * 4, at + 1, at + 1 + w * 4);
  }
  return { w, h, px };
}

function svgFile(logoSvg) {
  return '<?xml version="1.0" encoding="UTF-8"?>\n' + logoSvg(512)
    .replace(' class="logo"', '').replace(' class="logo-tile"', '')
    .replace(' aria-hidden="true">', ' role="img" aria-label="Life Calculator"><title>Life Calculator</title>') + '\n';
}

function main() {
  const { LOGO, logoSvg } = loadLogo();
  fs.mkdirSync(OUT, { recursive: true });
  const rows = [];
  for (const f of PNGS) {
    const png = encodePng(render(LOGO, f.size, f.square, f.scale), f.size);
    fs.writeFileSync(path.join(OUT, f.file), png);
    rows.push([f.file, f.size + '×' + f.size, png.length]);
  }
  const svg = svgFile(logoSvg);
  fs.writeFileSync(path.join(OUT, 'favicon.svg'), svg);
  rows.push(['favicon.svg', 'vektor', Buffer.byteLength(svg)]);
  console.log('Logo Life Calculator → assets/icons/');
  rows.forEach(([file, dim, bytes]) => console.log('  ' + file.padEnd(24) + dim.padEnd(10) + (bytes / 1024).toFixed(1) + ' KB'));
}

if (require.main === module) main();

module.exports = { PNGS, loadLogo, render, encodePng, decodePng, svgFile };
