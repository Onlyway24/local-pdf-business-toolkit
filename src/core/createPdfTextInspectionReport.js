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

  lines.push('## PDF Text Extraction');
  lines.push('');
  lines.push(`Attempted: ${result.pdfTextExtraction?.attempted || 0}`);
  lines.push(`Succeeded: ${result.pdfTextExtraction?.succeeded || 0}`);
  lines.push(`Failed: ${result.pdfTextExtraction?.failed || 0}`);
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
