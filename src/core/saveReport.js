const fs = require("fs");
const path = require("path");

function saveReport(content) {
  const outputsDir = path.resolve("outputs");

  if (!fs.existsSync(outputsDir)) {
    fs.mkdirSync(outputsDir);
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filePath = path.join(outputsDir, "folder-scan-" + timestamp + ".md");

  fs.writeFileSync(filePath, content, "utf8");

  return filePath;
}

module.exports = { saveReport };
