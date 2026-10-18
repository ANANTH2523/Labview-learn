export type CertificationDifficulty = 'ALL' | 'CLAD' | 'CLD' | 'CLA';

export type ResourceCategory = 'official_doc' | 'community_forum' | 'whitepaper' | 'cheatsheet';

export interface LabVIEWResource {
  id: string;
  title: string;
  category: ResourceCategory;
  difficulty: CertificationDifficulty;
  difficultyLabel: string;
  publisher: string;
  url: string;
  isDownloadable?: boolean;
  downloadFileName?: string;
  downloadFormat?: 'PDF' | 'ZIP' | 'MD' | 'VI';
  fileSize?: string;
  description: string;
  keyTopics: string[];
  takeaways: string[];
  recommendedFor: string;
  featured?: boolean;
  rating: number;
  reviewCount: number;
  executiveSummary: string;
  authorOrStandard: string;
}

export const LABVIEW_RESOURCES: LabVIEWResource[] = [
  // ==========================================
  // CLAD - FOUNDATIONAL / ASSOCIATE RESOURCES
  // ==========================================
  {
    id: 'clad-core-1-2-manual',
    title: 'NI LabVIEW Core 1 & Core 2 Curriculum Study Reference',
    category: 'official_doc',
    difficulty: 'CLAD',
    difficultyLabel: 'CLAD - Associate Level',
    publisher: 'National Instruments (NI)',
    url: 'https://www.ni.com/docs/en-US/bundle/labview/page/lvhowto/labview_fundamentals.html',
    isDownloadable: true,
    downloadFileName: 'NI-LabVIEW-Core-Fundamentals-Reference.md',
    downloadFormat: 'MD',
    fileSize: '1.8 MB',
    description: 'The definitive foundational manual covering graphical programming concepts, front panel controls/indicators, block diagram terminal connections, execution highlighting, and basic VIs.',
    keyTopics: ['Dataflow Fundamentals', 'Front Panel vs Block Diagram', 'SubVIs & Connector Panes', 'Context Help Navigation', 'Numeric, Boolean & String Types'],
    takeaways: [
      'Nodes only execute once ALL input terminal values are completely populated.',
      'Always document connector panes with 4x2x2x4 standard layout.',
      'Distinguish between Controls (Inputs) and Indicators (Outputs) by thick vs thin borders.'
    ],
    recommendedFor: 'Engineers taking the CLAD certification exam or learning LabVIEW from scratch.',
    featured: true,
    rating: 4.9,
    reviewCount: 342,
    authorOrStandard: 'NI Global Training & Certification Group',
    executiveSummary: 'This foundational standard details how the LabVIEW compiler transforms visual block diagrams into parallel assembly. It explains why race conditions do not occur when pure dataflow is maintained, and establishes the strict rules for SubVI connector pane allocation (4x2x2x4 pattern) with standard error in on the bottom-left and error out on the bottom-right.'
  },
  {
    id: 'clad-shift-registers-whitepaper',
    title: 'Whitepaper: State Persistence via Shift Registers vs Feedback Nodes',
    category: 'whitepaper',
    difficulty: 'CLAD',
    difficultyLabel: 'CLAD - Associate Level',
    publisher: 'NI Technical Support & Engineering KnowledgeBase',
    url: 'https://knowledge.ni.com/KnowledgeArticleDetails?id=kA00Z000000P6hOSAS',
    isDownloadable: true,
    downloadFileName: 'LabVIEW-Shift-Registers-vs-Feedback-Nodes-Whitepaper.md',
    downloadFormat: 'PDF',
    fileSize: '840 KB',
    description: 'An architectural breakdown of loop memory mechanics. Compares uninitialized vs initialized shift registers, stacked shift registers for FIR filtering, and feedback node pipeline latency.',
    keyTopics: ['Initialized vs Uninitialized Registers', 'Stacked Shift Registers', 'Feedback Node Latency', 'Loop State Memory Allocation'],
    takeaways: [
      'Uninitialized shift registers retain state across multiple calls (the basis for Functional Global Variables).',
      'Stacked shift registers allow immediate access to [i-1], [i-2], [i-n] historical values without array re-allocation.',
      'Feedback nodes behave identically to single-iteration shift registers but reduce wire routing clutter in feedback loops.'
    ],
    recommendedFor: 'CLAD examinees needing mastery over loop iterations and persistent data structures.',
    featured: false,
    rating: 4.8,
    reviewCount: 189,
    authorOrStandard: 'NI Systems Architecture Working Group',
    executiveSummary: 'State persistence in G is achieved through loop-boundary structures. This paper details memory allocation behavior for arrays and clusters passed through shift registers, contrasting in-place compiler buffers with copy-on-write memory reallocation.'
  },
  {
    id: 'clad-error-handling-guide',
    title: 'Whitepaper: Robust Error Handling & Propagation in G Dataflow',
    category: 'whitepaper',
    difficulty: 'CLAD',
    difficultyLabel: 'CLAD - Associate Level',
    publisher: 'NI Automated Test & Measurement Papers',
    url: 'https://www.ni.com/docs/en-US/bundle/labview/page/lvhowto/handling_errors.html',
    isDownloadable: true,
    downloadFileName: 'LabVIEW-Error-Cluster-Architecture-Guide.md',
    downloadFormat: 'PDF',
    fileSize: '620 KB',
    description: 'Guidelines on using the standard 3-element Error Cluster (status: boolean, code: i32, source: string), automatic error handling vs manual error propagation, and Merge Errors priority.',
    keyTopics: ['Standard Error Cluster Anatomy', 'Merge Errors Function Priority', 'Error Ring & Custom Error Codes', 'Case Structure Error Framing'],
    takeaways: [
      'Standard error cluster has 3 elements: status (boolean), code (i32), and source (string).',
      'Merge Errors always preserves the FIRST active error encountered and discards subsequent non-zero warnings.',
      'Wiring error cluster through SubVIs controls execution order independently of data wires.'
    ],
    recommendedFor: 'All LabVIEW developers wanting fault-tolerant test and DAQ execution.',
    featured: true,
    rating: 4.9,
    reviewCount: 278,
    authorOrStandard: 'NI Automated Test Standards Committee',
    executiveSummary: 'Error handling in LabVIEW serves two dual purposes: signaling runtime hardware or logic failures, and enforcing execution sequencing across parallel nodes without artificial sequence structures.'
  },
  {
    id: 'clad-official-exam-prep',
    title: 'Official NI CLAD Exam Guide, Specification & Practice Questions',
    category: 'official_doc',
    difficulty: 'CLAD',
    difficultyLabel: 'CLAD - Associate Level',
    publisher: 'National Instruments Certification Portal',
    url: 'https://www.ni.com/en-us/innovations/white-papers/06/clad-exam-preparation-guide.html',
    isDownloadable: true,
    downloadFileName: 'Official-NI-CLAD-Exam-Blueprint-And-Samples.md',
    downloadFormat: 'PDF',
    fileSize: '2.4 MB',
    description: 'The authoritative syllabus and question distribution for the Certified LabVIEW Associate Developer exam, covering 40 multiple-choice questions across data types, loops, arrays, and troubleshooting.',
    keyTopics: ['Exam Syllabus Weightings', 'Sample Question Bank', 'Polymorphism & Coercion Dots', 'Timing & Wait (ms) vs Wait Until Next ms Multiple'],
    takeaways: [
      'CLAD consists of 40 questions in 60 minutes with a 70% passing threshold.',
      'Pay special attention to coercion dots (red dots indicate implicit type conversions causing memory overhead).',
      'Wait Until Next ms Multiple synchronizes execution with the system timer clock tick.'
    ],
    recommendedFor: 'Engineers preparing to sit for the official NI CLAD accreditation.',
    featured: true,
    rating: 5.0,
    reviewCount: 512,
    authorOrStandard: 'NI Credentialing & Certification Directorate',
    executiveSummary: 'This blueprint establishes the exact topic weightings for the CLAD credential. It breaks down question percentages: 25% Hardware/Environment, 35% Programming Fundamentals (Loops, Data Types), 20% SubVIs & Modular Design, and 20% Debugging & Troubleshooting.'
  },
  {
    id: 'community-ni-forums',
    title: 'NI Official Community Forums: LabVIEW Discussion Board',
    category: 'community_forum',
    difficulty: 'ALL',
    difficultyLabel: 'All Certification Levels',
    publisher: 'NI Global Community Network',
    url: 'https://forums.ni.com/t5/LabVIEW/bd-p/170',
    isDownloadable: false,
    description: 'The central hub for over 250,000 LabVIEW engineers worldwide. Features active threads on DAQmx, VISA, FPGA, vision, algorithmic optimization, and daily Q&A moderated by NI Systems Engineers.',
    keyTopics: ['Peer-to-Peer Debugging', 'Code Reviews', 'Hardware Driver Troubleshooting', 'Sample VI Exchanges', 'Certification Discussions'],
    takeaways: [
      'Search before posting; most standard hardware initialization questions have validated solution threads.',
      'Include VI snippets or screenshots with execution highlighting enabled when posting questions.',
      'Look for posts marked by NI Champions and Knights of NI for high-authority architectural advice.'
    ],
    recommendedFor: 'Every LabVIEW developer needing rapid peer feedback and verified code snippets.',
    featured: true,
    rating: 4.8,
    reviewCount: 1420,
    authorOrStandard: 'NI Community Moderators & NI Champions',
    executiveSummary: 'The NI Discussion Forums represent the single largest repository of verified G-code solutions and troubleshooting archives in existence, spanning four decades of test automation history.'
  },

  // ==========================================
  // CLD - INTERMEDIATE / DEVELOPER RESOURCES
  // ==========================================
  {
    id: 'cld-style-guide-blume',
    title: 'The LabVIEW Style Guide: Production Architecture & Wiring Standards',
    category: 'official_doc',
    difficulty: 'CLD',
    difficultyLabel: 'CLD - Developer Level',
    publisher: 'National Instruments & Prentice Hall (Peter Blume)',
    url: 'https://www.ni.com/docs/en-US/bundle/labview/page/lvhowto/labview_style_guidelines.html',
    isDownloadable: true,
    downloadFileName: 'LabVIEW-Production-Style-And-Wiring-Standard.md',
    downloadFormat: 'MD',
    fileSize: '3.1 MB',
    description: 'The industry-standard coding conventions adopted across aerospace, automotive, and semiconductor test benches. Covers wire routing, cosmetic cleanliness, VI hierarchy, and self-documenting block diagrams.',
    keyTopics: ['Left-to-Right Dataflow Standard', 'Wire Bending & Zero Overlap Rules', 'Labeling Controls & Constants', 'SubVI Icon Artistry (32x32 Standard)', 'Documentation Tags & Tip Strips'],
    takeaways: [
      'Dataflow must strictly progress left-to-right; never route wires backwards unless entering a shift register left terminal.',
      'SubVI icons must have a uniform header color, 32x32 border, and clear 2-line textual descriptor.',
      'CLD grading penalizes overlapping wires, hidden code inside disabled diagrams, and unlabeled constants.'
    ],
    recommendedFor: 'Candidates preparing for the 4-hour CLD practical coding examination.',
    featured: true,
    rating: 5.0,
    reviewCount: 410,
    authorOrStandard: 'Peter A. Blume & NI Software Engineering Committee',
    executiveSummary: 'Clear visual code is maintainable code. In the Certified LabVIEW Developer (CLD) examination, style, modularity, and documentation count for over 35% of the total score. This document outlines the mandatory rules for clean wiring, icon design, and header documentation.'
  },
  {
    id: 'cld-qmh-vs-state-machine',
    title: 'Whitepaper: Queued Message Handler (QMH) vs Standard State Machine',
    category: 'whitepaper',
    difficulty: 'CLD',
    difficultyLabel: 'CLD - Developer Level',
    publisher: 'NI Systems Architecture & Design Patterns Research',
    url: 'https://www.ni.com/en-us/innovations/white-papers/11/standard-state-machine-vs-queued-message-handler.html',
    isDownloadable: true,
    downloadFileName: 'LabVIEW-QMH-vs-State-Machine-Architecture.md',
    downloadFormat: 'PDF',
    fileSize: '1.2 MB',
    description: 'An in-depth architectural comparison between Single-Loop State Machines (Enum + Case Structure) and Multi-Loop Queued Message Handlers (Producer-Consumer with FIFO Queues) for asynchronous test applications.',
    keyTopics: ['Event-Driven UI Handling', 'FIFO Message Queue Buffers', 'Enqueue/Dequeue Synchronization', 'State Queuing vs Event Starvation', 'Clean Shutdown Propagation'],
    takeaways: [
      'Single-loop state machines freeze UI event responses during long-running DAQ operations.',
      'Producer-Consumer separates fast user UI events (<10ms) from heavy hardware data processing loops.',
      'Always release queues in reverse order of creation and propagate explicit EXIT messages to all parallel loops.'
    ],
    recommendedFor: 'Developers building multi-tasking test systems and taking the CLD examination.',
    featured: true,
    rating: 4.9,
    reviewCount: 388,
    authorOrStandard: 'NI Software Architecture Review Board',
    executiveSummary: 'This technical whitepaper provides benchmark timings and architectural diagrams comparing single-loop polling, event structures, and dual-loop Queued Message Handlers. It explains how to prevent queue memory overflow under sustained gigabyte/second telemetry.'
  },
  {
    id: 'cld-daqmx-continuous-timing',
    title: 'NI-DAQmx Continuous Hardware Acquisition & Synchronization Guide',
    category: 'official_doc',
    difficulty: 'CLD',
    difficultyLabel: 'CLD - Developer Level',
    publisher: 'National Instruments Hardware Systems Group',
    url: 'https://www.ni.com/docs/en-US/bundle/ni-daqmx/page/daqmxcoredoc/daqmxoverview.html',
    isDownloadable: true,
    downloadFileName: 'NI-DAQmx-High-Speed-Continuous-Acquisition-Guide.md',
    downloadFormat: 'PDF',
    fileSize: '2.8 MB',
    description: 'Comprehensive guide to configuring DAQmx tasks: Create Channel, Configure Timing (Sample Clock, Continuous Samples), Start Task, Read Waveform (1D/2D DBL), Clear Task, and DAQmx Error Handling.',
    keyTopics: ['Hardware Clock vs Software Polling', 'Circular Ring Buffers', 'DAQmx IsTaskDone & Overwrite Errors (-200279)', 'Analog Input vs Output Synchronization', 'RTSI & PXI Trigger Routing'],
    takeaways: [
      'Always use hardware-timed sample clocks rather than software software-polled loops for deterministic interval acquisition.',
      'Error -200279 occurs when the software read loop falls behind the hardware ADC onboard FIFO buffer.',
      'Always execute DAQmx Clear Task in the cleanup phase to release hardware resource handles for other processes.'
    ],
    recommendedFor: 'Test engineers interfacing with NI-DAQ hardware (cDAQ, PXIe, USB Multifunction I/O).',
    featured: true,
    rating: 4.9,
    reviewCount: 295,
    authorOrStandard: 'NI DAQmx Driver Engineering Team',
    executiveSummary: 'Continuous analog acquisition requires understanding the interplay between the onboard ADC FIFO, the DMA controller, the Windows/Linux ring buffer, and the user application block diagram. This guide gives exact equations for buffer sizing.'
  },
  {
    id: 'cld-lava-developer-forum',
    title: 'LAVA (LabVIEW Advanced Virtual Architects) Developer Community',
    category: 'community_forum',
    difficulty: 'CLD',
    difficultyLabel: 'CLD - Developer Level',
    publisher: 'LAVA Community & Independent Certified Developers',
    url: 'https://lavag.org/',
    isDownloadable: false,
    description: 'The premier independent forum for professional LabVIEW architects, CLDs, and CLAs. Renowned for rigorous debates on OOP, Actor Framework, hardware timing tricks, and open-source G packages.',
    keyTopics: ['Advanced Design Patterns', 'VI Server & Scripting', 'XControls & QControls', 'Code Generation & Unit Testing', 'Open Source Toolkits'],
    takeaways: [
      'Search LAVA for deep compiler mechanics and edge-case behavior not documented in standard manuals.',
      'Discover high-performance community toolkits such as MGI Solution Explorer and JKI State Machine.',
      'Engage in peer critique on software architectures with international Certified LabVIEW Architects.'
    ],
    recommendedFor: 'Professional developers progressing from CLD to CLA mastery.',
    featured: true,
    rating: 5.0,
    reviewCount: 890,
    authorOrStandard: 'LAVA Community Advisory Board',
    executiveSummary: 'Founded by senior NI Certified LabVIEW Architects, LAVA is the highest-level independent forum for graphical system engineering discussions, architectural debates, and custom tool development.'
  },
  {
    id: 'cld-fgv-race-conditions-whitepaper',
    title: 'Whitepaper: Functional Global Variables (FGVs) & Race Condition Elimination',
    category: 'whitepaper',
    difficulty: 'CLD',
    difficultyLabel: 'CLD - Developer Level',
    publisher: 'NI Certified Consulting Engineers Archive',
    url: 'https://knowledge.ni.com/KnowledgeArticleDetails?id=kA00Z000000P8pBSAS',
    isDownloadable: true,
    downloadFileName: 'LabVIEW-FGV-Race-Conditions-Elimination-Whitepaper.md',
    downloadFormat: 'PDF',
    fileSize: '750 KB',
    description: 'Why local variables and global variables cause non-deterministic read-modify-write race conditions in parallel loops. How to architect reentrant and non-reentrant Action Engines (FGVs) for thread-safe state sharing.',
    keyTopics: ['Local Variable Read-Modify-Write Hazards', 'Non-Reentrant VI Mutex Locks', 'Action Engine Design Pattern', 'Atomic Operations in G', 'Data Encapsulation'],
    takeaways: [
      'Local variables bypass dataflow, duplicate memory buffers, and create insidious timing races.',
      'A Functional Global Variable encapsulates data within an uninitialized shift register inside a non-reentrant SubVI.',
      'Actions (Init, Read, Write, Increment, Reset) are executed atomically because LabVIEW grants exclusive execution to non-reentrant VIs.'
    ],
    recommendedFor: 'CLD aspirants seeking 100% thread safety and clean multi-loop communication.',
    featured: false,
    rating: 4.8,
    reviewCount: 215,
    authorOrStandard: 'National Instruments Systems Engineering Group',
    executiveSummary: 'This paper demonstrates the mathematical proof of race condition occurrence when multiple asynchronous loops read and write shared variables without mutex guards, and provides the step-by-step implementation of thread-safe Action Engines.'
  },
  {
    id: 'cld-official-exam-spec',
    title: 'Official NI CLD 4-Hour Practical Exam Specimen & Rubric Guidelines',
    category: 'official_doc',
    difficulty: 'CLD',
    difficultyLabel: 'CLD - Developer Level',
    publisher: 'National Instruments Certification Operations',
    url: 'https://www.ni.com/en-us/innovations/white-papers/06/cld-exam-preparation-guide.html',
    isDownloadable: true,
    downloadFileName: 'Official-NI-CLD-Practical-Exam-Specification-And-Rubric.md',
    downloadFormat: 'PDF',
    fileSize: '3.4 MB',
    description: 'The real guidelines used by NI graders to evaluate CLD submissions. Outlines scoring matrices for functionality (40 pts), programming style (25 pts), architecture (20 pts), and documentation (15 pts).',
    keyTopics: ['4-Hour Time Management Strategy', 'Grading Rubric Penalties', 'Atmospheric Chamber & Car Wash Sample Exams', 'SubVI Partitioning Rules', 'State Machine Templates'],
    takeaways: [
      'Spend the first 30 minutes creating user typedefs, state enums, and architecture skeletons before writing logic.',
      'A non-functional required requirement loses far more points than minor styling imperfections.',
      'Include block diagram comments explaining state transitions and front panel tip strips on all user controls.'
    ],
    recommendedFor: 'Engineers taking the CLD practical examination within the next 30 days.',
    featured: true,
    rating: 5.0,
    reviewCount: 470,
    authorOrStandard: 'NI Global Certification Exam Review Board',
    executiveSummary: 'The CLD is a 4-hour live coding exam where candidates must build a fully functional, scalable LabVIEW application from a raw functional specification. This document outlines the exact rubric criteria and common failure modes.'
  },

  // ==========================================
  // CLA - ADVANCED / ARCHITECT RESOURCES
  // ==========================================
  {
    id: 'cla-actor-framework-whitepaper',
    title: 'NI Whitepaper: Actor Framework Fundamentals & Message-Based System Design',
    category: 'whitepaper',
    difficulty: 'CLA',
    difficultyLabel: 'CLA - Architect Level',
    publisher: 'National Instruments Systems Architecture R&D (Allen Smith)',
    url: 'https://www.ni.com/en-us/innovations/white-papers/11/actor-framework-fundamentals.html',
    isDownloadable: true,
    downloadFileName: 'LabVIEW-Actor-Framework-Architecture-Whitepaper.md',
    downloadFormat: 'PDF',
    fileSize: '4.2 MB',
    description: 'The authoritative architectural paper on creating decoupled, message-driven, object-oriented LabVIEW systems using Actor Framework. Explores nested actors, self-addressed messages, error escalation, and Actor Core overrides.',
    keyTopics: ['Actor Class & Message Class Hierarchy', 'Dynamic Dispatching in G', 'Caller-Nested Actor Trees', 'Asynchronous Message Enqueuing', 'Actor Core Overrides & Stop Mechanics'],
    takeaways: [
      'Actors are autonomous G objects with their own message reception queue and execution thread.',
      'Zero coupling: The sender actor depends only on the Message class, never on the concrete receiver actor implementation.',
      'Error escalation automatically flows from child actors up to the root caller actor for coordinated fail-safe shutdown.'
    ],
    recommendedFor: 'Architects designing complex, distributed, multi-instrument test platforms and CLA examinees.',
    featured: true,
    rating: 4.9,
    reviewCount: 310,
    authorOrStandard: 'Allen C. Smith (Chief Architect, Actor Framework, NI)',
    executiveSummary: 'Actor Framework represents the pinnacle of LabVIEW object-oriented architecture. By mapping each parallel process to an encapsulated Actor object with private state and asynchronous message queues, developers can build mission-critical test racks containing hundreds of synchronized sub-systems.'
  },
  {
    id: 'cla-continuous-integration-cli',
    title: 'Whitepaper: CI/CD, Unit Testing Framework & Automated Builds in G',
    category: 'whitepaper',
    difficulty: 'CLA',
    difficultyLabel: 'CLA - Architect Level',
    publisher: 'NI Enterprise Software Architecture Division',
    url: 'https://www.ni.com/docs/en-US/bundle/labview/page/lvexcodeconcepts/unit_testing_framework.html',
    isDownloadable: true,
    downloadFileName: 'LabVIEW-CICD-Pipeline-And-Unit-Testing-Whitepaper.md',
    downloadFormat: 'PDF',
    fileSize: '1.9 MB',
    description: 'Modern software engineering practices applied to G-code: Command-line VI compilation (LabVIEW CLI), headless unit test execution, git source code control diffing with LVCompare, and automated VIPM package deployment.',
    keyTopics: ['LabVIEW CLI Headless Execution', 'LVCompare & LVMerge Automation', 'Unit Test Framework Test Vectors', 'VI Package Manager (VIPM) Pipelines', 'Git Workflow for Graphical Code'],
    takeaways: [
      'Never commit compiled code cache into Git repositories; separate compiled code from VIs in project properties.',
      'Run automated VI Analyzer checks in pre-commit git hooks to enforce corporate style guides.',
      'Unit Test Framework enables automated regression testing of SubVIs across boundary conditions and edge vectors.'
    ],
    recommendedFor: 'Lead software engineers and DevOps architects maintaining large enterprise codebases.',
    featured: false,
    rating: 4.8,
    reviewCount: 165,
    authorOrStandard: 'NI Enterprise Architecture Group',
    executiveSummary: 'This engineering guide describes how modern test organizations integrate LabVIEW with GitHub Actions, Jenkins, and Azure DevOps to achieve fully automated builds, regressions, and regulatory traceability.'
  },
  {
    id: 'cla-visa-scpi-idnet',
    title: 'NI-VISA Instrument Control & SCPI Protocol Architecture Reference',
    category: 'official_doc',
    difficulty: 'CLA',
    difficultyLabel: 'CLA - Architect Level',
    publisher: 'National Instruments & IVI Foundation',
    url: 'https://www.ni.com/docs/en-US/bundle/ni-visa/page/ni-visa/introvisa.html',
    isDownloadable: true,
    downloadFileName: 'NI-VISA-SCPI-Instrument-Automation-Reference.md',
    downloadFormat: 'PDF',
    fileSize: '2.1 MB',
    description: 'The definitive architectural guide to NI-VISA (Virtual Instrument Software Architecture). Covers VISA Open, Write, Read, Clear, and Close operations across GPIB, USB-TMC, RS-232, and Ethernet (TCP/IP socket and VXI-11/LXI).',
    keyTopics: ['VISA Resource Descriptors (TCPIP0::...::INSTR)', 'SCPI Command Syntax (*IDN?, :MEAS:VOLT:DC?)', 'Termination Character Handling (\n vs 0x0A)', 'VISA Timeout Exception Management', 'Plug & Play Instrument Drivers (IDNet)'],
    takeaways: [
      'Always configure the VISA Termination Character (typically Linefeed 0x0A) before initiating string-based instrument reads.',
      'VISA Clear flushes both hardware instrument input buffers and OS I/O drivers to recover from communication deadlocks.',
      'Instrument drivers should adhere to the standardized IVI foundation state-caching architecture.'
    ],
    recommendedFor: 'Automated test engineers automating benchtop DMMs, oscilloscopes, spectrum analyzers, and power supplies.',
    featured: true,
    rating: 4.9,
    reviewCount: 280,
    authorOrStandard: 'NI Instrument Control Driver Working Group',
    executiveSummary: 'Standardizing test bench automation through NI-VISA ensures that code written for a USB-connected DMM seamlessly ports to a GPIB or LXI Ethernet instrument without changing a single line of G dataflow logic.'
  },
  {
    id: 'cla-summit-papers',
    title: 'CLA Summit Keynote & Technical Presentation Archive',
    category: 'community_forum',
    difficulty: 'CLA',
    difficultyLabel: 'CLA - Architect Level',
    publisher: 'NI Certified LabVIEW Architect Summit',
    url: 'https://forums.ni.com/t5/Certified-LabVIEW-Architects/ct-p/7010',
    isDownloadable: true,
    downloadFileName: 'CLA-Summit-Advanced-Architectures-Compendium.md',
    downloadFormat: 'ZIP',
    fileSize: '5.6 MB',
    description: 'Curated technical whitepapers and presentations from the invitation-only CLA Summit. Features world-leading presentations on HALs (Hardware Abstraction Layers), MALs (Measurement Abstraction Layers), and real-time PXI deterministic controllers.',
    keyTopics: ['Hardware Abstraction Layers (HAL)', 'Measurement Abstraction Layers (MAL)', 'Zero-Copy Memory Optimization', 'Deterministic Real-Time OS Benchmarks', 'Plugin Dynamic Registration'],
    takeaways: [
      'HAL interfaces isolate test sequence logic from physical instrument models, allowing zero-code test bench equipment upgrades.',
      'Memory in G is managed automatically by the compiler, but large data arrays (>100MB) require in-place structures to avoid RAM exhaustion.',
      'CLA certification requires proving you can architect a framework that a junior developer can populate without architectural breakage.'
    ],
    recommendedFor: 'Senior engineers taking the 4-hour CLA architectural exam or designing multi-year test architectures.',
    featured: true,
    rating: 5.0,
    reviewCount: 360,
    authorOrStandard: 'NI Global CLA Summit Committee',
    executiveSummary: 'The CLA Summit is the annual gathering of the top 2% of LabVIEW engineers globally. This collection contains the highest-rated architectural presentations detailing real-world enterprise deployments in defense, space, and medical devices.'
  },
  {
    id: 'cla-official-exam-blueprint',
    title: 'Official NI CLA Exam Blueprint: System Architecture & Design Criteria',
    category: 'official_doc',
    difficulty: 'CLA',
    difficultyLabel: 'CLA - Architect Level',
    publisher: 'National Instruments Professional Certification',
    url: 'https://www.ni.com/en-us/innovations/white-papers/06/cla-exam-preparation-guide.html',
    isDownloadable: true,
    downloadFileName: 'Official-NI-CLA-Architect-Exam-Blueprint.md',
    downloadFormat: 'PDF',
    fileSize: '3.8 MB',
    description: 'The official syllabus and architectural rubric for the Certified LabVIEW Architect (CLA) exam. Unlike CLD, CLA tests your ability to design the overarching system framework, error-handling hierarchy, and inter-process communication rather than complete business logic.',
    keyTopics: ['4-Hour CLA Specification Strategy', 'Skeleton Framework Construction', 'Inter-Process Communication (IPC)', 'Centralized Error Management', 'Project File Organization & Layering'],
    takeaways: [
      'In the CLA exam, you build the architecture and communication pathways; concrete SubVI worker logic is left stubbed.',
      'Grading prioritizes how cleanly your system handles sudden shutdown, user abort, hardware faults, and concurrent events.',
      'Strict decoupling between the User Interface layer, Business Logic layer, and Hardware I/O layer is mandatory.'
    ],
    recommendedFor: 'Senior developers who already hold a valid CLD and are preparing for the ultimate CLA certification.',
    featured: true,
    rating: 5.0,
    reviewCount: 290,
    authorOrStandard: 'NI CLA Chief Certification Examiners',
    executiveSummary: 'The Certified LabVIEW Architect (CLA) credential is the highest level of certification awarded by National Instruments. This guide explains how to approach the 4-hour exam, maintain architectural purity under time pressure, and score maximum points on framework cohesion.'
  },
  {
    id: 'cla-openg-community-hub',
    title: 'OpenG Toolkit Repository & Community Reusable G-Code Library',
    category: 'community_forum',
    difficulty: 'ALL',
    difficultyLabel: 'All Certification Levels',
    publisher: 'OpenG.org Open Source LabVIEW Developers',
    url: 'https://www.openg.org/',
    isDownloadable: true,
    downloadFileName: 'OpenG-Toolkit-Reference-And-Best-Practices.md',
    downloadFormat: 'ZIP',
    fileSize: '4.8 MB',
    description: 'The oldest and most respected open-source library for LabVIEW. Over 800 peer-reviewed, open-source VIs for array manipulation, string formatting, variant configuration, file I/O, and mathematical algorithms used in thousands of commercial projects.',
    keyTopics: ['Variant Data Inspection', 'High-Performance String Buffering', 'Advanced Array Math Functions', 'INI & JSON Serialization', 'Open-Source Licensing in G'],
    takeaways: [
      'OpenG VIs are maintained under the BSD license and can be inspected down to the native G block diagram.',
      'The OpenG Array toolkit solves common missing primitives like Sort 2D Array and Filter Array by Predicate.',
      'Studying OpenG code is one of the best ways to observe world-class SubVI icon design, connector pane standards, and error cluster propagation.'
    ],
    recommendedFor: 'All developers seeking to build reusable, modular libraries and save hundreds of development hours.',
    featured: false,
    rating: 4.9,
    reviewCount: 630,
    authorOrStandard: 'Jim Kring & The OpenG Community Foundation',
    executiveSummary: 'The OpenG libraries provide a foundational standard of reusable G-code, demonstrating how to write clean, reusable, multi-platform VIs that compile seamlessly across Windows, Linux RT, and macOS.'
  }
];

