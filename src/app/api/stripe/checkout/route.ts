import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase-server';
import { prisma } from '@/lib/db';
import { getPriceId, type PlanType, type BillingInterval } from '@/lib/pricing';

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  return new Stripe(key, { apiVersion: '2026-01-28.clover' });
}

export async function POST(request: Request) {
  try {
    const stripe = getStripe();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get database user
    const dbUser = await prisma.users.findUnique({
      where: { email: user.email },
    });
    
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    const body = await request.json();
    const { planId, interval } = body as { planId: PlanType; interval: BillingInterval };
    
    // Validate plan
    if (!planId || !interval) {
      return NextResponse.json({ 
        error: 'Missing planId or interval' 
      }, { status: 400 });
    }
    
    if (planId === 'FREE') {
      return NextResponse.json({ 
        error: 'Cannot subscribe to FREE plan' 
      }, { status: 400 });
    }
    
    // Get the price ID for the selected plan and interval
    const priceId = getPriceId(planId, interval);
    
    if (!priceId || priceId.startsWith('price_') === false) {
      return NextResponse.json({ 
        error: 'Invalid price configuration. Please contact support.' 
      }, { status: 500 });
    }
    
    // Get or create Stripe customer
    let customerId = dbUser.stripeCustomerId;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: dbUser.full_name || dbUser.username || undefined,
        metadata: {
          userId: dbUser.id,
        },
      });
      customerId = customer.id;
      
      // Save customer ID to database
      await prisma.users.update({
        where: { id: dbUser.id },
        data: { stripeCustomerId: customerId },
      });
    }
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/settings?upgrade=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/settings?upgrade=cancelled`,
      metadata: {
        userId: dbUser.id,
        email: user.email || '',
        planId: planId,
        interval: interval,
      },
      subscription_data: {
        metadata: {
          userId: dbUser.id,
          planId: planId,
        },
      },
    });
    
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
