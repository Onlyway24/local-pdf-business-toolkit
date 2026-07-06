function createClientDeliveryDecision(result) {
  const attempted = result.pdfTextExtraction?.attempted || 0;
  const succeeded = result.pdfTextExtraction?.succeeded || 0;
  const failed = result.pdfTextExtraction?.failed || 0;

  if (attempted === 0) {
    return {
      decision: 'NO PDF REVIEW REQUIRED',
      reason: 'No PDF files were found for text inspection.',
      requiredAction: 'Proceed only if PDF text inspection is not required for this delivery.'
    };
  }

  if (failed === 0) {
    return {
      decision: 'READY TO DELIVER',
      reason: 'All attempted PDF files were readable.',
      requiredAction: 'Optional final human review before sending client deliverables.'
    };
  }

  if (succeeded === 0) {
    return {
      decision: 'DO NOT DELIVER YET',
      reason: `${failed} PDF file(s) need manual review before delivery.`,
      requiredAction: 'Replace invalid PDFs or review them manually before sending client deliverables.'
    };
  }

  return {
    decision: 'REVIEW BEFORE DELIVERY',
    reason: `${failed} of ${attempted} PDF file(s) need manual review before delivery.`,
    requiredAction: 'Review or replace failed PDFs, then regenerate the report before delivery.'
  };
}

function createManualReviewData(result) {
  const pdfFiles = result.files.filter((file) => file.extension === '.pdf');
  const readablePdfFiles = pdfFiles
    .filter((file) => file.pdfText?.success)
    .map((file) => ({
      relativePath: file.relativePath,
      documentType: file.documentType,
      sizeInBytes: file.sizeInBytes,
      pageCount: file.pdfText?.pageCount || 0,
      textPreview: file.pdfText?.textPreview || ''
    }));

  const failedPdfFiles = pdfFiles
    .filter((file) => !file.pdfText?.success)
    .map((file) => ({
      relativePath: file.relativePath,
      documentType: file.documentType,
      sizeInBytes: file.sizeInBytes,
      pageCount: file.pdfText?.pageCount || 0,
      error: file.pdfText?.error || 'PDF text extraction failed.'
    }));

  const nextStep = failedPdfFiles.length === 0
    ? 'Proceed with the client pack or review the extracted text before delivery.'
    : 'Review or replace failed PDFs before sending client deliverables.';

  return {
    failedPdfFiles,
    readablePdfFiles,
    nextStep
  };
}

function createPdfTextInspectionJsonReport(result) {
  const attempted = result.pdfTextExtraction?.attempted || 0;
  const succeeded = result.pdfTextExtraction?.succeeded || 0;
  const failed = result.pdfTextExtraction?.failed || 0;

  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      folderPath: result.folderPath,
      totalFiles: result.totalFiles,
      pdfFiles: result.pdfFiles,
      nonPdfFiles: result.nonPdfFiles,
      status: result.status,
      readinessScore: result.readinessScore
    },
    pdfHealth: {
      attempted,
      succeeded,
      failed
    },
    deliveryDecision: createClientDeliveryDecision(result),
    manualReview: createManualReviewData(result),
    files: result.files.map((file) => ({
      relativePath: file.relativePath,
      extension: file.extension,
      documentType: file.documentType,
      sizeInBytes: file.sizeInBytes,
      pdfText: file.pdfText
        ? {
            success: file.pdfText.success,
            pageCount: file.pdfText.pageCount,
            textPreview: file.pdfText.textPreview || '',
            error: file.pdfText.error || null
          }
        : null
    }))
  };

  return JSON.stringify(report, null, 2) + '\n';
}

module.exports = {
  createPdfTextInspectionJsonReport
};
