function countManualReview(plannedFiles) {
  return plannedFiles.filter((file) => file.needsManualReview).length;
}

function createPlanReport(plan) {
  const lines = [];

  lines.push("# LOCAL PDF BUSINESS TOOLKIT - ORGANIZATION PLAN");
  lines.push("");
  lines.push("## Folder");
  lines.push(plan.folderPath);
  lines.push("");
  lines.push("## Summary");
  lines.push("Total files: " + plan.totalFiles);
  lines.push("Needs manual review: " + countManualReview(plan.plannedFiles));
  lines.push("");

  if (plan.plannedFiles.length === 0) {
    lines.push("No files found.");
    return lines.join("\n");
  }

  lines.push("## Planned Organization");

  for (const file of plan.plannedFiles) {
    lines.push("");
    lines.push("- Original: " + file.originalName);
    lines.push("  Clean name: " + file.cleanFileName);
    lines.push("  Type: " + file.documentType);
    lines.push("  Target folder: " + file.targetFolder);
    lines.push("  Proposed path: " + file.proposedPath);
    lines.push("  Already clean: " + (file.alreadyClean ? "yes" : "no"));
    lines.push("  Manual review: " + (file.needsManualReview ? "yes" : "no"));
  }

  return lines.join("\n");
}

module.exports = { createPlanReport };
