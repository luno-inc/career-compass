import { NextResponse } from 'next/server';
import { clearVerifiedEmailCookie } from '@/lib/billing-auth';

export async function POST() {
  await clearVerifiedEmailCookie();
  return NextResponse.json({ ok: true });
}

