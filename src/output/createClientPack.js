const fs = require("fs");
const path = require("path");

function ensureDirectory(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
}

function createUniqueFilePath(targetPath) {
  if (!fs.existsSync(targetPath)) {
    return targetPath;
  }

  const directory = path.dirname(targetPath);
  const extension = path.extname(targetPath);
  const baseName = path.basename(targetPath, extension);

  let counter = 2;

  while (true) {
    const candidatePath = path.join(directory, baseName + "-" + counter + extension);

    if (!fs.existsSync(candidatePath)) {
      return candidatePath;
    }

    counter += 1;
  }
}

function createClientPack({
  sourceFolderPath,
  organizationPlan,
  inspectionReport,
  organizationPlanReport,
  readmeContent,
}) {
  const clientPackRoot = path.resolve("outputs", "client-pack");
  const documentsRoot = path.join(clientPackRoot, "documents");
  const reportsRoot = path.join(clientPackRoot, "reports");

  if (fs.existsSync(clientPackRoot)) {
    fs.rmSync(clientPackRoot, { recursive: true, force: true });
  }

  ensureDirectory(documentsRoot);
  ensureDirectory(reportsRoot);

  const copiedFiles = [];

  for (const file of organizationPlan.plannedFiles) {
    const sourcePath = path.join(sourceFolderPath, file.originalName);
    const targetFolderPath = path.join(documentsRoot, file.targetFolder);
    const preferredTargetPath = path.join(targetFolderPath, file.cleanFileName);

    ensureDirectory(targetFolderPath);

    const targetPath = createUniqueFilePath(preferredTargetPath);
    fs.copyFileSync(sourcePath, targetPath);

    copiedFiles.push({
      originalName: file.originalName,
      documentType: file.documentType,
      needsManualReview: file.needsManualReview,
      copiedTo: targetPath,
      relativePackPath: path.relative(clientPackRoot, targetPath),
    });
  }

  fs.writeFileSync(path.join(clientPackRoot, "README.md"), readmeContent, "utf8");
  fs.writeFileSync(path.join(reportsRoot, "inspection.md"), inspectionReport, "utf8");
  fs.writeFileSync(path.join(reportsRoot, "organization-plan.md"), organizationPlanReport, "utf8");

  return {
    clientPackRoot,
    totalCopied: copiedFiles.length,
    copiedFiles,
  };
}

module.exports = { createClientPack };
