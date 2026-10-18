import { GoogleGenAI } from '@google/genai';
import type { ServerConfig } from './config.ts';

export interface GenerateOptions {
  prompt: string;
  systemInstruction?: string;
  json?: boolean;
  temperature: number;
}

/** Narrow text-generation seam so routes can be tested without the network. */
export interface AiClient {
  readonly model: string;
  generate(options: GenerateOptions): Promise<string | undefined>;
}

export function createGeminiClient(config: ServerConfig): AiClient | null {
  if (!config.geminiApiKey) return null;

  const genai = new GoogleGenAI({
    apiKey: config.geminiApiKey,
    httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
  });

  return {
    model: config.geminiModel,
    async generate({ prompt, systemInstruction, json, temperature }) {
      const response = await genai.models.generateContent({
        model: config.geminiModel,
        contents: prompt,
        config: {
          systemInstruction,
          temperature,
          ...(json ? { responseMimeType: 'application/json' } : {}),
        },
      });
      return response.text;
    },
  };
}
