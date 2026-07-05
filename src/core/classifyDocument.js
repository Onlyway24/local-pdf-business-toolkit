const DOCUMENT_TYPES = {
  CONTRACT: "Contract",
  INVOICE: "Invoice",
  IDENTITY_DOCUMENT: "Identity Document",
  QUOTE_OR_PROPOSAL: "Quote or Proposal",
  CV_OR_RESUME: "CV or Resume",
  UNKNOWN: "Unknown",
};

const CLASSIFICATION_RULES = [
  {
    type: DOCUMENT_TYPES.CONTRACT,
    keywords: ["contratto", "contract", "accordo", "agreement"],
  },
  {
    type: DOCUMENT_TYPES.INVOICE,
    keywords: ["fattura", "invoice", "ricevuta", "receipt"],
  },
  {
    type: DOCUMENT_TYPES.IDENTITY_DOCUMENT,
    keywords: ["identita", "identity", "documento", "passport", "carta"],
  },
  {
    type: DOCUMENT_TYPES.QUOTE_OR_PROPOSAL,
    keywords: ["preventivo", "quote", "proposal", "offerta"],
  },
  {
    type: DOCUMENT_TYPES.CV_OR_RESUME,
    keywords: ["cv", "curriculum", "resume"],
  },
];

function classifyDocument(fileName) {
  const normalizedName = String(fileName).toLowerCase();

  for (const rule of CLASSIFICATION_RULES) {
    const matched = rule.keywords.some((keyword) =>
      normalizedName.includes(keyword)
    );

    if (matched) {
      return rule.type;
    }
  }

  return DOCUMENT_TYPES.UNKNOWN;
}

module.exports = {
  DOCUMENT_TYPES,
  classifyDocument,
};
