const assert = require('assert');
const path = require('path');
const { extractPdfText } = require('../src/core/extractPdfText');

async function run() {
  const nonPdfResult = await extractPdfText(path.join(__dirname, 'fixtures', 'not-a-pdf.txt'));

  assert.strictEqual(nonPdfResult.success, false);
  assert.strictEqual(nonPdfResult.text, '');
  assert.strictEqual(nonPdfResult.error, 'File is not a PDF');

  const missingResult = await extractPdfText(path.join(__dirname, 'fixtures', 'missing.pdf'));

  assert.strictEqual(missingResult.success, false);
  assert.strictEqual(missingResult.text, '');
  assert.strictEqual(missingResult.error, 'File does not exist');

  const fakePdfResult = await extractPdfText(path.resolve('samples/cliente-contratto.pdf'));

  assert.strictEqual(fakePdfResult.success, false);
  assert.strictEqual(fakePdfResult.text, '');
  assert.strictEqual(fakePdfResult.pageCount, 0);
  assert.ok(fakePdfResult.error);

  console.log('extractPdfText.test.js passed');
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
