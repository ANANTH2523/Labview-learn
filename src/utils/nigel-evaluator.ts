export interface PromptEvaluationResult {
  score: number;
  grade: 'Novice' | 'Competent' | 'Advanced' | 'Master CLA';
  strengths: string[];
  missingElements: string[];
  dataflowReadiness: 'Poor' | 'Moderate' | 'High' | 'Production Ready';
  suggestions: string[];
}

/**
 * Analyzes a user's prompt directed to Nigel AI for LabVIEW generation.
 * Evaluates against NI Certified LabVIEW Architect (CLA) standards.
 */
export function evaluateNigelPrompt(prompt: string): PromptEvaluationResult {
  if (!prompt || prompt.trim().length === 0) {
    return {
      score: 0,
      grade: 'Novice',
      strengths: [],
      missingElements: ['Test requirement description', 'Design pattern specification', 'Connector pane layout', 'Hardware / VISA driver info'],
      dataflowReadiness: 'Poor',
      suggestions: ['Start by describing what your VI should measure or automate and what hardware it talks to.'],
    };
  }

  const lower = prompt.toLowerCase();
  let score = 30; // base for non-empty text
  const strengths: string[] = [];
  const missingElements: string[] = [];
  const suggestions: string[] = [];

  // Check 1: Design pattern or architecture mentioned
  const patterns = ['state machine', 'producer-consumer', 'producer consumer', 'queued message handler', 'qmh', 'actor framework', 'event structure', 'while loop', 'for loop'];
  const hasPattern = patterns.some((p) => lower.includes(p));
  if (hasPattern) {
    score += 15;
    strengths.push('Specifies LabVIEW design pattern or loop architecture');
  } else {
    missingElements.push('Architecture pattern (e.g., State Machine, Producer-Consumer)');
    suggestions.push('Specify whether Nigel AI should use a Queued Message Handler, Producer-Consumer, or Standard State Machine.');
  }

  // Check 2: Connector pane / I/O defined
  const ioTerms = ['connector pane', 'input', 'output', 'terminal', 'subvi', 'cluster', 'typedef', 'enum'];
  const hasIO = ioTerms.some((t) => lower.includes(t));
  if (hasIO) {
    score += 15;
    strengths.push('Defines SubVI connector pane terminals or typedef data structures');
  } else {
    missingElements.push('Explicit connector pane terminal definitions');
    suggestions.push('Detail which parameters go to the top-left, bottom-left (Error In), top-right, and bottom-right (Error Out) terminals.');
  }

  // Check 3: Hardware / instrument / bus
  const hwTerms = ['daqmx', 'visa', 'pxi', 'dmm', 'oscilloscope', 'power supply', 'scpi', 'modbus', 'can', 'gpib', 'serial', 'ethernet', 'tcp', 'crio', 'compactrio'];
  const hasHw = hwTerms.some((h) => lower.includes(h));
  if (hasHw) {
    score += 15;
    strengths.push('Identifies target hardware, communication bus, or driver layer');
  } else {
    missingElements.push('Target instrument / DAQ driver specification');
    suggestions.push('State whether this VI interfaces via NI-DAQmx, NI-VISA SCPI commands, or simulated hardware.');
  }

  // Check 4: Error Handling & Timeouts
  const errorTerms = ['error cluster', 'error in', 'error out', 'timeout', 'exception', 'status code', 'trap'];
  const hasError = errorTerms.some((e) => lower.includes(e));
  if (hasError) {
    score += 15;
    strengths.push('Enforces standard LabVIEW error cluster propagation and timeout behavior');
  } else {
    missingElements.push('Standard Error Cluster handling & timeout bounds');
    suggestions.push('Instruct Nigel AI to wire Error In to Error Out through every subVI and trap timeout codes (e.g. Error 56 or VISA -1073807339).');
  }

  // Check 5: Performance / Concurrency / Memory Rules
  const perfTerms = ['shift register', 'buffer', 'race condition', 'local variable', 'in-place', 'deterministic', 'queue', 'dequeue'];
  const hasPerf = perfTerms.some((p) => lower.includes(p));
  if (hasPerf) {
    score += 10;
    strengths.push('Specifies memory allocation, shift registers, or race condition safeguards');
  } else {
    suggestions.push('Instruct Nigel AI to avoid Local Variables and pre-allocate measurement buffers with Initialize Array.');
  }

  // Length factor
  if (prompt.trim().split(/\s+/).length > 25) {
    score += 10;
    strengths.push('Sufficient detail for deterministic G-code synthesis');
  }

  // Clamp score
  const finalScore = Math.min(100, Math.max(10, score));

  let grade: PromptEvaluationResult['grade'] = 'Novice';
  let dataflowReadiness: PromptEvaluationResult['dataflowReadiness'] = 'Poor';

  if (finalScore >= 85) {
    grade = 'Master CLA';
    dataflowReadiness = 'Production Ready';
  } else if (finalScore >= 70) {
    grade = 'Advanced';
    dataflowReadiness = 'High';
  } else if (finalScore >= 50) {
    grade = 'Competent';
    dataflowReadiness = 'Moderate';
  }

  return {
    score: finalScore,
    grade,
    strengths,
    missingElements,
    dataflowReadiness,
    suggestions,
  };
}
