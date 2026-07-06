const assert = require('assert');
const { createPdfTextInspectionJsonReport } = require('../src/core/createPdfTextInspectionJsonReport');

function run() {
  const json = createPdfTextInspectionJsonReport({
    folderPath: '/demo/folder',
    totalFiles: 3,
    pdfFiles: 2,
    nonPdfFiles: 1,
    status: 'PARTIAL',
    readinessScore: 60,
    pdfTextExtraction: {
      attempted: 2,
      succeeded: 1,
      failed: 1
    },
    files: [
      {
        relativePath: 'contract.pdf',
        extension: '.pdf',
        documentType: 'Contract',
        sizeInBytes: 1234,
        pdfText: {
          success: true,
          pageCount: 1,
          textPreview: 'Readable contract preview',
          error: null
        }
      },
      {
        relativePath: 'broken.pdf',
        extension: '.pdf',
        documentType: 'Unknown',
        sizeInBytes: 22,
        pdfText: {
          success: false,
          pageCount: 0,
          textPreview: '',
          error: 'Invalid PDF structure.'
        }
      },
      {
        relativePath: 'notes.txt',
        extension: '.txt',
        documentType: 'Unknown',
        sizeInBytes: 100,
        pdfText: null
      }
    ]
  });

  const report = JSON.parse(json);

  assert.ok(report.generatedAt);
  assert.strictEqual(report.summary.folderPath, '/demo/folder');
  assert.strictEqual(report.summary.status, 'PARTIAL');
  assert.strictEqual(report.summary.readinessScore, 60);

  assert.strictEqual(report.pdfHealth.attempted, 2);
  assert.strictEqual(report.pdfHealth.succeeded, 1);
  assert.strictEqual(report.pdfHealth.failed, 1);

  assert.strictEqual(report.deliveryDecision.decision, 'REVIEW BEFORE DELIVERY');
  assert.ok(report.deliveryDecision.reason.includes('1 of 2 PDF file(s)'));
  assert.ok(report.deliveryDecision.requiredAction.includes('Review or replace failed PDFs'));

  assert.strictEqual(report.manualReview.failedPdfFiles.length, 1);
  assert.strictEqual(report.manualReview.failedPdfFiles[0].relativePath, 'broken.pdf');
  assert.strictEqual(report.manualReview.failedPdfFiles[0].error, 'Invalid PDF structure.');

  assert.strictEqual(report.manualReview.readablePdfFiles.length, 1);
  assert.strictEqual(report.manualReview.readablePdfFiles[0].relativePath, 'contract.pdf');

  assert.strictEqual(report.files.length, 3);

  console.log('createPdfTextInspectionJsonReport.test.js passed');
}

run();
