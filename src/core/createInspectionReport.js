function createInspectionReport(inspection) {
  const lines = [];

  lines.push("# LOCAL PDF BUSINESS TOOLKIT - FOLDER INSPECTION");
  lines.push("");
  lines.push("## Folder");
  lines.push(inspection.folderPath);
  lines.push("");
  lines.push("## Business Diagnosis");
  lines.push("Status: " + inspection.status);
  lines.push("Readiness score: " + inspection.readinessScore + "%");
  lines.push("");
  lines.push("## File Summary");
  lines.push("Total files: " + inspection.totalFiles);
  lines.push("PDF files: " + inspection.pdfFiles);
  lines.push("Non-PDF files: " + inspection.nonPdfFiles);
  lines.push("Known documents: " + inspection.knownDocuments);
  lines.push("Needs review: " + inspection.needsReview);
  lines.push("");

  lines.push("## Duplicate Check");

  if (!inspection.duplicates || !inspection.duplicates.hasDuplicates) {
    lines.push("No duplicates detected.");
  } else {
    lines.push("Duplicates detected: yes");
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

  if (inspection.totalFiles === 0) {
    lines.push("## Recommendation");
    lines.push("Add documents before creating a client-ready pack.");
    return lines.join("\n");
  }

  if (inspection.duplicates && inspection.duplicates.hasDuplicates) {
    lines.push("## Recommendation");
    lines.push("Review duplicate files before delivering this folder to a client.");
    return lines.join("\n");
  }

  if (inspection.status === "READY") {
    lines.push("## Recommendation");
    lines.push("This folder is ready for preview pack generation.");
    return lines.join("\n");
  }

  if (inspection.status === "PARTIAL") {
    lines.push("## Recommendation");
    lines.push("This folder is partially ready. Review unknown files before delivery.");
    return lines.join("\n");
  }

  lines.push("## Recommendation");
  lines.push("This folder needs manual review before it can be considered client-ready.");

  return lines.join("\n");
}

module.exports = { createInspectionReport };
