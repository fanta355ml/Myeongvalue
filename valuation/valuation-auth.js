const QUICK_VALUATION_AGENCIES = {
  myeongvalue: {
    id: 'myeongvalue',
    name: '명밸류 파트너스',
    reportName: '명밸류 파트너스',
    subline: 'MYEONG VALUE PARTNERS · IP & TECHNOLOGY VALUATION',
    logo: '../assets/logo.png',
    passwordHash: '477a31e51015f799af7289d7b9e0b1c481656ae0f275efcf2da85cb08d36a56e'
  },
  kodata: {
    id: 'kodata',
    name: '한국평가데이터(주)',
    reportName: '',
    subline: 'KOREA RATING & DATA',
    logo: '../assets/kodata-logo.png',
    passwordHash: '0cf1091f5c1d9dbc09e9753f162003f2cc0355ccd8c992e3986c1855821512ab'
  }
};

let selectedAgencyId = 'myeongvalue';
window.quickValuationAgency = null;
window.getQuickValuationAgencyConfig = () => window.quickValuationAgency || QUICK_VALUATION_AGENCIES.myeongvalue;

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest)).map(byte => byte.toString(16).padStart(2, '0')).join('');
}

function setAgencyChoice(agencyId) {
  selectedAgencyId = agencyId;
  document.querySelectorAll('.agency-choice').forEach(button => {
    const selected = button.dataset.agency === agencyId;
    button.classList.toggle('is-selected', selected);
    button.setAttribute('aria-pressed', selected ? 'true' : 'false');
  });

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
  if (!brand) return;
  if (brand.dataset.agency === agency.id) return;

  brand.dataset.agency = agency.id;
  brand.classList.toggle('is-kodata', agency.id === 'kodata');
  brand.classList.toggle('is-myeongvalue', agency.id === 'myeongvalue');

  if (agency.id === 'kodata') {
    brand.innerHTML = `
      <div class="kodata-report-lockup">
        <img src="${agency.logo}" alt="${agency.name}">
        <span>${agency.subline}</span>
      </div>`;
    return;
  }

  brand.innerHTML = `
    <img src="${agency.logo}" alt="${agency.name}">
    <div><strong>${agency.reportName}</strong><span>${agency.subline}</span></div>`;
}

function applyAgency(agencyId) {
  const agency = QUICK_VALUATION_AGENCIES[agencyId];
  if (!agency) return;
  window.quickValuationAgency = agency;

  const headerBrand = document.getElementById('headerBrand');
  const headerLogo = document.getElementById('headerBrandLogo');
  const headerName = document.getElementById('headerBrandName');
  const activeAgencyName = document.getElementById('activeAgencyName');
  const footer = document.querySelector('.valuation-footer');
  const switchButton = document.getElementById('agencySwitchBtn');

  if (headerBrand) {
    headerBrand.classList.toggle('is-kodata', agency.id === 'kodata');
    headerBrand.classList.toggle('is-myeongvalue', agency.id === 'myeongvalue');
  }
  if (headerLogo) {
    headerLogo.src = agency.logo;
    headerLogo.alt = agency.name;
  }
  if (headerName) {
    headerName.textContent = agency.name;
    headerName.hidden = agency.id === 'kodata';
  }
  if (activeAgencyName) {
    activeAgencyName.textContent = agency.id === 'kodata' ? agency.name : '';
    activeAgencyName.hidden = agency.id !== 'kodata';
  }
  if (footer) footer.textContent = `© ${agency.name} · IP & Technology Valuation`;
  if (switchButton) switchButton.hidden = false;

  applyReportAgencyBrand();
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

  if (status) status.textContent = '';
  applyAgency(selectedAgencyId);
  closeAgencyGate();
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.agency-choice').forEach(button => {
    button.addEventListener('click', () => setAgencyChoice(button.dataset.agency));
  });

  document.getElementById('agencyEnterBtn')?.addEventListener('click', submitAgencyLogin);
  document.getElementById('agencyPassword')?.addEventListener('keydown', event => {
    if (event.key === 'Enter') submitAgencyLogin();
  });
  document.getElementById('agencySwitchBtn')?.addEventListener('click', openAgencyGate);

  const reportArea = document.getElementById('reportArea');
  if (reportArea) {
    const observer = new MutationObserver(() => applyReportAgencyBrand());
    observer.observe(reportArea, { childList: true, subtree: true });
  }

  document.addEventListener('quickvaluation:agencychange', applyReportAgencyBrand);
  setAgencyChoice('myeongvalue');
});
