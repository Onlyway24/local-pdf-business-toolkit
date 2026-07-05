function createClientPackReadme({ sourceFolderPath, inspection, copiedFiles }) {
  const lines = [];

  lines.push("# Client Document Pack");
  lines.push("");
  lines.push("This pack was generated locally by Local PDF Business Toolkit.");
  lines.push("");
  lines.push("## Source Folder");
  lines.push(sourceFolderPath);
  lines.push("");
  lines.push("## Status");
  lines.push("Status: " + inspection.status);
  lines.push("Readiness score: " + inspection.readinessScore + "%");
  lines.push("");

  if (inspection.duplicates && inspection.duplicates.hasDuplicates) {
    lines.push("## Warning");
    lines.push("Duplicate files were detected in the source folder.");
    lines.push("Review duplicates before delivering this pack to a client.");
    lines.push("");

    if (inspection.duplicates.duplicateNames.length > 0) {
      lines.push("### Duplicate File Names");
      for (const duplicate of inspection.duplicates.duplicateNames) {
        lines.push("");
        lines.push("- " + duplicate.name);
        for (const file of duplicate.files) {
          lines.push("  - " + file);
        }
      }
      lines.push("");
    }

    if (inspection.duplicates.duplicateContents.length > 0) {
      lines.push("### Duplicate File Contents");
      for (const duplicate of inspection.duplicates.duplicateContents) {
        lines.push("");
        lines.push("- Matching content:");
        for (const file of duplicate.files) {
          lines.push("  - " + file);
        }
      }
      lines.push("");
    }
  }

  lines.push("## Summary");
  lines.push("Total files: " + inspection.totalFiles);
  lines.push("PDF files: " + inspection.pdfFiles);
  lines.push("Non-PDF files: " + inspection.nonPdfFiles);
  lines.push("Known documents: " + inspection.knownDocuments);
  lines.push("Needs review: " + inspection.needsReview);
  lines.push("");
  lines.push("## Included Files");

  if (copiedFiles.length === 0) {
    lines.push("");
    lines.push("No files included.");
    return lines.join("\n");
  }

  for (const file of copiedFiles) {
    lines.push("");
    lines.push("- " + file.originalName);
    lines.push("  Type: " + file.documentType);
    lines.push("  Pack path: " + file.relativePackPath);
    lines.push("  Manual review: " + (file.needsManualReview ? "yes" : "no"));
  }

  return lines.join("\n");
}

module.exports = { createClientPackReadme };
