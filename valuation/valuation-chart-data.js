/* Quick Valuation chart data reader
   가평가시트
   - D17:R17: 현금흐름 추정기간의 차년도별 매출액
   - D24:R24: 세후 로열티수입 할인 후 현재가치
   - D26: 지식재산유효성
   업종평균
   - 영업이익률 기준 비교 결과표
     · L23/L24: 최근 1개년 사업화주체/동업종 영업이익률
     · M23/M24: 최근 2개년 평균 사업화주체/동업종 영업이익률
     · N23/N24: 최근 3개년 평균 사업화주체/동업종 영업이익률
     최근 3개년을 우선 사용하고 오류·공란 시 2개년 → 1개년 순으로 축소
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
    if (!display || /#(?:DIV\/0!|N\/A|VALUE!|REF!|NAME\?|NUM!|NULL!)/i.test(display)) return null;

    const displayMatch = display.match(/-?\d+(?:\.\d+)?\s*%/);
    if (displayMatch) {
      const value = Number(displayMatch[0].replace('%', '').trim());
      return Number.isFinite(value) ? value : null;
    }

    const raw = numericCell(sheet, address);
    if (!Number.isFinite(raw)) return null;
    return Math.abs(raw) <= 1 ? raw * 100 : raw;
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

    // 엑셀 우측의 '영업이익률 기준 비교' 결과표를 그대로 사용한다.
    // 동일기간 비교가 이미 반영된 결과이며, 3개년 → 2개년 → 1개년 순으로 확인한다.
    const candidates = [
      { periodCount: 3, companyCell: 'N23', industryCell: 'N24', label: '최근 3개년 평균' },
      { periodCount: 2, companyCell: 'M23', industryCell: 'M24', label: '최근 2개년 평균' },
      { periodCount: 1, companyCell: 'L23', industryCell: 'L24', label: '최근 1개년' },
    ];

    for (const candidate of candidates) {
      const company = percentValue(sheet, candidate.companyCell);
      const industry = percentValue(sheet, candidate.industryCell);
      if (!Number.isFinite(company) || !Number.isFinite(industry)) continue;

      return {
        series: [{
          periodCount: candidate.periodCount,
          company,
          industry,
        }],
        meta: {
          available: true,
          companyLabel: '사업화주체',
          industryLabel: '동업종',
          companyAverage: company,
          industryAverage: industry,
          periodCount: candidate.periodCount,
          periodLabel: candidate.label,
          companyCell: candidate.companyCell,
          industryCell: candidate.industryCell,
          source: 'CRETOP 기업정보 검색결과, 한국과학기술정보연구원(StarValue)',
        },
      };
    }

    return {
      series: [],
      meta: {
        available: false,
        reason: '최근 3개년·2개년·1개년 동일기간 비교값 모두 없음',
        source: 'CRETOP 기업정보 검색결과, 한국과학기술정보연구원(StarValue)',
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
