import test from 'node:test';
import assert from 'node:assert/strict';
import { LIMITS, validateMentorChat, validateNigelAssist } from './validation.ts';

test('mentor chat: rejects non-object bodies and missing message', () => {
  assert.equal(validateMentorChat(null).ok, false);
  assert.equal(validateMentorChat([]).ok, false);
  assert.equal(validateMentorChat({ persona: 'professor' }).ok, false);
  assert.equal(validateMentorChat({ message: '   ' }).ok, false);
});

test('mentor chat: rejects unknown persona, non-string message and oversized message', () => {
  assert.equal(validateMentorChat({ message: 'hi', persona: 'wizard' }).ok, false);
  assert.equal(validateMentorChat({ message: 42 }).ok, false);
  assert.equal(validateMentorChat({ message: 'x'.repeat(LIMITS.message + 1) }).ok, false);
});

test('mentor chat: defaults persona, trims, and sanitizes history', () => {
  const result = validateMentorChat({
    message: '  what is a shift register? ',
    history: [
      { sender: 'user', text: 'a' },
      { sender: 'robot', text: 'dropped: bad sender' },
      { sender: 'assistant', text: 5 },
      null,
      { sender: 'assistant', text: 'b'.repeat(LIMITS.historyText + 50) },
    ],
  });
  assert.ok(result.ok);
  assert.equal(result.value.persona, 'professor');
  assert.equal(result.value.message, 'what is a shift register?');
  assert.equal(result.value.history.length, 2);
  assert.equal(result.value.history[1].text.length, LIMITS.historyText);
});

test('mentor chat: keeps only the most recent history entries', () => {
  const history = Array.from({ length: 20 }, (_, i) => ({ sender: 'user', text: `m${i}` }));
  const result = validateMentorChat({ message: 'hi', history });
  assert.ok(result.ok);
  assert.equal(result.value.history.length, LIMITS.historyItems);
  assert.equal(result.value.history.at(-1)?.text, 'm19');
});

test('nigel assist: all fields optional, defaults to empty strings', () => {
  const result = validateNigelAssist({});
  assert.ok(result.ok);
  assert.deepEqual(result.value, {
    testRequirement: '',
    targetHardware: '',
    architecturePattern: '',
    promptDraft: '',
  });
});

test('nigel assist: rejects wrong types and oversized fields', () => {
  assert.equal(validateNigelAssist({ targetHardware: 7 }).ok, false);
  assert.equal(validateNigelAssist({ promptDraft: 'x'.repeat(LIMITS.promptDraft + 1) }).ok, false);
  assert.equal(validateNigelAssist('nope').ok, false);
});
