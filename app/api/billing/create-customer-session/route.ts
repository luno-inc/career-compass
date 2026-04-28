import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const { customerId } = (await request.json()) as { customerId?: string };
    if (!customerId) {
      return NextResponse.json({ ok: false, error: 'customerId is required' }, { status: 400 });
    }
    const stripe = getStripe();
    const session = await stripe.customerSessions.create({
      customer: customerId,
      components: {
        pricing_table: { enabled: true },
      },
    });
    return NextResponse.json({ ok: true, clientSecret: session.client_secret });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

