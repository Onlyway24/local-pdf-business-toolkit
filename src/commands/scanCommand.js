const { validateFolderPath } = require("../validation/validateFolderPath");
const { scanFolder } = require("../core/scanFolder");
const { createReport } = require("../core/createReport");
const { saveReport } = require("../output/saveReport");

function runScanCommand(folderPath) {
  const absoluteFolderPath = validateFolderPath(folderPath);
  const scanResult = scanFolder(absoluteFolderPath);
  const report = createReport(scanResult);
  const savedPath = saveReport(report);

  return {
    folderPath: scanResult.folderPath,
    totalFiles: scanResult.totalFiles,
    savedPath,
  };
}

module.exports = { runScanCommand };
