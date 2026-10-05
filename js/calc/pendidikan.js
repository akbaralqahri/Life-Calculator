'use strict';
/* =====================================================================
 * Rencana → Dana Pendidikan Anak.
 * Biaya tiap jenjang (TK–S1) naik mengikuti inflasi pendidikan; setoran bulanan per jenjang
 * dari sekarang sampai jenjang itu dimulai. Rumus di js/engine/pendidikan.js.
 * ===================================================================== */

Object.assign(I18N.id, {
  eduTitle: 'Dana Pendidikan Anak', eduShort: 'Pendidikan', eduSub: 'Berapa yang perlu ditabung untuk sekolah anak?',
  eduHero: 'Total setoran per bulan · semua jenjang', eduHeroFor: 'Total setoran per bulan untuk {name}',
  eduNeedTotal: 'Total dana masa depan', eduNearest: 'Jenjang terdekat', eduNearestV: '{lv} · {d}', eduNow: 'tahun ini',
  eduLumpNow: 'Perlu siap sekarang (lump sum)', eduSurplus: 'Sisa dana yang ada', eduNoActive: 'Tidak ada jenjang yang perlu ditabung',
  eduChild: 'Data anak & asumsi', eduNameL: 'Nama anak (opsional)', eduAgeL: 'Usia anak sekarang', eduFundL: 'Dana pendidikan yang sudah ada',
  eduFundHint: 'Dialokasikan ke jenjang terdekat dulu dan ikut tumbuh dengan return investasi.',
  eduInflL: 'Inflasi pendidikan', eduInflHint: 'Uang pangkal sekolah swasta naik ±10–15% / thn.', eduRetL: 'Return investasi', eduRetHint: 'Perkiraan, mis. reksa dana campuran ±8% / thn.',
  eduFullL: 'Siapkan seluruh biaya jenjang', eduFullSub: 'Mati: uang pangkal + biaya tahun pertama. Nyala: uang pangkal + semua biaya tahunan jenjang itu.',
  eduLevels: 'Jenjang & biaya', eduLevelsHint: 'Contoh sekolah swasta menengah di kota besar (2025/2026) — sesuaikan dengan sekolah incaran.',
  eduLvSub: 'Masuk usia {a} · {n} thn · pangkal {p} · {y}/thn', eduEdit: 'Ubah usia & biaya {lv}',
  eduEntryL: 'Usia masuk', eduLamaL: 'Lama', eduPangkalL: 'Uang pangkal / biaya masuk (hari ini)', eduYearlyL: 'Biaya per tahun (hari ini)',
  eduYearlyHint: 'SPP × 12 + kegiatan, buku, seragam. Kuliah: UKT × 2 semester.',
  eduLv: { tk: 'TK', sd: 'SD', smp: 'SMP', sma: 'SMA', s1: 'Kuliah S1' },
  eduInYears: '{n} tahun lagi', eduEntryAt: 'Masuk usia {a} · {d}',
  eduRowPangkal: 'Uang pangkal saat masuk', eduRowYear1: 'Biaya tahun pertama', eduRowAll: 'Biaya {n} tahun (naik inflasi)',
  eduRowNeed: 'Dana perlu siap saat masuk', eduRowAlloc: 'Ditutup dana yang ada (nilai hari ini {rp})', eduRowRemain: 'Sisa yang perlu dikumpulkan',
  eduRowMonthly: 'Setoran per bulan ({n} bulan)', eduRowLump: 'Siapkan sekarang (lump sum)', eduCovered: 'Tertutup dana yang ada',
  eduPillNow: 'Masuk tahun ini', eduPillFuture: '{rp}/bln', eduOther: 'Jenjang lain',
  eduPast: 'Sudah lewat', eduOngoing: 'Sedang berjalan · ±{rp}/thn dibayar dari arus kas', eduOff: 'Tidak aktif',
  eduChart: 'Setoran per bulan menurut usia anak', eduChartSub: 'Setoran tiap jenjang berhenti saat jenjang itu dimulai, jadi bebannya menurun.', eduChartX: 'Sumbu X: usia anak (tahun)',
  eduSumNone: 'Tidak ada jenjang aktif', eduSumNear: 'Terdekat: {lv} · {d}',
  eduNote: 'Estimasi edukatif — bukan saran keuangan. Asumsi: usia dihitung dalam tahun penuh, jenjang dimulai tepat (usia masuk − usia sekarang) × 12 bulan lagi; ' +
    'dana perlu siap = uang pangkal + biaya tahun pertama pada saat masuk (atau seluruh biaya jenjang, dijumlah tanpa diskonto — konservatif); setoran di akhir bulan dengan bunga majemuk (1 + r)^(1/12) − 1, berhenti saat jenjang dimulai; ' +
    'jenjang yang sedang berjalan tidak ditabung (biayanya dari arus kas). Inflasi pendidikan bawaan 10% / thn: uang pangkal sekolah swasta naik ±10–15% / thn (data BPS yang dikutip media, 2024–2025), ' +
    'jauh di atas inflasi kelompok pendidikan IHK (±2–3% / thn, didominasi sekolah negeri). Biaya bawaan adalah contoh sekolah swasta menengah di kota besar: ' +
    'TK pangkal Rp10 jt + Rp1 jt/bln; SD Rp20 jt + Rp1,5 jt/bln; SMP Rp25 jt + Rp2 jt/bln; SMA Rp30 jt + Rp2,5 jt/bln; S1 swasta Rp40 jt + UKT Rp15 jt/semester ' +
    '(kisaran dari Kontan/MomsMoney 2025 dan daftar biaya SD–SMP swasta Jakarta 2025/2026, mis. pangkal SD Rp9–38 jt, SPP Rp0,7–2,4 jt/bln). Sekolah negeri umumnya jauh lebih murah.'
});
Object.assign(I18N.en, {
  eduTitle: 'Education Fund', eduShort: 'Education', eduSub: "How much to save for your child's schooling?",
  eduHero: 'Total monthly saving · all levels', eduHeroFor: 'Total monthly saving for {name}',
  eduNeedTotal: 'Total future cost', eduNearest: 'Next level', eduNearestV: '{lv} · {d}', eduNow: 'this year',
  eduLumpNow: 'Needed now (lump sum)', eduSurplus: 'Unallocated savings', eduNoActive: 'No school level left to save for',
  eduChild: 'Child & assumptions', eduNameL: "Child's name (optional)", eduAgeL: "Child's age now", eduFundL: 'Education savings so far',
  eduFundHint: 'Allocated to the nearest level first; it grows with the investment return.',
  eduInflL: 'Education inflation', eduInflHint: 'Private school entry fees rise ~10–15% / yr.', eduRetL: 'Investment return', eduRetHint: 'An estimate, e.g. ~8% / yr for a balanced fund.',
  eduFullL: 'Prepare the whole level up front', eduFullSub: 'Off: entry fee + first-year cost. On: entry fee + every yearly cost of that level.',
  eduLevels: 'School levels & costs', eduLevelsHint: 'Example mid-range private schools in a big city (2025/2026) — adjust to your chosen school.',
  eduLvSub: 'Starts at {a} · {n} yrs · entry {p} · {y}/yr', eduEdit: 'Edit {lv} age & costs',
  eduEntryL: 'Starting age', eduLamaL: 'Length', eduPangkalL: "Entry fee (today's cost)", eduYearlyL: "Cost per year (today's cost)",
  eduYearlyHint: 'Tuition × 12 + activities, books, uniforms. University: fee × 2 semesters.',
  eduLv: { tk: 'Kindergarten', sd: 'Primary', smp: 'Junior high', sma: 'Senior high', s1: "Bachelor's" },
  eduInYears: 'in {n} years', eduEntryAt: 'Starts at {a} · {d}',
  eduRowPangkal: 'Entry fee at start', eduRowYear1: 'First-year cost', eduRowAll: '{n}-year cost (with inflation)',
  eduRowNeed: 'Needed at the start', eduRowAlloc: 'Covered by savings (today {rp})', eduRowRemain: 'Left to build up',
  eduRowMonthly: 'Monthly saving ({n} months)', eduRowLump: 'Needed now (lump sum)', eduCovered: 'Covered by savings',
  eduPillNow: 'Starts this year', eduPillFuture: '{rp}/mo', eduOther: 'Other levels',
  eduPast: 'Already done', eduOngoing: 'In progress · ~{rp}/yr paid from cash flow', eduOff: 'Not included',
  eduChart: "Monthly saving by child's age", eduChartSub: 'Saving for each level stops when it starts, so the load goes down.', eduChartX: "X axis: child's age (years)",
  eduSumNone: 'No active school level', eduSumNear: 'Next: {lv} · {d}',
  eduNote: 'An educational estimate — not financial advice. Assumptions: age in whole years, each level starts exactly (starting age − current age) × 12 months from now; ' +
    'needed at start = entry fee + first-year cost at that time (or the whole level, summed without discounting — conservative); end-of-month saving with (1 + r)^(1/12) − 1 compounding, stopping when the level starts; ' +
    'levels in progress are not saved for (paid from cash flow). Default education inflation 10% / yr: private school entry fees rise ~10–15% / yr (BPS figures cited by media, 2024–2025), ' +
    'far above the CPI education group (~2–3% / yr, dominated by public schools). Default costs are examples for mid-range private schools in a big city: ' +
    'kindergarten Rp10M entry + Rp1M/mo; primary Rp20M + Rp1.5M/mo; junior high Rp25M + Rp2M/mo; senior high Rp30M + Rp2.5M/mo; private university Rp40M + Rp15M/semester ' +
    '(ranges from Kontan/MomsMoney 2025 and Jakarta private school fee lists 2025/2026, e.g. primary entry Rp9–38M, tuition Rp0.7–2.4M/mo). Public schools are usually far cheaper.'
});

