import React, { useState } from 'react';
import {
  Lightbulb,
  Cpu,
  Layers,
  ArrowRight,
  CheckCircle2,
  Play,
  Sparkles,
  Info,
  Zap,
  BookOpen,
  Award,
  ChevronRight,
  HelpCircle,
  Activity,
  X,
  Clock,
  Eye,
  Sliders,
  ShieldAlert,
} from 'lucide-react';

interface ZeroToProWalkthroughProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchLab: (labId: string) => void;
  onOpenLesson: (lessonId: string) => void;
  onOpenNigel: () => void;
  completedStepIds?: Set<string>;
  onToggleStepComplete?: (stepId: string) => void;
}

export const ZeroToProWalkthrough: React.FC<ZeroToProWalkthroughProps> = ({
  isOpen,
  onClose,
  onLaunchLab,
  onOpenLesson,
  onOpenNigel,
  completedStepIds = new Set(),
  onToggleStepComplete,
}) => {
  const [activeTab, setActiveTab] = useState<'what-is-labview' | 'dataflow-law' | 'wire-colors' | 'step-by-step-practicals'>('what-is-labview');
  const [selectedWire, setSelectedWire] = useState<string>('dbl');
  const [tokenAnimationActive, setTokenAnimationActive] = useState<boolean>(false);
  const [demoInputA, setDemoInputA] = useState<number>(25);
  const [demoInputB, setDemoInputB] = useState<number>(50);
  const [demoOutput, setDemoOutput] = useState<number>(75);
  const [selectedPracticalStep, setSelectedPracticalStep] = useState<number>(0);

  if (!isOpen) return null;

  const handleRunTokenDemo = () => {
    setTokenAnimationActive(true);
    setTimeout(() => {
      setDemoOutput(demoInputA + demoInputB);
      setTokenAnimationActive(false);
    }, 900);
  };

  const wireTypes = [
    {
      id: 'dbl',
      name: 'Double Precision (DBL)',
      color: 'bg-amber-500 text-amber-950',
      border: 'border-amber-500',
      lineClass: 'border-amber-500 bg-amber-500',
      hex: '#f59e0b',
      example: '72.45 °C or 5.012 V',
      desc: 'Floating point numbers with decimal places. Standard for analog sensor voltages, temperatures, pressure readings, and PID math.',
      proTip: 'Default numeric in LabVIEW. Matches analog DAQ reading precision without rounding errors.',
    },
    {
      id: 'i32',
      name: '32-Bit Integer (I32)',
      color: 'bg-sky-500 text-sky-950',
      border: 'border-sky-500',
      lineClass: 'border-sky-500 bg-sky-500',
      hex: '#0284c7',
      example: 'Loop count: 42 or Error code: -200279',
      desc: 'Whole counting numbers (positive and negative). Used for iteration counts, array indices, error codes, and strict typed enum state selectors.',
      proTip: 'Enums on State Machine case structures are backed by integers (usually U16 or I32).',
    },
    {
      id: 'bool',
      name: 'Boolean (TF)',
      color: 'bg-emerald-500 text-emerald-950',
      border: 'border-emerald-500',
      lineClass: 'border-emerald-500 bg-emerald-500',
      hex: '#10b981',
      example: 'TRUE (1) / FALSE (0)',
      desc: 'Digital binary states. Powers Front Panel toggle switches, LED indicators, Case Structure selector terminals, and While Loop Stop conditions.',
      proTip: 'Understand the 6 mechanical actions (Switch vs Latch). Stop buttons should always be "Latch When Released".',
    },
    {
      id: 'string',
      name: 'String (ASCII Text)',
      color: 'bg-pink-500 text-pink-950',
      border: 'border-pink-500',
      lineClass: 'border-pink-500 bg-pink-500',
      hex: '#ec4899',
      example: '"*IDN?\\n" or "VOLT:DC 5.0"',
      desc: 'Text data strings. Essential for SCPI instrument command strings over VISA/GPIB/USB, file paths, and operator status logs.',
      proTip: 'Always remember to append carriage return / line feed (\\n or \\r\\n) when commanding VISA instruments.',
    },
    {
      id: 'error',
      name: 'Error Cluster',
      color: 'bg-amber-400 text-slate-950',
      border: 'border-amber-400',
      lineClass: 'border-amber-400 bg-amber-400',
      hex: '#f59e0b',
      example: '{ status: True, code: 56, source: "VISA Read" }',
      desc: 'A compound data bundle containing status (Boolean), code (I32), and source (String). It enforces execution order and traps faults.',
      proTip: 'Yellow/black striped wire. When status is True, standard SubVIs bypass processing and cleanly propagate the error outward.',
    },
    {
      id: 'coercion',
      name: 'Coercion Dot (Novice Trap)',
      color: 'bg-red-500 text-white',
      border: 'border-red-500',
      lineClass: 'border-red-500 bg-red-500',
      hex: '#ef4444',
      example: 'Red dot on terminal pin',
      desc: 'A tiny red dot placed where wire types mismatch (e.g., wiring an I32 into a DBL node input). LabVIEW converts it on the fly.',
      proTip: 'In a 10 kHz DAQ loop, every coercion dot forces a memory buffer allocation and CPU copy! Eliminate them for CLD/CLA compliance.',
    },
  ];

  const practicalLadder = [
    {
      id: 'step-0',
      level: 'Stage 1: Zero Knowledge',
      title: 'What is a VI? The Two-Window Rule',
      badge: 'Day 1 Concept',
      time: '5 min',
      labId: 'lab-1',
      lessonId: 'lesson-1',
      concept: 'Every LabVIEW program is called a VI (Virtual Instrument). It consists of two linked windows:',
      points: [
        'Front Panel (User Interface): What the operator sees. Contains Controls (Inputs like knobs and switches) and Indicators (Outputs like graphs, meters, and LEDs).',
        'Block Diagram (Graphical Engine): Where you program. Instead of lines of text, you connect functional nodes with colored wires carrying data.',
        'The Run Arrow: Located on the toolbar. If solid white, code is error-free and ready. If broken (cracked with an X), click it to open the Error List.',
      ],
      practicalTask: 'Open Lab 1 (Thermal PID). Examine both the Front Panel and Block Diagram side-by-side. Turn the Temperature knob to 75°C and watch the PID output respond.',
      actionLabel: 'Launch Lab 1 in Workbench',
    },
    {
      id: 'step-1',
      level: 'Stage 2: Absolute Beginner',
      title: 'The Law of Dataflow: Why G has No Line Numbers',
      badge: 'Core Law',
      time: '8 min',
      labId: 'lab-1',
      lessonId: 'lesson-1',
      concept: 'In Python or C, the computer executes line 1, then line 2, top-to-bottom. LabVIEW G does NOT work this way.',
      points: [
        'A functional node executes if and only if ALL of its required input wires have arrived with valid data.',
        'Nodes execute independently: if two nodes have their inputs ready at the same time, they run in parallel on multi-core processors with ZERO thread coding required!',
        'Visual layout does NOT determine order: Placing a node to the left or right does not guarantee which one runs first. Wires determine the sequence.',
      ],
      practicalTask: 'In Lab 1, locate the "Moving Avg Filter.vi" node on the diagram. Notice that it cannot compute until the DAQ Read node delivers its temperature sample wire.',
      actionLabel: 'Inspect Dataflow in Lab 1',
    },
    {
      id: 'step-2',
      level: 'Stage 3: Apprentice',
      title: 'Execution Highlighting & Wire Probes',
      badge: 'Debugging Skill',
      time: '10 min',
      labId: 'lab-1',
      lessonId: 'lesson-2',
      concept: 'How do you see what is happening inside graphical wires? LabVIEW provides visual debugging tools built into the engine.',
      points: [
        'Execution Highlighting (The Lightbulb): Slows down execution so you can watch glowing data bubbles travel along wires into nodes.',
        'Probe Tool: Click on any wire while the program runs to pop open a floating window showing its real-time numeric value, string, or boolean state.',
        'Breakpoints: Place a pause dot on a wire or node to freeze execution and inspect system parameters before proceeding.',
      ],
      practicalTask: 'On the Lab 1 workbench, toggle the Lightbulb icon in the execution toolbar. Watch how data tokens bubble smoothly across the shift registers.',
      actionLabel: 'Practice Probing in Lab 1',
    },
    {
      id: 'step-3',
      level: 'Stage 4: Intermediate (CLAD)',
      title: 'Loops & Shift Registers: Memory Across Time',
      badge: 'CLAD Requirement',
      time: '15 min',
      labId: 'lab-1',
      lessonId: 'lesson-3',
      concept: 'In text languages, you use local variables to store values. In G, variables cause race conditions. Instead, we use Shift Registers.',
      points: [
        'Shift Registers: A pair of terminals on the border of a While Loop or For Loop. The right terminal stores the value at loop end; the left terminal provides it on the next loop tick.',
        'Initialized vs Uninitialized: Always wire an initial constant to the left terminal outside the loop; uninitialized registers retain stale memory across runs!',
        'Timing Engines: Use "Wait (ms)" or "Wait Until Next ms Multiple" inside While Loops to keep CPU usage from spiking to 100%.',
      ],
      practicalTask: 'Inspect the While Loop in Lab 1. Trace the orange Shift Register passing the integrated PID error from the right border back to the left border.',
      actionLabel: 'Inspect Shift Registers',
    },
    {
      id: 'step-4',
      level: 'Stage 5: Modular Engineer',
      title: 'SubVIs, 4x2x2x4 Connector Panes & Error Clusters',
      badge: 'CLAD & CLD Standard',
      time: '15 min',
      labId: 'lab-3',
      lessonId: 'lesson-4',
      concept: 'A SubVI is a modular reusable subroutine (like a function in Python). Professional LabVIEW requires strict interface standards.',
      points: [
        '4x2x2x4 Standard Connector Pane: Top-left for Hardware Resource/Handle; Bottom-left for Error In; Top-right for Output Data; Bottom-right for Error Out.',
        'Icon Design: Every SubVI must have a 32x32 pixel glyph with a descriptive banner (e.g. "VISA / SWEEP"). No default icons!',
        'Error Cluster Flow: Connect the yellow/black striped error wire through all SubVIs. If an error occurs upstream, subsequent SubVIs skip execution and pass the error out.',
      ],
      practicalTask: 'Examine Lab 3 (Automated SCPI Voltage Sweep). Note how the Error Cluster flows continuously through VISA Open -> VISA Write -> VISA Read.',
      actionLabel: 'Open SubVI Architecture (Lab 3)',
    },
    {
      id: 'step-5',
      level: 'Stage 6: Developer (CLD)',
      title: 'State Machines & Producer-Consumer Queues',
      badge: 'CLD Exam Benchmark',
      time: '20 min',
      labId: 'lab-2',
      lessonId: 'lesson-7',
      concept: 'To build industrial systems that never drop data or freeze the screen, you must separate acquisition from UI.',
      points: [
        'Standard State Machine (SSM): While Loop + Shift Register + Case Structure + Strict Typedef Enum. Controls system phases (Init -> Calibrate -> Acquire -> Log -> Stop).',
        'Producer-Consumer Architecture: A high-speed Producer loop acquires hardware data and pushes it into a FIFO Queue; a Consumer loop dequeues it for graph display and disk writing.',
        'Zero Dropped Samples: If Windows or UI drawing stutters, the Queue buffers samples safely without halting the acquisition hardware.',
      ],
      practicalTask: 'Switch to Lab 2 (Producer-Consumer Bench). Watch the Queue Buffer Elements gauge absorb bursts without losing data.',
      actionLabel: 'Launch Producer-Consumer (Lab 2)',
    },
    {
      id: 'step-6',
      level: 'Stage 7: Architect (CLA) & AI Pro',
      title: 'Hardware DAQmx, VISA SCPI & Nigel AI Mastery',
      badge: 'CLA Master Grade',
      time: '25 min',
      labId: 'lab-3',
      lessonId: 'lesson-14',
      concept: 'The pinnacle of LabVIEW engineering: automating physical test racks and using Nigel AI to audit G-code blueprints.',
      points: [
        'NI-DAQmx: Configure continuous hardware clocks, double-buffered circular memory, and prevent Error -200279 buffer overwrite.',
        'NI-VISA & SCPI: Communicate with DMMs, oscilloscopes, and power supplies via standardized ASCII strings (*IDN?, MEAS:VOLT:DC?).',
        'Nigel AI G-Code Prompting: Provide 5-point invariant specifications to AI engines and audit generated VIs for unwired tunnels and race conditions.',
      ],
      practicalTask: 'Formulate an industrial acquisition prompt in Nigel AI Studio, achieve a CLA-grade score of 85+, and audit the generated blueprint.',
      actionLabel: 'Launch Nigel AI Studio',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-amber-950/40 p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
                  Zero Knowledge to Pro Architect
                </span>
                <span className="text-xs text-slate-400">· Official NI Guide</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                What is LabVIEW? The Visual G Foundation
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close Walkthrough"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-950/80 px-5 sm:px-6 border-b border-slate-800 flex items-center gap-2 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('what-is-labview')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'what-is-labview'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>1. What is LabVIEW?</span>
          </button>
          <button
            onClick={() => setActiveTab('dataflow-law')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'dataflow-law'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>2. The Sacred Law of Dataflow</span>
          </button>
          <button
            onClick={() => setActiveTab('wire-colors')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'wire-colors'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>3. Wire Colors & Coercion</span>
          </button>
          <button
            onClick={() => setActiveTab('step-by-step-practicals')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'step-by-step-practicals'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>4. Step-by-Step Practical Ladder (Zero to Pro)</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-200 text-sm">
          {/* TAB 1: WHAT IS LABVIEW */}
          {activeTab === 'what-is-labview' && (
            <div className="space-y-6">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <Info className="w-4 h-4" />
                  <span>The Origin & Purpose of LabVIEW</span>
                </div>
                <p className="leading-relaxed text-slate-300">
                  <strong className="text-white">LabVIEW</strong> stands for{' '}
                  <span className="text-amber-400 font-semibold">
                    Laboratory Virtual Instrument Engineering Workbench
                  </span>
                  . It was invented in 1986 by Jeff Kodosky at National Instruments (NI) in Austin, Texas.
                </p>
                <p className="leading-relaxed text-slate-300">
                  Before LabVIEW, engineers who wanted to test an airplane wing, a heart monitor, or a rocket engine had to buy dozens of physical, heavy instruments: oscilloscopes, spectrum analyzers, PID controllers, and strip-chart recorders. National Instruments asked a revolutionary question:{' '}
                  <em className="text-slate-100">
                    "What if software could turn your computer screen into any instrument you could imagine?"
                  </em>
                </p>
              </div>

              {/* Front Panel vs Block Diagram Visual Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2.5 py-1 rounded bg-sky-500/10 text-sky-400 font-bold border border-sky-500/20">
                      Window 1
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Faceplate / UI</span>
                  </div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-sky-400" />
                    <span>The Front Panel (Controls & Indicators)</span>
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    This is what the test technician or operator interacts with. It contains:
                  </p>
                  <ul className="text-xs space-y-2 text-slate-300 pl-4 list-disc marker:text-sky-400">
                    <li>
                      <strong className="text-white">Controls (Inputs):</strong> Knobs, sliders, toggle switches, numeric inputs, and text boxes that feed data into the program.
                    </li>
                    <li>
                      <strong className="text-white">Indicators (Outputs):</strong> Oscilloscope waveform graphs, thermometer gauges, digital meters, and alarm LEDs that show results.
                    </li>
                  </ul>
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-[11px] text-slate-400">
                    Tip: Controls have thick borders with white backgrounds; Indicators have shaded backgrounds.
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
                      Window 2
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Graphical Brain</span>
                  </div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-amber-400" />
                    <span>The Block Diagram (G Code & Wires)</span>
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    This is where the engineering happens. Instead of writing text syntax, you program graphically:
                  </p>
                  <ul className="text-xs space-y-2 text-slate-300 pl-4 list-disc marker:text-amber-400">
                    <li>
                      <strong className="text-white">Nodes (Functions):</strong> Math operators (Add, Multiply), DAQmx driver blocks, PID controllers, and SubVIs.
                    </li>
                    <li>
                      <strong className="text-white">Wires (Data Conduits):</strong> Carry live data packets between nodes. Orange for numbers, green for booleans, pink for text.
                    </li>
                    <li>
                      <strong className="text-white">Structures:</strong> While Loops, For Loops, and Case Structures (If/Else) that govern repetition and state decisions.
                    </li>
                  </ul>
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-[11px] text-slate-400">
                    Shortcut: Press <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-amber-400">Ctrl + E</kbd> (or Cmd + E on Mac) to toggle instantly between Front Panel and Block Diagram!
                  </div>
                </div>
              </div>

              {/* Text vs G Programming Comparison */}
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Why Engineers Choose LabVIEW Over Traditional Text Languages (C / Python)</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-lg bg-slate-900 border border-slate-850 space-y-2">
                    <div className="text-red-400 font-semibold">Traditional Text Languages (Python, C++, Java)</div>
                    <p className="text-slate-400 leading-relaxed">
                      Sequential line-by-line execution. To acquire data at 100 kHz while refreshing a graph at 60 Hz and logging to disk, you must write complex threading code (mutexes, semaphores, thread locks, race condition traps).
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-900 border border-slate-850 space-y-2">
                    <div className="text-emerald-400 font-semibold">LabVIEW Graphical Dataflow (G)</div>
                    <p className="text-slate-400 leading-relaxed">
                      Inherently parallel! If you drop two loops on a Block Diagram, the LabVIEW runtime compiler automatically spawns parallel OS execution threads across your CPU cores with zero manual threading code.
                    </p>
                  </div>
                </div>
              </div>

              {/* Ready to Try */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <div className="text-xs text-amber-200">
                  <strong>Ready to see a real VI running?</strong> Open our Thermal PID Workbench simulator to interact with a live Front Panel and Block Diagram.
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onLaunchLab('lab-1');
                  }}
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer shrink-0"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Launch Live Thermal VI in Lab 1</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: DATAFLOW LAW */}
          {activeTab === 'dataflow-law' && (
            <div className="space-y-6">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <Activity className="w-4 h-4" />
                  <span>The Fundamental Law of G Dataflow</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  "A node executes if and only if ALL of its required inputs have arrived."
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Unlike procedural languages where execution is driven by an instruction pointer moving down line numbers, LabVIEW is driven by <strong>data availability</strong>. A node sleeps until data tokens arrive at every one of its input pins. The instant all pins have data, the node wakes up, computes, places its result on its output wires, and passes tokens downstream.
                </p>
              </div>

              {/* Interactive Dataflow Token Runner */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span>Interactive Live Dataflow Simulation</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Change inputs and click "Fire Tokens" to witness how data flows along wires into the Add node.
                    </p>
                  </div>
                  <button
                    onClick={handleRunTokenDemo}
                    disabled={tokenAnimationActive}
                    className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{tokenAnimationActive ? 'Data Tokens Travelling...' : 'Fire Data Tokens'}</span>
                  </button>
                </div>

                {/* Visual Block Diagram Circuit */}
                <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    {/* Controls (Inputs) */}
                    <div className="space-y-4 w-full sm:w-48">
                      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                        <label className="text-[11px] text-amber-400 font-mono block">Control: Input A (DBL)</label>
                        <input
                          type="number"
                          value={demoInputA}
                          onChange={(e) => setDemoInputA(Number(e.target.value) || 0)}
                          className="w-full bg-slate-900 border border-slate-700 px-2.5 py-1 text-sm font-mono text-white rounded focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                        <label className="text-[11px] text-amber-400 font-mono block">Control: Input B (DBL)</label>
                        <input
                          type="number"
                          value={demoInputB}
                          onChange={(e) => setDemoInputB(Number(e.target.value) || 0)}
                          className="w-full bg-slate-900 border border-slate-700 px-2.5 py-1 text-sm font-mono text-white rounded focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    {/* Wires & Function Node */}
                    <div className="flex items-center justify-center flex-1 py-4 relative">
                      {/* Token animation element */}
                      {tokenAnimationActive && (
                        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-amber-400 shadow-lg shadow-amber-400 animate-ping"></div>
                      )}

                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 flex flex-col items-center justify-center font-black shadow-xl border-2 border-amber-300">
                          <span className="text-xl">+</span>
                          <span className="text-[9px] uppercase tracking-wider font-bold">Add.vi</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono mt-1">Requires 2 Inputs</span>
                      </div>
                    </div>

                    {/* Indicator (Output) */}
                    <div className="w-full sm:w-48">
                      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                        <label className="text-[11px] text-emerald-400 font-mono block">Indicator: Result (DBL)</label>
                        <div className="w-full bg-slate-900 border border-emerald-500/40 px-3 py-1.5 text-lg font-mono font-bold text-emerald-400 rounded text-center">
                          {demoOutput}
                        </div>
                        <span className="text-[10px] text-slate-500 block text-center">Updates upon node execution</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-2">
                  <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-850">
                    <strong className="text-amber-400 block mb-1">1. Tokens Arrive</strong>
                    <span className="text-slate-400">Both Input A and Input B must supply a valid packet before Add.vi begins.</span>
                  </div>
                  <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-850">
                    <strong className="text-amber-400 block mb-1">2. Node Computes</strong>
                    <span className="text-slate-400">The CPU performs the addition in a fraction of a microsecond.</span>
                  </div>
                  <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-850">
                    <strong className="text-amber-400 block mb-1">3. Output Propagates</strong>
                    <span className="text-slate-400">The sum is pushed along the output wire to update the Result indicator.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: WIRE COLORS & COERCION */}
          {activeTab === 'wire-colors' && (
            <div className="space-y-6">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <Layers className="w-4 h-4" />
                  <span>The Universal Wire Color Code</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  In LabVIEW, every wire color conveys its exact data type. You can tell what kind of data is flowing across an entire block diagram in half a second just by glancing at the colors!
                </p>
              </div>

              {/* Wire Type Grid & Detail */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {wireTypes.map((wire) => {
                  const isSelected = selectedWire === wire.id;
                  return (
                    <button
                      key={wire.id}
                      onClick={() => setSelectedWire(wire.id)}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                        isSelected
                          ? `${wire.border} bg-slate-900 ring-2 ring-amber-400/40 shadow-lg`
                          : 'border-slate-800 bg-slate-950 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[11px] px-2 py-0.5 rounded font-bold ${wire.color}`}>
                          {wire.name}
                        </span>
                        <div
                          className="w-3.5 h-3.5 rounded-full"
                          style={{ backgroundColor: wire.hex }}
                        ></div>
                      </div>

                      <div className="w-full h-1 rounded-full" style={{ backgroundColor: wire.hex }}></div>

                      <div className="text-xs text-slate-300 font-mono">
                        {wire.example}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Wire Deep Dive */}
              {(() => {
                const cur = wireTypes.find((w) => w.id === selectedWire) || wireTypes[0];
                return (
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <span
                          className="w-3.5 h-3.5 rounded-full inline-block"
                          style={{ backgroundColor: cur.hex }}
                        ></span>
                        <span>{cur.name} Deep Dive</span>
                      </h4>
                      <span className="text-xs text-slate-400 font-mono">{cur.example}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {cur.desc}
                    </p>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2.5 text-xs">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-amber-400">Architect Pro Tip: </strong>
                        <span className="text-slate-300">{cur.proTip}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 4: STEP-BY-STEP PRACTICALS LADDER */}
          {activeTab === 'step-by-step-practicals' && (
            <div className="space-y-6">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                    <Award className="w-4 h-4" />
                    <span>The 7-Step Practical Pathway (From Zero to Pro)</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    Progress: {completedStepIds.size} / {practicalLadder.length} Mastered
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Follow these 7 sequential steps. Each stage introduces one core mental model and pairs it immediately with a hands-on lab on our workbench.
                </p>
              </div>

              {/* Step Selector Horizontal Bar */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {practicalLadder.map((step, idx) => {
                  const isDone = completedStepIds.has(step.id);
                  const isCurrent = selectedPracticalStep === idx;
                  return (
                    <button
                      key={step.id}
                      onClick={() => setSelectedPracticalStep(idx)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 shrink-0 ${
                        isCurrent
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg'
                          : isDone
                          ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] flex items-center justify-center">
                          {idx + 1}
                        </span>
                      )}
                      <span>{step.level.split(':')[0]}</span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Step Card */}
              {(() => {
                const cur = practicalLadder[selectedPracticalStep] || practicalLadder[0];
                const isDone = completedStepIds.has(cur.id);
                return (
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-850 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
                            {cur.level}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">· {cur.badge}</span>
                        </div>
                        <h3 className="text-lg font-extrabold text-white mt-1">
                          {cur.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-amber-400" /> {cur.time}
                        </span>
                        {onToggleStepComplete && (
                          <button
                            onClick={() => onToggleStepComplete(cur.id)}
                            className={`text-xs px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                              isDone
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{isDone ? 'Step Mastered' : 'Mark Done'}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-xs text-slate-300 font-medium">
                        {cur.concept}
                      </p>
                      <ul className="space-y-2 text-xs text-slate-300 pl-4 list-disc marker:text-amber-400">
                        {cur.points.map((pt, i) => (
                          <li key={i} className="leading-relaxed">
                            {pt}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Hands-On Practical Task */}
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                      <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                        <Sparkles className="w-4 h-4" />
                        <span>Hands-On Practical Lab Assignment</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        {cur.practicalTask}
                      </p>
                      <div className="flex items-center gap-3 pt-1">
                        {cur.labId && (
                          <button
                            onClick={() => {
                              onClose();
                              onLaunchLab(cur.labId!);
                            }}
                            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>{cur.actionLabel}</span>
                          </button>
                        )}
                        {cur.lessonId && (
                          <button
                            onClick={() => {
                              onClose();
                              onOpenLesson(cur.lessonId!);
                            }}
                            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                            <span>Read Full Curriculum Theory</span>
                          </button>
                        )}
                        {!cur.labId && (
                          <button
                            onClick={() => {
                              onClose();
                              onOpenNigel();
                            }}
                            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5 fill-current" />
                            <span>Launch Nigel AI Studio</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 p-4 px-6 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Interactive Zero-to-Pro Academy active</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
