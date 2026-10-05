/**
 * Tarif PPh 21 & BPJS untuk Kalkulator Gaji Bersih (diambil dari Habit Tracker → Salary.gs).
 * Persen ditulis sebagai angka persen: 1 = 1%. Ubah angka di sini bila aturan berubah,
 * lalu jalankan `npm test`.
 *
 * Dasar aturan (dicek Oktober 2026):
 *   - PPh 21 TER: PP 58/2023 & PMK 168/2023 (Kategori A 44 lapis, B 40, C 41)
 *   - PTKP: PMK 101/PMK.010/2016 (tidak berubah di 2026)
 *   - BPJS Kesehatan PPU: 1% pekerja, 4% pemberi kerja, batas upah Rp12 juta
 *   - Batas upah Jaminan Pensiun mulai Maret 2026: Rp11.086.300
 *   - PPh 21 DTP 2026: PMK 105/2025 (bruto ≤ Rp10 juta, sektor tertentu)
 */
var TARIF = {
  config: {
    TAHUN_ATURAN: 2026,
    BPJS_KES_PEKERJA: 1,          // BPJS Kesehatan yang dipotong dari gaji (%)
    BPJS_KES_PERUSAHAAN: 4,       // BPJS Kesehatan yang dibayar perusahaan (%)
    BPJS_KES_BATAS_UPAH: 12000000, // batas upah dasar iuran BPJS Kesehatan (Rp/bln)
    JHT_PEKERJA: 2,
    JHT_PERUSAHAAN: 3.7,
    JP_PEKERJA: 1,
    JP_PERUSAHAAN: 2,
    JP_BATAS_UPAH: 11086300,      // batas upah Jaminan Pensiun mulai Maret 2026; biasanya naik tiap Maret
    JKM: 0.3,
    JKK_SANGAT_RENDAH: 0.24,
    JKK_RENDAH: 0.54,
    JKK_SEDANG: 0.89,
    JKK_TINGGI: 1.27,
    JKK_SANGAT_TINGGI: 1.74,
    BIAYA_JABATAN: 5,             // % dari bruto setahun
    BIAYA_JABATAN_MAKS: 6000000,  // Rp per tahun
    PTKP_DASAR: 54000000,
    PTKP_KAWIN: 4500000,
    PTKP_TANGGUNGAN: 4500000,     // per tanggungan, maksimal 3
    DTP_BATAS_BRUTO: 10000000     // batas bruto bulanan insentif PPh 21 DTP 2026 (PMK 105/2025)
  },
  // Tarif progresif Pasal 17: [batas atas PKP setahun, tarif %]; null = tanpa batas
  brackets: [[60000000, 5], [250000000, 15], [500000000, 25], [5000000000, 30], [null, 35]],
  // Tarif Efektif Rata-rata bulanan: [batas atas bruto, tarif %]; null = tanpa batas
  ter: {
    A: [[5400000, 0], [5650000, 0.25], [5950000, 0.5], [6300000, 0.75], [6750000, 1], [7500000, 1.25],
      [8550000, 1.5], [9650000, 1.75], [10050000, 2], [10350000, 2.25], [10700000, 2.5], [11050000, 3],
      [11600000, 3.5], [12500000, 4], [13750000, 5], [15100000, 6], [16950000, 7], [19750000, 8],
      [24150000, 9], [26450000, 10], [28000000, 11], [30050000, 12], [32400000, 13], [35400000, 14],
      [39100000, 15], [43850000, 16], [47800000, 17], [51400000, 18], [56300000, 19], [62200000, 20],
      [68600000, 21], [77500000, 22], [89000000, 23], [103000000, 24], [125000000, 25], [157000000, 26],
      [206000000, 27], [337000000, 28], [454000000, 29], [550000000, 30], [695000000, 31], [910000000, 32],
      [1400000000, 33], [null, 34]],
    B: [[6200000, 0], [6500000, 0.25], [6850000, 0.5], [7300000, 0.75], [9200000, 1], [10750000, 1.5],
      [11250000, 2], [11600000, 2.5], [12600000, 3], [13600000, 4], [14950000, 5], [16400000, 6],
      [18450000, 7], [21850000, 8], [26000000, 9], [27700000, 10], [29350000, 11], [31450000, 12],
      [33950000, 13], [37100000, 14], [41100000, 15], [45800000, 16], [49500000, 17], [53800000, 18],
      [58500000, 19], [64000000, 20], [71000000, 21], [80000000, 22], [93000000, 23], [109000000, 24],
      [129000000, 25], [163000000, 26], [211000000, 27], [374000000, 28], [459000000, 29], [555000000, 30],
      [704000000, 31], [957000000, 32], [1405000000, 33], [null, 34]],
    C: [[6600000, 0], [6950000, 0.25], [7350000, 0.5], [7800000, 0.75], [8850000, 1], [9800000, 1.25],
      [10950000, 1.5], [11200000, 1.75], [12050000, 2], [12950000, 3], [14150000, 4], [15550000, 5],
      [17050000, 6], [19500000, 7], [22700000, 8], [26600000, 9], [28100000, 10], [30100000, 11],
      [32600000, 12], [35400000, 13], [38900000, 14], [43000000, 15], [47400000, 16], [51200000, 17],
      [55800000, 18], [60400000, 19], [66700000, 20], [74500000, 21], [83200000, 22], [95600000, 23],
      [110000000, 24], [134000000, 25], [169000000, 26], [221000000, 27], [390000000, 28], [463000000, 29],
      [561000000, 30], [709000000, 31], [965000000, 32], [1419000000, 33], [null, 34]]
  }
};
if (typeof module === 'object' && module.exports) module.exports = { TARIF };
