function formatBytes(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
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

  lines.push("## Files");

  for (const file of scanResult.files) {
    lines.push("");
    lines.push("- Name: " + file.name);
    lines.push("  Extension: " + file.extension);
    lines.push("  Size: " + formatBytes(file.sizeBytes));
    lines.push("  Modified: " + file.modifiedAt);
  }

  return lines.join("\n");
}

module.exports = { createReport };
