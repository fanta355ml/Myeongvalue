const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");

function loadCashFlowFormatter() {
  const source = fs.readFileSync(path.join(__dirname, "../assets/js/valuation-engine.js"), "utf8");
  const match = source.match(/function formatStickyCashFlowPeriod\(e\) \{[\s\S]*?\n\}/);
  assert.ok(match, "상단 현금흐름 기간 표시 함수를 찾을 수 있어야 합니다.");
  return vm.runInNewContext(`(${match[0]})`);
}

test("현금흐름 추정기간은 산정 결과의 수명과 최초·최종일을 표시한다", () => {
  const formatStickyCashFlowPeriod = loadCashFlowFormatter();
  const result = formatStickyCashFlowPeriod({
    economicLifeLabel: "7년 3개월",
    cashFlows: [
      { period: "2026-08-27~2026-12-31" },
      { period: "2033-01-01~2033-11-26" },
    ],
  });

  assert.equal(result, "7년 3개월 : 2026.08.27.~2033.11.26.");
});

test("가치산정 전에는 현금흐름 기간을 산출 전으로 표시한다", () => {
  const formatStickyCashFlowPeriod = loadCashFlowFormatter();
  assert.equal(formatStickyCashFlowPeriod(null), "산출 전");
});
