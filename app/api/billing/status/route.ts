import { NextResponse } from 'next/server';
import { getBillingStatus } from '@/lib/billing-store';
import { getVerifiedEmailFromCookie } from '@/lib/billing-auth';

export async function GET() {
  try {
    const email = await getVerifiedEmailFromCookie();
    if (!email) {
      return NextResponse.json({ ok: true, authenticated: false, billing: null });
    }
    const billing = await getBillingStatus(email);
    return NextResponse.json({ ok: true, authenticated: true, billing });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

