const assert = require("assert");
const path = require("path");
const { scanFolder } = require("../src/core/scanFolder");
const { inspectFolder } = require("../src/core/inspectFolder");
const { createOrganizationPlan } = require("../src/core/createOrganizationPlan");
const { createClientPackReadme } = require("../src/core/createClientPackReadme");

function run() {
  const duplicatePath = path.resolve("tests/fixtures/duplicate-client-folder");
  const scanResult = scanFolder(duplicatePath);
  const inspection = inspectFolder(scanResult);
  const organizationPlan = createOrganizationPlan(scanResult);

  const readme = createClientPackReadme({
    sourceFolderPath: duplicatePath,
    clientName: "Cliente Duplicati",
    inspection,
    copiedFiles: organizationPlan.plannedFiles.map((file) => ({
      originalName: file.originalName,
      documentType: file.documentType,
      needsManualReview: file.needsManualReview,
      relativePackPath: "documents/" + file.proposedPath,
    })),
  });

  assert.ok(readme.includes("## Generated At"));
  assert.ok(readme.includes("## Client"));
  assert.ok(readme.includes("Cliente Duplicati"));
  assert.ok(readme.includes("## Delivery Status"));
  assert.ok(readme.includes("Delivery recommendation: review before delivery."));
  assert.ok(readme.includes("## Warning"));
  assert.ok(readme.includes("Duplicate files were detected"));
  assert.ok(readme.includes("Duplicate File Names"));
  assert.ok(readme.includes("Duplicate File Contents"));
  assert.ok(readme.includes("contracts/contratto.pdf"));
  assert.ok(readme.includes("backup/contratto.pdf"));

  console.log("createClientPackReadme.test.js passed");
}

run();
