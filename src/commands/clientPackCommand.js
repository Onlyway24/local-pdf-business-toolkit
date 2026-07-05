const fs = require("fs");
const path = require("path");
const { validateFolderPath } = require("../validation/validateFolderPath");
const { scanFolder } = require("../core/scanFolder");
const { inspectFolder } = require("../core/inspectFolder");
const { createInspectionReport } = require("../core/createInspectionReport");
const { createOrganizationPlan } = require("../core/createOrganizationPlan");
const { createPlanReport } = require("../core/createPlanReport");
const { createClientPackReadme } = require("../core/createClientPackReadme");
const { createClientPack } = require("../output/createClientPack");
const { saveReport } = require("../output/saveReport");

function runClientPackCommand(folderPath, clientName) {
  const absoluteFolderPath = validateFolderPath(folderPath);

  const scanResult = scanFolder(absoluteFolderPath);
  const inspection = inspectFolder(scanResult);
  const organizationPlan = createOrganizationPlan(scanResult);

  const inspectionReport = createInspectionReport(inspection);
  const organizationPlanReport = createPlanReport(organizationPlan);

  const initialReadmeContent = createClientPackReadme({
    sourceFolderPath: absoluteFolderPath,
    inspection,
    copiedFiles: [],
  });

  const clientPackResult = createClientPack({
    sourceFolderPath: absoluteFolderPath,
    organizationPlan,
    inspectionReport,
    organizationPlanReport,
    readmeContent: initialReadmeContent,
    clientName,
  });

  const finalReadmeContent = createClientPackReadme({
    sourceFolderPath: absoluteFolderPath,
    inspection,
    copiedFiles: clientPackResult.copiedFiles,
  });

  fs.writeFileSync(
    path.join(clientPackResult.clientPackRoot, "README.md"),
    finalReadmeContent,
    "utf8"
  );

  const summaryReport = [
    "# LOCAL PDF BUSINESS TOOLKIT - CLIENT PACK",
    "",
    "Client pack folder:",
    clientPackResult.clientPackRoot,
    "",
    "Files copied: " + clientPackResult.totalCopied,
    "Status: " + inspection.status,
    "Readiness score: " + inspection.readinessScore + "%",
  ].join("\n");

  const savedPath = saveReport(summaryReport, "client-pack");

  return {
    folderPath: absoluteFolderPath,
    totalFiles: clientPackResult.totalCopied,
    status: inspection.status,
    readinessScore: inspection.readinessScore,
    clientPackRoot: clientPackResult.clientPackRoot,
    savedPath,
  };
}

module.exports = { runClientPackCommand };
