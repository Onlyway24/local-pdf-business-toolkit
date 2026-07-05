function getTargetFolder(documentType) {
  const foldersByType = {
    Contract: "contracts",
    Invoice: "invoices",
    "Identity Document": "identity-documents",
    "Quote or Proposal": "quotes-and-proposals",
    "CV or Resume": "cv-and-resumes",
    Unknown: "needs-review",
  };

  return foldersByType[documentType] || "needs-review";
}

module.exports = { getTargetFolder };
