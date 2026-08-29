(function () {
  const control = window.MyeongvalueAccessControl;

  if (!control?.hasAdminSession()) {
    window.location.replace('../valuation/?agency=myeongvalue-admin');
    return;
  }

  const cards = Array.from(document.querySelectorAll('.agency-deadline-card'));
  const saveMessage = document.getElementById('saveMessage');

  function getStatusForInput(value) {
    if (!value) return { allowed: true };
    const expiresAt = new Date(`${value}T23:59:59.999`);
    return { allowed: Date.now() <= expiresAt.getTime() };
  }

  function renderCard(card) {
    const agencyId = card.dataset.agency;
    const input = card.querySelector('input[type="date"]');
    const status = card.querySelector('[data-status]');
    if (!input || !status) return;
    input.value = control.getDeadline(agencyId);
    const current = input.value ? getStatusForInput(input.value) : { allowed: true };
    status.classList.toggle('is-expired', !current.allowed);
    status.textContent = !input.value
      ? '현재 설정: 무기한 접속'
      : current.allowed
        ? `현재 설정: ${input.value} 23:59까지 접속 가능`
        : `현재 설정: ${input.value} 만료 · 접속 차단`;
  }

  cards.forEach(card => {
    renderCard(card);
    const input = card.querySelector('input[type="date"]');
    input?.addEventListener('change', () => {
      const status = card.querySelector('[data-status]');
      const current = input.value ? getStatusForInput(input.value) : { allowed: true };
      status?.classList.toggle('is-expired', !current.allowed);
      if (status) {
        status.textContent = !input.value
          ? '저장 예정: 무기한 접속'
          : current.allowed
            ? `저장 예정: ${input.value} 23:59까지 접속 가능`
            : `저장 예정: ${input.value} 만료 · 접속 차단`;
      }
    });
    card.querySelector('[data-clear]')?.addEventListener('click', () => {
      if (input) {
        input.value = '';
        input.dispatchEvent(new Event('change'));
      }
    });
  });

  document.getElementById('saveDeadlines')?.addEventListener('click', () => {
    cards.forEach(card => {
      const input = card.querySelector('input[type="date"]');
      control.setDeadline(card.dataset.agency, input?.value || '');
      renderCard(card);
    });
    if (saveMessage) saveMessage.textContent = '기관별 접속기한을 저장했습니다.';
    window.setTimeout(() => {
      if (saveMessage) saveMessage.textContent = '';
    }, 3500);
  });

  document.getElementById('adminLogout')?.addEventListener('click', () => {
    control.endAdminSession();
    window.location.replace('../valuation/?agency=myeongvalue-admin');
  });

  document.body.classList.remove('admin-loading');
})();
