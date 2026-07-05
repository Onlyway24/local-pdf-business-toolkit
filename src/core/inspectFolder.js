function inspectFolder(scanResult) {
  const totalFiles = scanResult.totalFiles;

  const pdfFiles = scanResult.files.filter(
    (file) => file.extension === ".pdf"
  ).length;

  const nonPdfFiles = totalFiles - pdfFiles;

  const knownDocuments = scanResult.files.filter(
    (file) => file.documentType !== "Unknown"
  ).length;

  const needsReview = totalFiles - knownDocuments;

  const readinessScore =
    totalFiles === 0 ? 0 : Math.round((knownDocuments / totalFiles) * 100);

  let status = "EMPTY";

  if (totalFiles > 0 && readinessScore >= 90) {
    status = "READY";
  } else if (totalFiles > 0 && readinessScore >= 60) {
    status = "PARTIAL";
  } else if (totalFiles > 0) {
    status = "NEEDS REVIEW";
  }

  return {
    folderPath: scanResult.folderPath,
    totalFiles,
    pdfFiles,
    nonPdfFiles,
    knownDocuments,
    needsReview,
    readinessScore,
    status,
  };
}

module.exports = { inspectFolder };
