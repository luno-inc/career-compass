const DEFAULT_BYPASS_EMAILS = [
  'info@luno-jp.com',
  'atsuki20150047@gmail.com',
  'kent20210325@keio.jp',
];

function normalize(email: string): string {
  return email.trim().toLowerCase();
}

function parseCsv(raw?: string): string[] {
  if (!raw) return [];
  return raw
    .split(',')
    .map((v) => normalize(v))
    .filter(Boolean);
}

export function getBillingBypassEmails(): string[] {
  const fromServerEnv = parseCsv(process.env.BILLING_BYPASS_EMAILS);
  const merged = [...DEFAULT_BYPASS_EMAILS.map(normalize), ...fromServerEnv];
  return Array.from(new Set(merged));
}

export function isBypassUser(email?: string | null): boolean {
  if (!email) return false;
  const target = normalize(email);
  return getBillingBypassEmails().includes(target);
}