/** Jenjang bawaan (contoh sekolah swasta menengah di kota besar, nilai hari ini). */
const EDU_LEVELS = [
  { key: 'tk', on: true, usia: 4, pangkal: 10000000, tahunan: 12000000, lama: 2 },
  { key: 'sd', on: true, usia: 6, pangkal: 20000000, tahunan: 18000000, lama: 6 },
  { key: 'smp', on: true, usia: 12, pangkal: 25000000, tahunan: 24000000, lama: 3 },
  { key: 'sma', on: true, usia: 15, pangkal: 30000000, tahunan: 30000000, lama: 3 },
  { key: 's1', on: true, usia: 18, pangkal: 40000000, tahunan: 30000000, lama: 4 }
];
const EDU_MAX_RP = 999999999999999;

calc({
  id: 'pendidikan', icon: 'graduation', color: '#4b55c9', title: 'eduTitle', short: 'eduShort', sub: 'eduSub',
  defaults: { nama: '', usia: 2, inflasi: 10, ret: 8, dana: 0, full: false, jenjang: EDU_LEVELS },
  ui: { edit: '' },
  clean(o) {
    o.usia = clamp(Math.round(o.usia), 0, 25);
    o.inflasi = clamp(o.inflasi, 0, 30);
    o.ret = clamp(o.ret, 0, 30);
    o.dana = clamp(Math.round(o.dana), 0, EDU_MAX_RP);
    // daftar jenjang selalu 5 item berurutan; data tersimpan yang rusak diganti bawaan
    o.jenjang = EDU_LEVELS.map((d, i) => {
      const x = o.jenjang[i];
      if (!x || typeof x !== 'object' || x.key !== d.key) return Object.assign({}, d);
      const n = (v, dv) => (typeof v === 'number' && isFinite(v) ? v : dv);
      return {
        key: d.key, on: x.on === undefined ? d.on : !!x.on,
        usia: clamp(Math.round(n(x.usia, d.usia)), 2, 25),
        pangkal: clamp(Math.round(n(x.pangkal, d.pangkal)), 0, EDU_MAX_RP),
        tahunan: clamp(Math.round(n(x.tahunan, d.tahunan)), 0, EDU_MAX_RP),
        lama: clamp(Math.round(n(x.lama, d.lama)), 1, 8)
      };
    });
    return o;
  },
  view: pendidikanView,
  summary() {
    const P = eduPlan(inp('pendidikan'));
    if (!P.active.length) return { value: '–', sub: t('eduSumNone') };
    return { value: rp(P.monthly) + ' ' + t('perMonthShort'), sub: t('eduSumNear', { lv: eduLvName(P.nearest.key), d: eduWhen(P.nearest) }) };
  }
});

