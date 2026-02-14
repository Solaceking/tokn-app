# Stripe Setup Guide for TOKNS

This guide walks you through configuring Stripe for the TOKNS subscription system.

## Overview

TOKNS uses 4 Stripe products/prices:

| Product | Monthly | Yearly | Discount |
|---------|---------|--------|----------|
| **Pro** | $9.99/mo | $79.99/yr | 33% off |
| **Ultra** | $24.99/mo | $199.99/yr | 33% off |

---

## Step 1: Create Products in Stripe Dashboard

### 1.1 Create Pro Product

1. Go to [Stripe Dashboard → Products](https://dashboard.stripe.com/products)
2. Click **"Add product"**
3. Fill in:
   - **Name:** `TOKNS Pro`
   - **Description:** `Unlimited tokens for small teams. Includes API access, team collaboration, and priority support.`
4. Add pricing:
   - **Monthly:** $9.99 / month
   - **Yearly:** $79.99 / year
5. Click **"Save product"**

### 1.2 Create Ultra Product

1. Click **"Add product"** again
2. Fill in:
   - **Name:** `TOKNS Ultra`
   - **Description:** `Unlimited everything for organizations. Includes white-glove support and SLA.`
3. Add pricing:
   - **Monthly:** $24.99 / month
   - **Yearly:** $199.99 / year
4. Click **"Save product"**

---

## Step 2: Get Price IDs

After creating products, you'll see **Price IDs** for each price. They look like:
- `price_1234abcd5678efgh`

### Copy these Price IDs:

| Environment Variable | Price ID Example |
|---------------------|------------------|
| `STRIPE_PRO_MONTHLY_PRICE_ID` | `price_1ABC...` |
| `STRIPE_PRO_YEARLY_PRICE_ID` | `price_1DEF...` |
| `STRIPE_ULTRA_MONTHLY_PRICE_ID` | `price_1GHI...` |
| `STRIPE_ULTRA_YEARLY_PRICE_ID` | `price_1JKL...` |

---

## Step 3: Set Up Webhook

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **"Add endpoint"**
3. Enter your webhook URL:
   - Production: `https://your-domain.com/api/stripe/webhook`
   - Development: Use Stripe CLI (see below)
4. Select these events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Click **"Add endpoint"**
6. Copy the **Signing secret** (starts with `whsec_...`)
   - This is your `STRIPE_WEBHOOK_SECRET`

---

## Step 4: Configure Environment Variables

Add these to your `.env` file or Vercel environment:

```bash
# Stripe API Keys
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Price IDs
STRIPE_PRO_MONTHLY_PRICE_ID=price_xxxxxxxxxxxxx
STRIPE_PRO_YEARLY_PRICE_ID=price_xxxxxxxxxxxxx
STRIPE_ULTRA_MONTHLY_PRICE_ID=price_xxxxxxxxxxxxx
STRIPE_ULTRA_YEARLY_PRICE_ID=price_xxxxxxxxxxxxx
```

---

## Step 5: Test with Stripe CLI (Development)

For local development, use Stripe CLI to forward webhooks:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/stripe/webhook

# This will print a webhook signing secret (whsec_...)
# Use this as STRIPE_WEBHOOK_SECRET for local testing
```

---

## Product Details for Stripe

### TOKNS Pro
```
Name: TOKNS Pro
Description: Unlimited tokens for small teams. Includes API access, team collaboration, and priority support.

Monthly Price: $9.99/month
Yearly Price: $79.99/year (33% discount)

Features:
- Unlimited tokens
- Up to 10 team members
- Team collaboration
- Programmatic API access
- AI parser included
- Webhooks
- Cloud backup
- Priority email support
```

### TOKNS Ultra
```
Name: TOKNS Ultra
Description: Unlimited everything for organizations. Includes white-glove support and SLA.

Monthly Price: $24.99/month
Yearly Price: $199.99/year (33% discount)

Features:
- Unlimited tokens
- Unlimited team members
- Unlimited teams
- Programmatic API access
- AI parser included
- Webhooks
- Cloud backup
- White-glove support
- Custom branding
- SLA 99.9% uptime
```

---

## Checklist

- [ ] Create Pro product in Stripe
- [ ] Create Ultra product in Stripe
- [ ] Copy all 4 Price IDs
- [ ] Set up webhook endpoint
- [ ] Copy webhook signing secret
- [ ] Add all environment variables
- [ ] Test checkout flow
- [ ] Test webhook handling

---

## Testing

### Test Mode vs Live Mode

Stripe has two modes:
- **Test Mode:** Use test cards like `4242 4242 4242 4242`
- **Live Mode:** Real payments

Toggle between modes in the Stripe Dashboard.

### Test Cards

| Card Number | Result |
|-------------|--------|
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 0002` | Decline |
| `4000 0000 0000 3220` | 3D Secure |

---

## Support

If you encounter issues:
1. Check Stripe Dashboard logs
2. Check your application logs
3. Verify all environment variables are set
4. Ensure webhook is receiving events
