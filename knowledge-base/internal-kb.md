# Rate Remover Software – Internal Knowledge Base

> For: Scott, Nicole, Elisabeth, Developers ONLY
> **CONFIDENTIAL - DO NOT SHARE**

---

## Strategic Position

- Standalone SaaS product
- Strategic acquisition engine for merchant services residual revenue
- Long-term exit strategy: strategic acquisition (likely by payments/fintech company)

---

## Current Metrics

- **Active Merchants:** 17 auto repair shops

---

## Team Structure

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

## Technology Stack

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

## Reseller Ecosystem (Confidential)

### Legacy Tiers (No Longer Offered)

| Tier | Description | Revenue Share | Count |
|------|-------------|---------------|-------|
| **Authorized Provider** | Made initial investment, own processing | 0% to RRS (they keep all) | 3 |

### Total Reseller Ecosystem
- Authorized Providers (Legacy): 3
- Direct Agents: 8
- ISO Group Agents: 15
- Equity Partner Agents: 10
- **Total:** 36+ individuals in the reseller network

---

## Current Pain Points

1. **Content Currency:** Keeping course and merchant support videos current with software updates
2. **Document Management:** Finding documents when needed (working on master Google Sheet)
3. **Internal Communication:** Keeping everyone on the same page as things change quickly

---

## Internal Apps & Tools

| App | Purpose | Notes |
|-----|---------|-------|
| Canva | Marketing materials, support documents | |
| Calendly | Scheduling merchant demos, onboarding, reseller demos | |
| ChatGPT | General research | |
| Claude AI | General research | |
| Dejavoo Ipos Portal | Legacy merchants monthly SaaS fees | |
| Dejavoo SPIN | Payment terminal integration | |
| Docker | Dev App | |
| EVoice | Main toll free number with calling tree | |
| GitHub | Repository | |
| Google Business Email | Company email | |
| Google Console | Software hosting | |
| Google Meet | General meetings, reseller webinars | |
| JotForms | Collect reseller info, software suitability form, webinar signups | |
| MailChimp | Email sequences to resellers, new merchants, potential merchants who opt in | Needs to be redesigned and update content - Zoey Advertising |
| OBS | Screen recording video instructions | |
| SendGrid/Twilio | New merchant users, email/text estimates & payment links | |
| SiteGround | Public website hosting, Reseller member area hosting | |
| Stripe | WooCommerce Subscriptions - our EPI solution does not work with Woo Subscriptions | |
| Trello | Project organization | |
| VistaPrint | Marketing materials | |
| VS Code | Development | |
| WooCommerce | Merchant SaaS fees, Reseller signup fees | |
| Zapier | Automations | |
| Zendesk Sell CRM | Contact management | **Zendesk Sell is being discontinued in 2027 - looking for new options** |

---

## Go High Level (GHL) Status

- **Current Plan:** Starter
- **Planned:** Upgrade to Agency plan
- **Status:** Just started setup
- **Integrations:** Using Zapier to sync data from reseller course and merchant sign-up

### Assigning Contacts to Users

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

---

## Strategic Guardrails

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

## Direct Agents (EPI)

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

**Dashboard:** `RRS Company/direct-agents/index.html`
- Open locally in browser to view monthly summaries
- Shows totals by group (RTRMVR, SGINY)
- Displays agent payouts and Nicole's commission

**Data File:** `RRS Company/direct-agents/data.json`
- Stores all earnings data

---

## Sending a Direct Agent an EPI Code

### Workflow

1. **Agent fills out EPI Subagent packet**
   - Located at agents.myrateremover.com
   - Emailed under "RRS Agent Post Certification 1: Rate Remover Software: Congratulations! Here's What's Next"

2. **Agent emails packet with wet signature** to support@shoprateremover.com

3. **Support sends packet to EPI**
   - Template in ZenDesk under *'Subagent Code request'* tagged Post Certification
   - Code: RTRMVR
   - 60% for Agents
   - 90% for Equity Partners

4. **EPI sends support@shoprateremover.com subagent code**

5. **Support sends agent their code** using the template in ZenDesk **"Sending a Direct Agent an EPI Code"**

6. **Create a demo account for Reseller**
   - Link provided in ZenDesk template

7. **Onboarding**
   - Jotform: https://form.jotform.com/251794832126057

---

## Glossary (Internal Terms)

| Term | Definition |
|------|------------|
| **Auto Repair Version** | Software variation for auto shops, hosted at auto.myrateremover.com |
| **General Business Version** | Software variation for other industries, hosted at inv.myrateremover.com |
| **House Account** | A merchant added directly by Scott or an internal team member |
| **ISO Link** | A field used when creating an ISO where a Single Sign-on link is inserted that connects them directly to our WordPress Member Area |
| **Labor Taxable/Non-Taxable** | A toggle used when creating a merchant based on their state regulations for applying sales tax to Labor |
| **License Key / Software Key** | A code used by ISO users or resellers to activate a merchant account |
| **Super Admin** | Users who can create Merchants and Users. Currently: Scott Gibbens, Zac Mason, Elisabeth Geiwitz |

---

## Next Steps (To Be Planned)

- [ ] Map out information architecture (what lives where)
- [ ] Design workflow maps (reseller onboarding, merchant onboarding, support)
- [ ] Identify sync points between systems
- [ ] Plan course migration from WordPress to GHL
- [ ] Establish internal communication protocol
- [ ] Create document organization system

---

*CONFIDENTIAL - Internal Use Only*
*Rate Remover Software, Inc.*
