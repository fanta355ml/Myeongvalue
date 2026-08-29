# IP 가치평가 플랫폼 파일 구조

`index.html`에는 접속 화면과 React 앱이 연결되는 최소 HTML만 둡니다. 대형 코드를 다시 인라인으로 합치지 않습니다.

- `assets/css/app.css`: 앱 기본 스타일과 인쇄 스타일
- `assets/css/overrides.css`: 명밸류 화면·인쇄 보정 스타일
- `assets/data/app-config.js`: 은행별 잔존기간·등록 6개월 예외와 매출근거 표시문안
- `assets/data/institution-reference-data.js`: 기관별 TCT·로열티율·할인율 참조표
- `assets/js/vendor.js`: React·화면 컴포넌트 기반 라이브러리
- `assets/js/shared.js`: 공통 UI 도구·은행 기준·기본 데이터
- `assets/js/reference-data.js`: 로열티율·할인율 등 가치평가 참조 데이터
- `assets/js/valuation-engine.js`: 엑셀 처리·참조값 조회·가치산정 연결
- `assets/js/scoring.js`: 세부 평가요인과 평점 화면
- `assets/js/reporting.js`: 업체·시장자료 처리와 결과보고서
- `assets/js/workbench.js`: 전체 메뉴·상태·화면 연결 및 앱 실행
- `assets/js/ui-fixes.js`: 화면 표시 및 입력 형식 보정
- `assets/js/access-gate.js`: 기관코드·암호 접속 화면
- `assets/images/favicon.svg`: 플랫폼 파비콘
- `assets/images/report-seal.png`: 간이감정 보고서용 직인

공통 기관 접속 설정은 상위 폴더의 `../access-control.js`, 공통 기관 로그인 스타일은 `../valuation/valuation-auth.css`, 공통 CI 이미지는 `../assets/`를 사용합니다.

JavaScript 파일은 `index.html`의 순서대로 불러오며 서로의 전역 선언을 사용합니다. 파일 순서를 바꾸거나 `type="module"`로 변경하면 앱이 실행되지 않을 수 있습니다. 은행 기준이나 참조표를 수정할 때는 먼저 `assets/data/`만 확인하면 됩니다.

업체정보에서 인식한 기업명은 왼쪽의 `현재 평가 건` 명칭에 자동으로 반영됩니다. 파일 불러오기 후 데이터 적용을 위해 페이지가 새로고침되어도 현재 브라우저 탭의 기관 인증은 유지됩니다. `접속 화면으로` 버튼을 누르거나 탭을 닫으면 인증이 해제되며, 암호 자체는 저장하지 않습니다.
