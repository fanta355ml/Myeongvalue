/* Fixed personnel contact mapping for Quick Valuation
   Source: 데이터처리!B42:C52
   B = 평가위원 이름 / C = 연락처 및 이메일
*/
(() => {
  const MYEONGVALUE_DEFAULT_CONTACT = '장현문 평가위원 010-4568-5944, fanta355ml@gmail.com';

  const cleanValue = (value) => {
    if (value === null || value === undefined) return '';
    return String(value).trim();
  };

  const readCell = (sheet, address) => {
    const target = sheet?.[address];
    if (!target) return '';
    return cleanValue(target.w !== undefined ? target.w : target.v);
  };

  window.findPersonnelContacts = function findPersonnelContacts(workbook) {
    const sheet = workbook?.Sheets?.['데이터처리'];
    if (!sheet) return [];

    const contacts = [];

    for (let row = 42; row <= 52; row += 1) {
      const rawName = readCell(sheet, `B${row}`);
      const contactInfo = readCell(sheet, `C${row}`).replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim();

      if (!rawName || !contactInfo) continue;

      const evaluatorName = /평가위원\s*$/.test(rawName)
        ? rawName
        : `${rawName} 평가위원`;

      contacts.push({
        name: evaluatorName,
        phone: '',
        email: '',
        value: `${evaluatorName} ${contactInfo}`,
        label: `${evaluatorName} · ${contactInfo}`,
      });
    }

    return contacts;
  };

  /* 기관별 문의처 기본값 + Excel 평가위원 선택 목록 */
  window.populateContactSelect = function populateContactSelect(data) {
    if (!contactSelect) return;
    contactSelect.innerHTML = '';

    const agency = window.getQuickValuationAgencyConfig
      ? window.getQuickValuationAgencyConfig()
      : { id: 'myeongvalue' };
    const excelContacts = Array.isArray(data?.contactOptions) ? data.contactOptions : [];
    const baseContact = cleanValue(data?.contact);

    if (agency.id === 'myeongvalue') {
      const fixedOption = document.createElement('option');
      fixedOption.value = MYEONGVALUE_DEFAULT_CONTACT;
      fixedOption.textContent = `명밸류 기본 문의처 · ${MYEONGVALUE_DEFAULT_CONTACT}`;
      contactSelect.appendChild(fixedOption);

      excelContacts.forEach(contact => {
        const option = document.createElement('option');
        option.value = contact.value;
        option.textContent = `Excel 평가위원 · ${contact.label}`;
        contactSelect.appendChild(option);
      });

      contactSelect.disabled = false;
      contactSelect.selectedIndex = 0;
      selectedContact = MYEONGVALUE_DEFAULT_CONTACT;

      if (contactGuide) {
        contactGuide.textContent = excelContacts.length
          ? `명밸류 기본 문의처를 우선 적용합니다. 필요 시 Excel에서 불러온 ${excelContacts.length}명의 평가위원 중 선택할 수 있습니다.`
          : '명밸류 기본 문의처를 적용합니다. Excel에 평가위원 정보가 있으면 추가 선택할 수 있습니다.';
      }
      return;
    }

    /* KoDATA 등 다른 기관은 기존 Excel 문의처를 우선 사용 */
    if (baseContact) {
      const option = document.createElement('option');
      option.value = baseContact;
      option.textContent = `기존 문의처 · ${baseContact}`;
      contactSelect.appendChild(option);
    }

    excelContacts.forEach(contact => {
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
      if (contactGuide) contactGuide.textContent = '데이터처리 시트에서 평가위원 연락처 정보를 찾지 못했습니다.';
      return;
    }

    contactSelect.disabled = false;
    contactSelect.selectedIndex = 0;
    selectedContact = contactSelect.value;
    if (contactGuide) {
      contactGuide.textContent = excelContacts.length
        ? `데이터처리 시트에서 ${excelContacts.length}명의 평가위원 정보를 불러왔습니다. 발급할 담당자를 선택해 주세요.`
        : '통합_가평가 시트의 기존 문의처를 사용합니다.';
    }
  };

  /* 기관을 바꾸면 업로드된 Excel은 유지하면서 문의처 기본값만 다시 적용 */
  document.addEventListener('quickvaluation:agencychange', () => {
    if (!currentData) return;
    populateContactSelect(currentData);
    renderReport();
  });
})();
