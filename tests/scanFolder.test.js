const assert = require("assert");
const path = require("path");
const { scanFolder } = require("../src/core/scanFolder");

function run() {
  const samplePath = path.resolve("samples");
  const result = scanFolder(samplePath);

  assert.strictEqual(result.folderPath, samplePath);
  assert.strictEqual(result.totalFiles, 3);
  assert.strictEqual(result.files.length, 3);

  const names = result.files.map((file) => file.name);

  assert.ok(names.includes("cliente-contratto.pdf"));
  assert.ok(names.includes("fattura-gennaio.pdf"));
  assert.ok(names.includes("documento-identita.txt"));

  const contract = result.files.find((file) => file.name === "cliente-contratto.pdf");
  assert.strictEqual(contract.documentType, "Contract");

  console.log("scanFolder.test.js passed");
}

run();
