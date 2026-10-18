export interface ServerConfig {
  port: number;
  isProduction: boolean;
  geminiApiKey: string | undefined;
  geminiModel: string;
  /** Max requests per client per window on the AI endpoints. */
  rateLimitMax: number;
  rateLimitWindowMs: number;
}

const DEFAULT_MODEL = 'gemini-3.8-flash';

function positiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): ServerConfig {
  return {
    port: positiveInt(env.PORT, 3000),
    isProduction: env.NODE_ENV === 'production',
    geminiApiKey: env.GEMINI_API_KEY?.trim() || undefined,
    geminiModel: env.GEMINI_MODEL?.trim() || DEFAULT_MODEL,
    rateLimitMax: positiveInt(env.RATE_LIMIT_MAX, 30),
    rateLimitWindowMs: positiveInt(env.RATE_LIMIT_WINDOW_MS, 60_000),
  };
}
