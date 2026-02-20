// Shared utilities for Development Overview

/**
 * Format date for display
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @returns {string} Formatted date
 */
function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Render a changelog entry (with date)
 * @param {Object} item - Item with date, title, description
 * @returns {string} HTML string
 */
function renderChangelogEntry(item) {
  return `
    <article class="update-entry">
      <time class="update-date">${formatDate(item.date)}</time>
      <h2 class="update-title">${escapeHtml(item.title)}</h2>
      <p class="update-description">${escapeHtml(item.description)}</p>
    </article>
  `;
}

/**
 * Render a feature card (for In Progress / Upcoming)
 * @param {Object} item - Item with title, description, optional estimatedDate
 * @param {string} type - 'in-progress' or 'upcoming'
 * @returns {string} HTML string
 */
function renderFeatureCard(item, type) {
  const badgeText = type === 'in-progress' ? 'In Progress' : 'Coming Soon';
  const estimatedDateHtml = item.estimatedDate
    ? `<p class="feature-card-date">Estimated: ${formatDate(item.estimatedDate)}</p>`
    : '';
  return `
    <article class="feature-card">
      <span class="status-badge ${type}">${badgeText}</span>
      <h3 class="feature-card-title">${escapeHtml(item.title)}</h3>
      <p class="feature-card-description">${escapeHtml(item.description)}</p>
      ${estimatedDateHtml}
    </article>
  `;
}

/**
 * Render an issue card (for Known Issues)
 * @param {Object} item - Item with title, description, dateReported, status, dateResolved
 * @returns {string} HTML string
 */
function renderIssueCard(item) {
  const isResolved = item.status === 'resolved';
  const badgeClass = isResolved ? 'resolved' : 'researching';
  const badgeText = isResolved ? 'Resolved' : 'Researching';

  let dateHtml = `<span class="issue-date">Reported: ${formatDate(item.dateReported)}</span>`;
  if (isResolved && item.dateResolved) {
    dateHtml += `<span class="issue-date resolved-date">Resolved: ${formatDate(item.dateResolved)}</span>`;
  }

  return `
    <article class="issue-card ${isResolved ? 'issue-resolved' : ''}">
      <span class="status-badge ${badgeClass}">${badgeText}</span>
      <h3 class="issue-card-title">${escapeHtml(item.title)}</h3>
      <p class="issue-card-description">${escapeHtml(item.description)}</p>
      <div class="issue-dates">${dateHtml}</div>
    </article>
  `;
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Raw text
 * @returns {string} Escaped HTML
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
