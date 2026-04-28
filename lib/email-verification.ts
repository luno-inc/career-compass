import crypto from 'crypto';
import { supabaseAdminFetch } from '@/lib/supabase-admin';

const CODE_EXP_MIN = 10;

function hashCode(code: string) {
  return crypto.createHash('sha256').update(code).digest('hex');
}

export function createVerificationCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function saveVerificationCode(email: string, code: string) {
  const expiresAt = new Date(Date.now() + CODE_EXP_MIN * 60 * 1000).toISOString();
  await supabaseAdminFetch('/rest/v1/email_verification_tokens', {
    method: 'POST',
    body: JSON.stringify({
      email,
      code_hash: hashCode(code),
      expires_at: expiresAt,
    }),
  });
}

export async function consumeVerificationCode(email: string, code: string): Promise<boolean> {
  const q = `/rest/v1/email_verification_tokens?email=eq.${encodeURIComponent(email)}&consumed_at=is.null&order=created_at.desc&limit=1`;
  const res = await supabaseAdminFetch(q);
  const rows = (await res.json()) as Array<{ id: string; code_hash: string; expires_at: string }>;
  if (!rows.length) return false;
  const row = rows[0];
  if (new Date(row.expires_at).getTime() < Date.now()) return false;
  if (row.code_hash !== hashCode(code)) return false;

  await supabaseAdminFetch(`/rest/v1/email_verification_tokens?id=eq.${row.id}`, {
    method: 'PATCH',
    body: JSON.stringify({ consumed_at: new Date().toISOString() }),
  });
  return true;
}

