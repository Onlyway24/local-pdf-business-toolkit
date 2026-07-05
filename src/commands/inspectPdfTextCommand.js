const { scanFolder } = require('../core/scanFolder');
const { inspectFolder } = require('../core/inspectFolder');
const { enrichScanWithPdfText } = require('../core/enrichScanWithPdfText');

async function runInspectPdfTextCommand(folderPath) {
  const scanResult = scanFolder(folderPath);
  const enrichedScan = await enrichScanWithPdfText(scanResult);
  const inspection = inspectFolder(enrichedScan);

  return {
    ...inspection,
    files: enrichedScan.files,
    pdfTextExtraction: enrichedScan.pdfTextExtraction
  };
}

module.exports = {
  runInspectPdfTextCommand
};
