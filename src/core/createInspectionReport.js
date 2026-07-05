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

  if (inspection.totalFiles === 0) {
    lines.push("## Recommendation");
    lines.push("Add documents before creating a client-ready pack.");
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
