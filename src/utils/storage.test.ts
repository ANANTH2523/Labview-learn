import test from 'node:test';
import assert from 'node:assert/strict';
import { loadIndex, loadStringSet, removeValues, saveValue } from './storage.ts';

const memoryStorage = (initial: Record<string, string> = {}) => {
  const data = new Map(Object.entries(initial));
  return {
    data,
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
  };
};

test('loadStringSet round-trips saved sets', () => {
  const s = memoryStorage();
  saveValue('k', ['a', 'b'], s);
  assert.deepEqual([...loadStringSet('k', [], s)], ['a', 'b']);
});

test('loadStringSet uses the fallback for missing, corrupt or wrongly-shaped data', () => {
  assert.deepEqual([...loadStringSet('k', ['x'], memoryStorage())], ['x']);
  assert.deepEqual([...loadStringSet('k', ['x'], memoryStorage({ k: '{oops' }))], ['x']);
  assert.deepEqual([...loadStringSet('k', ['x'], memoryStorage({ k: '[1,2]' }))], ['x']);
  assert.deepEqual([...loadStringSet('k', ['x'], memoryStorage({ k: '{"a":1}' }))], ['x']);
  assert.deepEqual([...loadStringSet('k', ['x'], null)], ['x']);
});

test('loadIndex rejects NaN, negatives, fractions and out-of-range values', () => {
  for (const bad of ['abc', '-1', '2.5', '99', '']) {
    assert.equal(loadIndex('k', 6, 0, memoryStorage({ k: bad })), bad === '' ? 0 : 0, `value "${bad}"`);
  }
  assert.equal(loadIndex('k', 6, 0, memoryStorage({ k: '4' })), 4);
});

test('storage helpers never throw when storage itself throws', () => {
  const broken = {
    getItem: () => { throw new Error('blocked'); },
    setItem: () => { throw new Error('quota'); },
    removeItem: () => { throw new Error('blocked'); },
  };
  const warn = console.warn;
  console.warn = () => {};
  try {
    assert.deepEqual([...loadStringSet('k', ['x'], broken)], ['x']);
    assert.equal(loadIndex('k', 3, 1, broken), 1);
    assert.doesNotThrow(() => saveValue('k', 1, broken));
    assert.doesNotThrow(() => removeValues(['k'], broken));
  } finally {
    console.warn = warn;
  }
});
