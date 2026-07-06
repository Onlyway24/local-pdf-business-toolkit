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

function createClientDeliveryDecision(result) {
  const attempted = result.pdfTextExtraction?.attempted || 0;
  const succeeded = result.pdfTextExtraction?.succeeded || 0;
  const failed = result.pdfTextExtraction?.failed || 0;

  if (attempted === 0) {
    return {
      decision: 'NO PDF REVIEW REQUIRED',
      reason: 'No PDF files were found for text inspection.',
      requiredAction: 'Proceed only if PDF text inspection is not required for this delivery.'
    };
  }

  if (failed === 0) {
    return {
      decision: 'READY TO DELIVER',
      reason: 'All attempted PDF files were readable.',
      requiredAction: 'Optional final human review before sending client deliverables.'
    };
  }

  if (succeeded === 0) {
    return {
      decision: 'DO NOT DELIVER YET',
      reason: `${failed} PDF file(s) need manual review before delivery.`,
      requiredAction: 'Replace invalid PDFs or review them manually before sending client deliverables.'
    };
  }

  return {
    decision: 'REVIEW BEFORE DELIVERY',
    reason: `${failed} of ${attempted} PDF file(s) need manual review before delivery.`,
    requiredAction: 'Review or replace failed PDFs, then regenerate the report before delivery.'
  };
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
    deliveryDecision: createClientDeliveryDecision(result),
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
