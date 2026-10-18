import test from 'node:test';
import assert from 'node:assert/strict';
import { KNOWLEDGE_TOPICS } from '../data/mentorKnowledge.ts';
import { answerQuestion, rankTopics } from './mentor-engine.ts';

test('knowledge base: unique ids and every topic has all three persona angles', () => {
  const ids = KNOWLEDGE_TOPICS.map((t) => t.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const t of KNOWLEDGE_TOPICS) {
    assert.ok(t.keywords.length > 0 && t.answer.length > 50, t.id);
    for (const p of ['professor', 'mentor', 'nigel'] as const) assert.ok(t.angle[p], `${t.id}/${p}`);
  }
});

test('routes each preset question from the Mentor tab to the right topic', () => {
  const cases: [string, string][] = [
    ['Why do Local Variables cause race conditions in LabVIEW?', 'race-conditions'],
    ['How should I structure a prompt for Nigel AI to generate a continuous DAQmx task?', 'nigel-prompting'],
    ['What is the mechanical difference between Switch When Pressed and Latch When Released?', 'boolean-mechanical-action'],
    ['What causes DAQmx Error -200279 buffer overwrite and how do I fix it?', 'daqmx'],
    ['How do I audit Nigel AI generated VIs for unwired tunnels and memory leaks?', 'nigel-prompting'],
    ['How do I architect an automated VISA SCPI test bench for production without timeouts?', 'visa-scpi'],
  ];
  for (const [question, expected] of cases) {
    assert.equal(rankTopics(question)[0]?.topic.id, expected, question);
  }
});

test('single-word keywords match whole words only', () => {
  // "scan" contains "can" but must not trigger anything
  assert.equal(rankTopics('scan').length, 0);
});

test('answers are persona-specific but share the core explanation', () => {
  const prof = answerQuestion('professor', 'Explain shift registers');
  const mentor = answerQuestion('mentor', 'Explain shift registers');
  assert.notEqual(prof.text, mentor.text);
  assert.match(prof.text, /Shift Registers/);
  assert.match(mentor.text, /Shift Registers/);
  assert.match(prof.text, /\*\*Theory:\*\*/);
  assert.match(mentor.text, /\*\*In production:\*\*/);
});

test('unmatched questions get a helpful fallback with suggestions', () => {
  const reply = answerQuestion('nigel', 'qwerty zzz');
  assert.deepEqual(reply.topicIds, []);
  assert.match(reply.text, /Try asking about/);
});

test('answers are deterministic', () => {
  assert.equal(answerQuestion('mentor', 'race condition').text, answerQuestion('mentor', 'race condition').text);
});
