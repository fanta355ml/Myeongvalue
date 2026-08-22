const fileInput = document.getElementById('excelFile');
const fileStatus = document.getElementById('fileStatus');
const notesInput = document.getElementById('specialNotes');
const reviewInput = document.getElementById('reviewOpinionEdit');
const valuationAmountInput = document.getElementById('valuationAmountEdit');
const contactSelect = document.getElementById('contactSelect');
const contactGuide = document.getElementById('contactGuide');
const guideEl = document.getElementById('specialGuide');
const reportArea = document.getElementById('reportArea');
const printBtn = document.getElementById('printBtn');
const resetBtn = document.getElementById('resetBtn');

let currentData = null;
let selectedContact = '';

const valuationWarning = document.createElement('div');
valuationWarning.id = 'valuationConsistencyWarning';
valuationWarning.hidden = true;
valuationWarning.setAttribute('role', 'alert');
valuationWarning.style.cssText = 'margin-top:12px;border:1px solid rgba(255,190,92,.48);background:rgba(255,190,92,.10);color:#ffdda0;border-radius:14px;padding:11px 12px;font-size:12px;line-height:1.55;font-weight:600;';
valuationAmountInput.closest('.edit-card')?.appendChild(valuationWarning);

const clean = (value) => {
  if (value === null || value === undefined) return '';
  const text = String(value).trim();
  return text === '#NAME?' || text === '#VALUE!' || text === '#REF!' ? '' : text;
};

const cell = (sheet, addr) => {
  const target = sheet[addr];
  if (!target) return '';
  return clean(target.w !== undefined ? target.w : target.v);
};

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

function normalizePhone(value) {
  return clean(value).replace(/\s+/g, ' ').trim();
}

function findPersonnelContacts(workbook) {
  const sheetName = workbook.SheetNames.find(name => name === '데이터처리') ||
    workbook.SheetNames.find(name => name.includes('데이터처리'));
  if (!sheetName) return [];

  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, defval: '' });
  const emailRe = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
  const phoneRe = /(?:\+?82[-\s]?)?(?:0\d{1,2})[-\s]?\d{3,4}[-\s]?\d{4}/;
  const headerNameRe = /^(성명|이름|평가자|담당자|인력|전문가)$/;
  const headerPhoneRe = /(연락처|전화번호|전화|휴대전화|휴대폰)/;
  const headerEmailRe = /(이메일|전자우편|e-?mail)/i;
  const contacts = [];
  const seen = new Set();

  let nameCol = -1;
  let phoneCol = -1;
  let emailCol = -1;
  let headerRow = -1;

  for (let r = 0; r < Math.min(rows.length, 120); r += 1) {
    const values = (rows[r] || []).map(value => clean(value));
    const n = values.findIndex(value => headerNameRe.test(value));
    const p = values.findIndex(value => headerPhoneRe.test(value));
    const e = values.findIndex(value => headerEmailRe.test(value));
    if ([n, p, e].filter(index => index >= 0).length >= 2) {
      nameCol = n;
      phoneCol = p;
      emailCol = e;
      headerRow = r;
      break;
    }
  }

  function pushContact(name, phone, email) {
    name = clean(name);
    phone = normalizePhone(phone);
    email = clean(email);
    if (!phone && !email) return;

    const key = `${name}|${phone}|${email}`.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);

    const firstLine = name || '담당자';
    const secondLine = [phone, email].filter(Boolean).join(' / ');
    contacts.push({
      name: firstLine,
      phone,
      email,
      value: `${firstLine} ${secondLine}`.trim(),
      label: `${firstLine}${secondLine ? ` · ${secondLine}` : ''}`,
    });
  }

  if (headerRow >= 0) {
    for (let r = headerRow + 1; r < rows.length; r += 1) {
      const values = (rows[r] || []).map(value => clean(value));
      const rowText = values.join(' ').trim();
      if (!rowText) continue;

      const phone = phoneCol >= 0 ? values[phoneCol] : (rowText.match(phoneRe)?.[0] || '');
      const email = emailCol >= 0 ? values[emailCol] : (rowText.match(emailRe)?.[0] || '');
      const name = nameCol >= 0 ? values[nameCol] : '';
      if (phoneRe.test(phone) || emailRe.test(email)) pushContact(name, phone, email);
    }
  }

  if (!contacts.length) {
    for (const row of rows) {
      const values = (row || []).map(value => clean(value)).filter(Boolean);
      if (!values.length) continue;
      const rowText = values.join(' ');
      const email = rowText.match(emailRe)?.[0] || '';
      const phone = rowText.match(phoneRe)?.[0] || '';
      if (!email && !phone) continue;

      const candidates = values.filter(value =>
        value !== email && value !== phone &&
        !headerPhoneRe.test(value) && !headerEmailRe.test(value) &&
        !/^(직위|소속|부서|구분|역할|비고)$/.test(value) &&
        !emailRe.test(value) && !phoneRe.test(value)
      );
      const name = candidates.find(value => /^[가-힣]{2,5}(?:\s*[가-힣]{1,6})?$/.test(value)) || candidates[0] || '';
      pushContact(name, phone, email);
    }
  }

  return contacts;
}

