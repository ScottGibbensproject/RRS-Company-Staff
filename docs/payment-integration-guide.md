# RRS Payment Integration Guide

This guide covers integrating Dejavoo/iPOSpays payments via the RR Pay Gateway into any RRS project.

## Quick Reference

| Item | Value |
|------|-------|
| **Gateway URL** | `https://rr-pay-production.up.railway.app` |
| **SDK Version** | 1.1.0 |
| **Test Card** | `4111 1111 1111 1111` |
| **Decline Card** | `4000 0000 0000 0002` |
| **Source Project** | `C:\Users\scott\Desktop\epi-pay-gateway` |

---

## SDK Integration

### 1. Include the SDK

```html
<script src="https://rr-pay-production.up.railway.app/sdk/rrpay.js"></script>
```

### 2. Initialize

```javascript
RRPay.init('pk_live_YOUR_MERCHANT_KEY');

// For local development, override the API base:
RRPay._config.apiBase = 'http://localhost:3000';
```

---

## One-Time Payments

### Simple Checkout

```javascript
RRPay.checkout({
    amount: 99.99,
    description: 'Product Purchase',
    customerEmail: 'customer@example.com',
    onSuccess: (result) => {
        console.log('Payment successful!', result);
        // result.transactionId, result.amount, etc.
    },
    onError: (error) => {
        console.error('Payment failed:', error.message);
    },
    onClose: () => {
        console.log('Modal closed');
    }
});
```

### Payment Button

```javascript
RRPay.createButton('#pay-button-container', {
    amount: 49.99,
    description: 'Monthly Service',
    onSuccess: (result) => {
        window.location.href = '/thank-you?txn=' + result.transactionId;
    }
});
```

### Checkout Options

| Option | Type | Description |
|--------|------|-------------|
| `amount` | number | **Required.** Amount in dollars (e.g., 99.99) |
| `description` | string | Line item description |
| `customerEmail` | string | Pre-fill customer email |
| `metadata` | object | Custom data attached to transaction |
| `onSuccess` | function | Called on successful payment |
| `onError` | function | Called on payment failure |
| `onClose` | function | Called when modal is closed |

---

## Subscriptions

### Create Subscription

```javascript
RRPay.createSubscription({
    amount: 29.99,
    interval: 'month',
    trialDays: 14,
    customerEmail: 'customer@example.com',
    onSuccess: (subscription) => {
        console.log('Subscribed!', subscription);
        // subscription.id, subscription.status, subscription.trialEnd
    }
});
```

### Subscription Button

```javascript
RRPay.createSubscriptionButton('#subscribe-container', {
    amount: 29.99,
    interval: 'month',
    trialDays: 14,
    buttonText: 'Start Free Trial',
    onSuccess: (subscription) => {
        window.location.href = '/welcome?sub=' + subscription.id;
    }
});
```

### Billing Intervals

| Interval | Code | Example |
|----------|------|---------|
| Weekly | `interval: 'week'` | Every 7 days |
| Bi-weekly | `interval: 'week', intervalCount: 2` | Every 14 days |
| Monthly | `interval: 'month'` | Every month |
| Quarterly | `interval: 'month', intervalCount: 3` | Every 3 months |
| Yearly | `interval: 'year'` | Every year |

### Subscription Options

| Option | Type | Description |
|--------|------|-------------|
| `amount` | number | **Required.** Recurring amount |
| `interval` | string | `week`, `month`, or `year` |
| `intervalCount` | number | Multiplier (default: 1) |
| `trialDays` | number | Free trial days (0 = no trial) |
| `customerEmail` | string | Customer email |
| `onSuccess` | function | Called on successful subscription |
| `onError` | function | Called on failure |

---

## API Endpoints

Base URL: `https://rr-pay-production.up.railway.app`

### Payments

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/checkout/sessions` | Create checkout session |
| POST | `/api/v1/webhooks/payment` | Payment webhook (Dejavoo) |

### Subscriptions

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/subscriptions` | Create subscription |
| GET | `/api/v1/subscriptions/:id` | Get subscription details |
| POST | `/api/v1/subscriptions/:id/cancel` | Cancel subscription |
| POST | `/api/v1/subscriptions/:id/update-payment` | Update payment method |

### Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/merchants` | Create new merchant |
| GET | `/api/v1/dashboard/batches` | Fetch batch reports |
| GET | `/api/v1/dashboard/summary` | Aggregated summary |

### Webhooks

Your server receives POST webhooks with this payload:

```json
{
    "event": "payment.completed",
    "data": {
        "transactionId": "txn_abc123",
        "amount": 99.99,
        "status": "succeeded",
        "customerEmail": "customer@example.com",
        "metadata": {}
    },
    "signature": "sha256=..."
}
```

