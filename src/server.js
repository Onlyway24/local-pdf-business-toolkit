const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { runCommand, getCommands } = require('./commands/commandRouter');
const { clearPdfTextReportHistory } = require('./core/clearPdfTextReportHistory');


function toPublicReportPath(filePath) {
  if (!filePath) {
    return null;
  }

  const marker = `${path.sep}outputs${path.sep}reports${path.sep}`;
  const index = filePath.indexOf(marker);

  if (index === -1) {
    return null;
  }

  return `/reports/${filePath.slice(index + marker.length)}`;
}


function getFolderName(folderPath) {
  if (!folderPath) {
    return 'Unknown folder';
  }

  return path.basename(folderPath);
}

function isReadyReport(report) {
  return report.status === 'READY'
    || report.deliveryDecision?.decision === 'READY TO DELIVER';
}


function createActionSummary(report) {
  const attempted = report.pdfHealth?.attempted || 0;
  const failed = report.pdfHealth?.failed || 0;
  const decision = report.deliveryDecision?.decision || '';

  if (attempted === 0 || decision === 'NO PDF REVIEW REQUIRED') {
    return 'No PDF review required.';
  }

  if (failed === 0 || decision === 'READY TO DELIVER') {
    return 'Ready to deliver.';
  }

  return `Review ${failed} failed PDF file(s) before delivery.`;
}

function createReportResponse(report) {
  return {
    generatedAt: report.generatedAt,
    folderPath: report.folderPath,
    folderName: getFolderName(report.folderPath),
    totalFiles: report.totalFiles,
    pdfFiles: report.pdfFiles,
    nonPdfFiles: report.nonPdfFiles,
    status: report.status,
    readinessScore: report.readinessScore,
    actionSummary: createActionSummary(report),
    pdfHealth: report.pdfHealth,
    failedPdfFiles: Array.isArray(report.failedPdfFiles) ? report.failedPdfFiles : [],
    deliveryDecision: report.deliveryDecision,
    links: {
      html: toPublicReportPath(report.reportPaths?.htmlReportPath),
      json: toPublicReportPath(report.reportPaths?.jsonReportPath),
      markdown: toPublicReportPath(report.reportPaths?.markdownReportPath)
    }
  };
}

function createReportsStats(reports) {
  const readinessScores = reports
    .map((report) => report.readinessScore)
    .filter((score) => typeof score === 'number');

  const averageReadiness = readinessScores.length === 0
    ? 0
    : Math.round(readinessScores.reduce((sum, score) => sum + score, 0) / readinessScores.length);

  const readyReports = reports.filter(isReadyReport).length;
  const reviewReports = reports.length - readyReports;

  return {
    totalReports: reports.length,
    averageReadiness,
    readyReports,
    reviewReports
  };
}

function readReportsIndex() {
  const indexPath = path.resolve('outputs', 'reports', 'index.json');

  if (!fs.existsSync(indexPath)) {
    return {
      reports: []
    };
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

    if (!parsed || !Array.isArray(parsed.reports)) {
      return {
        reports: []
      };
    }

    return parsed;
  } catch {
    return {
      reports: []
    };
  }
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/reports', express.static(path.join(__dirname, '../outputs/reports')));

app.get('/api/commands', (req, res) => {
  res.json({ commands: getCommands() });
});



app.get('/api/reports/latest', (req, res) => {
  const index = readReportsIndex();
  const latestReport = index.reports[index.reports.length - 1];

  if (!latestReport) {
    res.json({
      report: null
    });
    return;
  }

  res.json({
    report: createReportResponse(latestReport)
  });
});

app.get('/api/reports', (req, res) => {
  const index = readReportsIndex();
  const limit = Number.parseInt(req.query.limit || '10', 10);
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 50) : 10;

  const allReports = index.reports.slice();
  const reports = allReports
    .slice()
    .reverse()
    .slice(0, safeLimit)
    .map(createReportResponse);

  res.json({
    stats: createReportsStats(allReports),
    reports
  });
});


app.delete('/api/reports/history', (req, res) => {
  const result = clearPdfTextReportHistory();

  res.json({
    success: true,
    indexPath: result.indexPath,
    backupPath: result.backupPath,
    clearedReports: result.clearedReports
  });
});

app.post('/api/run', async (req, res) => {
  const { command, folderPath, clientName } = req.body;

  if (!command || !folderPath) {
    return res.status(400).json({ error: 'Command and folder path are required' });
  }

  try {
    const extraArgs = clientName ? [clientName] : [];
    const execution = await runCommand(command, folderPath, extraArgs);
    
    res.json({
      success: true,
      title: execution.title,
      result: execution.result
    });
  } catch (error) {
    console.error('Command Error:', error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Web UI running on http://localhost:${PORT}`);
});
