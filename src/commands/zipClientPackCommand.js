const { createZipFromFolder } = require("../output/createZipFromFolder");
const { saveReport } = require("../output/saveReport");

function runZipClientPackCommand(folderPath) {
  const result = createZipFromFolder(folderPath);

  const report = [
    "# LOCAL PDF BUSINESS TOOLKIT - ZIP CLIENT PACK",
    "",
    "Source folder:",
    result.sourceFolder,
    "",
    "ZIP created:",
    result.zipPath,
  ].join("\n");

  const savedPath = saveReport(report, "zip-client-pack");

  return {
    folderPath: result.sourceFolder,
    totalFiles: 1,
    zipPath: result.zipPath,
    savedPath,
  };
}

module.exports = { runZipClientPackCommand };
