const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const methods = require("../assets/js/valuation-methods.js");

const EXCEL = Object.freeze({
  // KoDATA 로열티공제법1_㈜긴트 v2(2).xlsx · 가평가시트
  q1: 4, // E60
  q2: 7, // F60
  q3: 13, // G60
  lifeScore: 2, // X41
  economicLife: 7.6, // E62
  adjustmentScore: 5, // T64
  adjustmentCoefficient: 1.1666666666666667, // O64
  technologyShare: 58, // C66 (Excel 저장값은 0.58)
  baseRoyaltyRate: 3, // D67
  pioneeringRate: 75, // D88
  finalRoyaltyRate: 1.5225000000000002, // F67
  discountRate: 10.67221371091734, // C78
  sales: [ // D18:M18
    0,
    0,
    3338.013698630137,
    4567.808219178082,
    6223.131742234079,
    7833.551126123079,
    8991.198378835648,
    9530.647855209543,
    9695.389729857501,
    9449.075438500216,
  ],
  royaltyIncome: [ // F20:M20
    50.82125856164384,
    69.54488013698631,
    94.74718077551387,
    119.2658158952239,
    136.89099531777276,
    145.1041135955653,
    147.61230863708047,
    143.86217355116582,
  ],
  tax: [ // F22:M22
    5.5903384417808235,
    7.649936815068495,
    10.422189885306526,
    13.11923974847463,
    15.058009484955006,
    15.961452495512185,
    16.237353950078855,
    15.824839090628243,
  ],
  afterTax: [ // F23:M23
    45.230920119863015,
    61.894943321917815,
    84.32499089020735,
    106.14657614674927,
    121.83298583281776,
    129.14266110005312,
    131.3749546870016,
    128.03733446053758,
  ],
  presentFactor: [ // F24:M24
    0.7377075174949115,
    0.6665697673870057,
    0.6022918897494246,
    0.5442123813685051,
    0.4917335283362286,
    0.4443152547943669,
    0.401469564849354,
    0.3627555204579329,
  ],
  presentValue: [ // F25:M25
    33.367189795634786,
    41.25729797252266,
    50.788258116365995,
    57.76628097893578,
    59.90936399130923,
    57.380054371492676,
    52.743045890294134,
    46.44624990027874,
  ],
  finalValue: 399.657741016834, // D26
});

function close(actual, expected, tolerance = 1e-10) {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `expected ${expected}, received ${actual}`,
  );
}

function closeArray(actual, expected, tolerance = 1e-10) {
  assert.equal(actual.length, expected.length);
  actual.forEach((value, index) => close(value, expected[index], tolerance));
}

test("모델Ⅰ 평점은 모델Ⅱ 입력값에서 3을 차감하고 Excel 경제적 수명·조정계수와 일치한다", () => {
  assert.deepEqual([1, 2, 3, 4, 5].map(methods.toModel1Score), [-2, -1, 0, 1, 2]);

  const life = methods.calculateEconomicLifeModel1({
    q1: EXCEL.q1,
    q2: EXCEL.q2,
    q3: EXCEL.q3,
    ratings: { first: 4, second: 4 },
    keys: ["first", "second"],
  });
  assert.equal(life.score, EXCEL.lifeScore);
  close(life.years, EXCEL.economicLife);

  const keys = Array.from({ length: 15 }, (_, index) => `item${index + 1}`);
  const ratings = Object.fromEntries(keys.map((key, index) => [key, index < 5 ? 4 : 3]));
  const adjustment = methods.calculateAdjustmentCoefficient1({ ratings, keys });
  assert.equal(adjustment.score, EXCEL.adjustmentScore);
  close(adjustment.coefficient, EXCEL.adjustmentCoefficient);
});

