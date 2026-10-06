'use strict';
/* =====================================================================
 * Hidup → Kalkulator Zakat: zakat penghasilan (profesi), zakat maal, zakat fitrah.
 * Rumus di js/engine/zakat.js. Nisab penghasilan bawaan = SK Ketua BAZNAS No. 15/2026;
 * nisab maal = 85 g × harga emas (input, bawaan harga Antam terbaru yang ditemukan).
 * ===================================================================== */

Object.assign(I18N.id, {
  zkTitle: 'Kalkulator Zakat', zkShort: 'Zakat', zkSub: 'Penghasilan, maal & fitrah',
  zkTabInc: 'Penghasilan', zkTabMaal: 'Maal', zkTabFit: 'Fitrah',
  // emas & nisab
  zkGoldTitle: 'Harga emas & nisab', zkGoldL: 'Harga emas per gram',
  zkGoldHint: 'Bawaan: harga jual emas Antam 1 g di Logam Mulia, {d} ({rp}). Harga emas berubah setiap hari — perbarui dengan harga hari ini.',
  zkNisabYear: 'Nisab setahun (85 g emas)', zkNisabMonth: 'Nisab per bulan (÷ 12)',
  // penghasilan
  zkIncData: 'Data penghasilan', zkMethodL: 'Metode perhitungan', zkBruto: 'Bruto (BAZNAS)', zkNeto: 'Neto',
  zkBrutoHint: 'Ketentuan BAZNAS: zakat 2,5% dari penghasilan kotor, tanpa dikurangi kebutuhan.',
  zkNetoHint: 'Pendapat sebagian ulama: penghasilan dikurangi kebutuhan pokok & cicilan dulu. Bukan ketentuan BAZNAS.',
  zkUseGaji: 'Pakai gaji dari Gaji Bersih', zkUseGajiSub: '{rp} / bln · {what}', zkPay: 'gaji kotor (pokok + tunjangan)', zkThp: 'gaji bersih (take-home)',
  zkGajiL: 'Penghasilan / bulan', zkLainL: 'Penghasilan lain / bulan', zkLainHint: 'Usaha sampingan, honor, sewa, dll.',
  zkBonusL: 'Bonus / THR setahun', zkBonusHint: 'Zakatnya dibayar saat bonus diterima.',
  zkNeedL: 'Kebutuhan pokok / bulan', zkDebtL: 'Cicilan utang / bulan',
  zkNisabSrcL: 'Nisab yang dipakai', zkSrcBaznas: 'SK BAZNAS 2026', zkSrcEmas: '85 g × harga emas',
  zkNisabSrcHint: 'SK Ketua BAZNAS No. 15/2026: {m} / bln ({y} / thn). Pilihan kedua memakai harga emas di atas.',
  zkIncRes: 'Hasil zakat penghasilan', zkIncGross: 'Penghasilan / bulan', zkIncCut: 'Kebutuhan pokok & cicilan', zkIncBase: 'Dasar zakat / bulan',
  zkIncBonus: 'Bonus / THR setahun', zkIncYear: 'Penghasilan setahun', zkIncAvg: 'Rata-rata / bulan', zkIncNisab: 'Nisab / bulan',
  zkWajib: 'Wajib zakat', zkWajibIncSub: 'Rata-rata penghasilan ≥ nisab bulanan. Zakat 2,5% tiap kali menerima penghasilan.',
  zkBelum: 'Belum wajib zakat', zkBelumSub: 'Kurang {rp} dari nisab. Sedekah/infak tetap dianjurkan.',
  zkPerMonth: 'Zakat / bulan', zkOnBonus: 'Zakat bonus / THR', zkPerYear: 'Zakat setahun',
  zkHeroInc: 'Zakat penghasilan per bulan', zkHeroYear: 'Setahun', zkHeroNisab: 'Nisab / bulan',
  // maal
  zkMaalData: 'Harta yang dimiliki', zkKas: 'Uang tunai, tabungan & deposito', zkEmasG: 'Emas', zkPerakG: 'Perak (opsional)', zkGram: 'g',
  zkPerakPrice: 'Harga perak per gram', zkPerakHint: 'Bawaan: harga perak Antam per gram, {d} ({rp}). Perbarui dengan harga hari ini.',
  zkInvest: 'Investasi (saham, reksa dana, obligasi)', zkInvestHint: 'Nilai pasar saat ini.',
  zkPiutang: 'Piutang lancar', zkPiutangHint: 'Yang yakin akan dibayar.', zkUsaha: 'Aset usaha / stok dagang',
  zkUtang: 'Utang jatuh tempo', zkUtangHint: 'Hanya cicilan/utang yang jatuh tempo saat ini, bukan seluruh sisa pokok KPR.',
  zkHaul: 'Sudah dimiliki 1 tahun (haul)', zkHaulSub: 'Harta mencapai nisab selama 1 tahun hijriah.',
  zkMaalRes: 'Hasil zakat maal', zkRowEmas: 'Emas {g} g', zkRowPerak: 'Perak {g} g', zkTotal: 'Total harta', zkBersih: 'Harta bersih', zkNisab: 'Nisab (85 g emas)',
  zkWajibMaalSub: 'Harta bersih ≥ nisab dan sudah haul.', zkBelumHaul: 'Sudah mencapai nisab, belum haul', zkBelumHaulSub: 'Zakat wajib setelah harta dimiliki genap 1 tahun.',
  zkNoGold: 'Isi harga emas untuk menghitung nisab.',
  zkZakatMaal: 'Zakat maal (2,5%)', zkHeroMaal: 'Zakat maal', zkHeroBersih: 'Harta bersih',
  // fitrah
  zkFitData: 'Zakat fitrah', zkJiwa: 'Jumlah jiwa', zkJiwaSuffix: 'jiwa', zkJiwaHint: 'Diri sendiri & tanggungan (pasangan, anak, dll.).',
  zkFitMode: 'Dibayar dengan', zkFitUang: 'Uang', zkFitBeras: 'Harga beras',
  zkPerJiwa: 'Nominal per jiwa', zkPerJiwaHint: 'Bawaan: SK Ketua BAZNAS No. 14/2026, Jabodetabek ({rp}). BAZNAS daerah bisa menetapkan nilai lain.',
  zkBerasL: 'Harga beras per kg', zkBerasHint: '2,5 kg beras (makanan pokok) per jiwa.',
  zkFitRes: 'Hasil zakat fitrah', zkRowPerJiwa: 'Per jiwa', zkRowJiwa: 'Jumlah jiwa', zkRowBeras: 'Setara beras', zkKg: '{n} kg', zkFitTotal: 'Total zakat fitrah',
  zkHeroFit: 'Zakat fitrah {n} jiwa',
  // catatan & ringkasan
  zkNoteInc: 'Dasar: UU 23/2011 tentang Pengelolaan Zakat; PMA 52/2014 jo. PMA 31/2019 (nisab zakat pendapatan & jasa setara 85 g emas, kadar 2,5%); SK Ketua BAZNAS No. 15/2026 (nisab 2026: {m}/bln atau {y}/thn dari penghasilan bruto). ' +
    'Pajak: zakat penghasilan yang dibayar lewat BAZNAS atau LAZ resmi (terdaftar di DJP) dapat dikurangkan dari penghasilan bruto — bukan dari pajak terutang — dengan bukti setor yang sah (UU 23/2011 Pasal 22–23, UU PPh Pasal 9 ayat (1) huruf g, PP 60/2010, PMK 114/2025). Estimasi edukatif, bukan fatwa — tanyakan ke amil/ulama bila ragu.',
  zkNoteMaal: 'Zakat maal 2,5% bila harta bersih ≥ nisab 85 g emas dan sudah haul (PMA 52/2014 jo. PMA 31/2019). Rumah tinggal, kendaraan pribadi, perabot, dan barang kebutuhan sehari-hari tidak dihitung. Aset usaha dihitung dari aset lancar dikurangi utang jangka pendek. Estimasi edukatif, bukan fatwa.',
  zkNoteFit: 'SK Ketua BAZNAS No. 14/2026: zakat fitrah {rp} per jiwa untuk Jabodetabek (setara 2,5 kg / 3,5 liter beras premium). BAZNAS provinsi/kab/kota boleh menetapkan nilai lain sesuai harga beras setempat. Ditunaikan paling lambat sebelum salat Idulfitri.',
  zkSumNot: 'Belum wajib zakat penghasilan', zkSumNisab: 'Nisab {rp} / bln', zkSumMaal: 'Zakat maal {rp}'
});
Object.assign(I18N.en, {
  zkTitle: 'Zakat Calculator', zkShort: 'Zakat', zkSub: 'Income, wealth & fitrah',
  zkTabInc: 'Income', zkTabMaal: 'Wealth', zkTabFit: 'Fitrah',
  zkGoldTitle: 'Gold price & nisab', zkGoldL: 'Gold price per gram',
  zkGoldHint: 'Default: Antam 1 g selling price at Logam Mulia, {d} ({rp}). Gold prices change daily — update it with today\'s price.',
  zkNisabYear: 'Yearly nisab (85 g gold)', zkNisabMonth: 'Monthly nisab (÷ 12)',
  zkIncData: 'Income details', zkMethodL: 'Calculation method', zkBruto: 'Gross (BAZNAS)', zkNeto: 'Net',
  zkBrutoHint: 'BAZNAS rule: 2.5% of gross income, without deducting living costs.',
  zkNetoHint: 'A view held by some scholars: deduct basic needs & debt instalments first. Not the BAZNAS rule.',
  zkUseGaji: 'Use salary from Net Salary', zkUseGajiSub: '{rp} / mo · {what}', zkPay: 'gross pay (base + allowances)', zkThp: 'take-home pay',
  zkGajiL: 'Income / month', zkLainL: 'Other income / month', zkLainHint: 'Side business, fees, rent, etc.',
  zkBonusL: 'Bonus / THR per year', zkBonusHint: 'Its zakat is paid when the bonus is received.',
  zkNeedL: 'Basic needs / month', zkDebtL: 'Debt instalments / month',
  zkNisabSrcL: 'Nisab used', zkSrcBaznas: 'BAZNAS 2026 decree', zkSrcEmas: '85 g × gold price',
  zkNisabSrcHint: 'BAZNAS Chair Decree No. 15/2026: {m} / mo ({y} / yr). The second option uses the gold price above.',
  zkIncRes: 'Income zakat result', zkIncGross: 'Income / month', zkIncCut: 'Basic needs & instalments', zkIncBase: 'Zakat base / month',
  zkIncBonus: 'Bonus / THR per year', zkIncYear: 'Yearly income', zkIncAvg: 'Average / month', zkIncNisab: 'Nisab / month',
  zkWajib: 'Zakat is due', zkWajibIncSub: 'Average income ≥ monthly nisab. Pay 2.5% each time income is received.',
  zkBelum: 'Zakat not due yet', zkBelumSub: '{rp} below the nisab. Voluntary charity (sadaqah/infaq) is still encouraged.',
  zkPerMonth: 'Zakat / month', zkOnBonus: 'Zakat on bonus / THR', zkPerYear: 'Zakat per year',
  zkHeroInc: 'Income zakat per month', zkHeroYear: 'Per year', zkHeroNisab: 'Nisab / month',
  zkMaalData: 'What you own', zkKas: 'Cash, savings & deposits', zkEmasG: 'Gold', zkPerakG: 'Silver (optional)', zkGram: 'g',
  zkPerakPrice: 'Silver price per gram', zkPerakHint: 'Default: Antam silver price per gram, {d} ({rp}). Update it with today\'s price.',
  zkInvest: 'Investments (stocks, mutual funds, bonds)', zkInvestHint: 'Current market value.',
  zkPiutang: 'Collectible receivables', zkPiutangHint: 'Money you are confident will be repaid.', zkUsaha: 'Business assets / inventory',
  zkUtang: 'Debts due now', zkUtangHint: 'Only instalments/debts currently due, not the whole remaining mortgage.',
  zkHaul: 'Held for 1 year (haul)', zkHaulSub: 'Wealth stayed above nisab for one lunar year.',
  zkMaalRes: 'Wealth zakat result', zkRowEmas: 'Gold {g} g', zkRowPerak: 'Silver {g} g', zkTotal: 'Total wealth', zkBersih: 'Net wealth', zkNisab: 'Nisab (85 g gold)',
  zkWajibMaalSub: 'Net wealth ≥ nisab and held for a year.', zkBelumHaul: 'Nisab reached, haul not complete', zkBelumHaulSub: 'Zakat is due once the wealth has been held for a full year.',
  zkNoGold: 'Enter the gold price to calculate the nisab.',
  zkZakatMaal: 'Wealth zakat (2.5%)', zkHeroMaal: 'Wealth zakat (maal)', zkHeroBersih: 'Net wealth',
  zkFitData: 'Zakat fitrah', zkJiwa: 'Number of people', zkJiwaSuffix: 'people', zkJiwaHint: 'Yourself & dependants (spouse, children, etc.).',
  zkFitMode: 'Paid as', zkFitUang: 'Cash', zkFitBeras: 'Rice price',
  zkPerJiwa: 'Amount per person', zkPerJiwaHint: 'Default: BAZNAS Chair Decree No. 14/2026, Greater Jakarta ({rp}). Regional BAZNAS may set a different amount.',
  zkBerasL: 'Rice price per kg', zkBerasHint: '2.5 kg of rice (staple food) per person.',
  zkFitRes: 'Zakat fitrah result', zkRowPerJiwa: 'Per person', zkRowJiwa: 'People', zkRowBeras: 'Rice equivalent', zkKg: '{n} kg', zkFitTotal: 'Total zakat fitrah',
  zkHeroFit: (v) => 'Zakat fitrah for ' + v.n + (v.n === 1 ? ' person' : ' people'),
  zkNoteInc: 'Basis: Law 23/2011 on Zakat Management; Minister of Religious Affairs Reg. 52/2014 as amended by Reg. 31/2019 (income zakat nisab = 85 g gold, rate 2.5%); BAZNAS Chair Decree No. 15/2026 (2026 nisab: {m}/mo or {y}/yr of gross income). ' +
    'Tax: income zakat paid through BAZNAS or an official LAZ (registered with the tax office) can be deducted from gross income — not from tax due — with a valid receipt (Law 23/2011 Art. 22–23, Income Tax Law Art. 9(1)(g), GR 60/2010, MoF Reg. 114/2025). An educational estimate, not a fatwa — ask a zakat officer or scholar if unsure.',
  zkNoteMaal: 'Wealth zakat is 2.5% when net wealth ≥ the 85 g gold nisab and has been held for a year (Reg. 52/2014 as amended by Reg. 31/2019). Your home, personal vehicle, furniture and everyday items are excluded. Business assets = current assets minus short-term debts. An educational estimate, not a fatwa.',
  zkNoteFit: 'BAZNAS Chair Decree No. 14/2026: zakat fitrah of {rp} per person for Greater Jakarta (≈ 2.5 kg / 3.5 litres of premium rice). Provincial/regional BAZNAS may set other amounts based on local rice prices. Pay it before the Eid al-Fitr prayer at the latest.',
  zkSumNot: 'Income zakat not due yet', zkSumNisab: 'Nisab {rp} / mo', zkSumMaal: 'Wealth zakat {rp}'
});

