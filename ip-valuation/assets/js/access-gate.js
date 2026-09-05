(function accessGateReplacement() {
  const SESSION_KEY = "myeongvalue-ip-valuation-session-v1";

  const agencies = {
    myeongvalue: {
      id: "myeongvalue",
      kind: "myeongvalue",
      name: "명밸류 파트너스",
      subline: "MYEONG VALUE PARTNERS",
      logo: "../assets/logo.png",
      passwordHash:
        "4f89740697702b3b64effcb361b9aa3c647ac0a04b192c3b35f096077d23afe6",
    },
    "myeongvalue-admin": {
      id: "myeongvalue-admin",
      kind: "myeongvalue",
      name: "관리자",
      subline: "ADMINISTRATOR ACCESS",
      logo: "../assets/logo.png",
      passwordHash:
        "075609a76608f34d1c77a89a58506fe04809a71ec4d6270a10992fc263a5dfbb",
    },
    kodata: {
      id: "kodata",
      kind: "kodata",
      name: "한국평가데이터(주)",
      subline: "KOREA RATING & DATA",
      logo: "../assets/kodata-logo.png",
      passwordHash:
        "d3de1dc6471f5b07488edc0b48360dea9b59ddf677d25cb29c9b676dfdcb4085",
    },
    juhae: {
      id: "juhae",
      kind: "juhae",
      name: "주해",
      subline: "JUHAE IP & TECHNOLOGY",
      logo: "../assets/juhae-logo.png",
      passwordHash:
        "2c0b6ddc6b8f8b4688c68b6cc877b65fdf64ad4abbbb0e4689a0d5ce6eca92cf",
    },
    ecredible: {
      id: "ecredible",
      kind: "ecredible",
      name: "이크레더블",
      subline: "ECREDIBLE",
      logo: "../assets/ecredible-logo.svg",
      passwordHash:
        "3b1905553320e2be254f5a4916c17e844b40c1fd005040e66de986f038da6480",
    },
  };

  const agencyCodes = Object.freeze({
    myeong: "myeongvalue",
    kodata: "kodata",
    juhae: "juhae",
    ecre: "ecredible",
    admin: "myeongvalue-admin",
  });

  let selectedAgencyId = "";

  const getSelectedAgency = () => agencies[selectedAgencyId] || null;

  const readSessionAgency = () => {
    try {
      const agencyId = sessionStorage.getItem(SESSION_KEY) || "";
      return agencies[agencyId] || null;
    } catch {
      return null;
    }
  };

  const saveSessionAgency = (agency) => {
    try {
      sessionStorage.setItem(SESSION_KEY, agency.id);
    } catch {
      // sessionStorage가 제한된 환경에서는 현재 페이지에서만 인증을 유지합니다.
    }
  };

  const clearSessionAgency = () => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // 저장소 접근이 제한되어도 접속 화면은 정상 표시합니다.
    }
  };

  const sha256 = async (text) => {
    const data = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  };

  const renderPreview = (agency) => {
    const preview = document.getElementById("ipAgencyPreview");
    const logo = document.getElementById("ipAgencyPreviewLogo");
    const name = document.getElementById("ipAgencyPreviewName");
    const subline = document.getElementById("ipAgencyPreviewSubline");
    const password = document.getElementById("ipAgencyPassword");
    const status = document.getElementById("ipAgencyLoginStatus");

    if (preview) preview.dataset.agency = agency.kind;
    if (logo) {
      logo.src = agency.logo;
      logo.alt = agency.name;
    }
    if (name) name.textContent = agency.name;
    if (subline) subline.textContent = agency.subline;
    if (password) password.value = "";
    if (status) status.textContent = "";
  };

  const resetGate = () => {
    selectedAgencyId = "";
    const codeInput = document.getElementById("ipAgencyCode");
    const codeStatus = document.getElementById("ipAgencyCodeStatus");
    const authPanel = document.getElementById("ipAgencyAuthPanel");
    const password = document.getElementById("ipAgencyPassword");
    const loginStatus = document.getElementById("ipAgencyLoginStatus");

    if (codeInput) codeInput.value = "";
    if (codeStatus) codeStatus.textContent = "";
    if (authPanel) authPanel.hidden = true;
    if (password) password.value = "";
    if (loginStatus) loginStatus.textContent = "";
    window.setTimeout(() => codeInput?.focus(), 0);
  };

  const submitCode = () => {
    const codeInput = document.getElementById("ipAgencyCode");
    const codeStatus = document.getElementById("ipAgencyCodeStatus");
    const authPanel = document.getElementById("ipAgencyAuthPanel");
    const password = document.getElementById("ipAgencyPassword");
    const code = String(codeInput?.value || "").trim().toLowerCase();
    const agencyId = agencyCodes[code];

    if (!agencyId) {
      selectedAgencyId = "";
      if (authPanel) authPanel.hidden = true;
      if (password) password.value = "";
      if (codeStatus) codeStatus.textContent = "기관코드를 확인해 주세요.";
      codeInput?.select();
      codeInput?.focus();
      return;
    }

    const agency = agencies[agencyId];
    selectedAgencyId = agency.id;
    renderPreview(agency);
    if (codeStatus) codeStatus.textContent = "";
    if (authPanel) authPanel.hidden = false;
    password?.focus();
  };

  const openGate = () => {
    const gate = document.getElementById("ipAgencyGate");
    if (!gate) return;
    clearSessionAgency();
    document.body.classList.add("auth-locked");
    gate.classList.remove("is-hidden");
    gate.setAttribute("aria-hidden", "false");
    resetGate();
  };

  const closeGate = (agency) => {
    const gate = document.getElementById("ipAgencyGate");
    if (!gate) return;
    window.ipValuationAgency = agency;
    document.body.dataset.agency = agency.kind;
    applyAgencyBrand(agency);
    gate.classList.add("is-hidden");
    gate.setAttribute("aria-hidden", "true");
    document.body.classList.remove("auth-locked");
  };

  const applyAgencyBrand = (agency) => {
    const brand = document.querySelector(".sidebar .brand");
    if (!brand || !agency) return;

    const imageOnlyBrand = agency.kind !== "myeongvalue";
    const logo = brand.querySelector(".brand-mark img");
    const text = brand.querySelector(":scope > div:not(.brand-mark)");
    const name = text?.querySelector("strong");
    const subline = text?.querySelector("span");

    brand.dataset.agency = agency.kind;
    brand.classList.toggle("is-agency-logo", imageOnlyBrand);
    brand.classList.toggle("is-kodata", agency.kind === "kodata");
    brand.classList.toggle("is-juhae", agency.kind === "juhae");
    brand.classList.toggle("is-ecredible", agency.kind === "ecredible");
    brand.classList.toggle("is-myeongvalue", agency.kind === "myeongvalue");

    if (logo) {
      logo.src = agency.logo;
      logo.alt = agency.name;
    }
    if (text && text.hidden !== imageOnlyBrand) text.hidden = imageOnlyBrand;
    if (
      name &&
      !imageOnlyBrand &&
      name.textContent !== "MYEONG VALUE"
    ) {
      name.textContent = "MYEONG VALUE";
    }
    if (
      subline &&
      !imageOnlyBrand &&
      subline.textContent !== "IP & Technology Valuation"
    ) {
      subline.textContent = "IP & Technology Valuation";
    }
  };

  const applyAgencyReportBrand = (agency) => {
    if (!agency) return;

    const imageOnlyBrand = agency.kind !== "myeongvalue";
    const reportBrand = document.querySelector(".quick-report-brand");
    const reportLogo = reportBrand?.querySelector(":scope > img");
    const reportText = reportBrand?.querySelector(":scope > div");
    const reportName = reportText?.querySelector("strong");
    const reportSubline = reportText?.querySelector("span");

    if (reportBrand) {
      reportBrand.dataset.agency = agency.kind;
      reportBrand.classList.toggle("is-agency-logo", imageOnlyBrand);
      reportBrand.classList.toggle(
        "is-ecredible",
        agency.kind === "ecredible",
      );
    }
    if (reportLogo?.getAttribute("src") !== agency.logo) {
      reportLogo?.setAttribute("src", agency.logo);
    }
    if (reportLogo && reportLogo.alt !== agency.name) {
      reportLogo.alt = agency.name;
    }
    if (reportText && reportText.hidden !== imageOnlyBrand) {
      reportText.hidden = imageOnlyBrand;
    }
    if (
      reportName &&
      !imageOnlyBrand &&
      reportName.textContent !== "MYEONG VALUE"
    ) {
      reportName.textContent = "MYEONG VALUE";
    }
    if (
      reportSubline &&
      !imageOnlyBrand &&
      reportSubline.textContent !== "IP & TECHNOLOGY VALUATION"
    ) {
      reportSubline.textContent = "IP & TECHNOLOGY VALUATION";
    }

    const issuer = document.querySelector(
      ".quick-report-signature > div > strong",
    );
    if (issuer && issuer.textContent !== agency.name) {
      issuer.textContent = agency.name;
    }
  };

  const submitLogin = async () => {
    const agency = getSelectedAgency();
    if (!agency) {
      const codeStatus = document.getElementById("ipAgencyCodeStatus");
      if (codeStatus) codeStatus.textContent = "기관코드를 먼저 입력해 주세요.";
      document.getElementById("ipAgencyCode")?.focus();
      return;
    }

    const password = document.getElementById("ipAgencyPassword");
    const status = document.getElementById("ipAgencyLoginStatus");
    const value = password?.value || "";

    if (!value) {
      if (status) status.textContent = "암호를 입력해 주세요.";
      password?.focus();
      return;
    }

    if ((await sha256(value)) !== agency.passwordHash) {
      if (status) {
        status.textContent = `${agency.name} 암호가 일치하지 않습니다.`;
      }
      password?.select();
      password?.focus();
      return;
    }

    const accessControl = window.MyeongvalueAccessControl;
    if (agency.id === "myeongvalue-admin") {
      accessControl?.startAdminSession();
      window.location.href = "../access-admin/";
      return;
    }

    const accessStatus = accessControl?.getAccessStatus(agency.id);
    if (accessStatus && !accessStatus.allowed) {
      if (status) {
        status.textContent = `${agency.name}의 접속기한이 ${accessStatus.deadline}에 만료되었습니다. 관리자에게 문의해 주세요.`;
      }
      if (password) password.value = "";
      return;
    }

    if (status) status.textContent = "";
    saveSessionAgency(agency);
    closeGate(agency);
  };

  const restoreSession = () => {
    const agency = readSessionAgency();
    if (!agency || agency.id === "myeongvalue-admin") return false;

    const accessStatus = window.MyeongvalueAccessControl?.getAccessStatus(
      agency.id,
    );
    if (accessStatus && !accessStatus.allowed) {
      clearSessionAgency();
      return false;
    }

    selectedAgencyId = agency.id;
    closeGate(agency);
    return true;
  };

  const insertPortalNavigation = () => {
    const sidebar = document.querySelector(".sidebar");
    if (!sidebar || sidebar.querySelector(".portal-nav-card")) return;

    const card = document.createElement("div");
    card.className = "portal-nav-card";
    card.setAttribute("aria-label", "사이트 이동");
    card.innerHTML = `
      <span>SITE NAVIGATION</span>
      <a href="../"><span aria-hidden="true">⌂</span> 홈페이지로</a>
      <button type="button" data-access-exit><span aria-hidden="true">↩</span> 접속 화면으로</button>
    `;
    card
      .querySelector("[data-access-exit]")
      ?.addEventListener("click", openGate);

    const footer = sidebar.querySelector(".sidebar-footer");
    sidebar.insertBefore(card, footer || null);
  };

  document.addEventListener("DOMContentLoaded", () => {
    document
      .getElementById("ipAgencyCodeBtn")
      ?.addEventListener("click", submitCode);
    document
      .getElementById("ipAgencyCode")
      ?.addEventListener("keydown", (event) => {
        if (event.key === "Enter") submitCode();
      });
    document
      .getElementById("ipAgencyEnterBtn")
      ?.addEventListener("click", submitLogin);
    document
      .getElementById("ipAgencyPassword")
      ?.addEventListener("keydown", (event) => {
        if (event.key === "Enter") submitLogin();
      });

    if (!restoreSession()) resetGate();
    const syncAgencyInterface = () => {
      insertPortalNavigation();
      if (window.ipValuationAgency) {
        applyAgencyBrand(window.ipValuationAgency);
        applyAgencyReportBrand(window.ipValuationAgency);
      }
    };
    syncAgencyInterface();
    const root = document.getElementById("root");
    if (root) {
      new MutationObserver(syncAgencyInterface).observe(root, {
        childList: true,
        subtree: true,
      });
    }
  });

  window.ipValuationAccess = { open: openGate };
})();
