const fs = require("fs");
const path = require("path");
const { classifyDocument } = require("./classifyDocument");

function scanFolder(absoluteFolderPath) {
  const entries = fs.readdirSync(absoluteFolderPath, { withFileTypes: true });

  const files = entries
    .filter((entry) => entry.isFile())
    .map((entry) => {
      const filePath = path.join(absoluteFolderPath, entry.name);
      const fileStats = fs.statSync(filePath);
      const extension = path.extname(entry.name).toLowerCase() || "no-extension";

      return {
        name: entry.name,
        extension,
        documentType: classifyDocument(entry.name),
        sizeBytes: fileStats.size,
        modifiedAt: fileStats.mtime.toISOString(),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return {
    folderPath: absoluteFolderPath,
    totalFiles: files.length,
    files,
  };
}

module.exports = { scanFolder };
