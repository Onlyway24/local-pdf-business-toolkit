const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { scanFolder } = require("../src/core/scanFolder");
const { createOrganizationPlan } = require("../src/core/createOrganizationPlan");
const { createPreviewPack } = require("../src/output/createPreviewPack");

function run() {
  const samplePath = path.resolve("samples");
  const scanResult = scanFolder(samplePath);
  const plan = createOrganizationPlan(scanResult);
  const result = createPreviewPack(samplePath, plan);

  assert.strictEqual(result.totalCopied, 4);
  assert.ok(fs.existsSync(result.previewRoot));

  assert.ok(
    fs.existsSync(path.join(result.previewRoot, "contracts", "cliente-contratto.pdf"))
  );

  assert.ok(
    fs.existsSync(path.join(result.previewRoot, "invoices", "fattura-gennaio.pdf"))
  );

  assert.ok(
    fs.existsSync(
      path.join(result.previewRoot, "identity-documents", "documento-identita.txt")
    )
  );

  console.log("createPreviewPack.test.js passed");
}

run();
