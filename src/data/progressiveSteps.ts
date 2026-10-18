export interface ProgressiveMilestone {
  id: string;
  stepNumber: number;
  tier: 'Novice (Zero Knowledge)' | 'Apprentice' | 'CLAD Associate' | 'CLD Developer' | 'CLA Architect' | 'Nigel AI Master';
  title: string;
  objective: string;
  theorySummary: string;
  handsOnTask: string;
  verificationRule: string;
  unlockBadge: string;
  labTargetId?: string;
}

export const PROGRESSIVE_MILESTONES: ProgressiveMilestone[] = [
  {
    id: 'm-1',
    stepNumber: 1,
    tier: 'Novice (Zero Knowledge)',
    title: 'Your First VI: Controls, Indicators & Dataflow Law',
    objective: 'Understand why LabVIEW has two windows (Front Panel & Block Diagram) and why a node only executes when all its inputs have arrived.',
    theorySummary: 'Front Panel is where operators interact (Controls = Inputs, Indicators = Outputs). Block Diagram is where graphical G-wires connect functional nodes. G has no program counter: nodes run when data arrives!',
    handsOnTask: 'Open Lab 1 in the Workbench. Switch to Front Panel, turn the Temperature Setpoint knob to 75°C, and click "Run Continuously" to see the PID controller respond.',
    verificationRule: 'Front Panel Setpoint modified and continuous execution started.',
    unlockBadge: 'First VI Architect',
    labTargetId: 'lab-1',
  },
  {
    id: 'm-2',
    stepNumber: 2,
    tier: 'Novice (Zero Knowledge)',
    title: 'Wire Color Codes, Coercion Dots & Broken Wires',
    objective: 'Learn the strict visual language of G-wires: Orange (DBL), Blue (I32), Green (Boolean), Pink (String), and Striped (Error).',
    theorySummary: 'Mismatched types either produce a red Coercion Dot (automatic conversion) or a Broken Wire (red dashed line with an X). In high-speed loops, excess coercion dots cause memory reallocation bottlenecks.',
    handsOnTask: 'Inspect the Block Diagram of Lab 1. Hover over the orange wires connecting DAQmx Read to Moving Avg Filter.vi. Click on the wire to attach a Probe and inspect the live numeric value.',
    verificationRule: 'Attached at least 1 live probe on a Block Diagram wire.',
    unlockBadge: 'Wire Inspector',
    labTargetId: 'lab-1',
  },
  {
    id: 'm-3',
    stepNumber: 3,
    tier: 'Apprentice',
    title: 'While Loops, Shift Registers & Timing Engines',
    objective: 'Master state persistence across loop iterations without global variables using Shift Registers.',
    theorySummary: 'Shift Registers are paired terminals on loop borders. Right terminal writes data at the end of an iteration; left terminal reads it at the start of the next. Always initialize to prevent stale data!',
    handsOnTask: 'Toggle the Lightbulb icon (Execution Highlighting) in Lab 1. Watch how data tokens bubble smoothly along the shift register feedback loop between iterations.',
    verificationRule: 'Execution Highlighting toggled on and traced through at least 1 loop iteration.',
    unlockBadge: 'Loop Master',
    labTargetId: 'lab-1',
  },
  {
    id: 'm-4',
    stepNumber: 4,
    tier: 'CLAD Associate',
    title: 'Standard SubVIs, 4x2x2x4 Panes & Error Clusters',
    objective: 'Learn the industry-standard modular function layout: Reference top-left, Error In bottom-left, Output top-right, Error Out bottom-right.',
    theorySummary: 'Wiring the Error Cluster (status, code, source) through all SubVIs serializes execution order naturally without clunky sequence structures, and bypasses processing immediately upon error.',
    handsOnTask: 'Examine Lab 3 (Automated SCPI Voltage Sweep). Trace the yellow/black striped Error wire running from VISA Open → VISA Write → VISA Read → In Range and Coerce.',
    verificationRule: 'Inspected Error Cluster propagation in Lab 3.',
    unlockBadge: 'CLAD Certified Associate',
    labTargetId: 'lab-3',
  },
  {
    id: 'm-5',
    stepNumber: 5,
    tier: 'CLD Developer',
    title: 'State Machines & Producer-Consumer Queues',
    objective: 'Decouple high-speed hardware acquisition from UI drawing and disk streaming using NI FIFO Queues.',
    theorySummary: 'The Producer-Consumer pattern prevents dropped samples by placing the acquisition in a fast loop and logging/display in a slower loop, connected by a thread-safe Queue buffer.',
    handsOnTask: 'Switch to Lab 2 (Producer-Consumer Bench). Observe how the Queue Buffer Elements gauge buffers samples without dropping frames while the waveform chart renders.',
    verificationRule: 'Observed lossless queue buffering in Lab 2.',
    unlockBadge: 'CLD Architect Developer',
    labTargetId: 'lab-2',
  },
  {
    id: 'm-6',
    stepNumber: 6,
    tier: 'CLA Architect',
    title: 'Production TestStand, SCPI & Hardware Automation',
    objective: 'Automate physical instruments (DMMs, Power Supplies, Oscilloscopes) over VISA/SCPI and NI-DAQmx with limit testing.',
    theorySummary: 'Open session once at Init, query and step inside the loop, and close cleanly in Teardown. Trap instrument timeouts and log parametric data to NI TDMS files.',
    handsOnTask: 'In Lab 3, adjust the Max Current Limit to 100mA and watch the PASS/FAIL Status LED trip to red when the measured current exceeds tolerance.',
    verificationRule: 'Triggered limit comparison change in Lab 3.',
    unlockBadge: 'Automated Test Specialist',
    labTargetId: 'lab-3',
  },
  {
    id: 'm-7',
    stepNumber: 7,
    tier: 'Nigel AI Master',
    title: 'Nigel AI Prompting & G-Code Audit Engineering',
    objective: 'Formulate 5-point invariant specifications to direct Nigel AI and audit generated VIs for unwired tunnels and race conditions.',
    theorySummary: 'Nigel AI requires: 1. Connector Pane layout, 2. Hardware protocol, 3. Architecture pattern, 4. Error handling & timeouts, 5. Zero local variables & pre-allocated buffers.',
    handsOnTask: 'Open Nigel AI Studio, load an industrial template, achieve a Prompt Quality Score of 85+ (Master CLA grade), and generate a complete G-Code Blueprint.',
    verificationRule: 'Generated a Nigel AI Blueprint with score >= 85.',
    unlockBadge: 'Nigel AI Pioneer',
  },
];
