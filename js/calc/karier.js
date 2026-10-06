'use strict';
/* =====================================================================
 * Karier: Gaji Bersih, Nilai Waktu, Bandingkan (2 tawaran kerja).
 * Tampilan diambil dari Habit Tracker → Kalkulator; rumus di js/engine/karier.js.
 * ===================================================================== */

// Teks dari Habit Tracker (Kalkulator → Gaji Bersih, Nilai Waktu, Upah Minimum, Bandingkan)
Object.assign(I18N.id, {
  calcTitle: 'Kalkulator', calcSub: 'Aturan {y} · PPh 21 TER & BPJS', tabNet: 'Gaji Bersih', tabTime: 'Nilai Waktu',
  netMonthly: 'Gaji bersih per bulan · Jan–Nov', december: 'Desember (penyesuaian)', thrMonth: 'Bulan THR / bonus', yearly: 'Total setahun',
  where: 'Ke mana gaji kotormu', received: 'Diterima', pphL: 'PPh 21', bpjsL: 'Iuran BPJS', dataGaji: 'Data gaji',
  basic: 'Gaji pokok / bulan', allowance: 'Tunjangan tetap / bulan', ptkpL: 'Status PTKP',
  ptkpOpt: { 'TK/0': 'TK/0 · Lajang, tanpa tanggungan', 'TK/1': 'TK/1 · Lajang, 1 tanggungan', 'TK/2': 'TK/2 · Lajang, 2 tanggungan', 'TK/3': 'TK/3 · Lajang, 3 tanggungan',
    'K/0': 'K/0 · Menikah, tanpa tanggungan', 'K/1': 'K/1 · Menikah, 1 tanggungan', 'K/2': 'K/2 · Menikah, 2 tanggungan', 'K/3': 'K/3 · Menikah, 3 tanggungan' },
  kesL: 'BPJS Kesehatan', kesSub: '{p}% dari gaji, maks. upah {cap}', jhtL: 'Jaminan Hari Tua', jhtSub: '{p}% dari gaji', jpL: 'Jaminan Pensiun', jpSub: '{p}%, maks. upah {cap}',
  advanced: 'Opsi lanjutan', irregular: 'Tunjangan tidak tetap / bulan', irregularHint: 'Lembur, insentif, dll. Tidak menambah dasar iuran BPJS.',
  thrL: 'THR / bonus setahun', thrHint: 'Dihitung sebagai satu bulan dengan tarif TER yang lebih tinggi.', jkkL: 'Tingkat risiko kerja (JKK)',
  jkkOpt: { SANGAT_RENDAH: 'Sangat rendah', RENDAH: 'Rendah', SEDANG: 'Sedang', TINGGI: 'Tinggi', SANGAT_TINGGI: 'Sangat tinggi' },
  dtpL: 'Insentif PPh 21 DTP 2026', dtpSub: 'Sektor alas kaki, tekstil, furnitur, kulit & pariwisata · bruto ≤ {cap}',
  breakdown: 'Rincian per bulan', payPlus: 'Gaji pokok + tunjangan', irregularLine: 'Tunjangan tidak tetap', premiLine: 'Premi BPJS dibayar kantor',
  brutoLine: 'Bruto PPh 21', terLine: 'Tarif TER kategori {k}', pphLine: 'PPh 21', dtpLine: 'PPh 21 (ditanggung pemerintah)',
  kesLine: 'BPJS Kesehatan ({p}%)', jhtLine: 'JHT ({p}%)', jpLine: 'Jaminan Pensiun ({p}%)', netLine: 'Gaji bersih',
  yearTitle: 'Rincian setahun (dasar Desember)', yBruto: 'Bruto setahun', yBj: 'Biaya jabatan', yIuran: 'Iuran JHT & JP', yNeto: 'Penghasilan neto',
  yPtkp: 'PTKP', yPkp: 'Penghasilan kena pajak', yPph: 'PPh 21 setahun (Pasal 17)', yPaid: 'Sudah dipotong Jan–Nov', yDec: 'PPh 21 Desember',
  employer: 'Biaya yang ditanggung perusahaan', empKes: 'BPJS Kesehatan ({p}%)', empJht: 'JHT ({p}%)', empJp: 'Jaminan Pensiun ({p}%)', empJkk: 'JKK ({p}%)',
  empJkm: 'JKM ({p}%)', empTotal: 'Total iuran perusahaan', companyCost: 'Total biaya perusahaan / bulan',
  calcNote: 'Estimasi berdasarkan PP 58/2023 (TER) dan iuran BPJS {y}. Desember dihitung ulang dengan tarif Pasal 17, jadi potongannya bisa berbeda.',
  valueTime: 'Nilai waktumu', perHour: '/ jam', perMin: 'Per menit', perWorkday: 'Per hari kerja', avgNet: 'Gaji bersih rata-rata / bulan',
  fromNet: 'dari tab Gaji Bersih', hoursDay: 'Jam kerja per hari', daysWeek: 'Hari kerja per minggu', nHours: '{n} jam', nDaysW: '{n} hari',
  priceTitle: 'Harga dalam jam kerja', priceLabel: 'Harga barang yang ingin dibeli', priceRes: '≈ {h} jam kerja', priceDays: 'atau {d} hari kerja',
});
Object.assign(I18N.en, {
  calcTitle: 'Calculator', calcSub: '{y} rules · PPh 21 TER & BPJS', tabNet: 'Net Salary', tabTime: 'Time Value',
  netMonthly: 'Net salary per month · Jan–Nov', december: 'December (true-up)', thrMonth: 'THR / bonus month', yearly: 'Yearly total',
  where: 'Where your gross pay goes', received: 'Take-home', pphL: 'PPh 21', bpjsL: 'BPJS contributions', dataGaji: 'Salary details',
  basic: 'Base salary / month', allowance: 'Fixed allowance / month', ptkpL: 'PTKP status',
  ptkpOpt: { 'TK/0': 'TK/0 · Single, no dependants', 'TK/1': 'TK/1 · Single, 1 dependant', 'TK/2': 'TK/2 · Single, 2 dependants', 'TK/3': 'TK/3 · Single, 3 dependants',
    'K/0': 'K/0 · Married, no dependants', 'K/1': 'K/1 · Married, 1 dependant', 'K/2': 'K/2 · Married, 2 dependants', 'K/3': 'K/3 · Married, 3 dependants' },
  kesL: 'BPJS Health', kesSub: '{p}% of salary, wage cap {cap}', jhtL: 'Old-age savings (JHT)', jhtSub: '{p}% of salary', jpL: 'Pension (JP)', jpSub: '{p}%, wage cap {cap}',
  advanced: 'Advanced options', irregular: 'Variable allowance / month', irregularHint: "Overtime, incentives, etc. Doesn't raise the BPJS base.",
  thrL: 'THR / annual bonus', thrHint: 'Counted as one month with a higher TER rate.', jkkL: 'Work risk level (JKK)',
  jkkOpt: { SANGAT_RENDAH: 'Very low', RENDAH: 'Low', SEDANG: 'Medium', TINGGI: 'High', SANGAT_TINGGI: 'Very high' },
  dtpL: '2026 PPh 21 DTP incentive', dtpSub: 'Footwear, textile, furniture, leather & tourism · gross ≤ {cap}',
  breakdown: 'Monthly breakdown', payPlus: 'Base salary + allowance', irregularLine: 'Variable allowance', premiLine: 'Employer-paid premiums',
  brutoLine: 'PPh 21 gross', terLine: 'TER rate, category {k}', pphLine: 'PPh 21', dtpLine: 'PPh 21 (government-borne)',
  kesLine: 'BPJS Health ({p}%)', jhtLine: 'JHT ({p}%)', jpLine: 'Pension ({p}%)', netLine: 'Net salary',
  yearTitle: 'Yearly breakdown (December basis)', yBruto: 'Yearly gross', yBj: 'Job expense deduction', yIuran: 'JHT & JP contributions', yNeto: 'Net income',
  yPtkp: 'PTKP', yPkp: 'Taxable income', yPph: 'Yearly PPh 21 (Art. 17)', yPaid: 'Withheld Jan–Nov', yDec: 'December PPh 21',
  employer: 'Employer cost', empKes: 'BPJS Health ({p}%)', empJht: 'JHT ({p}%)', empJp: 'Pension ({p}%)', empJkk: 'JKK ({p}%)',
  empJkm: 'JKM ({p}%)', empTotal: 'Total employer contributions', companyCost: 'Total cost to company / month',
  calcNote: 'Estimate based on PP 58/2023 (TER) and {y} BPJS rates. December is recalculated with Article 17 rates, so its deduction can differ.',
  valueTime: 'Your time is worth', perHour: '/ hour', perMin: 'Per minute', perWorkday: 'Per workday', avgNet: 'Average net salary / month',
  fromNet: 'from the Net Salary tab', hoursDay: 'Work hours per day', daysWeek: 'Workdays per week', nHours: '{n} h', nDaysW: '{n} days',
  priceTitle: 'Price in work hours', priceLabel: 'Price of something you want', priceRes: '≈ {h} work hours', priceDays: 'or {d} workdays',
});
Object.assign(I18N.id, {
  tabCompare: 'Bandingkan', cmpSub: 'Dua tawaran kerja di kota berbeda',
  posTitle: 'Posisi gajimu', domicile: 'Domisili kerja', provL: 'Provinsi', regionL: 'Kabupaten/kota',
  pickProv: 'Pilih provinsi…', pickRegion: 'Pilih provinsi dulu', provOnly: 'Seluruh provinsi (UMP)',
  pickDomicileHint: 'Pilih provinsi dan kab/kota tempatmu bekerja untuk membandingkan upahmu dengan UMK/UMP {y}.',
  wageName: '{kind} {place} {y}', ofWage: 'dari {name}',
  stBelow: 'Di bawah {kind}', stAt: 'Sekitar {kind}', stAbove: 'Di atas {kind}',
  yourUpah: 'Upahmu (gaji pokok + tunjangan tetap)', wageDiff: 'Selisih',
  followsUmp: '{region} tidak menetapkan UMK {y}, jadi yang berlaku UMP {prov}.',
  rankLine: 'Upahmu ≥ upah minimum di {met} dari {total} kab/kota se-Indonesia',
  posNote: 'Dibandingkan dengan upah sebelum potongan, bukan gaji bersih. UMK/UMP berlaku untuk pekerja dengan masa kerja di bawah 1 tahun.',
  wageSrc: 'Data: keputusan gubernur {y}; sebagian dari kompilasi Nafkah & Panduan Warga (CC BY 4.0). ', wageSrcLink: 'Sumber {prov}',
  eqTitle: 'Setara di kota lain', eqTarget: 'Bandingkan dengan', eqNeedHome: 'Pilih domisili kerja dulu di kartu Posisi gajimu.',
  eqPick: 'Pilih kota tujuan untuk melihat perkiraan daya beli gajimu di sana.',
  eqResult: 'Gaji bersih {rp} di {from} setara ±{eq} di {to}', eqRatio: 'Rasio upah minimum {to} ÷ {from}: {x}×',
  eqNote: 'Perkiraan kasar dari rasio upah minimum, bukan survei biaya hidup.',
  timeWage: '{kind} {place}: {rp}/jam · 1 jam kerjamu setara {x} jam kerja bergaji {kind}',
  timeWageHint: 'Pilih domisili kerja di tab Gaji Bersih untuk membandingkan dengan upah minimum per jam.',
  offerA: 'Tawaran A', offerB: 'Tawaran B', offerName: 'Nama tawaran', offerCity: 'Kota kerja',
  cmpResult: 'Hasil perbandingan', cmpCity: 'Kota', cmpNet: 'Gaji bersih / bulan', cmpYear: 'Gaji bersih setahun',
  cmpMult: 'Kelipatan upah minimum', cmpEq: 'Setara di {city}',
  cmpSame: 'Gaji bersih kedua tawaran hampir sama.', cmpHigher: '{name} lebih besar {rp} per bulan ({p}%).',
  cmpEqWin: 'Setelah disetarakan dengan upah minimum {city}, {name} tetap unggul ±{rp} per bulan.',
  cmpEqFlip: 'Tapi setelah disetarakan dengan upah minimum {city}, justru {name} yang unggul ±{rp} per bulan.',
  cmpEqSame: 'Setelah disetarakan dengan upah minimum {city}, daya beli keduanya hampir sama.',
  cmpPickCity: 'Pilih kota kerja kedua tawaran untuk membandingkan daya belinya.',
  cmpNote: 'Status PTKP, BPJS, dan JKK mengikuti tab Gaji Bersih. THR dan tunjangan tidak tetap tidak dihitung.'
});
Object.assign(I18N.en, {
  tabCompare: 'Compare', cmpSub: 'Two job offers in different cities',
  posTitle: 'Where your pay stands', domicile: 'Work location', provL: 'Province', regionL: 'Regency/city',
  pickProv: 'Pick a province…', pickRegion: 'Pick a province first', provOnly: 'Whole province (UMP)',
  pickDomicileHint: 'Pick the province and regency/city where you work to compare your pay with the {y} UMK/UMP.',
  wageName: '{kind} {place} {y}', ofWage: 'of {name}',
  stBelow: 'Below {kind}', stAt: 'Around {kind}', stAbove: 'Above {kind}',
  yourUpah: 'Your wage (base + fixed allowance)', wageDiff: 'Difference',
  followsUmp: "{region} didn't set a {y} UMK, so the {prov} UMP applies.",
  rankLine: 'Your wage ≥ the minimum wage in {met} of {total} regencies/cities in Indonesia',
  posNote: 'Compared with your wage before deductions, not take-home pay. UMK/UMP applies to workers with less than 1 year of service.',
  wageSrc: 'Data: {y} governor decrees; partly from the Nafkah & Panduan Warga compilations (CC BY 4.0). ', wageSrcLink: '{prov} source',
  eqTitle: 'Equivalent in another city', eqTarget: 'Compare with', eqNeedHome: 'Pick your work location first in "Where your pay stands".',
  eqPick: 'Pick a city to estimate what your pay is worth there.',
  eqResult: 'Take-home {rp} in {from} ≈ {eq} in {to}', eqRatio: 'Minimum wage ratio {to} ÷ {from}: {x}×',
  eqNote: 'A rough estimate from the minimum wage ratio, not a cost-of-living survey.',
  timeWage: '{kind} {place}: {rp}/hour · 1 hour of your work = {x} hours at the {kind}',
  timeWageHint: 'Pick your work location in the Net Salary tab to compare with the hourly minimum wage.',
  offerA: 'Offer A', offerB: 'Offer B', offerName: 'Offer name', offerCity: 'Work city',
  cmpResult: 'Comparison', cmpCity: 'City', cmpNet: 'Take-home / month', cmpYear: 'Take-home / year',
  cmpMult: 'Minimum wage multiple', cmpEq: 'Equivalent in {city}',
  cmpSame: 'Both offers pay almost the same take-home.', cmpHigher: '{name} pays {rp} more per month ({p}%).',
  cmpEqWin: 'Adjusted to the {city} minimum wage, {name} still leads by ~{rp} per month.',
  cmpEqFlip: 'But adjusted to the {city} minimum wage, {name} actually leads by ~{rp} per month.',
  cmpEqSame: 'Adjusted to the {city} minimum wage, both have about the same buying power.',
  cmpPickCity: 'Pick the work city of both offers to compare buying power.',
  cmpNote: 'PTKP status, BPJS and JKK follow the Net Salary tab. THR and variable allowances are not included.'
});

