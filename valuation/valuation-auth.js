const QUICK_VALUATION_AGENCIES = {
  myeongvalue: {
    id: 'myeongvalue',
    kind: 'myeongvalue',
    name: '명밸류 파트너스',
    institutionName: '명밸류 파트너스',
    reportName: '명밸류 파트너스',
    subline: 'MYEONG VALUE PARTNERS · IP & TECHNOLOGY VALUATION',
    previewSubline: 'MYEONG VALUE PARTNERS',
    logo: '../assets/logo.png',
    passwordHash: '4f89740697702b3b64effcb361b9aa3c647ac0a04b192c3b35f096077d23afe6'
  },
  'myeongvalue-admin': {
    id: 'myeongvalue-admin',
    kind: 'myeongvalue',
    name: '관리자',
    institutionName: '명밸류 파트너스',
    reportName: '명밸류 파트너스',
    subline: 'MYEONG VALUE PARTNERS · IP & TECHNOLOGY VALUATION',
    previewSubline: 'ADMINISTRATOR ACCESS',
    logo: '../assets/logo.png',
    passwordHash: '075609a76608f34d1c77a89a58506fe04809a71ec4d6270a10992fc263a5dfbb'
  },
  kodata: {
    id: 'kodata',
    kind: 'kodata',
    name: '한국평가데이터(주)',
    institutionName: '한국평가데이터(주)',
    reportName: '',
    subline: '',
    previewSubline: 'KOREA RATING & DATA',
    logo: '../assets/kodata-logo.png',
    passwordHash: 'd3de1dc6471f5b07488edc0b48360dea9b59ddf677d25cb29c9b676dfdcb4085'
  },
  juhae: {
    id: 'juhae',
    kind: 'juhae',
    name: '주해',
    institutionName: '주해',
    reportName: '',
    subline: '',
    previewSubline: 'JUHAE IP & TECHNOLOGY',
    logo: '../assets/juhae-logo.png',
    passwordHash: '2c0b6ddc6b8f8b4688c68b6cc877b65fdf64ad4abbbb0e4689a0d5ce6eca92cf'
  }
};

let selectedAgencyId = 'myeongvalue';
window.quickValuationAgency = null;
window.getQuickValuationAgencyConfig = () => (
  window.quickValuationAgency || QUICK_VALUATION_AGENCIES.myeongvalue
);

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}

function renderAgencyPreview(agency) {
  const preview = document.getElementById('agencyPreview');
  const logo = document.getElementById('agencyPreviewLogo');
  const name = document.getElementById('agencyPreviewName');
  const subline = document.getElementById('agencyPreviewSubline');

  if (preview) preview.dataset.agency = agency.kind;
  if (logo) {
    logo.src = agency.logo;
    logo.alt = agency.name;
  }
  if (name) name.textContent = agency.name;
  if (subline) subline.textContent = agency.previewSubline;
}

function setAgencyChoice(agencyId) {
  const agency = QUICK_VALUATION_AGENCIES[agencyId] || QUICK_VALUATION_AGENCIES.myeongvalue;
  selectedAgencyId = agency.id;

  const select = document.getElementById('agencySelect');
  if (select && select.value !== agency.id) select.value = agency.id;
  renderAgencyPreview(agency);

  const passwordInput = document.getElementById('agencyPassword');
  const status = document.getElementById('agencyLoginStatus');
  if (passwordInput) {
    passwordInput.value = '';
    passwordInput.focus();
  }
  if (status) status.textContent = '';
}

function applyReportAgencyBrand() {
  const agency = window.getQuickValuationAgencyConfig();
  const brand = document.querySelector('.report-brand');
  if (!brand || brand.dataset.agency === agency.id) return;

  brand.dataset.agency = agency.id;
  brand.classList.toggle('is-kodata', agency.kind === 'kodata');
  brand.classList.toggle('is-myeongvalue', agency.kind === 'myeongvalue');
  brand.classList.toggle('is-juhae', agency.kind === 'juhae');

  if (agency.kind === 'kodata' || agency.kind === 'juhae') {
    brand.innerHTML = `<img src="${agency.logo}" alt="${agency.name}">`;
    return;
  }

  brand.innerHTML = `
    <img src="${agency.logo}" alt="${agency.institutionName}">
    <div><strong>${agency.reportName}</strong><span>${agency.subline}</span></div>`;
}

function applyReportPolish() {
  const agency = window.getQuickValuationAgencyConfig();

  document.querySelectorAll('.top-summary > div').forEach(row => {
    const dt = row.querySelector('dt');
    const dd = row.querySelector('dd');
    if (!dt || !dd || dt.textContent.trim() !== '평가기관') return;
    if (dd.textContent.trim() !== agency.institutionName) dd.textContent = agency.institutionName;
  });

  const specialContent = document.querySelector('.special-content');
  if (specialContent) {
    specialContent.childNodes.forEach(node => {
      if (node.nodeType !== Node.TEXT_NODE || !node.nodeValue?.includes('■')) return;
      node.nodeValue = node.nodeValue.replace(/(^|\n)(\s*)■\s*/g, '$1$2▪ ');
    });
  }
}

