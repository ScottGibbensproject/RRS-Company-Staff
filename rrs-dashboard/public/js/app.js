// RRS Dashboard - Main Application

class Dashboard {
  constructor() {
    this.init();
  }

  async init() {
    this.bindEvents();
    await this.loadData();

    // Auto-refresh every 5 minutes
    setInterval(() => this.loadData(), 5 * 60 * 1000);
  }

  bindEvents() {
    // Refresh button
    document.getElementById('refreshBtn').addEventListener('click', () => {
      this.loadData();
    });

    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', () => {
      this.logout();
    });

    // Filter tabs
    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        this.filterInbox(e.target.dataset.filter);
      });
    });
  }

  async loadData() {
    await Promise.all([
      this.loadSummary(),
      this.loadInbox()
    ]);
  }

  async loadSummary() {
    try {
      const res = await fetch('/api/summary');
      const data = await res.json();

      // Update email count
      this.updateCard('emails', data.emails.unread, data.emails.status);

      // Update leads count
      this.updateCard('leads', data.leads.new, data.leads.status);

      // Update tasks count
      this.updateCard('tasks', data.tasks.due, data.tasks.status);

      // Update tickets count
      this.updateCard('tickets', data.tickets.open, data.tickets.status);

      // Update merchant apps count
      this.updateCard('merchants', data.merchants.new, data.merchants.status);

      // Update cloud memory and CPU
      document.getElementById('cloudMemory').textContent = data.cloud.memory;
      document.getElementById('cloudCpu').textContent = data.cloud.cpu;
      this.updateCardStatus('cloud', data.cloud.status);

    } catch (error) {
      console.error('Failed to load summary:', error);
    }
  }

  updateCard(type, value, status) {
    const valueId = type + 'Count';
    const el = document.getElementById(valueId);
    if (el) {
      el.textContent = value;
    }
    this.updateCardStatus(type, status);
  }

  updateCardStatus(type, status) {
    const card = document.querySelector(`.summary-card[data-type="${type}"]`);
    if (card) {
      const statusEl = card.querySelector('.card-status');
      statusEl.className = 'card-status ' + status;
    }
  }

  async loadInbox() {
    const list = document.getElementById('inboxList');

    try {
      const res = await fetch('/api/inbox');
      const items = await res.json();

      if (items.length === 0) {
        list.innerHTML = '<div class="empty-state">No items to show</div>';
        return;
      }

      list.innerHTML = items.map(item => this.renderInboxItem(item)).join('');
      this.allItems = items;

    } catch (error) {
      console.error('Failed to load inbox:', error);
      list.innerHTML = '<div class="empty-state">Failed to load inbox</div>';
    }
  }

  renderInboxItem(item) {
    const timeAgo = this.formatTimeAgo(item.time);
    const priorityClass = item.priority ? 'priority' : '';

    return `
      <div class="inbox-item ${priorityClass}" data-type="${item.type}" data-id="${item.id}">
        <div class="item-icon">${item.icon}</div>
        <div class="item-content">
          <div class="item-title">${this.escapeHtml(item.title)}</div>
          <div class="item-subtitle">${this.escapeHtml(item.subtitle)}</div>
        </div>
        <div class="item-time">${timeAgo}</div>
      </div>
    `;
  }

  filterInbox(filter) {
    if (!this.allItems) return;

    const list = document.getElementById('inboxList');
    let filtered = this.allItems;

    if (filter === 'priority') {
      filtered = this.allItems.filter(item => item.priority);
    } else if (filter !== 'all') {
      filtered = this.allItems.filter(item => item.type === filter);
    }

    if (filtered.length === 0) {
      list.innerHTML = '<div class="empty-state">No items match this filter</div>';
    } else {
      list.innerHTML = filtered.map(item => this.renderInboxItem(item)).join('');
    }
  }

  formatTimeAgo(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = Math.floor((now - time) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;

    return time.toLocaleDateString();
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  async logout() {
    try {
      const res = await fetch('/auth/logout', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        window.location.href = data.redirect;
      }
    } catch (error) {
      console.error('Logout failed:', error);
      window.location.href = '/login.html';
    }
  }
}

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new Dashboard();
});
