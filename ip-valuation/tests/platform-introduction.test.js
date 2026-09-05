const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repositoryRoot = path.resolve(__dirname, '..', '..');
const read = (relativePath) => fs.readFileSync(path.join(repositoryRoot, relativePath), 'utf8');

test('main homepage links to the IP platform introduction', () => {
  const homepage = read('index.html');

  assert.match(homepage, /href="ip-platform\/"[^>]*>IP Platform/);
  assert.match(homepage, /data-service-link="ip-platform\/"[^>]*><span>01<\/span><h3>IP 가치평가 플랫폼<\/h3>/);
  assert.match(homepage, /<span>02<\/span><h3>기술가치평가 컨설팅<\/h3>/);
  assert.doesNotMatch(homepage, /<span>09<\/span>/);
  assert.match(homepage, /로열티공제법Ⅰ·Ⅱ/);
});

test('introduction page presents both engines and links to the platform', () => {
  const introduction = read('ip-platform/index.html');

  assert.match(introduction, /로열티공제법Ⅰ/);
  assert.match(introduction, /로열티공제법Ⅱ/);
  assert.match(introduction, /href="\.\.\/ip-valuation\/"/);
  assert.match(introduction, /DCF 기반 기술가치평가 엔진은 후속 업데이트/);
});

test('introduction page screenshot assets exist', () => {
  [
    'ip-platform/assets/valuation-workspace.png',
    'ip-platform/assets/report-summary.png',
    'ip-platform/assets/report-review.png',
  ].forEach((relativePath) => {
    assert.equal(fs.existsSync(path.join(repositoryRoot, relativePath)), true, `${relativePath} is missing`);
  });
});

test('public sitemap includes the IP platform introduction', () => {
  const sitemap = read('sitemap.xml');

  assert.match(sitemap, /https:\/\/www\.myeongvalue\.co\.kr\/ip-platform\//);
});
