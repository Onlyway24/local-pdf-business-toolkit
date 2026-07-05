const fs = require("fs");
const path = require("path");

function saveReport(content, reportName = "folder-scan") {
  const outputsDir = path.resolve("outputs");

  if (!fs.existsSync(outputsDir)) {
    fs.mkdirSync(outputsDir);
  }

  const safeReportName = String(reportName)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filePath = path.join(outputsDir, safeReportName + "-" + timestamp + ".md");

  fs.writeFileSync(filePath, content, "utf8");

  return filePath;
}

module.exports = { saveReport };
