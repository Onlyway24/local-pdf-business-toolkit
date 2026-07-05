const path = require('path');
const { extractPdfText } = require('./extractPdfText');

async function enrichScanWithPdfText(scanResult) {
  if (!scanResult || !Array.isArray(scanResult.files)) {
    return {
      ...scanResult,
      pdfTextExtraction: {
        attempted: 0,
        succeeded: 0,
        failed: 0
      }
    };
  }

  let attempted = 0;
  let succeeded = 0;
  let failed = 0;

  const files = [];

  for (const file of scanResult.files) {
    if (file.extension !== '.pdf') {
      files.push({
        ...file,
        pdfText: null
      });
      continue;
    }

    attempted += 1;

    const pdfPath = file.fullPath || path.join(scanResult.folderPath, file.relativePath);
    const extraction = await extractPdfText(pdfPath);

    if (extraction.success) {
      succeeded += 1;
    } else {
      failed += 1;
    }

    files.push({
      ...file,
      fullPath: pdfPath,
      pdfText: {
        success: extraction.success,
        textPreview: extraction.text ? extraction.text.slice(0, 500).trim() : '',
        pageCount: extraction.pageCount || 0,
        error: extraction.error || null
      }
    });
  }

  return {
    ...scanResult,
    files,
    pdfTextExtraction: {
      attempted,
      succeeded,
      failed
    }
  };
}

module.exports = {
  enrichScanWithPdfText
};
