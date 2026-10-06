'use strict';
/* =====================================================================
 * Karier → Pesangon PHK (PKWTT) & uang kompensasi PKWT.
 * Rumus di js/engine/pesangon.js: PP 35/2021 Pasal 15–17 & 40–59, PP 36/2021 Pasal 17,
 * PPh 21 final pesangon PP 68/2009 & PMK 16/PMK.03/2010.
 * ===================================================================== */

Object.assign(I18N.id, {
  sevTitle: 'Kalkulator Pesangon', sevShort: 'Pesangon', sevSub: 'PP 35/2021 · UU Cipta Kerja',
  sevJobTitle: 'Hubungan kerja', sevStatusL: 'Status', sevPkwtt: 'PKWTT (tetap)', sevPkwt: 'PKWT (kontrak)',
  sevStartL: 'Mulai bekerja', sevEndL: 'Hari terakhir bekerja', sevTenureL: 'Masa kerja: {v}', sevTenureBad: 'Tanggal berakhir harus sama dengan atau setelah tanggal mulai.',
  sevDaysN: '{n} hari',
  sevUseGaji: 'Pakai upah dari Gaji Bersih', sevUseGajiSub: '{rp} / bln · gaji pokok + tunjangan tetap',
  sevUpahL: 'Upah / bulan', sevUpahHint: 'Gaji pokok + tunjangan tetap (dasar perhitungan pesangon).',
  sevAlasanL: 'Alasan PHK', sevAlasanHint: 'PP 35/2021 Pasal {p} · UP {up} · UPMK {upmk}{pisah}', sevPisahTag: ' · uang pisah',
  sevPkwtFinal: 'Kompensasi dipotong PPh 21 final', sevPkwtFinalSub: 'Tarif pesangon 0–25%. Bila dimatikan, PPh tidak dihitung di sini (sebagian perusahaan memotongnya bersama gaji).',
  sevUphTitle: 'Uang penggantian hak & uang pisah', sevCutiL: 'Sisa cuti tahunan (belum diambil & belum gugur)', sevCutiSuffix: 'hari',
  sevHariL: 'Hari kerja per minggu', sevHariN: '{n} hari', sevDailyHint: 'Upah sehari {rp} = upah ÷ {d} (PP 36/2021 Pasal 17).',
  sevPulangL: 'Ongkos pulang ke tempat diterima bekerja', sevPulangHint: 'Untuk pekerja & keluarganya, bila ada.',
  sevLainL: 'Hak lain menurut PK/PP/PKB', sevPisahL: 'Uang pisah', sevPisahHint: 'Besarannya diatur dalam Perjanjian Kerja, Peraturan Perusahaan, atau PKB.',
  sevNoPisah: 'Alasan PHK ini tidak memberi uang pisah (sudah mendapat pesangon/UPMK).',
  sevHeroLbl: 'Total diterima bersih', sevHeroGross: 'Total bruto', sevHeroTax: 'PPh 21 final', sevHeroPkwt: 'Uang kompensasi PKWT',
  sevDetail: 'Rincian', sevRowTenure: 'Masa kerja', sevRowUpah: 'Upah / bulan',
  sevRowUp: 'Uang pesangon ({m} bln × {k})', sevRowUpmk: 'Uang penghargaan masa kerja ({m} bln × {k})',
  sevRowCuti: 'Cuti {d} hari × {rp}', sevRowPulang: 'Ongkos pulang', sevRowLain: 'Hak lain (PK/PP/PKB)', sevRowPisah: 'Uang pisah',
  sevRowKomp: 'Uang kompensasi ({m} bln ÷ 12 × upah)', sevRowGross: 'Total bruto', sevRowTax: 'PPh 21 final', sevRowNet: 'Diterima bersih',
  sevLayers: 'Lapisan PPh 21 final', sevLayer: '{r}% × {base}', sevKompNoTax: 'Kompensasi PKWT tidak dipotong PPh di sini.',
  sevKompMin: 'Kompensasi PKWT baru diberikan untuk masa kerja minimal 1 bulan terus-menerus.',
  sevPkwtMax: 'PKWT berdasarkan jangka waktu paling lama 5 tahun termasuk perpanjangan (PP 35/2021 Pasal 8) — periksa kembali status hubungan kerjamu.',
  sevCmpTitle: 'Perbandingan alasan PHK', sevCmpSub: 'Upah, masa kerja, UPH & uang pisah sama', sevCmpReason: 'Alasan', sevCmpNet: 'Bersih',
  sevShowAll: 'Tampilkan semua ({n} alasan)', sevShowLess: 'Tampilkan alasan umum saja',
  sevSumPkwt: 'Kompensasi PKWT · {t}', sevSumSub: '{r} · {t}',
  sevNote: 'Dasar: UU 13/2003 jo. UU 6/2023 (Cipta Kerja); PP 35/2021 Pasal 40 (tabel UP, UPMK & UPH) dan Pasal 41–57 (pengali per alasan); PP 36/2021 Pasal 17 (upah sehari); PPh 21 final pesangon PP 68/2009 & PMK 16/PMK.03/2010 (0% s.d. 50 jt · 5% 50–100 jt · 15% 100–500 jt · 25% > 500 jt; UP, UPMK, UPH & uang pisah termasuk objeknya). ' +
    'Iuran program pensiun dari pengusaha dapat diperhitungkan sebagai bagian pesangon (Pasal 58); usaha mikro & kecil berdasarkan kesepakatan (Pasal 59). Saldo JHT BPJS Ketenagakerjaan terpisah dari pesangon dan bisa dicairkan setelah berhenti bekerja (Permenaker 4/2022); cek juga hak JKP. ' +
    'RUU Ketenagakerjaan baru (tindak lanjut Putusan MK 168/PUU-XXI/2023) masih dibahas — aturan bisa berubah. Estimasi edukatif, bukan nasihat hukum.',
  sevNotePkwt: 'Uang kompensasi PKWT: PP 35/2021 Pasal 15–17 — 1 bulan upah untuk 12 bulan masa kerja, proporsional (masa kerja ÷ 12 × upah), minimal 1 bulan terus-menerus; dihitung lagi tiap kali PKWT berakhir/diperpanjang; tidak berlaku bagi TKA. Sisa hari dihitung ÷ 30. ' +
    'Bila PKWT diakhiri sebelum waktunya, pihak yang mengakhiri juga wajib membayar ganti rugi sebesar upah sampai batas waktu kontrak (UU 13/2003 Pasal 62) — tidak dihitung di sini. Aturan pajak khusus untuk kompensasi PKWT belum ada; praktik perusahaan berbeda-beda. Estimasi edukatif, bukan nasihat hukum.',
  sevReasons: {
    efRugi: 'Efisiensi karena perusahaan rugi', efCegah: 'Efisiensi untuk mencegah kerugian',
    merger: 'Penggabungan, peleburan, atau pemisahan perusahaan', akuisisi: 'Pengambilalihan perusahaan',
    akuisisiSyarat: 'Pengambilalihan, syarat kerja berubah & pekerja menolak',
    tutupRugi: 'Perusahaan tutup karena rugi 2 tahun', tutupBukanRugi: 'Perusahaan tutup bukan karena rugi',
    fmTutup: 'Keadaan memaksa, perusahaan tutup', fmTidakTutup: 'Keadaan memaksa, perusahaan tidak tutup',
    pkpuRugi: 'PKPU karena perusahaan rugi', pkpuBukanRugi: 'PKPU bukan karena rugi', pailit: 'Perusahaan pailit',
    pengusahaLanggar: 'Pekerja minta PHK karena pengusaha melanggar (mis. upah telat 3 bulan)',
    pengusahaTidakTerbukti: 'Permohonan PHK pekerja tidak terbukti (putusan PPHI)',
    resign: 'Mengundurkan diri atas kemauan sendiri', mangkir: 'Mangkir 5 hari kerja berturut-turut',
    sp3: 'Melanggar PK/PP/PKB setelah SP 1–3', mendesak: 'Pelanggaran bersifat mendesak (diatur PK/PP/PKB)',
    ditahanRugi: 'Ditahan pihak berwajib, merugikan perusahaan', ditahanTidakRugi: 'Ditahan pihak berwajib, tidak merugikan perusahaan',
    sakit: 'Sakit berkepanjangan / cacat kecelakaan kerja > 12 bulan', pensiun: 'Memasuki usia pensiun',
    meninggal: 'Pekerja meninggal dunia (untuk ahli waris)'
  }
});
Object.assign(I18N.en, {
  sevTitle: 'Severance Calculator', sevShort: 'Severance', sevSub: 'GR 35/2021 · Job Creation Law',
  sevJobTitle: 'Employment', sevStatusL: 'Status', sevPkwtt: 'Permanent (PKWTT)', sevPkwt: 'Contract (PKWT)',
  sevStartL: 'Start date', sevEndL: 'Last working day', sevTenureL: 'Length of service: {v}', sevTenureBad: 'The end date must be on or after the start date.',
  sevDaysN: (v) => (v.n === 1 ? '1 day' : v.n + ' days'),
  sevUseGaji: 'Use wage from Net Salary', sevUseGajiSub: '{rp} / mo · base salary + fixed allowance',
  sevUpahL: 'Wage / month', sevUpahHint: 'Base salary + fixed allowances (the severance base).',
  sevAlasanL: 'Reason for termination', sevAlasanHint: 'GR 35/2021 Art. {p} · severance {up} · service pay {upmk}{pisah}', sevPisahTag: ' · separation pay',
  sevPkwtFinal: 'Final PPh 21 withheld on compensation', sevPkwtFinalSub: 'Severance rates 0–25%. If off, tax is not calculated here (some employers withhold it with the monthly salary).',
  sevUphTitle: 'Entitlement replacement & separation pay', sevCutiL: 'Unused annual leave (not yet expired)', sevCutiSuffix: 'days',
  sevHariL: 'Workdays per week', sevHariN: '{n} days', sevDailyHint: 'Daily wage {rp} = wage ÷ {d} (GR 36/2021 Art. 17).',
  sevPulangL: 'Travel home to the place of hire', sevPulangHint: 'For the worker & family, if any.',
  sevLainL: 'Other rights under contract/company rules/CBA', sevPisahL: 'Separation pay (uang pisah)', sevPisahHint: 'The amount is set in the employment contract, company regulation or CBA.',
  sevNoPisah: 'This reason does not include separation pay (severance/service pay applies instead).',
  sevHeroLbl: 'Total take-home', sevHeroGross: 'Gross total', sevHeroTax: 'Final PPh 21', sevHeroPkwt: 'PKWT compensation',
  sevDetail: 'Breakdown', sevRowTenure: 'Length of service', sevRowUpah: 'Wage / month',
  sevRowUp: 'Severance pay ({m} mo × {k})', sevRowUpmk: 'Long-service pay ({m} mo × {k})',
  sevRowCuti: 'Leave {d} days × {rp}', sevRowPulang: 'Travel home', sevRowLain: 'Other rights', sevRowPisah: 'Separation pay',
  sevRowKomp: 'Compensation ({m} mo ÷ 12 × wage)', sevRowGross: 'Gross total', sevRowTax: 'Final PPh 21', sevRowNet: 'Take-home',
  sevLayers: 'Final PPh 21 brackets', sevLayer: '{r}% × {base}', sevKompNoTax: 'No tax is withheld on the PKWT compensation here.',
  sevKompMin: 'PKWT compensation applies only after at least 1 month of continuous service.',
  sevPkwtMax: 'A fixed-term PKWT may last at most 5 years including extensions (GR 35/2021 Art. 8) — double-check your employment status.',
  sevCmpTitle: 'Compare termination reasons', sevCmpSub: 'Same wage, service, entitlements & separation pay', sevCmpReason: 'Reason', sevCmpNet: 'Net',
  sevShowAll: 'Show all ({n} reasons)', sevShowLess: 'Show common reasons only',
  sevSumPkwt: 'PKWT compensation · {t}', sevSumSub: '{r} · {t}',
  sevNote: 'Basis: Law 13/2003 as amended by Law 6/2023 (Job Creation); GR 35/2021 Art. 40 (severance, long-service and entitlement tables) and Art. 41–57 (multiplier per reason); GR 36/2021 Art. 17 (daily wage); final PPh 21 on severance under GR 68/2009 & MoF Reg. 16/PMK.03/2010 (0% up to 50M · 5% 50–100M · 15% 100–500M · 25% above 500M; severance, long-service, entitlement and separation pay are all covered). ' +
    'Employer pension contributions may count toward severance (Art. 58); micro & small businesses pay by agreement (Art. 59). Your BPJS JHT balance is separate and can be withdrawn after leaving work (Manpower Reg. 4/2022); also check JKP benefits. ' +
    'A new Manpower Law (following Constitutional Court Decision 168/PUU-XXI/2023) is still being drafted — rules may change. An educational estimate, not legal advice.',
  sevNotePkwt: 'PKWT compensation: GR 35/2021 Art. 15–17 — one month of wages per 12 months of service, pro rata (months ÷ 12 × wage), after at least 1 continuous month; paid each time a PKWT ends or is extended; not for foreign workers. Leftover days are counted ÷ 30. ' +
    'If a PKWT is ended early, the party ending it must also pay wages up to the contract end date (Law 13/2003 Art. 62) — not calculated here. There is no specific tax rule for PKWT compensation yet; employers differ. An educational estimate, not legal advice.',
  sevReasons: {
    efRugi: 'Efficiency, company making losses', efCegah: 'Efficiency to prevent losses',
    merger: 'Merger, consolidation or spin-off', akuisisi: 'Company takeover',
    akuisisiSyarat: 'Takeover changed work terms & worker declines',
    tutupRugi: 'Company closed after 2 years of losses', tutupBukanRugi: 'Company closed, not due to losses',
    fmTutup: 'Force majeure, company closed', fmTidakTutup: 'Force majeure, company not closed',
    pkpuRugi: 'Debt moratorium (PKPU) due to losses', pkpuBukanRugi: 'Debt moratorium (PKPU), not due to losses', pailit: 'Company bankrupt',
    pengusahaLanggar: 'Worker requests termination: employer breached (e.g. wages late 3 months)',
    pengusahaTidakTerbukti: "Worker's termination request not proven (court ruling)",
    resign: 'Voluntary resignation', mangkir: 'Absent 5 consecutive workdays',
    sp3: 'Breach of rules after warning letters 1–3', mendesak: 'Urgent/serious breach (per contract/rules/CBA)',
    ditahanRugi: 'Detained by authorities, harming the company', ditahanTidakRugi: 'Detained by authorities, not harming the company',
    sakit: 'Long-term illness / work-accident disability > 12 months', pensiun: 'Reaching retirement age',
    meninggal: 'Worker passed away (paid to heirs)'
  }
});

