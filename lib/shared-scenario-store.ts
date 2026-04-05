import { Redis } from '@upstash/redis';
import { customAlphabet } from 'nanoid';
import {
  assertPayloadSize,
  sharedScenarioPayloadSchema,
  stripScenarioForStorage,
  type SharedScenarioItem,
} from '@/lib/shared-scenario-schema';

const KEY_PREFIX = 'cc:share:';

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

export async function createSharedScenario(
  body: unknown
): Promise<{ ok: true; id: string } | { ok: false; error: string; status: number }> {
  const redis = getRedis();
  if (!redis) {
    return { ok: false, error: '共有ストアが設定されていません。', status: 503 };
  }

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
  await redis.set(key, json, { ex: ttlSeconds() });

  return { ok: true, id };
}

export async function getSharedScenarioById(
  id: string
): Promise<StoredShareRecord | null> {
  const redis = getRedis();
  if (!redis) return null;
  const key = `${KEY_PREFIX}${id}`;
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
