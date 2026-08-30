(function () {
  "use strict";

  var STORAGE_KEY = "ip-valuation-cretop-pdf-import-v1";
  var MAX_FILE_SIZE = 30 * 1024 * 1024;
  var MAX_PAGES = 80;
  var pendingResult = null;
  var fileInput = null;
  var dialog = null;
  var FINANCIAL_FIELDS = ["totalAssets", "paidInCapital", "totalEquity", "revenue", "operatingProfit", "netIncome"];
  var FINANCIAL_LABELS = {
    totalAssets: "총자산",
    paidInCapital: "납입자본금",
    totalEquity: "자본총계",
    revenue: "매출액",
    operatingProfit: "영업이익",
    netIncome: "순이익",
  };
  var RATIO_FIELDS = ["cost", "sga"];
  var RATIO_LABELS = {
    cost: "매출원가율",
    sga: "판관비율",
  };

  function compact(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function parseNumber(value) {
    var normalized = String(value || "").replace(/,/g, "").replace(/[^0-9.+-]/g, "");
    var parsed = Number(normalized);
    return normalized && Number.isFinite(parsed) ? parsed : null;
  }

  function numberTokens(value) {
    return (String(value || "").match(/[-+]?\d[\d,]*(?:\.\d+)?/g) || [])
      .map(parseNumber)
      .filter(function (item) { return item !== null; });
  }

  function findPage(pages, pattern) {
    return pages.find(function (page) {
      return page.lines.some(function (line) { return pattern.test(line); });
    });
  }

  function firstMatch(lines, pattern, group) {
    for (var index = 0; index < lines.length; index += 1) {
      var match = lines[index].match(pattern);
      if (match) return compact(match[group || 1]);
    }
    return "";
  }

  function valuesAfterLabel(lines, labelPattern, count) {
    var line = lines.find(function (item) { return labelPattern.test(item); });
    if (!line) return [];
    var label = line.match(labelPattern);
    var tail = label ? line.slice((label.index || 0) + label[0].length) : line;
    return numberTokens(tail).slice(-count);
  }

  function parseProfile(pages) {
    var page = findPage(pages, /기업개요/);
    if (!page) return {};
    var lines = page.lines;
    var industryLine = lines.find(function (line) { return /표준산업분류\(11차\)/.test(line); }) || "";
    var industryMatch = industryLine.match(/표준산업분류\(11차\)\s*\(?([A-Z]\d{5})\)?\s*(.+)$/);
    var addressLine = lines.find(function (line) { return /^주소\s+/.test(line); }) || "";
    var productLine = lines.find(function (line) { return /^주요제품\(상품\)\s+/.test(line); }) || "";
    var closingDate = firstMatch(lines, /결산일자\s*:\s*(\d{4}-\d{2}-\d{2})/);
    return {
      companyName: firstMatch(lines, /기업명\s+(.+?)\s+영문기업명/),
      businessNumber: firstMatch(lines, /사업자번호\s+(\d{3}-\d{2}-\d{5})/),
      corporationNumber: firstMatch(lines, /법인\(주민\)번호\s+([\d-]+)/),
      representativeName: firstMatch(lines, /대표자명\s+(.+?)\s+종업원수/),
      employeeCount: firstMatch(lines, /종업원수\s+(.+?)(?:\s+설립형태|$)/),
      establishedDate: firstMatch(lines, /설립년월\s+(\d{4}-\d{2}-\d{2})/),
      companyType: firstMatch(lines, /기업유형\s+(.+?)\s+기업규모/),
      companySize: firstMatch(lines, /기업규모\s+(.+)$/),
      address: compact(addressLine.replace(/^주소\s+/, "")),
      mainProducts: compact(productLine.replace(/^주요제품\(상품\)\s+/, "")),
      industryCode: industryMatch ? industryMatch[1] : "",
      industryName: industryMatch ? compact(industryMatch[2]) : "",
      closingDate: closingDate,
    };
  }

  function parseFinancials(pages, profile) {
    var balancePage = findPage(pages, /요약 재무상태표/);
    var incomePage = findPage(pages, /요약 손익계산서/);
    if (!balancePage && !incomePage) return [];
    var yearLines = [];
    [balancePage, incomePage].forEach(function (page) {
      if (!page) return;
      page.lines.forEach(function (line) {
        if (/구분\s+20\d{2}/.test(line)) yearLines.push(line);
      });
    });
    var years = [];
    yearLines.forEach(function (line) {
      (line.match(/20\d{2}/g) || []).forEach(function (year) {
        if (!years.includes(Number(year))) years.push(Number(year));
      });
    });
    years.sort(function (left, right) { return left - right; });
    if (!years.length) return [];
    var count = years.length;
    var balanceLines = balancePage ? balancePage.lines : [];
    var incomeLines = incomePage ? incomePage.lines : [];
    var assets = valuesAfterLabel(balanceLines, /자산총계/, count);
    var capital = valuesAfterLabel(balanceLines, /자본금/, count);
    var equity = valuesAfterLabel(balanceLines, /자본총계/, count);
    var revenue = valuesAfterLabel(incomeLines, /매출액/, count);
    var operatingProfit = valuesAfterLabel(incomeLines, /영업이익/, count);
    var netIncome = valuesAfterLabel(incomeLines, /당기순이익/, count);
    var latestClosingDate = profile.closingDate || (years[years.length - 1] + "-12-31");
    var monthDay = latestClosingDate.slice(4);
    return years.map(function (year, index) {
      return {
        closingDate: String(year) + monthDay,
        totalAssets: assets[index] == null ? null : assets[index],
        paidInCapital: capital[index] == null ? null : capital[index],
        totalEquity: equity[index] == null ? null : equity[index],
        revenue: revenue[index] == null ? null : revenue[index],
        operatingProfit: operatingProfit[index] == null ? null : operatingProfit[index],
        netIncome: netIncome[index] == null ? null : netIncome[index],
      };
    }).filter(function (row) {
      return [row.totalAssets, row.totalEquity, row.revenue].some(function (value) { return value !== null; });
    });
  }

  function parseRatios(pages) {
    var page = findPage(pages, /매출원가율|판관비율|판매비와관리비율/);
    if (!page) return [];
    var header = page.lines.find(function (line) { return /구분\s+계정명\s+20\d{2}/.test(line); }) || "";
    var dates = header.match(/20\d{2}-\d{2}-\d{2}/g) || [];
    if (!dates.length) return [];
    var costs = valuesAfterLabel(page.lines, /매출원가율/, dates.length);
    var sgas = valuesAfterLabel(page.lines, /판관비율|판매비와관리비율/, dates.length);
    return dates.map(function (date, index) {
      return { date: date, cost: costs[index] == null ? null : costs[index], sga: sgas[index] == null ? null : sgas[index] };
    }).filter(function (row) { return row.cost !== null || row.sga !== null; });
  }

  function usableNameContinuation(line) {
    return line && !/기업명|사업자번호|대표자명|거래비중|결산년도|판매처현황|구매처현황|매출구성|기준일자|단위|기타|COPYRIGHT/.test(line)
      && !/\d{3}-\d{2}-\d{5}/.test(line)
      && !/^[-+]?\d[\d,.\s-]*$/.test(line)
      && line.length <= 32;
  }

  function parseCustomers(pages) {
    var page = findPage(pages, /판매처현황/);
    if (!page) return { referenceDate: "", rows: [] };
    var start = page.lines.findIndex(function (line) { return /판매처현황/.test(line); });
    var endOffset = page.lines.slice(start + 1).findIndex(function (line) { return /매출구성/.test(line); });
    var end = endOffset < 0 ? page.lines.length : start + 1 + endOffset;
    var section = page.lines.slice(start + 1, end);
    var rows = [];
    section.forEach(function (line, index) {
      var businessMatch = line.match(/(?:\d{3}-\d{2}-\d{5}|\d{10})/);
      if (!businessMatch) return;
      var businessNumber = businessMatch[0];
      var businessIndex = line.indexOf(businessNumber);
      var name = compact(line.slice(0, businessIndex));
      var suffix = compact(line.slice(businessIndex + businessNumber.length));
      var suffixMatch = suffix.match(/^(.+?)\s+([-+]?\d+(?:\.\d+)?)\s+(20\d{2})(?:\s|$)/);
      if (!suffixMatch) return;
      if (!name && usableNameContinuation(section[index - 1])) name = compact(section[index - 1]);
      if (usableNameContinuation(section[index + 1])) {
        var following = section[index + 2] || "";
        var followingBusiness = following.match(/(?:\d{3}-\d{2}-\d{5}|\d{10})/);
        var followingHasOwnName = followingBusiness && compact(following.slice(0, following.indexOf(followingBusiness[0])));
        var nextLineStartsNextRow = followingBusiness && !followingHasOwnName;
        if (!nextLineStartsNextRow) name += compact(section[index + 1]);
      }
      name = name.replace(/\s+/g, "").replace(/^[-–—]+|[-–—]+$/g, "");
      if (!name || name === "기타") return;
      rows.push({
        name: name,
        businessNumber: businessNumber,
        share: Number(suffixMatch[2]),
        fiscalYear: Number(suffixMatch[3]),
      });
    });
    var seen = new Set();
    rows = rows.filter(function (row) {
      if (seen.has(row.name)) return false;
      seen.add(row.name);
      return true;
    }).sort(function (left, right) { return right.share - left.share; }).slice(0, 4);
    var referenceDate = firstMatch(section, /기준일자\s*:\s*(\d{4}-\d{2}-\d{2})/);
    if (!rows.length) {
      var allText = pages.map(function (item) { return item.lines.join(" "); }).join(" ");
      var narrative = allText.match(/주요 매출처로는\s+(.+?)\s+등이 있으며/);
      if (narrative) {
        rows = narrative[1].split(/,\s*/).slice(0, 4).map(function (name) {
          return { name: compact(name), businessNumber: "", share: null, fiscalYear: null };
        });
      }
    }
    return { referenceDate: referenceDate, rows: rows };
  }

  function parseExtractedPages(pages, fileName) {
    var profile = parseProfile(pages);
    var financials = parseFinancials(pages, profile);
    var ratios = parseRatios(pages);
    var customers = parseCustomers(pages);
    return {
      parserVersion: "1.0.0",
      fileName: fileName || "크레탑 기업종합보고서.pdf",
      importedAt: new Date().toISOString(),
      profile: profile,
      financials: financials,
      ratios: ratios,
      majorCustomers: customers.rows,
      customerReferenceDate: customers.referenceDate,
      pageCount: pages.length,
    };
  }

  function normalizeCompetitorRatios(result) {
    var ratios = Array.isArray(result && result.ratios) ? result.ratios
      .filter(function (row) { return row && /^\d{4}-\d{2}-\d{2}$/.test(row.date); })
      .sort(function (left, right) { return left.date.localeCompare(right.date); })
      .slice(-3) : [];
    return {
      companyName: compact(result && result.profile && result.profile.companyName) || "경쟁기업",
      years: ratios.map(function (row) { return Number(row.date.slice(0, 4)); }),
      cost: ratios.map(function (row) { return row.cost == null ? 0 : row.cost; }),
      sga: ratios.map(function (row) { return row.sga == null ? 0 : row.sga; }),
      fileName: compact(result && result.fileName),
    };
  }

  function companyPasteText(result) {
    var profile = result.profile;
    var lines = [];
    if (profile.companyName) lines.push("기업명\t" + profile.companyName);
    if (profile.businessNumber || profile.representativeName) lines.push("사업자번호\t" + (profile.businessNumber || "") + "\t대표자명\t" + (profile.representativeName || ""));
    if (profile.corporationNumber || profile.employeeCount) lines.push("법인(주민)번호\t" + (profile.corporationNumber || "") + "\t종업원수\t" + (profile.employeeCount || ""));
    if (profile.establishedDate || profile.companyType) lines.push("설립년월\t" + (profile.establishedDate || "") + "\t기업유형\t" + (profile.companyType || ""));
    if (profile.companySize) lines.push("기업규모\t" + profile.companySize);
    if (profile.address) lines.push("주소\t" + profile.address);
    if (profile.industryCode) lines.push("표준산업분류(11차)\t(" + profile.industryCode + ") " + profile.industryName);
    if (profile.mainProducts) lines.push("주요제품(상품)\t" + profile.mainProducts);
    return lines.join("\n");
  }

  function financialPasteText(result) {
    var header = "결산기준일\t총자산\t납입자본금\t자본총계\t매출액\t영업이익\t순이익";
    return [header].concat(result.financials.map(function (row) {
      return [row.closingDate, row.totalAssets, row.paidInCapital, row.totalEquity, row.revenue, row.operatingProfit, row.netIncome]
        .map(function (value) { return value == null ? "" : String(value); }).join("\t");
    })).join("\n");
  }

  function ratioPasteText(result) {
    if (!result.ratios.length) return "";
    return [
      ["구분"].concat(result.ratios.map(function (row) { return row.date; })).join("\t"),
      ["매출원가율"].concat(result.ratios.map(function (row) { return row.cost == null ? "" : row.cost; })).join("\t"),
      ["판관비율"].concat(result.ratios.map(function (row) { return row.sga == null ? "" : row.sga; })).join("\t"),
    ].join("\n");
  }

  function setControlledValue(element, value) {
    if (!element) return false;
    var prototype = element.tagName === "TEXTAREA"
      ? HTMLTextAreaElement.prototype
      : element.tagName === "SELECT"
        ? HTMLSelectElement.prototype
        : HTMLInputElement.prototype;
    var setter = Object.getOwnPropertyDescriptor(prototype, "value").set;
    setter.call(element, value);
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  }

  function clickApplyButton(textarea, labels) {
    if (!textarea) return false;
    var article = textarea.closest("article") || textarea.parentElement;
    var button = Array.from(article.querySelectorAll("button")).find(function (item) {
      return labels.some(function (label) { return item.textContent.includes(label); });
    });
    if (!button) return false;
    button.click();
    return true;
  }

  function currentFinancialsLookLikeSample() {
    var rows = Array.from(document.querySelectorAll(".company-financial-table-wrap tbody tr:not(.average-row)"));
    return rows.some(function (row) {
      var cells = row.querySelectorAll("td");
      return cells[0] && cells[0].textContent.trim() === "2025-12-31"
        && cells[1] && cells[1].textContent.replace(/,/g, "").trim() === "3926"
        && cells[4] && cells[4].textContent.replace(/,/g, "").trim() === "5813";
    });
  }

  function currentDetailedFinancialRows() {
    return Array.from(document.querySelectorAll(".company-financial-table-wrap tbody tr:not(.average-row)"))
      .map(function (row) {
        var cells = row.querySelectorAll("td");
        if (cells.length < 7) return null;
        return {
          closingDate: compact(cells[0].textContent),
          totalAssets: parseNumber(cells[1].textContent),
          paidInCapital: parseNumber(cells[2].textContent),
          totalEquity: parseNumber(cells[3].textContent),
          revenue: parseNumber(cells[4].textContent),
          operatingProfit: parseNumber(cells[5].textContent),
          netIncome: parseNumber(cells[6].textContent),
        };
      })
      .filter(function (row) { return row && /^\d{4}-\d{2}-\d{2}$/.test(row.closingDate); });
  }

  function sameFinancialValue(left, right) {
    return Math.abs(left - right) <= 0.01;
  }

  function reconcileFinancialRows(existing, imported) {
    var byDate = new Map();
    var conflicts = [];
    var matchedYears = [];
    var addedYears = [];
    var filledFields = [];
    existing.forEach(function (row) { byDate.set(row.closingDate, row); });
    imported.forEach(function (row) {
      var previous = byDate.get(row.closingDate);
      if (!previous) {
        byDate.set(row.closingDate, row);
        addedYears.push(row.closingDate);
        return;
      }
      var next = Object.assign({}, previous);
      var yearMatched = false;
      FINANCIAL_FIELDS.forEach(function (key) {
        var pastedValue = previous[key];
        var pdfValue = row[key];
        if (pdfValue == null) return;
        if (pastedValue == null) {
          next[key] = pdfValue;
          filledFields.push({ closingDate: row.closingDate, key: key, value: pdfValue });
          return;
        }
        if (sameFinancialValue(pastedValue, pdfValue)) {
          yearMatched = true;
          return;
        }
        conflicts.push({
          closingDate: row.closingDate,
          key: key,
          label: FINANCIAL_LABELS[key],
          pastedValue: pastedValue,
          pdfValue: pdfValue,
        });
      });
      if (yearMatched && !matchedYears.includes(row.closingDate)) matchedYears.push(row.closingDate);
      byDate.set(row.closingDate, next);
    });
    return {
      rows: Array.from(byDate.values()).sort(function (left, right) { return right.closingDate.localeCompare(left.closingDate); }).slice(0, 5),
      conflicts: conflicts,
      matchedYears: matchedYears,
      addedYears: addedYears,
      filledFields: filledFields,
    };
  }

  function financialConflictMessage(reconciliation) {
    if (!reconciliation.conflicts.length) {
      return reconciliation.matchedYears.length
        ? "붙여넣기 자료와 PDF의 중복 " + reconciliation.matchedYears.length + "개년을 교차검증했으며 값이 일치합니다. 붙여넣기의 추가 연도는 그대로 유지합니다."
        : "기존 붙여넣기 자료와 PDF 자료를 결산일 기준으로 병합하며, 붙여넣기의 추가 연도는 그대로 유지합니다.";
    }
    var details = reconciliation.conflicts.slice(0, 6).map(function (item) {
      return item.closingDate.slice(0, 4) + "년 " + item.label + "(붙여넣기 " + item.pastedValue.toLocaleString("ko-KR") + " / PDF " + item.pdfValue.toLocaleString("ko-KR") + ")";
    }).join(", ");
    var remainder = reconciliation.conflicts.length > 6 ? " 외 " + (reconciliation.conflicts.length - 6) + "건" : "";
    return "주의: " + details + remainder + "이 서로 다릅니다. 기존 붙여넣기 값을 유지했으니 원자료를 확인해 주세요.";
  }

  function currentRatioRows() {
    var card = document.querySelector(".ratio-compare-card");
    if (!card) return [];
    var dates = Array.from(card.querySelectorAll('thead input[type="date"]')).map(function (input) { return input.value; });
    var rows = card.querySelectorAll("tbody tr");
    var costs = rows[0] ? Array.from(rows[0].querySelectorAll("input")).map(function (input) { return input.value.trim() === "" ? null : parseNumber(input.value); }) : [];
    var sgas = rows[1] ? Array.from(rows[1].querySelectorAll("input")).map(function (input) { return input.value.trim() === "" ? null : parseNumber(input.value); }) : [];
    return dates.map(function (date, index) {
      return { date: date, cost: costs[index], sga: sgas[index] };
    }).filter(function (row) { return /^\d{4}-\d{2}-\d{2}$/.test(row.date); });
  }

  function ratiosLookLikeSample(rows) {
    var samples = [
      { date: "2023-12-31", cost: 82.35, sga: 7.7 },
      { date: "2024-12-31", cost: 92.97, sga: 8.22 },
      { date: "2025-12-31", cost: 108.14, sga: 12.06 },
    ];
    return rows.length === samples.length && samples.every(function (sample) {
      return rows.some(function (row) {
        return row.date === sample.date
          && Math.abs((row.cost || 0) - sample.cost) < 0.001
          && Math.abs((row.sga || 0) - sample.sga) < 0.001;
      });
    });
  }

  function reconcileRatioRows(existing, imported) {
    var byDate = new Map();
    var conflicts = [];
    var matchedYears = [];
    var addedYears = [];
    var filledFields = [];
    existing.forEach(function (row) { byDate.set(row.date, row); });
    imported.forEach(function (row) {
      var previous = byDate.get(row.date);
      if (!previous) {
        byDate.set(row.date, row);
        addedYears.push(row.date);
        return;
      }
      var next = Object.assign({}, previous);
      var yearMatched = false;
      RATIO_FIELDS.forEach(function (key) {
        var pastedValue = previous[key];
        var pdfValue = row[key];
        if (pdfValue == null) return;
        if (pastedValue == null) {
          next[key] = pdfValue;
          filledFields.push({ date: row.date, key: key, value: pdfValue });
          return;
        }
        if (sameFinancialValue(pastedValue, pdfValue)) {
          yearMatched = true;
          return;
        }
        conflicts.push({
          date: row.date,
          key: key,
          label: RATIO_LABELS[key],
          pastedValue: pastedValue,
          pdfValue: pdfValue,
        });
      });
      if (yearMatched && !matchedYears.includes(row.date)) matchedYears.push(row.date);
      byDate.set(row.date, next);
    });
    return {
      rows: Array.from(byDate.values()).sort(function (left, right) { return left.date.localeCompare(right.date); }).slice(-5),
      conflicts: conflicts,
      matchedYears: matchedYears,
      addedYears: addedYears,
      filledFields: filledFields,
    };
  }

  function ratioConflictMessage(reconciliation) {
    if (!reconciliation.conflicts.length) {
      return reconciliation.matchedYears.length
        ? "원가율·판관비율 중복 " + reconciliation.matchedYears.length + "개년을 교차검증했으며 값이 일치합니다. 붙여넣기의 추가 연도는 그대로 유지합니다."
        : "원가율·판관비율을 결산일 기준으로 병합하며, 붙여넣기의 추가 연도는 그대로 유지합니다.";
    }
    var details = reconciliation.conflicts.slice(0, 6).map(function (item) {
      return item.date.slice(0, 4) + "년 " + item.label + "(붙여넣기 " + item.pastedValue.toLocaleString("ko-KR") + "% / PDF " + item.pdfValue.toLocaleString("ko-KR") + "%)";
    }).join(", ");
    var remainder = reconciliation.conflicts.length > 6 ? " 외 " + (reconciliation.conflicts.length - 6) + "건" : "";
    return "주의: " + details + remainder + "이 서로 다릅니다. 기존 붙여넣기 비율을 유지했으니 원자료를 확인해 주세요.";
  }

  function wait(milliseconds) {
    return new Promise(function (resolve) { window.setTimeout(resolve, milliseconds); });
  }

  async function applyResult(result) {
    document.documentElement.dataset.cretopPdfApplying = "true";
    var replaceSample = currentFinancialsLookLikeSample();
    var existingRatios = currentRatioRows();
    var replaceRatioSample = ratiosLookLikeSample(existingRatios);
    document.documentElement.dataset.cretopPdfMerge = replaceSample ? "replace" : "merge";
    var reconciliation = replaceSample ? { rows: result.financials, conflicts: [], matchedYears: [], addedYears: [], filledFields: [] }
      : reconcileFinancialRows(currentDetailedFinancialRows(), result.financials);
    var appliedFinancials = reconciliation.rows;
    var ratioReconciliation = replaceRatioSample
      ? { rows: result.ratios, conflicts: [], matchedYears: [], addedYears: [], filledFields: [] }
      : reconcileRatioRows(existingRatios, result.ratios);
    var appliedRatios = ratioReconciliation.rows;
    window.CRETOP_PDF_IMPORT_STATE = result;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result));

    var companyTextarea = document.querySelector('textarea[aria-label="크레탑 기업개요 표"]');
    setControlledValue(companyTextarea, companyPasteText(result));
    await wait(40);
    clickApplyButton(companyTextarea, ["내용 인식"]);

    if (result.financials.length) {
      var financialTextarea = document.querySelector('textarea[aria-label="크레탑 사업화주체 재무자료 붙여넣기"]');
      setControlledValue(financialTextarea, financialPasteText({ financials: appliedFinancials }));
      await wait(40);
      clickApplyButton(financialTextarea, ["다시 인식", "인식"]);
    }

    if (result.ratios.length) {
      var ratioTextarea = document.querySelector('textarea[aria-label="사업화주체 원가율·판관비율 붙여넣기"]');
      setControlledValue(ratioTextarea, ratioPasteText({ ratios: appliedRatios }));
      await wait(40);
      clickApplyButton(ratioTextarea, ["다시 인식", "인식"]);
    }

    await wait(80);
    updateAvailabilityControls({ financials: appliedFinancials });
    delete document.documentElement.dataset.cretopPdfApplying;
    delete document.documentElement.dataset.cretopPdfMerge;
    var ratioStatusMessage = replaceRatioSample ? "초기 예시 원가율·판관비율은 PDF 자료로 교체했습니다." : ratioConflictMessage(ratioReconciliation);
    var statusMessage = appliedFinancials.length + "개년 재무정보와 " + appliedRatios.length + "개년 원가율·판관비율, 주요 판매처 " + result.majorCustomers.length + "곳을 반영했습니다. "
      + financialConflictMessage(reconciliation) + " " + ratioStatusMessage;
    showInlineStatus(statusMessage, reconciliation.conflicts.length || ratioReconciliation.conflicts.length ? "warning" : "success");
  }

  function consecutivePositiveYears(rows) {
    var years = rows.filter(function (row) { return row.revenue > 0; }).map(function (row) { return Number(row.closingDate.slice(0, 4)); }).sort(function (a, b) { return b - a; });
    if (!years.length) return 0;
    var count = 1;
    for (var index = 1; index < years.length; index += 1) {
      if (years[index - 1] - years[index] !== 1) break;
      count += 1;
    }
    return count;
  }

  function updateAvailabilityControls(result) {
    var available = Math.min(5, consecutivePositiveYears(result.financials));
    var labels = Array.from(document.querySelectorAll("label"));
    labels.forEach(function (label) {
      var caption = compact((label.querySelector("span") || label).textContent);
      var select = label.querySelector("select");
      if (!select) return;
      if (/사업화주체 기준개년|평균기간/.test(caption)) {
        Array.from(select.options).forEach(function (option) {
          var period = Number(option.value);
          if (Number.isFinite(period)) option.disabled = period > available;
        });
        if (Number(select.value) > available && available >= 1) {
          setControlledValue(select, String(Math.max(caption.includes("기준개년") ? 2 : 1, available)));
        }
      }
    });
    var salesMixPeriod = document.querySelector(".related-sales-card .comparison-period select");
    if (salesMixPeriod) {
      Array.from(salesMixPeriod.options).forEach(function (option) { option.disabled = Number(option.value) > available; });
      if (Number(salesMixPeriod.value) > available && available >= 1) setControlledValue(salesMixPeriod, String(available));
    }
  }

  function currentFinancialRowsFromDom() {
    return Array.from(document.querySelectorAll(".company-financial-table-wrap tbody tr:not(.average-row)"))
      .map(function (row) {
        var cells = row.querySelectorAll("td");
        if (cells.length < 7) return null;
        return {
          closingDate: compact(cells[0].textContent),
          revenue: parseNumber(cells[4].textContent),
        };
      })
      .filter(function (row) { return row && /^\d{4}-\d{2}-\d{2}$/.test(row.closingDate) && row.revenue > 0; });
  }

  function customerEvidenceLine(state) {
    var customers = state && Array.isArray(state.majorCustomers) ? state.majorCustomers.slice(0, 4) : [];
    if (!customers.length) return "";
    var names = customers.map(function (customer) { return customer.name; }).filter(Boolean);
    if (!names.length) return "";
    var reference = state.customerReferenceDate ? state.customerReferenceDate + " 기준 " : "";
    var largest = customers.find(function (customer) { return typeof customer.share === "number"; });
    var concentration = largest && largest.share >= 30
      ? " 다만 최대 거래처 비중이 " + largest.share.toFixed(2).replace(/\.00$/, "") + "%로 매출처 편중 가능성을 함께 검토할 필요가 있음."
      : "";
    return "- 크레탑 기업종합보고서 " + reference + names.join(", ") + " 등이 주요 매출처로 확인되어 기존 거래기반을 최초 매출액 추정의 보조 근거로 활용함." + concentration;
  }

  function normalizedCompanyIdentity(value) {
    return compact(value).replace(/\(주\)|주식회사|유한회사|㈜/g, "").replace(/[^0-9A-Za-z가-힣]/g, "").toLowerCase();
  }

  function installReviewOpinionEnhancer() {
    if (typeof window.vp !== "function" || window.vp.__cretopPdfEnhanced) return;
    var original = window.vp;
    var enhanced = function (input) {
      var state = window.CRETOP_PDF_IMPORT_STATE || null;
      var next = Object.assign({}, input);
      if (state && state.profile && state.profile.companyName && next.companyName
        && normalizedCompanyIdentity(state.profile.companyName) !== normalizedCompanyIdentity(next.companyName)) {
        state = null;
      }
      var dateInput = document.querySelector('.normalization-table input[type="date"]');
      var establishedDate = (state && state.profile && state.profile.establishedDate) || (dateInput && dateInput.value) || "";
      if (/^\d{4}-\d{2}-\d{2}$/.test(establishedDate)) {
        next.establishedYear = Number(establishedDate.slice(0, 4));
        next.establishedMonth = Number(establishedDate.slice(5, 7));
      }
      var financialRows = currentFinancialRowsFromDom();
      if (!financialRows.length && state && Array.isArray(state.financials)) {
        financialRows = state.financials.filter(function (row) { return row.revenue > 0; });
      }
      if (financialRows.length) {
        var recent = financialRows.sort(function (left, right) { return left.closingDate.localeCompare(right.closingDate); }).slice(-5);
        next.salesHistory = recent.map(function (row) {
          return { year: Number(row.closingDate.slice(0, 4)), revenueHundredMillion: row.revenue / 100 };
        });
        next.businessSalesBasis = Object.assign({}, next.businessSalesBasis, { periodYears: recent.length });
      }
      var opinion = original(next);
      var customerLine = customerEvidenceLine(state);
      if (customerLine && !opinion.includes(customerLine)) {
        opinion = opinion.replace("- 사업화제품 매출액은", customerLine + "\n- 사업화제품 매출액은");
      }
      return opinion;
    };
    enhanced.__cretopPdfEnhanced = true;
    enhanced.__original = original;
    window.vp = enhanced;
  }

  function makeCell(label, value) {
    var cell = document.createElement("div");
    var strong = document.createElement("strong");
    var span = document.createElement("span");
    strong.textContent = label;
    span.textContent = value || "미확인";
    cell.append(strong, span);
    return cell;
  }

  function renderPreview(result) {
    if (!dialog) createDialog();
    pendingResult = result;
    dialog.querySelector("[data-pdf-file]").textContent = result.fileName + " · " + result.pageCount + "쪽";
    var facts = dialog.querySelector("[data-pdf-facts]");
    facts.replaceChildren(
      makeCell("기업명", result.profile.companyName),
      makeCell("사업자번호", result.profile.businessNumber),
      makeCell("대표자", result.profile.representativeName),
      makeCell("설립일", result.profile.establishedDate),
      makeCell("산업분류", [result.profile.industryCode, result.profile.industryName].filter(Boolean).join(" · ")),
      makeCell("재무기간", result.financials.length ? result.financials[0].closingDate.slice(0, 4) + "~" + result.financials[result.financials.length - 1].closingDate.slice(0, 4) + "년" : "미확인")
    );
    var financialBody = dialog.querySelector("[data-pdf-financials]");
    financialBody.replaceChildren();
    result.financials.forEach(function (row) {
      var tr = document.createElement("tr");
      [row.closingDate, row.totalAssets, row.totalEquity, row.revenue, row.operatingProfit, row.netIncome].forEach(function (value) {
        var td = document.createElement("td");
        td.textContent = typeof value === "number" ? value.toLocaleString("ko-KR") : (value == null ? "—" : value);
        tr.appendChild(td);
      });
      financialBody.appendChild(tr);
    });
    var customerList = dialog.querySelector("[data-pdf-customers]");
    customerList.replaceChildren();
    if (result.majorCustomers.length) {
      result.majorCustomers.forEach(function (customer) {
        var li = document.createElement("li");
        li.textContent = customer.name + (typeof customer.share === "number" ? " · " + customer.share.toFixed(2).replace(/\.00$/, "") + "%" : "");
        customerList.appendChild(li);
      });
    } else {
      var empty = document.createElement("li");
      empty.textContent = "주요 판매처 미확인 · 기존 자동의견 유지";
      customerList.appendChild(empty);
    }
    var mergeWarning = dialog.querySelector("[data-pdf-merge-warning]");
    var previewReconciliation = currentFinancialsLookLikeSample()
      ? { conflicts: [], matchedYears: [], addedYears: [], filledFields: [] }
      : reconcileFinancialRows(currentDetailedFinancialRows(), result.financials);
    var previewRatioRows = currentRatioRows();
    var previewReplaceRatioSample = ratiosLookLikeSample(previewRatioRows);
    var previewRatioReconciliation = previewReplaceRatioSample
      ? { conflicts: [], matchedYears: [], addedYears: [], filledFields: [] }
      : reconcileRatioRows(previewRatioRows, result.ratios);
    var previewFinancialMessage = currentFinancialsLookLikeSample()
      ? "초기 예시 재무자료는 PDF 자료로 교체합니다."
      : financialConflictMessage(previewReconciliation);
    var previewRatioMessage = previewReplaceRatioSample ? "초기 예시 원가율·판관비율은 PDF 자료로 교체합니다." : ratioConflictMessage(previewRatioReconciliation);
    mergeWarning.textContent = previewFinancialMessage + " " + previewRatioMessage;
    mergeWarning.parentElement.dataset.tone = previewReconciliation.conflicts.length || previewRatioReconciliation.conflicts.length ? "warning" : "info";
    dialog.hidden = false;
    dialog.querySelector("[data-pdf-apply]").focus();
  }

  function createDialog() {
    dialog = document.createElement("div");
    dialog.className = "cretop-pdf-dialog";
    dialog.hidden = true;
    dialog.innerHTML = '<div class="cretop-pdf-backdrop" data-pdf-close></div><section role="dialog" aria-modal="true" aria-labelledby="cretopPdfTitle"><div class="cretop-pdf-dialog-head"><div><span>CRET0P PDF IMPORT</span><h2 id="cretopPdfTitle">기업종합보고서 인식 결과</h2><p data-pdf-file></p></div><button type="button" data-pdf-close aria-label="닫기">×</button></div><div class="cretop-pdf-facts" data-pdf-facts></div><div class="cretop-pdf-preview-grid"><article><h3>요약 재무정보 <small>단위: 백만원</small></h3><div class="cretop-pdf-table-wrap"><table><thead><tr><th>결산일</th><th>총자산</th><th>자본총계</th><th>매출액</th><th>영업이익</th><th>순이익</th></tr></thead><tbody data-pdf-financials></tbody></table></div></article><article><h3>자동의견 보강용 주요 판매처</h3><ul data-pdf-customers></ul><p>판매처만 보조 근거로 사용하며 구매처·기타는 제외합니다.</p></article></div><div class="cretop-pdf-warning"><strong>적용 전 확인</strong><span data-pdf-merge-warning>기존 붙여넣기 자료와 결산일 기준으로 교차검증합니다.</span></div><div class="cretop-pdf-dialog-actions"><button type="button" data-pdf-close>취소</button><button type="button" class="primary" data-pdf-apply>확인한 정보 적용</button></div></section>';
    dialog.addEventListener("click", function (event) {
      if (event.target.closest("[data-pdf-close]")) dialog.hidden = true;
      if (event.target.closest("[data-pdf-apply]") && pendingResult) {
        dialog.hidden = true;
        applyResult(pendingResult);
      }
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && dialog && !dialog.hidden) dialog.hidden = true;
    });
    document.body.appendChild(dialog);
  }

  function showInlineStatus(message, tone) {
    var status = document.querySelector(".cretop-pdf-status");
    if (!status) return;
    status.textContent = message;
    status.dataset.tone = tone || "info";
  }

  async function extractPdf(file, onProgress) {
    if (!window.pdfjsLib) throw new Error("PDF 처리 모듈을 불러오지 못했습니다. 페이지를 새로고침해 주세요.");
    if (file.size > MAX_FILE_SIZE) throw new Error("PDF는 30MB 이하 파일만 업로드할 수 있습니다.");
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = "./assets/vendor/pdfjs/pdf.worker.min.js";
    var bytes = new Uint8Array(await file.arrayBuffer());
    var documentTask = window.pdfjsLib.getDocument({ data: bytes });
    var pdf = await documentTask.promise;
    if (pdf.numPages > MAX_PAGES) throw new Error("80쪽 이하의 크레탑 기업종합보고서만 처리할 수 있습니다.");
    var pages = [];
    for (var pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      var progressMessage = "PDF " + pageNumber + "/" + pdf.numPages + "쪽을 확인하고 있습니다.";
      if (typeof onProgress === "function") onProgress(progressMessage);
      else showInlineStatus(progressMessage, "loading");
      var page = await pdf.getPage(pageNumber);
      var content = await page.getTextContent({ normalizeWhitespace: true });
      var grouped = new Map();
      content.items.forEach(function (item) {
        var y = Math.round(item.transform[5] * 2) / 2;
        if (!grouped.has(y)) grouped.set(y, []);
        grouped.get(y).push({ x: item.transform[4], text: item.str });
      });
      var lines = Array.from(grouped.entries()).sort(function (left, right) { return right[0] - left[0]; }).map(function (entry) {
        return compact(entry[1].sort(function (left, right) { return left.x - right.x; }).map(function (item) { return item.text; }).join(""));
      }).filter(Boolean);
      pages.push({ pageNumber: pageNumber, lines: lines });
    }
    return parseExtractedPages(pages, file.name);
  }

  async function handleFile(file) {
    if (!file) return;
    if (!/\.pdf$/i.test(file.name) && file.type !== "application/pdf") {
      showInlineStatus("PDF 형식의 기업종합보고서를 선택해 주세요.", "error");
      return;
    }
    showInlineStatus("기업종합보고서를 읽고 있습니다.", "loading");
    try {
      var result = await extractPdf(file);
      if (!result.profile.companyName || !result.financials.length) throw new Error("기업개요 또는 요약 재무정보를 찾지 못했습니다. 크레탑 기업종합보고서인지 확인해 주세요.");
      showInlineStatus("인식이 완료되었습니다. 적용할 내용을 확인해 주세요.", "success");
      renderPreview(result);
    } catch (error) {
      var message = error && error.name === "PasswordException"
        ? "암호가 설정된 PDF는 처리할 수 없습니다. 암호를 해제한 파일을 사용해 주세요."
        : (error instanceof Error ? error.message : "PDF 정보를 읽지 못했습니다.");
      showInlineStatus(message, "error");
    } finally {
      if (fileInput) fileInput.value = "";
    }
  }

  function ensureUploadButton() {
    var card = document.querySelector(".cretop-paste-card");
    if (!card || card.querySelector(".cretop-pdf-upload")) return;
    var title = card.querySelector(".card-title");
    if (!title) return;
    var actions = document.createElement("div");
    actions.className = "cretop-pdf-actions";
    var button = document.createElement("button");
    button.type = "button";
    button.className = "cretop-pdf-upload";
    button.textContent = "크레탑 기업종합보고서 PDF 업로드";
    button.addEventListener("click", function () { fileInput.click(); });
    var status = document.createElement("span");
    status.className = "cretop-pdf-status";
    status.setAttribute("aria-live", "polite");
    status.textContent = "기업개요·재무·비율·주요 판매처를 미리 확인한 뒤 적용합니다.";
    actions.append(button, status);
    title.insertAdjacentElement("afterend", actions);
  }

  function boot() {
    try {
      var saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (saved) window.CRETOP_PDF_IMPORT_STATE = saved;
    } catch (_) {}
    fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf,application/pdf";
    fileInput.hidden = true;
    fileInput.addEventListener("change", function () { handleFile(fileInput.files && fileInput.files[0]); });
    document.body.appendChild(fileInput);
    ensureUploadButton();
    new MutationObserver(ensureUploadButton).observe(document.getElementById("root") || document.body, { childList: true, subtree: true });
  }

  installReviewOpinionEnhancer();
  window.CretopPdfImportParser = {
    parseExtractedPages: parseExtractedPages,
    reconcileFinancialRows: reconcileFinancialRows,
    reconcileRatioRows: reconcileRatioRows,
    normalizeCompetitorRatios: normalizeCompetitorRatios,
    extractPdf: extractPdf,
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
