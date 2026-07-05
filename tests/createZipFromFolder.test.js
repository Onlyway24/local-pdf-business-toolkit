const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { createZipFromFolder } = require("../src/output/createZipFromFolder");

function run() {
  const latestPack = fs
    .readdirSync(path.resolve("outputs/client-packs"))
    .filter((name) => name.startsWith("client-pack-") && !name.endsWith(".zip"))
    .sort()
    .pop();

  assert.ok(latestPack, "Expected at least one client pack folder.");

  const packPath = path.resolve("outputs/client-packs", latestPack);
  const result = createZipFromFolder(packPath);

  assert.strictEqual(result.sourceFolder, packPath);
  assert.ok(result.zipPath.endsWith(".zip"));
  assert.ok(fs.existsSync(result.zipPath));

  const zipStats = fs.statSync(result.zipPath);
  assert.ok(zipStats.size > 0);

  console.log("createZipFromFolder.test.js passed");
}

run();
