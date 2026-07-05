const assert = require('assert');
const path = require('path');
const { scanFolder } = require('../src/core/scanFolder');
const { enrichScanWithPdfText } = require('../src/core/enrichScanWithPdfText');

async function run() {
  const samplePath = path.resolve('samples');
  const scanResult = scanFolder(samplePath);
  const enriched = await enrichScanWithPdfText(scanResult);

  assert.strictEqual(enriched.folderPath, scanResult.folderPath);
  assert.strictEqual(enriched.totalFiles, scanResult.totalFiles);
  assert.strictEqual(enriched.files.length, scanResult.files.length);

  assert.ok(enriched.pdfTextExtraction);
  assert.strictEqual(enriched.pdfTextExtraction.attempted, 2);
  assert.strictEqual(
    enriched.pdfTextExtraction.succeeded + enriched.pdfTextExtraction.failed,
    2
  );

  const pdfFiles = enriched.files.filter((file) => file.extension === '.pdf');
  const nonPdfFiles = enriched.files.filter((file) => file.extension !== '.pdf');

  assert.strictEqual(pdfFiles.length, 2);
  assert.strictEqual(nonPdfFiles.length, 1);

  for (const file of pdfFiles) {
    assert.ok(file.pdfText);
    assert.strictEqual(typeof file.pdfText.success, 'boolean');
    assert.strictEqual(typeof file.pdfText.textPreview, 'string');
    assert.strictEqual(typeof file.pdfText.pageCount, 'number');
  }

  for (const file of nonPdfFiles) {
    assert.strictEqual(file.pdfText, null);
  }

  console.log('enrichScanWithPdfText.test.js passed');
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
