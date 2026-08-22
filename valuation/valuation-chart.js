/* Myeongvalue-only value indicator charts
   - Main: annual IP value contribution (discounted value × IP validity)
   - Sub: recent yearly sales parsed from review opinion
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
    const maxValue = Math.max(...series.map(d => d.value), 1);
    const step = innerW / series.length;
    const barW = Math.min(options.barWidth || 58, step * 0.58);

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
        <rect class="myeong-chart-bar ${options.main ? 'is-main' : ''}" x="${x}" y="${y}" width="${barW}" height="${h}" rx="5"/>
        <text class="myeong-chart-value" x="${cx}" y="${Math.max(15, y - 7)}">${formatNumber(d.value, options.valueDigits ?? 2)}</text>
        <text class="myeong-chart-year" x="${cx}" y="${height - 14}">${d.label}</text>`;
    }).join('');

    const dots = series.map((_, i) => {
      const [x, y] = points[i].split(',');
      return `<circle class="myeong-chart-dot ${options.main ? 'is-main' : ''}" cx="${x}" cy="${y}" r="3.5"/>`;
    }).join('');

    return `
      <svg class="myeong-chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${options.ariaLabel || '추이 그래프'}">
        ${grid}
        <line class="myeong-chart-axis" x1="${pad.left}" y1="${pad.top + innerH}" x2="${width - pad.right}" y2="${pad.top + innerH}"/>
        <text class="myeong-chart-unit" x="${pad.left}" y="15">${options.unitText || '단위: 억 원'}</text>
        ${bars}
        <polyline class="myeong-chart-line ${options.main ? 'is-main' : ''}" points="${points.join(' ')}"/>
        ${dots}
      </svg>`;
  }

  function buildAnnualValueCard() {
    const sourceSeries = Array.isArray(window.quickValuationAnnualValueSeries)
      ? window.quickValuationAnnualValueSeries
      : [];
    const meta = window.quickValuationAnnualValueMeta || null;
    if (!sourceSeries.length) return '';

    const series = sourceSeries.map(item => ({
      label: item.period,
      value: item.valueEok,
    }));

    const total = Number.isFinite(meta?.totalEok) ? meta.totalEok : series.reduce((s, d) => s + d.value, 0);
    const badge = Number.isFinite(total) ? `<div class="myeong-chart-badge is-main">합계 ${formatNumber(total, 2)}억 원</div>` : '';
    const validityNote = meta?.validityApplied && Number.isFinite(meta.validity)
      ? `현재가치에 IP유효성 ${formatNumber(meta.validity * 100, 1)}%를 반영한 연도별 가치기여액임.`
      : '차년도별 현재가치를 기준으로 산출함.';

    return `
      <div class="myeong-chart-card myeong-chart-card-main">
        <div class="myeong-chart-head">
          <div>
            <div class="myeong-chart-title">차년도별 가치기여액</div>
            <div class="myeong-chart-sub">${validityNote}</div>
          </div>
          ${badge}
        </div>
        ${makeBarLineSvg(series, {
          main: true,
          height: 218,
          barWidth: 52,
          valueDigits: 2,
          unitText: '단위: 억 원',
          ariaLabel: '차년도별 가치기여액 추이',
        })}
        <div class="myeong-chart-source">* 출처: 업로드 Excel의 차년도별 현재가치 및 IP유효성 산정값.</div>
      </div>`;
  }

  function buildSalesCard(report) {
    const reviewText = document.getElementById('reviewOpinionEdit')?.value || '';
    const series = parseSalesSeries(reviewText);
    if (series.length < 2) return '';

    const growthText = report.querySelector('.summary-grid div:nth-child(7) dd')?.textContent?.trim() || '';
    return `
      <div class="myeong-chart-card myeong-chart-card-sub">
        <div class="myeong-chart-head">
          <div>
            <div class="myeong-chart-title">최근 매출액 추이</div>
            <div class="myeong-chart-sub">검토의견에 기재된 최근 연도별 매출액을 시각화함.</div>
          </div>
          ${growthText ? `<div class="myeong-chart-badge">CAGR ${growthText}</div>` : ''}
        </div>
        ${makeBarLineSvg(series, {
          height: 164,
          barWidth: 68,
          valueDigits: 2,
          unitText: '단위: 억 원',
          ariaLabel: '최근 매출액 추이',
        })}
        <div class="myeong-chart-source">* 출처: 업로드 Excel 검토의견 기재값.</div>
      </div>`;
  }

  function renderMyeongCharts() {
    document.querySelector('.myeong-chart-section')?.remove();
    if (getAgencyId() !== 'myeongvalue') return;

    const report = document.querySelector('.report-paper');
    const summaryGrid = report?.querySelector('.summary-grid');
    if (!report || !summaryGrid) return;

    const annualCard = buildAnnualValueCard();
    const salesCard = buildSalesCard(report);
    if (!annualCard && !salesCard) return;

    const section = document.createElement('section');
    section.className = 'report-section myeong-chart-section';
    section.innerHTML = `
      <h2>2. 핵심 가치지표</h2>
      <div class="myeong-chart-stack">
        ${annualCard}
        ${salesCard}
      </div>`;

    const summarySection = summaryGrid.closest('.report-section');
    summarySection?.after(section);

    const headings = report.querySelectorAll('.report-section > h2');
    headings.forEach(h2 => {
      const text = h2.textContent.trim();
      if (text === '2. 평가대상특허 제외 사유') h2.textContent = '3. 평가대상특허 제외 사유';
      if (text === '3. 검토의견') h2.textContent = '4. 검토의견';
    });
  }

  function scheduleRender() {
    requestAnimationFrame(() => requestAnimationFrame(renderMyeongCharts));
  }

  document.addEventListener('DOMContentLoaded', () => {
    const reportArea = document.getElementById('reportArea');
    if (reportArea) {
      const observer = new MutationObserver(scheduleRender);
      observer.observe(reportArea, { childList: true, subtree: true });
    }
    document.getElementById('reviewOpinionEdit')?.addEventListener('input', scheduleRender);
    document.addEventListener('quickvaluation:agencychange', scheduleRender);
    document.addEventListener('quickvaluation:chartdata', scheduleRender);
    scheduleRender();
  });
})();
