/* Quick Valuation chart data reader
   가평가시트
   - D17:R17: 현금흐름 추정기간의 차년도별 일할계산 후 매출액
   - D24:R24: 세후 로열티수입 할인 후 현재가치
   - D26: 지식재산유효성
   업종평균
   - 사업화주체/동업종 연도별 영업이익률 비교자료
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

  const percentValue = (value) => {
    if (!Number.isFinite(value)) return null;
    return Math.abs(value) <= 1 ? value * 100 : value;
  };

  const excelYear = (value) => {
    if (!Number.isFinite(value)) return null;
    if (value >= 1900 && value <= 2200) return Math.round(value);
    if (value > 30000 && value < 70000) {
      const date = new Date(Date.UTC(1899, 11, 30) + value * 86400000);
      return date.getUTCFullYear();
    }
    return null;
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
    if (!sheet) return { series: [], meta: null };

    const company = new Map();
    for (const colCode of ['C', 'D', 'E']) {
      const year = excelYear(numericCell(sheet, `${colCode}22`));
      const cost = percentValue(numericCell(sheet, `${colCode}23`));
      const sga = percentValue(numericCell(sheet, `${colCode}25`));
      if (!year || !Number.isFinite(cost) || !Number.isFinite(sga)) continue;
      company.set(year, 100 - cost - sga);
    }

    const industryDirect = new Map();
    for (const colCode of ['C', 'D', 'E']) {
      const year = excelYear(numericCell(sheet, `${colCode}30`));
      const margin = percentValue(numericCell(sheet, `${colCode}33`));
      if (year && Number.isFinite(margin)) industryDirect.set(year, margin);
    }

    const industryFallback = new Map();
    for (const colCode of ['C', 'D', 'E', 'F', 'G']) {
      const year = excelYear(numericCell(sheet, `${colCode}4`));
      const margin = percentValue(numericCell(sheet, `${colCode}17`));
      if (year && Number.isFinite(margin)) industryFallback.set(year, margin);
    }

    const industry = industryDirect.size ? industryDirect : industryFallback;
    const commonYears = [...company.keys()].filter(year => industry.has(year)).sort((a, b) => a - b);
    const series = commonYears.map(year => ({
      year,
      company: company.get(year),
      industry: industry.get(year),
    }));

    return {
      series,
      meta: {
        companyLabel: '사업화주체',
        industryLabel: '동업종',
        industrySource: industryDirect.size ? '크레탑 동업종 입력값' : 'KISTI StarValue 업종평균',
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
        window.quickValuationOperatingMarginMeta = null;
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
