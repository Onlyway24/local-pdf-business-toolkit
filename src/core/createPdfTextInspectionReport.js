function createPdfTextInspectionReport(result) {
  const lines = [];

  lines.push('# PDF Text Inspection Report');
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`Folder: ${result.folderPath}`);
  lines.push(`Total files: ${result.totalFiles}`);
  lines.push(`PDF files: ${result.pdfFiles}`);
  lines.push(`Non-PDF files: ${result.nonPdfFiles}`);
  lines.push(`Status: ${result.status}`);
  lines.push(`Readiness score: ${result.readinessScore}%`);
  lines.push('');

  const attempted = result.pdfTextExtraction?.attempted || 0;
  const succeeded = result.pdfTextExtraction?.succeeded || 0;
  const failed = result.pdfTextExtraction?.failed || 0;

  lines.push('## PDF Health');
  lines.push('');
  lines.push(`Readable PDFs: ${succeeded} / ${attempted}`);
  lines.push(`Failed PDFs: ${failed} / ${attempted}`);
  lines.push('');

  const pdfFiles = result.files.filter((file) => file.extension === '.pdf');
  const readablePdfFiles = pdfFiles.filter((file) => file.pdfText?.success);
  const failedPdfFiles = pdfFiles.filter((file) => !file.pdfText?.success);

  lines.push('## Manual Review Checklist');
  lines.push('');

  if (failedPdfFiles.length === 0 && readablePdfFiles.length === 0) {
    lines.push('No PDF files were found for review.');
    lines.push('');
  } else {
    lines.push('### Needs manual review');
    lines.push('');

    if (failedPdfFiles.length === 0) {
      lines.push('- None. All attempted PDFs were readable.');
    } else {
      failedPdfFiles.forEach((file) => {
        const error = file.pdfText?.error ? ` — ${file.pdfText.error}` : '';
        lines.push(`- ${file.relativePath}${error}`);
      });
    }

    lines.push('');
    lines.push('### Readable PDFs');
    lines.push('');

    if (readablePdfFiles.length === 0) {
      lines.push('- None.');
    } else {
      readablePdfFiles.forEach((file) => {
        lines.push(`- ${file.relativePath}`);
      });
    }

    lines.push('');
    lines.push('### Next step');
    lines.push('');

    if (failedPdfFiles.length === 0) {
      lines.push('Proceed with the client pack or review the extracted text before delivery.');
    } else {
      lines.push('Review or replace failed PDFs before sending client deliverables.');
    }

    lines.push('');
  }

  lines.push('## PDF Text Extraction');
  lines.push('');
  lines.push(`Attempted: ${attempted}`);
  lines.push(`Succeeded: ${succeeded}`);
  lines.push(`Failed: ${failed}`);
  lines.push('');

  lines.push('## PDF Files');
  lines.push('');

  const pdfFiles = result.files.filter((file) => file.extension === '.pdf');

  if (pdfFiles.length === 0) {
    lines.push('No PDF files found.');
    lines.push('');
  }

  for (const file of pdfFiles) {
    lines.push(`### ${file.relativePath}`);
    lines.push('');
    lines.push(`Document type: ${file.documentType}`);
    lines.push(`Size in bytes: ${file.sizeInBytes}`);

    if (!file.pdfText) {
      lines.push('PDF text extraction: not available');
      lines.push('');
      continue;
    }

    lines.push(`PDF text extraction: ${file.pdfText.success ? 'success' : 'failed'}`);
    lines.push(`Page count: ${file.pdfText.pageCount}`);

    if (file.pdfText.error) {
      lines.push(`Error: ${file.pdfText.error}`);
    }

    if (file.pdfText.textPreview) {
      lines.push('');
      lines.push('Text preview:');
      lines.push('');
      lines.push('```text');
      lines.push(file.pdfText.textPreview);
      lines.push('```');
    } else {
      lines.push('');
      lines.push('Text preview: not available');
    }

    lines.push('');
  }

  return lines.join('\n');
}

module.exports = {
  createPdfTextInspectionReport
};
