const assert = require("assert");
const path = require("path");
const { scanFolder } = require("../src/core/scanFolder");
const { createOrganizationPlan } = require("../src/core/createOrganizationPlan");

function run() {
  const samplePath = path.resolve("samples");
  const scanResult = scanFolder(samplePath);
  const plan = createOrganizationPlan(scanResult);

  assert.strictEqual(plan.folderPath, samplePath);
  assert.strictEqual(plan.totalFiles, 4);
  assert.strictEqual(plan.plannedFiles.length, 4);

  const contract = plan.plannedFiles.find(
    (file) => file.originalName === "cliente-contratto.pdf"
  );

  assert.ok(contract);
  assert.strictEqual(contract.documentType, "Contract");
  assert.strictEqual(contract.targetFolder, "contracts");
  assert.strictEqual(contract.proposedPath, "contracts/cliente-contratto.pdf");
  assert.strictEqual(contract.needsManualReview, false);

  console.log("createOrganizationPlan.test.js passed");
}

run();
