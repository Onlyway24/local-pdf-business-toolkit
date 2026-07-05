const fs = require("fs");
const path = require("path");

function ensureDirectory(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
}

function createPreviewPack(sourceFolderPath, organizationPlan) {
  const previewRoot = path.resolve("outputs", "preview-pack");

  if (fs.existsSync(previewRoot)) {
    fs.rmSync(previewRoot, { recursive: true, force: true });
  }

  ensureDirectory(previewRoot);

  const copiedFiles = [];

  for (const file of organizationPlan.plannedFiles) {
    const sourcePath = path.join(sourceFolderPath, file.originalName);
    const targetFolderPath = path.join(previewRoot, file.targetFolder);
    const targetPath = path.join(targetFolderPath, file.cleanFileName);

    ensureDirectory(targetFolderPath);

    fs.copyFileSync(sourcePath, targetPath);

    copiedFiles.push({
      originalName: file.originalName,
      copiedTo: targetPath,
      documentType: file.documentType,
      needsManualReview: file.needsManualReview,
    });
  }

  return {
    previewRoot,
    totalCopied: copiedFiles.length,
    copiedFiles,
  };
}

module.exports = { createPreviewPack };
