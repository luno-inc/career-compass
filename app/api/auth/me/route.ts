import { NextResponse } from 'next/server';
import { getVerifiedEmailFromCookie } from '@/lib/billing-auth';

export async function GET() {
  const email = await getVerifiedEmailFromCookie();
  return NextResponse.json({ ok: true, authenticated: !!email, email: email || null });
}

