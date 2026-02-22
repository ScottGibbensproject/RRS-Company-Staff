# Rate Remover Software – Knowledge Base

> Last Updated: January 6, 2026

---

## Content Classification

| Tag | Audience | Description |
|-----|----------|-------------|
| `[PUBLIC]` | Anyone | Website visitors, prospects, merchants |
| `[RESELLER]` | Certified agents | Direct Agents, Equity Partners, ISO Groups |
| `[INTERNAL]` | Team only | Scott, Nicole, Elisabeth, developers |

---

## 1. Company Overview `[PUBLIC]`

**Legal Entity:** Rate Remover Software, Inc.
**Structure:** Delaware C-Corporation (formed 2025)
**Type:** SaaS company focused on true cash discount / dual pricing software

### Core Value Proposition
- Enables compliant dual pricing (cash vs card pricing)
- Automatically calculates card prices by embedding processing costs into pricing
- Eliminates the need for traditional surcharging
- Aligns with card brand rules and state regulations
- Tightly integrated with payment processing workflows

### Strategic Position `[INTERNAL]`
- Standalone SaaS product
- Strategic acquisition engine for merchant services residual revenue
- Long-term exit strategy: strategic acquisition (likely by payments/fintech company)

---

## 2. Target Market `[PUBLIC]`

**Primary:** Independent auto repair shops (single-location and small multi-location)
**Secondary/Future:** Other service-based SMBs where card acceptance costs materially impact margins

**Primary Buyer:** Shop owners
**Secondary Buyers/Influencers:** Merchant service providers, ISOs, payment processors, resellers, subagents

---

## 3. Revenue Model `[PUBLIC]`

### Revenue Streams
1. **SaaS Subscriptions**
   - Essentials: $59/month (legacy merchants grandfathered at $34 or $44)
   - Pro: $119/month (includes everything from Essentials + Labor Guide)

2. **Merchant Processing Residuals** (when merchants process through RRS)

### Current Metrics `[INTERNAL]`
- **Active Merchants:** 17 auto repair shops

---

## 4. Team Structure `[INTERNAL]`

### Internal Team
| Name | Role | Responsibilities |
|------|------|------------------|
| Scott | Founder | Product, sales, strategy, development management |
| Nicole | Director of Reseller Development | Reseller development, merchant demos, support |
| Elisabeth | Admin Support | Admin support, lead generation, merchant demos, support |

### Development Team
| Name | Company | Role |
|------|---------|------|
| Zac | JMA Resources | Lead Developer |
| Pachia | FYC Labs | Junior Developer |

### Tools Used
- **Video Meetings:** Zoom, Google Meet
- **Scheduling:** Calendly
- **CRM:** Go High Level (new, setting up)
- **Automation:** Zapier (syncing course and merchant sign-up data)
- **Documents:** Google Drive (working on master Google Sheet)

---

## 5. Reseller Program `[RESELLER]`

### Active Reseller Tiers

| Tier | Description | Revenue Share | Requirements | Count |
|------|-------------|---------------|--------------|-------|
| **Referral Partner** | Sends leads, RRS handles everything | TBD | None | TBD |
| **Direct Agent** (also: Agent, Subagent) | Closes own deals, RRS assists as needed | 60% to agent | Must complete certification course | 8 |
| **Equity Partner** | Same as agent + higher share | 90% to agent | $10k minimum investment + certification | 1 (has 10 sub-agents) |
| **ISO Group** | Own payment processing, pays RRS monthly | 20% net to RRS | Certification | 1 group (15 agents) |

### Legacy Tiers (No Longer Offered) `[INTERNAL]`

| Tier | Description | Revenue Share | Count |
|------|-------------|---------------|-------|
| **Authorized Provider** | Made initial investment, own processing | 0% to RRS (they keep all) | 3 |

### Total Reseller Ecosystem `[INTERNAL]`
- Authorized Providers (Legacy): 3
- Direct Agents: 8
- ISO Group Agents: 15
- Equity Partner Agents: 10
- **Total:** 36+ individuals in the reseller network

### Terminology Note
These terms are interchangeable:
- Direct Agent = Agent = Subagent (all 60% rev share model)

---

## 6. Certification Course `[RESELLER]`

### Current Platform
- **Host:** WordPress
- **Membership Plugin:** WP Paid Membership
- **Quiz Plugin:** QSM Quiz

### Course Structure
- **Lessons:** 10
- **Quizzes:** 5

### Requirements
- **Required for:** Direct Agents, Equity Partners, ISO Groups
- **Not required for:** Referral Partners

### Migration Plan
- Moving from WordPress to Go High Level (GHL)

---

## 7. Technology Stack `[INTERNAL]`

### Backend
- F#
- .NET (7.x)
- Giraffe framework
- PostgreSQL

### Frontend
- Vue.js (Vue 3)
- TypeScript
- Tailwind CSS
- Custom Webpack setup

