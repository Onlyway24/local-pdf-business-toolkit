const fs = require("fs");
const path = require("path");

function scanFolder(folderPath) {
  const absolutePath = path.resolve(folderPath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error("Folder not found: " + absolutePath);
  }

  const stats = fs.statSync(absolutePath);

  if (!stats.isDirectory()) {
    throw new Error("Path is not a folder: " + absolutePath);
  }

  const entries = fs.readdirSync(absolutePath, { withFileTypes: true });

  const files = entries
    .filter((entry) => entry.isFile())
    .map((entry) => {
      const filePath = path.join(absolutePath, entry.name);
      const fileStats = fs.statSync(filePath);
      const extension = path.extname(entry.name).toLowerCase() || "no-extension";

      return {
        name: entry.name,
        extension,
        sizeBytes: fileStats.size,
        modifiedAt: fileStats.mtime.toISOString(),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return {
    folderPath: absolutePath,
    totalFiles: files.length,
    files,
  };
}

module.exports = { scanFolder };
