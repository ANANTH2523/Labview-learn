import type { NigelBlueprintResult } from '../src/types/index.ts';
import type { NigelAssistInput } from './validation.ts';

/** Deterministic blueprint served when no GEMINI_API_KEY is configured. */
export function buildOfflineBlueprint(input: NigelAssistInput): NigelBlueprintResult {
  const requirement = input.testRequirement || 'Automated Voltage Sweep and Limit Verification';
  const hardware = input.targetHardware || 'NI PXIe-4139 SMU + NI-VISA DMM';
  const pattern = input.architecturePattern || 'Standard State Machine with Typedef Enum';

  return {
    score: 88,
    critique:
      'Solid prompt structure. Hardware specification is clear, but error timeout handling and connector pane layout should be explicitly mentioned to ensure Nigel AI outputs production-ready G-code.',
    optimizedPrompt: `Design a National Instruments LabVIEW SubVI for ${requirement}.
Target Hardware: ${hardware}
Design Pattern: ${pattern}

Connector Pane Layout (4x2x2x4 standard):
- Top-Left: VISA Resource Name / Hardware Session
- Mid-Left: Test Configuration Cluster (Voltage Min, Max, Step Size, Settle Time ms)
- Bottom-Left: Error In (Standard Error Cluster)
- Top-Right: Measured Data Array (Cluster of Timestamp, Voltage, Current, Pass/Fail Boolean)
- Bottom-Right: Error Out

Execution & Dataflow Rules:
1. Must use Typedef Enum with states: [Initialize, ConfigureLimits, ArmTrigger, ExecuteSweep, AnalyzePassFail, LogTDMS, CleanUp].
2. Enforce zero local variables; propagate states via Shift Registers.
3. Trap VISA Timeout Error -1073807339 (Hex 0xBFFF0015) gracefully and record in test telemetry.
4. Pre-allocate measurement arrays using Initialize Array before the sweep loop.`,
    blockDiagramBlueprint: {
      pattern: input.architecturePattern || 'State Machine',
      states: ['Initialize', 'Configure Limits', 'Sweep Loop', 'Evaluate Limits', 'Log to TDMS', 'Teardown'],
      keyNodes: [
        'DAQmx Create Virtual Channel',
        'DAQmx Timing (Sample Clock)',
        'While Loop with Shift Register',
        'Case Structure',
        'Unbundle by Name',
        'Format Into String',
        'DAQmx Clear Task',
      ],
      pitfallAlert:
        'Watch for unwired tunnels in the False case of limit evaluation; ensure default value is not used implicitly without explicit logic.',
    },
    modelUsed: 'offline-labview-architect',
  };
}

/** Narrow untrusted model JSON to the blueprint shape, or null if unusable. */
export function parseModelBlueprint(text: string | undefined, model: string): NigelBlueprintResult | null {
  if (!text) return null;
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return null;
  }
  if (typeof raw !== 'object' || raw === null) return null;
  const r = raw as Record<string, unknown>;
  const bp = r.blockDiagramBlueprint as Record<string, unknown> | undefined;
  const strings = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []);

  if (typeof r.score !== 'number' || typeof r.critique !== 'string' || typeof r.optimizedPrompt !== 'string') {
    return null;
  }
  return {
    score: Math.max(0, Math.min(100, Math.round(r.score))),
    critique: r.critique,
    optimizedPrompt: r.optimizedPrompt,
    blockDiagramBlueprint: {
      pattern: typeof bp?.pattern === 'string' ? bp.pattern : '',
      states: strings(bp?.states),
      keyNodes: strings(bp?.keyNodes),
      pitfallAlert: typeof bp?.pitfallAlert === 'string' ? bp.pitfallAlert : '',
    },
    trainingLesson: typeof r.trainingLesson === 'string' ? r.trainingLesson : undefined,
    modelUsed: model,
  };
}