### Infrastructure
- Google Cloud Platform (App Engine, Cloud Run, Cloud SQL)
- Cloudflare
- YAML-based deployment configs

### Integrations
- PartsTech API (parts lookup, labor guides, VIN decoding)
- Dejavoo SPIN / HPP (card terminals, hosted payment page)
- Twilio (SMS, future voice)
- SendGrid (email)
- QuickBooks (partial/toggleable)

---

## 8. Mobile App `[PUBLIC]`

### How do I download the mobile app?

No login is required - just visit **https://app.myrateremover.com/** and install to your home screen.

#### iPhone / iPad (Safari)

1. Open the app URL in **Safari**
2. Tap the **Share** button (square with arrow pointing up)
3. Scroll down and tap **"Add to Home Screen"**
4. Name it (e.g., "RRS") and tap **Add**

#### Android (Chrome)

1. Open the app URL in **Chrome**
2. Tap the **three-dot menu** (top right)
3. Tap **"Install app"** or **"Add to Home Screen"**
4. Tap **Install**

---

## 9. Core Software Features `[PUBLIC]`

- Invoice and estimate creation
- Dual pricing logic (cash price vs card price)
- Automatic fee embedding (no explicit surcharge line)
- Sales tax handling
- PartsTech integration
- Dejavoo integration
- CSV exports and reporting
- User authentication and role-based access
- Merchant and reseller account structures
- Admin controls for license keys and merchant activation

---

## 10. Planned/Roadmap Features `[RESELLER]`

- Text/email estimates with approval links and digital signatures
- Two-way SMS communication with customers
- Per-user or per-merchant phone numbers (Twilio/Vonage)
- Technician pay matrix
- Multiple jobs per estimate
- Sales by item/technician reporting
- Service bay visual management (drag-and-drop UI)
- Automated demo account creation
- Reseller demo provisioning
- Split payments (multiple tenders per invoice)
- Admin logging (logins, actions, errors)
- API offering for third-party shop systems (Tekmetric, Mitchell 1)

---

## 11. Current Pain Points `[INTERNAL]`

1. **Content Currency:** Keeping course and merchant support videos current with software updates
2. **Document Management:** Finding documents when needed (working on master Google Sheet)
3. **Internal Communication:** Keeping everyone on the same page as things change quickly

---

## 12. Go High Level (GHL) Status `[INTERNAL]`

- **Current Plan:** Starter
- **Planned:** Upgrade to Agency plan
- **Status:** Just started setup
- **Integrations:** Using Zapier to sync data from reseller course and merchant sign-up

### Assigning Contacts to Users

Assigning contacts to a user is a multi-step process. Failing to properly complete a step will cause issues with contact tracking and assignment.

