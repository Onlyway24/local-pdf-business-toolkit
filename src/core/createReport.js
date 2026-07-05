function formatBytes(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

function countByDocumentType(files) {
  return files.reduce((counts, file) => {
    counts[file.documentType] = (counts[file.documentType] || 0) + 1;
    return counts;
  }, {});
}

function createReport(scanResult) {
  const lines = [];

  lines.push("# LOCAL PDF BUSINESS TOOLKIT REPORT");
  lines.push("");
  lines.push("## Folder");
  lines.push(scanResult.folderPath);
  lines.push("");
  lines.push("## Summary");
  lines.push("Total files: " + scanResult.totalFiles);
  lines.push("");

  if (scanResult.files.length === 0) {
    lines.push("No files found.");
    return lines.join("\n");
  }

  lines.push("## Document Types");

  const documentTypeCounts = countByDocumentType(scanResult.files);

  for (const [type, count] of Object.entries(documentTypeCounts)) {
    lines.push("- " + type + ": " + count);
  }

  lines.push("");
  lines.push("## Files");

  for (const file of scanResult.files) {
    lines.push("");
    lines.push("- Name: " + file.name);
    lines.push("  Type: " + file.documentType);
    lines.push("  Extension: " + file.extension);
    lines.push("  Size: " + formatBytes(file.sizeBytes));
    lines.push("  Modified: " + file.modifiedAt);
  }

  return lines.join("\n");
}

module.exports = { createReport };
