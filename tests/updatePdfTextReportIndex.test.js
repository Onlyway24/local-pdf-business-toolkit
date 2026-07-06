const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { updatePdfTextReportIndex } = require('../src/core/updatePdfTextReportIndex');

function run() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pdf-report-index-'));
  const indexPath = path.join(tempRoot, 'index.json');

  const result = {
    folderPath: 'samples',
    totalFiles: 4,
    pdfFiles: 3,
    nonPdfFiles: 1,
    status: 'PARTIAL',
    readinessScore: 60,
    pdfTextExtraction: {
      attempted: 3,
      succeeded: 1,
      failed: 2
    },
    files: [
      {
        name: 'readable-contract.pdf',
        relativePath: 'readable-contract.pdf',
        extension: '.pdf',
        pdfText: {
          success: true,
          error: null
        }
      },
      {
        name: 'broken-contract.pdf',
        relativePath: 'broken-contract.pdf',
        extension: '.pdf',
        pdfText: {
          success: false,
          error: 'Invalid PDF structure.'
        }
      },
      {
        name: 'broken-invoice.pdf',
        relativePath: 'nested/broken-invoice.pdf',
        extension: '.pdf',
        pdfText: {
          success: false,
          error: 'Encrypted PDF.'
        }
      },
      {
        name: 'notes.txt',
        relativePath: 'notes.txt',
        extension: '.txt',
        pdfText: null
      }
    ],
    deliveryDecision: {
      decision: 'REVIEW BEFORE DELIVERY'
    }
  };

  const reportPaths = {
    markdownPath: path.join(tempRoot, 'report.md'),
    htmlPath: path.join(tempRoot, 'report.html'),
    jsonPath: path.join(tempRoot, 'report.json')
  };

  const firstUpdate = updatePdfTextReportIndex({
    result,
    reportPaths,
    indexPath
  });

  assert.strictEqual(firstUpdate.indexPath, indexPath);
  assert.strictEqual(firstUpdate.totalReports, 1);
  assert.ok(fs.existsSync(indexPath));

  const firstIndex = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  assert.strictEqual(firstIndex.reports.length, 1);
  assert.strictEqual(firstIndex.reports[0].folderPath, 'samples');
  assert.strictEqual(firstIndex.reports[0].status, 'PARTIAL');
  assert.strictEqual(firstIndex.reports[0].readinessScore, 60);
  assert.strictEqual(firstIndex.reports[0].pdfHealth.attempted, 3);
  assert.strictEqual(firstIndex.reports[0].pdfHealth.succeeded, 1);
  assert.strictEqual(firstIndex.reports[0].pdfHealth.failed, 2);
  assert.deepStrictEqual(firstIndex.reports[0].failedPdfFiles, [
    {
      name: 'broken-contract.pdf',
      relativePath: 'broken-contract.pdf',
      error: 'Invalid PDF structure.'
    },
    {
      name: 'broken-invoice.pdf',
      relativePath: 'nested/broken-invoice.pdf',
      error: 'Encrypted PDF.'
    }
  ]);
  assert.strictEqual(firstIndex.reports[0].deliveryDecision.decision, 'REVIEW BEFORE DELIVERY');
  assert.strictEqual(firstIndex.reports[0].deliveryDecision.reason, '2 of 3 PDF file(s) need manual review before delivery.');
  assert.strictEqual(firstIndex.reports[0].deliveryDecision.requiredAction, 'Review or replace failed PDFs, then regenerate the report before delivery.');
  assert.strictEqual(firstIndex.reports[0].reportPaths.markdownReportPath, reportPaths.markdownPath);
  assert.strictEqual(firstIndex.reports[0].reportPaths.htmlReportPath, reportPaths.htmlPath);
  assert.strictEqual(firstIndex.reports[0].reportPaths.jsonReportPath, reportPaths.jsonPath);

  const secondUpdate = updatePdfTextReportIndex({
    result: {
      ...result,
      status: 'READY',
      readinessScore: 100,
      pdfTextExtraction: {
        attempted: 1,
        succeeded: 1,
        failed: 0
      },
      deliveryDecision: {
        decision: 'READY TO DELIVER'
      }
    },
    reportPaths,
    indexPath
  });

  assert.strictEqual(secondUpdate.totalReports, 2);

  const secondIndex = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  assert.strictEqual(secondIndex.reports.length, 2);
  assert.strictEqual(secondIndex.reports[1].status, 'READY');
  assert.strictEqual(secondIndex.reports[1].deliveryDecision.decision, 'READY TO DELIVER');
  assert.strictEqual(secondIndex.reports[1].deliveryDecision.reason, 'All attempted PDF files were readable.');
  assert.deepStrictEqual(secondIndex.reports[1].failedPdfFiles, []);

  console.log('updatePdfTextReportIndex.test.js passed');
}

run();
