// TOKNS Pricing Configuration
// Configure these price IDs in your Stripe Dashboard

export type PlanType = 'FREE' | 'PRO' | 'ULTRA';
export type BillingInterval = 'monthly' | 'yearly';

export interface PricingPlan {
  id: PlanType;
  name: string;
  description: string;
  features: string[];
  limits: {
    tokens: number | 'unlimited';
    users: number | 'unlimited';
    teams: number | 'unlimited';
    apiAccess: boolean;
    aiParser: boolean;
    webhooks: boolean;
    cloudBackup: boolean;
    prioritySupport: boolean;
  };
  pricing: {
    monthly: {
      price: number;
      priceId: string;
    };
    yearly: {
      price: number;
      priceId: string;
      discount: number; // Percentage off
    };
  };
}

// Price IDs - Configure these in Stripe Dashboard
// Format: price_<id> from Stripe
export const PRICING_PLANS: Record<PlanType, PricingPlan> = {
  FREE: {
    id: 'FREE',
    name: 'Free',
    description: 'For individual developers getting started',
    features: [
      '15 tokens maximum',
      '1 user',
      'Basic token management',
      'Local encryption',
      'AI parser (bring your own key)',
      'Community support',
    ],
    limits: {
      tokens: 15,
      users: 1,
      teams: 0,
      apiAccess: false,
      aiParser: true,
      webhooks: false,
      cloudBackup: false,
      prioritySupport: false,
    },
    pricing: {
      monthly: { price: 0, priceId: '' },
      yearly: { price: 0, priceId: '', discount: 0 },
    },
  },
  PRO: {
    id: 'PRO',
    name: 'Pro',
    description: 'For small teams and power users',
    features: [
      'Unlimited tokens',
      'Up to 10 team members',
      'Team collaboration',
      'Programmatic API access',
      'AI parser included',
      'Webhooks',
      'Cloud backup',
      'Priority email support',
    ],
    limits: {
      tokens: 'unlimited',
      users: 10,
      teams: 5,
      apiAccess: true,
      aiParser: true,
      webhooks: true,
      cloudBackup: true,
      prioritySupport: true,
    },
    pricing: {
      monthly: {
        price: 999, // $9.99 in cents
        priceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || 'price_pro_monthly',
      },
      yearly: {
        price: 7999, // $79.99/year (~$6.67/month) - 33% discount
        priceId: process.env.STRIPE_PRO_YEARLY_PRICE_ID || 'price_pro_yearly',
        discount: 33,
      },
    },
  },
  ULTRA: {
    id: 'ULTRA',
    name: 'Ultra',
    description: 'For organizations with unlimited scale',
    features: [
      'Unlimited tokens',
      'Unlimited team members',
      'Unlimited teams',
      'Programmatic API access',
      'AI parser included',
      'Webhooks',
      'Cloud backup',
      'White-glove support',
      'Custom branding',
      'SLA 99.9% uptime',
    ],
    limits: {
      tokens: 'unlimited',
      users: 'unlimited',
      teams: 'unlimited',
      apiAccess: true,
      aiParser: true,
      webhooks: true,
      cloudBackup: true,
      prioritySupport: true,
    },
    pricing: {
      monthly: {
        price: 2499, // $24.99 in cents
        priceId: process.env.STRIPE_ULTRA_MONTHLY_PRICE_ID || 'price_ultra_monthly',
      },
      yearly: {
        price: 19999, // $199.99/year (~$16.67/month) - 33% discount
        priceId: process.env.STRIPE_ULTRA_YEARLY_PRICE_ID || 'price_ultra_yearly',
        discount: 33,
      },
    },
  },
};

// Helper functions
export function getPlan(planId: PlanType): PricingPlan {
  return PRICING_PLANS[planId];
}

export function getPriceId(planId: PlanType, interval: BillingInterval): string {
  return PRICING_PLANS[planId].pricing[interval].priceId;
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function getYearlySavings(planId: PlanType): string {
  const plan = PRICING_PLANS[planId];
  if (plan.pricing.monthly.price === 0) return '';
  const monthlyYearly = plan.pricing.monthly.price * 12;
  const yearly = plan.pricing.yearly.price;
  const savings = monthlyYearly - yearly;
  return `Save ${formatPrice(savings)}/year`;
}

// Stripe Product Configuration Guide
export const STRIPE_PRODUCT_CONFIG = {
  PRO: {
    name: 'TOKNS Pro',
    description: 'Unlimited tokens for small teams. Includes API access, team collaboration, and priority support.',
    monthly: {
      name: 'TOKNS Pro - Monthly',
      description: '$9.99/month - Billed monthly',
    },
    yearly: {
      name: 'TOKNS Pro - Annual',
      description: '$79.99/year - Billed annually (Save 33%)',
    },
  },
  ULTRA: {
    name: 'TOKNS Ultra',
    description: 'Unlimited everything for organizations. Includes white-glove support and SLA.',
    monthly: {
      name: 'TOKNS Ultra - Monthly',
      description: '$24.99/month - Billed monthly',
    },
    yearly: {
      name: 'TOKNS Ultra - Annual',
      description: '$199.99/year - Billed annually (Save 33%)',
    },
  },
};
