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
  assert.ok(html.includes('status-badge status-ready'));
  assert.ok(html.includes('<span class="status-badge status-ready">READY</span>'));
  assert.ok(html.includes('Executive Summary'));
  assert.ok(html.includes('Recommended action'));
  assert.ok(html.includes('PDF Health'));
  assert.ok(html.includes('Readable PDFs:</strong> 1 / 1'));
  assert.ok(html.includes('Failed PDFs:</strong> 0 / 1'));
  assert.ok(html.includes('Client Delivery Decision'));
  assert.ok(html.includes('READY TO DELIVER'));
  assert.ok(html.includes('All attempted PDF files were readable.'));
  assert.ok(html.includes('Optional final human review before sending client deliverables.'));
  assert.ok(html.includes('Manual Review Checklist'));
  assert.ok(html.includes('Needs manual review'));
  assert.ok(html.includes('None. All attempted PDFs were readable.'));
  assert.ok(html.includes('Readable PDFs'));
  assert.ok(html.includes('This folder is ready for review'));
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

  const failedHtml = createPdfTextInspectionHtmlReport({
    folderPath: '/failed/folder',
    totalFiles: 2,
    pdfFiles: 2,
    nonPdfFiles: 0,
    status: 'READY',
    readinessScore: 100,
    pdfTextExtraction: {
      attempted: 2,
      succeeded: 0,
      failed: 2
    },
    files: []
  });

  assert.ok(failedHtml.includes('This folder needs review'));
  assert.ok(failedHtml.includes('status-badge status-ready'));
  assert.ok(failedHtml.includes('Readable PDFs:</strong> 0 / 2'));
  assert.ok(failedHtml.includes('Failed PDFs:</strong> 2 / 2'));
  assert.ok(failedHtml.includes('Replace invalid PDFs with real readable PDF files'));
  assert.ok(failedHtml.includes('Client Delivery Decision'));
  assert.ok(failedHtml.includes('DO NOT DELIVER YET'));
  assert.ok(failedHtml.includes('2 PDF file(s) need manual review before delivery.'));
  assert.ok(failedHtml.includes('Replace invalid PDFs or review them manually before sending client deliverables.'));
  assert.ok(failedHtml.includes('Manual Review Checklist'));
  assert.ok(failedHtml.includes('Readable PDFs'));

  const partialHtml = createPdfTextInspectionHtmlReport({
    folderPath: '/partial/folder',
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
    files: []
  });

  assert.ok(partialHtml.includes('<span class="status-badge status-partial">PARTIAL</span>'));
  assert.ok(partialHtml.includes('REVIEW BEFORE DELIVERY'));
  assert.ok(partialHtml.includes('2 of 3 PDF file(s) need manual review before delivery.'));
  assert.ok(partialHtml.includes('Review or replace failed PDFs, then regenerate the report before delivery.'));

  const needsReviewHtml = createPdfTextInspectionHtmlReport({
    folderPath: '/needs-review/folder',
    totalFiles: 2,
    pdfFiles: 2,
    nonPdfFiles: 0,
    status: 'NEEDS REVIEW',
    readinessScore: 0,
    pdfTextExtraction: {
      attempted: 2,
      succeeded: 0,
      failed: 2
    },
    files: []
  });

  assert.ok(needsReviewHtml.includes('<span class="status-badge status-needs-review">NEEDS REVIEW</span>'));

  console.log('createPdfTextInspectionHtmlReport.test.js passed');
}

run();
