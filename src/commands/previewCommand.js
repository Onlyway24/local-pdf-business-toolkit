const { validateFolderPath } = require("../validation/validateFolderPath");
const { scanFolder } = require("../core/scanFolder");
const { createOrganizationPlan } = require("../core/createOrganizationPlan");
const { createPreviewPack } = require("../output/createPreviewPack");
const { createPreviewPackReport } = require("../core/createPreviewPackReport");
const { saveReport } = require("../output/saveReport");

function runPreviewCommand(folderPath) {
  const absoluteFolderPath = validateFolderPath(folderPath);
  const scanResult = scanFolder(absoluteFolderPath);
  const plan = createOrganizationPlan(scanResult);
  const previewResult = createPreviewPack(absoluteFolderPath, plan);
  const report = createPreviewPackReport(previewResult);
  const savedPath = saveReport(report, "preview-pack");

  return {
    folderPath: absoluteFolderPath,
    totalFiles: previewResult.totalCopied,
    previewRoot: previewResult.previewRoot,
    savedPath,
  };
}

module.exports = { runPreviewCommand };