Object.assign(I18N.id, {
  gajiTitle: 'Gaji Bersih', gajiShort: 'Gaji Bersih', gajiSub: () => 'Aturan ' + TARIF.config.TAHUN_ATURAN + ' · PPh 21 TER & BPJS',
  waktuTitle: 'Nilai Waktu', waktuShort: 'Nilai Waktu', waktuSub: 'Berapa nilai satu jam kerjamu',
  cmpTitle: 'Bandingkan Tawaran', cmpShort: 'Bandingkan',
  habitTitle: 'Biaya kebiasaan kecil', habitL: 'Pengeluaran per kebiasaan', habitHint: 'Kopi kekinian, jajan, rokok, ojek, langganan…',
  habitFreq: 'Seberapa sering', habitFreqOpt: [[7, 'Tiap hari'], [5, '5×/mgg'], [3, '3×/mgg'], [1, '1×/mgg']],
  habitYears: 'Jika diinvestasikan selama', habitRet: 'Return investasi', habitPerMonth: 'Per bulan', habitPerYear: 'Per tahun',
  habitHours: 'Setara {h} jam kerja setahun', habitHoursSub: '±{d} hari kerja hanya untuk kebiasaan ini',
  habitInvest: 'Bila disisihkan & diinvestasikan {n} tahun', habitInvestSub: 'Total disetor {paid} · hasil investasi {gain}',
  editInGaji: 'Ubah di Gaji Bersih', fromGajiBase: 'gaji pokok {g} + tunjangan {a}',
  manualOnly: 'Hanya dipakai di kalkulator ini — kalkulator lain tetap memakai Gaji Bersih ({rp}/bln).',
  offerOnly: 'Hanya untuk perbandingan — tidak mengubah data di Gaji Bersih.',
  needGajiTitle: 'Isi gajimu dulu', needGajiText: 'Kalkulator ini memakai gaji bersihmu. Isi gaji pokok di Gaji Bersih supaya hasil & grafiknya muncul.',
  needGajiBtn: 'Isi gaji sekarang', gajiEmptyLbl: 'Langkah pertama', gajiEmptyBig: 'Isi gaji pokokmu',
  gajiEmptyLine: 'Gaji bersih, grafik potongan, dan hitungan setahun langsung muncul setelah gaji diisi.', gajiEmptyBtn: 'Mulai isi gaji',
  gajiEmptyRes: 'Hasil & grafik tampil di sini', gajiEmptyResSub: 'Isi gaji pokok (dan tunjangan tetap bila ada) di kartu Data gaji.',
  startHere: 'Mulai di sini', gajiEmptyPos: 'Isi gaji dulu untuk melihat posisinya terhadap UMK/UMP.', gajiEmptyEq: 'Isi gaji dulu untuk melihat setaranya di kota tujuan.',
  sumGajiEmpty: 'Belum diisi', sumGajiEmptySub: 'Isi gaji untuk mulai',
  sumYear: 'Setahun {rp}', sumDay: '{rp} per hari kerja', sumCmpPick: 'Isi dua tawaran kerja', sumCmpWin: '{name} unggul {rp}/bln', sumCmpSame: 'Kedua tawaran hampir sama'
});
Object.assign(I18N.en, {
  gajiTitle: 'Net Salary', gajiShort: 'Net Salary', gajiSub: () => TARIF.config.TAHUN_ATURAN + ' rules · PPh 21 TER & BPJS',
  waktuTitle: 'Time Value', waktuShort: 'Time Value', waktuSub: 'What one hour of your work is worth',
  cmpTitle: 'Compare Offers', cmpShort: 'Compare',
  habitTitle: 'The cost of small habits', habitL: 'Spend per habit', habitHint: 'Fancy coffee, snacks, cigarettes, rides, subscriptions…',
  habitFreq: 'How often', habitFreqOpt: [[7, 'Daily'], [5, '5×/wk'], [3, '3×/wk'], [1, '1×/wk']],
  habitYears: 'If invested for', habitRet: 'Investment return', habitPerMonth: 'Per month', habitPerYear: 'Per year',
  habitHours: 'Worth {h} work hours a year', habitHoursSub: '~{d} workdays just for this habit',
  habitInvest: 'Set aside & invested for {n} years', habitInvestSub: 'You put in {paid} · investment growth {gain}',
  editInGaji: 'Edit in Net Salary', fromGajiBase: 'base {g} + allowance {a}',
  manualOnly: 'Used by this calculator only — the others keep using Net Salary ({rp}/mo).',
  offerOnly: 'For comparison only — this does not change your Net Salary details.',
  needGajiTitle: 'Enter your salary first', needGajiText: 'This calculator uses your net salary. Enter your base pay in Net Salary to see the results & charts.',
  needGajiBtn: 'Enter salary now', gajiEmptyLbl: 'First step', gajiEmptyBig: 'Enter your base pay',
  gajiEmptyLine: 'Net pay, the deductions chart and the yearly breakdown appear as soon as you enter it.', gajiEmptyBtn: 'Start entering',
  gajiEmptyRes: 'Results & charts show up here', gajiEmptyResSub: 'Enter your base pay (and fixed allowance, if any) in the Salary details card.',
  startHere: 'Start here', gajiEmptyPos: 'Enter your salary first to see how it compares to the UMK/UMP.', gajiEmptyEq: 'Enter your salary first to see its equivalent in the target city.',
  sumGajiEmpty: 'Not filled in', sumGajiEmptySub: 'Enter your salary to start',
  sumYear: '{rp} a year', sumDay: '{rp} per workday', sumCmpPick: 'Enter two job offers', sumCmpWin: '{name} leads by {rp}/mo', sumCmpSame: 'Both offers are about the same'
});

