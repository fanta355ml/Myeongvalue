const fileInput = document.getElementById('excelFile');
const fileStatus = document.getElementById('fileStatus');
const notesInput = document.getElementById('specialNotes');
const guideEl = document.getElementById('specialGuide');
const reportArea = document.getElementById('reportArea');
const printBtn = document.getElementById('printBtn');
const resetBtn = document.getElementById('resetBtn');

let currentData = null;

const clean = (value) => {
  if (value === null || value === undefined) return '';
  const text = String(value).trim();
  return text === '#NAME?' || text === '#VALUE!' || text === '#REF!' ? '' : text;
};

const cell = (sheet, addr) => clean(sheet[addr]?.v);
const displayOrDash = (value) => clean(value) || '-';

function readPatentRows(sheet) {
  const rows = [];
  for (let r = 7; r <= 36; r += 1) {
    const regNo = cell(sheet, `B${r}`);
    if (!regNo) continue;
    rows.push({
      regNo,
      title: cell(sheet, `C${r}`),
      owner: cell(sheet, `D${r}`),
      registration: cell(sheet, `E${r}`),
      expiry: cell(sheet, `F${r}`),
      seniorRight: cell(sheet, `G${r}`),
    });
  }
  return rows;
}

function readExclusionRows(sheet) {
  const rows = [];
  for (let r = 53; r <= 57; r += 1) {
    const detail = cell(sheet, `B${r}`);
    const reason = cell(sheet, `C${r}`);
    if (!detail && !reason) continue;
    rows.push({ detail: detail || '해당사항 없음', reason });
  }
  return rows;
}

function readWorkbookData(workbook) {
  const sheet = workbook.Sheets['통합_가평가'];
  if (!sheet) throw new Error('통합_가평가 시트를 찾을 수 없습니다.');

  const data = {
    company: cell(sheet, 'B2'),
    businessNo: cell(sheet, 'F2'),
    institution: cell(sheet, 'B3'),
    contact: cell(sheet, 'F3'),
    valuationAmount: cell(sheet, 'B4'),
    patents: readPatentRows(sheet),
    specialGuide: cell(sheet, 'B37') || '예비평가/IP지원신청 통과 관련 예상 이슈 및 필요조치 기재',
    specialNotes: cell(sheet, 'B38'),
    representativeIpc: cell(sheet, 'C44'),
    ksic: cell(sheet, 'F44'),
    recentSales: cell(sheet, 'C45'),
    product: cell(sheet, 'F45'),
    growthBasis: cell(sheet, 'C46'),
    businessSalesShare: cell(sheet, 'F46'),
    companyGrowth: cell(sheet, 'C47'),
    patentShare: cell(sheet, 'F47'),
    industryGrowth: cell(sheet, 'C48'),
    economicLife: cell(sheet, 'F48'),
    royaltyRate: cell(sheet, 'C49'),
    companyScale: cell(sheet, 'F49'),
    exclusions: readExclusionRows(sheet),
    reviewOpinion: cell(sheet, 'B60'),
    disclaimer: cell(sheet, 'A63'),
  };

  return data;
}

