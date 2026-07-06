function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function createExecutiveSummary(result) {
  const attempted = result.pdfTextExtraction?.attempted || 0;
  const succeeded = result.pdfTextExtraction?.succeeded || 0;
  const failed = result.pdfTextExtraction?.failed || 0;

  if (attempted === 0) {
    return 'No PDF files were found in this folder. The folder can still be organized, but there is no PDF text to inspect.';
  }

  if (failed === 0) {
    return `This folder is ready for review. All ${attempted} PDF file(s) were readable and text extraction completed successfully.`;
  }

  if (succeeded === 0) {
    return `This folder needs review. ${attempted} PDF file(s) were checked, but none could be read successfully. The files may be invalid, scanned, corrupted, or placeholders.`;
  }

  return `This folder is partially ready. ${succeeded} of ${attempted} PDF file(s) were readable, while ${failed} need manual review.`;
}

function createRecommendedAction(result) {
  const attempted = result.pdfTextExtraction?.attempted || 0;
  const succeeded = result.pdfTextExtraction?.succeeded || 0;
  const failed = result.pdfTextExtraction?.failed || 0;

  if (attempted === 0) {
    return 'Add PDF files if text inspection is required.';
  }

  if (failed === 0) {
    return 'Proceed with the client pack or review the extracted text before delivery.';
  }

  if (succeeded === 0) {
    return 'Replace invalid PDFs with real readable PDF files, or review them manually before sending client deliverables.';
  }

  return 'Review the failed PDFs manually and continue with the readable documents.';
}

function createPdfTextInspectionHtmlReport(result) {
  const pdfFiles = result.files.filter((file) => file.extension === '.pdf');

  const pdfSections = pdfFiles.length === 0
    ? '<p>No PDF files found.</p>'
    : pdfFiles.map((file) => {
        const extractionStatus = file.pdfText?.success ? 'success' : 'failed';
        const textPreview = file.pdfText?.textPreview
          ? `<pre>${escapeHtml(file.pdfText.textPreview)}</pre>`
          : '<p>Text preview: not available</p>';

        const error = file.pdfText?.error
          ? `<p><strong>Error:</strong> ${escapeHtml(file.pdfText.error)}</p>`
          : '';

        return `
          <section class="file-card">
            <h3>${escapeHtml(file.relativePath)}</h3>
            <p><strong>Document type:</strong> ${escapeHtml(file.documentType)}</p>
            <p><strong>Size in bytes:</strong> ${escapeHtml(file.sizeInBytes)}</p>
            <p><strong>PDF text extraction:</strong> <span class="${extractionStatus}">${extractionStatus}</span></p>
            <p><strong>Page count:</strong> ${escapeHtml(file.pdfText?.pageCount || 0)}</p>
            ${error}
            ${textPreview}
          </section>
        `;
      }).join('\n');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>PDF Text Inspection Report</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 40px;
      background: #f6f7f9;
      color: #1f2937;
    }
    .container {
      max-width: 980px;
      margin: 0 auto;
    }
    .summary, .file-card {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
    }
    h1, h2, h3 {
      margin-top: 0;
    }
    .success {
      color: #0f766e;
      font-weight: bold;
    }
    .failed {
      color: #b91c1c;
      font-weight: bold;
    }
    pre {
      white-space: pre-wrap;
      background: #111827;
      color: #f9fafb;
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
    }
  </style>
</head>
<body>
  <main class="container">
    <h1>PDF Text Inspection Report</h1>

    <section class="summary">
      <h2>Executive Summary</h2>
      <p>${escapeHtml(createExecutiveSummary(result))}</p>
      <p><strong>Recommended action:</strong> ${escapeHtml(createRecommendedAction(result))}</p>
    </section>

    <section class="summary">
      <h2>Summary</h2>
      <p><strong>Folder:</strong> ${escapeHtml(result.folderPath)}</p>
      <p><strong>Total files:</strong> ${escapeHtml(result.totalFiles)}</p>
      <p><strong>PDF files:</strong> ${escapeHtml(result.pdfFiles)}</p>
      <p><strong>Non-PDF files:</strong> ${escapeHtml(result.nonPdfFiles)}</p>
      <p><strong>Status:</strong> ${escapeHtml(result.status)}</p>
      <p><strong>Readiness score:</strong> ${escapeHtml(result.readinessScore)}%</p>
    </section>

    <section class="summary">
      <h2>PDF Text Extraction</h2>
      <p><strong>Attempted:</strong> ${escapeHtml(result.pdfTextExtraction?.attempted || 0)}</p>
      <p><strong>Succeeded:</strong> ${escapeHtml(result.pdfTextExtraction?.succeeded || 0)}</p>
      <p><strong>Failed:</strong> ${escapeHtml(result.pdfTextExtraction?.failed || 0)}</p>
    </section>

    <h2>PDF Files</h2>
    ${pdfSections}
  </main>
</body>
</html>`;
}

module.exports = {
  createPdfTextInspectionHtmlReport
};
