const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function assertSupabaseEnv() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase environment variables are not configured.');
  }
}

export async function supabaseAdminFetch(path: string, init: RequestInit = {}) {
  assertSupabaseEnv();
  const url = `${SUPABASE_URL}${path}`;
  const headers = new Headers(init.headers || {});
  headers.set('apikey', SUPABASE_SERVICE_ROLE_KEY!);
  headers.set('Authorization', `Bearer ${SUPABASE_SERVICE_ROLE_KEY!}`);
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');

  return fetch(url, { ...init, headers, cache: 'no-store' });
}

export function getMonthlyQuota(): number {
  const raw = process.env.ENTITLEMENT_MONTHLY_QUOTA;
  const n = raw ? Number.parseInt(raw, 10) : 30;
  if (!Number.isFinite(n) || n <= 0) return 30;
  return n;
}