#### Step 1: Prepare CSV File
Create a clean CSV with these fields:
- Company Name
- Address
- City
- State
- ZIP Code
- Phone Number Combined
- Tag (use the user's contact list tag)

#### Step 2: Configure the Workflow
1. Go to **Automation** → Select workflow **"Add Tag to Assign Contact"**
2. The trigger is already set (Contact Tag = "Assign Contact")
3. Change **only** the user to assign contacts to
4. **Save** and **Publish** the workflow

#### Step 3: Assign the Contacts
1. Go to **Contacts** and filter by the user's contact list tag
2. Verify the count is correct
3. Select all records
4. Click **Add Tags** → Add tag **"Assign Contact"**
5. Confirm to assign contacts to the user

#### Step 4: Cleanup
1. Check **Bulk Actions** to confirm completion
2. Return to Contacts with same filter
3. **Save as Smart List** and share with: User, Elisabeth, Scott, Nicole
4. Return to workflow and **Unpublish** it
5. Remove the "Assign Contact" tag from all contacts (same process as adding)

*Updated: January 6, 2026*

---

## 13. Strategic Guardrails `[INTERNAL]`

### Non-Negotiables
1. Does not support agnostic processing at scale (brand control, support complexity, compliance)
2. Training is mandatory for all closing resellers
3. Quality of merchants > quantity of merchants
4. Software quality and compliance take priority over short-term growth

### Exit Strategy
- Strategic acquisition by payments/fintech company
- Valuation currently excludes merchant residuals (but residuals are strategic lever)
- Consistency and cleanliness matter for exit readiness

---

## 14. Software Updates Changelog `[INTERNAL]`

### Overview
A public-facing changelog page hosted on Netlify to display software updates. Can be embedded on the website.

### Files Location
`RRS Company/Development Overview/`
- `index.html` - Public changelog page (what visitors see)
- `admin.html` - Admin form to add/edit updates (use locally)
- `data.json` - Changelog data (update this before deploying)
- `styles.css` - Styling (supports dark mode)
- `app.js` - Shared rendering logic

### How to Add Updates
1. Open `admin.html` locally in your browser
2. Fill in the date, title, and description
3. Click "Add Update"
4. Copy the JSON from the export box at the bottom
5. Paste into `data.json` (replace entire contents)
6. Deploy to Netlify

### Deploying to Netlify
1. Go to [app.netlify.com](https://app.netlify.com)
2. Drag the entire `Development Overview` folder onto the deploy area
3. Done - you get a live URL

### Embedding on Website
```html
<iframe src="https://your-site-name.netlify.app" width="100%" height="600" frameborder="0"></iframe>
```

### Updating the Changelog
Repeat the "How to Add Updates" steps, then drag the folder to Netlify again. It will update the same site.

---

## 15. Next Steps `[INTERNAL]`

- [ ] Map out information architecture (what lives where)
- [ ] Design workflow maps (reseller onboarding, merchant onboarding, support)
- [ ] Identify sync points between systems
- [ ] Plan course migration from WordPress to GHL
- [ ] Establish internal communication protocol
- [ ] Create document organization system

---

## 16. Direct Agents (EPI) `[INTERNAL]`

### Overview
Direct Agent resellers board merchant service accounts through **Electronic Payments Inc (EPI)**. RRS has two master codes with EPI, each with their own subagents.

**Payment Schedule:** Earnings are paid by EPI on the **5th of each month** for the previous month's activity.

### Master Codes

| Master Code | Group |
|-------------|-------|
| RTRMVR | Rate Remover Software |
| SGINY | Scott Gibbens Group |

### RTRMVR Agents (Rate Remover Software)

| Code | Agent Name | Status |
|------|------------|--------|
| RTRM01 | John Mallory | Active |
| RTRM02 | Gary Eubanks | Active |
| RTRM03 | Steven Roberts | Active |
| RTRM04 | Clayton Shivers | Active |
| RTRM05 | Dora Galantai | Active |
| RTRM06 | Scott Moore | Active |
| RTRM07 | Steve Ivy | Active |
| RTRM08 | Thomas Gallagher | Active |
| RTRM09 | Andres Santiago | Active |
| RTRM10 | Kermit Lowry | Active |
| RTRM11 | Strider Devaney | Active |
| RTRM12 | Leah Lanius | Active |

### SGINY Agents (Scott Gibbens Group)

| Code | Agent Name | Status |
|------|------------|--------|
| SGINY | Scott Gibbens | Active (Master) |
| SGINY01 | Tyler Gibbens | Active |
| SGINY02 | Elisabeth Geiwitz | Active |
| SGINY07 | Steven C Roberts | Active |
| — | Joshua Mason | Inactive |
| — | Robert Biccum | Inactive |
| — | Jason Mussachio | Inactive |

### Commission Structure

#### EPI Tier System
RRS receives a percentage of merchant profit based on tier:

| Tier | RRS Share | Notes |
|------|-----------|-------|
| Tier E | 80% | |
| Tier F | 90% | Current tier for most merchants |

#### Agent Splits
Subagents receive a percentage of what RRS receives from EPI:

| Agent Type | Agent Share | RRS Keeps |
|------------|-------------|-----------|
| Standard Direct Agent | 60% | 40% |
| Steven C Roberts (SGINY07) | 50% | 50% |

#### Internal Commission
Nicole Devery (Director of Reseller Development) receives 20% of RRS agent overrides.

**Example:** If RRS override from an agent is $124.14:
- Nicole (20%): $24.83
- RRS Net (80%): $99.31

*Note: This applies only to agent overrides, not to direct merchant residuals.*

#### How Payouts Are Calculated
1. **Merchant Fees Billed** - Total charged to merchant
2. **Minus Shared Expenses** - Interchange, assessments, pass-through costs
3. **= Gross Profit**
4. **Minus EPI Processing Fees** - Per-transaction and monthly fees (see below)
5. **= Net Profit**
6. **× Tier %** - RRS receives 80% (Tier E) or 90% (Tier F)
7. **= RRS Payout** - Split with subagent per their agreement

#### EPI Processing Fees (Tier F)
These fees are deducted from gross profit before calculating the 90% payout:

| Fee | Rate |
|-----|------|
| Bank BIN Sponsorship | 0.02% of volume |
| Amex OptBlue Processor Fee | 0.20% of Amex volume |
| Cygma All-In Authorization Fee | $0.04/transaction |
| AVS Fee | $0.015/transaction |
| Platform Administration Fee | $4.75/month |
| Account on File Fee | $5.00/month |
| PCI Compliance Fee | $4.95/month |
| Regulatory Compliance & 1099-K | $2.95/month |

### Earnings Tracking

**Dashboard:** `C:\Users\scott\Desktop\RRS Bookkeeping` (moved from project)
- Open locally in browser to view monthly summaries
- Shows totals by group (RTRMVR, SGINY)
- Displays agent payouts and Nicole's commission

---

*This document will be updated as the organizational framework is developed.*
