import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/db';
import { headers } from 'next/server';
import type { PlanType } from '@/lib/pricing';

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  return new Stripe(key, { apiVersion: '2026-01-28.clover' });
}

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  try {
    const stripe = getStripe();
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Get user ID and plan from metadata
        const userId = session.metadata?.userId;
        const planId = session.metadata?.planId as PlanType;
        const subscriptionId = session.subscription as string;
        
        if (userId && planId) {
          // Update user to new plan
          await prisma.users.update({
            where: { id: userId },
            data: { 
              plan: planId,
              stripeSubscriptionId: subscriptionId,
            },
          });
          
          console.log(`User ${userId} upgraded to ${planId}`);
        }
        break;
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        const planId = subscription.metadata?.planId as PlanType;
        
        if (userId && planId) {
          // Update plan if changed
          await prisma.users.update({
            where: { id: userId },
            data: { plan: planId },
          });
          
          console.log(`User ${userId} subscription updated to ${planId}`);
        }
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Find user by stripe subscription ID and downgrade to FREE
        const user = await prisma.users.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        });
        
        if (user) {
          await prisma.users.update({
            where: { id: user.id },
            data: { 
              plan: 'FREE',
              stripeSubscriptionId: null,
            },
          });
          
          console.log(`User ${user.id} downgraded to FREE (subscription cancelled)`);
        }
        break;
      }
      
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        
        // Handle failed payment - could send email notification
        console.log('Payment failed for invoice:', invoice.id, 'customer:', invoice.customer);
        break;
      }
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
