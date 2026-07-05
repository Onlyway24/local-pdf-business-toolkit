const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { runCommand, getCommand } = require('../src/commands/commandRouter');

async function run() {
  const command = getCommand('inspect-pdf-text');

  assert.ok(command);
  assert.strictEqual(command.name, 'inspect-pdf-text');

  const execution = await runCommand('inspect-pdf-text', path.resolve('samples'));

  assert.strictEqual(execution.title, 'PDF TEXT INSPECTION COMPLETE');
  assert.strictEqual(execution.result.totalFiles, 3);
  assert.ok(execution.result.pdfTextExtraction);
  assert.strictEqual(execution.result.pdfTextExtraction.attempted, 2);
  assert.strictEqual(
    execution.result.pdfTextExtraction.succeeded + execution.result.pdfTextExtraction.failed,
    2
  );

  assert.ok(execution.result.savedPath);
  assert.ok(execution.result.markdownReportPath);
  assert.ok(execution.result.htmlReportPath);

  assert.ok(fs.existsSync(execution.result.markdownReportPath));
  assert.ok(fs.existsSync(execution.result.htmlReportPath));

  const markdownReport = fs.readFileSync(execution.result.markdownReportPath, 'utf8');
  const htmlReport = fs.readFileSync(execution.result.htmlReportPath, 'utf8');

  assert.ok(markdownReport.includes('# PDF Text Inspection Report'));
  assert.ok(markdownReport.includes('## PDF Text Extraction'));
  assert.ok(markdownReport.includes('## PDF Files'));

  assert.ok(htmlReport.includes('<!doctype html>'));
  assert.ok(htmlReport.includes('PDF Text Inspection Report'));
  assert.ok(htmlReport.includes('PDF Text Extraction'));

  const pdfFiles = execution.result.files.filter((file) => file.extension === '.pdf');
  assert.strictEqual(pdfFiles.length, 2);

  for (const file of pdfFiles) {
    assert.ok(file.pdfText);
    assert.strictEqual(typeof file.pdfText.success, 'boolean');
    assert.strictEqual(typeof file.pdfText.textPreview, 'string');
  }

  console.log('inspectPdfTextCommand.test.js passed');
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
