import { Redis } from '@upstash/redis';
import { customAlphabet } from 'nanoid';
import {
  assertPayloadSize,
  sharedScenarioPayloadSchema,
  stripScenarioForStorage,
  type SharedScenarioItem,
} from '@/lib/shared-scenario-schema';

const KEY_PREFIX = 'cc:share:';
const inMemoryShareStore = new Map<string, { record: StoredShareRecord; expiresAt: number }>();

const nanoidShareId = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  16
);

function ttlSeconds(): number {
  const raw = process.env.SHARED_SCENARIO_TTL_SEC;
  if (raw) {
    const n = Number.parseInt(raw, 10);
    if (Number.isFinite(n) && n >= 3600 && n <= 365 * 24 * 3600) return n;
  }
  return 30 * 24 * 3600;
}

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export type StoredShareRecord = {
  scenarios: SharedScenarioItem[];
  createdAt: string;
};

function cleanupInMemoryStore(now: number) {
  for (const [key, value] of inMemoryShareStore.entries()) {
    if (value.expiresAt <= now) inMemoryShareStore.delete(key);
  }
}

export async function createSharedScenario(
  body: unknown
): Promise<{ ok: true; id: string } | { ok: false; error: string; status: number }> {
  const redis = getRedis();

  const parsed = sharedScenarioPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return { ok: false, error: '無効なリクエストです。', status: 400 };
  }

  const scenarios = parsed.data.scenarios.map(stripScenarioForStorage);
  const record: StoredShareRecord = {
    scenarios,
    createdAt: new Date().toISOString(),
  };
  const json = JSON.stringify(record);
  try {
    assertPayloadSize(json);
  } catch {
    return { ok: false, error: '共有データが大きすぎます。', status: 413 };
  }

  const id = nanoidShareId();
  const key = `${KEY_PREFIX}${id}`;
  const ttl = ttlSeconds();
  if (redis) {
    await redis.set(key, json, { ex: ttl });
  } else {
    const now = Date.now();
    cleanupInMemoryStore(now);
    inMemoryShareStore.set(key, {
      record,
      expiresAt: now + ttl * 1000,
    });
  }

  return { ok: true, id };
}

export async function getSharedScenarioById(
  id: string
): Promise<StoredShareRecord | null> {
  const redis = getRedis();
  const key = `${KEY_PREFIX}${id}`;
  if (redis) {
    const raw = await redis.get(key);
    if (raw == null) return null;
    try {
      const data =
        typeof raw === 'string' ? (JSON.parse(raw) as StoredShareRecord) : (raw as StoredShareRecord);
      if (!data.scenarios || !Array.isArray(data.scenarios)) return null;
      return data;
    } catch {
      return null;
    }
  }

  const now = Date.now();
  cleanupInMemoryStore(now);
  const found = inMemoryShareStore.get(key);
  if (!found) return null;
  if (found.expiresAt <= now) {
    inMemoryShareStore.delete(key);
    return null;
  }
  return found.record;
}
