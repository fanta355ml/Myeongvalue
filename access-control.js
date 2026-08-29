(function () {
  const STORAGE_KEY = 'myeongvalue-access-deadlines-v1';
  const ADMIN_SESSION_KEY = 'myeongvalue-admin-session-v1';

  function readDeadlines() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return saved && typeof saved === 'object' ? saved : {};
    } catch (error) {
      return {};
    }
  }

  function writeDeadlines(deadlines) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(deadlines || {}));
    window.dispatchEvent(new CustomEvent('myeongvalue:access-deadlines-change'));
  }

  function normalizeDate(value) {
    const text = String(value || '').trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return '';
    const parsed = new Date(`${text}T23:59:59.999`);
    return Number.isFinite(parsed.getTime()) ? text : '';
  }

  function getDeadline(agencyId) {
    return normalizeDate(readDeadlines()[agencyId]);
  }

  function setDeadline(agencyId, value) {
    const deadlines = readDeadlines();
    const deadline = normalizeDate(value);
    if (deadline) deadlines[agencyId] = deadline;
    else delete deadlines[agencyId];
    writeDeadlines(deadlines);
    return deadline;
  }

  function getAccessStatus(agencyId, now) {
    if (agencyId === 'myeongvalue-admin') {
      return { allowed: true, unlimited: true, deadline: '', label: '관리자 계정' };
    }

    const deadline = getDeadline(agencyId);
    if (!deadline) {
      return { allowed: true, unlimited: true, deadline: '', label: '무기한' };
    }

    const expiresAt = new Date(`${deadline}T23:59:59.999`);
    const current = now instanceof Date ? now : new Date();
    const allowed = current.getTime() <= expiresAt.getTime();
    return {
      allowed,
      unlimited: false,
      deadline,
      expiresAt,
      label: allowed ? `${deadline}까지` : `${deadline} 만료`,
    };
  }

  function startAdminSession() {
    sessionStorage.setItem(ADMIN_SESSION_KEY, 'authorized');
  }

  function hasAdminSession() {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'authorized';
  }

  function endAdminSession() {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  }

  window.MyeongvalueAccessControl = {
    STORAGE_KEY,
    ADMIN_SESSION_KEY,
    readDeadlines,
    writeDeadlines,
    getDeadline,
    setDeadline,
    getAccessStatus,
    startAdminSession,
    hasAdminSession,
    endAdminSession,
  };
})();
