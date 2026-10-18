import { useEffect, useState } from 'react';

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

const browserStorage = (): StorageLike | null => {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null; // access can throw when storage is blocked
  }
};

/** Read a persisted string set; falls back on missing, corrupt or wrongly-shaped data. */
export function loadStringSet(
  key: string,
  fallback: Iterable<string>,
  storage: StorageLike | null = browserStorage(),
): Set<string> {
  try {
    const raw = storage?.getItem(key);
    if (raw == null) return new Set(fallback);
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every((x) => typeof x === 'string')) return new Set(parsed);
  } catch {
    // fall through to the fallback
  }
  return new Set(fallback);
}

/** Read a persisted non-negative integer within [0, max]; otherwise the fallback. */
export function loadIndex(
  key: string,
  max: number,
  fallback = 0,
  storage: StorageLike | null = browserStorage(),
): number {
  try {
    const raw = storage?.getItem(key);
    if (raw == null) return fallback;
    const n = Number(raw);
    if (Number.isInteger(n) && n >= 0 && n <= max) return n;
  } catch {
    // fall through
  }
  return fallback;
}

export function saveValue(key: string, value: unknown, storage: StorageLike | null = browserStorage()): void {
  try {
    storage?.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  } catch (error) {
    console.warn(`Could not persist "${key}":`, error);
  }
}

export function removeValues(keys: string[], storage: StorageLike | null = browserStorage()): void {
  for (const key of keys) {
    try {
      storage?.removeItem(key);
    } catch {
      // ignore: nothing useful to do if storage is unavailable
    }
  }
}

/** A Set<string> state that is hydrated from and mirrored to localStorage. */
export function usePersistentSet(key: string, initial: readonly string[]) {
  const state = useState<Set<string>>(() => loadStringSet(key, initial));
  const [value] = state;
  useEffect(() => saveValue(key, [...value]), [key, value]);
  return state;
}

/** A bounded integer state that is hydrated from and mirrored to localStorage. */
export function usePersistentIndex(key: string, max: number) {
  const state = useState<number>(() => loadIndex(key, max));
  const [value] = state;
  useEffect(() => saveValue(key, String(value)), [key, value]);
  return state;
}
