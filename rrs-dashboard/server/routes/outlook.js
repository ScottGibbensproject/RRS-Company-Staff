const express = require('express');
const axios = require('axios');
const router = express.Router();

// Monitored email accounts
const MONITORED_EMAILS = (process.env.OUTLOOK_MONITORED_EMAILS || '')
  .split(',')
  .map(email => email.trim().toLowerCase())
  .filter(email => email);

// Microsoft Graph API base URL
const GRAPH_API = 'https://graph.microsoft.com/v1.0';

// Token cache
let tokenCache = {
  accessToken: null,
  expiresAt: null
};

// Get access token using client credentials flow
async function getAccessToken() {
  // Check if we have a valid cached token
  if (tokenCache.accessToken && tokenCache.expiresAt > Date.now()) {
    return tokenCache.accessToken;
  }

  const tenantId = process.env.OUTLOOK_TENANT_ID;
  const clientId = process.env.OUTLOOK_CLIENT_ID;
  const clientSecret = process.env.OUTLOOK_CLIENT_SECRET;

  if (!tenantId || !clientId || !clientSecret) {
    throw new Error('Outlook credentials not configured');
  }

  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

  const params = new URLSearchParams();
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('scope', 'https://graph.microsoft.com/.default');
  params.append('grant_type', 'client_credentials');

  const response = await axios.post(tokenUrl, params);

  tokenCache = {
    accessToken: response.data.access_token,
    expiresAt: Date.now() + (response.data.expires_in * 1000) - 60000 // Refresh 1 min early
  };

  return tokenCache.accessToken;
}

// Fetch emails for a specific user
async function fetchUserEmails(userEmail, accessToken) {
  try {
    const response = await axios.get(
      `${GRAPH_API}/users/${userEmail}/mailFolders/inbox/messages`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        params: {
          '$top': 20,
          '$select': 'id,subject,from,receivedDateTime,isRead,importance,bodyPreview',
          '$orderby': 'receivedDateTime desc',
          '$filter': 'isRead eq false'
        }
      }
    );
    return response.data.value || [];
  } catch (error) {
    console.error(`Failed to fetch emails for ${userEmail}:`, error.message);
    return [];
  }
}

// Get unread count for a specific user
async function getUnreadCount(userEmail, accessToken) {
  try {
    const response = await axios.get(
      `${GRAPH_API}/users/${userEmail}/mailFolders/inbox`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        params: {
          '$select': 'unreadItemCount'
        }
      }
    );
    return response.data.unreadItemCount || 0;
  } catch (error) {
    console.error(`Failed to get unread count for ${userEmail}:`, error.message);
    return 0;
  }
}

// Get summary (unread counts)
router.get('/summary', async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    let totalUnread = 0;

    for (const email of MONITORED_EMAILS) {
      const count = await getUnreadCount(email, accessToken);
      totalUnread += count;
    }

    res.json({
      unread: totalUnread,
      accounts: MONITORED_EMAILS.length,
      status: 'connected'
    });
  } catch (error) {
    console.error('Outlook summary error:', error.message);
    res.json({
      unread: 0,
      accounts: MONITORED_EMAILS.length,
      status: 'error',
      error: error.message
    });
  }
});

// Get recent emails from all monitored accounts
router.get('/emails', async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    let allEmails = [];

    for (const email of MONITORED_EMAILS) {
      const emails = await fetchUserEmails(email, accessToken);
      // Add account info to each email
      const emailsWithAccount = emails.map(e => ({
        ...e,
        account: email
      }));
      allEmails = allEmails.concat(emailsWithAccount);
    }

    // Sort by date, newest first
    allEmails.sort((a, b) => new Date(b.receivedDateTime) - new Date(a.receivedDateTime));

    // Format for dashboard
    const formatted = allEmails.slice(0, 30).map(email => ({
      id: email.id,
      type: 'email',
      icon: '📧',
      title: email.from?.emailAddress?.name || email.from?.emailAddress?.address || 'Unknown',
      subtitle: email.subject || '(No subject)',
      preview: email.bodyPreview,
      time: email.receivedDateTime,
      priority: email.importance === 'high',
      source: 'outlook',
      account: email.account,
      isRead: email.isRead
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Outlook emails error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get status
router.get('/status', async (req, res) => {
  const configured = !!(
    process.env.OUTLOOK_CLIENT_ID &&
    process.env.OUTLOOK_CLIENT_SECRET &&
    process.env.OUTLOOK_TENANT_ID
  );

  if (!configured) {
    return res.json({
      status: 'pending',
      message: 'Outlook credentials not configured',
      accounts: MONITORED_EMAILS
    });
  }

  try {
    await getAccessToken();
    res.json({
      status: 'connected',
      accounts: MONITORED_EMAILS
    });
  } catch (error) {
    res.json({
      status: 'error',
      message: error.message,
      accounts: MONITORED_EMAILS
    });
  }
});

module.exports = router;