Verify webhooks using HMAC-SHA256 with your webhook secret.

---

## Dejavoo Configuration

### Environments

| Environment | HPP Endpoint |
|-------------|--------------|
| **Sandbox** | `https://payment.ipospays.tech/api/v1/external-payment-transaction` |
| **Production** | `https://payment.ipospays.com/api/v1/external-payment-transaction` |

### Required Credentials

| Credential | Description |
|------------|-------------|
| TPN | Terminal ID from Dejavoo portal |
| Auth Token | JWT v2 token containing: `tpn`, `email`, `iat`, `exp` |

### Transaction Types

| Type | Code | Description |
|------|------|-------------|
| Sale | `1` | Charge the card |
| Validation | `2` | Tokenize only ($0 charge) |

---

## Design System

### CSS Variables (Rate Remover Brand)

```css
:root {
    /* Brand Colors */
    --primary: #E05A33;
    --primary-dark: #C74A28;
    --primary-light: #F07050;
    --secondary: #2D2D2D;
    --accent: #4CAF50;

    /* Gradients */
    --gradient-primary: linear-gradient(135deg, #E05A33 0%, #F07050 50%, #FF8A65 100%);
    --gradient-hero: linear-gradient(135deg, #2D2D2D 0%, #3D3D3D 50%, #4D4D4D 100%);

    /* Surfaces */
    --bg-primary: #f6f9fc;
    --bg-secondary: #ffffff;
    --bg-tertiary: #f1f5f9;

    /* Text */
    --text-primary: #0a2540;
    --text-secondary: #425466;
    --text-muted: #8898aa;

    /* Shadows */
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06);
    --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03);
    --shadow-lg: 0 10px 40px rgba(0,0,0,0.08), 0 2px 10px rgba(0,0,0,0.04);

    /* Border Radius */
    --radius-sm: 6px;
    --radius-md: 10px;
    --radius-lg: 16px;
    --radius-xl: 24px;
}
```

### Fonts

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

- **UI Font:** Inter
- **Code Font:** JetBrains Mono

---

## Complete Example: Checkout Page

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Checkout - My Rate Remover</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Inter', sans-serif;
            background: #f6f9fc;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .checkout-card {
            background: white;
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.08);
            max-width: 400px;
            width: 100%;
        }
        .checkout-card h1 {
            font-size: 24px;
            margin-bottom: 8px;
        }
        .checkout-card .price {
            font-size: 36px;
            font-weight: 700;
            color: #E05A33;
            margin-bottom: 24px;
        }
        .checkout-card .price span {
            font-size: 16px;
            color: #8898aa;
            font-weight: 400;
        }
        #payment-button {
            width: 100%;
            margin-top: 16px;
        }
    </style>
</head>
<body>
    <div class="checkout-card">
        <h1>Pipeline Builder Pro</h1>
        <div class="price">$29 <span>/month</span></div>
        <ul>
            <li>Lead generation tools</li>
            <li>GHL integration</li>
            <li>Campaign templates</li>
        </ul>
        <div id="payment-button"></div>
    </div>

    <script src="https://rr-pay-production.up.railway.app/sdk/rrpay.js"></script>
    <script>
        RRPay.init('pk_live_YOUR_KEY');

        RRPay.createSubscriptionButton('#payment-button', {
            amount: 29.00,
            interval: 'month',
            trialDays: 14,
            buttonText: 'Start 14-Day Free Trial',
            onSuccess: (subscription) => {
                window.location.href = '/welcome?subscription_id=' + subscription.id;
            },
            onError: (error) => {
                alert('Payment failed: ' + error.message);
            }
        });
    </script>
