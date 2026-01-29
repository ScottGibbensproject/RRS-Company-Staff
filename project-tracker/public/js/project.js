/**
 * Project Tracker - Project Detail Page
 */

const API_BASE = '/api';

// State
let projectId = null;
let project = null;
let toolChart = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Get project ID from URL
    const pathParts = window.location.pathname.split('/');
    projectId = pathParts[pathParts.length - 1];

    if (!projectId || isNaN(projectId)) {
        window.location.href = '/';
        return;
    }

    loadProject();
    setupEventListeners();
});

function setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            switchTab(tab);
        });
    });

    // Settings form
    document.getElementById('projectSettingsForm').addEventListener('submit', handleSaveSettings);

    // Notes
    document.getElementById('addNoteBtn').addEventListener('click', () => {
        document.getElementById('addNoteModal').classList.add('active');
    });
    document.getElementById('closeNoteModal').addEventListener('click', closeNoteModal);
    document.getElementById('cancelNoteBtn').addEventListener('click', closeNoteModal);
    document.getElementById('addNoteModal').addEventListener('click', (e) => {
        if (e.target.id === 'addNoteModal') closeNoteModal();
    });
    document.getElementById('addNoteForm').addEventListener('submit', handleAddNote);
    document.getElementById('noteTypeFilter').addEventListener('change', loadNotes);
}

async function loadProject() {
    try {
        const response = await fetch(`${API_BASE}/projects/${projectId}`);
        if (!response.ok) throw new Error('Project not found');

        const data = await response.json();
        project = data.project;

        renderProjectHeader();
        loadSessions();
        loadTools();
        loadFiles();
        loadNotes();
    } catch (err) {
        console.error('Failed to load project:', err);
        alert('Project not found');
        window.location.href = '/';
    }
}

function renderProjectHeader() {
    document.title = `${project.name} - Project Tracker`;
    document.getElementById('projectName').textContent = project.name;
    document.getElementById('projectStatus').textContent = project.status;
    document.getElementById('projectStatus').className = `status-badge ${project.status}`;
    document.getElementById('projectPath').textContent = project.path;
    document.getElementById('totalSessions').textContent = project.session_count || 0;
    document.getElementById('totalTime').textContent = formatDuration(project.total_seconds);
    document.getElementById('lastSession').textContent = project.last_session
        ? formatRelativeTime(project.last_session)
        : 'Never';

    // Links
    if (project.github_url) {
        const link = document.getElementById('githubLink');
        link.href = project.github_url;
        link.style.display = 'inline-flex';
    }
    if (project.hosting_url) {
        const link = document.getElementById('hostingLink');
        link.href = project.hosting_url;
        link.style.display = 'inline-flex';
    }

    // Settings form
    document.getElementById('settingName').value = project.name || '';
    document.getElementById('settingDesc').value = project.description || '';
    document.getElementById('settingGithub').value = project.github_url || '';
    document.getElementById('settingHosting').value = project.hosting_url || '';
    document.getElementById('settingProvider').value = project.hosting_provider || '';
    document.getElementById('settingStatus').value = project.status || 'active';
    document.getElementById('settingColor').value = project.color || '#3b82f6';
}

async function loadSessions() {
    try {
        const response = await fetch(`${API_BASE}/projects/${projectId}/sessions?limit=50`);
        const data = await response.json();
        renderSessions(data.sessions || []);
    } catch (err) {
        console.error('Failed to load sessions:', err);
    }
}

