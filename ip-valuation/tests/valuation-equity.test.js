const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");

function loadEquityRule() {
  const source = fs.readFileSync(path.join(__dirname, "../assets/js/valuation-engine.js"), "utf8");
  const match = source.match(/function hasUsableEquityData\(e\) \{[\s\S]*?\n\}/);
  assert.ok(match, "자기자본비율 유효성 규칙을 찾을 수 있어야 합니다.");
  return vm.runInNewContext(`(${match[0]})`);
}

test("자본잠식 연도도 자기자본비율 기간에 포함한다", () => {
  const hasUsableEquityData = loadEquityRule();

  assert.equal(hasUsableEquityData({ totalAssets: 112474, totalEquity: -1097 }), true);
  assert.equal(hasUsableEquityData({ totalAssets: 0, totalEquity: -1097 }), false);
  assert.equal(hasUsableEquityData({ totalAssets: 112474 }), false);
});
