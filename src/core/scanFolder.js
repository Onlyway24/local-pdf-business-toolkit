const fs = require("fs");
const path = require("path");
const { classifyDocument } = require("./classifyDocument");

function normalizeRelativePath(relativePath) {
  return relativePath.split(path.sep).join("/");
}

function scanFolder(folderPath) {
  const files = [];

  function walk(currentFolderPath) {
    const entries = fs.readdirSync(currentFolderPath, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.name === ".DS_Store") {
        continue;
      }

      const absolutePath = path.join(currentFolderPath, entry.name);

      if (entry.isDirectory()) {
        walk(absolutePath);
        continue;
      }

      if (!entry.isFile()) {
        continue;
      }

      const relativePath = normalizeRelativePath(path.relative(folderPath, absolutePath));
      const stats = fs.statSync(absolutePath);
      const extension = path.extname(entry.name).toLowerCase();

      files.push({
        name: entry.name,
        relativePath,
        extension,
        sizeInBytes: stats.size,
        documentType: classifyDocument(entry.name),
      });
    }
  }

  walk(folderPath);

  files.sort((a, b) => a.relativePath.localeCompare(b.relativePath));

  return {
    folderPath,
    totalFiles: files.length,
    files,
  };
}

module.exports = { scanFolder };
