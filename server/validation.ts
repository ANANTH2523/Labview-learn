import type { MentorPersonaId } from '../src/types/index.ts';

export const MENTOR_PERSONA_IDS: readonly MentorPersonaId[] = ['professor', 'mentor', 'nigel'];

export const LIMITS = {
  message: 4_000,
  topic: 300,
  historyText: 2_000,
  historyItems: 6,
  field: 2_000,
  promptDraft: 8_000,
} as const;

export interface HistoryEntry {
  sender: 'user' | 'assistant';
  text: string;
}

export interface MentorChatInput {
  persona: MentorPersonaId;
  message: string;
  history: HistoryEntry[];
  contextTopic: string;
}

export interface NigelAssistInput {
  testRequirement: string;
  targetHardware: string;
  architecturePattern: string;
  promptDraft: string;
}

export type ValidationResult<T> = { ok: true; value: T } | { ok: false; error: string };

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

/** Optional string field: missing → '', wrong type or too long → error. */
function optionalString(
  body: Record<string, unknown>,
  key: string,
  max: number,
): ValidationResult<string> {
  const raw = body[key];
  if (raw === undefined || raw === null) return { ok: true, value: '' };
  if (typeof raw !== 'string') return { ok: false, error: `"${key}" must be a string.` };
  const value = raw.trim();
  if (value.length > max) return { ok: false, error: `"${key}" must be at most ${max} characters.` };
  return { ok: true, value };
}

export function validateMentorChat(body: unknown): ValidationResult<MentorChatInput> {
  if (!isRecord(body)) return { ok: false, error: 'Request body must be a JSON object.' };

  const message = optionalString(body, 'message', LIMITS.message);
  if (!message.ok) return message;
  if (!message.value) return { ok: false, error: '"message" is required.' };

  const topic = optionalString(body, 'contextTopic', LIMITS.topic);
  if (!topic.ok) return topic;

  const persona = body.persona ?? 'professor';
  if (typeof persona !== 'string' || !MENTOR_PERSONA_IDS.includes(persona as MentorPersonaId)) {
    return { ok: false, error: `"persona" must be one of: ${MENTOR_PERSONA_IDS.join(', ')}.` };
  }

  // History is advisory context: drop malformed entries instead of rejecting the request.
  const rawHistory = Array.isArray(body.history) ? body.history : [];
  const history = rawHistory
    .filter(
      (h): h is HistoryEntry =>
        isRecord(h) &&
        (h.sender === 'user' || h.sender === 'assistant') &&
        typeof h.text === 'string',
    )
    .slice(-LIMITS.historyItems)
    .map((h) => ({ sender: h.sender, text: h.text.slice(0, LIMITS.historyText) }));

  return {
    ok: true,
    value: { persona: persona as MentorPersonaId, message: message.value, history, contextTopic: topic.value },
  };
}

export function validateNigelAssist(body: unknown): ValidationResult<NigelAssistInput> {
  if (!isRecord(body)) return { ok: false, error: 'Request body must be a JSON object.' };

  const fields = [
    ['testRequirement', LIMITS.field],
    ['targetHardware', LIMITS.field],
    ['architecturePattern', LIMITS.field],
    ['promptDraft', LIMITS.promptDraft],
  ] as const;

  const out: Record<string, string> = {};
  for (const [key, max] of fields) {
    const result = optionalString(body, key, max);
    if (!result.ok) return result;
    out[key] = result.value;
  }
  return { ok: true, value: out as unknown as NigelAssistInput };
}