const SEV_COMMON = ['efRugi', 'efCegah', 'tutupBukanRugi', 'pailit', 'sp3', 'resign', 'sakit', 'pensiun', 'meninggal'];
const SEV_KEY_RE = /^\d{4}-\d{2}-\d{2}$/;
calc({
  id: 'pesangon', icon: 'logOut', color: '#5b6b87', title: 'sevTitle', short: 'sevShort', sub: 'sevSub',
  defaults: {
    status: 'pkwtt', mulai: '', akhir: '', pakaiGaji: true, upah: 4000000, alasan: 'efCegah',
    cutiHari: 0, hariKerja: 0, biayaPulang: 0, lainUph: 0, uangPisah: 0, pkwtFinal: true
  },
  ui: { all: false },
  clean(o) {
    const today = todayKey();
    if (!SEV_KEY_RE.test(o.akhir)) o.akhir = today;
    if (!SEV_KEY_RE.test(o.mulai)) { // bawaan: tepat 5 tahun sebelum hari ini
      const d = new Date(+today.slice(0, 4) - 5, +today.slice(5, 7) - 1, +today.slice(8, 10) + 1);
      o.mulai = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    }
    if (o.status !== 'pkwt') o.status = 'pkwtt';
    if (!SEV_REASONS.some((r) => r.id === o.alasan)) o.alasan = 'efCegah';
    o.hariKerja = o.hariKerja === 5 || o.hariKerja === 6 ? o.hariKerja : 0; // 0 = ikut Nilai Waktu
    o.cutiHari = clamp(Math.round(o.cutiHari), 0, 365);
    ['upah', 'biayaPulang', 'lainUph', 'uangPisah'].forEach((k) => { o[k] = clamp(Math.round(o[k]), 0, 999999999999); });
    return o;
  },
  onSet(key, v) {
    if (key === 'pakaiGaji' && !v) inp('pesangon').upah = Math.round(netSalary().upah); // mulai dari angka Gaji Bersih
  },
  view: sevView,
  summary() {
    const s = sevState();
    if (s.o.pakaiGaji && gajiEmpty()) return { value: t('sumGajiEmpty'), sub: t('sumGajiEmptySub') };
    const tt = sevTenureText(s.R.tenure, s.R.pkwt);
    return { value: rp(s.R.net), sub: s.R.pkwt ? t('sevSumPkwt', { t: tt }) : t('sevSumSub', { r: L('sevReasons')[s.R.reason.id], t: tt }) };
  }
});