Object.assign(ACT, {
  /** Buka/tutup editor biaya satu jenjang. */
  pendidikanEdit: (b) => { const u = ui('pendidikan'); u.edit = u.edit === b.dataset.v ? '' : b.dataset.v; render(); }
});

function eduLvName(key) { return (L('eduLv') || {})[key] || key; }
function eduWhen(x) { return x.yearsTo > 0 ? t('eduInYears', { n: x.yearsTo }) : t('eduNow'); }

function eduHeroHtml(s, P) {
  const name = String(s.nama || '').trim();
  return '<span class="lbl">' + esc(name ? t('eduHeroFor', { name: name }) : t('eduHero')) + '</span><span class="big">' + esc(rp(P.monthly)) + ' <small>' + esc(t('perMonthShort')) + '</small></span>' +
    heroCells([[t('eduNeedTotal'), esc(rp(P.needTotal))], [t('eduNearest'), P.nearest ? esc(t('eduNearestV', { lv: eduLvName(P.nearest.key), d: eduWhen(P.nearest) })) : '–']]) +
    (P.lumpNow > 0 ? heroLine(esc(t('eduLumpNow')), esc(rp(P.lumpNow))) : '') +
    (P.surplus > 0.5 ? heroLine(esc(t('eduSurplus')), esc(rp(P.surplus))) : '') +
    (!P.active.length ? heroLine(esc(t('eduNoActive'))) : '');
}
/** Kartu hasil satu jenjang aktif. */
function eduLevelCard(s, x) {
  const lv = s.jenjang[x.idx];
  const pill = x.remaining <= 0 ? '<span class="fire-pill ok">' + esc(t('eduCovered')) + '</span>'
    : x.status === 'now' ? '<span class="fire-pill under">' + esc(t('eduPillNow')) + '</span>'
    : '<span class="fire-pill ok">' + esc(t('eduPillFuture', { rp: rp(x.monthly) })) + '</span>';
  const yearsCost = x.need - x.entryFut;
  let rows = row(t('eduRowPangkal'), esc(rp(x.entryFut))) +
    row(s.full ? t('eduRowAll', { n: lv.lama }) : t('eduRowYear1'), esc(rp(yearsCost))) +
    row(t('eduRowNeed'), esc(rp(x.need)), 'total');
  if (x.alloc > 0) rows += row(t('eduRowAlloc', { rp: rp(x.alloc) }), '− ' + esc(rp(x.need - x.remaining)), 'neg') + row(t('eduRowRemain'), esc(rp(x.remaining)));
  if (x.remaining > 0) rows += x.months > 0 ? row(t('eduRowMonthly', { n: x.months }), esc(rp(x.monthly)), 'total') : row(t('eduRowLump'), esc(rp(x.lump)), 'total');
  return '<section class="card" style="order:4"><div class="card-title" style="margin-bottom:2px"><span>' + esc(eduLvName(x.key)) + '</span>' + pill + '</div>' +
    '<p class="hint">' + esc(t('eduEntryAt', { a: x.entry, d: eduWhen(x) })) + '</p><div class="rows" style="margin-top:6px">' + rows + '</div></section>';
}
/** Jenjang yang tidak ditabung: lewat, sedang berjalan, tidak aktif. */
function eduOtherCard(P) {
  const rest = P.levels.filter((x) => x.status === 'past' || x.status === 'ongoing' || x.status === 'off');
  if (!rest.length) return '';
  return card(t('eduOther'), '<div class="fire-sc" style="margin-top:0">' + rest.map((x) =>
    '<div><span><b>' + esc(eduLvName(x.key)) + '</b><small>' + esc(t('eduEntryAt', { a: x.entry, d: t('yearsN', { n: x.lama }) })) + '</small></span>' +
    '<b class="' + (x.status === 'ongoing' ? 'ok' : '') + '" style="font-weight:700;color:var(--dim)">' + esc(x.status === 'past' ? t('eduPast') : x.status === 'off' ? t('eduOff') : t('eduOngoing', { rp: rp(x.yearlyFut) })) + '</b></div>').join('') + '</div>', { order: 4 });
}
function eduChartHtml(s, P) {
  if (!P.active.length) return '';
  const sch = eduSchedule(P, s.usia);
  if (sch.length < 2) return '';
  return card(t('eduChart'), '<p class="hint">' + esc(t('eduChartSub')) + '</p>' +
    lineChart([{ name: t('eduChart'), color: '#4b55c9', width: 3, area: true, data: sch.map((d) => ({ x: d.age, v: d.v })) }], t('eduChart')) +
    '<p class="hint" style="margin-top:6px">' + esc(t('eduChartX')) + '</p>', { order: 5 });
}
/** Editor jenjang: sakelar aktif + (bila dibuka) usia masuk, lama, uang pangkal, biaya per tahun. */
function eduLevelsCard(s) {
  const open = ui('pendidikan').edit;
  const yr = en() ? 'yrs' : 'tahun';
  let h = '<p class="hint" style="margin-bottom:4px">' + esc(t('eduLevelsHint')) + '</p>';
  s.jenjang.forEach((lv, i) => {
    const p = 'pendidikan.jenjang.' + i + '.';
    const name = eduLvName(lv.key);
    h += fToggle(p + 'on', name, esc(t('eduLvSub', { a: lv.usia, n: lv.lama, p: compactRp(lv.pangkal), y: compactRp(lv.tahunan) })), { live: 'eduLvSub' + i });
    if (!lv.on) return;
    const isOpen = open === lv.key;
    h += '<button type="button" class="disclose link-btn" data-act="pendidikanEdit" data-v="' + lv.key + '" aria-expanded="' + isOpen + '" style="padding:0;min-height:40px;margin-top:-6px">' +
      '<span>' + esc(t('eduEdit', { lv: name })) + '</span>' + ic('chevD', 18) + '</button>';
    if (isOpen) {
      h += '<div style="padding-bottom:12px"><div class="row2">' + fNum(p + 'usia', t('eduEntryL'), { min: 2, max: 25, suffix: yr }) + fNum(p + 'lama', t('eduLamaL'), { min: 1, max: 8, suffix: yr }) + '</div>' +
        fMoney(p + 'pangkal', t('eduPangkalL')) + fMoney(p + 'tahunan', t('eduYearlyL'), { hint: esc(t('eduYearlyHint')) }) + '</div>';
    }
  });
  return card(t('eduLevels'), h, { order: 3 });
}

