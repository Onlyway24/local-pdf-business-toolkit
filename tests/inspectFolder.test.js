const assert = require("assert");
const path = require("path");
const { scanFolder } = require("../src/core/scanFolder");
const { inspectFolder } = require("../src/core/inspectFolder");

function run() {
  const samplePath = path.resolve("samples");
  const scanResult = scanFolder(samplePath);
  const inspection = inspectFolder(scanResult);

  assert.strictEqual(inspection.folderPath, samplePath);
  assert.strictEqual(inspection.totalFiles, 3);
  assert.strictEqual(inspection.pdfFiles, 2);
  assert.strictEqual(inspection.nonPdfFiles, 1);
  assert.strictEqual(inspection.knownDocuments, 3);
  assert.strictEqual(inspection.needsReview, 0);
  assert.strictEqual(inspection.readinessScore, 100);
  assert.strictEqual(inspection.status, "READY");

  console.log("inspectFolder.test.js passed");
}

run();
