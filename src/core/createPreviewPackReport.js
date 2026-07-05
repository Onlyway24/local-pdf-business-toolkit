function createPreviewPackReport(result) {
  const lines = [];

  lines.push("# LOCAL PDF BUSINESS TOOLKIT - PREVIEW PACK");
  lines.push("");
  lines.push("## Preview Folder");
  lines.push(result.previewRoot);
  lines.push("");
  lines.push("## Summary");
  lines.push("Files copied: " + result.totalCopied);
  lines.push("");

  if (result.copiedFiles.length === 0) {
    lines.push("No files copied.");
    return lines.join("\n");
  }

  lines.push("## Copied Files");

  for (const file of result.copiedFiles) {
    lines.push("");
    lines.push("- Original: " + file.originalName);
    lines.push("  Type: " + file.documentType);
    lines.push("  Copied to: " + file.copiedTo);
    lines.push("  Manual review: " + (file.needsManualReview ? "yes" : "no"));
  }

  return lines.join("\n");
}

module.exports = { createPreviewPackReport };