/* ============================ DATA BERSAMA ============================ */
const LOC_RE = /^[^|]+\|[^|]*$/;
const locKey = (v) => (LOC_RE.test(String(v || '')) ? String(v).slice(0, 120) : '');
/** Gaji bersih dari input Gaji Bersih — dipakai kalkulator lain (FIRE, Cicilan, Zakat, …). */
function netSalary() { return calcSalary(inp('gaji'), TARIF.config, TARIF.ter, TARIF.brackets); }
/** Nilai waktu (per jam/menit/hari) dari gaji bersih rata-rata & jam kerja. */
/** Keterangan sumber + tautan ke Gaji Bersih, untuk sakelar "Pakai gaji bersih" di kalkulator lain. */
function gajiLink() {
  const g = inp('gaji');
  return '<br>' + esc(t('fromGajiBase', { g: rp(g.gaji), a: rp(g.tunjangan) })) + ' · <button type="button" class="link-btn inline-link" data-act="nav" data-v="gaji">' + esc(t('editInGaji')) + '</button>';
}
/** Belum ada gaji yang diisi di Gaji Bersih (pengguna baru / setelah hapus isian). */
function gajiEmpty() { const g = inp('gaji'); return !(g.gaji + g.tunjangan + g.tidakTetap > 0); }
/** Kartu ajakan mengisi gaji, untuk kalkulator yang memakai gaji bersih saat Gaji Bersih masih kosong. */
function needGajiCard(order) {
  return '<section class="card need-gaji span2" style="order:' + (order || 0) + '"><span class="ng-ic">' + ic('wallet', 22) + '</span>' +
    '<span class="ng-txt"><b>' + esc(t('needGajiTitle')) + '</b><span>' + esc(t('needGajiText')) + '</span></span>' +
    '<button type="button" class="btn btn-primary" data-act="fillGaji">' + esc(t('needGajiBtn')) + ic('chevR', 18) + '</button></section>';
}
/** Ke Gaji Bersih lalu fokus ke isian gaji pokok. */
ACT.fillGaji = () => {
  const focus = () => {
    const el = document.getElementById('f-gaji-gaji');
    if (!el) return;
    try { el.focus({ preventScroll: true }); } catch (e) {}
    el.scrollIntoView({ block: 'center', behavior: 'smooth' });
  };
  if (S.view === 'gaji') focus(); else { go('gaji'); setTimeout(focus, 150); }
};
/** Catatan di bawah isian manual: kalkulator lain tidak ikut berubah. */
function manualOnlyHint() { return esc(t('manualOnly', { rp: rp(netSalary().avgNet) })); }
function timeValue() { const w = inp('waktu'); return calcTime(netSalary().avgNet, w.jamKerja, w.hariKerja); }
let WAGES = null;
function wages() { return WAGES || (WAGES = wageIndex(WAGE_DATA)); }
function wagePlace(w) { return w.kind === 'UMK' || w.region ? w.region : w.prov; }
function wageLabel(w) { return t('wageName', { kind: w.kind, place: w.kind === 'UMK' ? w.region : w.prov, y: wages().year }); }
function sortRegions(list) {
  const base = (n) => n.replace(/^(Kabupaten|Kota)\s+/, '');
  return list.slice().sort((a, b) => base(a[0]).localeCompare(base(b[0]), 'id') || a[0].localeCompare(b[0], 'id'));
}
/** Pilihan bertingkat provinsi → kab/kota. Nilai tersimpan 'Provinsi|Kab/Kota' ('Provinsi|' = UMP). */
function locPicker(path, label) {
  const value = getPath(path) || '';
  const prov = value.split('|')[0] || '';
  const reg = value.indexOf('|') >= 0 ? value.slice(value.indexOf('|') + 1) : '';
  const W = wages();
  const p = W.provinces.find((x) => x.name === prov);
  const id = fieldId(path);
  return '<div class="field"><span class="label" id="' + id + '-l">' + esc(label) + '</span><div class="loc-row" role="group" aria-labelledby="' + id + '-l">' +
    '<select class="input" id="' + id + '-p" data-lp="' + path + '" aria-label="' + esc(t('provL')) + '"><option value="">' + esc(t('pickProv')) + '</option>' +
    W.provinces.slice().sort((a, b) => a.name.localeCompare(b.name, 'id')).map((x) => '<option value="' + esc(x.name) + '"' + (x.name === prov ? ' selected' : '') + '>' + esc(x.name) + '</option>').join('') + '</select>' +
    '<select class="input" id="' + id + '-r" data-lr="' + path + '" aria-label="' + esc(t('regionL')) + '"' + (p ? '' : ' disabled') + '>' +
    '<option value="">' + esc(p ? t('provOnly') : t('pickRegion')) + '</option>' +
    (p ? sortRegions(p.regions).map((r) => '<option value="' + esc(r[0]) + '"' + (r[0] === reg ? ' selected' : '') + '>' + esc(r[0]) + '</option>').join('') : '') +
    '</select></div></div>';
}
HOOKS.change.push((el) => {
  if (el.dataset.lp !== undefined) { setPath(el.dataset.lp, el.value ? el.value + '|' : ''); render(); return true; }
  if (el.dataset.lr !== undefined) {
    const prov = (getPath(el.dataset.lr) || '').split('|')[0];
    setPath(el.dataset.lr, prov ? prov + '|' + el.value : '');
    render();
    return true;
  }
  return false;
});

