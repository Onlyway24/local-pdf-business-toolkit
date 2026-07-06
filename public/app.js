function toReportUrl(filePath) {
  if (!filePath) {
    return null;
  }

  const normalized = filePath.replaceAll('\\', '/');
  const marker = '/outputs/reports/';
  const markerIndex = normalized.indexOf(marker);

  if (markerIndex === -1) {
    return null;
  }

  const fileName = normalized.slice(markerIndex + marker.length);
  return `/reports/${encodeURIComponent(fileName)}`;
}

document.getElementById('runner-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const folderPath = document.getElementById('folder-path').value.trim();
  const clientName = document.getElementById('client-name').value.trim();
  const command = document.getElementById('command-select').value;
  
  const submitBtn = document.getElementById('submit-btn');
  const btnText = submitBtn.querySelector('.btn-text');
  const loader = submitBtn.querySelector('.loader');
  
  const resultsSection = document.getElementById('results-section');
  const resultCard = document.querySelector('.result-card');
  const errorCard = document.getElementById('error-card');
  
  submitBtn.disabled = true;
  btnText.classList.add('hidden');
  loader.classList.remove('hidden');
  resultsSection.classList.add('hidden');
  resultCard.classList.add('hidden');
  errorCard.classList.add('hidden');
  
  ['folder', 'pack', 'zip', 'report', 'html-report', 'pdf-extraction'].forEach(id => {
    document.getElementById(`item-${id}`).classList.add('hidden');
  });

  try {
    const response = await fetch('/api/run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        command,
        folderPath,
        clientName: clientName || undefined
      })
    });
    
    const data = await response.json();
    
    resultsSection.classList.remove('hidden');
    
    if (data.success) {
      resultCard.classList.remove('hidden');
      
      document.getElementById('result-title').textContent = data.title;
      
      const res = data.result;
      document.getElementById('res-files').textContent = res.totalFiles ?? 'N/A';
      
      const scoreEl = document.getElementById('res-score');
      scoreEl.textContent = res.readinessScore !== undefined ? `${res.readinessScore}%` : 'N/A';
      
      const badge = document.getElementById('result-status');
      if (res.status) {
        badge.textContent = res.status;
        badge.className = 'status-badge ' + (res.status === 'READY' ? 'ready' : 'review');
        badge.style.display = 'inline-block';
      } else {
        badge.style.display = 'none';
      }
      
      if (res.folderPath) {
        document.getElementById('item-folder').classList.remove('hidden');
        document.getElementById('res-folder').textContent = res.folderPath;
      }
      
      if (res.clientPackRoot) {
        document.getElementById('item-pack').classList.remove('hidden');
        document.getElementById('res-pack').textContent = res.clientPackRoot;
      }
      
      if (res.zipPath) {
        document.getElementById('item-zip').classList.remove('hidden');
        document.getElementById('res-zip').textContent = res.zipPath;
      }
      
      if (res.savedPath) {
        document.getElementById('item-report').classList.remove('hidden');
        document.getElementById('res-report').textContent = res.savedPath;
      }

      if (res.htmlReportPath) {
        const reportUrl = toReportUrl(res.htmlReportPath);
        const htmlLink = document.getElementById('res-html-report');

        document.getElementById('item-html-report').classList.remove('hidden');
        htmlLink.textContent = reportUrl ? 'Apri report HTML nel browser' : res.htmlReportPath;
        htmlLink.href = reportUrl || '#';
      }

      if (res.pdfTextExtraction) {
        const extraction = res.pdfTextExtraction;
        document.getElementById('item-pdf-extraction').classList.remove('hidden');
        document.getElementById('res-pdf-extraction').textContent =
          `Attempted: ${extraction.attempted}, Succeeded: ${extraction.succeeded}, Failed: ${extraction.failed}`;
      }
      
    } else {
      errorCard.classList.remove('hidden');
      document.getElementById('error-message').textContent = data.error || 'Errore sconosciuto';
    }
    
  } catch (err) {
    resultsSection.classList.remove('hidden');
    errorCard.classList.remove('hidden');
    document.getElementById('error-message').textContent = "Impossibile connettersi al server locale. Assicurati che sia in esecuzione.";
  } finally {
    submitBtn.disabled = false;
    btnText.classList.remove('hidden');
    loader.classList.add('hidden');
  }
});


