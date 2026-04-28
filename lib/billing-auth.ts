import crypto from 'crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'cc_verified_email';
const MAX_AGE_SEC = 60 * 60 * 24 * 30;

function authSecret(): string {
  return process.env.BILLING_AUTH_SECRET || process.env.STRIPE_WEBHOOK_SECRET || 'dev-secret-change-me';
}

function sign(email: string) {
  return crypto.createHmac('sha256', authSecret()).update(email).digest('hex');
}

function encode(email: string): string {
  const sig = sign(email);
  return Buffer.from(`${email}.${sig}`).toString('base64url');
}

function decode(value: string): string | null {
  try {
    const raw = Buffer.from(value, 'base64url').toString('utf8');
    const idx = raw.lastIndexOf('.');
    if (idx <= 0) return null;
    const email = raw.slice(0, idx);
    const sig = raw.slice(idx + 1);
    if (sig !== sign(email)) return null;
    return email;
  } catch {
    return null;
  }
}

export async function setVerifiedEmailCookie(email: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, encode(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE_SEC,
    path: '/',
  });
}

export async function clearVerifiedEmailCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getVerifiedEmailFromCookie(): Promise<string | null> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  return decode(raw);
}

