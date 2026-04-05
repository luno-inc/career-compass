import { z } from 'zod';

/** 1シナリオあたりの文字列上限（LLM 長文を想定） */
const MAX_FIELD = 20000;
const MAX_TITLE = 500;

export const sharedScenarioItemSchema = z.object({
  scenario_title: z.string().max(MAX_TITLE).optional().default(''),
  role_definition: z.string().max(MAX_FIELD).optional(),
  scenario_description: z.string().max(MAX_FIELD).optional(),
  reasoning: z.string().max(MAX_FIELD).optional(),
  next_step_recommendation: z.string().max(MAX_FIELD).optional(),
  scenario_type: z.enum(['realistic', 'growth', 'risk']).optional(),
});

export const sharedScenarioPayloadSchema = z.object({
  scenarios: z.array(sharedScenarioItemSchema).min(1).max(3),
});

export type SharedScenarioItem = z.infer<typeof sharedScenarioItemSchema>;
export type SharedScenarioPayload = z.infer<typeof sharedScenarioPayloadSchema>;

export const MAX_SHARE_JSON_BYTES = 100_000;

export function assertPayloadSize(json: string): void {
  const enc = new TextEncoder().encode(json);
  if (enc.length > MAX_SHARE_JSON_BYTES) {
    throw new Error('PAYLOAD_TOO_LARGE');
  }
}

const SHARE_ID_RE = /^[a-zA-Z0-9_-]{12,22}$/;

export function isValidShareId(id: string | null | undefined): id is string {
  return typeof id === 'string' && SHARE_ID_RE.test(id);
}

export function stripScenarioForStorage(s: SharedScenarioItem) {
  return {
    scenario_title: s.scenario_title ?? '',
    role_definition: s.role_definition,
    scenario_description: s.scenario_description,
    reasoning: s.reasoning,
    next_step_recommendation: s.next_step_recommendation,
    scenario_type: s.scenario_type,
  };
}