/* ============================ GAJI BERSIH ============================ */
const JKK_KEYS = ['SANGAT_RENDAH', 'RENDAH', 'SEDANG', 'TINGGI', 'SANGAT_TINGGI'];
calc({
  id: 'gaji', icon: 'wallet', color: '#0b776b', title: 'gajiTitle', short: 'gajiShort', sub: 'gajiSub',
  defaults: { gaji: 0, tunjangan: 0, tidakTetap: 0, thr: 0, ptkp: 'TK/0', kes: true, jht: true, jp: true, jkk: 'SANGAT_RENDAH', dtp: false, lokasi: '', lokasiBanding: '' },
  ui: { adv: false, employer: false },
  clean(o) {
    ['gaji', 'tunjangan', 'tidakTetap', 'thr'].forEach((k) => { o[k] = clamp(Math.round(o[k]), 0, 999999999999); });
    if (!PTKP_CAT[o.ptkp]) o.ptkp = 'TK/0';
    if (JKK_KEYS.indexOf(o.jkk) < 0) o.jkk = 'SANGAT_RENDAH';
    o.lokasi = locKey(o.lokasi);
    o.lokasiBanding = locKey(o.lokasiBanding);
    return o;
  },
  // kosong ↔ terisi saat mengetik: gambar ulang penuh supaya hasil & grafik langsung muncul/hilang
  onSet() { if (S.view === 'gaji' && gajiEmpty() !== !!ui('gaji').shownEmpty) { renderShell(); render(); } },
  view: gajiView,
  summary() {
    if (gajiEmpty()) return { value: t('sumGajiEmpty'), sub: t('sumGajiEmptySub') };
    const r = netSalary();
    return { value: rp(r.thp) + ' ' + t('perMonthShort'), sub: t('sumYear', { rp: compactRp(r.thpYear) }) };
  }
});
function gajiView() {
  const cfg = TARIF.config;
  const inp_ = inp('gaji');
  const u = ui('gaji');
  const r = netSalary();
  const empty = u.shownEmpty = gajiEmpty();
  const top = empty ? hero('<span class="lbl">' + esc(t('gajiEmptyLbl')) + '</span><span class="big">' + esc(t('gajiEmptyBig')) + '</span>' +
    '<span class="sep"></span>' + heroLine(esc(t('gajiEmptyLine'))) +
    '<button type="button" class="btn hero-btn" data-act="fillGaji">' + ic('wallet', 18) + esc(t('gajiEmptyBtn')) + '</button>', { order: 1, label: t('gajiEmptyBig') }) :
    hero('<span class="lbl">' + esc(t('netMonthly')) + '</span><span class="big">' + esc(rp(r.thp)) + '</span>' +
    '<span class="sep"></span>' + heroLine(esc(t('december')), esc(rp(r.thpDec))) +
    (r.thrMonth ? heroLine(esc(t('thrMonth')), esc(rp(r.thrMonth.thp))) : '') + heroLine(esc(t('yearly')), esc(rp(r.thpYear))), { order: 1, label: t('netMonthly') });
  const where = card(t('where'), '<div data-live="where">' + stackbar([
    { label: t('received'), value: r.thp, color: 'var(--accent)' },
    { label: t('pphL'), value: r.pph, color: 'var(--amber)' },
    { label: t('bpjsL'), value: r.bpjs, color: '#3e4a5c' }], r.pay || 1) + '</div>', { order: 3 });
  const data = card(t('dataGaji'), fMoney('gaji.gaji', t('basic')) + fMoney('gaji.tunjangan', t('allowance')) +
    fSelect('gaji.ptkp', t('ptkpL'), Object.keys(PTKP_CAT).map((k) => [k, L('ptkpOpt')[k]])) +
    '<div style="margin-top:10px">' + fToggle('gaji.kes', t('kesL'), esc(t('kesSub', { p: pctTxt(cfg.BPJS_KES_PEKERJA), cap: rp(cfg.BPJS_KES_BATAS_UPAH) }))) +
    fToggle('gaji.jht', t('jhtL'), esc(t('jhtSub', { p: pctTxt(cfg.JHT_PEKERJA) }))) + fToggle('gaji.jp', t('jpL'), esc(t('jpSub', { p: pctTxt(cfg.JP_PEKERJA), cap: rp(cfg.JP_BATAS_UPAH) }))) + '</div>' +
    '<button type="button" class="disclose" data-act="ui" data-k="gaji.adv" aria-expanded="' + !!u.adv + '" style="border-top:1px solid var(--line);margin-top:4px"><span>' + esc(t('advanced')) + '</span>' + ic('chevD', 20) + '</button>' +
    (u.adv ? fMoney('gaji.tidakTetap', t('irregular'), { hint: esc(t('irregularHint')) }) + fMoney('gaji.thr', t('thrL'), { hint: esc(t('thrHint')) }) +
      fSelect('gaji.jkk', t('jkkL'), JKK_KEYS.map((k) => [k, L('jkkOpt')[k] + ' · ' + pctTxt(cfg['JKK_' + k]) + '%'])) +
      '<div style="margin-top:8px">' + fToggle('gaji.dtp', t('dtpL'), esc(t('dtpSub', { cap: rp(cfg.DTP_BATAS_BRUTO) }))) + '</div>' : ''),
    // kosong: kartu isian naik tepat di bawah hero & ditandai
    { order: empty ? 1 : 4, tight: true, cls: empty ? 'need-fill' : '', small: empty ? '<span class="need-chip">' + esc(t('startHere')) + '</span>' : '' });
  const breakdown = card(t('breakdown'), '<div class="rows" data-live="breakdown">' +
    row(t('payPlus'), esc(rp(r.upah))) + (r.pay > r.upah ? row(t('irregularLine'), esc(rp(r.pay - r.upah))) : '') +
    row(t('premiLine'), '+ ' + esc(rp(r.premi))) + row(t('brutoLine'), esc(rp(r.bruto))) +
    row(t('terLine', { k: r.kat }), num(r.rate, 2) + '%') +
    (r.dtp ? row(t('dtpLine'), esc(rp(0)) + ' <span class="dim" style="font-weight:600">(' + esc(rp(r.pphRaw)) + ')</span>') : row(t('pphLine'), '− ' + esc(rp(r.pph)), 'neg')) +
    row(t('kesLine', { p: pctTxt(cfg.BPJS_KES_PEKERJA) }), '− ' + esc(rp(r.ee.kes)), 'neg') + row(t('jhtLine', { p: pctTxt(cfg.JHT_PEKERJA) }), '− ' + esc(rp(r.ee.jht)), 'neg') +
    row(t('jpLine', { p: pctTxt(cfg.JP_PEKERJA) }), '− ' + esc(rp(r.ee.jp)), 'neg') + row(t('netLine'), esc(rp(r.thp)), 'total') + '</div>', { order: 6 });
  const year = card(t('yearTitle'), '<div class="rows" data-live="year">' +
    row(t('yBruto'), esc(rp(r.year.bruto))) + row(t('yBj'), '− ' + esc(rp(r.year.biayaJabatan)), 'neg') + row(t('yIuran'), '− ' + esc(rp(r.year.iuranPensiun)), 'neg') +
    row(t('yNeto'), esc(rp(r.year.neto))) + row(t('yPtkp'), '− ' + esc(rp(r.year.ptkp)), 'neg') + row(t('yPkp'), esc(rp(r.year.pkp))) +
    row(t('yPph'), esc(rp(r.year.pph))) + row(t('yPaid'), '− ' + esc(rp(r.year.paidJanNov)), 'neg') + row(t('yDec'), esc(rp(r.year.pphDec)), 'total') + '</div>', { order: 7 });
  const emp = '<section class="card" style="order:8"><button type="button" class="disclose" data-act="ui" data-k="gaji.employer" aria-expanded="' + !!u.employer + '"><span>' + esc(t('employer')) + '</span>' + ic('chevD', 20) + '</button>' +
    (u.employer ? '<div class="rows" data-live="emp">' + row(t('empKes', { p: pctTxt(cfg.BPJS_KES_PERUSAHAAN) }), esc(rp(r.emp.kes))) + row(t('empJht', { p: pctTxt(cfg.JHT_PERUSAHAAN) }), esc(rp(r.emp.jht))) +
      row(t('empJp', { p: pctTxt(cfg.JP_PERUSAHAAN) }), esc(rp(r.emp.jp))) + row(t('empJkk', { p: pctTxt(cfg['JKK_' + inp_.jkk]) }), esc(rp(r.emp.jkk))) +
      row(t('empJkm', { p: pctTxt(cfg.JKM) }), esc(rp(r.emp.jkm))) + row(t('empTotal'), esc(rp(r.empTotal))) + row(t('companyCost'), esc(rp(r.companyCost)), 'total') + '</div>' : '') + '</section>';
  // HP: satu kolom urut order; desktop: kolom kiri hasil, kolom kanan input
  if (empty) {
    const ghost = '<section class="card empty-res" style="order:3"><div class="er-bars" aria-hidden="true"><i></i><i></i><i></i></div>' +
      '<b>' + esc(t('gajiEmptyRes')) + '</b><span>' + esc(t('gajiEmptyResSub')) + '</span></section>';
    return cols(top, ghost, wagePosHtml(r, inp_) + data + wageEqHtml(r, inp_), note(esc(t('calcNote', { y: cfg.TAHUN_ATURAN })), 9));
  }
  return cols(top, where + breakdown + year + emp, wagePosHtml(r, inp_) + data + wageEqHtml(r, inp_), note(esc(t('calcNote', { y: cfg.TAHUN_ATURAN })), 9));
}

