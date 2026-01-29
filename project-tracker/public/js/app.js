/**
 * Project Tracker Dashboard - Main App
 */

const API_BASE = '/api';

// State
let projects = [];
let tasks = [];
let taskStats = {};
let currentFilter = 'active';
let currentTaskFilter = 'active';

// DOM Elements
const projectsGrid = document.getElementById('projectsGrid');
const activityTimeline = document.getElementById('activityTimeline');
const addProjectModal = document.getElementById('addProjectModal');
const addProjectForm = document.getElementById('addProjectForm');
const tasksList = document.getElementById('tasksList');
const tasksStats = document.getElementById('tasksStats');
const addTaskModal = document.getElementById('addTaskModal');
const addTaskForm = document.getElementById('addTaskForm');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();
    setupEventListeners();

    // Auto-refresh every 30 seconds
    setInterval(loadDashboard, 30000);
});

function setupEventListeners() {
    // Add project button
    document.getElementById('addProjectBtn').addEventListener('click', () => {
        addProjectModal.classList.add('active');
    });

    // Close modal
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);

    // Close modal on outside click
    addProjectModal.addEventListener('click', (e) => {
        if (e.target === addProjectModal) closeModal();
    });

    // Add project form
    addProjectForm.addEventListener('submit', handleAddProject);

    // Refresh button
    document.getElementById('refreshBtn').addEventListener('click', loadDashboard);

    // Filter tabs
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFilter = tab.dataset.filter;
            renderProjects();
        });
    });

    // Auto-fill project name from path
    document.getElementById('projectPath').addEventListener('blur', (e) => {
        const nameInput = document.getElementById('projectName');
        if (!nameInput.value && e.target.value) {
            const pathParts = e.target.value.replace(/\\/g, '/').split('/');
            nameInput.value = pathParts[pathParts.length - 1] || '';
        }
    });

    // Task event listeners
    document.getElementById('addTaskBtn').addEventListener('click', () => {
        populateTaskProjectDropdown();
        addTaskModal.classList.add('active');
    });

    document.getElementById('closeTaskModal').addEventListener('click', closeTaskModal);
    document.getElementById('cancelTaskBtn').addEventListener('click', closeTaskModal);

    addTaskModal.addEventListener('click', (e) => {
        if (e.target === addTaskModal) closeTaskModal();
    });

    addTaskForm.addEventListener('submit', handleAddTask);

    document.getElementById('taskFilter').addEventListener('change', (e) => {
        currentTaskFilter = e.target.value;
        loadTasks();
    });
}

async function loadDashboard() {
    await Promise.all([
        loadProjects(),
        loadSummary(),
        loadTasks(),
        loadActivity()
    ]);
}

async function loadProjects() {
    try {
        const response = await fetch(`${API_BASE}/projects`);
        const data = await response.json();
        projects = data.projects || [];
        renderProjects();
    } catch (err) {
        console.error('Failed to load projects:', err);
        projectsGrid.innerHTML = '<div class="empty-state"><div class="empty-state-title">Failed to load projects</div></div>';
    }
}

async function loadSummary() {
    try {
        const response = await fetch(`${API_BASE}/dashboard/summary`);
        const data = await response.json();

        document.getElementById('totalProjects').textContent = data.projects_count || 0;
        document.getElementById('activeSessions').textContent = data.active_sessions || 0;
        document.getElementById('todaySessions').textContent = data.today_sessions || 0;

        const hours = Math.floor((data.total_seconds || 0) / 3600);
        document.getElementById('totalHours').textContent = `${hours}h`;
    } catch (err) {
        console.error('Failed to load summary:', err);
    }
}

async function loadActivity() {
    try {
        const response = await fetch(`${API_BASE}/activity?limit=20`);
        const data = await response.json();
        renderActivity(data.activities || []);
    } catch (err) {
        console.error('Failed to load activity:', err);
        activityTimeline.innerHTML = '<div class="empty-state">Failed to load activity</div>';
    }
}

