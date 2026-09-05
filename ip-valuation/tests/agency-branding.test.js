const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "../..");
const read = (relativePath) =>
  fs.readFileSync(path.join(root, relativePath), "utf8");

test("이크레더블 기관코드와 암호 해시를 등록한다", () => {
  const accessGate = read("ip-valuation/assets/js/access-gate.js");

  assert.match(accessGate, /ecre:\s*"ecredible"/);
  assert.match(accessGate, /name:\s*"이크레더블"/);
  assert.match(accessGate, /logo:\s*"\.\.\/assets\/ecredible-logo\.svg"/);
  assert.match(
    accessGate,
    /3b1905553320e2be254f5a4916c17e844b40c1fd005040e66de986f038da6480/,
  );
});

test("로그인 기관에 따라 좌측 CI와 배경을 전환한다", () => {
  const accessGate = read("ip-valuation/assets/js/access-gate.js");
  const css = read("ip-valuation/assets/css/overrides.css");

  assert.match(accessGate, /applyAgencyBrand\(agency\)/);
  assert.match(accessGate, /classList\.toggle\("is-ecredible"/);
  assert.match(css, /\.brand\.is-agency-logo[\s\S]*?background:\s*#eef1f4/);
  assert.match(css, /\.brand\.is-ecredible[\s\S]*?background:\s*#fff/);
});

test("타 기관 보고서에는 명밸류 직인을 노출하지 않는다", () => {
  const css = read("ip-valuation/assets/css/overrides.css");

  assert.match(
    css,
    /body:not\(\[data-agency="myeongvalue"\]\) \.report-seal-option/,
  );
  assert.match(css, /quick-report-signature > img\[src\$="report-seal\.png"\]/);
});

test("이크레더블 기본 접속기한은 2026년 10월 31일이다", () => {
  const accessControl = read("access-control.js");
  const admin = read("access-admin/index.html");

  assert.match(accessControl, /ecredible:\s*'2026-10-31'/);
  assert.match(admin, /data-agency="ecredible"/);
  assert.match(admin, /id="deadline-ecredible"/);
});

test("상단 의뢰기관 필드는 긴 기관명을 위한 높이를 확보한다", () => {
  const css = read("ip-valuation/assets/css/overrides.css");

  assert.match(
    css,
    /\.top-actions \.requesting-institution-field\s*\{[\s\S]*?height:\s*42px/,
  );
  assert.match(css, /grid-template-rows:\s*12px 18px/);
});
