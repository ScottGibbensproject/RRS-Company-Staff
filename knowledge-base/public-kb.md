# Rate Remover Software – Public Knowledge Base

> For: Website visitors, prospects, merchants

---

## Company Overview

**Legal Entity:** Rate Remover Software, Inc.
**Structure:** Delaware C-Corporation (formed 2025)
**Type:** SaaS company focused on true cash discount / dual pricing software

### Core Value Proposition
- Enables compliant dual pricing (cash vs card pricing)
- Automatically calculates card prices by embedding processing costs into pricing
- Eliminates the need for traditional surcharging
- Aligns with card brand rules and state regulations
- Tightly integrated with payment processing workflows

---

## Target Market

**Primary:** Independent auto repair shops (single-location and small multi-location)
**Secondary/Future:** Other service-based SMBs where card acceptance costs materially impact margins

**Primary Buyer:** Shop owners
**Secondary Buyers/Influencers:** Merchant service providers, ISOs, payment processors, resellers, subagents

---

## Pricing

### SaaS Subscriptions
- **Essentials:** $59/month
- **Pro:** $119/month (includes everything from Essentials + Labor Guide)

### Payment Processing
Merchant processing residuals available when merchants process through RRS.

---

## Core Software Features

- Invoice and estimate creation
- Dual pricing logic (cash price vs card price)
- Automatic fee embedding (no explicit surcharge line)
- Sales tax handling
- PartsTech integration (parts lookup, labor guides, VIN decoding)
- Dejavoo integration (card terminals, hosted payment page)
- CSV exports and reporting
- User authentication and role-based access
- Merchant and reseller account structures

---

## Savings Calculator

### Why does the savings calculator ask for sales tax rate and taxable processing volume?

Our software does **not** add card fees to sales tax - only to the sale amount itself. This is important for accurate savings calculations.

When you process a card payment, your total includes both:
1. The sale amount (what you charge for goods/services)
2. Sales tax collected (which you pass through to the state)

Since we only apply the non-cash fee to the sale amount (not the tax), we need to know:
- **Sales Tax Rate** - Your local tax percentage
- **Taxable Processing Volume** - What portion of your card sales include taxable items

This allows us to subtract the sales tax portion from your processing volume and calculate your **true projected savings** based only on the amount where card fees actually apply.

**Example:** If you process $10,000/month in card sales with 8% tax on 80% of sales:
- Taxable portion: $8,000
- Sales tax collected: $640
- Actual volume for fee calculation: $9,360 (not $10,000)

This gives you a more accurate picture of your savings with Rate Remover.

---

## What is Dual Pricing?

Dual pricing displays two prices for each item or service:
- **Cash Price:** The base price for cash payments
- **Card Price:** Includes the cost of card processing embedded into the price

This is different from surcharging because:
- No separate surcharge line on receipts
- Compliant with card brand rules
- Follows the "gas station method" of displaying prices
- Legal in all 50 states when implemented correctly

---

## Glossary

| Term | Definition |
|------|------------|
| **Admin** | Permissions to view all areas and set configurations |
| **Card Payment Terminal** | The countertop device used to accept the customer card during payment |
| **Card Price** | Adjusted price including processing fee (e.g., 4%) |
| **Cash Price** | Original price entered by merchant |
| **Cost** | Used on line items to show the cost of the entered item |
| **Created** | The date and time an estimate was created. Displayed in Line Item View |
| **Customer** | A person who is doing business with the Merchant |
| **Customer Intake Notes** | The customer description of why the vehicle is being serviced |
| **Daily Transaction Report** | Summary of all invoices paid for the day. Shows all invoices, payment methods, and amounts along with the amount added for card fees, actual card fees, and expected card deposit |
| **Discount Rate** | The percentage used to calculate the amount charged by the card processing company. Used when calculating Total Card Fees and expected card deposit. Total Card Fees = Total Card Sales x Discount Rate |
| **Estimate** | A summary of needed repairs including Labor, Parts, Misc. and Non-Taxable No-Fee (NTNF) Items |
| **Estimate Disclaimer** | A user entry field to add their disclaimer for authorizing repairs |
| **Expected Card Deposit** | Total Card Sales - Total Card Fees |
| **Feedback Notes** | Used to provide feedback to the customer of potential issues noticed during the repair |
| **Fulfillment Notes** | Used during the repair to document all activity |
| **Invoice** | A summary of all completed work including everything from the jobs accepted on the Estimate |
| **Invoice Disclaimer** | A user entered field to add their disclaimer for all completed repairs |
| **Invoice Items** | Regularly used items that appear on an Estimate/Invoice |
| **Job** | A summary of the repair listed on the Estimate |
| **Line-Item Area** | Used for creating Estimates, one area for custom "In House" items and one area for PartsTech |
| **List Price** | The adjusted price that includes the card fee (Regular Price + Non-Cash Fee = List Price) |
| **Merchant** | A business that uses the software to create invoices and accept payments |
| **Merchant User** | Users grouped under one Merchant |
| **Non-Cash Rate** | The percentage used to calculate the amount added to the regular price |
| **PartsTech** | Third-party API for ordering parts and vehicle lookups |
| **Rate** | Used on line items – the regular price for any entered item or labor |
| **Repair Order** | Summarized document for approved estimates/jobs. Shows vehicle information, parts, and employee labor. Should not show customer pricing |
| **Sales Tax** | A percentage applied to the total sale amount and added to the total amount due |
| **Sales Tax Rate** | The percentage used when calculating the sales tax amount due |
| **Settlement** | The process of sending all daily card payments to the bank for processing |
| **Submit Quote** | Used on PartsTech to send all items in the cart to the estimate |
| **Technician** | The person who is employed by the Merchant. Limited to Repair Order access - can order parts but should not see customer pricing |
| **Technician User** | The Technician grouped with the Merchant Account with limited privileges |
| **Vehicle Lookup** | A PartsTech feature that allows looking up a vehicle by License Plate or VIN |
| **VIN** | Vehicle Identification Number |

