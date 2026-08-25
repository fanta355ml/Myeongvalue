import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const desktopDir = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(desktopDir, '..');
const appDir = path.join(desktopDir, 'app');
const agencyId = process.argv[2];
const agencies = {
  myeongvalue: {
    name: '명밸류 파트너스',
    title: '명밸류 IP 간이감정',
    icon: 'logo.png',
    appId: 'kr.co.myeongvalue.quickvaluation'
  },
  kodata: {
    name: '한국평가데이터(주)',
    title: 'KoDATA IP 간이감정',
    icon: 'kodata-logo.png',
    appId: 'kr.co.myeongvalue.quickvaluation.kodata'
  }
};
const agency = agencies[agencyId];

if (!agency) {
  throw new Error('Agency must be either myeongvalue or kodata.');
}

await rm(appDir, { recursive: true, force: true });
await mkdir(path.join(appDir, 'assets'), { recursive: true });
await mkdir(path.join(appDir, 'vendor'), { recursive: true });

await cp(path.join(repositoryRoot, 'valuation'), path.join(appDir, 'valuation'), {
  recursive: true
});

for (const assetName of ['logo.png', 'kodata-logo.png', 'myeongvalue-seal.png']) {
  await cp(
    path.join(repositoryRoot, 'assets', assetName),
    path.join(appDir, 'assets', assetName)
  );
}

const iconBytes = await readFile(path.join(repositoryRoot, 'assets', agency.icon));
await writeFile(
  path.join(appDir, 'icon.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">\n` +
    `  <rect width="1024" height="1024" rx="180" fill="#ffffff"/>\n` +
    `  <image href="data:image/png;base64,${iconBytes.toString('base64')}" x="112" y="112" width="800" height="800" preserveAspectRatio="xMidYMid meet"/>\n` +
    `</svg>\n`,
  'utf8'
);

await cp(
  path.join(desktopDir, 'node_modules', 'xlsx', 'dist', 'xlsx.full.min.js'),
  path.join(appDir, 'vendor', 'xlsx.full.min.js')
);

const indexPath = path.join(appDir, 'valuation', 'index.html');
let indexHtml = await readFile(indexPath, 'utf8');
indexHtml = indexHtml.replace(
  'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js',
  '../vendor/xlsx.full.min.js'
);
indexHtml = indexHtml.replace('<body class="auth-locked">', '<body>');
indexHtml = indexHtml.replace(
  '</head>',
  '  <style id="desktop-agency-lock">.agency-gate{display:none!important}</style>\n</head>'
);
indexHtml = indexHtml.replace(
  '<script src="valuation-auth.js"></script>',
  '<script src="valuation-auth.js"></script>\n  <script src="desktop-agency.js"></script>'
);
indexHtml = indexHtml.replace(
  '<title>IP 간이감정 | 명밸류 파트너스</title>',
  `<title>${agency.title}</title>`
);
indexHtml = indexHtml.replaceAll('href="../"', 'href="#" aria-disabled="true"');

if (agencyId === 'kodata') {
  indexHtml = indexHtml.replace('<a class="back-link" href="#" aria-disabled="true">홈으로</a>', '');
}

await writeFile(indexPath, indexHtml, 'utf8');

await writeFile(
  path.join(appDir, 'valuation', 'desktop-agency.js'),
  `document.addEventListener('DOMContentLoaded', () => {\n` +
    `  applyAgency('${agencyId}');\n` +
    `  closeAgencyGate();\n` +
    `  document.getElementById('agencyGate')?.remove();\n` +
    `  document.getElementById('agencySwitchBtn')?.remove();\n` +
    `});\n`,
  'utf8'
);

await writeFile(
  path.join(appDir, 'desktop-config.json'),
  `${JSON.stringify({ agency: agencyId, windowTitle: agency.title, icon: agency.icon, appId: agency.appId }, null, 2)}\n`,
  'utf8'
);

const cssPath = path.join(appDir, 'valuation', 'valuation.css');
let css = await readFile(cssPath, 'utf8');
css = css.replace(/^@import url\([^\n]+\);\s*/u, '');

if (agencyId === 'kodata') {
  css += '\n/* KoDATA desktop-only header */\n' +
    'body[data-agency="kodata"] .valuation-header{background:#fff;border-bottom:1px solid #d9b35f;backdrop-filter:none}\n' +
    'body[data-agency="kodata"] .active-agency-name{color:#374151;border-right:0;padding-right:0}\n';
}

await writeFile(cssPath, css, 'utf8');

console.log(`${agency.name} desktop app resources prepared for offline use.`);
