const assert = require('assert');
const { createPdfTextInspectionHtmlReport } = require('../src/core/createPdfTextInspectionHtmlReport');

function run() {
  const html = createPdfTextInspectionHtmlReport({
    folderPath: '/demo/folder',
    totalFiles: 1,
    pdfFiles: 1,
    nonPdfFiles: 0,
    status: 'READY',
    readinessScore: 100,
    pdfTextExtraction: {
      attempted: 1,
      succeeded: 1,
      failed: 0
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
          textPreview: 'Real PDF extraction fixture',
          error: null
        }
      }
    ]
  });

  assert.ok(html.includes('<!doctype html>'));
  assert.ok(html.includes('PDF Text Inspection Report'));
  assert.ok(html.includes('/demo/folder'));
  assert.ok(html.includes('contract.pdf'));
  assert.ok(html.includes('Real PDF extraction fixture'));
  assert.ok(html.includes('success'));

  const escaped = createPdfTextInspectionHtmlReport({
    folderPath: '<script>alert(1)</script>',
    totalFiles: 0,
    pdfFiles: 0,
    nonPdfFiles: 0,
    status: 'EMPTY',
    readinessScore: 0,
    pdfTextExtraction: { attempted: 0, succeeded: 0, failed: 0 },
    files: []
  });

  assert.ok(!escaped.includes('<script>alert(1)</script>'));
  assert.ok(escaped.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));

  console.log('createPdfTextInspectionHtmlReport.test.js passed');
}

run();