const ZAKAT_MONEY = ['hargaEmas', 'gaji', 'lain', 'bonus', 'kebutuhan', 'cicilan', 'kas', 'hargaPerak', 'investasi', 'piutang', 'usaha', 'utang', 'perJiwa', 'hargaBeras'];
calc({
  id: 'zakat', icon: 'moonStar', color: '#7c5a2e', title: 'zkTitle', short: 'zkShort', sub: 'zkSub',
  defaults: {
    hargaEmas: ZAKAT_REF.hargaEmas,
    metode: 'bruto', nisabSrc: 'baznas', pakaiGaji: true, gaji: 10000000, lain: 0, bonus: 0, kebutuhan: 0, cicilan: 0,
    kas: 200000000, emasGram: 10, perakGram: 0, hargaPerak: ZAKAT_REF.hargaPerak, investasi: 30000000, piutang: 0, usaha: 0, utang: 0, haul: true,
    jiwa: 4, fitrahMode: 'uang', perJiwa: ZAKAT_REF.fitrahBaznas, hargaBeras: ZAKAT_REF.hargaBeras
  },
  ui: { tab: 'inc' },
  clean(o) {
    ZAKAT_MONEY.forEach((k) => { o[k] = clamp(Math.round(o[k]), 0, 999999999999999); });
    o.emasGram = clamp(o.emasGram, 0, 1000000);
    o.perakGram = clamp(o.perakGram, 0, 10000000);
    o.jiwa = clamp(Math.round(o.jiwa), 0, 100);
    if (o.metode !== 'neto') o.metode = 'bruto';
    if (o.nisabSrc !== 'emas') o.nisabSrc = 'baznas';
    if (o.fitrahMode !== 'beras') o.fitrahMode = 'uang';
    return o;
  },
  onSet(key, v) {
    // mulai isian manual dari angka Gaji Bersih, lalu bisa diubah
    if (key === 'pakaiGaji' && !v) { const z = inp('zakat'); z.gaji = Math.round(zakatGajiValue(z.metode)); }
  },
  view: zakatView,
  summary() {
    const s = zakatState();
    const sub = s.maal.zakat > 0 ? t('zkSumMaal', { rp: compactRp(s.maal.zakat) }) : t('zkSumNisab', { rp: rp(s.nisabBulan) });
    return { value: s.inc.wajib ? rp(s.inc.perMonth) + ' ' + t('perMonthShort') : t('zkSumNot'), sub };
  }
});