test("기술의 비중·개척률·최종 로열티율이 Excel 연결 셀과 일치한다", () => {
  const technology = methods.calculateTechnologyShare([
    { weight: 60, patentShare: 80 },
    { weight: 25, patentShare: 40 },
    { weight: 15, patentShare: 0 },
  ]);
  assert.equal(technology.share, EXCEL.technologyShare);

  const pioneering = methods.calculatePioneeringRate({
    annualCommercializationCosts: [350, 350],
    industryAssetIncrease: 126.00733333333334,
    industryResearchDevelopment: 243.19530460000001,
    preparationYears: 2,
  });
  close(pioneering.costTotal, 700);
  close(pioneering.benchmarkTotal, 738.4052758666667);
  close(pioneering.ratio, 0.9479888929265973);
  assert.equal(pioneering.appliedRate, EXCEL.pioneeringRate);

  const royalty = methods.calculateRoyaltyRate1({
    baseRoyaltyRate: EXCEL.baseRoyaltyRate,
    adjustmentCoefficient: EXCEL.adjustmentCoefficient,
    technologyShare: EXCEL.technologyShare,
    pioneeringRate: pioneering.appliedRate,
  });
  close(royalty, EXCEL.finalRoyaltyRate);
});

test("Excel 연도별 일할 후 추정매출액을 그대로 적용하면 로열티·세후 현금흐름·현재가치가 일치한다", () => {
  const result = methods.calculateDiscountedCashFlows({
    sales: EXCEL.sales,
    royaltyRate: EXCEL.finalRoyaltyRate,
    discountRate: EXCEL.discountRate,
    discountPeriods: Array.from({ length: 10 }, (_, index) => index + 1),
    companyForm: "corporation",
  });
  const active = result.cashFlows.slice(2);

  closeArray(active.map((row) => row.revenue), EXCEL.sales.slice(2));
  closeArray(active.map((row) => row.royaltyIncome), EXCEL.royaltyIncome);
  closeArray(active.map((row) => row.tax.total), EXCEL.tax);
  closeArray(active.map((row) => row.afterTaxRoyalty), EXCEL.afterTax);
  closeArray(active.map((row) => row.presentFactor), EXCEL.presentFactor);
  closeArray(active.map((row) => row.presentValue), EXCEL.presentValue);
  close(result.presentValueTotal, EXCEL.finalValue);
});

test("현재 웹 일할식은 최초·최종 부분연도와 윤년을 실제 일수로 계산한다", () => {
  const result = methods.prorateAnnualSales("2024-07-01", "2025-03-31", [
    { year: 2024, amount: 3660 },
    { year: 2025, amount: 3650 },
  ]);

  assert.deepEqual(result.details.map((row) => row.days), [184, 90]);
  assert.deepEqual(result.details.map((row) => row.daysInYear), [366, 365]);
  close(result.total, 3660 * 184 / 366 + 3650 * 90 / 365);
});

test("경제적 수명 종료연도는 정수연도 뒤 마지막 부분연도까지만 만든다", () => {
  assert.deepEqual(methods.calculatePeriodFractions(3.25, 20), [1, 1, 1, 0.25]);
  assert.deepEqual(methods.calculatePeriodFractions(3, 20), [1, 1, 1]);
  assert.deepEqual(methods.calculatePeriodFractions(0, 20), []);
  assert.equal(methods.calculatePeriodFractions(20, 20).length, 20);
  assert.equal(methods.calculateCalendarPeriodCount("2026-08-24", "2033-08-23"), 7);
  assert.equal(methods.calculateCalendarPeriodCount("2026-08-24", "2033-08-24"), 8);
  assert.equal(methods.calculateCalendarPeriodCount("2026-08-24", "2026-08-23"), 0);
  assert.equal(methods.calculateCalendarPeriodCount("2026-08-24", "2034-01-15"), 8);
});

