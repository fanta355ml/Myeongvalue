/* Myeongvalue-only detailed evaluation factor summary
   Scores are detected from the uploaded workbook by matching factor names and nearby 1~5 scores / rating marks.
*/
(() => {
  const FACTORS = [
    { area:'기술성', name:'우월성', definition:'대상기술의 유형을 파생기술, 응용기술, 원천기술 등으로 구분하고 기술적 우월성을 판단함.' },
    { area:'기술성', name:'혁신성', definition:'대상기술을 기술혁신의 응용과 확산 정도에 따라 혁신기술, 주요 개량기술, 보통 개량기술, 일부 개량 및 기존기술과 유사 등으로 구분하여 평가함.' },
    { area:'기술성', name:'차별성', definition:'경쟁기술 대비 대상기술의 차별적 속성을 평가함.' },
    { area:'기술성', name:'기술경쟁강도', definition:'경쟁·유사기술의 수와 기술 간 상호 경쟁관계 등을 고려하여 기술 경쟁 수준을 평가함.' },
    { area:'기술성', name:'기술사업화환경', definition:'기술 완성도, 추가 기술개발 비용·시간 및 기술 관련 법·제도적 규제와 지원 등을 종합하여 평가함.' },
    { area:'기술성', name:'대체가능성', definition:'향후 3년간 대상기술을 대체할 수 있는 기술의 출현 가능성을 평가함.' },
    { area:'기술성', name:'활용성', definition:'대상기술이 사업화주체의 핵심기술로서 사업전략과 부합하고 경제적 이익 창출에 활용될 수 있는지 평가함.' },
    { area:'기술성', name:'파급성', definition:'대상기술의 향후 타제품 및 타시장으로의 확장·적용 가능성을 평가함.' },
    { area:'기술성', name:'모방난이도', definition:'기술 수준의 고도성 또는 복잡성으로 인해 모방이 어려운 정도를 평가함.' },
    { area:'기술성', name:'전망성', definition:'대상기술이 속한 기술분야의 기술개발 동향 및 연구개발 추세 등을 고려하여 전망성을 평가함.' },
    { area:'권리성', name:'권리안정성', definition:'선행특허 분석 결과에 근거하여 등록된 권리가 무효화되지 않고 안정적으로 유지될 가능성을 평가함.' },
    { area:'권리성', name:'권리보호강도', definition:'청구범위의 한정 구성과 기술적 핵심 구성의 반영 여부를 검토하여 권리범위의 명확성과 보호강도를 평가함.' },
    { area:'권리성', name:'권리행사용이성', definition:'권리행사 제한요소, 특허침해 발견의 용이성 및 침해 입증에 필요한 노력과 비용을 고려하여 평가함.' },
    { area:'권리성', name:'지식재산거래시장성', definition:'해당 기술분야의 특허출원 활성도와 분쟁 및 라이선스 활성도를 고려하여 평가함.' },
    { area:'시장성', name:'시장진입가능성', definition:'시장진입 장애요인을 분석하여 대상기술의 시장진입 가능성을 평가함.' },
    { area:'시장성', name:'시장경쟁강도', definition:'목표시장의 경쟁구조, 시장지배자 유형, 독과점 여부 및 경쟁제품 수 등 경쟁강도가 사업화에 미치는 영향을 평가함.' },
    { area:'시장성', name:'시장경쟁의변화', definition:'향후 3~5년 이내 경쟁제품·경쟁기업 수 등 경쟁상황 변화가 사업화에 미치는 영향을 평가함.' },
    { area:'시장성', name:'시장성장전망', definition:'향후 5년간 목표시장의 연평균 성장률을 통해 시장의 성장성을 평가함.' },
    { area:'시장성', name:'신제품출현가능성', definition:'목표시장에서 향후 3년 이내 경쟁 신제품이 출현할 가능성을 평가함.' },
    { area:'시장성', name:'수요민감도', definition:'제품 수요가 경기변동, 가격, 품질, 디자인 등에 얼마나 민감한지를 종합적으로 고려하여 평가함.' },
    { area:'사업성', name:'생산용이성', definition:'제품을 생산하는 데 필요한 생산활동과 관련된 사항 등을 고려하여 생산용이성을 평가함.' },
    { area:'사업성', name:'예상시장점유율', definition:'경쟁자 수, 경쟁상황, 제품 경쟁력 및 사업화역량 등을 고려하여 현금흐름 추정기간 중 최대 예상 시장점유율을 평가함.' },
    { area:'사업성', name:'수익성', definition:'대상기술제품의 현금흐름 추정기간 평균 영업이익률과 동업종 최근 평균 영업이익률을 비교하여 평가함.' },
  ];

  const normalize = value => String(value ?? '').replace(/\s+/g,'').replace(/[·ㆍ/()\-]/g,'').trim();
  const isMark = value => /^(●|○|◉|■|✓|✔|v)$/i.test(String(value ?? '').trim());

  const matchesFactor = (cellText, factorName) => {
    const cell = normalize(cellText);
    const factor = normalize(factorName);
    if (!cell || !factor) return false;
    if (cell === factor) return true;
    const aliases = {
      '기술사업화환경':['기술사업화환경','사업화환경'],
      '권리행사용이성':['권리행사용이성','권리행사 용이성'],
      '지식재산거래시장성':['지식재산거래시장성','지식재산 거래시장성','IP거래시장성'],
      '시장진입가능성':['시장진입가능성','시장진입 가능성'],
      '시장경쟁의변화':['시장경쟁의변화','시장경쟁 변화'],
      '시장성장전망':['시장성장전망','성장전망'],
      '신제품출현가능성':['신제품출현가능성','신제품 출현가능성'],
      '예상시장점유율':['예상시장점유율','예상 시장점유율'],
    };
    return (aliases[factorName] || []).some(alias => cell === normalize(alias));
  };

  function scoreFromHeader(rows, rowIndex, markCol) {
    for (let r = Math.max(0,rowIndex-4); r < rowIndex; r += 1) {
      const header = rows[r] || [];
      const value = String(header[markCol] ?? '').trim();
      const n = Number(value);
      if (Number.isFinite(n) && n >= 1 && n <= 5) return n;
      const label = normalize(value);
      if (label === '매우미흡') return 1;
      if (label === '미흡') return 2;
      if (label === '보통') return 3;
      if (label === '우수') return 4;
      if (label === '매우우수') return 5;
    }
    return null;
  }

  function findFactorScore(rows, factor) {
    for (let r = 0; r < rows.length; r += 1) {
      const row = rows[r] || [];
      for (let c = 0; c < row.length; c += 1) {
        if (!matchesFactor(row[c], factor.name)) continue;
        for (let cc = c + 1; cc <= Math.min(row.length - 1, c + 12); cc += 1) {
          const raw = row[cc];
          const num = typeof raw === 'number' ? raw : Number(String(raw ?? '').trim());
          if (Number.isFinite(num) && Number.isInteger(num) && num >= 1 && num <= 5) return num;
          const text = normalize(raw);
          if (text === '매우미흡') return 1;
          if (text === '미흡') return 2;
          if (text === '보통') return 3;
          if (text === '우수') return 4;
          if (text === '매우우수') return 5;
        }
        for (let cc = c + 1; cc <= Math.min(row.length - 1, c + 12); cc += 1) {
          if (!isMark(row[cc])) continue;
          const score = scoreFromHeader(rows, r, cc);
          if (score) return score;
        }
      }
    }
    return null;
  }

  function extractRatings(workbook) {
    const ratings = FACTORS.map(factor => ({...factor, score:null}));
    workbook.SheetNames.forEach(sheetName => {
      const sheet = workbook.Sheets[sheetName];
      if (!sheet) return;
      const rows = XLSX.utils.sheet_to_json(sheet,{header:1,raw:false,defval:''});
      ratings.forEach(item => {
        if (item.score) return;
        const score = findFactorScore(rows,item);
        if (score) item.score = score;
      });
    });
    return ratings;
  }

  const markCell = (item, score) => `<td class="myeong-rating-grade ${item.score === score ? 'is-selected' : ''}">${item.score === score ? '●' : ''}</td>`;

  function areaTableHtml(area, items) {
    return `<div class="myeong-rating-card">
      <div class="myeong-rating-area-title">${area}</div>
      <table class="myeong-rating-table">
        <colgroup><col class="col-name"><col class="col-definition"><col class="col-grade"><col class="col-grade"><col class="col-grade"><col class="col-grade"><col class="col-grade"></colgroup>
        <thead><tr><th>평가항목</th><th>정의</th><th>매우우수</th><th>우수</th><th>보통</th><th>미흡</th><th>매우미흡</th></tr></thead>
        <tbody>${items.map(item => `<tr><td class="myeong-rating-name">${item.name}</td><td class="myeong-rating-definition">${item.definition}</td>${markCell(item,5)}${markCell(item,4)}${markCell(item,3)}${markCell(item,2)}${markCell(item,1)}</tr>`).join('')}</tbody>
      </table>
    </div>`;
  }

  function renderRatings() {
    document.querySelector('.myeong-rating-section')?.remove();
    if (window.getQuickValuationAgencyConfig?.().id !== 'myeongvalue') return;
    const ratings = window.quickValuationDetailedRatings;
    if (!Array.isArray(ratings) || !ratings.length) return;
    const report = document.querySelector('.report-paper');
    if (!report) return;

    const areas = ['기술성','권리성','시장성','사업성'];
    const section = document.createElement('section');
    section.className = 'report-section myeong-rating-section';
    section.innerHTML = `<h2>5. 세부 평가등급</h2>
      <div class="myeong-rating-layout">${areas.map(area => areaTableHtml(area,ratings.filter(item => item.area === area))).join('')}</div>
      <div class="myeong-rating-note">* 선택된 평가등급은 ●로 표시함. 평가요인 정의는 IP담보평가 평가요인 기준을 적용하며, 등급은 업로드 Excel에서 확인 가능한 값을 표시함.</div>`;

    const disclaimer = report.querySelector('.disclaimer');
    if (disclaimer && disclaimer.parentElement === report) report.insertBefore(section, disclaimer);
    else report.appendChild(section);
  }

  let renderQueued = false;
  const scheduleRender = () => {
    if (renderQueued) return;
    renderQueued = true;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      renderQueued = false;
      renderRatings();
    }));
  };

  document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('excelFile');
    fileInput?.addEventListener('change', async event => {
      const file = event.target.files?.[0];
      if (!file || typeof XLSX === 'undefined') return;
      try {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer,{type:'array',cellDates:false,cellNF:true});
        window.quickValuationDetailedRatings = extractRatings(workbook);
      } catch (error) {
        console.warn('세부 평가등급을 읽지 못했습니다.',error);
        window.quickValuationDetailedRatings = FACTORS.map(item => ({...item,score:null}));
      }
      scheduleRender();
    });

    document.getElementById('resetBtn')?.addEventListener('click',() => {
      window.quickValuationDetailedRatings = null;
      document.querySelector('.myeong-rating-section')?.remove();
    });
    document.addEventListener('quickvaluation:agencychange',scheduleRender);
    document.addEventListener('quickvaluation:chartdata',scheduleRender);

    const reportArea = document.getElementById('reportArea');
    if (reportArea) {
      const observer = new MutationObserver(scheduleRender);
      observer.observe(reportArea,{childList:true,subtree:false});
    }
  });
})();
