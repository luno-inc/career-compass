import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

type PlanType = 'one_time' | 'subscription';

function getPriceId(planType: PlanType): string | null {
  if (planType === 'one_time') return process.env.STRIPE_PRICE_ONETIME_100 || null;
  return process.env.STRIPE_PRICE_SUB_MONTHLY_1000 || null;
}

export async function POST(request: NextRequest) {
  try {
    const { planType, email } = (await request.json()) as { planType?: PlanType; email?: string };
    if (!planType || !email) {
      return NextResponse.json({ ok: false, error: 'planType and email are required' }, { status: 400 });
    }
    if (planType !== 'one_time' && planType !== 'subscription') {
      return NextResponse.json({ ok: false, error: 'invalid planType' }, { status: 400 });
    }

    const priceId = getPriceId(planType);
    if (!priceId) {
      return NextResponse.json({ ok: false, error: 'Stripe price id is not configured' }, { status: 500 });
    }

    const stripe = getStripe();
    const origin = request.nextUrl.origin;
    const mode = planType === 'one_time' ? 'payment' : 'subscription';

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      mode,
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { planType, email },
      return_url: `${origin}/event-selection?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    });

    return NextResponse.json({
      ok: true,
      sessionId: session.id,
      clientSecret: session.client_secret,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

