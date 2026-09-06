const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repositoryRoot = path.resolve(__dirname, '..', '..');
const read = (relativePath) => fs.readFileSync(path.join(repositoryRoot, relativePath), 'utf8');

test('main homepage presents the valuation platform before Quick Valuation', () => {
  const homepage = read('index.html');

  assert.match(homepage, /href="ip-platform\/"[^>]*>Valuation Platform/);
  assert.match(homepage, /data-service-link="ip-platform\/"[^>]*><span>01<\/span><h3>가치평가 플랫폼<\/h3>/);
  const heroActions = homepage.match(/<div class="hero-actions">([\s\S]*?)<\/div>/)?.[1] || '';
  assert.ok(heroActions.indexOf('가치평가 플랫폼 소개') < heroActions.indexOf('Quick Valuation'));
  assert.match(homepage, /<span>02<\/span><h3>기술가치평가 컨설팅<\/h3>/);
  assert.doesNotMatch(homepage, /<span>09<\/span>/);
  assert.match(homepage, /로열티공제법 모델Ⅰ·Ⅱ/);
  assert.match(homepage, /기술성·권리성·시장성·사업성을 종합적으로 분석/);
});

test('main homepage places a concise platform overview immediately after the hero', () => {
  const homepage = read('index.html');
  const heroEnd = homepage.indexOf('</section>', homepage.indexOf('<section class="hero hero-photo">'));
  const platformStart = homepage.indexOf('<section id="platform"', heroEnd);
  const aboutStart = homepage.indexOf('<section id="about"', heroEnd);

  assert.ok(platformStart > heroEnd);
  assert.ok(platformStart < aboutStart);
  assert.match(homepage, /조건 입력부터 결과보고서까지,<br>하나의 평가 워크플로/);
  assert.match(homepage, /ip-platform\/assets\/valuation-workspace-public\.png/);
  assert.match(homepage, /ip-platform\/assets\/report-summary-public\.png/);
  assert.match(homepage, /href="ip-platform\/">플랫폼 자세히 보기/);
});

test('valuation platform introduction presents both models and links to the platform', () => {
  const introduction = read('ip-platform/index.html');

  assert.match(introduction, /<title>가치평가 플랫폼 \| 명밸류 파트너스<\/title>/);
  assert.match(introduction, /<meta name="robots" content="index, follow">/);
  assert.match(introduction, /<link rel="canonical" href="https:\/\/www\.myeongvalue\.co\.kr\/ip-platform\/">/);
  assert.match(introduction, /로열티공제법Ⅰ/);
  assert.match(introduction, /로열티공제법Ⅱ/);
  assert.match(introduction, /가치평가를<br><em>One-stop으로 편리하게/);
  assert.match(introduction, /웹 기반 가치평가로/);
  assert.match(introduction, /평가목적에 따라<br>로열티 모형 선택/);
  assert.match(introduction, /데이터 검증·검수/);
  assert.match(introduction, /AI 추천 검토의견/);
  assert.match(introduction, /평가자료와 산출결과의/);
  assert.match(introduction, /href="\.\.\/ip-valuation\/"/);
  assert.match(introduction, /DCF 기반 기술가치평가 모형은 후속 업데이트/);
});

test('introduction page screenshot assets exist', () => {
  [
    'ip-platform/assets/valuation-workspace-public.png',
    'ip-platform/assets/report-summary-public.png',
    'ip-platform/assets/report-review-public.png',
    'ip-platform/assets/report-closing-page.png',
  ].forEach((relativePath) => {
    assert.equal(fs.existsSync(path.join(repositoryRoot, relativePath)), true, `${relativePath} is missing`);
  });

  assert.equal(fs.existsSync(path.join(repositoryRoot, 'ip-platform/assets/valuation-workspace.png')), false);
  assert.equal(fs.existsSync(path.join(repositoryRoot, 'ip-platform/assets/report-summary.png')), false);
  assert.equal(fs.existsSync(path.join(repositoryRoot, 'ip-platform/assets/report-review.png')), false);
});

test('public sitemap includes the IP platform introduction', () => {
  const sitemap = read('sitemap.xml');

  assert.match(sitemap, /https:\/\/www\.myeongvalue\.co\.kr\/ip-platform\//);
});

test('public pages expose a visitor sitemap while the workbench stays out of search results', () => {
  const homepage = read('index.html');
  const introduction = read('ip-platform/index.html');
  const workbench = read('ip-valuation/index.html');

  assert.match(homepage, /<nav class="footer-sitemap" aria-label="사이트맵">/);
  assert.match(introduction, /<nav class="footer-sitemap" aria-label="사이트맵">/);
  assert.match(workbench, /<meta name="robots" content="noindex, nofollow"/);
});