function pendidikanView() {
  const s = inp('pendidikan');
  const P = eduPlan(s);
  const pct = '% / ' + (en() ? 'yr' : 'thn');
  const top = hero(eduHeroHtml(s, P), { order: 1, label: t('eduHero') });
  const child = card(t('eduChild'), fText('pendidikan.nama', t('eduNameL'), { max: 30 }) +
    fNum('pendidikan.usia', t('eduAgeL'), { min: 0, max: 25, suffix: en() ? 'yrs' : 'tahun' }) +
    fMoney('pendidikan.dana', t('eduFundL'), { hint: esc(t('eduFundHint')) }) +
    '<div class="row2">' + fNum('pendidikan.inflasi', t('eduInflL'), { min: 0, max: 30, dec: true, suffix: pct }) + fNum('pendidikan.ret', t('eduRetL'), { min: 0, max: 30, dec: true, suffix: pct }) + '</div>' +
    '<p class="hint" style="margin-top:6px">' + esc(t('eduInflHint') + ' ' + t('eduRetHint')) + '</p>' +
    '<div style="margin-top:10px">' + fToggle('pendidikan.full', t('eduFullL'), esc(t('eduFullSub'))) + '</div>', { order: 2, tight: true });
  // hasil per jenjang dibungkus satu data-live (display:contents agar tetap ikut urutan kolom)
  const results = '<div data-live="eduRes" style="display:contents">' + P.active.slice().sort((a, b) => a.entry - b.entry || a.idx - b.idx).map((x) => eduLevelCard(s, x)).join('') +
    eduOtherCard(P) + '</div>';
  const chart = '<div data-live="eduChart" style="display:contents">' + eduChartHtml(s, P) + '</div>';
  return cols(top, results + chart, child + eduLevelsCard(s), note(esc(t('eduNote')), 7));
}
