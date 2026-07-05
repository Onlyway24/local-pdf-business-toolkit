function createSafeClientName(clientName) {
  if (!clientName || typeof clientName !== "string") {
    return "client";
  }

  const safeName = clientName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return safeName || "client";
}

module.exports = { createSafeClientName };
