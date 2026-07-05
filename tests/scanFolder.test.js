const assert = require("assert");
const path = require("path");
const { scanFolder } = require("../src/core/scanFolder");

function run() {
  const samplePath = path.resolve("samples");
  const sampleResult = scanFolder(samplePath);

  assert.strictEqual(sampleResult.folderPath, samplePath);
  assert.strictEqual(sampleResult.totalFiles, 3);
  assert.strictEqual(sampleResult.files.length, 3);

  const nestedPath = path.resolve("tests/fixtures/nested-client-folder");
  const nestedResult = scanFolder(nestedPath);

  assert.strictEqual(nestedResult.folderPath, nestedPath);
  assert.strictEqual(nestedResult.totalFiles, 3);

  const relativePaths = nestedResult.files.map((file) => file.relativePath);

  assert.ok(relativePaths.includes("contracts/contratto-servizio.pdf"));
  assert.ok(relativePaths.includes("identity/documento-identita.txt"));
  assert.ok(relativePaths.includes("invoices/fattura-febbraio.pdf"));

  console.log("scanFolder.test.js passed");
}

run();