async function loadTasks() {
    try {
        const statusFilter = currentTaskFilter === 'active' ? '' : `&status=${currentTaskFilter}`;
        const response = await fetch(`${API_BASE}/tasks?${statusFilter}`);
        const data = await response.json();

        // Filter active tasks (pending + in_progress) if filter is 'active'
        if (currentTaskFilter === 'active') {
            tasks = (data.tasks || []).filter(t => t.status === 'pending' || t.status === 'in_progress');
        } else {
            tasks = data.tasks || [];
        }

        taskStats = data.stats || {};
        renderTasks();
        renderTasksStats();
    } catch (err) {
        console.error('Failed to load tasks:', err);
        tasksList.innerHTML = '<div class="empty-state">Failed to load tasks</div>';
    }
}

function renderTasks() {
    if (tasks.length === 0) {
        tasksList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">&#9745;</div>
                <div class="empty-state-title">No tasks</div>
                <p>Click "+ Add Task" to create your first task</p>
            </div>
        `;
        return;
    }

    tasksList.innerHTML = tasks.map(task => `
        <div class="task-item ${task.status} priority-${task.priority}" data-id="${task.id}">
            <button class="task-checkbox ${task.status === 'completed' ? 'checked' : ''}"
                    onclick="toggleTaskComplete(${task.id}, '${task.status}')"
                    title="${task.status === 'completed' ? 'Mark incomplete' : 'Mark complete'}">
                ${task.status === 'completed' ? '&#10004;' : ''}
            </button>
            <div class="task-content">
                <div class="task-title">${escapeHtml(task.title)}</div>
                ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
                <div class="task-meta">
                    ${task.project_name ? `
                        <span class="task-project">
                            <span class="task-project-dot" style="background: ${task.project_color || '#3b82f6'}"></span>
                            ${escapeHtml(task.project_name)}
                        </span>
                    ` : ''}
                    ${task.due_date ? `<span class="task-due ${isOverdue(task.due_date, task.status) ? 'overdue' : ''}">${formatDueDate(task.due_date)}</span>` : ''}
                    <span class="task-priority priority-${task.priority}">${task.priority}</span>
                </div>
            </div>
            <button class="task-delete" onclick="deleteTask(${task.id})" title="Delete task">&times;</button>
        </div>
    `).join('');
}

function renderTasksStats() {
    if (!taskStats.total) {
        tasksStats.innerHTML = '';
        return;
    }

    tasksStats.innerHTML = `
        <div class="task-stat">
            <span class="task-stat-value">${taskStats.pending || 0}</span>
            <span class="task-stat-label">Pending</span>
        </div>
        <div class="task-stat">
            <span class="task-stat-value">${taskStats.in_progress || 0}</span>
            <span class="task-stat-label">In Progress</span>
        </div>
        <div class="task-stat">
            <span class="task-stat-value">${taskStats.completed || 0}</span>
            <span class="task-stat-label">Completed</span>
        </div>
        ${taskStats.overdue > 0 ? `
            <div class="task-stat overdue">
                <span class="task-stat-value">${taskStats.overdue}</span>
                <span class="task-stat-label">Overdue</span>
            </div>
        ` : ''}
    `;
}

function populateTaskProjectDropdown() {
    const select = document.getElementById('taskProject');
    select.innerHTML = '<option value="">No project</option>' +
        projects.map(p => `<option value="${p.id}">${escapeHtml(p.name)}</option>`).join('');
}

async function handleAddTask(e) {
    e.preventDefault();

    const data = {
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        project_id: document.getElementById('taskProject').value || null,
        priority: document.getElementById('taskPriority').value,
        due_date: document.getElementById('taskDueDate').value || null
    };

    try {
        const response = await fetch(`${API_BASE}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Failed to create task');
        }

        closeTaskModal();
        addTaskForm.reset();
        await loadTasks();
    } catch (err) {
        alert(err.message);
    }
}

