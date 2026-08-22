/* Quick Valuation chart data reader
   - Reads yearly discounted value from 가평가시트!D24:R24
   - Applies IP validity from 가평가시트!D26 so yearly contributions sum to final IP value.
*/
(() => {
  window.quickValuationAnnualValueSeries = [];
  window.quickValuationAnnualValueMeta = null;

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

  function extractAnnualValueSeries(workbook) {
    const sheet = workbook?.Sheets?.['가평가시트'];
    if (!sheet) return { series: [], meta: null };

    const validity = numericCell(sheet, 'D26');
    const validityUsable = Number.isFinite(validity) && validity > 0;
    const series = [];

    // D:R = 최대 15개 차년도
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
        basisLabel: validityUsable ? 'IP유효성 반영 현재가치' : '차년도별 현재가치',
        sourceLabel: textCell(sheet, 'C24') || '현재가치',
      },
    };
  }

  document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('excelFile');
    if (!fileInput) return;

    fileInput.addEventListener('change', async (event) => {
      const file = event.target.files?.[0];
      if (!file || typeof XLSX === 'undefined') {
        window.quickValuationAnnualValueSeries = [];
        window.quickValuationAnnualValueMeta = null;
        document.dispatchEvent(new CustomEvent('quickvaluation:chartdata'));
        return;
      }

      try {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array', cellDates: false, cellNF: true });
        const result = extractAnnualValueSeries(workbook);
        window.quickValuationAnnualValueSeries = result.series;
        window.quickValuationAnnualValueMeta = result.meta;
      } catch (error) {
        console.warn('차년도별 가치금액 데이터를 읽지 못했습니다.', error);
        window.quickValuationAnnualValueSeries = [];
        window.quickValuationAnnualValueMeta = null;
      }

      document.dispatchEvent(new CustomEvent('quickvaluation:chartdata'));
    });

    document.getElementById('resetBtn')?.addEventListener('click', () => {
      window.quickValuationAnnualValueSeries = [];
      window.quickValuationAnnualValueMeta = null;
      document.dispatchEvent(new CustomEvent('quickvaluation:chartdata'));
    });
  });
})();