/** Gaji dari kalkulator Gaji Bersih: bruto → upah + tunjangan tidak tetap; neto → take-home. */
function zakatGajiValue(metode) { const r = netSalary(); return metode === 'neto' ? r.thp : r.pay; }
function zakatState() {
  const z = inp('zakat');
  const gaji = z.pakaiGaji ? Math.max(0, zakatGajiValue(z.metode)) : z.gaji;
  const nisabBulan = z.nisabSrc === 'emas' ? zakatNisab(z.hargaEmas) / 12 : ZAKAT_REF.nisabBulanBaznas;
  return {
    z, gaji, nisabBulan,
    inc: zakatIncome({ metode: z.metode, gaji, lain: z.lain, bonus: z.bonus, kebutuhan: z.kebutuhan, cicilan: z.cicilan, nisabBulan }),
    maal: zakatMaal(z),
    fit: zakatFitrah(z.jiwa, z.fitrahMode, z.perJiwa, z.hargaBeras)
  };
}
function zakatHero(s, tab) {
  if (tab === 'maal') {
    const m = s.maal;
    return '<span class="lbl">' + esc(t('zkHeroMaal')) + '</span><span class="big">' + esc(rp(m.zakat)) + '</span>' +
      heroCells([[t('zkHeroBersih'), esc(rp(m.bersih))], [t('zkNisab'), esc(m.nisab > 0 ? rp(m.nisab) : '–')]]) +
      heroLine(esc(m.wajib ? t('zkWajib') : m.capai ? t('zkBelumHaul') : t('zkBelum')));
  }
  if (tab === 'fit') {
    const f = s.fit;
    return '<span class="lbl">' + esc(t('zkHeroFit', { n: f.jiwa })) + '</span><span class="big">' + esc(rp(f.total)) + '</span>' +
      heroCells([[t('zkRowPerJiwa'), esc(rp(f.perJiwa))], [t('zkRowBeras'), esc(t('zkKg', { n: num(f.berasKg, 1) }))]]);
  }
  const r = s.inc;
  return '<span class="lbl">' + esc(t('zkHeroInc')) + '</span><span class="big">' + esc(rp(r.perMonth)) + ' <small>' + esc(t('perMonthShort')) + '</small></span>' +
    heroCells([[t('zkHeroYear'), esc(rp(r.perYear))], [t('zkHeroNisab'), esc(rp(r.nisabBulan))]]) +
    heroLine(esc(r.wajib ? t('zkWajib') : t('zkBelum')));
}
function zakatStatus(ok, okTitle, okSub, warnTitle, warnSub) {
  return '<div style="margin-top:12px">' + (ok ? callout('check', esc(okTitle), esc(okSub)) : callout('info', esc(warnTitle), esc(warnSub), 'warn')) + '</div>';
}
/** Kartu harga emas (dipakai tab Penghasilan & Maal). */
function zakatGoldCard(z, order) {
  const nisab = zakatNisab(z.hargaEmas);
  return card(t('zkGoldTitle'), fMoney('zakat.hargaEmas', t('zkGoldL'), { hint: esc(t('zkGoldHint', { d: fmtDate(ZAKAT_REF.hargaEmasTgl), rp: rp(ZAKAT_REF.hargaEmas) })) }) +
    '<div class="rows" data-live="zkNisab" style="margin-top:8px">' + row(t('zkNisabYear'), esc(rp(nisab))) + row(t('zkNisabMonth'), esc(rp(nisab / 12))) + '</div>', { order, tight: true });
}
function zakatIncHtml(s) {
  const z = s.z, r = s.inc, neto = z.metode === 'neto';
  const input = card(t('zkIncData'),
    fSegField('zakat.metode', t('zkMethodL'), [['bruto', t('zkBruto')], ['neto', t('zkNeto')]], { hint: esc(t(neto ? 'zkNetoHint' : 'zkBrutoHint')) }) +
    '<div style="margin-top:12px">' + fToggle('zakat.pakaiGaji', t('zkUseGaji'), esc(t('zkUseGajiSub', { rp: rp(zakatGajiValue(z.metode)), what: t(neto ? 'zkThp' : 'zkPay') })) + gajiLink(), { live: 'zkUseGaji' }) + '</div>' +
    (z.pakaiGaji ? '' : fMoney('zakat.gaji', t('zkGajiL'))) +
    fMoney('zakat.lain', t('zkLainL'), { hint: esc(t('zkLainHint')) }) + fMoney('zakat.bonus', t('zkBonusL'), { hint: esc(t('zkBonusHint')) }) +
    (neto ? fMoney('zakat.kebutuhan', t('zkNeedL')) + fMoney('zakat.cicilan', t('zkDebtL')) : '') +
    fSegField('zakat.nisabSrc', t('zkNisabSrcL'), [['baznas', t('zkSrcBaznas')], ['emas', t('zkSrcEmas')]],
      { hint: esc(t('zkNisabSrcHint', { m: rp(ZAKAT_REF.nisabBulanBaznas), y: rp(ZAKAT_REF.nisabTahunBaznas) })) }), { order: 3, tight: true });
  const res = card(t('zkIncRes'), '<div data-live="zkIncRes"><div class="rows">' +
    row(t('zkIncGross'), esc(rp(r.kotor))) + (neto ? row(t('zkIncCut'), '− ' + esc(rp(r.potong)), 'neg') + row(t('zkIncBase'), esc(rp(r.monthly))) : '') +
    (r.bonus > 0 ? row(t('zkIncBonus'), esc(rp(r.bonus))) : '') + row(t('zkIncYear'), esc(rp(r.yearly))) +
    row(t('zkIncAvg'), esc(rp(r.avg))) + row(t('zkIncNisab'), esc(rp(r.nisabBulan))) + '</div>' +
    zakatStatus(r.wajib, t('zkWajib'), t('zkWajibIncSub'), t('zkBelum'), t('zkBelumSub', { rp: rp(r.gap) })) +
    '<div class="rows" style="margin-top:8px">' + row(t('zkPerMonth'), esc(rp(r.perMonth))) + (r.bonus > 0 ? row(t('zkOnBonus'), esc(rp(r.onBonus))) : '') +
    row(t('zkPerYear'), esc(rp(r.perYear)), 'total') + '</div></div>', { order: 4 });
  const gold = z.nisabSrc === 'emas' ? zakatGoldCard(z, 2) : '';
  return { left: res, right: gold + input, note: note(esc(t('zkNoteInc', { m: rp(ZAKAT_REF.nisabBulanBaznas), y: rp(ZAKAT_REF.nisabTahunBaznas) })), 6) };
}
function zakatMaalHtml(s) {
  const z = s.z, m = s.maal;
  const input = card(t('zkMaalData'), fMoney('zakat.kas', t('zkKas')) +
    '<div class="row2">' + fNum('zakat.emasGram', t('zkEmasG'), { min: 0, max: 1000000, dec: true, suffix: t('zkGram') }) +
    fNum('zakat.perakGram', t('zkPerakG'), { min: 0, max: 10000000, dec: true, suffix: t('zkGram') }) + '</div>' +
    (z.perakGram > 0 ? fMoney('zakat.hargaPerak', t('zkPerakPrice'), { hint: esc(t('zkPerakHint', { d: fmtDate(ZAKAT_REF.hargaPerakTgl), rp: rp(ZAKAT_REF.hargaPerak) })) }) : '') +
    fMoney('zakat.investasi', t('zkInvest'), { hint: esc(t('zkInvestHint')) }) + fMoney('zakat.piutang', t('zkPiutang'), { hint: esc(t('zkPiutangHint')) }) +
    fMoney('zakat.usaha', t('zkUsaha')) + fMoney('zakat.utang', t('zkUtang'), { hint: esc(t('zkUtangHint')) }) +
    '<div style="margin-top:12px">' + fToggle('zakat.haul', t('zkHaul'), esc(t('zkHaulSub'))) + '</div>', { order: 3, tight: true });
  const p = m.parts;
  const opt = (label, v) => (v > 0 ? row(label, esc(rp(v))) : '');
  const status = m.nisab <= 0 ? '<p class="hint warn">' + esc(t('zkNoGold')) + '</p>' :
    m.wajib ? zakatStatus(true, t('zkWajib'), t('zkWajibMaalSub')) :
      m.capai ? zakatStatus(false, '', '', t('zkBelumHaul'), t('zkBelumHaulSub')) : zakatStatus(false, '', '', t('zkBelum'), t('zkBelumSub', { rp: rp(m.gap) }));
  const res = card(t('zkMaalRes'), '<div data-live="zkMaalRes"><div class="rows">' +
    row(t('zkKas'), esc(rp(p.kas))) + opt(t('zkRowEmas', { g: num(z.emasGram, 2) }), p.emas) + opt(t('zkRowPerak', { g: num(z.perakGram, 2) }), p.perak) +
    opt(t('zkInvest'), p.investasi) + opt(t('zkPiutang'), p.piutang) + opt(t('zkUsaha'), p.usaha) +
    row(t('zkTotal'), esc(rp(m.total))) + (m.utang > 0 ? row(t('zkUtang'), '− ' + esc(rp(m.utang)), 'neg') : '') +
    row(t('zkBersih'), esc(rp(m.bersih))) + row(t('zkNisab'), esc(m.nisab > 0 ? rp(m.nisab) : '–')) + '</div>' + status +
    '<div class="rows" style="margin-top:8px">' + row(t('zkZakatMaal'), esc(rp(m.zakat)), 'total') + '</div></div>', { order: 4 });
  return { left: res, right: zakatGoldCard(z, 2) + input, note: note(esc(t('zkNoteMaal')), 6) };
}
function zakatFitHtml(s) {
  const z = s.z, f = s.fit;
  const input = card(t('zkFitData'), fNum('zakat.jiwa', t('zkJiwa'), { min: 0, max: 100, suffix: t('zkJiwaSuffix'), hint: esc(t('zkJiwaHint')) }) +
    fSegField('zakat.fitrahMode', t('zkFitMode'), [['uang', t('zkFitUang')], ['beras', t('zkFitBeras')]]) +
    (z.fitrahMode === 'beras' ? fMoney('zakat.hargaBeras', t('zkBerasL'), { hint: esc(t('zkBerasHint')) }) :
      fMoney('zakat.perJiwa', t('zkPerJiwa'), { hint: esc(t('zkPerJiwaHint', { rp: rp(ZAKAT_REF.fitrahBaznas) })) })), { order: 3, tight: true });
  const res = card(t('zkFitRes'), '<div class="rows" data-live="zkFitRes">' + row(t('zkRowPerJiwa'), esc(rp(f.perJiwa))) + row(t('zkRowJiwa'), num(f.jiwa, 0)) +
    row(t('zkRowBeras'), esc(t('zkKg', { n: num(f.berasKg, 1) }))) + row(t('zkFitTotal'), esc(rp(f.total)), 'total') + '</div>', { order: 4 });
  return { left: res, right: input, note: note(esc(t('zkNoteFit', { rp: rp(ZAKAT_REF.fitrahBaznas) })), 6) };
}
function zakatView() {
  const s = zakatState();
  const tab = ui('zakat').tab;
  const tabs = '<div class="seg span2" role="group" aria-label="' + esc(t('zkTitle')) + '" style="order:0">' +
    [['inc', 'zkTabInc'], ['maal', 'zkTabMaal'], ['fit', 'zkTabFit']].map((x) => '<button type="button" data-act="ui" data-k="zakat.tab" data-v="' + x[0] + '" aria-pressed="' + (tab === x[0]) + '">' + esc(t(x[1])) + '</button>').join('') + '</div>';
  const part = tab === 'maal' ? zakatMaalHtml(s) : tab === 'fit' ? zakatFitHtml(s) : zakatIncHtml(s);
  // HP: tab → hero → input → hasil (urut order); desktop: kiri hasil, kanan input
  return cols(tabs + (tab === 'inc' && s.z.pakaiGaji && gajiEmpty() ? needGajiCard() : '') + hero(zakatHero(s, tab), { order: 1, label: t('zkTitle') }), part.left, part.right, part.note);
}
