const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");

function loadContext(vp) {
  const script = fs.readFileSync(path.join(__dirname, "../assets/js/cretop-pdf-import.js"), "utf8");
  const context = {
    document: { readyState: "loading", addEventListener() {}, querySelector() { return null; }, querySelectorAll() { return []; } },
    localStorage: { getItem() { return null; } },
    HTMLInputElement: function HTMLInputElement() {},
    HTMLSelectElement: function HTMLSelectElement() {},
    HTMLTextAreaElement: function HTMLTextAreaElement() {},
    Event: function Event() {},
  };
  if (vp) context.vp = vp;
  context.window = context;
  vm.createContext(context);
  vm.runInContext(script, context);
  return context;
}

function loadParser() {
  return loadContext().CretopPdfImportParser;
}

test("기업개요·3개년 재무·비율을 인식한다", () => {
  const parser = loadParser();
  const pages = [{
    pageNumber: 1,
    lines: [
      "기업개요",
      "기업명 (주)엘엠에이티 영문기업명 lmat co.,ltd.",
      "사업자번호 609-81-58759 법인(주민)번호 194211-0061507",
      "대표자명 서희식 종업원수 98명(연구소 소속 5명 포함) 설립형태 주식회사",
      "설립년월 2003-04-23 기업유형 외감 기업규모 중기업",
      "주소 (50871) 경남 김해시 진영읍 하계로240번길 115",
      "표준산업분류(11차) (C24321) 알루미늄주물 주조업",
      "주요제품(상품) 알루미늄바 외",
      "결산일자 : 2025-12-31",
    ],
  }, {
    pageNumber: 2,
    lines: [
      "요약 재무상태표",
      "구분 2023 2024 2025",
      "자산총계 36,039 45,486 56,717",
      "자본금 4,467 4,467 4,467",
      "자본총계 7,615 10,343 11,982",
    ],
  }, {
    pageNumber: 3,
    lines: [
      "요약 손익계산서",
      "구분 2023 2024 2025",
      "매출액 117,456 142,084 171,442",
      "영업이익 1,390 1,996 2,246",
      "당기순이익 2,099 1,464 2,480",
    ],
  }, {
    pageNumber: 4,
    lines: [
      "구분 계정명 2023-12-31 2024-12-31 2025-12-31",
      "매출원가율 94.70 95.00 94.92",
      "판관비율 4.12 3.59 3.77",
    ],
  }];

  const result = parser.parseExtractedPages(pages, "sample.pdf");
  assert.equal(result.profile.companyName, "(주)엘엠에이티");
  assert.equal(result.profile.representativeName, "서희식");
  assert.equal(result.profile.establishedDate, "2003-04-23");
  assert.equal(result.financials.length, 3);
  assert.equal(result.financials[2].revenue, 171442);
  assert.equal(result.ratios[2].cost, 94.92);
});

test("두 줄로 잘린 주요 판매처명은 앞뒤 행과 섞지 않는다", () => {
  const parser = loadParser();
  const result = parser.parseExtractedPages([{
    pageNumber: 1,
    lines: [
      "판매처현황",
      "기업명 사업자번호 대표자명 거래비중 결산년도 자본금 자산총계 매출액 순이익",
      "현대건설(주) 101-81-16293 이한우 10.82 2025 1 1 1 1",
      "에스케이에코플랜",
      "101-81-34928 장동현 7.93 2025 1 1 1 1",
      "트(주)",
      "(주)한화 202-81-16825 김동관 3.86 2025 1 1 1 1",
      "기준일자 : 2026-05-26",
      "매출구성",
    ],
  }], "customers.pdf");

  assert.deepEqual(
    Array.from(result.majorCustomers, (row) => row.name),
    ["현대건설(주)", "에스케이에코플랜트(주)", "(주)한화"],
  );
});

test("주요 판매처 근거는 같은 기업의 자동의견에만 추가한다", () => {
  const context = loadContext(() => "- 사업화제품 매출액은 기존 기준으로 추정함.");
  context.CRETOP_PDF_IMPORT_STATE = {
    profile: { companyName: "(주)엘엠에이티" },
    customerReferenceDate: "2026-04-07",
    majorCustomers: [{ name: "(주)아이앤씨", share: 18.02 }],
    financials: [],
  };

  const matching = context.vp({ companyName: "엘엠에이티" });
  const different = context.vp({ companyName: "다른기업" });
  assert.match(matching, /아이앤씨.*최초 매출액 추정의 보조 근거/);
  assert.doesNotMatch(different, /아이앤씨/);
});
