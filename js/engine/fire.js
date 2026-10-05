/**
 * Mesin hitung FIRE (Financial Independence, Retire Early). Fungsi murni tanpa DOM.
 * Diambil dari Habit Tracker (WebApp.html, blok CALC) tanpa perubahan rumus.
 */
/**
 * Simulasi FIRE — port runFireSimulation dari proyek Financial tracker (3 skenario,
 * target = pengeluaran setahun ÷ SWR, rekomendasi 3 opsi), ditambah: SWR bisa diatur,
 * usia FIRE, Coast FIRE, dana darurat, dan percepatan dari setoran tambahan (extraMonthly).
 */
function calcFire(s, extraMonthly) {
  const mult = 100 / (s.swr || 4);
  const income = s.monthlyIncome;
  const monthlyNeeds = income * s.needsPct / 100;
  const monthlyEnt = income * s.entPct / 100;
  const monthlyExpenses = monthlyNeeds + monthlyEnt;
  const monthlyInvestment = income * s.invPct / 100;
  const monthlyGold = income * s.goldPct / 100;
  const years = Math.max(0, s.targetAge - s.currentAge);
  const retireAge = s.currentAge + years;
  const mrOf = (r) => Math.pow(1 + r / 100, 1 / 12) - 1;

  function sim(ret, inf, post, grow) {
    let bal = s.currentSavings, exp = monthlyExpenses, inv = monthlyInvestment;
    const mr = mrOf(ret);
    const acc = [];
    for (let y = 0; y <= years; y++) {
      acc.push({ age: s.currentAge + y, balance: bal, target: exp * 12 * mult });
      if (y < years) {
        for (let m = 0; m < 12; m++) bal = bal * (1 + mr) + inv;
        exp *= 1 + inf / 100;
        inv *= 1 + grow / 100;
      }
    }
    // masa pensiun 45 tahun: penarikan naik mengikuti inflasi
    const wdw = [];
    let rb = bal, draw = exp * 12, runOut = null;
    for (let y = 0; y <= 45; y++) {
      wdw.push({ age: retireAge + y, balance: Math.max(0, rb) });
      if (rb <= 0 && runOut === null) runOut = retireAge + y;
      rb = rb + rb * (post / 100) - draw;
      if (rb < 0) rb = 0;
      draw *= 1 + inf / 100;
    }
    const fin = acc[acc.length - 1];
    return { acc, wdw, finalBalance: fin.balance, finalTarget: fin.target, finalExpense: exp, runOut, ret, inf, post };
  }

  const base = sim(s.expectedReturn, s.inflationRate, s.retirementReturn, s.incomeGrowthRate);
  const pesimis = sim(Math.max(1, s.expectedReturn - 2), s.inflationRate + 1, Math.max(1, s.retirementReturn - 1), Math.max(0, s.incomeGrowthRate - 2));
  const optimis = sim(s.expectedReturn + 2, Math.max(1, s.inflationRate - 1), s.retirementReturn + 1, s.incomeGrowthRate + 2);
  const done = base.finalBalance >= base.finalTarget;
  const readiness = base.finalTarget > 0 ? Math.min(100, base.finalBalance / base.finalTarget * 100) : 0;

  const mr = mrOf(s.expectedReturn);
  const rec = { investment: 0, investmentPct: 0, age: retireAge, ageCapped: false, expense: 0, expensePct: 0 };
  if (!done && years > 0) {
    // Opsi 1: setoran per bulan yang dibutuhkan (bisection 50 langkah)
    let lo = 0, hi = base.finalTarget, req = 0;
    for (let i = 0; i < 50; i++) {
      const mid = (lo + hi) / 2;
      let tb = s.currentSavings, ti = mid;
      for (let y = 0; y < years; y++) {
        for (let m = 0; m < 12; m++) tb = tb * (1 + mr) + ti;
        ti *= 1 + s.incomeGrowthRate / 100;
      }
      if (tb < base.finalTarget) lo = mid; else { hi = mid; req = mid; }
    }
    rec.investment = req;
    rec.investmentPct = income > 0 ? req / income * 100 : 0;
    // Opsi 2: tunda pensiun sampai aset menyusul target (maks. usia 80)
    let tBal = base.finalBalance, tExp = base.finalExpense, tAge = retireAge, tTar = tExp * 12 * mult;
    let tInv = monthlyInvestment * Math.pow(1 + s.incomeGrowthRate / 100, years);
    while (tBal < tTar && tAge < 80) {
      tAge++;
      for (let m = 0; m < 12; m++) tBal = tBal * (1 + mr) + tInv;
      tExp *= 1 + s.inflationRate / 100;
      tInv *= 1 + s.incomeGrowthRate / 100;
      tTar = tExp * 12 * mult;
    }
    rec.age = tAge;
    rec.ageCapped = tBal < tTar;
    // Opsi 3: pengeluaran maksimal (nilai uang hari ini) yang ditopang aset proyeksi
    rec.expense = base.finalBalance * (s.swr / 100) / 12 / Math.pow(1 + s.inflationRate / 100, years);
    rec.expensePct = income > 0 ? rec.expense / income * 100 : 0;
  }

  // Usia pertama saat aset ≥ target (skenario moderat); extra = setoran tambahan per bulan, naik ikut inflasi
  function fiAge(extra) {
    if (monthlyExpenses <= 0) return null;
    let bal = s.currentSavings, exp = monthlyExpenses, inv = monthlyInvestment, add = extra || 0;
    for (let age = s.currentAge; age <= 80; age++) {
      if (bal >= exp * 12 * mult) return age;
      for (let m = 0; m < 12; m++) bal = bal * (1 + mr) + inv + add;
      exp *= 1 + s.inflationRate / 100;
      inv *= 1 + s.incomeGrowthRate / 100;
      add *= 1 + s.inflationRate / 100;
    }
    return null;
  }
  // Coast FIRE: aset hari ini yang — tanpa setoran lagi — tumbuh menjadi target di usia pensiun
  const coast = base.finalTarget / Math.pow(1 + s.expectedReturn / 100, years);
  const emergency = monthlyExpenses * 6;
  return {
    base, pesimis, optimis, done, readiness, rec, years, retireAge, mult,
    monthlyNeeds, monthlyEnt, monthlyExpenses, monthlyInvestment, monthlyGold,
    totalAlloc: s.needsPct + s.entPct + s.invPct + s.goldPct,
    fireNow: monthlyExpenses * 12 * mult,
    fiAge: fiAge(0), fiAgeHabit: extraMonthly > 0 ? fiAge(extraMonthly) : null,
    coast, coastOk: s.currentSavings >= coast,
    emergency, emergencyMonths: monthlyGold > 0 ? Math.ceil(emergency / monthlyGold) : null,
    empty: monthlyExpenses <= 0
  };
}
if (typeof module === 'object' && module.exports) module.exports = { calcFire };
