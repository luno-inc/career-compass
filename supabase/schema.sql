create extension if not exists pgcrypto;

create table if not exists public.customers (
  email text primary key,
  stripe_customer_id text unique,
  email_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.entitlements (
  email text primary key references public.customers(email) on delete cascade,
  subscription_status text not null default 'inactive',
  subscription_id text,
  subscription_period_end timestamptz,
  monthly_quota int not null default 30,
  monthly_used int not null default 0,
  monthly_period_key text not null default to_char(now(), 'YYYY-MM'),
  one_time_credits int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.usage_logs (
  id uuid primary key default gen_random_uuid(),
  email text not null references public.customers(email) on delete cascade,
  scenario_generation_id text not null,
  source_plan text not null check (source_plan in ('subscription', 'one_time')),
  consumed_at timestamptz not null default now(),
  idempotency_key text unique
);

create table if not exists public.email_verification_tokens (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  code_hash text not null,
  token text,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_email_verification_tokens_email_created_at
  on public.email_verification_tokens (email, created_at desc);

