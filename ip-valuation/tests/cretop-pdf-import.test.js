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

test("PDF 3개년과 붙여넣기 5개년을 교차검증하여 추가 연도를 유지한다", () => {
  const parser = loadParser();
  const existing = [2021, 2022, 2023, 2024, 2025].map((year) => ({
    closingDate: `${year}-12-31`,
    totalAssets: year * 10,
    paidInCapital: 100,
    totalEquity: year === 2021 ? -1097 : year * 2,
    revenue: year * 20,
    operatingProfit: year,
    netIncome: year - 1,
  }));
  const imported = existing.slice(-3).map((row) => ({ ...row }));
  const result = parser.reconcileFinancialRows(existing, imported);

  assert.equal(result.rows.length, 5);
  assert.equal(result.conflicts.length, 0);
  assert.equal(result.matchedYears.length, 3);
  assert.equal(result.rows.find((row) => row.closingDate === "2021-12-31").totalEquity, -1097);
});

test("중복 연도 값이 다르면 붙여넣기 값을 유지하고 충돌을 반환한다", () => {
  const parser = loadParser();
  const existing = [{
    closingDate: "2025-12-31",
    totalAssets: 1000,
    paidInCapital: 100,
    totalEquity: 300,
    revenue: 700,
    operatingProfit: 50,
    netIncome: 40,
  }];
  const imported = [{ ...existing[0], revenue: 750, netIncome: 45 }];
  const result = parser.reconcileFinancialRows(existing, imported);

  assert.equal(result.rows[0].revenue, 700);
  assert.equal(result.rows[0].netIncome, 40);
  assert.equal(result.conflicts.length, 2);
  assert.equal(result.conflicts[0].closingDate, "2025-12-31");
});

test("붙여넣기 공란은 같은 연도의 PDF 값으로 보충한다", () => {
  const parser = loadParser();
  const existing = [{
    closingDate: "2025-12-31",
    totalAssets: 1000,
    paidInCapital: null,
    totalEquity: 300,
    revenue: 700,
    operatingProfit: 50,
    netIncome: 40,
  }];
  const imported = [{ ...existing[0], paidInCapital: 120 }];
  const result = parser.reconcileFinancialRows(existing, imported);

  assert.equal(result.rows[0].paidInCapital, 120);
  assert.equal(result.filledFields.length, 1);
  assert.equal(result.conflicts.length, 0);
});
