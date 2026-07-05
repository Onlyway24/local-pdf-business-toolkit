const assert = require("assert");
const path = require("path");
const { scanFolder } = require("../src/core/scanFolder");
const { detectDuplicateFiles } = require("../src/core/detectDuplicateFiles");

function run() {
  const duplicatePath = path.resolve("tests/fixtures/duplicate-client-folder");
  const scanResult = scanFolder(duplicatePath);
  const result = detectDuplicateFiles(scanResult);

  assert.strictEqual(result.hasDuplicates, true);
  assert.strictEqual(result.duplicateNames.length, 1);
  assert.strictEqual(result.duplicateNames[0].name, "contratto.pdf");

  assert.ok(
    result.duplicateNames[0].files.includes("contracts/contratto.pdf")
  );

  assert.ok(
    result.duplicateNames[0].files.includes("backup/contratto.pdf")
  );

  assert.strictEqual(result.duplicateContents.length, 1);

  console.log("detectDuplicateFiles.test.js passed");
}

run();
