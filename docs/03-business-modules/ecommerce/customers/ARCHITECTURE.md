# Customers Module Architecture

## Module

Customers

## Status

Approved Architecture v1.0

## Priority

Critical

---

## Objective

Design a modern Customer 360 Platform for AgainERP.

Customers are not just contact records — they are business assets.

The system must provide a complete customer intelligence and relationship management experience.

### Supported Customer Types

- Ecommerce Customers
- Retail Customers
- Wholesale Customers
- Dealers
- Corporate Clients
- VIP Customers
- Future CRM Expansion

---

## Design Philosophy

> Customer Page ≠ Customer Information
> Customer Page = Customer Intelligence Center

Every customer record provides:

- Identity
- Purchase History
- Activities
- Marketing History
- Support History
- Financial Summary
- AI Insights

---

## Design Inspiration

| Weight | Source | What we borrow |
|---|---|---|
| 40% | HubSpot CRM | Contact timeline, activities, deals pipeline feel |
| 30% | Odoo Contacts | Chatter, activity types, follower model |
| 20% | Shopify Customers | Speed, customer stats card, order history tab |
| 10% | Linear | Minimal chrome, keyboard-first interactions |

---

## Menu Structure

```
Customers
├── Dashboard
├── All Customers
├── Customer Groups
├── Segments
├── Loyalty Program
├── Rewards
├── Wallet
├── Wishlists
├── Activities
├── Support
├── Marketing
└── Reports
```

---

## Customer List

Primary working screen powered by AG Grid.

### Columns

| Column | Notes |
|---|---|
| Customer ID | Unique identifier |
| Name | Full name, clickable to detail |
| Phone | Primary contact |
| Email | Contact email |
| City | Location |
| Customer Group | Retail / Wholesale / VIP etc. |
| Orders | Total order count |
| Total Spend | Lifetime spend |
| Wallet Balance | Current credits |
| Reward Points | Accumulated points |
| Last Order Date | Most recent order |
| Status | Active / Inactive / Blocked |
| Risk Score | AI-generated churn/fraud risk |
| Assigned Staff | CRM owner |
| Actions | View / Edit / Note / Activity |

### Features

- Global search (name, phone, email, ID)
- Filters Sheet (toggle which filters appear in toolbar)
- Columns Sheet (toggle which columns appear in grid)
- Status tabs (All / Active / Inactive / VIP / Blocked)
- Bulk actions (tag, assign, export, status update)
- Import / Export
- Inline tags

---

## Customer Detail Page

### Layout: Two Column

**Left Column**
- Customer Profile Card
- Statistics Card
- Addresses
- Recent Orders
- Wishlist
- Wallet
- Rewards
- Marketing Preferences
- Custom Fields

**Right Column**
- Timeline (Odoo Chatter style)
- Activities
- AI Insights Panel
- Comments / Internal Notes
- Attachments
- Followers

---

## Customer Profile Card

| Field | Description |
|---|---|
| Customer ID | System ID |
| Name | Full name |
| Phone | Primary phone |
| Email | Primary email |
| Profile Image | Avatar |
| Customer Group | Assigned group |
| Status | Active / Inactive / Blocked |
| Customer Since | Registration date |
| Assigned Staff | CRM owner |
| Tags | Customer labels |

---

## Statistics Card

| Field | Description |
|---|---|
| Total Orders | Lifetime order count |
| Total Spend | Lifetime value in currency |
| Average Order Value | Spend / orders |
| Return Rate | % orders returned |
| Reward Points | Current balance |
| Wallet Balance | Credit balance |
| Last Purchase Date | Most recent purchase |
| Lifetime Value | Predicted LTV (AI) |

---

## Customer Groups

Groups control pricing, discounts, permissions, marketing rules, and loyalty rules.

**Built-in groups:**
- Retail
- Wholesale
- Dealer
- Corporate
- VIP
- Employee
- Partner
- Distributor

---

## Customer Segments

Dynamic rule-based segments evaluated automatically.

**Examples:**
- VIP Customers
- High Value Customers
- Wholesale Buyers
- Laptop Buyers
- Inactive Customers
- Returning Customers
- First Time Buyers
- AI Generated Segments

---

## Timeline

Inspired by Odoo Chatter. Every action recorded.

Events:
- Customer Registered
- First Order
- Orders (each)
- Returns
- Wallet Transactions
- Reward Activities
- Support Activities
- Marketing Activities
- AI Activities
- Staff Comments / Notes

---

## Activities

Types:
- Call Customer
- Follow Up
- Meeting
- Reminder
- Address Verification
- Payment Follow-up
- Sales Follow-up
- Task Assignment

Activities appear on dashboard and timeline.

---

## Wallet Module

- Customer Credits
- Refund Credits
- Promotional Credits
- Manual Adjustments
- Wallet Transactions
- Wallet Reports

---

## Rewards Module

- Reward Points
- Point History
- Tier Levels
- Redeemed Rewards
- Reward Expiry
- Campaign Rewards

---

## Loyalty Tiers

| Tier | Label |
|---|---|
| Level 1 | Silver |
| Level 2 | Gold |
| Level 3 | Platinum |
| Level 4 | VIP |

Benefits: Discounts, Free Shipping, Priority Support, Bonus Rewards

---

## AI Integration

Chief AI Agent integration required.

### AI Customer Summary
- Customer Summary
- Purchase Summary
- Engagement Summary
- Financial Summary
- Support Summary

### AI Customer Insights
- Lifetime Value
- Purchase Frequency
- Average Spend
- Favorite Categories / Brands / Products
- Retention Probability

### AI Churn Prediction
- Analyzes: last purchase date, order frequency, activity history, engagement
- Outputs: Low / Medium / High risk score with reasons

### AI Product Recommendations
- Cross Sell
- Upsell
- Frequently Bought Together
- Seasonal Recommendations

### AI Segment Builder
- Auto-generates segments from behavior patterns

### AI Marketing Suggestions
- Coupons, campaigns, retention, reactivation suggestions

---

## Design Principles

- Customer Centric
- AI Assisted
- Activity Driven
- Timeline Driven
- Marketing Ready
- CRM Ready
- Collaboration Friendly
- Scalable
- Documentation First

---

## Final Rule

> The Customer Details Page is the customer command center.
>
> Every team member must be able to understand the customer, communicate internally,
> review history, analyze behavior, and take action from a single screen.
