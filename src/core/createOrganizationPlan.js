const { createCleanFileName } = require("./createCleanFileName");
const { getTargetFolder } = require("./getTargetFolder");

function createOrganizationPlan(scanResult) {
  const plannedFiles = scanResult.files.map((file) => {
    const cleanFileName = createCleanFileName(file.name);
    const targetFolder = getTargetFolder(file.documentType);
    const needsManualReview = file.documentType === "Unknown";

    return {
      originalName: file.name,
      cleanFileName,
      documentType: file.documentType,
      currentExtension: file.extension,
      targetFolder,
      proposedPath: targetFolder + "/" + cleanFileName,
      alreadyClean: file.name === cleanFileName,
      needsManualReview,
    };
  });

  return {
    folderPath: scanResult.folderPath,
    totalFiles: scanResult.totalFiles,
    plannedFiles,
  };
}

module.exports = { createOrganizationPlan };
