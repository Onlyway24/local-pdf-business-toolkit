const { validateFolderPath } = require("../validation/validateFolderPath");
const { scanFolder } = require("../core/scanFolder");
const { createOrganizationPlan } = require("../core/createOrganizationPlan");
const { createPlanReport } = require("../core/createPlanReport");
const { saveReport } = require("../output/saveReport");

function runPlanCommand(folderPath) {
  const absoluteFolderPath = validateFolderPath(folderPath);
  const scanResult = scanFolder(absoluteFolderPath);
  const plan = createOrganizationPlan(scanResult);
  const report = createPlanReport(plan);
  const savedPath = saveReport(report, "organization-plan");

  return {
    folderPath: plan.folderPath,
    totalFiles: plan.totalFiles,
    savedPath,
  };
}

module.exports = { runPlanCommand };
