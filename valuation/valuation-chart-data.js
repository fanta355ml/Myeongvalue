/* Quick Valuation chart data reader
   가평가시트
   - D17:R17: 현금흐름 추정기간의 차년도별 매출액
   - D24:R24: 세후 로열티수입 할인 후 현재가치
   - D26: 지식재산유효성
   업종평균
   - J22:N25: 사업화주체/동업종 영업이익률 비교 블록
     최근 공통 3개년 평균을 우선 사용하고, 유효값 부족 시 2개년 → 1개년 순으로 축소
*/
(() => {
  window.quickValuationProjectedSalesSeries = [];
  window.quickValuationAnnualValueSeries = [];
  window.quickValuationAnnualValueMeta = null;
  window.quickValuationOperatingMarginSeries = [];
  window.quickValuationOperatingMarginMeta = null;

  const numericCell = (sheet, address) => {
    const target = sheet?.[address];
    if (!target) return null;
    const raw = target.v ?? target.w;
    const number = typeof raw === 'number'
      ? raw
      : Number(String(raw ?? '').replace(/,/g, '').replace(/[^0-9.+-]/g, ''));
    return Number.isFinite(number) ? number : null;
  };

  const textCell = (sheet, address) => {
    const target = sheet?.[address];
    if (!target) return '';
    return String(target.w ?? target.v ?? '').trim();
  };

  const percentValue = (sheet, address) => {
    const target = sheet?.[address];
    if (!target) return null;

    const display = String(target.w ?? '').trim();
    const displayMatch = display.match(/-?\d+(?:\.\d+)?\s*%/);
    if (displayMatch) {
      const value = Number(displayMatch[0].replace('%', '').trim());
      return Number.isFinite(value) ? value : null;
    }

    const raw = numericCell(sheet, address);
    if (!Number.isFinite(raw)) return null;
    return Math.abs(raw) <= 1 ? raw * 100 : raw;
  };

  const yearFromCell = (sheet, address) => {
    const target = sheet?.[address];
    if (!target) return null;

    const display = String(target.w ?? '').trim();
    const displayMatch = display.match(/(?:19|20)\d{2}/);
    if (displayMatch) return Number(displayMatch[0]);

    const raw = target.v;
    if (raw instanceof Date && !Number.isNaN(raw.getTime())) return raw.getFullYear();

    if (typeof raw === 'number' && Number.isFinite(raw)) {
      if (raw >= 1900 && raw <= 2200) return Math.round(raw);
      if (raw > 30000 && raw < 70000) {
        try {
          const parsed = XLSX?.SSF?.parse_date_code?.(raw);
          if (parsed?.y) return Number(parsed.y);
        } catch (error) {
          // fallback below
        }
        const date = new Date(Date.UTC(1899, 11, 30) + raw * 86400000);
        if (!Number.isNaN(date.getTime())) return date.getUTCFullYear();
      }
    }

    const rawMatch = String(raw ?? '').match(/(?:19|20)\d{2}/);
    return rawMatch ? Number(rawMatch[0]) : null;
  };

  function extractProjectedSales(sheet) {
    const series = [];
    for (let colIndex = 0; colIndex < 15; colIndex += 1) {
      const colCode = String.fromCharCode('D'.charCodeAt(0) + colIndex);
      const n = numericCell(sheet, `${colCode}11`) || (colIndex + 1);
      const salesMillion = numericCell(sheet, `${colCode}17`);
      if (!Number.isFinite(salesMillion) || salesMillion <= 0) continue;
      series.push({
        period: `${Math.round(n)}차년도`,
        n: Math.round(n),
        salesMillion,
        salesEok: salesMillion / 100,
      });
    }
    return series;
  }

  function extractAnnualValueSeries(sheet) {
    const validity = numericCell(sheet, 'D26');
    const validityUsable = Number.isFinite(validity) && validity > 0;
    const series = [];

    for (let colIndex = 0; colIndex < 15; colIndex += 1) {
      const colCode = String.fromCharCode('D'.charCodeAt(0) + colIndex);
      const n = numericCell(sheet, `${colCode}11`) || (colIndex + 1);
      const presentValue = numericCell(sheet, `${colCode}24`);
      if (!Number.isFinite(presentValue) || presentValue <= 0) continue;

      const valueMillion = validityUsable ? presentValue * validity : presentValue;
      series.push({
        period: `${Math.round(n)}차년도`,
        n: Math.round(n),
        valueMillion,
        valueEok: valueMillion / 100,
      });
    }

    const totalMillion = series.reduce((sum, item) => sum + item.valueMillion, 0);
    const finalTechnologyValue = numericCell(sheet, 'D27');

    return {
      series,
      meta: {
        validity: validityUsable ? validity : null,
        validityApplied: validityUsable,
        totalMillion,
        totalEok: totalMillion / 100,
        finalTechnologyValueMillion: finalTechnologyValue,
        finalTechnologyValueEok: Number.isFinite(finalTechnologyValue) ? finalTechnologyValue / 100 : null,
        basisLabel: validityUsable ? '세후 로열티 현재가치 × IP유효성' : '세후 로열티 현재가치',
        sourceLabel: textCell(sheet, 'C24') || '현재가치',
      },
    };
  }

  function extractOperatingMargins(workbook) {
    const sheet = workbook?.Sheets?.['업종평균'];
    if (!sheet) {
      return { series: [], meta: { available: false, reason: '업종평균 시트 없음' } };
    }

    const rows = [22, 23, 24, 25];
    const cols = ['J', 'K', 'L', 'M', 'N'];
    const rowText = row => cols.map(col => textCell(sheet, `${col}${row}`)).join(' ').trim();
    const yearCount = row => cols.filter(col => yearFromCell(sheet, `${col}${row}`)).length;
    const numericCount = row => cols.filter(col => Number.isFinite(percentValue(sheet, `${col}${row}`))).length;

    let headerRow = rows.reduce((best, row) => yearCount(row) > yearCount(best) ? row : best, rows[0]);
    if (yearCount(headerRow) === 0) headerRow = null;

    let companyRow = rows.find(row => /(사업화주체|동사|기업|회사)/.test(rowText(row))) || null;
    let industryRow = rows.find(row => /(동업종|업종평균|동종업종)/.test(rowText(row))) || null;

    if (!companyRow || !industryRow) {
      const candidates = rows
        .filter(row => row !== headerRow)
        .filter(row => numericCount(row) > 0)
        .filter(row => !/(차이|격차)/.test(rowText(row)));

      if (!companyRow && candidates.length) companyRow = candidates[0];
      if (!industryRow && candidates.length >= 2) industryRow = candidates.find(row => row !== companyRow) || null;
    }

    if (!companyRow || !industryRow || companyRow === industryRow) {
      return { series: [], meta: { available: false, reason: '비교 행 인식 실패' } };
    }

    const pairs = [];
    cols.forEach((col, index) => {
      const company = percentValue(sheet, `${col}${companyRow}`);
      const industry = percentValue(sheet, `${col}${industryRow}`);
      if (!Number.isFinite(company) || !Number.isFinite(industry)) return;

      const year = headerRow ? yearFromCell(sheet, `${col}${headerRow}`) : null;
      pairs.push({
        year,
        order: index,
        company,
        industry,
      });
    });

    pairs.sort((a, b) => {
      if (a.year && b.year) return a.year - b.year;
      return a.order - b.order;
    });

    const selected = pairs.slice(-3);
    if (!selected.length) {
      return { series: [], meta: { available: false, reason: '유효 비교값 없음' } };
    }

    const average = key => selected.reduce((sum, item) => sum + item[key], 0) / selected.length;
    const years = selected.map(item => item.year).filter(Boolean);

    return {
      series: selected,
      meta: {
        available: true,
        companyLabel: '사업화주체',
        industryLabel: '동업종',
        companyAverage: average('company'),
        industryAverage: average('industry'),
        periodCount: selected.length,
        years,
        source: '업종평균!J22:N25',
      },
    };
  }

  function extractChartData(workbook) {
    const sheet = workbook?.Sheets?.['가평가시트'];
    const annual = sheet ? extractAnnualValueSeries(sheet) : { series: [], meta: null };
    const margins = extractOperatingMargins(workbook);

    return {
      projectedSales: sheet ? extractProjectedSales(sheet) : [],
      annualValue: annual.series,
      annualMeta: annual.meta,
      operatingMargins: margins.series,
      operatingMarginMeta: margins.meta,
    };
  }

  document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('excelFile');
    if (!fileInput) return;

    fileInput.addEventListener('change', async (event) => {
      const file = event.target.files?.[0];
      if (!file || typeof XLSX === 'undefined') {
        window.quickValuationProjectedSalesSeries = [];
        window.quickValuationAnnualValueSeries = [];
        window.quickValuationAnnualValueMeta = null;
        window.quickValuationOperatingMarginSeries = [];
        window.quickValuationOperatingMarginMeta = null;
        document.dispatchEvent(new CustomEvent('quickvaluation:chartdata'));
        return;
      }

      try {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array', cellDates: false, cellNF: true });
        const result = extractChartData(workbook);
        window.quickValuationProjectedSalesSeries = result.projectedSales;
        window.quickValuationAnnualValueSeries = result.annualValue;
        window.quickValuationAnnualValueMeta = result.annualMeta;
        window.quickValuationOperatingMarginSeries = result.operatingMargins;
        window.quickValuationOperatingMarginMeta = result.operatingMarginMeta;
      } catch (error) {
        console.warn('간이감정 그래프 데이터를 읽지 못했습니다.', error);
        window.quickValuationProjectedSalesSeries = [];
        window.quickValuationAnnualValueSeries = [];
        window.quickValuationAnnualValueMeta = null;
        window.quickValuationOperatingMarginSeries = [];
        window.quickValuationOperatingMarginMeta = { available: false, reason: '읽기 오류' };
      }

      document.dispatchEvent(new CustomEvent('quickvaluation:chartdata'));
    });

    document.getElementById('resetBtn')?.addEventListener('click', () => {
      window.quickValuationProjectedSalesSeries = [];
      window.quickValuationAnnualValueSeries = [];
      window.quickValuationAnnualValueMeta = null;
      window.quickValuationOperatingMarginSeries = [];
      window.quickValuationOperatingMarginMeta = null;
      document.dispatchEvent(new CustomEvent('quickvaluation:chartdata'));
    });
  });
})();