</body>
</html>
```

---

## Testing

### Test Mode

Use test merchant key:
```javascript
RRPay.init('pk_test_demo123');
```

### Test Cards

| Card Number | Result |
|-------------|--------|
| `4111 1111 1111 1111` | Approved |
| `4000 0000 0000 0002` | Declined |

Use any future expiry date and any 3-digit CVV.

---

## Support Contacts

| Type | Contact |
|------|---------|
| **Technical** | devsupport@denovosystem.com |
| **Account** | support@dejavoo.io |
| **Phone** | 1-877-DJVOSYS (358-6797) |

---

## Source Files Reference

For detailed implementation, refer to:

| File | Location |
|------|----------|
| **Checkout Template** | `C:\Users\scott\Desktop\epi-pay-gateway\examples\checkout-demo.html` |
| Server API | `C:\Users\scott\Desktop\epi-pay-gateway\server\index.js` |
| SDK Source | `C:\Users\scott\Desktop\epi-pay-gateway\public\sdk\rrpay.js` |
| Demo Pages | `C:\Users\scott\Desktop\epi-pay-gateway\examples\` |
| Full Docs | `C:\Users\scott\Desktop\epi-pay-gateway\CLAUDE.md` |

### Checkout Template Features

The `checkout-demo.html` provides a production-ready checkout form:

- **Plan Selection** - Radio-style cards with pricing
- **Customer Form** - Name and email inputs with validation
- **Order Summary** - Sticky sidebar with totals
- **RR Pay SDK** - Full subscription flow integration
- **Success State** - Animated confirmation with subscription details
- **Toast Notifications** - Success/error feedback
- **Dark Mode** - Theme toggle with localStorage persistence
- **Responsive** - Mobile-friendly grid layout

Copy this file as a starting point for myrateremover.com checkout.

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment mode | - |
| `DEJAVOO_ENV` | `sandbox` or `production` | sandbox |
| `BASE_URL` | Callback URL base | http://localhost:3000 |
| `CRON_SECRET` | Secret for recurring billing endpoint | - |
| `DEBUG_SECRET` | Protects debug endpoints | rr2024debug |
| `DEMO_TPN` | Demo merchant Dejavoo TPN | 936224749981 |
| `DEMO_AUTH_TOKEN` | Demo merchant auth token (JWT v2) | (hardcoded) |

---

## Architecture

```
Reseller Website (SDK) → RR Pay Gateway → Dejavoo/iPOSpays → Card Networks
                              ↓
                      Webhooks back to Reseller
```

### Payment Flow

1. SDK calls `/api/v1/checkout/sessions`
2. Server creates Dejavoo HPP session
3. SDK opens modal with iframe to Dejavoo
4. User enters card on Dejavoo's secure page
5. Dejavoo POSTs webhook to gateway
6. Gateway forwards webhook to merchant

---

## Debug & Cron Endpoints

### Debug (requires `?key=DEBUG_SECRET`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/debug/env` | Show environment variables |
| GET | `/api/debug/dejavoo-payload` | Show Dejavoo request structure |

### Cron

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/cron/process-subscriptions` | Process recurring billing |

Requires `X-Cron-Secret` header. Set up hourly:

```bash
# crontab -e
0 * * * * curl -X POST https://rr-pay-production.up.railway.app/api/v1/cron/process-subscriptions -H "X-Cron-Secret: your-secret"
```

---

## Code Conventions

### ID Generation

```javascript
generateId(prefix)    // Returns: `${prefix}_${12-byte-hex}` (e.g., "sub_abc123def456")
generateTagId(prefix) // Returns: `${prefix}${6-byte-hex}` (max 20 chars for Dejavoo)
```

### Authentication Headers

| Header | Purpose |
|--------|---------|
| `X-Merchant-Key` | Merchant public key for API authentication |
| `X-RRPay-Signature` | HMAC-SHA256 webhook signature |
| `X-Cron-Secret` | Secret for cron endpoint |

### Data Storage (In-Memory)

```javascript
db = {
  merchants: Map<publicKey, MerchantObject>,
  sessions: Map<sessionId, SessionObject>,
  subscriptions: Map<subscriptionId, SubscriptionObject>,
  customers: Map<customerId, CustomerObject>,
  invoices: Map<invoiceId, InvoiceObject>
}
```

**Note:** Data is lost on server restart. Production should use PostgreSQL/MySQL.

---

## Security

### Implemented

- HMAC-SHA256 webhook signatures
- X-Merchant-Key header authentication
- Debug endpoint protection with secret key
- Modal-based card entry (cards never touch gateway)

### Production TODOs

- Add authentication to admin endpoints
- Replace in-memory storage with database
- Implement retry logic for failed charges
- Add API rate limiting
- Set up proper logging and monitoring

---

## Deployment

**Platform:** Railway (Nixpacks)

```toml
# nixpacks.toml
[variables]
NODE_ENV = "production"

[phases.setup]
nixPkgs = ["nodejs-18_x"]

[phases.install]
cmds = ["npm install"]

[start]
cmd = "node server/index.js"
```

### Development Commands

```bash
# Install dependencies
npm install

# Start server
npm start

# Check JavaScript syntax
node --check server/index.js

# Kill port if occupied
npx kill-port 3000

# Test in browser
open http://localhost:3000/examples/
```

---

## Common Development Tasks

### Adding a New API Endpoint

1. Add route in `server/index.js`
2. Authenticate with `getMerchant(req)` helper
3. Return JSON response with appropriate status code
4. Update API documentation

### Modifying the SDK

1. Edit `public/sdk/rrpay.js`
2. Test in `examples/index.html`
3. Update version if needed

### Updating Frontend Pages

1. Follow CSS variables in design system
2. Support dark mode with `[data-theme="dark"]`
3. Use Toast notifications, not alerts
4. Test responsive design at 768px and 1024px breakpoints