export const CERTIFICATION_CATEGORIES = [
  { id: 'ALL', label: 'All Levels', count: LABVIEW_RESOURCES.length },
  { id: 'CLAD', label: 'CLAD (Associate)', count: LABVIEW_RESOURCES.filter(r => r.difficulty === 'CLAD').length },
  { id: 'CLD', label: 'CLD (Developer)', count: LABVIEW_RESOURCES.filter(r => r.difficulty === 'CLD').length },
  { id: 'CLA', label: 'CLA (Architect)', count: LABVIEW_RESOURCES.filter(r => r.difficulty === 'CLA').length },
] as const;

export const RESOURCE_TYPE_FILTERS = [
  { id: 'all', label: 'All Resources' },
  { id: 'official_doc', label: 'NI Official Docs' },
  { id: 'community_forum', label: 'Forums & User Groups' },
  { id: 'whitepaper', label: 'Whitepapers & Guides' },
] as const;

export interface ResourceFilterOptions {
  difficulty?: CertificationDifficulty;
  category?: string;
  searchQuery?: string;
  bookmarkedOnly?: boolean;
  bookmarkedIds?: string[];
  sortBy?: 'rating' | 'title' | 'difficulty';
}

export function filterResources(
  resources: LabVIEWResource[],
  options: ResourceFilterOptions
): LabVIEWResource[] {
  const {
    difficulty = 'ALL',
    category = 'all',
    searchQuery = '',
    bookmarkedOnly = false,
    bookmarkedIds = [],
    sortBy = 'rating',
  } = options;

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filtered = resources.filter((item) => {
    // Difficulty filter
    if (difficulty !== 'ALL') {
      if (item.difficulty !== 'ALL' && item.difficulty !== difficulty) {
        return false;
      }
    }

    // Category filter
    if (category !== 'all' && item.category !== category) {
      return false;
    }

    // Bookmarked only
    if (bookmarkedOnly && !bookmarkedIds.includes(item.id)) {
      return false;
    }

    // Search query
    if (normalizedQuery) {
      const matchTitle = item.title.toLowerCase().includes(normalizedQuery);
      const matchDesc = item.description.toLowerCase().includes(normalizedQuery);
      const matchPub = item.publisher.toLowerCase().includes(normalizedQuery);
      const matchTopics = item.keyTopics.some((t) => t.toLowerCase().includes(normalizedQuery));
      const matchSummary = item.executiveSummary.toLowerCase().includes(normalizedQuery);
      if (!matchTitle && !matchDesc && !matchPub && !matchTopics && !matchSummary) {
        return false;
      }
    }

    return true;
  });

  return filtered.sort((a, b) => {
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === 'difficulty') {
      const rank: Record<CertificationDifficulty, number> = {
        ALL: 0,
        CLAD: 1,
        CLD: 2,
        CLA: 3,
      };
      return (rank[b.difficulty] || 0) - (rank[a.difficulty] || 0);
    }
    // Default: rating desc, then reviewCount desc
    if (b.rating !== a.rating) {
      return b.rating - a.rating;
    }
    return b.reviewCount - a.reviewCount;
  });
}

export function generateWhitepaperDocumentText(resource: LabVIEWResource): string {
  return [
    `# ${resource.title}`,
    `================================================================================`,
    `Publisher: ${resource.publisher}`,
    `Standard/Author: ${resource.authorOrStandard}`,
    `Certification Level: ${resource.difficultyLabel}`,
    `Reference URL: ${resource.url}`,
    ``,
    `## Executive Architecture Summary`,
    resource.executiveSummary,
    ``,
    `## Abstract & Description`,
    resource.description,
    ``,
    `## Core Engineering Topics Covered`,
    ...resource.keyTopics.map((topic, i) => `${i + 1}. ${topic}`),
    ``,
    `## Crucial Architectural Takeaways for Examination & Production`,
    ...resource.takeaways.map((item, i) => `* [Rule ${i + 1}] ${item}`),
    ``,
    `## Recommended For`,
    resource.recommendedFor,
    ``,
    `--------------------------------------------------------------------------------`,
    `Generated by LabVIEW Academy • National Instruments Official & Community Curated Library`,
  ].join('\n');
}

