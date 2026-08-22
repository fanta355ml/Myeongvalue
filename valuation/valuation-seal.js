/* Myeongvalue-only report seal controller */
(() => {
  const sealAsset = '../assets/myeongvalue-seal.png';

  function getAgencyId() {
    try {
      return window.getQuickValuationAgencyConfig?.()?.id || 'myeongvalue';
    } catch (error) {
      return 'myeongvalue';
    }
  }

  function sealEnabled() {
    const checkbox = document.getElementById('includeSeal');
    return checkbox ? checkbox.checked : true;
  }

  function formatIssueDate(date = new Date()) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}. ${mm}. ${dd}.`;
  }

  function updateSealOptionVisibility() {
    const option = document.getElementById('sealOption');
    if (!option) return;
    option.hidden = getAgencyId() !== 'myeongvalue';
  }

  function applySeal() {
    updateSealOptionVisibility();

    const report = document.querySelector('.report-paper');
    if (!report) return;

    report.querySelector('.report-seal-block')?.remove();

    if (getAgencyId() !== 'myeongvalue' || !sealEnabled()) return;

    const disclaimer = report.querySelector('.disclaimer');
    const block = document.createElement('div');
    block.className = 'report-seal-block';
    block.setAttribute('aria-label', '명밸류 파트너스 발급일 및 직인');
    block.innerHTML = `
      <div class="report-seal-lockup">
        <div class="report-seal-date">${formatIssueDate()}</div>
        <div class="report-seal-signature">
          <span class="report-seal-name">명밸류 파트너스</span>
          <img class="report-seal-image" src="${sealAsset}" alt="명밸류 파트너스 직인">
        </div>
      </div>`;

    if (disclaimer) disclaimer.after(block);
    else report.appendChild(block);
  }

  let queued = false;
  function scheduleApply() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      queued = false;
      applySeal();
    }));
  }

  document.addEventListener('DOMContentLoaded', () => {
    const checkbox = document.getElementById('includeSeal');
    checkbox?.addEventListener('change', scheduleApply);

    const reportArea = document.getElementById('reportArea');
    if (reportArea) {
      new MutationObserver(scheduleApply).observe(reportArea, { childList: true, subtree: false });
    }

    document.addEventListener('quickvaluation:agencychange', scheduleApply);
    document.getElementById('resetBtn')?.addEventListener('click', scheduleApply);

    updateSealOptionVisibility();
    scheduleApply();
  });
})();
