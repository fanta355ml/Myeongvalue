/* Quick Valuation value indicator charts
   - Main 1: projected sales over the valuation cash-flow period
   - Sub left: recent yearly sales
   - Sub right: operating margin comparison (company vs industry)
*/
(() => {
  function parseSalesSeries(text) {
    const source = String(text || '').replace(/,/g, '');
    const matches = [...source.matchAll(/(20\d{2})년\s*(\d+(?:\.\d+)?)\s*억\s*원/g)];
    const seen = new Set();
    const rows = [];

    for (const match of matches) {
      const year = Number(match[1]);
      const value = Number(match[2]);
      if (!Number.isFinite(year) || !Number.isFinite(value) || seen.has(year)) continue;
      seen.add(year);
      rows.push({ label: String(year), value });
    }

    return rows.sort((a, b) => Number(a.label) - Number(b.label)).slice(-5);
  }

  function formatNumber(value, digits = 2) {
    return Number(value).toLocaleString('ko-KR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: digits,
    });
  }

  function makeBarLineSvg(series, options = {}) {
    const width = 680;
    const height = options.height || 190;
    const pad = { top: 34, right: 22, bottom: 38, left: 38 };
    const innerW = width - pad.left - pad.right;
    const innerH = height - pad.top - pad.bottom;
    const values = series.map(d => Number(d.value)).filter(Number.isFinite);
    const rawMin = Math.min(0, ...values);
    const rawMax = Math.max(0, ...values);
    const hasNegative = rawMin < 0;
    const span = Math.max(rawMax - rawMin, Math.abs(rawMin), Math.abs(rawMax), 1);
    const domainPadding = hasNegative ? span * 0.16 : 0;
    const minValue = hasNegative ? rawMin - domainPadding : 0;
    const maxValue = hasNegative ? rawMax + domainPadding : Math.max(rawMax, 1);
    const range = Math.max(maxValue - minValue, 1);
    const step = innerW / Math.max(series.length, 1);
    const barW = Math.min(options.barWidth || 58, step * 0.58);
    const valueY = value => pad.top + ((maxValue - value) / range) * innerH;
    const zeroY = valueY(0);

    const gridRatios = hasNegative ? [0, 0.25, 0.5, 0.75, 1] : [0.25, 0.5, 0.75, 1];
    const grid = gridRatios.map(ratio => {
      const y = pad.top + innerH * (1 - ratio);
      return `<line class="myeong-chart-grid" x1="${pad.left}" y1="${y}" x2="${width - pad.right}" y2="${y}"/>`;
    }).join('');

    const points = [];
    const bars = series.map((d, i) => {
      const value = Number(d.value);
      const cx = pad.left + step * (i + 0.5);
      const x = cx - barW / 2;
      const y = valueY(value);
      const barY = Math.min(y, zeroY);
      const barH = Math.max(Math.abs(zeroY - y), 0.5);
      const labelY = value < 0 ? Math.min(height - 22, y + 15) : Math.max(15, y - 7);
      points.push(`${cx},${y}`);
      return `
        <rect class="myeong-chart-bar ${options.main ? 'is-main' : ''} ${options.secondary ? 'is-secondary' : ''}" x="${x}" y="${barY}" width="${barW}" height="${barH}" rx="5"/>
        <text class="myeong-chart-value" x="${cx}" y="${labelY}">${formatNumber(value, options.valueDigits ?? 2)}</text>
        <text class="myeong-chart-year" x="${cx}" y="${height - 14}">${d.label}</text>`;
    }).join('');

    const dots = series.map((_, i) => {
      const [x, y] = points[i].split(',');
      return `<circle class="myeong-chart-dot ${options.main ? 'is-main' : ''} ${options.secondary ? 'is-secondary' : ''}" cx="${x}" cy="${y}" r="3.5"/>`;
    }).join('');

    return `
      <svg class="myeong-chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${options.ariaLabel || '추이 그래프'}">
        ${grid}
        <line class="myeong-chart-axis" x1="${pad.left}" y1="${zeroY}" x2="${width - pad.right}" y2="${zeroY}"/>
        <text class="myeong-chart-unit" x="${pad.left}" y="15">${options.unitText || '단위: 억 원'}</text>
        ${bars}
        <polyline class="myeong-chart-line ${options.main ? 'is-main' : ''} ${options.secondary ? 'is-secondary' : ''}" points="${points.join(' ')}"/>
        ${dots}
      </svg>`;
  }

  function makeOperatingMarginSvg(series) {
    const width = 680;
    const height = 164;
    const pad = { top: 28, right: 30, bottom: 36, left: 46 };
    const innerW = width - pad.left - pad.right;
    const innerH = height - pad.top - pad.bottom;
    const allValues = series.flatMap(d => [d.company, d.industry]).filter(Number.isFinite);
    const minValue = Math.min(0, ...allValues);
    const maxValue = Math.max(5, ...allValues);
    const range = Math.max(maxValue - minValue, 1);
    const step = innerW / Math.max(series.length - 1, 1);
    const yFor = value => pad.top + innerH * (1 - ((value - minValue) / range));

    const grid = [0, 0.5, 1].map(ratio => {
      const y = pad.top + innerH * ratio;
      return `<line class="myeong-chart-grid" x1="${pad.left}" y1="${y}" x2="${width - pad.right}" y2="${y}"/>`;
    }).join('');

    const companyPoints = series.map((d, i) => `${pad.left + step * i},${yFor(d.company)}`).join(' ');
    const industryPoints = series.map((d, i) => `${pad.left + step * i},${yFor(d.industry)}`).join(' ');
    const labels = series.map((d, i) => {
      const x = pad.left + step * i;
      return `<text class="myeong-chart-year" x="${x}" y="${height - 12}">${d.year ?? ''}</text>`;
    }).join('');
    const companyDots = series.map((d, i) => {
      const x = pad.left + step * i;
      const y = yFor(d.company);
      return `<circle class="myeong-margin-dot is-company" cx="${x}" cy="${y}" r="3.5"/><text class="myeong-margin-value" x="${x}" y="${Math.max(12, y - 7)}">${formatNumber(d.company,1)}%</text>`;
    }).join('');
    const industryDots = series.map((d, i) => {
      const x = pad.left + step * i;
      const y = yFor(d.industry);
      return `<circle class="myeong-margin-dot is-industry" cx="${x}" cy="${y}" r="3.5"/><text class="myeong-margin-value is-industry" x="${x}" y="${Math.min(height - 24, y + 15)}">${formatNumber(d.industry,1)}%</text>`;
    }).join('');

    return `
      <svg class="myeong-chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="사업화주체와 동업종 영업이익률 비교">
        ${grid}
        <line class="myeong-chart-axis" x1="${pad.left}" y1="${yFor(0)}" x2="${width - pad.right}" y2="${yFor(0)}"/>
        <text class="myeong-chart-unit" x="${pad.left}" y="14">단위: %</text>
        <polyline class="myeong-margin-line is-company" points="${companyPoints}"/>
        <polyline class="myeong-margin-line is-industry" points="${industryPoints}"/>
        ${companyDots}${industryDots}${labels}
      </svg>`;
  }

  function buildProjectedSalesCard() {
    const sourceSeries = Array.isArray(window.quickValuationProjectedSalesSeries)
      ? window.quickValuationProjectedSalesSeries
      : [];
    if (!sourceSeries.length) return '';

    const series = sourceSeries.map(item => ({ label: item.period, value: item.salesEok }));
    return `
      <div class="myeong-chart-card myeong-chart-card-main">
        <div class="myeong-chart-head"><div><div class="myeong-chart-title">차년도별 추정매출액</div><div class="myeong-chart-sub">현금흐름 추정기간 동안 가치산정에 적용되는 차년도별 매출액임.</div></div></div>
        ${makeBarLineSvg(series,{main:true,height:218,barWidth:52,valueDigits:1,unitText:'단위: 억 원',ariaLabel:'차년도별 추정매출액 추이'})}
        <div class="myeong-chart-source">* 출처: 업로드 Excel 가평가시트 17행.</div>
      </div>`;
  }

  function buildSalesCard(report) {
    const reviewText = document.getElementById('reviewOpinionEdit')?.value || '';
    const series = parseSalesSeries(reviewText);
    if (series.length < 2) return '';
    const growthText = report.querySelector('.summary-grid div:nth-child(7) dd')?.textContent?.trim() || '';
    return `
      <div class="myeong-chart-card myeong-chart-card-sub">
        <div class="myeong-chart-head"><div><div class="myeong-chart-title">최근 매출액 추이</div><div class="myeong-chart-sub">최근 연도별 매출액 흐름.</div></div>${growthText ? `<div class="myeong-chart-badge">CAGR ${growthText}</div>` : ''}</div>
        ${makeBarLineSvg(series,{height:164,barWidth:68,valueDigits:2,unitText:'단위: 억 원',ariaLabel:'최근 매출액 추이'})}
        <div class="myeong-chart-source">* 출처: CRETOP 기업정보 검색결과.</div>
      </div>`;
  }

  function buildOperatingMarginCard() {
    const series = Array.isArray(window.quickValuationOperatingMarginSeries) ? window.quickValuationOperatingMarginSeries : [];
    const meta = window.quickValuationOperatingMarginMeta || null;
    const source = meta?.source || 'CRETOP 기업정보 검색결과, 한국과학기술정보연구원(StarValue)';
    if (series.length < 1 || meta?.available === false) {
      return `<div class="myeong-chart-card myeong-chart-card-sub"><div class="myeong-chart-head"><div><div class="myeong-chart-title">영업이익률 비교</div><div class="myeong-chart-sub">사업화주체와 동업종의 수익성 비교.</div></div></div><div class="myeong-chart-empty">정보없음</div><div class="myeong-chart-source">* 출처: ${source}.</div></div>`;
    }

    if (Number.isFinite(meta?.companyAverage) && Number.isFinite(meta?.industryAverage)) {
      const label = meta.periodLabel || (meta.periodCount === 3 ? '최근 3개년 평균' : meta.periodCount === 2 ? '최근 2개년 평균' : '최근 1개년');
      const avgSeries = [{ label:'사업화주체',value:meta.companyAverage },{ label:'동업종',value:meta.industryAverage }];
      return `<div class="myeong-chart-card myeong-chart-card-sub"><div class="myeong-chart-head"><div><div class="myeong-chart-title">영업이익률 비교</div><div class="myeong-chart-sub">${label} 영업이익률 비교.</div></div></div>${makeBarLineSvg(avgSeries,{height:164,barWidth:76,valueDigits:2,unitText:'단위: %',ariaLabel:'사업화주체와 동업종 평균 영업이익률 비교'})}<div class="myeong-chart-source">* 출처: ${source}.</div></div>`;
    }

    return `<div class="myeong-chart-card myeong-chart-card-sub"><div class="myeong-chart-head"><div><div class="myeong-chart-title">영업이익률 비교</div><div class="myeong-chart-sub">사업화주체와 동업종의 수익성 비교.</div></div><div class="myeong-margin-legend"><span class="is-company">사업화주체</span><span class="is-industry">동업종</span></div></div>${makeOperatingMarginSvg(series)}<div class="myeong-chart-source">* 출처: ${source}.</div></div>`;
  }

  function findSectionByTitle(report, pattern) {
    return [...report.querySelectorAll('.report-section')].find(section => {
      const h2 = section.querySelector(':scope > h2');
      return h2 && pattern.test(h2.textContent.trim());
    }) || null;
  }

  function renderCharts() {
    document.querySelector('.myeong-chart-section')?.remove();
    const report = document.querySelector('.report-paper');
    const summaryGrid = report?.querySelector('.summary-grid');
    if (!report || !summaryGrid) return;

    const summarySection = summaryGrid.closest('.report-section');
    const exclusionSection = findSectionByTitle(report,/평가대상특허 제외 사유$/);
    const reviewSection = findSectionByTitle(report,/검토의견$/);
    if (exclusionSection && summarySection && exclusionSection !== summarySection.previousElementSibling) report.insertBefore(exclusionSection,summarySection);

    const exclusionHeading = exclusionSection?.querySelector(':scope > h2');
    const summaryHeading = summarySection?.querySelector(':scope > h2');
    const reviewHeading = reviewSection?.querySelector(':scope > h2');
    if (exclusionHeading) exclusionHeading.textContent = '1. 평가대상특허 제외 사유';
    if (summaryHeading) summaryHeading.textContent = '2. 평가요약';
    if (reviewHeading) reviewHeading.textContent = '4. 검토의견';

    const projectedSalesCard = buildProjectedSalesCard();
    const salesCard = buildSalesCard(report);
    const marginCard = buildOperatingMarginCard();
    if (!projectedSalesCard && !salesCard && !marginCard) return;

    const section = document.createElement('section');
    section.className = 'report-section myeong-chart-section';
    section.innerHTML = `<h2>3. 핵심 가치지표</h2><div class="myeong-chart-stack myeong-chart-stack-main">${projectedSalesCard}</div>${(salesCard || marginCard) ? `<div class="myeong-chart-grid-two">${salesCard}${marginCard}</div>` : ''}`;
    summarySection.after(section);
  }

  let renderQueued = false;
  function scheduleRender() {
    if (renderQueued) return;
    renderQueued = true;
    requestAnimationFrame(() => requestAnimationFrame(() => { renderQueued = false; renderCharts(); }));
  }

  document.addEventListener('DOMContentLoaded',() => {
    const reportArea = document.getElementById('reportArea');
    if (reportArea) new MutationObserver(scheduleRender).observe(reportArea,{childList:true,subtree:false});
    document.getElementById('reviewOpinionEdit')?.addEventListener('change',scheduleRender);
    document.addEventListener('quickvaluation:agencychange',scheduleRender);
    document.addEventListener('quickvaluation:chartdata',scheduleRender);
    scheduleRender();
  });
})();
