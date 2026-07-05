const assert = require("assert");
const { createCleanFileName } = require("../src/core/createCleanFileName");

function run() {
  assert.strictEqual(
    createCleanFileName("Fattura Gennaio 2026.pdf"),
    "fattura-gennaio-2026.pdf"
  );

  assert.strictEqual(
    createCleanFileName("Contratto Cliente Finale.PDF"),
    "contratto-cliente-finale.pdf"
  );

  assert.strictEqual(
    createCleanFileName("Documento Identità.pdf"),
    "documento-identita.pdf"
  );

  assert.strictEqual(
    createCleanFileName("!!!.pdf"),
    "unnamed-file.pdf"
  );

  console.log("createCleanFileName.test.js passed");
}

run();
