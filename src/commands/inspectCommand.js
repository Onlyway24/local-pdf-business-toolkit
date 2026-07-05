const { validateFolderPath } = require("../validation/validateFolderPath");
const { scanFolder } = require("../core/scanFolder");
const { inspectFolder } = require("../core/inspectFolder");
const { createInspectionReport } = require("../core/createInspectionReport");
const { saveReport } = require("../output/saveReport");

function runInspectCommand(folderPath) {
  const absoluteFolderPath = validateFolderPath(folderPath);
  const scanResult = scanFolder(absoluteFolderPath);
  const inspection = inspectFolder(scanResult);
  const report = createInspectionReport(inspection);
  const savedPath = saveReport(report, "folder-inspection");

  return {
    folderPath: inspection.folderPath,
    totalFiles: inspection.totalFiles,
    status: inspection.status,
    readinessScore: inspection.readinessScore,
    savedPath,
  };
}

module.exports = { runInspectCommand };
