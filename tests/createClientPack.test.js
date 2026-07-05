const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { scanFolder } = require("../src/core/scanFolder");
const { inspectFolder } = require("../src/core/inspectFolder");
const { createInspectionReport } = require("../src/core/createInspectionReport");
const { createOrganizationPlan } = require("../src/core/createOrganizationPlan");
const { createPlanReport } = require("../src/core/createPlanReport");
const { createClientPackReadme } = require("../src/core/createClientPackReadme");
const { createClientPack } = require("../src/output/createClientPack");

function run() {
  const samplePath = path.resolve("samples");

  const scanResult = scanFolder(samplePath);
  const inspection = inspectFolder(scanResult);
  const organizationPlan = createOrganizationPlan(scanResult);

  const inspectionReport = createInspectionReport(inspection);
  const organizationPlanReport = createPlanReport(organizationPlan);

  const readmeContent = createClientPackReadme({
    sourceFolderPath: samplePath,
    inspection,
    copiedFiles: organizationPlan.plannedFiles.map((file) => ({
      originalName: file.originalName,
      documentType: file.documentType,
      needsManualReview: file.needsManualReview,
      relativePackPath: "documents/" + file.proposedPath,
    })),
  });

  const result = createClientPack({
    sourceFolderPath: samplePath,
    organizationPlan,
    inspectionReport,
    organizationPlanReport,
    readmeContent,
  });

  assert.strictEqual(result.totalCopied, 3);
  assert.ok(fs.existsSync(result.clientPackRoot));

  assert.ok(fs.existsSync(path.join(result.clientPackRoot, "README.md")));
  assert.ok(fs.existsSync(path.join(result.clientPackRoot, "reports", "inspection.md")));
  assert.ok(fs.existsSync(path.join(result.clientPackRoot, "reports", "organization-plan.md")));

  assert.ok(
    fs.existsSync(
      path.join(result.clientPackRoot, "documents", "contracts", "cliente-contratto.pdf")
    )
  );

  assert.ok(
    fs.existsSync(
      path.join(result.clientPackRoot, "documents", "invoices", "fattura-gennaio.pdf")
    )
  );

  assert.ok(
    fs.existsSync(
      path.join(result.clientPackRoot, "documents", "identity-documents", "documento-identita.txt")
    )
  );

  console.log("createClientPack.test.js passed");
}

run();
