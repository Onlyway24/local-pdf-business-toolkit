const path = require("path");

function createCleanFileName(fileName) {
  const extension = path.extname(fileName).toLowerCase();
  const baseName = path.basename(fileName, extension);

  const cleanedBaseName = baseName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!cleanedBaseName) {
    return "unnamed-file" + extension;
  }

  return cleanedBaseName + extension;
}

module.exports = { createCleanFileName };