/** Kartu "Posisi gajimu": pilihan domisili + kelipatan UMK/UMP. */
function wagePosHtml(r, g) {
  const W = wages();
  let h = '<section class="card" style="order:2"><div class="card-title" style="margin-bottom:0"><span>' + esc(t('posTitle')) + '</span><small>' + esc('UMK/UMP ' + W.year) + '</small></div>' +
    locPicker('gaji.lokasi', t('domicile'));
  const w = W.byKey[g.lokasi];
  if (!w) return h + '<p class="hint" style="margin-top:10px">' + esc(t('pickDomicileHint', { y: W.year })) + '</p></section>';
  if (gajiEmpty()) return h + '<p class="hint" style="margin-top:10px">' + esc(t('gajiEmptyPos')) + '</p></section>';
  const c = wageCompare(r.upah, w.value);
  const st = c.status === 'below' ? 'stBelow' : c.status === 'at' ? 'stAt' : 'stAbove';
  const k = wageRank(r.upah, W.regions);
  const prov = W.provinces.find((p) => p.name === w.prov);
  h += '<div data-live="wagepos"><div class="wage-pos"><div class="wp-big"><b>' + ratioTxt(c.ratio) + '×</b><span>' + esc(t('ofWage', { name: wageLabel(w) })) + '</span></div>' +
    '<span class="st-pill ' + c.status + '">' + esc(t(st, { kind: w.kind })) + '</span></div>' +
    (w.kind === 'UMP' && w.region ? '<p class="hint" style="margin-top:6px">' + esc(t('followsUmp', { region: w.region, y: W.year, prov: w.prov })) + '</p>' : '') +
    '<div class="rows" style="margin-top:8px">' + row(t('yourUpah'), esc(rp(r.upah))) + row(wageLabel(w), esc(rp(w.value))) +
    row(t('wageDiff'), (c.diff >= 0 ? '+ ' : '− ') + esc(rp(Math.abs(c.diff))), c.diff < 0 ? 'neg' : '') + '</div>' +
    (k.total ? '<div class="rank"><div class="hint"><b>' + num(Math.floor(k.pct), 0) + '%</b> · ' + esc(t('rankLine', { met: num(k.met, 0), total: num(k.total, 0) })) + '</div>' + progress(k.pct) + '</div>' : '') + '</div>';
  return h + '<p class="hint" style="margin-top:10px">' + esc(t('posNote')) + '</p><p class="hint" style="margin-top:4px">' + esc(t('wageSrc', { y: W.year })) +
    (prov && prov.src ? ' <a href="' + esc(prov.src) + '" target="_blank" rel="noopener noreferrer">' + esc(t('wageSrcLink', { prov: prov.name })) + '</a>' : '') + '</p></section>';
}
/** Kartu "Setara di kota lain" (perkiraan daya beli dari rasio upah minimum). */
function wageEqHtml(r, g) {
  const W = wages();
  let h = '<section class="card" style="order:5"><div class="card-title" style="margin-bottom:0"><span>' + esc(t('eqTitle')) + '</span></div>';
  const from = W.byKey[g.lokasi];
  if (!from) return h + '<p class="hint" style="margin-top:10px">' + esc(t('eqNeedHome')) + '</p></section>';
  h += locPicker('gaji.lokasiBanding', t('eqTarget'));
  const to = W.byKey[g.lokasiBanding];
  if (!to) return h + '<p class="hint" style="margin-top:10px">' + esc(t('eqPick')) + '</p></section>';
  if (gajiEmpty()) return h + '<p class="hint" style="margin-top:10px">' + esc(t('gajiEmptyEq')) + '</p></section>';
  const eq = wageEquivalent(r.thp, from.value, to.value);
  return h + '<div data-live="eq" style="margin-top:12px">' + callout('coins', esc(t('eqResult', { rp: rp(r.thp), from: wagePlace(from), eq: rp(eq), to: wagePlace(to) })),
    esc(t('eqRatio', { to: wagePlace(to), from: wagePlace(from), x: num(to.value / from.value, 2) }))) + '</div>' +
    '<p class="hint" style="margin-top:8px">' + esc(t('eqNote')) + '</p></section>';
}

