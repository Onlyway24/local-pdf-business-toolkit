const fs = require('fs');
const path = require('path');
const { scanFolder } = require('../core/scanFolder');
const { inspectFolder } = require('../core/inspectFolder');
const { enrichScanWithPdfText } = require('../core/enrichScanWithPdfText');
const { createPdfTextInspectionReport } = require('../core/createPdfTextInspectionReport');
const { createPdfTextInspectionHtmlReport } = require('../core/createPdfTextInspectionHtmlReport');

function createReportPaths() {
  const reportsRoot = path.resolve('outputs', 'reports');
  fs.mkdirSync(reportsRoot, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

  return {
    markdownPath: path.join(reportsRoot, `pdf-text-inspection-${timestamp}.md`),
    htmlPath: path.join(reportsRoot, `pdf-text-inspection-${timestamp}.html`)
  };
}

function applyPdfTextReadiness(inspection, pdfTextExtraction) {
  if (!pdfTextExtraction || pdfTextExtraction.attempted === 0 || pdfTextExtraction.failed === 0) {
    return inspection;
  }

  if (pdfTextExtraction.succeeded === 0) {
    return {
      ...inspection,
      status: 'NEEDS REVIEW',
      readinessScore: 0
    };
  }

  return {
    ...inspection,
    status: 'PARTIAL',
    readinessScore: Math.min(inspection.readinessScore, 60)
  };
}

async function runInspectPdfTextCommand(folderPath) {
  const scanResult = scanFolder(folderPath);
  const enrichedScan = await enrichScanWithPdfText(scanResult);
  const baseInspection = inspectFolder(enrichedScan);
  const inspection = applyPdfTextReadiness(baseInspection, enrichedScan.pdfTextExtraction);

  const result = {
    ...inspection,
    files: enrichedScan.files,
    pdfTextExtraction: enrichedScan.pdfTextExtraction
  };

  const markdownReport = createPdfTextInspectionReport(result);
  const htmlReport = createPdfTextInspectionHtmlReport(result);
  const reportPaths = createReportPaths();

  fs.writeFileSync(reportPaths.markdownPath, markdownReport);
  fs.writeFileSync(reportPaths.htmlPath, htmlReport);

  return {
    ...result,
    savedPath: reportPaths.markdownPath,
    markdownReportPath: reportPaths.markdownPath,
    htmlReportPath: reportPaths.htmlPath
  };
}

module.exports = {
  runInspectPdfTextCommand
};
