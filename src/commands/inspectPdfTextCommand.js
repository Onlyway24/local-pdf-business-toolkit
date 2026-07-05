const fs = require('fs');
const path = require('path');
const { scanFolder } = require('../core/scanFolder');
const { inspectFolder } = require('../core/inspectFolder');
const { enrichScanWithPdfText } = require('../core/enrichScanWithPdfText');
const { createPdfTextInspectionReport } = require('../core/createPdfTextInspectionReport');

function createReportPath() {
  const reportsRoot = path.resolve('outputs', 'reports');
  fs.mkdirSync(reportsRoot, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return path.join(reportsRoot, `pdf-text-inspection-${timestamp}.md`);
}

async function runInspectPdfTextCommand(folderPath) {
  const scanResult = scanFolder(folderPath);
  const enrichedScan = await enrichScanWithPdfText(scanResult);
  const inspection = inspectFolder(enrichedScan);

  const result = {
    ...inspection,
    files: enrichedScan.files,
    pdfTextExtraction: enrichedScan.pdfTextExtraction
  };

  const report = createPdfTextInspectionReport(result);
  const savedPath = createReportPath();

  fs.writeFileSync(savedPath, report);

  return {
    ...result,
    savedPath
  };
}

module.exports = {
  runInspectPdfTextCommand
};
