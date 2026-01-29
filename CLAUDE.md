# RRS Company - Claude Code Guide

This document provides context for AI assistants working on Rate Remover Software (RRS) projects.

## Company Overview

**Rate Remover Software (RRS)** is a payment processing reseller business that:
- Partners with EPI (Electronic Payments Inc.) for merchant services
- Provides payment gateway solutions via Dejavoo/iPOSpays
- Offers a reseller program called "Pipeline Builder"
- Manages direct agents who earn residual commissions

## Project Structure

```
RRS Company/
├── docs/
│   └── payment-integration-guide.md    # Payment SDK & API reference
├── direct-agents/
│   └── index.html                      # Agent earnings dashboard
├── project-tracker/                    # Task management dashboard
├── rrs-dashboard/                      # Main RRS dashboard (Node.js)
├── Lifelong-Merchant-Services-*.html   # Reseller onboarding docs
├── Pipeline-Builder-*.html             # Pipeline Builder program docs
└── CLAUDE.md                           # This file
```

## Related Projects (External)

| Project | Location | Description |
|---------|----------|-------------|
| **epi-pay-gateway** | `C:\Users\scott\Desktop\epi-pay-gateway` | Payment gateway server & SDK |
| **myrateremover.com** | TBD | Public website (uses payment SDK) |

### Key Files in epi-pay-gateway

| File | Description |
|------|-------------|
| `examples/checkout-demo.html` | **Complete checkout form template** - plan selection, customer form, SDK integration |
| `examples/index.html` | Interactive demo showcase |
| `examples/reseller-guide.html` | Reseller integration documentation |
| `examples/merchant-onboarding.html` | Merchant onboarding flow |
| `public/sdk/rrpay.js` | Client-side SDK source |
| `server/index.js` | API server (1,380 lines) |

## Key Documentation

### Payment Integration
See `docs/payment-integration-guide.md` for:
- RR Pay SDK usage
- API endpoints
- Dejavoo configuration
- Code examples
- Test cards

### Quick Payment SDK Reference

```javascript
// Include SDK
<script src="https://rr-pay-production.up.railway.app/sdk/rrpay.js"></script>

// Initialize
RRPay.init('pk_live_MERCHANT_KEY');

// One-time payment
RRPay.checkout({
    amount: 99.99,
    onSuccess: (result) => console.log('Paid!', result)
});

// Subscription with trial
RRPay.createSubscription({
    amount: 29.99,
    interval: 'month',
    trialDays: 14,
    onSuccess: (sub) => console.log('Subscribed!', sub)
});
```

### Test Cards
| Card | Result |
|------|--------|
| `4111 1111 1111 1111` | Approved |
| `4000 0000 0000 0002` | Declined |

## Business Context

### Direct Agents
- Agents earn 60% of residuals
- Paid on 5th of each month
- Two groups: RTRMVR (Rate Remover) and SGINY (Scott Gibbens)
- Nicole receives 20% commission on agent overrides

### Pipeline Builder Program
- $29/month subscription for resellers
- Includes: lead generation, GHL training, campaign templates
- Target: Help resellers build merchant pipeline

### Key Resellers
- **Lifelong Merchant Services** - Kermit Lowry (Owner), Nick Ruggiero (COO)

## Design System

### Brand Colors
```css
--primary: #E05A33;        /* Rate Remover Orange */
--primary-dark: #C74A28;
--primary-light: #F07050;
--secondary: #2D2D2D;
--accent: #4CAF50;
```

### Gradients
```css
--gradient-primary: linear-gradient(135deg, #E05A33 0%, #F07050 50%, #FF8A65 100%);
--gradient-hero: linear-gradient(135deg, #2D2D2D 0%, #3D3D3D 50%, #4D4D4D 100%);
```

### Typography
- **UI Font:** Inter
- **Code Font:** JetBrains Mono

### Border Radius
- Small: 6px
- Medium: 10px
- Large: 16px
- XL: 24px

## Common Tasks

### Adding Payment to a Page
1. Include SDK script tag
2. Call `RRPay.init()` with merchant key
3. Use `RRPay.checkout()` or `RRPay.createSubscription()`
4. Handle `onSuccess` and `onError` callbacks

### Creating HTML Documents
- Use consistent header styling with RRS logo
- Include print-friendly CSS
- Use flexbox for layouts
- Follow brand color palette

### Working with Agent Data
- Agent data stored in `direct-agents/index.html`
- Earnings tracked by month
- Groups: RTRMVR, SGINY

## Environment & Tools

### Tech Stack
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express
- **Payment:** Dejavoo/iPOSpays via RR Pay Gateway
- **Deployment:** Railway (Nixpacks)

### Gateway URLs
| Environment | URL |
|-------------|-----|
| Production | `https://rr-pay-production.up.railway.app` |
| Local Dev | `http://localhost:3000` |

### Dejavoo Endpoints
| Environment | URL |
|-------------|-----|
| Sandbox | `https://payment.ipospays.tech/api/v1/external-payment-transaction` |
| Production | `https://payment.ipospays.com/api/v1/external-payment-transaction` |

## Support Contacts

| Type | Contact |
|------|---------|
| Dejavoo Technical | devsupport@denovosystem.com |
| Dejavoo Account | support@dejavoo.io |
| Phone | 1-877-DJVOSYS (358-6797) |

## File Naming Conventions

- HTML documents: `Title-With-Dashes.html`
- Images: `lowercase-with-dashes.png`
- Data files: `lowercase-with-dashes.csv` or `.json`

## Team Members

| Name | Role |
|------|------|
| Scott | Owner/Developer |
| Nicole | Sales Director |
| Elisabeth | Training/Content |
| Beth | GHL Specialist |
| Nick Garten | Onboarding Specialist |
| Rick Arnold | Head of Hardware |
