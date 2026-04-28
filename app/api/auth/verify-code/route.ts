import { NextRequest, NextResponse } from 'next/server';
import { consumeVerificationCode } from '@/lib/email-verification';
import { markEmailVerified } from '@/lib/billing-store';
import { setVerifiedEmailCookie } from '@/lib/billing-auth';

export async function POST(request: NextRequest) {
  try {
    const { email, code } = (await request.json()) as { email?: string; code?: string };
    if (!email || !code) {
      return NextResponse.json({ ok: false, error: 'email and code are required' }, { status: 400 });
    }

    const valid = await consumeVerificationCode(email, code);
    if (!valid) {
      return NextResponse.json({ ok: false, error: '認証コードが不正か有効期限切れです。' }, { status: 400 });
    }

    await markEmailVerified(email);
    await setVerifiedEmailCookie(email);
    return NextResponse.json({ ok: true, email });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

