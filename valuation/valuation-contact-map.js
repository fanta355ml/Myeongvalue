/* Fixed personnel contact mapping for Quick Valuation
   Source: 데이터처리!B42:C52
   B = 평가위원 이름 / C = 연락처 및 이메일
*/
(() => {
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
})();