async function toggleTaskComplete(id, currentStatus) {
    try {
        const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
        const response = await fetch(`${API_BASE}/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });

        if (!response.ok) throw new Error('Failed to update task');
        await loadTasks();
    } catch (err) {
        console.error('Failed to toggle task:', err);
    }
}

async function deleteTask(id) {
    if (!confirm('Delete this task?')) return;

    try {
        const response = await fetch(`${API_BASE}/tasks/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete task');
        await loadTasks();
    } catch (err) {
        console.error('Failed to delete task:', err);
    }
}

function closeTaskModal() {
    addTaskModal.classList.remove('active');
}

function isOverdue(dueDate, status) {
    if (status === 'completed' || status === 'cancelled') return false;
    return new Date(dueDate) < new Date().setHours(0, 0, 0, 0);
}

function formatDueDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.getTime() === today.getTime()) return 'Today';
    if (date.getTime() === tomorrow.getTime()) return 'Tomorrow';

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function renderProjects() {
    const filtered = currentFilter === 'all'
        ? projects
        : projects.filter(p => p.status === currentFilter);

    if (filtered.length === 0) {
        projectsGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">&#128193;</div>
                <div class="empty-state-title">No projects yet</div>
                <p>Click "Add Project" to register your first project</p>
            </div>
        `;
        return;
    }

    projectsGrid.innerHTML = filtered.map(project => `
        <div class="project-card" onclick="goToProject(${project.id})" style="--project-color: ${project.color || '#3b82f6'}">
            <div class="project-header">
                <span class="project-name">${escapeHtml(project.name)}</span>
                <span class="project-status ${project.status}">${project.status}</span>
            </div>
            <div class="project-path">${project.description === '[Path Hidden]' ? '[Path Hidden]' : escapeHtml(project.path)}</div>
            <div class="project-stats">
                <div class="project-stat">
                    <span class="project-stat-value">${project.session_count || 0}</span>
                    <span class="project-stat-label">Sessions</span>
                </div>
                <div class="project-stat">
                    <span class="project-stat-value">${formatDuration(project.total_seconds)}</span>
                    <span class="project-stat-label">Time</span>
                </div>
                <div class="project-stat">
                    <span class="project-stat-value">${project.total_notes || '-'}</span>
                    <span class="project-stat-label">Notes</span>
                </div>
            </div>
            ${project.last_session ? `
                <div class="project-last-session">
                    Last session: ${formatRelativeTime(project.last_session)}
                </div>
            ` : ''}
        </div>
    `).join('');
}

function renderActivity(activities) {
    if (activities.length === 0) {
        activityTimeline.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-title">No activity yet</div>
                <p>Activity will appear here as you work on projects</p>
            </div>
        `;
        return;
    }

    const iconMap = {
        session_start: '&#9654;',
        session_end: '&#9632;',
        tool_use: '&#9881;',
        file_change: '&#128196;',
        note_added: '&#128221;',
        project_registered: '&#10004;',
        task_added: '&#9745;',
        task_completed: '&#10003;',
        task_updated: '&#9998;'
    };

    activityTimeline.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon ${activity.activity_type}">${iconMap[activity.activity_type] || '&#8226;'}</div>
            <div class="activity-content">
                <div class="activity-title">${escapeHtml(activity.title)}</div>
                ${activity.description ? `<div class="activity-description">${escapeHtml(activity.description)}</div>` : ''}
                <div class="activity-meta">
                    <span class="activity-project">
                        <span class="activity-project-dot" style="background: ${activity.project_color || '#3b82f6'}"></span>
                        ${escapeHtml(activity.project_name)}
                    </span>
                    <span>${formatRelativeTime(activity.created_at)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

async function handleAddProject(e) {
    e.preventDefault();

    const data = {
        path: document.getElementById('projectPath').value,
        name: document.getElementById('projectName').value,
        description: document.getElementById('projectDesc').value,
        github_url: document.getElementById('githubUrl').value,
        hosting_url: document.getElementById('hostingUrl').value,
        hosting_provider: document.getElementById('hostingProvider').value,
        color: document.getElementById('projectColor').value
    };

    try {
        const response = await fetch(`${API_BASE}/projects`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Failed to create project');
        }

        closeModal();
        addProjectForm.reset();
        document.getElementById('projectColor').value = '#3b82f6';
        await loadDashboard();
    } catch (err) {
        alert(err.message);
    }
}

function closeModal() {
    addProjectModal.classList.remove('active');
}

function goToProject(id) {
    window.location.href = `/project/${id}`;
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
    if (hours > 0) return `${hours}h`;
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