test("StarValue 숫자 전용 붙여넣기는 손익 11행 뒤 재무상태표 10행을 고정 순서로 인식한다", () => {
  const pasted = `100%\t12,650,850\t16,610,977\t22,981,870\t19,568,977\t20,157,616
89.46%\t11,162,890\t14,867,558\t20,551,927\t17,636,170\t18,059,977
10.54%\t1,487,961\t1,743,418\t2,429,942\t1,932,807\t2,097,639
5.64%\t857,433\t989,526\t1,168,031\t1,061,175\t1,115,089
4.89%\t630,528\t753,892\t1,261,911\t871,633\t982,550
2.61%\t374,674\t367,579\t819,917\t341,146\t495,027
2.95%\t578,901\t362,803\t586,718\t512,068\t669,114
4.56%\t426,301\t758,668\t1,495,111\t700,711\t808,463
0.71%\t13,510\t188,521\t253,601\t108,283\t90,749
3.84%\t412,791\t570,147\t1,241,509\t592,427\t717,714
1.35%\t173,801\t233,647\t268,242\t286,431\t280,445

7,526,088\t7,648,856\t9,481,649\t9,503,308\t9,952,372
5,342,290\t5,459,384\t6,538,284\t6,304,791\t6,944,718
94,776\t82,387\t72,615\t44,465\t47,943
5,276,621\t5,994,427\t7,202,424\t6,735,131\t7,482,616
4,136,837\t4,707,711\t5,898,228\t5,652,299\t5,633,843
12,802,708\t13,643,283\t16,684,073\t16,238,438\t17,434,988
6,469,148\t7,149,001\t8,328,952\t8,020,266\t8,713,924
2,044,652\t2,442,487\t2,869,115\t2,715,336\t2,816,176
1,320,439\t1,642,595\t2,099,051\t2,020,898\t2,218,756
893,904\t1,022,514\t1,044,604\t1,049,645\t985,299`;
  const parsed = methods.parseStarValueFinancialText(pasted);

  assert.equal(parsed.incomeRows.length, 11);
  assert.equal(parsed.balanceRows.length, 10);
  assert.deepEqual(parsed.incomeRows[0], {
    label: "매출액",
    values: [12650850, 16610977, 22981870, 19568977, 20157616],
  });
  assert.deepEqual(parsed.balanceRows[0], {
    label: "고정자산",
    values: [7526088, 7648856, 9481649, 9503308, 9952372],
  });
  assert.deepEqual(parsed.balanceRows[1], {
    label: "유형자산",
    values: [5342290, 5459384, 6538284, 6304791, 6944718],
  });
  assert.deepEqual(parsed.balanceRows[2], {
    label: "무형자산",
    values: [94776, 82387, 72615, 44465, 47943],
  });
  assert.deepEqual(parsed.balanceRows.at(-1), {
    label: "매입채무",
    values: [893904, 1022514, 1044604, 1049645, 985299],
  });
});

test("0·음수·공란·자료부족은 기존 웹 입력 규칙과 로열티Ⅰ 필수검증으로 처리한다", () => {
  const zero = methods.calculateDiscountedCashFlows({
    sales: [0],
    royaltyRate: 1.5,
    discountRate: 10,
  });
  assert.equal(zero.presentValueTotal, 0);

  assert.throws(() => methods.calculateDiscountedCashFlows({ sales: [-1], royaltyRate: 1, discountRate: 10 }), /음수/);
  assert.equal(methods.calculateDiscountedCashFlows({ sales: [""], royaltyRate: 1, discountRate: 10 }).presentValueTotal, 0);
  assert.throws(() => methods.calculateTechnologyShare([{ weight: 90, patentShare: 50 }]), /100%/);
  assert.throws(() => methods.calculatePioneeringRate({
    annualCommercializationCosts: [100],
    industryAssetIncrease: 10,
    industryResearchDevelopment: 10,
    preparationYears: 2,
  }), /부족/);
  assert.throws(() => methods.calculatePioneeringRate({
    annualCommercializationCosts: [100],
    industryAssetIncrease: -20,
    industryResearchDevelopment: 10,
    preparationYears: 1,
  }), /기준금액/);
});

