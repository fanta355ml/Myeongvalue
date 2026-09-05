const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");

const reportingSource = fs.readFileSync(
  path.join(__dirname, "../assets/js/reporting.js"),
  "utf8",
);
const scoringSource = fs.readFileSync(
  path.join(__dirname, "../assets/js/scoring.js"),
  "utf8",
);
const uiFixesSource = fs.readFileSync(
  path.join(__dirname, "../assets/js/ui-fixes.js"),
  "utf8",
);
const overrideCss = fs.readFileSync(
  path.join(__dirname, "../assets/css/overrides.css"),
  "utf8",
);

function loadFunction(name) {
  const match = reportingSource.match(new RegExp(`function ${name}\\([^)]*\\) \\{[\\s\\S]*?\\n\\}`));
  assert.ok(match, `${name} 함수를 찾을 수 있어야 합니다.`);
  return vm.runInNewContext(`(${match[0]})`);
}

test("경쟁기업 비교연도는 최종 기준년도에서 최근 3개년으로 자동 생성한다", () => {
  const buildCompetitionYears = loadFunction("buildCompetitionYears");
  assert.deepEqual(Array.from(buildCompetitionYears(2026)), [2024, 2025, 2026]);
});

test("기존 저장자료가 경쟁기업 2개여도 세 번째 경쟁기업을 자동 보완한다", () => {
  const ensureCompetitorRows = loadFunction("ensureCompetitorRows");
  const rows = ensureCompetitorRows([
    { name: "사업화주체", cost: [1, 2, 3], sga: [4, 5, 6] },
    { name: "경쟁기업 A", cost: [7, 8, 9], sga: [1, 2, 3] },
    { name: "경쟁기업 B", cost: [4, 5, 6], sga: [7, 8, 9] },
  ]);

  assert.equal(rows.length, 4);
  assert.equal(rows[3].name, "경쟁기업 C");
  assert.deepEqual(Array.from(rows[3].cost), [0, 0, 0]);
  assert.deepEqual(Array.from(rows[3].sga), [0, 0, 0]);
});

