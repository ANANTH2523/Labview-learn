import test from 'node:test';
import assert from 'node:assert/strict';
import { buildNigelBlueprint } from './nigel-blueprint.ts';
import { evaluateNigelPrompt } from './nigel-evaluator.ts';

const base = { hardware: 'NI-VISA / SCPI', architecture: 'Queued Message Handler (QMH)' };

test('score matches the live evaluator for the same prompt', () => {
  const prompt = 'Use a state machine with a typedef enum, VISA, error out and a timeout. Use a shift register.';
  assert.equal(buildNigelBlueprint({ ...base, prompt }).score, evaluateNigelPrompt(prompt).score);
});

test('empty prompt still yields a complete, usable blueprint', () => {
  const r = buildNigelBlueprint({ ...base, prompt: '' });
  assert.equal(r.score, 0);
  assert.ok(r.optimizedPrompt.includes('Automated multi-channel measurement'));
  assert.ok(r.blockDiagramBlueprint.states.length > 0);
});

test('architecture and hardware drive states and key nodes', () => {
  const qmh = buildNigelBlueprint({ ...base, prompt: 'x' });
  const pc = buildNigelBlueprint({ hardware: 'NI-DAQmx USB-6361', architecture: 'Producer-Consumer', prompt: 'x' });
  assert.ok(qmh.blockDiagramBlueprint.states.includes('Wait For Message'));
  assert.ok(pc.blockDiagramBlueprint.states.includes('Drain & Cleanup'));
  assert.ok(qmh.blockDiagramBlueprint.keyNodes.includes('VISA Open'));
  assert.ok(pc.blockDiagramBlueprint.keyNodes.includes('DAQmx Read'));
  assert.ok(!pc.blockDiagramBlueprint.keyNodes.includes('VISA Open'));
});

test('is deterministic and labelled as local', () => {
  const a = buildNigelBlueprint({ ...base, prompt: 'abc' });
  assert.deepEqual(a, buildNigelBlueprint({ ...base, prompt: 'abc' }));
  assert.equal(a.modelUsed, 'local-expert-engine');
});
