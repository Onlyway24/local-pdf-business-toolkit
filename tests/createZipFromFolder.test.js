const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { createZipFromFolder } = require("../src/output/createZipFromFolder");

function run() {
  const testRoot = path.resolve("outputs", "test-zip-source");
  const nestedFolder = path.join(testRoot, "documents");

  if (fs.existsSync(testRoot)) {
    fs.rmSync(testRoot, { recursive: true, force: true });
  }

  fs.mkdirSync(nestedFolder, { recursive: true });
  fs.writeFileSync(path.join(testRoot, "README.md"), "Test ZIP README", "utf8");
  fs.writeFileSync(path.join(nestedFolder, "sample.txt"), "Sample document", "utf8");

  const result = createZipFromFolder(testRoot);

  assert.strictEqual(result.sourceFolder, testRoot);
  assert.ok(result.zipPath.endsWith(".zip"));
  assert.ok(fs.existsSync(result.zipPath));

  const zipStats = fs.statSync(result.zipPath);
  assert.ok(zipStats.size > 0);

  console.log("createZipFromFolder.test.js passed");
}

run();
