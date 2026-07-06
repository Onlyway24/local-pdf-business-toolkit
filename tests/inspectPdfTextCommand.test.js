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
  assert.strictEqual(execution.result.totalFiles, 4);
  assert.strictEqual(execution.result.status, 'PARTIAL');
  assert.strictEqual(execution.result.readinessScore, 60);
  assert.ok(execution.result.pdfTextExtraction);
  assert.strictEqual(execution.result.pdfTextExtraction.attempted, 3);
  assert.strictEqual(
    execution.result.pdfTextExtraction.succeeded + execution.result.pdfTextExtraction.failed,
    3
  );

  assert.ok(execution.result.savedPath);
  assert.ok(execution.result.markdownReportPath);
  assert.ok(execution.result.htmlReportPath);
  assert.ok(execution.result.jsonReportPath);
  assert.ok(execution.result.reportIndexPath);

  assert.ok(fs.existsSync(execution.result.markdownReportPath));
  assert.ok(fs.existsSync(execution.result.htmlReportPath));
  assert.ok(fs.existsSync(execution.result.jsonReportPath));
  assert.ok(fs.existsSync(execution.result.reportIndexPath));

  const markdownReport = fs.readFileSync(execution.result.markdownReportPath, 'utf8');
  const htmlReport = fs.readFileSync(execution.result.htmlReportPath, 'utf8');
  const jsonReport = JSON.parse(fs.readFileSync(execution.result.jsonReportPath, 'utf8'));
  const reportIndex = JSON.parse(fs.readFileSync(execution.result.reportIndexPath, 'utf8'));

  assert.ok(markdownReport.includes('# PDF Text Inspection Report'));
  assert.ok(markdownReport.includes('Status: PARTIAL'));
  assert.ok(markdownReport.includes('Readiness score: 60%'));
  assert.ok(markdownReport.includes('## PDF Text Extraction'));
  assert.ok(markdownReport.includes('## PDF Files'));

  assert.ok(htmlReport.includes('<!doctype html>'));
  assert.ok(htmlReport.includes('PDF Text Inspection Report'));
  assert.ok(htmlReport.includes('<span class="status-badge status-partial">PARTIAL</span>'));
  assert.ok(htmlReport.includes('Readiness score:</strong> 60%'));
  assert.ok(htmlReport.includes('PDF Text Extraction'));

  assert.strictEqual(jsonReport.summary.status, 'PARTIAL');
  assert.strictEqual(jsonReport.summary.readinessScore, 60);
  assert.strictEqual(jsonReport.pdfHealth.attempted, 3);
  assert.strictEqual(jsonReport.pdfHealth.succeeded + jsonReport.pdfHealth.failed, 3);
  assert.strictEqual(jsonReport.deliveryDecision.decision, 'REVIEW BEFORE DELIVERY');
  assert.ok(Array.isArray(jsonReport.manualReview.failedPdfFiles));
  assert.ok(Array.isArray(jsonReport.manualReview.readablePdfFiles));
  assert.ok(Array.isArray(reportIndex.reports));
  assert.ok(reportIndex.reports.length >= 1);
  assert.strictEqual(reportIndex.reports[reportIndex.reports.length - 1].status, 'PARTIAL');
  assert.ok(reportIndex.reports[reportIndex.reports.length - 1].reportPaths.jsonReportPath.endsWith('.json'));

  const pdfFiles = execution.result.files.filter((file) => file.extension === '.pdf');
  assert.strictEqual(pdfFiles.length, 3);

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
