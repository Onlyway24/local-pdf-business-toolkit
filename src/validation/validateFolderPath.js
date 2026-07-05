const fs = require("fs");
const path = require("path");
const { AppError } = require("../errors/AppError");

function validateFolderPath(folderPath) {
  if (!folderPath || typeof folderPath !== "string") {
    throw new AppError("Missing folder path.", "MISSING_FOLDER_PATH");
  }

  const absolutePath = path.resolve(folderPath);

  if (!fs.existsSync(absolutePath)) {
    throw new AppError("Folder not found: " + absolutePath, "FOLDER_NOT_FOUND");
  }

  const stats = fs.statSync(absolutePath);

  if (!stats.isDirectory()) {
    throw new AppError("Path is not a folder: " + absolutePath, "NOT_A_FOLDER");
  }

  return absolutePath;
}

module.exports = { validateFolderPath };
