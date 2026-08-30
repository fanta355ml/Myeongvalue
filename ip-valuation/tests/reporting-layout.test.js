const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");

const reportingSource = fs.readFileSync(
  path.join(__dirname, "../assets/js/reporting.js"),
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