test("업종평균 표는 수치 입력을 우측, 비수치 항목을 가운데 정렬한다", () => {
  assert.match(
    overrideCss,
    /\.benchmark-workspace table input\[type="number"\] \{\s*text-align: right;/,
  );
  assert.match(
    overrideCss,
    /\.benchmark-workspace table input:not\(\[type="number"\]\) \{\s*text-align: center;/,
  );
  assert.match(
    overrideCss,
    /\.benchmark-workspace \.company-financial-table-wrap tbody td:first-child,/,
  );
});

test("수익구조 비교는 기준연도가 달라도 양쪽 최신 유효기간을 각각 적용한다", () => {
  const selectProfitabilityComparisonPeriods = loadFunction("selectProfitabilityComparisonPeriods");
  const periods = selectProfitabilityComparisonPeriods(
    [2025, 2024, 2023],
    [2024, 2023, 2022, 2021, 2020],
    3,
  );

  assert.equal(periods.availableYears, 3);
  assert.equal(periods.appliedYears, 3);
  assert.deepEqual(Array.from(periods.companyYears), [2025, 2024, 2023]);
  assert.deepEqual(Array.from(periods.industryYears), [2024, 2023, 2022]);

  const fiveYears = selectProfitabilityComparisonPeriods(
    [2025, 2024, 2023, 2022, 2021],
    [2024, 2023, 2022, 2021, 2020],
    5,
  );
  assert.equal(fiveYears.availableYears, 5);
  assert.equal(fiveYears.appliedYears, 5);
});

test("보고서 수익구조는 사업화주체와 동업종을 추세선 없이 비교한다", () => {
  assert.match(reportingSource, /companyCostRate = pe\[0\]\.company/);
  assert.match(reportingSource, /companySgaRate = pe\[1\]\.company/);
  assert.match(reportingSource, /companyOperatingMargin = pe\[2\]\.company/);

  const chartStart = scoringSource.indexOf("function reportProfitabilityComparisonChart");
  const chartEnd = scoringSource.indexOf("function s_", chartStart);
  assert.ok(chartStart >= 0 && chartEnd > chartStart);
  const chartSource = scoringSource.slice(chartStart, chartEnd);

  assert.match(chartSource, /kind:`company`/);
  assert.match(chartSource, /kind:`industry`/);
  assert.doesNotMatch(chartSource, /polyline|myeong-chart-line|myeong-chart-dot/);
  assert.match(scoringSource, /children:`수익구조 비교`/);
  assert.match(scoringSource, /\$\{companyName\|\|`사업화주체`\}\(동사\)/);
  assert.match(scoringSource, /\$\{o\.code\}\(동업종\)/);
  assert.match(overrideCss, /\.myeong-chart-bar\.is-company \{\s*fill: #5578a7;/);
  assert.match(overrideCss, /\.myeong-chart-bar\.is-industry \{\s*fill: #aeb9c9;/);
});

test("수익성 평가의견 최하단에 매출원가율과 판매관리비율 의견을 추가한다", () => {
  assert.match(scoringSource, /function reportCostStructureOpinion/);
  assert.match(scoringSource, /평균 매출원가율은/);
  assert.match(scoringSource, /판매관리비율은/);
  assert.match(scoringSource, /비용구조 측면에서/);

  const profitabilityOpinion = scoringSource.indexOf("평균수익성과 최근 실적 추이");
  const costStructureOpinion = scoringSource.indexOf("reportCostStructureOpinion(a)", profitabilityOpinion);
  assert.ok(profitabilityOpinion >= 0 && costStructureOpinion > profitabilityOpinion);
});

test("보고서 평가요약은 중복정보를 제거하고 간이감정에도 평가방법을 표시한다", () => {
  const deepStart = scoringSource.indexOf(
    "className:`quick-summary-grid deep-summary-grid`",
  );
  const quickStart = scoringSource.indexOf(
    "className:`quick-summary-grid`",
    deepStart + 1,
  );
  const summaryEnd = scoringSource.indexOf(
    "v===`deep`&&(0,W.jsxs)(`section`",
    quickStart,
  );

  assert.ok(deepStart >= 0 && quickStart > deepStart && summaryEnd > quickStart);
  const deepSummary = scoringSource.slice(deepStart, quickStart);
  const quickSummary = scoringSource.slice(quickStart, summaryEnd);

  assert.doesNotMatch(deepSummary, /children:`업체명`/);
  assert.doesNotMatch(deepSummary, /children:`사업자등록번호`/);
  assert.doesNotMatch(deepSummary, /children:`평가대상특허`/);
  assert.match(quickSummary, /children:`평가방법`/);
  assert.match(scoringSource, /평가방법은 \$\{h\.valuationMethodLabel\?\?`로열티공제법Ⅱ`\}을 적용함/);
  assert.doesNotMatch(scoringSource, /적용한 지식재산 가치는/);
});

test("가치기준·전제는 보고서별 절 번호와 평가등급 계열의 둥근 박스를 사용한다", () => {
  assert.match(
    scoringSource,
    /function fairValuePrinciples\(\{purpose:e,evaluationDate:t,sectionNumber:n=6\}\)/,
  );
  assert.match(scoringSource, /기술가치평가의 가치기준·전제/);
  assert.match(
    scoringSource,
    /sectionNumber:v===`quick`\?6:9/,
  );
  assert.match(
    overrideCss,
    /\.quick-fair-value-section ul \{[\s\S]*?border-radius: 10px;[\s\S]*?background: #eef3f8;/,
  );
  assert.doesNotMatch(scoringSource, /className:`quick-footnote`,children:`※ 가치기준과 전제는/);
  assert.match(
    scoringSource,
    /className:`quick-disclaimer-group`[\s\S]*?※ 가치기준과 전제는[\s\S]*?※ 본 결과는/,
  );
  assert.match(
    overrideCss,
    /\.quick-disclaimer-group \{[\s\S]*?gap: 2px;[\s\S]*?margin-top: 10px;/,
  );
  assert.match(
    overrideCss,
    /\.quick-disclaimer-group \.quick-disclaimer \{\s*margin: 0;/,
  );
  assert.match(
    overrideCss,
    /\.quick-fair-value-section ul \{[\s\S]*?box-shadow: inset 0 0 0 1000px #eef2f7 !important;/,
  );
});

test("보고서 발급일자는 오늘 날짜를 기본으로 하며 평가기준일과 별도로 수정·저장한다", () => {
  assert.match(scoringSource, /function reportToday\(\)/);
  assert.match(
    scoringSource,
    /\[issueDate,setIssueDate\]=\(0,C\.useState\)\(reportToday\)/,
  );
  assert.match(scoringSource, /contact:j,issueDate/);
  assert.match(
    scoringSource,
    /typeof e\.issueDate==`string`&&setIssueDate\(e\.issueDate\)/,
  );
  assert.match(
    scoringSource,
    /children:`발급일자`[\s\S]*?type:`date`,value:issueDate/,
  );
  assert.match(
    scoringSource,
    /children:`발급일자`\}\),\(0,W\.jsx\)\(`b`,\{children:issueDate\}\)/,
  );
});

test("보고서 가치평가금액은 산정값과 실시간 연동하고 수동값은 현재 화면에서만 유지한다", () => {
  assert.match(
    scoringSource,
    /z=N\.trim\(\)\|\|\(h\?`\$\{Rg\(h\.finalValue\)\}백만원`:`산출 전`\)/,
  );
  assert.match(scoringSource, /value:z,onChange:e=>P\(e\.target\.value\)/);
  assert.doesNotMatch(scoringSource, /valuationAmount:N/);
  assert.doesNotMatch(scoringSource, /typeof e\.valuationAmount==`string`/);
  assert.match(
    scoringSource,
    /산정값과 실시간 연동되며 직접 수정 시 현재 보고서 화면에서만 유지/,
  );
  assert.match(uiFixesSource, /자동가액으로 초기화/);
  assert.match(
    uiFixesSource,
    /setter\?\.call\(input, ""\)[\s\S]*?dispatchEvent\(new Event\("input", \{ bubbles: true \}\)\)/,
  );
  assert.match(
    overrideCss,
    /\.report-amount-editor-card \{[\s\S]*?grid-template-columns: minmax\(0, 1fr\) auto;/,
  );
});
