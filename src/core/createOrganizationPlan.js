const path = require("path");
const { createCleanFileName } = require("./createCleanFileName");
const { getTargetFolder } = require("./getTargetFolder");

function createOrganizationPlan(scanResult) {
  const plannedFiles = scanResult.files.map((file) => {
    const cleanFileName = createCleanFileName(file.name);
    const targetFolder = getTargetFolder(file.documentType);
    const proposedPath = path.join(targetFolder, cleanFileName);

    return {
      originalName: file.name,
      sourceRelativePath: file.relativePath || file.name,
      documentType: file.documentType,
      cleanFileName,
      targetFolder,
      proposedPath,
      needsManualReview: file.documentType === "Unknown",
    };
  });

  return {
    folderPath: scanResult.folderPath,
    totalFiles: scanResult.totalFiles,
    plannedFiles,
  };
}

module.exports = { createOrganizationPlan };
