const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const { AppError } = require("../errors/AppError");

function createZipFromFolder(folderPath) {
  const absoluteFolderPath = path.resolve(folderPath);

  if (!fs.existsSync(absoluteFolderPath)) {
    throw new AppError("Folder not found: " + absoluteFolderPath, "FOLDER_NOT_FOUND");
  }

  const stats = fs.statSync(absoluteFolderPath);

  if (!stats.isDirectory()) {
    throw new AppError("Path is not a folder: " + absoluteFolderPath, "NOT_A_FOLDER");
  }

  const parentFolder = path.dirname(absoluteFolderPath);
  const folderName = path.basename(absoluteFolderPath);
  const zipPath = path.join(parentFolder, folderName + ".zip");

  if (fs.existsSync(zipPath)) {
    fs.rmSync(zipPath, { force: true });
  }

  execFileSync("zip", ["-r", zipPath, folderName], {
    cwd: parentFolder,
    stdio: "ignore",
  });

  return {
    sourceFolder: absoluteFolderPath,
    zipPath,
  };
}

module.exports = { createZipFromFolder };
