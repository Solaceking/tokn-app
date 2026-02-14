import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase-server';
import { prisma } from '@/lib/db';

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  return new Stripe(key, { apiVersion: '2026-01-28.clover' });
}

// Price IDs from Stripe Dashboard
const PRICE_IDS = {
  PRO_MONTHLY: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || 'price_pro_monthly',
};

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
    const { priceId } = body;
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId || PRICE_IDS.PRO_MONTHLY,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/settings?upgrade=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/settings?upgrade=cancelled`,
      customer_email: user.email || undefined,
      metadata: {
        userId: dbUser.id,
        email: user.email || '',
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
