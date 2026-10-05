/**
 * Mesin hitung Zakat: nisab, zakat penghasilan (profesi), zakat maal, zakat fitrah.
 * Fungsi murni tanpa DOM — dipakai aplikasi dan diuji di test/zakat.test.js.
 *
 * Dasar: UU 23/2011 (Pengelolaan Zakat); PMA 52/2014 jo. PMA 31/2019 (nisab 85 g emas, kadar 2,5%);
 * SK Ketua BAZNAS No. 15/2026 (nisab zakat pendapatan & jasa 2026) dan No. 14/2026 (zakat fitrah 2026).
 */
const ZAKAT_REF = {
  emasGram: 85,          // nisab = 85 gram emas
  perakGram: 595,        // nisab perak (rujukan saja; nisab harta gabungan memakai emas)
  tarif: 2.5,            // persen
  fitrahKg: 2.5,         // 2,5 kg beras per jiwa
  // Harga rujukan (bisa berubah setiap hari — pengguna diminta memperbarui)
  hargaEmas: 2581000, hargaEmasTgl: '2026-10-01',   // harga jual emas Antam 1 g, Logam Mulia
  hargaPerak: 42350, hargaPerakTgl: '2026-09-25',   // harga perak murni Antam per gram
  // SK Ketua BAZNAS No. 15 Tahun 2026 (21 Februari 2026)
  nisabBulanBaznas: 7640144, nisabTahunBaznas: 91681728,
  // SK Ketua BAZNAS No. 14 Tahun 2026 — zakat fitrah Jabodetabek (setara 2,5 kg beras premium)
  fitrahBaznas: 50000, hargaBeras: 20000
};

const zakatPos = (v) => (typeof v === 'number' && isFinite(v) && v > 0 ? v : 0);
const zakatOf = (base) => base * ZAKAT_REF.tarif / 100;

/** Nisab setahun = 85 gram × harga emas per gram. */
function zakatNisab(hargaEmas) { return ZAKAT_REF.emasGram * zakatPos(hargaEmas); }

/**
 * Zakat penghasilan (profesi).
 * o: { metode: 'bruto' | 'neto', gaji, lain, bonus (per tahun), kebutuhan, cicilan (per bulan, hanya neto), nisabBulan }
 * Wajib bila rata-rata penghasilan per bulan (setahun ÷ 12, termasuk bonus) ≥ nisab bulanan —
 * setara membandingkan penghasilan setahun dengan nisab setahun.
 */
function zakatIncome(o) {
  const neto = o.metode === 'neto';
  const kotor = zakatPos(o.gaji) + zakatPos(o.lain);
  const potong = neto ? zakatPos(o.kebutuhan) + zakatPos(o.cicilan) : 0;
  const monthly = Math.max(0, kotor - potong);
  const bonus = zakatPos(o.bonus);
  const yearly = monthly * 12 + bonus;
  const avg = yearly / 12;
  const nisabBulan = zakatPos(o.nisabBulan);
  const wajib = avg > 0 && nisabBulan > 0 && avg >= nisabBulan;
  const perMonth = wajib ? zakatOf(monthly) : 0;
  const onBonus = wajib ? zakatOf(bonus) : 0;
  return {
    kotor, potong, monthly, bonus, yearly, avg, nisabBulan, nisabTahun: nisabBulan * 12, wajib,
    perMonth, onBonus, perYear: perMonth * 12 + onBonus, gap: Math.max(0, nisabBulan - avg)
  };
}

/**
 * Zakat maal (harta simpanan). Rumah tinggal & kendaraan pribadi tidak dimasukkan.
 * o: { kas, emasGram, hargaEmas, perakGram, hargaPerak, investasi, piutang, usaha, utang, haul }
 */
function zakatMaal(o) {
  const emas = zakatPos(o.emasGram) * zakatPos(o.hargaEmas);
  const perak = zakatPos(o.perakGram) * zakatPos(o.hargaPerak);
  const parts = { kas: zakatPos(o.kas), emas, perak, investasi: zakatPos(o.investasi), piutang: zakatPos(o.piutang), usaha: zakatPos(o.usaha) };
  const total = Object.keys(parts).reduce((a, k) => a + parts[k], 0);
  const utang = zakatPos(o.utang);
  const bersih = Math.max(0, total - utang);
  const nisab = zakatNisab(o.hargaEmas);
  const capai = nisab > 0 && bersih > 0 && bersih >= nisab;
  const wajib = capai && !!o.haul;
  return { parts, total, utang, bersih, nisab, capai, haul: !!o.haul, wajib, zakat: wajib ? zakatOf(bersih) : 0, gap: Math.max(0, nisab - bersih) };
}

/**
 * Zakat fitrah: jiwa × nominal per jiwa ('uang'), atau jiwa × 2,5 kg × harga beras ('beras').
 */
function zakatFitrah(jiwa, mode, perJiwa, hargaBeras) {
  const n = Math.max(0, Math.round(zakatPos(jiwa)));
  const per = mode === 'beras' ? ZAKAT_REF.fitrahKg * zakatPos(hargaBeras) : zakatPos(perJiwa);
  return { jiwa: n, perJiwa: per, total: n * per, berasKg: n * ZAKAT_REF.fitrahKg };
}

if (typeof module === 'object' && module.exports) module.exports = { ZAKAT_REF, zakatNisab, zakatIncome, zakatMaal, zakatFitrah };