function renderSessions(sessions) {
    const container = document.getElementById('sessionsList');

    if (sessions.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-title">No sessions yet</div>
                <p>Sessions will appear here as you work on this project</p>
            </div>
        `;
        return;
    }

    container.innerHTML = sessions.map(session => `
        <div class="session-card">
            <div class="session-header">
                <span class="session-date">${formatDate(session.started_at)}</span>
                <span class="session-duration">${formatDuration(session.duration_seconds)}</span>
            </div>
            ${session.summary ? `<div class="session-summary">${escapeHtml(session.summary)}</div>` : ''}
            <div class="session-tools" id="session-tools-${session.id}">
                <span class="tool-badge">${session.status}</span>
            </div>
        </div>
    `).join('');
}

async function loadTools() {
    try {
        const response = await fetch(`${API_BASE}/projects/${projectId}/tools`);
        const data = await response.json();
        renderToolStats(data.tools || []);
    } catch (err) {
        console.error('Failed to load tools:', err);
    }
}

function renderToolStats(tools) {
    // Table
    const tbody = document.getElementById('toolTableBody');

    if (tools.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align: center; color: var(--text-muted);">No tool usage recorded</td></tr>';
        return;
    }

    tbody.innerHTML = tools.map(tool => {
        const successRate = tool.count > 0
            ? Math.round((tool.success_count / tool.count) * 100)
            : 0;
        return `
            <tr>
                <td>${escapeHtml(tool.tool_name)}</td>
                <td>${tool.count}</td>
                <td>${successRate}%</td>
            </tr>
        `;
    }).join('');

    // Chart
    const ctx = document.getElementById('toolPieChart');
    if (toolChart) toolChart.destroy();

    const colors = [
        '#3b82f6', '#22c55e', '#eab308', '#ef4444', '#a855f7',
        '#ec4899', '#06b6d4', '#f97316', '#84cc16', '#6366f1'
    ];

    toolChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: tools.slice(0, 10).map(t => t.tool_name),
            datasets: [{
                data: tools.slice(0, 10).map(t => t.count),
                backgroundColor: colors,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#94a3b8' }
                }
            }
        }
    });
}

async function loadFiles() {
    try {
        const response = await fetch(`${API_BASE}/projects/${projectId}/files`);
        const data = await response.json();

        // Stats
        const stats = {};
        (data.stats || []).forEach(s => stats[s.change_type] = s.count);
        document.getElementById('filesCreated').textContent = stats.created || 0;
        document.getElementById('filesModified').textContent = stats.modified || 0;
        document.getElementById('filesDeleted').textContent = stats.deleted || 0;

        renderFiles(data.files || []);
    } catch (err) {
        console.error('Failed to load files:', err);
    }
}

function renderFiles(files) {
    const container = document.getElementById('filesList');

    if (files.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-title">No file changes recorded</div>
            </div>
        `;
        return;
    }

    const iconMap = { created: '+', modified: '~', deleted: '-' };

    container.innerHTML = files.map(file => `
        <div class="file-item">
            <div class="file-icon ${file.change_type}">${iconMap[file.change_type]}</div>
            <span class="file-path">${escapeHtml(file.file_path)}</span>
            <span class="file-date">${formatRelativeTime(file.created_at)}</span>
        </div>
    `).join('');
}

async function loadNotes() {
    try {
        const type = document.getElementById('noteTypeFilter').value;
        const url = `${API_BASE}/notes?project_id=${projectId}` + (type !== 'all' ? `&type=${type}` : '');
        const response = await fetch(url);
        const data = await response.json();
        renderNotes(data.notes || []);
    } catch (err) {
        console.error('Failed to load notes:', err);
    }
}

function renderNotes(notes) {
    const container = document.getElementById('notesList');

    if (notes.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-title">No notes yet</div>
                <p>Add notes to track important information</p>
            </div>
        `;
        return;
    }

    container.innerHTML = notes.map(note => `
        <div class="note-card">
            <div class="note-header">
                <span class="note-title">${note.title ? escapeHtml(note.title) : 'Note'}</span>
                <span class="note-type ${note.note_type}">${note.note_type}</span>
            </div>
            <div class="note-content">${escapeHtml(note.content)}</div>
            <div class="note-date">${formatDate(note.created_at)}</div>
        </div>
    `).join('');
}

async function handleSaveSettings(e) {
    e.preventDefault();

    const data = {
        name: document.getElementById('settingName').value,
        description: document.getElementById('settingDesc').value,
        github_url: document.getElementById('settingGithub').value,
        hosting_url: document.getElementById('settingHosting').value,
        hosting_provider: document.getElementById('settingProvider').value,
        status: document.getElementById('settingStatus').value,
        color: document.getElementById('settingColor').value
    };

    try {
        const response = await fetch(`${API_BASE}/projects/${projectId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Failed to save');

        const result = await response.json();
        project = result.project;
        renderProjectHeader();
        alert('Settings saved!');
    } catch (err) {
        alert('Failed to save settings');
    }
}

async function handleAddNote(e) {
    e.preventDefault();

    const data = {
        project_id: parseInt(projectId),
        title: document.getElementById('noteTitle').value,
        content: document.getElementById('noteContent').value,
        note_type: document.getElementById('noteType').value
    };

    try {
        const response = await fetch(`${API_BASE}/notes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Failed to add note');

        closeNoteModal();
        document.getElementById('addNoteForm').reset();
        await loadNotes();
    } catch (err) {
        alert('Failed to add note');
    }
}

function closeNoteModal() {
    document.getElementById('addNoteModal').classList.remove('active');
}

function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `tab-${tab}`);
    });
}

// Utilities
function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function formatDuration(seconds) {
    if (!seconds) return '0m';
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
}

// Parse UTC dates from SQLite (stored without timezone) to local time
function parseUTCDate(dateStr) {
    if (!dateStr) return null;
    const normalized = dateStr.replace(' ', 'T') + 'Z';
    return new Date(normalized);
}

function formatRelativeTime(dateStr) {
    if (!dateStr) return 'Never';
    const date = parseUTCDate(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = parseUTCDate(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
