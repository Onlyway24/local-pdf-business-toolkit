const { runClientPackCommand } = require("./clientPackCommand");
const { createZipFromFolder } = require("../output/createZipFromFolder");
const { saveReport } = require("../output/saveReport");

function runFullDemoCommand(folderPath, clientName) {
  const clientPackResult = runClientPackCommand(folderPath, clientName);
  const zipResult = createZipFromFolder(clientPackResult.clientPackRoot);

  const report = [
    "# LOCAL PDF BUSINESS TOOLKIT - FULL DEMO",
    "",
    "Source folder:",
    clientPackResult.folderPath,
    "",
    "Client pack folder:",
    clientPackResult.clientPackRoot,
    "",
    "ZIP file:",
    zipResult.zipPath,
    "",
    "Status: " + clientPackResult.status,
    "Readiness score: " + clientPackResult.readinessScore + "%",
  ].join("\n");

  const savedPath = saveReport(report, "full-demo");

  return {
    folderPath: clientPackResult.folderPath,
    totalFiles: clientPackResult.totalFiles,
    status: clientPackResult.status,
    readinessScore: clientPackResult.readinessScore,
    clientPackRoot: clientPackResult.clientPackRoot,
    zipPath: zipResult.zipPath,
    savedPath,
  };
}

module.exports = { runFullDemoCommand };
