export type WireType = 'double' | 'i32' | 'boolean' | 'string' | 'cluster' | 'error' | 'waveform';

export interface WireColorMap {
  color: string;
  label: string;
  description: string;
  labviewType: string;
}

export type MentorPersonaId = 'professor' | 'mentor' | 'nigel';

export interface MentorPersona {
  id: MentorPersonaId;
  name: string;
  role: string;
  title: string;
  avatarColor: string;
  specialty: string;
  bio: string;
  badge: string;
}

export interface CurriculumLesson {
  id: string;
  title: string;
  subtitle: string;
  level: 'Zero Knowledge' | 'CLAD Associate' | 'CLD Developer' | 'CLA Architect' | 'Nigel AI Master';
  levelNumber: number;
  durationMinutes: number;
  summary: string;
  coreConcepts: string[];
  dataflowPrinciples: string[];
  blockDiagramExample: {
    title: string;
    description: string;
    nodes: string[];
    wires: { from: string; to: string; type: WireType }[];
  };
  nigelTip: string;
  pitfallToAvoid: string;
  exercisePrompt: string;
  relatedLabId?: string;
}

export interface CurriculumModule {
  id: string;
  number: number;
  title: string;
  category: 'Foundation' | 'Certification' | 'Design Patterns' | 'Hardware & Automation' | 'AI & Nigel';
  badge: string;
  description: string;
  lessons: CurriculumLesson[];
}

export interface NodeTerminal {
  id: string;
  name: string;
  type: WireType;
  position: 'left' | 'right' | 'top' | 'bottom';
  value?: any;
}

export interface BlockDiagramNode {
  id: string;
  name: string;
  iconName: string;
  x: number;
  y: number;
  width: number;
  height: number;
  category: 'io' | 'arithmetic' | 'structure' | 'filter' | 'control' | 'queue' | 'error';
  inputs: NodeTerminal[];
  outputs: NodeTerminal[];
  executionTimeMs?: number;
  stateData?: Record<string, any>;
}

export interface BlockDiagramWire {
  id: string;
  fromNodeId: string;
  fromTerminalId: string;
  toNodeId: string;
  toTerminalId: string;
  type: WireType;
  currentValue?: any;
  isBroken?: boolean;
}

export interface FrontPanelControl {
  id: string;
  label: string;
  type: 'knob' | 'slider' | 'toggleSwitch' | 'led' | 'numericIndicator' | 'numericControl' | 'gauge' | 'chart' | 'errorCluster';
  value: any;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  mechanicalAction?: 'Switch Until Released' | 'Switch When Pressed' | 'Switch When Released' | 'Latch Until Released' | 'Latch When Pressed' | 'Latch When Released';
  history?: number[];
}

export interface SimulationLab {
  id: string;
  title: string;
  tagline: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Master';
  description: string;
  architecture: string;
  nodes: BlockDiagramNode[];
  wires: BlockDiagramWire[];
  controls: FrontPanelControl[];
  learningObjectives: string[];
  nigelPromptExample: string;
}

export interface ExamQuestion {
  id: string;
  level: 'CLAD' | 'CLD' | 'CLA';
  topic: string;
  question: string;
  diagramAscii?: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
  explanation: string;
  dataflowRule: string;
}

export interface NigelPromptTemplate {
  id: string;
  title: string;
  hardware: string;
  architecture: string;
  samplePrompt: string;
  description: string;
  complexity: 'Standard' | 'Advanced' | 'Enterprise ATE';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  personaId: MentorPersonaId;
  text: string;
  timestamp: string;
}

/** A scored Nigel AI prompt blueprint, produced on-device by buildNigelBlueprint(). */
export interface NigelBlueprintResult {
  score: number;
  critique: string;
  optimizedPrompt: string;
  blockDiagramBlueprint: {
    pattern: string;
    states: string[];
    keyNodes: string[];
    pitfallAlert: string;
  };
  trainingLesson?: string;
  modelUsed: string;
}
