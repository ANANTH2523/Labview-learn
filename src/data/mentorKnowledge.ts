import type { MentorPersonaId } from '../types';

export interface KnowledgeTopic {
  id: string;
  title: string;
  /** Lowercase words or phrases; multi-word phrases score higher than single words. */
  keywords: string[];
  /** Core, persona-neutral explanation (Markdown). */
  answer: string;
  /** How each mentor frames the topic from their own specialty. */
  angle: Record<MentorPersonaId, string>;
}

export const KNOWLEDGE_TOPICS: KnowledgeTopic[] = [
  {
    id: 'dataflow',
    title: 'G Dataflow',
    keywords: ['dataflow', 'data flow', 'execution order', 'parallel', 'sequence', 'how does labview execute', 'node executes', 'token'],
    answer: `In LabVIEW a node executes **if and only if all of its inputs have data**, and its outputs are produced only when it finishes. There is no program counter: every node that is ready runs, potentially in parallel.

- Wires carry data; **data dependency is the only guaranteed ordering**.
- To force an order between independent nodes, route the **error cluster** (or another data wire) through them in sequence.
- Avoid Flat Sequence Structures for ordering. They hide dependencies and block parallelism.`,
    angle: {
      professor: 'Think of each wire as a token queue of depth one: a node "fires" when every input token is present, which is why dataflow is deterministic only where you wire the dependency.',
      mentor: 'On a test rack this matters in practice: if two instrument writes are not chained by the error wire, they can run in either order and give you an intermittent failure you will chase for days.',
      nigel: 'When you prompt Nigel AI, state the ordering you need ("chain error out of Configure into Read") rather than assuming left-to-right execution; generated code often has independent nodes whose order is accidental.',
    },
  },
  {
    id: 'race-conditions',
    title: 'Race Conditions & Local Variables',
    keywords: ['race condition', 'race', 'local variable', 'local variables', 'global variable', 'global variables', 'locals', 'write then read', 'unpredictable'],
    answer: `Local and global variables break the dataflow model: a read and a write on different branches have **no enforced order**, so the result depends on scheduling.

Safer alternatives:
1. **Shift registers** for state that lives inside one loop.
2. **Wires** wherever the data can simply be routed.
3. **Queues / Notifiers / User Events** to communicate between parallel loops.
4. A **functional global variable (FGV)** or data value reference when you truly need shared state with atomic read-modify-write.

Locals also make copies of the data, which costs memory for large arrays.`,
    angle: {
      professor: 'A race exists whenever two writers, or a writer and a reader, touch the same storage without a data dependency between them. Make the dependency explicit or remove the sharing.',
      mentor: 'I have seen a "stop" flag implemented with a global leave one loop running after shutdown. A notifier or user event removes the whole class of problem.',
      nigel: 'Add "no local or global variables; use shift registers and queues" to your constraints. Generated G-code reaches for locals unless you forbid them.',
    },
  },
  {
    id: 'shift-registers',
    title: 'Shift Registers & Feedback Nodes',
    keywords: ['shift register', 'shift registers', 'feedback node', 'iteration', 'previous iteration', 'initialize shift', 'uninitialized'],
    answer: `A **shift register** carries a value from one loop iteration to the next. Wire an initial value into the left terminal; the right terminal's value becomes the next iteration's left value.

- **Always initialize** shift registers. An uninitialized one keeps its last value *between calls of the VI*, a classic source of "works the first time only" bugs (occasionally useful on purpose, but then document it).
- A **Feedback Node** is equivalent for a single value and saves wiring.
- Stack extra terminals to read values from several iterations back (for example, for a moving average).`,
    angle: {
      professor: 'The shift register is how a stateless dataflow diagram acquires memory: it is the only sanctioned way to give a loop a past.',
      mentor: 'In production code, I initialize every register from a config cluster so a re-run of the test always starts from a known state.',
      nigel: 'Ask Nigel AI to "initialize all shift registers explicitly"; unwired left terminals are a common defect in generated loops.',
    },
  },
  {
    id: 'state-machine',
    title: 'State Machines & Queued Message Handler',
    keywords: ['state machine', 'qmh', 'queued message handler', 'state', 'enum', 'typedef enum', 'case structure', 'next state', 'actor framework', 'design pattern'],
    answer: `A **state machine** is a While Loop containing a Case Structure whose selector is a **typedef Enum**; a shift register carries the next state.

Checklist for a robust one:
1. Use a **typedef** Enum so edits propagate everywhere.
2. Start at \`Initialize\`; always end at \`Cleanup\` (even on error).
3. Wire the error cluster through; on error, jump to \`Cleanup\` instead of continuing.
4. Give every case a defined next state, and set the loop's stop condition only in \`Exit\`.

A **Queued Message Handler (QMH)** replaces the next-state register with a queue of messages, so the UI or other loops can post events while the handler runs. Use it when states are driven by external events rather than a fixed sequence.`,
    angle: {
      professor: 'The standard state machine is a deterministic automaton; the QMH is the same automaton driven by an input alphabet delivered through a queue. Choose by whether the transitions are internal or external.',
      mentor: 'For a test sequence, I use a state machine per instrument and a QMH at the top to accept Start, Abort and Skip from the operator without blocking measurements.',
      nigel: 'Give Nigel AI the exact enum, e.g. [Initialize, Configure, Acquire, Evaluate, Cleanup], and demand a Cleanup route on error. It will otherwise invent states.',
    },
  },
  {
    id: 'producer-consumer',
    title: 'Producer-Consumer & Queues',
    keywords: ['producer consumer', 'producer-consumer', 'queue', 'queues', 'dequeue', 'enqueue', 'notifier', 'decouple', 'parallel loops', 'user event'],
    answer: `**Producer-Consumer** decouples a fast loop (acquisition) from a slow one (logging, display) with a queue.

- Producer: acquires data on a fixed timing and **enqueues** it.
- Consumer: **dequeues** (with a timeout) and processes at its own pace.
- Start-up: create the queue before both loops; shutdown: the producer sends a stop message (or the queue is destroyed) and the consumer drains it; then **Release Queue**.
- Bound the queue size if the consumer can fall behind, and monitor its element count.

Use a **Notifier** when only the latest value matters, and a **User Event** when an Event structure should react.`,
    angle: {
      professor: 'The queue is a buffer that turns two rate-mismatched processes into independent ones. The cost is memory, so reason about maximum depth.',
      mentor: 'Never write to disk or draw a graph in the acquisition loop. One slow TDMS flush will overrun the DAQ buffer and cost you data.',
      nigel: 'Tell Nigel AI the message type (a typedef cluster), who creates the queue, and the shutdown protocol. Those three details prevent the usual deadlocks.',
    },
  },
  {
    id: 'error-handling',
    title: 'Error Handling & the Error Cluster',
    keywords: ['error', 'errors', 'error cluster', 'error in', 'error out', 'error handling', 'status', 'simple error handler', 'clear errors', 'cleanup', 'trap'],
    answer: `The **error cluster** (\`status\`, \`code\`, \`source\`) is LabVIEW's standard error wire.

- Wire **Error In → Error Out** through every subVI. This both propagates errors and sequences execution.
- Nodes that receive an error generally **skip their work** and pass it along, so one fault does not cascade into many.
- **Always run cleanup** (close sessions, clear tasks) after the error, and report once at the end with **Simple Error Handler**.
- Use **Clear Errors** only for expected, specific codes, never as a blanket fix.
- Trap anticipated codes (for example a VISA timeout) and decide: retry, skip, or abort.`,
    angle: {
      professor: 'Treat the error cluster as part of the type signature of every function. A subVI without error terminals cannot be composed safely.',
      mentor: 'Log the error source string. When a station fails at 3 a.m. it is the only clue you will have.',
      nigel: 'Require "Error In and Error Out on every subVI, cleanup on error" in the prompt, and check the result for subVIs whose error output is left unwired.',
    },
  },
  {
    id: 'subvi-connector-pane',
    title: 'SubVIs & Connector Panes',
    keywords: ['subvi', 'sub vi', 'connector pane', 'connector', 'terminal', 'icon', 'required', 'recommended', 'modular', 'reuse', '4x2x2x4'],
    answer: `A **subVI** is a VI used as a function. Its **connector pane** defines its terminals.

Conventions (the standard 4×2×2×4 pattern):
- **Inputs on the left, outputs on the right.**
- **Error In bottom-left, Error Out bottom-right.**
- Reference/session inputs top-left, with the matching output top-right.
- Mark essential inputs **Required**; set sensible defaults for the rest.
- Give each subVI a clear icon, a description, and a typedef for cluster inputs.

Small, single-purpose subVIs keep diagrams readable and are easy to test in isolation.`,
    angle: {
      professor: 'The connector pane is the interface contract. Keep it stable and consistent across a library, and your callers never need to open the diagram.',
      mentor: 'Standard pane patterns let anyone on the team wire a new driver in minutes, which matters when rotating technicians across stations.',
      nigel: 'Spell out each terminal position in the prompt ("Error In bottom-left"). Nigel AI follows explicit layouts but guesses otherwise.',
    },
  },
  {
    id: 'visa-scpi',
    title: 'VISA & SCPI Instrument Control',
    keywords: ['visa', 'scpi', 'instrument', 'gpib', 'serial', 'idn', 'resource name', 'timeout', 'termination', 'keysight', 'keithley', 'dmm', 'oscilloscope', 'test bench', '1073807339', 'tcp'],
    answer: `Reliable VISA sessions follow **open once → configure → loop → close**.

1. **VISA Open** once at start-up; never open and close inside a fast loop.
2. Set timeout and termination character; verify the device with \`*IDN?\`; use \`*RST\` and \`*CLS\` to start clean.
3. Use \`*OPC?\` (or status polling) to wait for slow operations instead of fixed delays.
4. **VISA Close** in the cleanup state, even after an error.

A **timeout** is error \`-1073807339\` (\`0xBFFF0015\`). Common causes: wrong resource name, missing termination character, a command that returns nothing but is followed by a Read, or a timeout shorter than the instrument's operation.`,
    angle: {
      professor: 'VISA is an abstraction layer: the same Read/Write VIs work across GPIB, serial, USB and Ethernet. Keep transport details in one configuration subVI.',
      mentor: 'Build a driver subVI per instrument, with a simulated back end, so the sequence can be developed and tested without hardware on the bench.',
      nigel: 'Name the instrument model and the exact SCPI commands in the prompt. Generated drivers are only as correct as the commands you provide.',
    },
  },
  {
    id: 'daqmx',
    title: 'NI-DAQmx Acquisition',
    keywords: ['daqmx', 'daq', 'sample clock', 'continuous', 'buffer overwrite', '200279', '200284', 'sampling', 'task', 'channel', 'sample rate', 'hardware timed', 'buffer'],
    answer: `The DAQmx task flow is: **Create Virtual Channel → Timing → (Trigger) → Start → Read (loop) → Stop → Clear Task**.

- For continuous acquisition, configure **Sample Clock** timing with *Continuous Samples*, and read a fixed number of samples per iteration (for example 1/10 of the rate).
- Always **Clear Task** in cleanup.

**Error -200279** (buffer overwrite / data not read fast enough) means the hardware acquired data faster than your loop read it. Fixes: read more often or in larger chunks, move processing and logging out of the read loop (Producer-Consumer), enlarge the buffer, or lower the rate.
**Error -200284** means the read timed out waiting for samples.`,
    angle: {
      professor: 'Hardware timing makes the sample clock, not your loop, the authority on time. The loop merely drains a buffer.',
      mentor: 'Size the buffer for your worst-case disk stall, not your average one, and log buffer backlog so you see problems before data is lost.',
      nigel: 'State the sample rate, samples per read, and "hardware-timed, continuous" explicitly; otherwise generated code often falls back to software timing.',
    },
  },
  {
    id: 'memory-arrays',
    title: 'Arrays & Memory Management',
    keywords: ['array', 'arrays', 'build array', 'initialize array', 'preallocate', 'pre-allocate', 'memory', 'buffer allocation', 'in place', 'replace array subset', 'auto-indexing', 'copy', 'performance'],
    answer: `Memory habits that matter in LabVIEW:

- **Do not grow arrays in a loop** with Build Array. Each append can reallocate. Pre-allocate with **Initialize Array** and use **Replace Array Subset**, or let an **auto-indexing output tunnel** build the array.
- Use the **In Place Element Structure** for read-modify-write on elements.
- Avoid unnecessary branches and local variables of large data; each can force a copy.
- Use **Tools → Profile → Show Buffer Allocations** to find where copies happen.`,
    angle: {
      professor: 'LabVIEW\'s compiler tries to operate in place, but wire branching and certain nodes defeat it. Learn where copies are forced, then design around them.',
      mentor: 'A 100 kS/s loop that appends to an array will run fine for a minute and then stall as the heap fragments. Pre-allocate before the loop.',
      nigel: 'Include "pre-allocate arrays with Initialize Array before loops" as a standing constraint in your Nigel AI prompts.',
    },
  },
  {
    id: 'boolean-mechanical-action',
    title: 'Boolean Mechanical Action',
    keywords: ['mechanical action', 'switch when pressed', 'switch when released', 'latch when pressed', 'latch when released', 'latch until released', 'boolean', 'button', 'switch'],
    answer: `Mechanical action controls when a Boolean changes and whether it resets:

| Action | Changes | Resets |
| --- | --- | --- |
| **Switch When Pressed** | on press | never (stays until clicked again) |
| **Switch When Released** | on release | never |
| **Switch Until Released** | on press | on release |
| **Latch When Pressed** | on press | after the VI reads it once |
| **Latch When Released** | on release | after the VI reads it once |
| **Latch Until Released** | on press | on release **or** after being read |

Use **Latch** actions for one-shot commands (Start, Stop pressed) so the VI never sees the same click twice. Use **Switch** actions for persistent settings.`,
    angle: {
      professor: 'Latching exists to solve a handshake problem between a human who clicks asynchronously and a loop that polls at its own rate.',
      mentor: 'Stop buttons should be latched, and read inside the loop, or the loop can miss a click.',
      nigel: 'If you need a button\'s behavior to be one-shot, say "Latch When Released" in the prompt; the default is Switch When Pressed.',
    },
  },
  {
    id: 'event-structure',
    title: 'Event Structure & User Interfaces',
    keywords: ['event structure', 'event', 'events', 'value change', 'ui', 'user interface', 'front panel', 'polling', 'dynamic events', 'timeout event'],
    answer: `The **Event Structure** sleeps until something happens, so it uses no CPU while idle, unlike polling controls in a tight loop.

- Handle **Value Change** events for controls instead of polling their terminals.
- Use the **Timeout** case for periodic work, and keep long operations out of event cases. Hand them to another loop through a queue so the UI stays responsive.
- Remember that an Event Structure with no timeout and no event **blocks forever**. Provide a way to wake it for shutdown (a User Event).`,
    angle: {
      professor: 'Events invert control: instead of the program asking whether something changed, the runtime tells the program. This is the natural UI model.',
      mentor: 'Operators should never be able to freeze the screen, so any long call belongs in a worker loop, with the UI loop only posting messages to it.',
      nigel: 'Ask for "one event loop for UI, one worker loop, communicating over a queue"; that structure keeps generated UIs responsive.',
    },
  },
  {
    id: 'typedefs-clusters',
    title: 'Clusters & Typedefs',
    keywords: ['cluster', 'clusters', 'typedef', 'type definition', 'bundle', 'unbundle', 'bundle by name', 'unbundle by name', 'strict', 'custom control'],
    answer: `A **cluster** groups related data of mixed types into one wire.

- Prefer **Bundle/Unbundle By Name**: it survives reordering and documents intent.
- Save every shared cluster or enum as a **Type Definition**. Changing the typedef updates every use. Use a **Strict Type Definition** if the appearance should propagate too.
- Keep clusters cohesive; a 40-element "everything" cluster hides coupling.`,
    angle: {
      professor: 'A typedef is a named type: the closest G gets to a data contract. Use it for any data crossing a subVI boundary.',
      mentor: 'Changing a configuration cluster without a typedef means hunting through every calling VI. Typedef it from day one.',
      nigel: 'Ask Nigel AI to define clusters and enums as typedefs and to use Bundle/Unbundle By Name; positional unbundling is brittle.',
    },
  },
  {
    id: 'wire-types',
    title: 'Wire Types & Coercion',
    keywords: ['wire', 'wires', 'wire color', 'coercion', 'coercion dot', 'broken wire', 'data type', 'orange', 'blue', 'pink', 'green', 'dbl', 'i32', 'type mismatch'],
    answer: `Wire color and thickness show the data type: **orange** = floating point (DBL), **blue** = integer, **green** = Boolean, **pink** = string; thicker wires are arrays or clusters (clusters are brown/pink-striped).

A **coercion dot** appears where LabVIEW silently converts a type, for example an integer into a DBL. It's usually harmless but can hide precision loss or an extra copy, so convert deliberately when it matters.

A **broken wire** (dashed red) means incompatible types or a missing source/sink; right-click it or use **Ctrl+B** to remove broken wires, then fix the cause.`,
    angle: {
      professor: 'Static typing is what lets LabVIEW check your diagram while you draw it. Learn the colors and you can read a diagram\'s data types at a glance.',
      mentor: 'A coercion dot on a high-rate path is worth a look: unexpected conversions are a cheap place to lose both time and precision.',
      nigel: 'When auditing generated VIs, scan for broken wires and unexplained coercion dots first. Both are quick tells of a hallucinated connection.',
    },
  },
  {
    id: 'nigel-prompting',
    title: 'Prompting Nigel AI',
    keywords: ['nigel', 'prompt', 'prompting', 'generate', 'ai', 'llm', 'hallucination', 'hallucinate', 'audit', 'review generated', 'specification', 'spec', 'unwired tunnel', 'unwired'],
    answer: `Treat a Nigel AI prompt like a **formal interface specification**. Include:

1. **Purpose and hardware**: what to measure or automate, and the driver layer (DAQmx / VISA + model).
2. **Architecture**: the pattern (state machine, QMH, Producer-Consumer) and the exact state enum.
3. **Connector pane**: terminals by position, with Error In / Error Out.
4. **Constraints**: no local variables, shift registers initialized, pre-allocated arrays, timeouts and the error codes to trap.
5. **Acceptance criteria**: what a correct result looks like.

**Audit generated code for**: unwired tunnels and default values used by accident, broken wires or coercion dots, local variables, error wires left unconnected, loops with no timing, and nodes or VIs that don't exist. Use the Prompt Studio tab for a scored, structured blueprint.`,
    angle: {
      professor: 'Specification quality bounds output quality. A model fills ambiguity with plausible-looking guesses, and in G, plausible-looking is not the same as correct.',
      mentor: 'Always run generated code against a simulated instrument before it touches a real fixture, and review every cleanup path by hand.',
      nigel: 'Use my 5-point protocol: purpose, architecture, connector pane, constraints, acceptance criteria. Then verify the diagram the way you would a junior engineer\'s.',
    },
  },
  {
    id: 'logging-tdms',
    title: 'Data Logging & TDMS',
    keywords: ['tdms', 'log', 'logging', 'datalog', 'file', 'write to file', 'csv', 'spreadsheet', 'stream to disk', 'save data', 'report'],
    answer: `**TDMS** is built for streaming measurement data: fast writes, hierarchical groups/channels, and properties for metadata.

- **Open once, write many, close at the end**. Reopening a file per sample is slow.
- Write from a **consumer loop**, not the acquisition loop.
- Store units, scaling, serial numbers, and limits as **properties**; your future self will thank you.
- Use CSV/text only for small, human-readable summaries.`,
    angle: {
      professor: 'A file is a side effect, and side effects belong in a dedicated process so the main dataflow stays pure and fast.',
      mentor: 'Log pass/fail limits and instrument serial numbers with the data. Traceability is the first thing an audit asks for.',
      nigel: 'Say "log to TDMS from the consumer loop, one group per channel set, with unit and limit properties" and Nigel AI will produce something usable.',
    },
  },
  {
    id: 'timing-control-pid',
    title: 'Loop Timing & PID Control',
    keywords: ['pid', 'control loop', 'timing', 'wait until next ms multiple', 'wait', 'loop rate', 'jitter', 'deterministic', 'setpoint', 'anti-windup', 'thermal', 'temperature', 'control'],
    answer: `Loop timing:
- Use **Wait Until Next ms Multiple** for a fixed period; plain **Wait (ms)** adds the loop's own execution time to the period.
- A loop with no wait will consume a full CPU core.

For **PID control**: sample at a fixed period, wire the real loop dt, **clamp the output** to actuator limits, and enable **anti-windup** (the PID VI does this when you give it output limits) so the integral term doesn't grow while saturated. Tune P first, then I, then D if needed. Real-time determinism needs LabVIEW Real-Time hardware; on a desktop OS, timing is best-effort.`,
    angle: {
      professor: 'A discrete controller is only as stable as its sample timing; jitter in dt becomes noise in the derivative term.',
      mentor: 'Limit the output slew and add an over-temperature interlock outside the PID loop. The controller should never be your only safety.',
      nigel: 'Give Nigel AI the sample period, output limits and a safe state on error. Unspecified control loops tend to ship without anti-windup.',
    },
  },
  {
    id: 'certifications',
    title: 'CLAD, CLD & CLA Certification',
    keywords: ['clad', 'cld', 'cla', 'certification', 'certified', 'exam', 'certificate', 'architect', 'developer', 'study', 'prepare', 'passing'],
    answer: `NI's LabVIEW certification path has three levels:

- **CLAD (Associate Developer)**: multiple-choice fundamentals: dataflow, data types, structures, debugging, basic patterns.
- **CLD (Developer)**: a hands-on exam where you build a working application from a specification, graded on functionality, style and documentation.
- **CLA (Architect)**: a design-level exam about architecture, project planning, scalability and team practice.

Study plan: master CLAD topics first (use Exam Prep), then build several full applications with a state machine/QMH and good documentation for CLD, and practice decomposing larger systems for CLA. The Certification Tracker tab maps labs and skills to each tier.`,
    angle: {
      professor: 'Each level tests a different skill: recognition (CLAD), construction (CLD), design (CLA). Prepare by doing the activity the exam measures.',
      mentor: 'Time yourself. Real exams reward a clean, documented, working solution over a clever incomplete one.',
      nigel: 'AI can help you practice, e.g. have it critique your design, but write and debug the exam-style solutions yourself; that is the skill being tested.',
    },
  },
];

/** Shown when no topic matches. Keeps the learner moving with concrete next questions. */
export const SUGGESTED_QUESTIONS: string[] = [
  'Why do local variables cause race conditions?',
  'How do I structure a state machine or QMH?',
  'What causes DAQmx error -200279 and how do I fix it?',
  'How do I make VISA/SCPI communication reliable?',
  'How should I write a prompt for Nigel AI?',
  'What is the difference between Latch When Released and Switch When Pressed?',
];
