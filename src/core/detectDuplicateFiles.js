const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

function hashFile(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(content).digest("hex");
}

function detectDuplicateFiles(scanResult) {
  const nameGroups = new Map();
  const contentGroups = new Map();

  for (const file of scanResult.files) {
    const fileName = file.name;
    const sourceRelativePath = file.relativePath || file.name;
    const absolutePath = path.join(scanResult.folderPath, sourceRelativePath);

    if (!nameGroups.has(fileName)) {
      nameGroups.set(fileName, []);
    }

    nameGroups.get(fileName).push(sourceRelativePath);

    const hash = hashFile(absolutePath);

    if (!contentGroups.has(hash)) {
      contentGroups.set(hash, []);
    }

    contentGroups.get(hash).push(sourceRelativePath);
  }

  const duplicateNames = Array.from(nameGroups.entries())
    .filter(([, files]) => files.length > 1)
    .map(([name, files]) => ({
      name,
      files,
    }));

  const duplicateContents = Array.from(contentGroups.values())
    .filter((files) => files.length > 1)
    .map((files) => ({
      files,
    }));

  return {
    hasDuplicates: duplicateNames.length > 0 || duplicateContents.length > 0,
    duplicateNames,
    duplicateContents,
  };
}

module.exports = { detectDuplicateFiles };
