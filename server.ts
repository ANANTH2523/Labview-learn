import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config({ quiet: true });
if (process.argv.includes('--prod')) process.env.NODE_ENV = 'production';

// Imported after dotenv so config reads the populated environment.
const { loadConfig } = await import('./server/config.ts');
const { createApp } = await import('./server/app.ts');
const { createGeminiClient } = await import('./server/gemini.ts');

const config = loadConfig();
const app = createApp(config, createGeminiClient(config));

const distDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'dist');

if (config.isProduction) {
  app.use(express.static(distDir));
  app.get('*', (_req, res) => res.sendFile(path.join(distDir, 'index.html')));
} else {
  // Vite is only needed in development; load it lazily.
  const { createServer } = await import('vite');
  const vite = await createServer({ server: { middlewareMode: true }, appType: 'spa' });
  app.use(vite.middlewares);
}

const server = app.listen(config.port, '0.0.0.0', () => {
  console.log(`[LabVIEW Academy] listening on http://0.0.0.0:${config.port} (${config.isProduction ? 'production' : 'development'})`);
  if (!config.geminiApiKey) console.log('[LabVIEW Academy] GEMINI_API_KEY not set: AI endpoints use offline fallbacks.');
});

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, () => {
    console.log(`[LabVIEW Academy] ${signal} received, shutting down.`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10_000).unref();
  });
}
