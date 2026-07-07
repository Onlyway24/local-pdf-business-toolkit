const { spawnSync } = require('child_process');
const path = require('path');

const testFiles = [
  'classifyDocument.test.js',
  'scanFolder.test.js',
  'createCleanFileName.test.js',
  'createSafeClientName.test.js',
  'createOrganizationPlan.test.js',
  'createPreviewPack.test.js',
  'inspectFolder.test.js',
  'commandRouter.test.js',
  'createClientPack.test.js',
  'createClientPackReadme.test.js',
  'createZipFromFolder.test.js',
  'nestedClientPack.test.js',
  'detectDuplicateFiles.test.js',
  'fullDemoCommand.test.js',
  'extractPdfText.test.js',
  'enrichScanWithPdfText.test.js',
  'clearPdfTextReportHistory.test.js',
  'reportHistoryApiSmoke.test.js',
  'updatePdfTextReportIndex.test.js',
  'inspectPdfTextCommand.test.js',
  'inspectPdfTextCliOutput.test.js',
  'createPdfTextInspectionReport.test.js',
  'createPdfTextInspectionJsonReport.test.js',
  'createPdfTextInspectionHtmlReport.test.js',
  'latestReportUiStructure.test.js',
  'dashboardPdfInspectionRunFlow.test.js',
];

for (const testFile of testFiles) {
  const testPath = path.join(__dirname, testFile);

  console.log(`\n▶ Running ${testFile}`);

  const result = spawnSync(process.execPath, [testPath], {
    stdio: 'inherit'
  });

  if (result.status !== 0) {
    console.error(`\n✖ ${testFile} failed`);
    process.exit(result.status || 1);
  }
}

console.log(`\n✓ ${testFiles.length} test files passed`);