function escapeHtml(str) {
  return String(str ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function buildPatentTable(rows) {
  if (!rows.length) return '<tr><td colspan="6">평가대상특허 정보 없음</td></tr>';
  return rows.map((row) => `
    <tr>
      <td>${escapeHtml(displayOrDash(row.regNo))}</td>
      <td>${escapeHtml(displayOrDash(row.title))}</td>
      <td>${escapeHtml(displayOrDash(row.owner))}</td>
      <td>${escapeHtml(displayOrDash(row.registration))}</td>
      <td>${escapeHtml(displayOrDash(row.expiry))}</td>
      <td>${escapeHtml(displayOrDash(row.seniorRight))}</td>
    </tr>`).join('');
}

function buildExclusionTable(rows) {
  if (!rows.length) return '<tr><td>해당사항 없음</td><td>-</td></tr>';
  return rows.map((row) => `
    <tr><td>${escapeHtml(displayOrDash(row.detail))}</td><td>${escapeHtml(displayOrDash(row.reason))}</td></tr>`).join('');
}

function renderReport() {
  if (!currentData) return;
  const notes = notesInput.value;
  reportArea.classList.remove('is-empty');
  reportArea.innerHTML = `
    <article class="report-paper">
      <div class="report-brand">
        <img src="../assets/logo.png" alt="명밸류 파트너스">
        <div><strong>명밸류 파트너스</strong><span>MYEONG VALUE PARTNERS · IP &amp; TECHNOLOGY VALUATION</span></div>
      </div>
      <div class="report-title">IP 간이감정 결과보고서</div>

      <dl class="top-summary">
        <div><dt>기업명</dt><dd>${escapeHtml(displayOrDash(currentData.company))}</dd></div>
        <div><dt>사업자번호</dt><dd>${escapeHtml(displayOrDash(currentData.businessNo))}</dd></div>
        <div><dt>평가기관</dt><dd>${escapeHtml(displayOrDash(currentData.institution))}</dd></div>
        <div><dt>문의처</dt><dd>${escapeHtml(displayOrDash(currentData.contact))}</dd></div>
        <div class="value-box"><dt>가치평가금액</dt><dd>${escapeHtml(displayOrDash(currentData.valuationAmount))}</dd></div>
      </dl>

      <section class="report-section">
        <h2>평가대상특허</h2>
        <table class="report-table patent-table">
          <thead><tr><th>등록번호</th><th>발명의 명칭</th><th>특허권자</th><th>등록일<br>(연차료 납부기한)</th><th>권리만료일<br>(잔존기간)</th><th>선순위 권리</th></tr></thead>
          <tbody>${buildPatentTable(currentData.patents)}</tbody>
        </table>
      </section>

      <section class="report-section">
        <div class="special-box"><div class="special-label">특이사항</div><div class="special-content"><div class="special-guide">※ ${escapeHtml(currentData.specialGuide)}</div>${escapeHtml(notes)}</div></div>
      </section>

      <section class="report-section">
        <h2>1. 평가요약</h2>
        <dl class="summary-grid">
          <div><dt>대표 IPC</dt><dd>${escapeHtml(displayOrDash(currentData.representativeIpc))}</dd></div>
          <div><dt>표준산업분류(11차)</dt><dd>${escapeHtml(displayOrDash(currentData.ksic))}</dd></div>
          <div><dt>최근연도 매출액</dt><dd>${escapeHtml(displayOrDash(currentData.recentSales))}</dd></div>
          <div><dt>사업화제품</dt><dd>${escapeHtml(displayOrDash(currentData.product))}</dd></div>
          <div><dt>성장률 기준</dt><dd>${escapeHtml(displayOrDash(currentData.growthBasis))}</dd></div>
          <div><dt>사업매출비중</dt><dd>${escapeHtml(displayOrDash(currentData.businessSalesShare))}</dd></div>
          <div><dt>동사 성장률</dt><dd>${escapeHtml(displayOrDash(currentData.companyGrowth))}</dd></div>
          <div><dt>평가대상특허비중</dt><dd>${escapeHtml(displayOrDash(currentData.patentShare))}</dd></div>
          <div><dt>동업종 성장률</dt><dd>${escapeHtml(displayOrDash(currentData.industryGrowth))}</dd></div>
          <div><dt>경제적 수명</dt><dd>${escapeHtml(displayOrDash(currentData.economicLife))}</dd></div>
          <div><dt>최종 로열티율</dt><dd>${escapeHtml(displayOrDash(currentData.royaltyRate))}</dd></div>
          <div><dt>기업규모</dt><dd>${escapeHtml(displayOrDash(currentData.companyScale))}</dd></div>
        </dl>
      </section>

      <section class="report-section">
        <h2>2. 평가대상특허 제외 사유</h2>
        <table class="report-table"><thead><tr><th>제외특허 내역</th><th>제외 사유</th></tr></thead><tbody>${buildExclusionTable(currentData.exclusions)}</tbody></table>
      </section>

      <section class="report-section">
        <h2>3. 검토의견</h2>
        <div class="review-copy">${escapeHtml(displayOrDash(currentData.reviewOpinion))}</div>
      </section>

      <div class="disclaimer">${escapeHtml(currentData.disclaimer || '※ 본 간이감정 결과는 본 평가 시 산정변수 및 실사결과 등에 따라 변동될 수 있습니다.')}</div>
    </article>`;
}

fileInput.addEventListener('change', async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    fileStatus.textContent = 'Excel을 읽는 중입니다...';
    fileStatus.className = 'status';
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array', cellDates: false });
    currentData = readWorkbookData(workbook);
    notesInput.value = currentData.specialNotes || '';
    guideEl.textContent = `※ ${currentData.specialGuide}`;
    renderReport();
    printBtn.disabled = false;
    fileStatus.textContent = `완료: ${file.name} · 통합_가평가 시트에서 ${currentData.patents.length}건의 평가대상특허를 불러왔습니다.`;
    fileStatus.className = 'status ok';
  } catch (error) {
    currentData = null;
    printBtn.disabled = true;
    reportArea.classList.add('is-empty');
    reportArea.innerHTML = '<div class="empty-report"><strong>파일을 읽지 못했습니다.</strong><p>통합_가평가 시트가 있는 가평가 Excel인지 확인해 주세요.</p></div>';
    fileStatus.textContent = `오류: ${error.message}`;
    fileStatus.className = 'status error';
  }
});

notesInput.addEventListener('input', () => {
  if (currentData) renderReport();
});

printBtn.addEventListener('click', () => window.print());

resetBtn.addEventListener('click', () => {
  fileInput.value = '';
  notesInput.value = '';
  currentData = null;
  printBtn.disabled = true;
  fileStatus.textContent = '파일을 선택하면 자동으로 미리보기를 생성합니다.';
  fileStatus.className = 'status';
  reportArea.classList.add('is-empty');
  reportArea.innerHTML = '<div class="empty-report"><strong>간이감정 보고서 미리보기</strong><p>Excel을 업로드하면 이 영역에 보고서가 표시됩니다.</p></div>';
});
