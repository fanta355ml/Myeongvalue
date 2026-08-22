/* Myeongvalue-only mini chart in the report
   v1: parse recent yearly sales values from review opinion text.
   Example supported: "2023년 15.16억 원, 2024년 34.14억 원, 2025년 58.13억 원"
*/
(() => {
  function getAgencyId() {
    return window.getQuickValuationAgencyConfig?.().id || 'myeongvalue';
  }

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
      rows.push({ year, value });
    }

    return rows.sort((a, b) => a.year - b.year).slice(-5);
  }

  function makeChartSvg(series) {
    const width = 660;
    const height = 190;
    const pad = { top: 30, right: 24, bottom: 38, left: 34 };
    const innerW = width - pad.left - pad.right;
    const innerH = height - pad.top - pad.bottom;
    const maxValue = Math.max(...series.map(d => d.value), 1);
    const step = innerW / series.length;
    const barW = Math.min(72, step * 0.5);

    const grid = [0.25, 0.5, 0.75, 1].map(ratio => {
      const y = pad.top + innerH * (1 - ratio);
      return `<line class="myeong-chart-grid" x1="${pad.left}" y1="${y}" x2="${width - pad.right}" y2="${y}"/>`;
    }).join('');

    const points = [];
    const bars = series.map((d, i) => {
      const cx = pad.left + step * (i + 0.5);
      const h = innerH * (d.value / maxValue);
      const x = cx - barW / 2;
      const y = pad.top + innerH - h;
      points.push(`${cx},${y}`);
      return `
        <rect class="myeong-chart-bar" x="${x}" y="${y}" width="${barW}" height="${h}" rx="5"/>
        <text class="myeong-chart-value" x="${cx}" y="${Math.max(14, y - 7)}">${d.value.toLocaleString('ko-KR', { maximumFractionDigits: 2 })}</text>
        <text class="myeong-chart-year" x="${cx}" y="${height - 14}">${d.year}</text>`;
    }).join('');

    const dots = series.map((d, i) => {
      const [x, y] = points[i].split(',');
      return `<circle class="myeong-chart-dot" cx="${x}" cy="${y}" r="3.5"/>`;
    }).join('');

    return `
      <svg class="myeong-chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="최근 매출액 추이">
        ${grid}
        <line class="myeong-chart-axis" x1="${pad.left}" y1="${pad.top + innerH}" x2="${width - pad.right}" y2="${pad.top + innerH}"/>
        <text class="myeong-chart-unit" x="${pad.left}" y="15">단위: 억 원</text>
        ${bars}
        <polyline class="myeong-chart-line" points="${points.join(' ')}"/>
        ${dots}
      </svg>`;
  }

  function renderMyeongChart() {
    document.querySelector('.myeong-chart-section')?.remove();
    if (getAgencyId() !== 'myeongvalue') return;

    const report = document.querySelector('.report-paper');
    const summaryGrid = report?.querySelector('.summary-grid');
    if (!report || !summaryGrid) return;

    const reviewText = document.getElementById('reviewOpinionEdit')?.value || '';
    const series = parseSalesSeries(reviewText);
    if (series.length < 2) return;

    const growthText = report.querySelector('.summary-grid div:nth-child(7) dd')?.textContent?.trim() || '';
    const section = document.createElement('section');
    section.className = 'report-section myeong-chart-section';
    section.innerHTML = `
      <h2>2. 최근 매출액 추이</h2>
      <div class="myeong-chart-card">
        <div class="myeong-chart-head">
          <div>
            <div class="myeong-chart-title">최근 연도별 매출액</div>
            <div class="myeong-chart-sub">검토의견에 기재된 연도별 매출액을 시각화함.</div>
          </div>
          ${growthText ? `<div class="myeong-chart-badge">CAGR ${growthText}</div>` : ''}
        </div>
        ${makeChartSvg(series)}
        <div class="myeong-chart-source">* 출처: 업로드 Excel 검토의견 기재값을 기반으로 작성.</div>
      </div>`;

    const summarySection = summaryGrid.closest('.report-section');
    summarySection?.after(section);

    // 명밸류 보고서에서 뒤 절 번호를 한 단계씩 밀어 차별화된 구성 유지
    const headings = report.querySelectorAll('.report-section > h2');
    headings.forEach(h2 => {
      const text = h2.textContent.trim();
      if (text === '2. 평가대상특허 제외 사유') h2.textContent = '3. 평가대상특허 제외 사유';
      if (text === '3. 검토의견') h2.textContent = '4. 검토의견';
    });
  }

  function scheduleRender() {
    requestAnimationFrame(() => requestAnimationFrame(renderMyeongChart));
  }

  document.addEventListener('DOMContentLoaded', () => {
    const reportArea = document.getElementById('reportArea');
    if (reportArea) {
      const observer = new MutationObserver(scheduleRender);
      observer.observe(reportArea, { childList: true, subtree: true });
    }
    document.getElementById('reviewOpinionEdit')?.addEventListener('input', scheduleRender);
    document.addEventListener('quickvaluation:agencychange', scheduleRender);
    scheduleRender();
  });
})();