function readWorkbookData(workbook) {
  const sheet = workbook.Sheets['통합_가평가'];
  if (!sheet) throw new Error('통합_가평가 시트를 찾을 수 없습니다.');

  return {
    company: cell(sheet, 'B2'),
    businessNo: cell(sheet, 'F2'),
    institution: cell(sheet, 'B3'),
    contact: cell(sheet, 'F3'),
    contactOptions: findPersonnelContacts(workbook),
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
}

function escapeHtml(str) {
  return String(str ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatContact(value) {
  const text = clean(value).replace(/\r?\n/g, ' ');
  if (!text) return '-';

  const phonePattern = /(?:\+?82[-\s]?)?(?:0\d{1,2})[-\s]?\d{3,4}[-\s]?\d{4}/;
  const match = text.match(phonePattern);
  if (!match || match.index === undefined || match.index === 0) return escapeHtml(text);

  const firstLine = text.slice(0, match.index).trim().replace(/[\/|·,;:\-]+$/, '').trim();
  const secondLine = text.slice(match.index).trim();
  if (!firstLine) return escapeHtml(text);

  return `${escapeHtml(firstLine)}<br>${escapeHtml(secondLine)}`;
}

function populateContactSelect(data) {
  if (!contactSelect) return;
  contactSelect.innerHTML = '';

  const baseContact = clean(data.contact);
  if (baseContact) {
    const option = document.createElement('option');
    option.value = baseContact;
    option.textContent = `기존 문의처 · ${baseContact}`;
    contactSelect.appendChild(option);
  }

  data.contactOptions.forEach(contact => {
    const option = document.createElement('option');
    option.value = contact.value;
    option.textContent = contact.label;
    contactSelect.appendChild(option);
  });

  if (!contactSelect.options.length) {
    const option = document.createElement('option');
    option.value = '';
    option.textContent = '불러온 문의처 정보가 없습니다.';
    contactSelect.appendChild(option);
    contactSelect.disabled = true;
    selectedContact = baseContact;
    if (contactGuide) contactGuide.textContent = '데이터처리 시트에서 인력·연락처·이메일 정보를 찾지 못했습니다.';
    return;
  }

  contactSelect.disabled = false;
  contactSelect.selectedIndex = 0;
  selectedContact = contactSelect.value;
  if (contactGuide) {
    const count = data.contactOptions.length;
    contactGuide.textContent = count
      ? `데이터처리 시트에서 ${count}명의 연락처를 불러왔습니다. 발급할 담당자를 선택해 주세요.`
      : '통합_가평가 시트의 기존 문의처를 사용합니다.';
  }
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
  return rows.map((row) => {
    const detail = displayOrDash(row.detail);
    const reason = displayOrDash(row.reason);
    const hasExclusion = clean(row.detail) !== '' && clean(row.detail) !== '해당사항 없음';
    const detailHtml = escapeHtml(detail);
    const reasonHtml = escapeHtml(reason);
    return `
      <tr>
        <td>${hasExclusion ? `<strong>${detailHtml}</strong>` : detailHtml}</td>
        <td>${hasExclusion ? `<strong>${reasonHtml}</strong>` : reasonHtml}</td>
      </tr>`;
  }).join('');
}

function highlightReviewLine(line) {
  let html = escapeHtml(line);

  html = html.replace(
    /(가치금액은\s*)(\d+(?:\.\d+)?(?:\s*~\s*\d+(?:\.\d+)?)?\s*억\s*원)/g,
    '$1<strong>$2</strong>'
  );

  html = html.replace(
    /(평가대상특허\s*제품\(솔루션\)은\s*.*?)(?=에\s*관한|에\s*해당|으로서|이며|이고|임\.?|것임\.?|$)/g,
    '<strong>$1</strong>'
  );

  html = html.replace(
    /((?:특허매출비중|평가대상특허\s*관련\s*매출\s*비중)\s*\d+(?:\.\d+)?%)/g,
    '<strong>$1</strong>'
  );

  return html;
}

function buildReviewLines(text) {
  const normalized = clean(text);
  if (!normalized) return '<div class="review-line">-</div>';
  return normalized
    .split(/\r?\n/)
    .map(line => clean(line))
    .filter(Boolean)
    .map(line => `<div class="review-line">${highlightReviewLine(line)}</div>`)
    .join('');
}

function parseAmountText(text, requireValueKeyword = false) {
  const source = clean(text).replace(/[–—−～]/g, '~');
  if (!source) return null;

  const amountExpression = '(\\d+(?:\\.\\d+)?(?:\\s*[~-]\\s*\\d+(?:\\.\\d+)?)?\\s*억\\s*원)';
  const pattern = requireValueKeyword
    ? new RegExp(`(?:가치평가금액|가치금액|평가금액)\\s*(?:은|은\\s*약|:)?\\s*(?:약\\s*)?${amountExpression}`)
    : new RegExp(amountExpression);

  const match = source.match(pattern);
  if (!match) return null;

  const label = match[1].replace(/\s+/g, ' ').trim();
  const numbers = label.match(/\d+(?:\.\d+)?/g)?.map(Number) || [];
  if (!numbers.length) return null;

  return {
    min: numbers[0],
    max: numbers.length > 1 ? numbers[1] : numbers[0],
    label,
  };
}

function updateValuationConsistency() {
  if (!currentData) {
    valuationWarning.hidden = true;
    valuationWarning.textContent = '';
    return { status: 'none' };
  }

  const topAmount = parseAmountText(valuationAmountInput.value, false);
  const reviewAmount = parseAmountText(reviewInput.value, true);

  if (!topAmount) {
    valuationWarning.hidden = false;
    valuationWarning.textContent = '⚠ 상단 가치평가금액에서 비교 가능한 억 원 단위 금액을 찾지 못했습니다.';
    return { status: 'unreadable-top' };
  }

  if (!reviewAmount) {
    valuationWarning.hidden = false;
    valuationWarning.textContent = `⚠ 검토의견에서 최종 가치금액을 찾지 못했습니다. 상단 가치평가금액: ${topAmount.label}`;
    return { status: 'unreadable-review', topAmount };
  }

  const sameMin = Math.abs(topAmount.min - reviewAmount.min) < 0.000001;
  const sameMax = Math.abs(topAmount.max - reviewAmount.max) < 0.000001;

  if (!sameMin || !sameMax) {
    valuationWarning.hidden = false;
    valuationWarning.innerHTML = `⚠ 가치평가금액과 검토의견의 최종 가액이 일치하지 않습니다.<br>상단: <strong>${escapeHtml(topAmount.label)}</strong> / 검토의견: <strong>${escapeHtml(reviewAmount.label)}</strong>`;
    return { status: 'mismatch', topAmount, reviewAmount };
  }

  valuationWarning.hidden = true;
  valuationWarning.textContent = '';
  return { status: 'ok', topAmount, reviewAmount };
}

function renderReport() {
  if (!currentData) return;
  const notes = notesInput.value;
  const reviewOpinion = reviewInput.value;
  const valuationAmount = valuationAmountInput.value;
  const agency = window.getQuickValuationAgencyConfig ? window.getQuickValuationAgencyConfig() : null;
  const reportInstitution = agency?.name || currentData.institution;
  const reportContact = selectedContact || currentData.contact;

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
        <div><dt>평가기관</dt><dd>${escapeHtml(displayOrDash(reportInstitution))}</dd></div>
        <div><dt>문의처</dt><dd>${formatContact(reportContact)}</dd></div>
        <div class="value-box"><dt>가치평가금액</dt><dd>${escapeHtml(displayOrDash(valuationAmount))}</dd></div>
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

      <section class="report-section review-section">
        <h2>3. 검토의견</h2>
        <div class="review-copy">${buildReviewLines(reviewOpinion)}</div>
      </section>

      <div class="disclaimer">${escapeHtml(currentData.disclaimer || '※ 본 간이감정 결과는 본 평가 시 산정변수 및 실사결과 등에 따라 변동될 수 있습니다.')}</div>
    </article>`;

  updateValuationConsistency();
}

fileInput.addEventListener('change', async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    fileStatus.textContent = 'Excel을 읽는 중입니다...';
    fileStatus.className = 'status';
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array', cellDates: false, cellNF: true });
    currentData = readWorkbookData(workbook);
    notesInput.value = currentData.specialNotes || '';
    reviewInput.value = currentData.reviewOpinion || '';
    valuationAmountInput.value = currentData.valuationAmount || '';
    guideEl.textContent = `※ ${currentData.specialGuide}`;
    populateContactSelect(currentData);
    renderReport();
    printBtn.disabled = false;
    fileStatus.textContent = `완료: ${file.name} · 통합_가평가 시트에서 ${currentData.patents.length}건의 평가대상특허를 불러왔습니다.`;
    fileStatus.className = 'status ok';
  } catch (error) {
    currentData = null;
    selectedContact = '';
    printBtn.disabled = true;
    if (contactSelect) {
      contactSelect.innerHTML = '<option value="">Excel 업로드 후 선택할 수 있습니다.</option>';
      contactSelect.disabled = true;
    }
    if (contactGuide) contactGuide.textContent = 'Excel 업로드 후 데이터처리 시트의 인력·연락처·이메일을 불러옵니다.';
    valuationWarning.hidden = true;
    valuationWarning.textContent = '';
    reportArea.classList.add('is-empty');
    reportArea.innerHTML = '<div class="empty-report"><strong>파일을 읽지 못했습니다.</strong><p>통합_가평가 시트가 있는 가평가 Excel인지 확인해 주세요.</p></div>';
    fileStatus.textContent = `오류: ${error.message}`;
    fileStatus.className = 'status error';
  }
});

[notesInput, reviewInput, valuationAmountInput].forEach((input) => {
  input.addEventListener('input', () => {
    if (currentData) renderReport();
  });
});

contactSelect?.addEventListener('change', () => {
  selectedContact = contactSelect.value;
  if (currentData) renderReport();
});

document.addEventListener('quickvaluation:agencychange', () => {
  if (currentData) renderReport();
});

printBtn.addEventListener('click', () => {
  const consistency = updateValuationConsistency();
  if (consistency.status !== 'ok') {
    const proceed = window.confirm('가치평가금액과 검토의견의 최종 가액 정합성을 확인해 주세요. 그래도 인쇄/PDF 저장을 진행하시겠습니까?');
    if (!proceed) return;
  }
  window.print();
});

resetBtn.addEventListener('click', () => {
  fileInput.value = '';
  notesInput.value = '';
  reviewInput.value = '';
  valuationAmountInput.value = '';
  selectedContact = '';
  if (contactSelect) {
    contactSelect.innerHTML = '<option value="">Excel 업로드 후 선택할 수 있습니다.</option>';
    contactSelect.disabled = true;
  }
  if (contactGuide) contactGuide.textContent = 'Excel 업로드 후 데이터처리 시트의 인력·연락처·이메일을 불러옵니다.';
  valuationWarning.hidden = true;
  valuationWarning.textContent = '';
  currentData = null;
  printBtn.disabled = true;
  fileStatus.textContent = '파일을 선택하면 자동으로 미리보기를 생성합니다.';
  fileStatus.className = 'status';
  reportArea.classList.add('is-empty');
  reportArea.innerHTML = '<div class="empty-report"><strong>간이감정 보고서 미리보기</strong><p>Excel을 업로드하면 이 영역에 보고서가 표시됩니다.</p></div>';
});