test("개척률 직접확정은 50~100%와 변경근거를 요구한다", () => {
  const input = {
    annualCommercializationCosts: [10],
    industryAssetIncrease: 30,
    industryResearchDevelopment: 20,
    preparationYears: 1,
  };
  assert.throws(() => methods.calculatePioneeringRate({ ...input, overrideRate: 70 }), /근거/);
  assert.throws(() => methods.calculatePioneeringRate({ ...input, overrideRate: 40, overrideReason: "평가자 판단" }), /50~100%/);
  assert.equal(methods.calculatePioneeringRate({
    ...input,
    overrideRate: 70,
    overrideReason: "투자내역과 시장진입 단계 검토",
  }).appliedRate, 70);
});

test("사업화 준비기간은 연·개월을 합산하고 마지막 부분연도 투자구간을 포함한다", () => {
  const result = methods.calculatePioneeringRate({
    annualCommercializationCosts: [120, 60],
    industryAssetIncrease: 40,
    industryResearchDevelopment: 20,
    preparationYears: 1,
    preparationMonths: 6,
  });
  assert.equal(result.durationYears, 1.5);
  assert.equal(result.investmentPeriods, 2);
  assert.equal(result.costTotal, 180);
  assert.equal(result.benchmarkTotal, 90);
  assert.equal(result.recommendedRate, 50);
});

test("매출성장 추세 자동추천은 최초 발생·최종연도 CAGR을 동업종과 비교하되 2~4점만 제시한다", () => {
  close(methods.calculateForecastCagr([0, 100, 110, 121]), 10);
  assert.equal(methods.calculateForecastCagr([0, 100, 0]), null);
  assert.equal(methods.recommendSalesGrowthScore({ forecastCagr: 10, industryCagr: 2 }).score, 4);
  assert.equal(methods.recommendSalesGrowthScore({ forecastCagr: 4, industryCagr: 2 }).score, 3);
  assert.equal(methods.recommendSalesGrowthScore({ forecastCagr: -5, industryCagr: 2 }).score, 2);
});

test("2026년 법인세 표준세율·누진공제와 지방소득세를 자동 계산한다", () => {
  const lower = methods.calculateTax(100, "corporation");
  close(lower.national, 10);
  close(lower.local, 1);
  close(lower.total, 11);

  const middle = methods.calculateTax(1000, "corporation");
  close(middle.national, 180);
  close(middle.local, 18);
  close(middle.total, 198);
});

test("저장·불러오기 왕복과 평가방법 없는 기존 파일의 하위 호환성을 유지한다", () => {
  const method1 = {
    valuationMethod: methods.ROYALTY_METHOD_1,
    method1PreparationYears: 2,
    method1Investments: [350, 350],
    method1PioneeringSource: "starvalue-ecos",
  };
  assert.deepEqual(methods.migrateValuationState(JSON.parse(JSON.stringify(method1))), method1);
  assert.equal(methods.migrateValuationState({ salesMethod: "growth" }).valuationMethod, methods.ROYALTY_METHOD_2);
});

test("DCF 선택지는 업데이트 예정 안내만 표시하고 지원 모형으로 저장하지 않는다", () => {
  const source = fs.readFileSync(
    path.join(__dirname, "../assets/js/valuation-engine.js"),
    "utf8",
  );
  const css = fs.readFileSync(
    path.join(__dirname, "../assets/css/overrides.css"),
    "utf8",
  );

  assert.match(source, /value: `discountedCashFlow`/);
  assert.match(source, /DCF 평가모형은 업데이트 예정입니다/);
  assert.equal(methods.normalizeValuationMethod("discountedCashFlow"), methods.ROYALTY_METHOD_2);
  assert.equal(methods.migrateValuationState({ valuationMethod: "discountedCashFlow" }).valuationMethod, methods.ROYALTY_METHOD_2);
  assert.match(css, /\.method1-valuation-workbench \.quickvalue-rating-table th/);
});