function applyAgency(agencyId) {
  const agency = QUICK_VALUATION_AGENCIES[agencyId];
  if (!agency) return;

  window.quickValuationAgency = agency;
  document.body.dataset.agency = agency.kind;

  const headerBrand = document.getElementById('headerBrand');
  const headerLogo = document.getElementById('headerBrandLogo');
  const headerName = document.getElementById('headerBrandName');
  const activeAgencyName = document.getElementById('activeAgencyName');
  const footer = document.querySelector('.valuation-footer');
  const switchButton = document.getElementById('agencySwitchBtn');
  const imageOnlyBrand = agency.kind === 'kodata' || agency.kind === 'juhae';

  if (headerBrand) {
    headerBrand.classList.toggle('is-kodata', agency.kind === 'kodata');
    headerBrand.classList.toggle('is-myeongvalue', agency.kind === 'myeongvalue');
    headerBrand.classList.toggle('is-juhae', agency.kind === 'juhae');
  }
  if (headerLogo) {
    headerLogo.src = agency.logo;
    headerLogo.alt = agency.name;
  }
  if (headerName) {
    headerName.textContent = agency.name;
    headerName.hidden = imageOnlyBrand;
  }
  if (activeAgencyName) {
    activeAgencyName.textContent = agency.id === 'myeongvalue' ? '' : agency.name;
    activeAgencyName.hidden = agency.id === 'myeongvalue';
  }
  if (footer) footer.textContent = `© ${agency.institutionName} · IP & Technology Valuation`;
  if (switchButton) switchButton.hidden = false;

  applyReportAgencyBrand();
  applyReportPolish();
  document.dispatchEvent(new CustomEvent('quickvaluation:agencychange', { detail: agency }));
}

function openAgencyGate() {
  const gate = document.getElementById('agencyGate');
  if (!gate) return;
  document.body.classList.add('auth-locked');
  gate.classList.remove('is-hidden');
  gate.setAttribute('aria-hidden', 'false');
  setAgencyChoice(window.quickValuationAgency?.id || selectedAgencyId);
}

function closeAgencyGate() {
  const gate = document.getElementById('agencyGate');
  if (!gate) return;
  gate.classList.add('is-hidden');
  gate.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('auth-locked');
}

async function submitAgencyLogin() {
  const agency = QUICK_VALUATION_AGENCIES[selectedAgencyId];
  const passwordInput = document.getElementById('agencyPassword');
  const status = document.getElementById('agencyLoginStatus');
  const password = passwordInput?.value || '';

  if (!password) {
    if (status) status.textContent = '암호를 입력해 주세요.';
    passwordInput?.focus();
    return;
  }

  const passwordHash = await sha256(password);
  if (passwordHash !== agency.passwordHash) {
    if (status) status.textContent = `${agency.name} 암호가 일치하지 않습니다.`;
    if (passwordInput) {
      passwordInput.select();
      passwordInput.focus();
    }
    return;
  }

  const accessControl = window.MyeongvalueAccessControl;
  if (agency.id === 'myeongvalue-admin') {
    accessControl?.startAdminSession();
    window.location.href = '../access-admin/';
    return;
  }

  const accessStatus = accessControl?.getAccessStatus(agency.id);
  if (accessStatus && !accessStatus.allowed) {
    if (status) status.textContent = `${agency.name}의 접속기한이 ${accessStatus.deadline}에 만료되었습니다. 관리자에게 문의해 주세요.`;
    if (passwordInput) passwordInput.value = '';
    return;
  }

  if (status) status.textContent = '';
  applyAgency(selectedAgencyId);
  closeAgencyGate();
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('agencySelect')?.addEventListener('change', event => {
    setAgencyChoice(event.target.value);
  });
  document.getElementById('agencyEnterBtn')?.addEventListener('click', submitAgencyLogin);
  document.getElementById('agencyPassword')?.addEventListener('keydown', event => {
    if (event.key === 'Enter') submitAgencyLogin();
  });
  document.getElementById('agencySwitchBtn')?.addEventListener('click', openAgencyGate);

  const reportArea = document.getElementById('reportArea');
  if (reportArea) {
    const observer = new MutationObserver(() => {
      applyReportAgencyBrand();
      applyReportPolish();
    });
    observer.observe(reportArea, { childList: true, subtree: true });
  }

  document.addEventListener('quickvaluation:agencychange', () => {
    applyReportAgencyBrand();
    applyReportPolish();
  });
  const requestedAgency = new URLSearchParams(window.location.search).get('agency');
  setAgencyChoice(QUICK_VALUATION_AGENCIES[requestedAgency] ? requestedAgency : 'myeongvalue');
});