/** Input efektif: upah dari Gaji Bersih bila dipilih, hari kerja ikut Nilai Waktu bila belum dipilih. */
function sevState() {
  const o = inp('pesangon');
  const upah = o.pakaiGaji ? Math.max(0, netSalary().upah) : o.upah;
  const hk = o.hariKerja || (inp('waktu').hariKerja === 6 ? 6 : 5);
  const input = Object.assign({}, o, { upah, hariKerja: hk });
  return { o, upah, hk, input, R: sevCalc(input) };
}
function sevTenureText(ten, days) {
  if (!ten.valid) return '–';
  const parts = [];
  if (ten.years) parts.push(t('yearsN', { n: ten.years }));
  if (ten.months || !ten.years) parts.push(t('monthsN', { n: ten.months }));
  if ((days || !ten.years) && ten.days) parts.push(t('sevDaysN', { n: ten.days }));
  return parts.join(' ');
}
const sevMult = (k) => (k ? num(k, 2) + '×' : '–');
function sevHeroHtml(R) {
  return '<span class="lbl">' + esc(t('sevHeroLbl')) + '</span><span class="big">' + esc(rp(R.net)) + '</span>' +
    heroCells([[t('sevHeroGross'), esc(rp(R.gross))], [t('sevHeroTax'), esc(rp(R.tax))]]) +
    heroLine(esc(R.pkwt ? t('sevHeroPkwt') : L('sevReasons')[R.reason.id]), esc(sevTenureText(R.tenure, R.pkwt)));
}
function sevDetailHtml(R, cuti) {
  let h = '<div class="rows">' + row(t('sevRowTenure'), esc(sevTenureText(R.tenure, true))) + row(t('sevRowUpah'), esc(rp(R.upah)));
  if (R.pkwt) {
    h += row(t('sevRowKomp', { m: num(R.tenure.monthsExact, 2) }), esc(rp(R.kompensasi)));
  } else {
    const r = R.reason;
    h += row(t('sevRowUp', { m: R.upMonths, k: sevMult(r.up) }), esc(rp(R.up))) + row(t('sevRowUpmk', { m: R.upmkMonths, k: sevMult(r.upmk) }), esc(rp(R.upmk))) +
      (cuti > 0 ? row(t('sevRowCuti', { d: num(cuti, 0), rp: rp(R.daily) }), esc(rp(R.uphCuti))) : '') +
      (R.biayaPulang ? row(t('sevRowPulang'), esc(rp(R.biayaPulang))) : '') + (R.lainUph ? row(t('sevRowLain'), esc(rp(R.lainUph))) : '') +
      (r.pisah ? row(t('sevRowPisah'), esc(rp(R.pisah))) : '');
  }
  h += row(t('sevRowGross'), esc(rp(R.gross))) + row(t('sevRowTax'), '− ' + esc(rp(R.tax)), 'neg') + row(t('sevRowNet'), esc(rp(R.net)), 'total') + '</div>';
  if (R.pkwt && R.tenure.valid && R.tenure.monthsExact < 1) h += '<p class="hint warn">' + esc(t('sevKompMin')) + '</p>';
  if (R.pkwt && R.tenure.monthsExact > 60) h += '<p class="hint warn">' + esc(t('sevPkwtMax')) + '</p>';
  if (R.pkwt && R.taxable < R.gross) h += '<p class="hint" style="margin-top:8px">' + esc(t('sevKompNoTax')) + '</p>';
  const used = R.layers.filter((l) => l.base > 0);
  if (used.length) {
    h += '<div class="fire-sec"><h3>' + esc(t('sevLayers')) + '</h3></div><div class="rows">' +
      used.map((l) => row(t('sevLayer', { r: num(l.rate, 0), base: rp(l.base) }), esc(rp(l.tax)))).join('') + '</div>';
  }
  return h;
}
function sevCmpHtml(s, all) {
  const list = sevCompare(s.input);
  const cur = s.o.alasan;
  const shown = list.filter((x) => all || SEV_COMMON.indexOf(x.id) >= 0 || x.id === cur);
  return '<div class="tbl-wrap"><table class="cmp-table"><thead><tr><th scope="col" style="text-align:left">' + esc(t('sevCmpReason')) + '</th><th scope="col">UP</th><th scope="col">UPMK</th><th scope="col">' + esc(t('sevCmpNet')) + '</th></tr></thead><tbody>' +
    shown.map((x) => {
      const on = x.id === cur;
      const lbl = esc(L('sevReasons')[x.id]) + ' <span class="dim">· ' + esc(x.reason.pasal) + '</span>';
      return '<tr class="txt"><th scope="row">' + (on ? '<b style="color:var(--text)">' + lbl + '</b>' : lbl) + '</th><td>' + sevMult(x.reason.up) + '</td><td>' + sevMult(x.reason.upmk) + '</td>' +
        '<td' + (on ? ' class="win"' : '') + '>' + esc(rp(x.net)) + '</td></tr>';
    }).join('') + '</tbody></table></div>';
}
function sevView() {
  const s = sevState();
  const o = s.o, R = s.R, pkwt = R.pkwt;
  const r = R.reason;
  const top = hero(sevHeroHtml(R), { order: 1, label: t('sevHeroLbl') });
  const job = card(t('sevJobTitle'),
    fSegField('pesangon.status', t('sevStatusL'), [['pkwtt', t('sevPkwtt')], ['pkwt', t('sevPkwt')]]) +
    '<div class="row2">' + fDate('pesangon.mulai', t('sevStartL'), { max: o.akhir }) + fDate('pesangon.akhir', t('sevEndL'), { min: o.mulai }) + '</div>' +
    '<p class="hint' + (R.tenure.valid ? '' : ' warn') + '" data-live="sevTenure" style="margin-top:6px">' +
    esc(R.tenure.valid ? t('sevTenureL', { v: sevTenureText(R.tenure, true) }) : t('sevTenureBad')) + '</p>' +
    '<div style="margin-top:8px">' + fToggle('pesangon.pakaiGaji', t('sevUseGaji'), esc(t('sevUseGajiSub', { rp: rp(netSalary().upah) })) + gajiLink(), { live: 'sevUseGaji' }) + '</div>' +
    (o.pakaiGaji ? '' : fMoney('pesangon.upah', t('sevUpahL'), { hint: esc(t('sevUpahHint')) + ' ' + manualOnlyHint() })) +
    (pkwt ? '<div style="margin-top:4px">' + fToggle('pesangon.pkwtFinal', t('sevPkwtFinal'), esc(t('sevPkwtFinalSub'))) + '</div>' :
      fSelect('pesangon.alasan', t('sevAlasanL'), SEV_REASONS.map((x) => [x.id, L('sevReasons')[x.id]]),
        { hint: esc(t('sevAlasanHint', { p: r.pasal, up: sevMult(r.up), upmk: sevMult(r.upmk), pisah: r.pisah ? t('sevPisahTag') : '' })) })), { order: 2, tight: true });
  let uph = '';
  if (!pkwt) {
    const hari = '<div class="field"><span class="label">' + esc(t('sevHariL')) + '</span><div class="seg" role="group" aria-label="' + esc(t('sevHariL')) + '">' +
      [5, 6].map((n) => '<button type="button" data-act="set" data-k="pesangon.hariKerja" data-num="1" data-v="' + n + '" aria-pressed="' + (s.hk === n) + '">' + esc(t('sevHariN', { n })) + '</button>').join('') + '</div>' +
      '<span class="hint" data-live="sevDaily">' + esc(t('sevDailyHint', { rp: rp(R.daily), d: s.hk === 6 ? 25 : 21 })) + '</span></div>';
    uph = card(t('sevUphTitle'), fNum('pesangon.cutiHari', t('sevCutiL'), { min: 0, max: 365, suffix: t('sevCutiSuffix') }) + hari +
      fMoney('pesangon.biayaPulang', t('sevPulangL'), { hint: esc(t('sevPulangHint')) }) + fMoney('pesangon.lainUph', t('sevLainL')) +
      (r.pisah ? fMoney('pesangon.uangPisah', t('sevPisahL'), { hint: esc(t('sevPisahHint')) }) : '<p class="hint" style="margin-top:12px">' + esc(t('sevNoPisah')) + '</p>'), { order: 3, tight: true });
  }
  const detail = card(t('sevDetail'), '<div data-live="sevDetail">' + sevDetailHtml(R, o.cutiHari) + '</div>', { order: 4 });
  const all = !!ui('pesangon').all;
  const cmp = pkwt ? '' : card(t('sevCmpTitle'), '<div data-live="sevCmp">' + sevCmpHtml(s, all) + '</div>' +
    '<button type="button" class="link-btn" data-act="ui" data-k="pesangon.all" aria-expanded="' + all + '">' + esc(all ? t('sevShowLess') : t('sevShowAll', { n: SEV_REASONS.length })) + '</button>',
  { order: 5, small: esc(t('sevCmpSub')) });
  // HP: hero → input → hasil (urut order); desktop: kiri hasil, kanan input
  return cols((o.pakaiGaji && gajiEmpty() ? needGajiCard() : '') + top, detail + cmp, job + uph, note(esc(t(pkwt ? 'sevNotePkwt' : 'sevNote')), 6));
}
