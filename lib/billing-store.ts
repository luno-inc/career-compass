import { nanoid } from 'nanoid';
import { getMonthlyQuota, supabaseAdminFetch } from '@/lib/supabase-admin';

export type BillingStatus = {
  email: string;
  hasSubscription: boolean;
  subscriptionStatus: string;
  monthlyQuota: number;
  monthlyUsed: number;
  monthlyRemaining: number;
  oneTimeCredits: number;
};

type EntitlementRow = {
  email: string;
  subscription_status: string;
  subscription_id: string | null;
  subscription_period_end: string | null;
  monthly_quota: number;
  monthly_used: number;
  monthly_period_key: string;
  one_time_credits: number;
};

function periodKey(date = new Date()): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}

function isSubscriptionActive(row: EntitlementRow) {
  if (row.subscription_status !== 'active') return false;
  if (!row.subscription_period_end) return true;
  return new Date(row.subscription_period_end).getTime() > Date.now();
}

async function upsertCustomer(email: string, stripeCustomerId?: string) {
  const body = {
    email,
    stripe_customer_id: stripeCustomerId ?? null,
    updated_at: new Date().toISOString(),
  };
  await supabaseAdminFetch('/rest/v1/customers?on_conflict=email', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates' },
    body: JSON.stringify(body),
  });
}

export async function markEmailVerified(email: string) {
  await upsertCustomer(email);
  await supabaseAdminFetch(`/rest/v1/customers?email=eq.${encodeURIComponent(email)}`, {
    method: 'PATCH',
    body: JSON.stringify({
      email_verified_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }),
  });
}

export async function getOrCreateEntitlement(email: string): Promise<EntitlementRow> {
  await upsertCustomer(email);
  const q = `/rest/v1/entitlements?email=eq.${encodeURIComponent(email)}&select=*`;
  const res = await supabaseAdminFetch(q);
  const rows = (await res.json()) as EntitlementRow[];
  if (rows.length > 0) return rows[0];

  const created: Partial<EntitlementRow> = {
    email,
    subscription_status: 'inactive',
    monthly_quota: getMonthlyQuota(),
    monthly_used: 0,
    monthly_period_key: periodKey(),
    one_time_credits: 0,
  };
  const insertRes = await supabaseAdminFetch('/rest/v1/entitlements', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(created),
  });
  const inserted = (await insertRes.json()) as EntitlementRow[];
  return inserted[0];
}

async function patchEntitlement(email: string, patch: Partial<EntitlementRow>) {
  await supabaseAdminFetch(`/rest/v1/entitlements?email=eq.${encodeURIComponent(email)}`, {
    method: 'PATCH',
    body: JSON.stringify({
      ...patch,
      updated_at: new Date().toISOString(),
    }),
  });
}

export async function grantOneTimeCredit(email: string, stripeCustomerId?: string) {
  await upsertCustomer(email, stripeCustomerId);
  const row = await getOrCreateEntitlement(email);
  await patchEntitlement(email, { one_time_credits: (row.one_time_credits || 0) + 1 });
}

export async function upsertSubscriptionState(params: {
  email: string;
  stripeCustomerId?: string;
  subscriptionId?: string | null;
  status: string;
  currentPeriodEnd?: number | null;
}) {
  const { email, stripeCustomerId, subscriptionId, status, currentPeriodEnd } = params;
  await upsertCustomer(email, stripeCustomerId);
  const row = await getOrCreateEntitlement(email);
  await patchEntitlement(email, {
    subscription_status: status,
    subscription_id: subscriptionId ?? row.subscription_id,
    subscription_period_end: currentPeriodEnd ? new Date(currentPeriodEnd * 1000).toISOString() : row.subscription_period_end,
    monthly_quota: getMonthlyQuota(),
    ...(status === 'active'
      ? {
          monthly_period_key: periodKey(),
          monthly_used: 0,
        }
      : {}),
  });
}

async function ensureMonthlyWindow(row: EntitlementRow): Promise<EntitlementRow> {
  const current = periodKey();
  if (row.monthly_period_key === current) return row;
  await patchEntitlement(row.email, { monthly_period_key: current, monthly_used: 0 });
  return { ...row, monthly_period_key: current, monthly_used: 0 };
}

export async function consumeScenarioCredit(email: string) {
  let row = await getOrCreateEntitlement(email);
  row = await ensureMonthlyWindow(row);

  if (isSubscriptionActive(row)) {
    const used = row.monthly_used || 0;
    const quota = row.monthly_quota || getMonthlyQuota();
    if (used < quota) {
      const scenarioGenerationId = nanoid();
      await patchEntitlement(email, { monthly_used: used + 1 });
      await supabaseAdminFetch('/rest/v1/usage_logs', {
        method: 'POST',
        body: JSON.stringify({
          email,
          scenario_generation_id: scenarioGenerationId,
          source_plan: 'subscription',
          idempotency_key: `sub_${email}_${scenarioGenerationId}`,
        }),
      });
      return { ok: true as const, sourcePlan: 'subscription', remaining: quota - (used + 1) };
    }
  }

  if ((row.one_time_credits || 0) > 0) {
    const scenarioGenerationId = nanoid();
    await patchEntitlement(email, { one_time_credits: row.one_time_credits - 1 });
    await supabaseAdminFetch('/rest/v1/usage_logs', {
      method: 'POST',
      body: JSON.stringify({
        email,
        scenario_generation_id: scenarioGenerationId,
        source_plan: 'one_time',
        idempotency_key: `one_${email}_${scenarioGenerationId}`,
      }),
    });
    return { ok: true as const, sourcePlan: 'one_time', remaining: row.one_time_credits - 1 };
  }

  return { ok: false as const };
}

export async function getBillingStatus(email: string): Promise<BillingStatus> {
  let row = await getOrCreateEntitlement(email);
  row = await ensureMonthlyWindow(row);
  const quota = row.monthly_quota || getMonthlyQuota();
  const used = row.monthly_used || 0;
  const active = isSubscriptionActive(row);
  return {
    email,
    hasSubscription: active,
    subscriptionStatus: row.subscription_status || 'inactive',
    monthlyQuota: quota,
    monthlyUsed: used,
    monthlyRemaining: active ? Math.max(0, quota - used) : 0,
    oneTimeCredits: row.one_time_credits || 0,
  };
}

