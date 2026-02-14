'use client';

import { useState } from 'react';
import { Check, Zap, Crown } from 'lucide-react';
import { PRICING_PLANS, formatPrice, getYearlySavings, type PlanType, type BillingInterval } from '@/lib/pricing';

interface PricingCardsProps {
  currentPlan: PlanType;
  onSelectPlan: (planId: PlanType, interval: BillingInterval) => void;
  isLoading?: boolean;
}

export function PricingCards({ currentPlan, onSelectPlan, isLoading }: PricingCardsProps) {
  const [interval, setInterval] = useState<BillingInterval>('monthly');

  return (
    <div className="space-y-6">
      {/* Billing Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-lg border-2 border-[#404040] p-1">
          <button
            onClick={() => setInterval('monthly')}
            className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
              interval === 'monthly'
                ? 'bg-[#FF9F1C] text-black'
                : 'text-[#737373] hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setInterval('yearly')}
            className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
              interval === 'yearly'
                ? 'bg-[#FF9F1C] text-black'
                : 'text-[#737373] hover:text-white'
            }`}
          >
            Yearly
            <span className="ml-2 text-xs text-green-500">Save 33%</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(Object.keys(PRICING_PLANS) as PlanType[]).map((planId) => {
          const plan = PRICING_PLANS[planId];
          const price = plan.pricing[interval].price;
          const isCurrent = currentPlan === planId;
          const isPopular = planId === 'PRO';
          
          return (
            <div
              key={planId}
              className={`relative border-2 p-6 ${
                isPopular 
                  ? 'border-[#FF9F1C] bg-[#FF9F1C]/5' 
                  : 'border-[#404040] bg-[#171717]'
              } ${isCurrent ? 'ring-2 ring-green-500' : ''}`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-[#FF9F1C] text-black text-xs font-bold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {planId === 'PRO' && <Zap className="w-5 h-5 text-[#FF9F1C]" />}
                  {planId === 'ULTRA' && <Crown className="w-5 h-5 text-[#FF9F1C]" />}
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                </div>
                <p className="text-sm text-[#737373]">{plan.description}</p>
              </div>

              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-white">
                    {price === 0 ? 'Free' : formatPrice(price)}
                  </span>
                  {price > 0 && (
                    <span className="text-[#737373]">
                      /{interval === 'monthly' ? 'mo' : 'yr'}
                    </span>
                  )}
                </div>
                {interval === 'yearly' && price > 0 && (
                  <p className="text-sm text-green-500 mt-1">
                    {getYearlySavings(planId)}
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-[#737373]">
                    <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => planId !== 'FREE' && onSelectPlan(planId, interval)}
                disabled={isCurrent || isLoading || planId === 'FREE'}
                className={`w-full py-3 font-bold transition-colors ${
                  isCurrent
                    ? 'bg-green-500/20 text-green-500 cursor-default'
                    : planId === 'FREE'
                    ? 'bg-[#404040] text-[#737373] cursor-default'
                    : 'bg-[#FF9F1C] text-black hover:bg-[#FF9F1C]/90'
                }`}
              >
                {isCurrent ? 'Current Plan' : planId === 'FREE' ? 'Free Forever' : 'Upgrade'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
