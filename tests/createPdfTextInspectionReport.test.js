const assert = require('assert');
const { createPdfTextInspectionReport } = require('../src/core/createPdfTextInspectionReport');

function run() {
  const report = createPdfTextInspectionReport({
    folderPath: '/demo/folder',
    totalFiles: 2,
    pdfFiles: 1,
    nonPdfFiles: 1,
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
          textPreview: 'This is a contract preview.',
          error: null
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

  assert.ok(report.includes('# PDF Text Inspection Report'));
  assert.ok(report.includes('Folder: /demo/folder'));
  assert.ok(report.includes('## PDF Health'));
  assert.ok(report.includes('Readable PDFs: 1 / 1'));
  assert.ok(report.includes('Failed PDFs: 0 / 1'));
  assert.ok(report.includes('## Client Delivery Decision'));
  assert.ok(report.includes('Decision: READY TO DELIVER'));
  assert.ok(report.includes('Reason: All attempted PDF files were readable.'));
  assert.ok(report.includes('Required action: Optional final human review before sending client deliverables.'));
  assert.ok(report.includes('## Manual Review Checklist'));
  assert.ok(report.includes('### Needs manual review'));
  assert.ok(report.includes('- None. All attempted PDFs were readable.'));
  assert.ok(report.includes('### Readable PDFs'));
  assert.ok(report.includes('- contract.pdf'));
  assert.ok(report.includes('### Next step'));
  assert.ok(report.includes('Attempted: 1'));
  assert.ok(report.includes('Succeeded: 1'));
  assert.ok(report.includes('### contract.pdf'));
  assert.ok(report.includes('PDF text extraction: success'));
  assert.ok(report.includes('Text preview:'));
  assert.ok(report.includes('This is a contract preview.'));

  console.log('createPdfTextInspectionReport.test.js passed');
}

run();