---

## QuickBooks Integration

### Overview
Connecting your Rate Remover account to QuickBooks makes managing your shop easier. **We do not support QuickBooks Desktop** - only QuickBooks Online.

### Important: One-Way Sync
Rate Remover Software uses a **one-way sync** with QuickBooks.

**This means:**
- Changes you make in Rate Remover **will** sync to QuickBooks
- Changes you make directly in QuickBooks **will NOT** sync back to Rate Remover

### What NOT to Do in QuickBooks
To keep your records accurate:
- Do not edit invoices inside QuickBooks
- Do not change the amount
- Do not remove or edit line items
- Do not delete invoices or payments

### Always Make Changes in Rate Remover
- Edit the customer
- Change the total
- Apply a cash price or card price
- Mark an invoice as paid

Rate Remover will then send the correct updated information to QuickBooks automatically. You may safely create Bank Deposits in QuickBooks.

### How Invoices Sync
- **Estimates are NOT sent** - only invoices when a Repair Order is closed
- Software initially sends the higher card amount
- If customer pays by cash or check, the invoice is adjusted accordingly
- For split payments (cash/card), QuickBooks only records the total payment, not each payment method

### Automatic Features

**Customers:**
- Automatically created in QuickBooks
- Populated using invoice info
- Updated if the name matches
- *Tip: Use consistent naming to avoid duplicates*

**Line Items:**
- Automatically created if they don't exist
- Reuses existing items when names match
- Syncs part names, labor, diagnostic fees, shop supplies, etc.
- *Tip: Don't rename items in QuickBooks to avoid duplicates*

### Sales Tax Settings
QuickBooks has strict tax rules. Your Rate Remover tax settings should match your QuickBooks settings (tax-inclusive, tax-exclusive, tax-exempt, etc.).

**Common issue:** If QuickBooks cannot calculate the same tax amount as your invoice, it may reject or block the sync.

### Matching Invoices to Bank Deposits

When you take a card payment, QuickBooks receives the full invoice amount, but your bank only deposits the net amount after card fees are deducted (**daily discounting**).

**Step 1:** Confirm invoice is marked Paid (Sales → Invoices)

**Step 2:** Open Bank Deposit screen (New → Bank Deposit)

**Step 3:** Select the payments included in the deposit

**Step 4:** Add the card fee as an expense:
- Scroll to "Add funds to this deposit"
- Received From: Payment Processor
- Account: Merchant Fees (create under Expense if needed)
- Amount: Enter as negative (e.g., -40.00)
- Description: "Card processing fee withheld"

**Step 5:** Save and Close

**Step 6:** Match to Bank Feed (Banking → For Review → Match)

### Troubleshooting Sync Issues
Before contacting support:
1. Confirm you are logged into QuickBooks Online
2. Verify tax settings match
3. Check for duplicate customer or item names
4. Reconnect your QuickBooks account if token expired
5. Try syncing again

**Support:** support@shoprateremover.com | (855) 446-3483

---

## Mobile App

### How do I download the mobile app?

No login is required - just visit **https://app.myrateremover.com/** and install to your home screen.

### iPhone / iPad (Safari)

1. Open the app URL in **Safari**
2. Tap the **Share** button (square with arrow pointing up)
3. Scroll down and tap **"Add to Home Screen"**
4. Name it (e.g., "RRS") and tap **Add**

### Android (Chrome)

1. Open the app URL in **Chrome**
2. Tap the **three-dot menu** (top right)
3. Tap **"Install app"** or **"Add to Home Screen"**
4. Tap **Install**

---

## Contact

For more information about Rate Remover Software, visit our website or contact our sales team.

**Support:** support@shoprateremover.com | (855) 446-3483

---

*Rate Remover Software, Inc.*
