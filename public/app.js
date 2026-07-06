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

function createReportLink(label, href) {
  if (!href) {
    return '';
  }

  return `<a href="${href}" target="_blank" rel="noreferrer">${label}</a>`;
}

function renderRecentReports(reports) {
  const container = document.getElementById('recent-reports');

  if (!container) {
    return;
  }

  if (!reports || reports.length === 0) {
    container.innerHTML = '<p class="muted">No reports generated yet. Run a PDF text inspection first.</p>';
    return;
  }

  container.innerHTML = reports.map((report) => {
    const status = report.status || 'UNKNOWN';
    const decision = report.deliveryDecision?.decision || 'NO DECISION';
    const reason = report.deliveryDecision?.reason || 'No reason available.';
    const readinessScore = typeof report.readinessScore === 'number'
      ? `${report.readinessScore}%`
      : 'N/A';

    const htmlLink = createReportLink('Open HTML', report.links?.html);
    const jsonLink = createReportLink('Open JSON', report.links?.json);
    const markdownLink = createReportLink('Open Markdown', report.links?.markdown);

    const links = [htmlLink, jsonLink, markdownLink].filter(Boolean).join('');

    return `
      <article class="report-card">
        <div class="report-card-top">
          <span class="status-pill">${status}</span>
          <span class="report-date">${formatDate(report.generatedAt)}</span>
        </div>

        <h3>${report.folderPath || 'Unknown folder'}</h3>

        <div class="report-metrics">
          <span>Readiness: <strong>${readinessScore}</strong></span>
          <span>PDFs: <strong>${report.pdfFiles ?? 0}</strong></span>
          <span>Failed: <strong>${report.pdfHealth?.failed ?? 0}</strong></span>
        </div>

        <div class="delivery-decision">
          <strong>${decision}</strong>
          <p>${reason}</p>
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
    renderRecentReports(data.reports || []);
  } catch (error) {
    if (container) {
      container.innerHTML = '<p class="muted">Unable to load recent reports.</p>';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadRecentReports();

  const refreshButton = document.getElementById('refresh-reports');

  if (refreshButton) {
    refreshButton.addEventListener('click', loadRecentReports);
  }
});
