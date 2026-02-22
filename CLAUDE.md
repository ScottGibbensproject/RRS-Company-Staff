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
├── Company Dashboard/                  # GHL & process flowcharts (Netlify deploy)
│   ├── index.html                      # Landing page
│   ├── ghl-automations.html
│   ├── ghl-cheatsheet.html
│   ├── direct-agent-onboarding-flowchart.html
│   ├── merchant-onboarding-ghl-tagging.html
│   ├── reseller-onboarding-ghl-flowchart.html
│   ├── post-cert-emails.html
│   ├── workflow-project.html
│   └── processes/                      # Markdown process docs
├── Company Procedures/                 # Internal procedures & guides
│   ├── payment-integration-guide.md    # Payment SDK & API reference
│   ├── Phone-Support-Map.html          # Phone routing flowchart
│   └── Phone-Support-Rep-Guide.html    # Support rep info sheets
├── Development Overview/               # Software changelog (Netlify deploy)
│   ├── index.html                      # Public changelog page
│   ├── admin.html                      # Admin form for updates
│   ├── data.json                       # Changelog data
│   ├── app.js                          # Rendering logic
│   └── styles.css
├── knowledge-base/                     # Knowledge base articles
│   ├── internal-kb.md
│   ├── public-kb.md
│   └── reseller-kb.md
├── Merchant Onboarding/                # Onboarding docs & assets
│   ├── Merchant-Onboarding-Process.html
│   ├── Lifelong-Merchant-Services-Onboarding.html
│   └── onboarding-*.png                # Onboarding screenshots
├── Pipeline Builder Plan/              # Pipeline Builder program docs
│   ├── Pipeline-Builder-Program-Outline.html
│   ├── Pipeline-Builder-Program-Plan.md
│   └── Pipeline-Builder-Task-Assignments.html
├── Chatbot/                            # AI support chatbot (Netlify deploy)
│   ├── src/                            # React components & pages
│   ├── netlify/functions/chat.js       # OpenAI serverless function
│   └── netlify.toml
├── Mobile App/                         # PWA portal app (Netlify deploy)
│   ├── index.html                      # Main app with 12 service cards
│   ├── service-worker.js               # Auto-update cache (bump CACHE_NAME)
│   └── manifest.json
├── Investor Information/               # Investor portal (Netlify deploy)
│   ├── index.html                      # Password gate (access code)
│   ├── Investor-Overview.html          # Full investor deck
│   ├── Investor_contact.html           # Investment calculator
│   └── netlify.toml
├── Suitability Form/                   # Lead qualification tool
│   ├── feature-fit-form.html           # 28-feature assessment + GHL form
│   └── Auto Repair Version - Clear Background.png
├── RRS-Knowledge-Base.md               # Master knowledge base
├── website-projects-summary.md         # Website project details
├── rrs-logo.png                        # Company logo
└── CLAUDE.md                           # This file
```

## GitHub Repos & Deployment

| Project | GitHub Repo | Hosting | Deploy Method |
|---------|-------------|---------|---------------|
| **RRS Company (Staff)** | `ScottGibbensproject/RRS-Company-Staff` | — | Master project repo |
| **Company Dashboard** | `ScottGibbensproject/company-dashboard` | Netlify | Auto-deploy on push |
| **Development Overview** | `ScottGibbensproject/Development-Overview` | Netlify | Auto-deploy on push |
| **Chatbot** | `ScottGibbensproject/support-chat-bot` | Netlify + Functions | Auto-deploy on push |
| **Mobile App** | `ScottGibbensproject/mobile-app` | Netlify | Auto-deploy on push |
| **Investor Information** | `ScottGibbensproject/investor-information` | Netlify | Auto-deploy on push |
| **Suitability Form** | `ScottGibbensproject/merchant-suitability-form` | shoprateremover.com | Manual upload |
| **epi-pay-gateway** | — | Railway | Nixpacks |

## Related Projects (External)

| Project | Location | Description |
|---------|----------|-------------|
| **epi-pay-gateway** | `C:\Users\scott\Desktop\epi-pay-gateway` | Payment gateway server & SDK |
| **myrateremover.com** | TBD | Public website (uses payment SDK) |
| **RRS Bookkeeping** | `C:\Users\scott\Desktop\RRS Bookkeeping` | Confidential bookkeeping data |
| **LifeLong** | `C:\Users\scott\Desktop\LifeLong` | Lifelong Merchant Services collaboration |
| **Project Tracker** | `C:\Users\scott\Desktop\Project Tracker` | Task management dashboard (Node.js) |

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
See `Company Procedures/payment-integration-guide.md` for:
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
- Agent earnings data moved to `C:\Users\scott\Desktop\RRS Bookkeeping`
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