let recentReportsCache = [];
let activeReportFilter = 'all';

function formatDate(value) {
  if (!value) {
    return 'Unknown date';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

function getReportDecision(report) {
  return report.deliveryDecision?.decision || 'NO DECISION';
}

function isReadyReport(report) {
  return getReportDecision(report) === 'READY TO DELIVER' || report.status === 'READY';
}

function isReviewReport(report) {
  return !isReadyReport(report);
}

function filterReports(reports) {
  if (activeReportFilter === 'ready') {
    return reports.filter(isReadyReport);
  }

  if (activeReportFilter === 'review') {
    return reports.filter(isReviewReport);
  }

  return reports;
}

function updateDashboardStats(reports, stats = null) {
  const fallbackTotal = reports.length;
  const fallbackReady = reports.filter(isReadyReport).length;
  const fallbackReview = reports.filter(isReviewReport).length;
  const fallbackScores = reports
    .map((report) => report.readinessScore)
    .filter((score) => typeof score === 'number');

  const fallbackAverage = fallbackScores.length === 0
    ? 0
    : Math.round(fallbackScores.reduce((sum, score) => sum + score, 0) / fallbackScores.length);

  const total = stats?.totalReports ?? fallbackTotal;
  const averageReadiness = stats?.averageReadiness ?? fallbackAverage;
  const readyReports = stats?.readyReports ?? fallbackReady;
  const reviewReports = stats?.reviewReports ?? fallbackReview;

  const totalElement = document.getElementById('stat-total-reports');
  const averageElement = document.getElementById('stat-average-readiness');
  const readyElement = document.getElementById('stat-ready-reports');
  const reviewElement = document.getElementById('stat-review-reports');

  if (totalElement) totalElement.textContent = String(total);
  if (averageElement) averageElement.textContent = `${averageReadiness}%`;
  if (readyElement) readyElement.textContent = String(readyReports);
  if (reviewElement) reviewElement.textContent = String(reviewReports);
}

function setActiveReportFilter(filter) {
  activeReportFilter = filter;

  document.querySelectorAll('.report-filter').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.filter === filter);
  });

  renderRecentReports(recentReportsCache);
}


  if (!href) {
    return '';
  }

  return `<a href="${href}" target="_blank" rel="noreferrer">${label}</a>`;
}

function renderRecentReports(reports, stats = null) {
  const container = document.getElementById('recent-reports');

  if (!container) {
    return;
  }

  recentReportsCache = Array.isArray(reports) ? reports : [];
  updateDashboardStats(recentReportsCache, stats);

  const visibleReports = filterReports(recentReportsCache);

  if (recentReportsCache.length === 0) {
    container.innerHTML = '<p class="muted">No reports generated yet. Run a PDF text inspection first.</p>';
    return;
  }

  if (visibleReports.length === 0) {
    container.innerHTML = '<p class="muted">No reports match this filter.</p>';
    return;
  }

  container.innerHTML = visibleReports.map((report) => {
    const status = report.status || 'UNKNOWN';
    const displayFolder = report.folderName || report.folderPath || 'Unknown folder';
    const decision = getReportDecision(report);
    const reason = report.deliveryDecision?.reason || 'No reason available.';
    const requiredAction = report.deliveryDecision?.requiredAction || '';
    const readinessScore = typeof report.readinessScore === 'number'
      ? `${report.readinessScore}%`
      : 'N/A';

    const failedCount = report.pdfHealth?.failed ?? 0;
    const succeededCount = report.pdfHealth?.succeeded ?? 0;
    const attemptedCount = report.pdfHealth?.attempted ?? 0;

    const htmlLink = createReportLink('Open HTML', report.links?.html);
    const jsonLink = createReportLink('Open JSON', report.links?.json);
    const markdownLink = createReportLink('Open Markdown', report.links?.markdown);

    const links = [htmlLink, jsonLink, markdownLink].filter(Boolean).join('');

    const statusClass = isReadyReport(report) ? 'status-ready-card' : 'status-review-card';

    return `
      <article class="report-card ${statusClass}">
        <div class="report-card-top">
          <span class="status-pill">${status}</span>
          <span class="report-date">${formatDate(report.generatedAt)}</span>
        </div>

        <h3>${displayFolder}</h3>

        <div class="report-metrics">
          <span>Readiness <strong>${readinessScore}</strong></span>
          <span>PDFs <strong>${report.pdfFiles ?? 0}</strong></span>
          <span>Readable <strong>${succeededCount}/${attemptedCount}</strong></span>
          <span>Failed <strong>${failedCount}</strong></span>
        </div>

        <div class="delivery-decision">
          <strong>${decision}</strong>
          <p>${reason}</p>
          ${requiredAction ? `<small>${requiredAction}</small>` : ''}
        </div>

        <div class="report-links">
          ${links || '<span class="muted">No report links available.</span>'}
        </div>
      </article>
    `;
  }).join('');
}

