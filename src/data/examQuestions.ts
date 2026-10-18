import { ExamQuestion } from '../types';

export const EXAM_QUESTIONS: ExamQuestion[] = [
  {
    id: 'clad-1',
    level: 'CLAD',
    topic: 'Dataflow Execution Order',
    question: 'Two SubVIs, SubVI A and SubVI B, are placed on a block diagram without any wires connecting them. SubVI A is positioned physically to the left of SubVI B. Which statement correctly describes their execution order?',
    diagramAscii: `
      +------------+        +------------+
      |  SubVI A   |        |  SubVI B   |
      +------------+        +------------+
       (no wires between them)
    `,
    options: [
      { id: 'a', text: 'SubVI A will always execute first because it is to the left.' },
      { id: 'b', text: 'SubVI B will execute first because LabVIEW parses right-to-left.' },
      { id: 'c', text: 'The execution order is undefined and cannot be determined; they may execute in any order or simultaneously.' },
      { id: 'd', text: 'LabVIEW will generate a compile error (broken run arrow) due to missing wires.' },
    ],
    correctOptionId: 'c',
    explanation: 'The fundamental law of LabVIEW G-code is Dataflow: A node executes only when all its inputs are available. When two nodes have no data dependency (wires) between them, the LabVIEW execution system can run them in any order or concurrently on separate threads. Physical coordinate placement on the diagram has no bearing on execution sequence.',
    dataflowRule: 'Never rely on visual left-to-right placement for execution ordering; always use dataflow wires or error clusters.',
  },
  {
    id: 'clad-2',
    level: 'CLAD',
    topic: 'Mechanical Action of Booleans',
    question: 'A user creates a Stop button for a While Loop. Which mechanical action is the industry standard default for this button, and what happens when the While Loop block diagram reads its value?',
    options: [
      { id: 'a', text: 'Switch When Pressed: Stays True until the operator clicks it a second time.' },
      { id: 'b', text: 'Latch When Released: Transitions to True on mouse release, and automatically resets back to False after the block diagram reads it.' },
      { id: 'c', text: 'Switch Until Released: Remains True only while the mouse button is physically held down.' },
      { id: 'd', text: 'Latch Until Released: Cannot be used with a While Loop condition terminal.' },
    ],
    correctOptionId: 'b',
    explanation: 'Latch When Released is the default mechanical action for standard LabVIEW Stop buttons. When clicked, it activates upon mouse button release. As soon as the While Loop condition terminal reads the True token, LabVIEW immediately and automatically resets the button on the Front Panel back to False, ready for the next execution.',
    dataflowRule: 'Latching booleans cannot have Local Variables because resetting upon read creates an immediate race condition.',
  },
  {
    id: 'clad-3',
    level: 'CLAD',
    topic: 'Shift Register Initialization',
    question: 'A While Loop has a Shift Register that is NOT wired to any constant outside the left loop border (an uninitialized shift register). What happens when the VI is run for the second time in memory without unloading?',
    diagramAscii: `
       (no wire) -> [ ]==================[ ]
                    |  While Loop Body    |
                    |                     |
                    +=====================+
    `,
    options: [
      { id: 'a', text: 'The shift register automatically resets to the default value for its data type (e.g. 0 for numeric).' },
      { id: 'b', text: 'The VI fails to compile and displays a broken run arrow.' },
      { id: 'c', text: 'The shift register retains the final value from the previous execution of the VI.' },
      { id: 'd', text: 'LabVIEW throws a runtime null pointer exception.' },
    ],
    correctOptionId: 'c',
    explanation: 'An uninitialized shift register retains its state in memory between consecutive runs of the VI as long as the VI stays in RAM. This behaves like a static variable in C. While this can be used intentionally to create Functional Global Variables (FGVs), failing to initialize a shift register accidentally is a common source of bugs in automated test sequences!',
    dataflowRule: 'Always wire an initial constant to the left shift register terminal unless you are deliberately creating a Functional Global Variable.',
  },
  {
    id: 'cld-1',
    level: 'CLD',
    topic: 'Producer-Consumer Architecture',
    question: 'In a Producer-Consumer architecture using NI Queues, what occurs if the Consumer loop encounters a 500ms delay writing to disk while the Producer loop continues enqueuing data every 10ms?',
    options: [
      { id: 'a', text: 'The Producer loop halts immediately and throws Error -200279.' },
      { id: 'b', text: 'Incoming elements safely buffer in the queue RAM up to the configured queue depth or available computer memory.' },
      { id: 'c', text: 'The oldest elements in the queue are automatically overwritten without warning.' },
      { id: 'd', text: 'The LabVIEW front panel freezes permanently.' },
    ],
    correctOptionId: 'b',
    explanation: 'By default, NI Queues have an unlimited maximum depth (allocated dynamically in RAM). When the consumer loop is momentarily delayed by disk I/O, the Producer loop continues enqueuing elements smoothly without dropping samples. This lossless buffering is the primary reason the Producer-Consumer pattern is required for Certified LabVIEW Developers.',
    dataflowRule: 'Producer loops must never touch the UI or perform blocking disk operations to maintain high-throughput determinism.',
  },
  {
    id: 'cld-2',
    level: 'CLD',
    topic: 'Race Conditions & Local Variables',
    question: 'Two parallel While Loops on the same block diagram communicate by having Loop 1 write to a numeric Local Variable while Loop 2 reads from the same Local Variable. Why is this considered an anti-pattern in CLD grading?',
    options: [
      { id: 'a', text: 'Local Variables duplicate data in memory and introduce race conditions where Loop 2 may read stale data or miss values entirely.' },
      { id: 'b', text: 'Local Variables can only be read inside For Loops, not While Loops.' },
      { id: 'c', text: 'Local Variables disable CPU multithreading across the entire project.' },
      { id: 'd', text: 'Local Variables are only supported in LabVIEW Real-Time targets.' },
    ],
    correctOptionId: 'a',
    explanation: 'Local variables break dataflow. Because the two loops run asynchronously on separate CPU threads without synchronization, there is zero guarantee when Loop 1 writes and when Loop 2 reads. Loop 2 might read the same value five times or skip three values. In CLD exams, using local variables for cross-loop data transfer results in heavy point deductions.',
    dataflowRule: 'Use Queues, Notifiers, or Channels for thread-safe cross-loop communication instead of Local Variables.',
  },
  {
    id: 'cla-1',
    level: 'CLA',
    topic: 'NI-DAQmx Buffer Overwrite & Streaming',
    question: 'An engineer acquires analog voltage continuous samples using NI-DAQmx at 100,000 Hz. The VI throws Error -200279: "The application is not able to keep up with the hardware acquisition." What is the most effective architectural fix?',
    options: [
      { id: 'a', text: 'Increase the front panel refresh rate from 30Hz to 60Hz.' },
      { id: 'b', text: 'Read larger blocks of samples per iteration (e.g. 5,000 to 10,000 samples) and decouple processing via a Producer-Consumer queue.' },
      { id: 'c', text: 'Insert a 10ms Wait (ms) function directly after DAQmx Read in the loop.' },
      { id: 'd', text: 'Convert all Double (DBL) data wires to String wires.' },
    ],
    correctOptionId: 'b',
    explanation: 'Error -200279 occurs when the hardware onboard buffer fills up before the software reads the samples out. Reading 1 sample at 100kHz forces 100,000 OS context switches per second, which overwhelms the scheduler. Reading in chunks (e.g. 5,000 samples at a time) reduces loop iterations to 20 per second, slashing CPU overhead to negligible levels.',
    dataflowRule: 'In high-speed DAQmx, configure Sample Clock and read in multi-sample blocks matched to ~10-50 iterations per second.',
  },
];