/* ============================ NILAI WAKTU ============================ */
calc({
  id: 'waktu', icon: 'clock', color: '#2563c9', title: 'waktuTitle', short: 'waktuShort', sub: 'waktuSub',
  defaults: { jamKerja: 8, hariKerja: 5, harga: 1500000, kebiasaan: 35000, frek: 5, tahun: 10, ret: 8 },
  clean(o) {
    o.jamKerja = clamp(Math.round(o.jamKerja), 1, 16);
    o.hariKerja = o.hariKerja === 6 ? 6 : 5;
    o.frek = [1, 3, 5, 7].indexOf(o.frek) >= 0 ? o.frek : 5;
    o.tahun = clamp(Math.round(o.tahun), 1, 50);
    o.ret = clamp(o.ret, 0, 30);
    return o;
  },
  view: waktuView,
  summary() {
    if (gajiEmpty()) return { value: t('sumGajiEmpty'), sub: t('sumGajiEmptySub') };
    const tv = timeValue();
    return { value: rp(tv.perHour) + ' ' + t('perHour'), sub: t('sumDay', { rp: rp(tv.perDay) }) };
  }
});
function waktuView() {
  const w = inp('waktu');
  const g = inp('gaji');
  const r = netSalary();
  const tv = calcTime(r.avgNet, w.jamKerja, w.hariKerja);
  const W = wages();
  const mw = W.byKey[g.lokasi];
  let html = (gajiEmpty() ? needGajiCard() : '') + hero('<span class="lbl">' + esc(t('valueTime')) + '</span><span class="big">' + esc(rp(tv.perHour)) + ' <small>' + esc(t('perHour')) + '</small></span>' +
    heroCells([[t('perMin'), esc(rp(tv.perMin))], [t('perWorkday'), esc(rp(tv.perDay))]]) +
    (mw && tv.hoursMonth > 0 ? heroLine(esc(t('timeWage', { kind: mw.kind, place: mw.kind === 'UMK' ? mw.region : mw.prov, rp: rp(mw.value / tv.hoursMonth), x: ratioTxt(r.upah / mw.value) }))) : ''), { label: t('valueTime') });
  html += '<section class="card"><div class="rows"><div class="row"><span>' + esc(t('avgNet')) + ' <button type="button" class="link-btn" style="min-height:0;display:inline;padding:0" data-act="nav" data-v="gaji">· ' + esc(t('fromNet')) + '</button></span><b>' + esc(rp(r.avgNet)) + '</b></div></div>' +
    (!mw ? '<p class="hint" style="margin-top:6px">' + esc(t('timeWageHint')) + '</p>' : '') +
    '<div class="tog-row"><span class="tt"><b>' + esc(t('hoursDay')) + '</b></span><div class="stepper">' +
    '<button type="button" class="step-btn" data-act="set" data-k="waktu.jamKerja" data-num="1" data-v="' + Math.max(1, w.jamKerja - 1) + '" aria-label="-1">' + ic('minus', 18, 2.4) + '</button>' +
    '<span class="v">' + esc(t('nHours', { n: w.jamKerja })) + '</span><button type="button" class="step-btn go" data-act="set" data-k="waktu.jamKerja" data-num="1" data-v="' + Math.min(16, w.jamKerja + 1) + '" aria-label="+1">' + ic('plus', 18, 2.4) + '</button></div></div>' +
    '<div class="tog-row"><span class="tt"><b>' + esc(t('daysWeek')) + '</b></span>' + fSeg('waktu.hariKerja', [[5, t('nDaysW', { n: 5 })], [6, t('nDaysW', { n: 6 })]], { style: 'min-width:150px', label: t('daysWeek') }) + '</div></section>';
  const hrs = tv.perHour > 0 ? w.harga / tv.perHour : 0;
  html += card(t('priceTitle'), fMoney('waktu.harga', t('priceLabel')) +
    '<div data-live="price" style="margin-top:12px">' + callout('clock', esc(t('priceRes', { h: num(hrs, 1) })), esc(t('priceDays', { d: num(hrs / w.jamKerja, 1) }))) + '</div>', { tight: true });
  const hc = calcHabitCost(w.kebiasaan, w.frek, tv.perHour, w.tahun, w.ret);
  html += card(t('habitTitle'), '<div class="calc-cols" style="margin-top:0"><div class="col">' +
    fMoney('waktu.kebiasaan', t('habitL'), { hint: esc(t('habitHint')) }) + fSegField('waktu.frek', t('habitFreq'), L('habitFreqOpt')) +
    '<div class="row2">' + fNum('waktu.tahun', t('habitYears'), { min: 1, max: 50, suffix: en() ? 'yrs' : 'tahun' }) + fNum('waktu.ret', t('habitRet'), { min: 0, max: 30, dec: true, suffix: '% / ' + (en() ? 'yr' : 'thn') }) + '</div></div>' +
    '<div class="col" data-live="habit"><div class="fire-mini" style="margin-top:14px"><div><small>' + esc(t('habitPerMonth')) + '</small><b>' + esc(rp(hc.perMonth)) + '</b></div><div><small>' + esc(t('habitPerYear')) + '</small><b>' + esc(rp(hc.perYear)) + '</b></div></div>' +
    '<div style="margin-top:10px">' + callout('clock', esc(t('habitHours', { h: num(hc.hoursYear, 1) })), esc(t('habitHoursSub', { d: num(hc.hoursYear / w.jamKerja, 1) }))) + '</div>' +
    '<div style="margin-top:10px">' + callout('trendUp', esc(t('habitInvest', { n: w.tahun })) + ' ≈ ' + esc(rp(hc.invested)), esc(t('habitInvestSub', { paid: rp(hc.paid), gain: rp(hc.invested - hc.paid) }))) + '</div></div></div>', { cls: 'span2' });
  return '<div class="stats-grid">' + html + '</div>';
}

