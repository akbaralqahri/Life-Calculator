/**
 * Mesin hitung Cicilan / KPR. Fungsi murni tanpa DOM — dipakai aplikasi dan diuji di test/.
 * Konvensi bank di Indonesia: bunga bulanan = tarif tahunan ÷ 12.
 * Metode: 'anuitas' (cicilan tetap per fase), 'flat' (bunga dari pokok awal),
 *         'efektif' (pokok tetap + bunga dari sisa pokok, cicilan menurun).
 */

/** Cicilan anuitas per bulan. rate = bunga per bulan (desimal), n = jumlah bulan. */
function loanPmt(principal, rate, n) {
  if (!(principal > 0) || !(n > 0)) return 0;
  if (!(rate > 0)) return principal / n;
  const f = Math.pow(1 + rate, n);
  return principal * rate * f / (f - 1);
}

/** Batasi angka ke rentang (helper lokal; engine tidak memakai app.js). */
function loanClamp(v, lo, hi) { return Math.max(lo, Math.min(hi, Number(v) || 0)); }

/**
 * Jadwal cicilan.
 * o: { principal, years, method, fixedRate, fixedYears, floatRate, extra }
 *    tarif dalam persen per tahun; extra = bayar ekstra pokok per bulan (Rp).
 * Anuitas: cicilan masa fix dari pokok & tenor penuh; saat masa fix habis cicilan dihitung ulang
 *   dari sisa pokok & sisa tenor (praktik bank). Bayar ekstra tidak mengubah cicilan → tenor memendek.
 * Flat: satu tarif (fixedRate); bunga per bulan = pokok awal × tarif ÷ 12, cicilan = (pokok + bunga) ÷ n.
 *   Bayar ekstra mempercepat pelunasan; bunga bulan yang tidak dijalani tidak ditagih (asumsi ideal).
 * Efektif: pokok tetap pokok ÷ n + bunga dari sisa pokok (tarif fix lalu floating).
 */
function loanSchedule(o) {
  const P = Math.max(0, Number(o.principal) || 0);
  const n = Math.max(0, Math.round((Number(o.years) || 0) * 12));
  const method = o.method === 'flat' || o.method === 'efektif' ? o.method : 'anuitas';
  const fixR = Math.max(0, Number(o.fixedRate) || 0) / 100;
  const flR = Math.max(0, o.floatRate === undefined ? fixR * 100 : Number(o.floatRate) || 0) / 100;
  const fm = method === 'flat' ? n : loanClamp(Math.round((Number(o.fixedYears) || 0) * 12), 0, n);
  const extra = Math.max(0, Number(o.extra) || 0);
  const rateAt = (m) => (method === 'flat' || m <= fm ? fixR : flR); // m = bulan ke- (mulai 1)

  // Cicilan terjadwal tiap fase (tanpa bayar ekstra)
  let pay1 = 0, pay2 = null;
  if (P > 0 && n > 0) {
    if (method === 'anuitas') {
      pay1 = loanPmt(P, rateAt(1) / 12, n);
      if (fm > 0 && fm < n && flR !== fixR) {
        let b = P;
        for (let m = 1; m <= fm; m++) b -= pay1 - b * fixR / 12;
        pay2 = loanPmt(Math.max(0, b), flR / 12, n - fm);
      }
    } else if (method === 'flat') {
      pay1 = (P + P * fixR * n / 12) / n;
    } else {
      pay1 = P / n + P * rateAt(1) / 12;
      if (fm > 0 && fm < n && flR !== fixR) { const b = P - P / n * fm; pay2 = P / n + b * flR / 12; }
    }
  }

  const months = [];
  let bal = P, totInt = 0, totPaid = 0, totExtra = 0;
  const cap = n * 2 + 1; // pengaman
  for (let m = 1; bal > 0.005 && m <= Math.min(n, cap); m++) {
    const r = rateAt(m);
    let interest, sched; // sched = pokok terjadwal (tanpa ekstra)
    if (method === 'flat') {
      interest = P * r / 12;
      sched = P / n;
    } else if (method === 'efektif') {
      interest = bal * r / 12;
      sched = P / n;
    } else {
      interest = bal * r / 12;
      const pay = m <= fm || pay2 === null ? pay1 : pay2;
      sched = pay - interest;
    }
    if (m === n) sched = bal; // bulan terakhir: lunasi sisa (pembulatan)
    sched = Math.min(bal, Math.max(0, sched));
    const ext = Math.min(bal - sched, extra);
    const principal = sched + ext;
    bal = Math.max(0, bal - principal);
    if (bal < 0.005) bal = 0;
    totInt += interest;
    totPaid += interest + principal;
    totExtra += ext;
    months.push({ m, rate: r * 100, pay: interest + sched, interest, principal, extra: ext, balance: bal });
  }

  // Ringkasan per tahun
  const years = [];
  let cum = 0;
  for (let i = 0; i < months.length; i += 12) {
    const part = months.slice(i, i + 12);
    const y = { year: i / 12 + 1, months: part.length, pay: 0, payAvg: 0, principal: 0, interest: 0, extra: 0, balance: part[part.length - 1].balance, cumInterest: 0 };
    part.forEach((x) => { y.pay += x.pay; y.principal += x.principal; y.interest += x.interest; y.extra += x.extra; });
    y.payAvg = y.pay / part.length;
    cum += y.interest;
    y.cumInterest = cum;
    years.push(y);
  }
  const payMax = months.reduce((a, x) => Math.max(a, x.pay), 0);
  return {
    principal: P, n, method, fixedMonths: fm, pay1, pay2,
    payFirst: months.length ? months[0].pay : 0, payLast: months.length ? months[months.length - 1].pay : 0, payMax,
    months, years, totalInterest: totInt, totalPaid: totPaid, totalExtra: totExtra, monthsToPayoff: months.length
  };
}

