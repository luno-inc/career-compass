import { NextResponse } from 'next/server';
import { getBillingStatus } from '@/lib/billing-store';
import { getVerifiedEmailFromCookie } from '@/lib/billing-auth';
import { isBypassUser } from '@/lib/billing-whitelist';

export async function GET() {
  try {
    const email = await getVerifiedEmailFromCookie();
    if (!email) {
      return NextResponse.json({ ok: true, authenticated: false, billing: null, bypass: false });
    }
    const billing = await getBillingStatus(email);
    return NextResponse.json({ ok: true, authenticated: true, billing, bypass: isBypassUser(email) });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

