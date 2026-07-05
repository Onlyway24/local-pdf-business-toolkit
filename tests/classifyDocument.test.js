const assert = require("assert");
const { classifyDocument, DOCUMENT_TYPES } = require("../src/core/classifyDocument");

function run() {
  assert.strictEqual(
    classifyDocument("cliente-contratto.pdf"),
    DOCUMENT_TYPES.CONTRACT
  );

  assert.strictEqual(
    classifyDocument("fattura-gennaio.pdf"),
    DOCUMENT_TYPES.INVOICE
  );

  assert.strictEqual(
    classifyDocument("documento-identita.txt"),
    DOCUMENT_TYPES.IDENTITY_DOCUMENT
  );

  assert.strictEqual(
    classifyDocument("preventivo-sito-web.pdf"),
    DOCUMENT_TYPES.QUOTE_OR_PROPOSAL
  );

  assert.strictEqual(
    classifyDocument("cv-fabio.pdf"),
    DOCUMENT_TYPES.CV_OR_RESUME
  );

  assert.strictEqual(
    classifyDocument("file-random.pdf"),
    DOCUMENT_TYPES.UNKNOWN
  );

  console.log("classifyDocument.test.js passed");
}

run();