/**
 * Plafon pinjaman maksimal untuk cicilan per bulan tertentu (kebalikan PMT).
 * rate = persen per tahun. method 'flat': cicilan = P/n + P·r/12; 'efektif': cicilan pertama (terbesar).
 */
function loanMaxPrincipal(payment, rate, years, method) {
  const pay = Math.max(0, Number(payment) || 0);
  const n = Math.max(0, Math.round((Number(years) || 0) * 12));
  const r = Math.max(0, Number(rate) || 0) / 100 / 12;
  if (!(pay > 0) || !(n > 0)) return 0;
  if (method === 'flat' || method === 'efektif') return pay / (1 / n + r);
  if (!(r > 0)) return pay * n;
  return pay * (1 - Math.pow(1 + r, -n)) / r;
}

/** Dampak bayar ekstra: bulan lebih cepat & bunga yang dihemat. */
function loanExtraEffect(o) {
  const base = loanSchedule(Object.assign({}, o, { extra: 0 }));
  const fast = loanSchedule(o);
  return {
    base, fast,
    monthsSaved: Math.max(0, base.monthsToPayoff - fast.monthsToPayoff),
    interestSaved: Math.max(0, base.totalInterest - fast.totalInterest)
  };
}

/** Bunga efektif (anuitas, %/thn) yang setara dengan bunga flat — bisection 60 langkah. */
function loanFlatToEffective(flatRate, years) {
  const n = Math.max(0, Math.round((Number(years) || 0) * 12));
  const f = Math.max(0, Number(flatRate) || 0);
  if (!(n > 0) || !(f > 0)) return f;
  const pay = (1 + f / 100 * n / 12) / n;
  let lo = 0, hi = 400;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (loanPmt(1, mid / 100 / 12, n) < pay) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

/** Rasio cicilan terhadap penghasilan (persen) + status: ≤30 aman, 30–40 waspada, >40 berat. */
function loanRatio(payment, income) {
  if (!(income > 0)) return { pct: null, status: 'none' };
  const pct = payment / income * 100;
  return { pct, status: pct <= 30 ? 'safe' : pct <= 40 ? 'watch' : 'heavy' };
}

if (typeof module === 'object' && module.exports) module.exports = { loanPmt, loanSchedule, loanMaxPrincipal, loanExtraEffect, loanFlatToEffective, loanRatio };
