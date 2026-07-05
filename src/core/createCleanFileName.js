const path = require("path");

function createCleanFileName(fileName) {
  const originalExtension = path.extname(fileName);
  const normalizedExtension = originalExtension.toLowerCase();
  const baseName = path.basename(fileName, originalExtension);

  const cleanedBaseName = baseName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!cleanedBaseName) {
    return "unnamed-file" + normalizedExtension;
  }

  return cleanedBaseName + normalizedExtension;
}

module.exports = { createCleanFileName };