async function loadRecentReports() {
  const container = document.getElementById('recent-reports');

  if (container) {
    container.innerHTML = '<p class="muted">Loading recent reports...</p>';
  }

  try {
    const response = await fetch('/api/reports');
    const data = await response.json();
    renderRecentReports(data.reports || [], data.stats || null);
  } catch (error) {
    if (container) {
      container.innerHTML = '<p class="muted">Unable to load recent reports.</p>';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadRecentReports();
  loadLatestReport();

  const refreshButton = document.getElementById('refresh-reports');

  if (refreshButton) {
    refreshButton.addEventListener('click', loadRecentReports);
  }

  const refreshLatestButton = document.getElementById('refresh-latest-report');

  if (refreshLatestButton) {
    refreshLatestButton.addEventListener('click', loadLatestReport);
  }
});


function renderLatestReport(report) {
  const container = document.getElementById('latest-report');

  if (!container) {
    return;
  }

  if (!report) {
    container.innerHTML = '<p class="muted">No reports generated yet. Run a PDF text inspection first.</p>';
    return;
  }

  const decision = getReportDecision(report);
  const reason = report.deliveryDecision?.reason || 'No reason available.';
  const requiredAction = report.deliveryDecision?.requiredAction || '';
  const readinessScore = typeof report.readinessScore === 'number'
    ? `${report.readinessScore}%`
    : 'N/A';

  const htmlLink = createReportLink('Open HTML Report', report.links?.html);
  const jsonLink = createReportLink('Open JSON Data', report.links?.json);
  const markdownLink = createReportLink('Open Markdown', report.links?.markdown);
  const links = [htmlLink, jsonLink, markdownLink].filter(Boolean).join('');

  container.innerHTML = `
    <article class="latest-report-card">
      <div class="latest-report-hero">
        <span class="status-pill">${report.status || 'UNKNOWN'}</span>
        <span>${formatDate(report.generatedAt)}</span>
      </div>

      <h3>${report.folderName || report.folderPath || 'Unknown folder'}</h3>

      <div class="latest-report-grid">
        <div>
          <span>Readiness</span>
          <strong>${readinessScore}</strong>
        </div>
        <div>
          <span>PDF Health</span>
          <strong>${report.pdfHealth?.succeeded ?? 0}/${report.pdfHealth?.attempted ?? 0}</strong>
        </div>
        <div>
          <span>Failed</span>
          <strong>${report.pdfHealth?.failed ?? 0}</strong>
        </div>
      </div>

      <div class="delivery-decision">
        <strong>${decision}</strong>
        <p>${reason}</p>
        ${requiredAction ? `<small>${requiredAction}</small>` : ''}
      </div>

      <div class="report-links latest-actions">
        ${links || '<span class="muted">No report links available.</span>'}
      </div>
    </article>
  `;
}

async function loadLatestReport() {
  const container = document.getElementById('latest-report');

  if (container) {
    container.innerHTML = '<p class="muted">Loading latest report...</p>';
  }

  try {
    const response = await fetch('/api/reports/latest');
    const data = await response.json();
    renderLatestReport(data.report || null);
  } catch (error) {
    if (container) {
      container.innerHTML = '<p class="muted">Unable to load latest report.</p>';
    }
  }
}
