const fs = require('fs');
const path = require('path');

function readExistingIndex(indexPath) {
  if (!fs.existsSync(indexPath)) {
    return {
      reports: []
    };
  }

  try {
    const raw = fs.readFileSync(indexPath, 'utf8');
    const parsed = JSON.parse(raw);

    if (!parsed || !Array.isArray(parsed.reports)) {
      return {
        reports: []
      };
    }

    return parsed;
  } catch {
    return {
      reports: []
    };
  }
}

function createIndexEntry(result, reportPaths) {
  return {
    generatedAt: new Date().toISOString(),
    folderPath: result.folderPath,
    totalFiles: result.totalFiles,
    pdfFiles: result.pdfFiles,
    nonPdfFiles: result.nonPdfFiles,
    status: result.status,
    readinessScore: result.readinessScore,
    pdfHealth: {
      attempted: result.pdfTextExtraction?.attempted || 0,
      succeeded: result.pdfTextExtraction?.succeeded || 0,
      failed: result.pdfTextExtraction?.failed || 0
    },
    deliveryDecision: result.deliveryDecision?.decision || null,
    reportPaths: {
      markdownReportPath: reportPaths.markdownPath,
      htmlReportPath: reportPaths.htmlPath,
      jsonReportPath: reportPaths.jsonPath
    }
  };
}

function updatePdfTextReportIndex({ result, reportPaths, indexPath }) {
  const resolvedIndexPath = indexPath || path.resolve('outputs', 'reports', 'index.json');
  const index = readExistingIndex(resolvedIndexPath);
  const entry = createIndexEntry(result, reportPaths);

  index.reports.push(entry);

  fs.mkdirSync(path.dirname(resolvedIndexPath), { recursive: true });
  fs.writeFileSync(resolvedIndexPath, JSON.stringify(index, null, 2) + '\n');

  return {
    indexPath: resolvedIndexPath,
    entry,
    totalReports: index.reports.length
  };
}

module.exports = {
  updatePdfTextReportIndex
};
