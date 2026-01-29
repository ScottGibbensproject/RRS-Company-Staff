const express = require('express');
const router = express.Router();

// Import integration routes
const gmailRoutes = require('./gmail');
const gcloudRoutes = require('./gcloud');
// const vonageRoutes = require('./vonage');
// const ghlRoutes = require('./ghl');
// const trelloRoutes = require('./trello');

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Dashboard summary - aggregates all data sources
router.get('/summary', async (req, res) => {
  try {
    const axios = require('axios');
    const baseUrl = `http://localhost:${process.env.PORT || 3000}`;

    // Fetch Gmail data
    let emailData = { unread: 0, status: 'pending' };
    try {
      const gmailRes = await axios.get(`${baseUrl}/api/gmail/summary`);
      emailData = gmailRes.data;
    } catch (e) {
      // Gmail not configured or error
    }

    // Fetch Google Cloud data
    let cloudData = { memory: 0, cpu: 0, status: 'pending' };
    try {
      const gcloudRes = await axios.get(`${baseUrl}/api/gcloud/summary`);
      cloudData = gcloudRes.data;
    } catch (e) {
      // GCloud not configured or error
    }

    const summary = {
      emails: {
        unread: emailData.unread || 0,
        label: 'Emails',
        status: emailData.status || 'pending'
      },
      calls: {
        missed: 0,
        label: 'Calls',
        status: 'pending'
      },
      sms: {
        unread: 0,
        label: 'SMS',
        status: 'pending'
      },
      leads: {
        new: 0,
        label: 'Leads',
        status: 'pending'
      },
      tasks: {
        due: 0,
        label: 'Tasks',
        status: 'pending'
      },
      tickets: {
        open: 0,
        label: 'Tickets',
        status: 'pending'
      },
      merchants: {
        new: 0,
        label: 'Merchant Apps',
        status: 'pending'
      },
      cloud: {
        memory: cloudData.memory || 0,
        cpu: cloudData.cpu || 0,
        label: 'Cloud',
        status: cloudData.status || 'pending'
      }
    };

    res.json(summary);
  } catch (error) {
    console.error('Summary error:', error);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

// Priority inbox - combined feed from all sources
router.get('/inbox', async (req, res) => {
  try {
    let allItems = [];

    // Fetch Gmail emails
    try {
      const axios = require('axios');
      const gmailRes = await axios.get(`http://localhost:${process.env.PORT || 3000}/api/gmail/emails`);
      if (Array.isArray(gmailRes.data)) {
        allItems = allItems.concat(gmailRes.data);
      }
    } catch (e) {
      // Gmail not configured
    }

    // Sort by time, newest first
    allItems.sort((a, b) => new Date(b.time) - new Date(a.time));

    // If no items, show placeholder
    if (allItems.length === 0) {
      allItems = [
        {
          id: 1,
          type: 'info',
          icon: 'ℹ️',
          title: 'Connect your integrations',
          subtitle: 'Click the email card or visit /api/gmail/auth to connect Gmail',
          time: new Date().toISOString(),
          priority: false,
          source: 'system'
        }
      ];
    }

    res.json(allItems);
  } catch (error) {
    console.error('Inbox error:', error);
    res.status(500).json({ error: 'Failed to fetch inbox' });
  }
});

// Mount integration routes
router.use('/gmail', gmailRoutes);
router.use('/gcloud', gcloudRoutes);
// router.use('/vonage', vonageRoutes);
// router.use('/ghl', ghlRoutes);
// router.use('/trello', trelloRoutes);

module.exports = router;
