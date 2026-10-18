import { MentorPersona } from '../types';

export const MENTOR_PERSONAS: MentorPersona[] = [
  {
    id: 'professor',
    name: 'Dr. Marcus Vance',
    role: 'Chief LabVIEW Architect & NI Certified Fellow',
    title: 'The Professor: Graphical Dataflow & Computer Science of G',
    avatarColor: 'from-amber-500 to-amber-700',
    specialty: 'Dataflow Theory, Execution Systems, State Machines, Race Conditions & Memory Management',
    bio: '30+ years in Graphical System Design and National Instruments architecture. Former NI Core Compiler engineer and Certified LabVIEW Architect (CLA). Teaches the foundational theory of G, dataflow determinism, and robust state machine patterns.',
    badge: 'CLA Fellow',
  },
  {
    id: 'mentor',
    name: 'Elena Rostova',
    role: 'Principal Automated Test Systems Engineer',
    title: 'The Industry Mentor: Production ATE, TestStand & Instruments',
    avatarColor: 'from-sky-500 to-blue-700',
    specialty: 'Automated Test Equipment (ATE), NI-DAQmx, PXI, VISA/SCPI Instrument Drivers & High-Throughput Manufacturing',
    bio: 'Deploys multi-rack automated test fixtures in aerospace and semiconductor manufacturing. Expert in high-speed hardware-timed DAQmx, TestStand sequencers, calibration, and zero-downtime test engineering.',
    badge: 'ATE Lead',
  },
  {
    id: 'nigel',
    name: 'Dr. Austin Thorne',
    role: 'NI Generative AI & Automation Prompting Pioneer',
    title: 'Nigel AI Lead: Prompt Engineering & Automated G-Code Synthesis',
    avatarColor: 'from-emerald-500 to-teal-700',
    specialty: 'Nigel AI Prompting, Synthetic Test Case Generation, Code Audits & LLM-Assisted LabVIEW Development',
    bio: 'Specialist in the intersection of Generative AI and National Instruments LabVIEW. Created the standard 5-point prompt protocol to guarantee bug-free, deterministic G-code generation from Nigel AI.',
    badge: 'Nigel AI Pioneer',
  },
];
