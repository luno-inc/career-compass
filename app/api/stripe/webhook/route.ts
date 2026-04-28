import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { grantOneTimeCredit, upsertSubscriptionState } from '@/lib/billing-store';

async function getCustomerEmail(stripe: Stripe, customerId: string | null): Promise<string | null> {
  if (!customerId) return null;
  const customer = await stripe.customers.retrieve(customerId);
  if (customer && !('deleted' in customer)) return customer.email || null;
  return null;
}

export async function POST(request: NextRequest) {
  const signature = request.headers.get('stripe-signature');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) {
    return NextResponse.json({ ok: false, error: 'Webhook secret/signature missing' }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const payload = await request.text();
    const event = stripe.webhooks.constructEvent(payload, signature, secret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const email = session.metadata?.email || session.customer_details?.email || null;
      const customerId = typeof session.customer === 'string' ? session.customer : null;
      const mode = session.mode;

      if (email && mode === 'payment') {
        await grantOneTimeCredit(email, customerId || undefined);
      } else if (email && mode === 'subscription') {
        const subscriptionId = typeof session.subscription === 'string' ? session.subscription : null;
        let periodEnd: number | null = null;
        if (subscriptionId) {
          const sub = await stripe.subscriptions.retrieve(subscriptionId);
          periodEnd = sub.current_period_end ?? null;
        }
        await upsertSubscriptionState({
          email,
          stripeCustomerId: customerId || undefined,
          subscriptionId,
          status: 'active',
          currentPeriodEnd: periodEnd,
        });
      }
    }

    if (event.type === 'invoice.paid') {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = typeof invoice.customer === 'string' ? invoice.customer : null;
      const email = await getCustomerEmail(stripe, customerId);
      if (email && invoice.subscription) {
        const subId = typeof invoice.subscription === 'string' ? invoice.subscription : null;
        const sub = subId ? await stripe.subscriptions.retrieve(subId) : null;
        await upsertSubscriptionState({
          email,
          stripeCustomerId: customerId || undefined,
          subscriptionId: subId,
          status: 'active',
          currentPeriodEnd: sub?.current_period_end ?? null,
        });
      }
    }

    if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = typeof sub.customer === 'string' ? sub.customer : null;
      const email = await getCustomerEmail(stripe, customerId);
      if (email) {
        await upsertSubscriptionState({
          email,
          stripeCustomerId: customerId || undefined,
          subscriptionId: sub.id,
          status: sub.status,
          currentPeriodEnd: sub.current_period_end ?? null,
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

