import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const desktopDir = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(desktopDir, '..');
const appDir = path.join(desktopDir, 'app');

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
indexHtml = indexHtml.replaceAll('href="../"', 'href="#" aria-disabled="true"');
await writeFile(indexPath, indexHtml, 'utf8');

const cssPath = path.join(appDir, 'valuation', 'valuation.css');
let css = await readFile(cssPath, 'utf8');
css = css.replace(/^@import url\([^\n]+\);\s*/u, '');
await writeFile(cssPath, css, 'utf8');

console.log('Desktop app resources prepared for offline use.');