/* ============================ BANDINGKAN 2 TAWARAN ============================ */
calc({
  id: 'bandingkan', icon: 'scale', color: '#6d4ad8', title: 'cmpTitle', short: 'cmpShort', sub: 'cmpSub',
  defaults: { tawaran: [] },
  clean(o) {
    o.tawaran = o.tawaran.slice(0, 2).map((x) => ({
      nama: String((x && x.nama) || '').slice(0, 30),
      gaji: clamp(Math.round(Number(x && x.gaji) || 0), 0, 999999999999),
      tunjangan: clamp(Math.round(Number(x && x.tunjangan) || 0), 0, 999999999999),
      lokasi: locKey(x && x.lokasi)
    }));
    return o;
  },
  view: cmpView,
  summary() {
    const res = cmpResult();
    if (!res[0].r.pay && !res[1].r.pay) return { value: t('sumCmpPick'), sub: '' };
    const d = res[1].r.thp - res[0].r.thp;
    const base = Math.max(1, Math.min(res[0].r.thp, res[1].r.thp));
    if (Math.abs(d) / base < 0.01) return { value: t('sumCmpSame'), sub: offersList().map((o) => o.nama).join(' · ') };
    return { value: t('sumCmpWin', { name: offerName(d > 0 ? 1 : 0), rp: compactRp(Math.abs(d)) }), sub: offersList().map((o) => o.nama).join(' vs ') };
  }
});
/** Dua tawaran; dibuat dari data Gaji Bersih saat pertama kali dibuka. */
function offersList() {
  const o = inp('bandingkan');
  if (o.tawaran.length < 2) {
    const g = inp('gaji');
    const other = (g.lokasi || '').indexOf('DKI Jakarta|') === 0 ? 'Jawa Timur|Kota Surabaya' : 'DKI Jakarta|Kota Jakarta Selatan';
    o.tawaran = [
      { nama: t('offerA'), gaji: g.gaji, tunjangan: g.tunjangan, lokasi: g.lokasi || '' },
      { nama: t('offerB'), gaji: Math.round(g.gaji * 1.2 / 100000) * 100000, tunjangan: g.tunjangan, lokasi: other }
    ];
    if (!gajiEmpty()) persist('bandingkan'); // masih kosong: isi ulang dari Gaji Bersih setelah gaji diisi
  }
  return o.tawaran;
}
function offerName(i) { return offersList()[i].nama || t(i ? 'offerB' : 'offerA'); }
function cmpResult() { return compareOffers(offersList(), inp('gaji'), TARIF.config, TARIF.ter, TARIF.brackets, wages()); }
function cmpView() {
  const offers = offersList();
  const res = cmpResult();
  const A = res[0], B = res[1];
  const best = (a, b) => (a > b + 0.5 ? [' class="win"', ''] : b > a + 0.5 ? ['', ' class="win"'] : ['', '']);
  const tr = (label, a, b, wa, wb, cls) => { const w = wa === undefined ? ['', ''] : best(wa, wb); return '<tr' + (cls ? ' class="' + cls + '"' : '') + '><th scope="row">' + esc(label) + '</th><td' + w[0] + '>' + a + '</td><td' + w[1] + '>' + b + '</td></tr>'; };
  const mult = (x) => (x.cmp ? ratioTxt(x.cmp.ratio) + '× ' + esc(x.wage.kind) : '–');
  const city = (x) => (x.wage ? esc(wagePlace(x.wage)) : '–');
  const both = A.wage && B.wage;
  const eqB = both ? wageEquivalent(B.r.thp, B.wage.value, A.wage.value) : 0;
  const table = '<div class="tbl-wrap"><table class="cmp-table"><thead><tr><th></th><th scope="col">' + esc(offerName(0)) + '</th><th scope="col">' + esc(offerName(1)) + '</th></tr></thead><tbody>' +
    tr(t('cmpCity'), city(A), city(B), undefined, undefined, 'txt') +
    tr(t('cmpNet'), esc(rp(A.r.thp)), esc(rp(B.r.thp)), A.r.thp, B.r.thp) +
    tr(t('cmpYear'), esc(rp(A.r.thpYear)), esc(rp(B.r.thpYear)), A.r.thpYear, B.r.thpYear) +
    tr(t('cmpMult'), mult(A), mult(B)) +
    (both ? tr(t('cmpEq', { city: wagePlace(A.wage) }), esc(rp(A.r.thp)), esc(rp(eqB)), A.r.thp, eqB) : '') +
    '</tbody></table></div>';
  // kesimpulan
  const lines = [];
  const d = B.r.thp - A.r.thp;
  const base = Math.max(1, Math.min(A.r.thp, B.r.thp));
  if (!A.r.pay && !B.r.pay) lines.push(t('sumCmpPick'));
  else if (Math.abs(d) / base < 0.01) lines.push(t('cmpSame'));
  else lines.push(t('cmpHigher', { name: d > 0 ? offerName(1) : offerName(0), rp: rp(Math.abs(d)), p: num(Math.abs(d) / base * 100, 1) }));
  if (both && A.wage.value !== B.wage.value) {
    const de = eqB - A.r.thp;
    const cityA = wagePlace(A.wage);
    if (Math.abs(de) / base < 0.01) lines.push(t('cmpEqSame', { city: cityA }));
    else {
      const winner = de > 0 ? 1 : 0;
      const flipped = Math.abs(d) / base >= 0.01 && (d > 0) !== (de > 0);
      lines.push(t(flipped ? 'cmpEqFlip' : 'cmpEqWin', { city: cityA, name: offerName(winner), rp: rp(Math.abs(de)) }));
    }
  } else if (!both) lines.push(t('cmpPickCity'));
  let html = '<section class="card span2" style="order:1"><div class="card-title"><span>' + esc(t('cmpResult')) + '</span></div><div data-live="cmp">' + table +
    '<div class="callout" style="margin-top:12px">' + ic('sparkles', 22) + '<span>' + lines.map((l, i) => (i ? '<small>' : '<b>') + esc(l) + (i ? '</small>' : '</b>')).join('') + '</span></div></div>' +
    '<p class="hint" style="margin-top:8px">' + esc(t('cmpNote')) + '</p></section>';
  offers.forEach((o, i) => {
    html += '<section class="card" style="order:' + (i + 2) + '"><div class="card-title" style="margin-bottom:0"><span data-live="offer' + i + '">' + esc(offerName(i)) + '</span><small>' + (i ? 'B' : 'A') + '</small></div>' +
      (i === 0 ? '<p class="hint" style="margin-top:6px">' + esc(t('offerOnly')) + '</p>' : '') + fText('bandingkan.tawaran.' + i + '.nama', t('offerName'), { max: 30 }) + locPicker('bandingkan.tawaran.' + i + '.lokasi', t('offerCity')) +
      fMoney('bandingkan.tawaran.' + i + '.gaji', t('basic')) + fMoney('bandingkan.tawaran.' + i + '.tunjangan', t('allowance')) + '</section>';
  });
  return '<div class="stats-grid">' + html + '</div>';
}