test("모형·세금·경제적 수명 UI는 요청된 독립 선택과 확인 순서를 유지한다", () => {
  const source = fs.readFileSync(
    path.join(__dirname, "../assets/js/valuation-engine.js"),
    "utf8",
  );
  const reporting = fs.readFileSync(
    path.join(__dirname, "../assets/js/reporting.js"),
    "utf8",
  );
  const css = fs.readFileSync(
    path.join(__dirname, "../assets/css/overrides.css"),
    "utf8",
  );

  assert.doesNotMatch(source, /로열티공제법Ⅱ · 기존 방식/);
  assert.ok(source.indexOf("value: `royalty`") < source.indexOf("value: `tax`"));
  assert.ok(source.indexOf("value: `tax`") < source.indexOf("value: `discount`"));
  assert.match(source, /value: lifeModel/);
  assert.match(source, /method1PreparationMonths/);
  assert.match(source, /function countCalendarYearPeriods/);
  assert.match(source, /cashFlowPeriodCount = countCalendarYearPeriods\(nn, finalValuationEnd\)/);
  assert.match(source, /periodCount = cashFlowPeriodCount/);
  assert.match(source, /function bg\(e, t, n\)[\s\S]*?let i = t \+ 1/);
  assert.doesNotMatch(source, /Math\.ceil\(valuationPeriodYears\)/);
  assert.match(source, /소수점 이하 반올림\(정수 적용\)/);
  assert.match(source, /평균 법인세율/);
  assert.match(reporting, /로열티공제법Ⅰ 개척률용 재무상태표/);
  assert.match(css, /\.valuation-method-grid/);
  assert.match(css, /\.valuation-purpose-grid input:focus/);
  assert.match(css, /\.sticky-summary strong[\s\S]*?white-space: normal/);
  assert.match(css, /\.sticky-summary \.value-summary[\s\S]*?position: static/);
  assert.match(css, /\.top-actions \.requesting-institution-field input[\s\S]*?font-size: 11px/);
});

test("가치산정 핵심값·검산 카드와 모든 탭을 스크롤 없이 표시한다", () => {
  const source = fs.readFileSync(
    path.join(__dirname, "../assets/js/valuation-engine.js"),
    "utf8",
  );
  const css = fs.readFileSync(
    path.join(__dirname, "../assets/css/overrides.css"),
    "utf8",
  );

  assert.match(css, /\.valuation-summary-grid > \.valuation-formula-card\s*{[\s\S]*?grid-column: 1;/);
  assert.match(css, /\.valuation-summary-grid > \.valuation-check-card\s*{[\s\S]*?grid-column: 2;/);
  assert.match(css, /\.valuation-tabs-list\s*{[\s\S]*?flex-wrap: wrap;[\s\S]*?height: auto !important;[\s\S]*?overflow: visible !important;/);
  assert.match(css, /\.valuation-tabs-list > button\s*{[\s\S]*?flex: 1 1 140px;/);

  for (const tab of ["scores", "sales", "life", "royalty", "tax", "discount", "validity", "proration"]) {
    assert.ok(source.includes("value: `" + tab + "`"));
  }
});

test("기존 로열티Ⅱ 산출 분기는 유효성 적용 공식을 그대로 유지한다", () => {
  const source = fs.readFileSync(
    path.join(__dirname, "../assets/js/valuation-engine.js"),
    "utf8",
  );
  assert.match(source, /Kr = isMethod1 \? Gr : Gr \* zr/);
  assert.match(source, /er = isMethod1 \?[\s\S]*?: Qn \* tt \/ 100/);

  const adjustmentScore = 36;
  const q1 = 2;
  const median = 3;
  const q3 = 4;
  const adjustedRoyalty = adjustmentScore <= 30
    ? q1 + (median - q1) * Math.max(0, adjustmentScore - 10) / 20
    : median + (q3 - median) * Math.min(20, adjustmentScore - 30) / 20;
  const legacyRoyalty = adjustedRoyalty * 75 / 100;
  const legacyCashFlow = methods.calculateDiscountedCashFlows({
    sales: [1000, 1100],
    royaltyRate: legacyRoyalty,
    discountRate: 10,
    companyForm: "corporation",
  });

  close(adjustedRoyalty, 3.3);
  close(legacyRoyalty, 2.475);
  close(legacyCashFlow.presentValueTotal * 0.8, 32.04);
});
