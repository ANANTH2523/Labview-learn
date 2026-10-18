import type { NigelBlueprintResult } from '../types';
import { evaluateNigelPrompt } from './nigel-evaluator.ts';

export interface BlueprintInput {
  /** The student's prompt draft / test requirement. */
  prompt: string;
  hardware: string;
  architecture: string;
}

interface PatternProfile {
  states: string[];
  rules: string[];
  pitfall: string;
}

function profileFor(architecture: string): PatternProfile {
  const a = architecture.toLowerCase();
  if (a.includes('qmh') || a.includes('queued message')) {
    return {
      states: ['Initialize', 'Wait For Message', 'Configure', 'Acquire', 'Evaluate Limits', 'Log', 'Cleanup'],
      rules: [
        'Implement a Queued Message Handler: a message typedef (cluster of Enum + Variant data) in a queue, dequeued with a timeout.',
        'Create the queue before the loops start; Release Queue in Cleanup, including on error.',
        'The Cleanup message must be enqueued automatically when an error occurs.',
      ],
      pitfall: 'Check that every message case enqueues or defines its follow-up, and that the stop message cannot be lost when the queue is flushed.',
    };
  }
  if (a.includes('producer')) {
    return {
      states: ['Initialize', 'Start Producer', 'Acquire & Enqueue', 'Dequeue & Process', 'Log', 'Drain & Cleanup'],
      rules: [
        'Implement Producer-Consumer with two parallel loops joined by a queue of a typedef cluster element.',
        'The acquisition loop must never write to disk or update graphs; the consumer does that.',
        'Shutdown protocol: producer enqueues a stop element, the consumer drains, then Release Queue.',
      ],
      pitfall: 'Look for an unbounded queue with a slow consumer, and a consumer loop that blocks forever on a Dequeue with no timeout.',
    };
  }
  if (a.includes('actor')) {
    return {
      states: ['Launch Actor', 'Pre Launch Init', 'Actor Core', 'Handle Messages', 'Stop Core', 'Post Stop'],
      rules: [
        'Use the Actor Framework: one Actor class per responsibility, with messages as classes overriding Do.',
        'Actors communicate only through messages; no shared globals.',
      ],
      pitfall: 'Verify each actor has a defined stop path and that nested actors are stopped before their caller.',
    };
  }
  return {
    states: ['Initialize', 'Configure', 'Acquire', 'Evaluate Limits', 'Log', 'Cleanup'],
    rules: [
      'Implement a standard state machine: While Loop, Case Structure on a typedef Enum, next state in a shift register.',
      'On error, route to Cleanup; Cleanup is the only state that sets the loop stop condition.',
    ],
    pitfall: 'Watch for unwired tunnels on the False case of limit checks and for states with no defined next state.',
  };
}

function nodesFor(hardware: string): string[] {
  const h = hardware.toLowerCase();
  const visa = ['VISA Open', 'VISA Write', 'VISA Read', 'VISA Close'];
  const daq = ['DAQmx Create Virtual Channel', 'DAQmx Timing (Sample Clock)', 'DAQmx Start Task', 'DAQmx Read', 'DAQmx Clear Task'];
  const common = ['While Loop with Shift Register', 'Case Structure', 'Unbundle By Name', 'Simple Error Handler'];
  const nodes: string[] = [];
  if (h.includes('visa') || h.includes('scpi') || h.includes('gpib') || h.includes('serial')) nodes.push(...visa);
  if (h.includes('daq') || h.includes('pxi') || h.includes('crio')) nodes.push(...daq);
  if (nodes.length === 0) nodes.push(...visa);
  return [...nodes, ...common];
}

/**
 * Builds a scored Nigel AI blueprint entirely on-device.
 * Scoring reuses the live prompt evaluator, so the result agrees with the on-screen grade.
 */
export function buildNigelBlueprint({ prompt, hardware, architecture }: BlueprintInput): NigelBlueprintResult {
  const evaluation = evaluateNigelPrompt(prompt);
  const profile = profileFor(architecture);
  const requirement = prompt.trim() || 'Automated multi-channel measurement with limit verification';

  const critique = [
    evaluation.strengths.length ? `Strengths: ${evaluation.strengths.join('; ')}.` : 'No strengths detected yet: the draft needs more specifics.',
    evaluation.missingElements.length ? `Missing: ${evaluation.missingElements.join('; ')}.` : 'All five specification areas are covered.',
    evaluation.suggestions.length ? `Next steps: ${evaluation.suggestions.join(' ')}` : '',
  ]
    .filter(Boolean)
    .join(' ');

  const optimizedPrompt = `Design a National Instruments LabVIEW VI for the following requirement:
${requirement}

Target Hardware / Driver Layer: ${hardware}
Architecture: ${architecture}
States: [${profile.states.join(', ')}]

Connector Pane (4x2x2x4 standard):
- Top-Left: Hardware session / VISA resource name
- Left: Test configuration cluster (typedef)
- Bottom-Left: Error In
- Top-Right: Measurement results (typedef cluster or array)
- Bottom-Right: Error Out

Execution & Dataflow Rules:
${[...profile.rules, 'Use no local or global variables; carry state in shift registers or queues.', 'Initialize every shift register explicitly.', 'Pre-allocate measurement arrays with Initialize Array before loops.', 'Wire Error In to Error Out through every subVI and trap timeout errors (for VISA: -1073807339).', 'Close all sessions and clear all tasks in Cleanup, even after an error.']
  .map((r, i) => `${i + 1}. ${r}`)
  .join('\n')}

Acceptance criteria: compiles with no broken wires, no unwired tunnels, and passes a dry run against simulated hardware.`;

  return {
    score: evaluation.score,
    critique,
    optimizedPrompt,
    blockDiagramBlueprint: {
      pattern: architecture,
      states: profile.states,
      keyNodes: nodesFor(hardware),
      pitfallAlert: profile.pitfall,
    },
    trainingLesson:
      'Specific prompts remove the guesses a generator would otherwise make: the enum fixes the states, the connector pane fixes the interface, and the constraints rule out the classic defects (locals, unwired tunnels, unbounded growth).',
    modelUsed: 'local-expert-engine',
  };
}
