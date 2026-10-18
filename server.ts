import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini AI client with required telemetry header
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Mentor Chat API
app.post('/api/mentor/chat', async (req, res) => {
  const { persona, message, history, contextTopic } = req.body;

  const systemInstructions: Record<string, string> = {
    professor: `You are Dr. Marcus Vance, Chief LabVIEW Architect and Certified LabVIEW Fellow (CLA).
You teach graphical system design (G language), execution dataflow, subVI design, connector pane standards, error handling, state machines (Queued State Machine, Producer-Consumer, Actor Framework), and memory management in National Instruments LabVIEW.
Tone: Academic, deeply knowledgeable, encouraging, structured, using precise NI terminology (Tunnels, Shift Registers, Feedback Nodes, Clusters, Typedefs, Race Conditions, FGVs).
Provide clear explanations, ASCII block diagrams when illustrating wireflow, and actionable step-by-step guidance.`,
    
    mentor: `You are Elena Rostova, Lead Automated Test Systems Principal Engineer with 15+ years deploying automated test racks (ATE), PXI, CompactRIO, SCPI instrument drivers (Keysight, Rohde & Schwarz, Tektronix), and NI TestStand integrations.
Tone: Pragmatic, production-hardened, focused on test reliability, throughput, calibration, error clusters, telemetry, and automated production testing.
Offer industry-tested best practices and war stories on how to avoid production line downtime.`,

    nigel: `You are Dr. Austin Thorne, National Instruments Generative AI & Automation Prompting Pioneer specializing in Nigel AI for LabVIEW and Test Automation.
Your mission is to teach engineers how to communicate with, prompt, format, and leverage Nigel AI (NI's specialized AI assistant for LabVIEW, test scripts, and instrument workflows).
Explain how to formulate clear VI specifications (Connector Pane signature, Inputs/Outputs, Typedef enum states, Execution timing, Hardware constraints) so Nigel AI generates flaw-free LabVIEW block diagrams and test sequences.
Teach how to detect hallucinations, broken wires, unwired tunnels, and non-deterministic loops in AI-assisted G-code.`,
  };

  const selectedInstruction = systemInstructions[persona] || systemInstructions.professor;

  if (!aiClient) {
    // High-quality expert rule-based fallback response if API key is not present
    const fallbackResponses: Record<string, string> = {
      professor: `Greetings! In LabVIEW, remember the golden rule of G Dataflow: **A node executes if and only if ALL its input data is available**. Unlike text languages with sequential program counters, LabVIEW inherently executes all ready nodes in parallel!

When building robust architectures:
1. **Always pass the Error Cluster** (\`status\`, \`code\`, \`source\`) from the left connector pane to the right. This naturally serializes execution and prevents race conditions.
2. **Use Shift Registers instead of Local Variables**. Local variables create memory copies and introduce unpredictable race conditions when read and written across parallel loops.
3. **State Machine Foundation**: Use a typedef Enum wired into the selector terminal of a Case Structure enclosed in a While Loop with a Shift Register holding the Next State.`,

      mentor: `In production automated test engineering, reliability is king. When automating instruments over VISA or NI-DAQmx:
1. **Initialize once, configure once, loop the read/write, close cleanly in the teardown phase**. Never open and close VISA sessions inside a high-speed measurement loop!
2. **Buffer allocations**: Pre-allocate array buffers before entering a 100kS/s loop using *Initialize Array* rather than dynamically appending with *Build Array* (which forces LabVIEW to reallocate heap memory on every iteration).
3. **Producer-Consumer Architecture**: Keep your data acquisition loop (Producer) completely decoupled from disk logging and UI waveform rendering (Consumer) using NI Queues or Notifiers.`,

      nigel: `Prompting Nigel AI for LabVIEW requires treating your prompt like a Formal Hardware/Software Interface Specification:

1. **Connector Pane Definition**: Explicitly state the top-left, bottom-left, top-right, and bottom-right terminals (e.g. "Create a SubVI with standard 4x2x2x4 connector pane; Input: VISA Resource Name [top-left], Error In [bottom-left]; Output: Waveform Data [top-right], Error Out [bottom-right]").
2. **Architecture Spec**: Direct Nigel AI with the exact design pattern: "Implement using a Queued Message Handler (QMH) with an Enum Typedef holding states [Initialize, ArmTrigger, AcquireSamples, CalculateFFT, CleanUp]".
3. **Constraint Injection**: Specify "No local variables, continuous hardware-timed sampling at 10kS/s, timeout of 5000ms with Error 56 trapping".`,
    };

    return res.json({
      text: fallbackResponses[persona] || fallbackResponses.professor,
      modelUsed: 'offline-expert-knowledge-base',
    });
  }

  try {
    const formattedHistory = Array.isArray(history)
      ? history.slice(-6).map((h: { sender: string; text: string }) => `${h.sender === 'user' ? 'Student' : 'Mentor'}: ${h.text}`).join('\n')
      : '';

    const promptText = `
Context Topic: ${contextTopic || 'General LabVIEW & Test Automation'}

Conversation History:
${formattedHistory}

Student Question:
${message}

Please provide a deep, pedagogically clear, and structured response with practical LabVIEW examples, wire/terminal explanations, and actionable guidance:
`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction: selectedInstruction,
        temperature: 0.7,
      },
    });

    const text = response.text || 'Dr. Vance: I received your query. Let us examine the dataflow principles behind this requirement.';
    res.json({ text, modelUsed: 'gemini-3.8-flash' });
  } catch (error) {
    console.error('Error generating mentor response:', error);
    res.status(500).json({
      error: 'Mentor AI encountered a temporary issue. Switching to LabVIEW knowledge base.',
      text: 'Dr. Vance: I apologize for the brief communication glitch. In LabVIEW, always verify that your connector pane is wired properly and that all tunnels are wired in all cases of your Case Structures.',
    });
  }
});

// Nigel AI Prompt Evaluation & G-Code Blueprint Generator API
app.post('/api/nigel/assist', async (req, res) => {
  const { testRequirement, targetHardware, architecturePattern, promptDraft } = req.body;

  if (!aiClient) {
    // Deterministic blueprint fallback
    return res.json({
      score: 88,
      critique: 'Solid prompt structure. Hardware specification is clear, but error timeout handling and connector pane layout should be explicitly mentioned to ensure Nigel AI outputs production-ready G-code.',
      optimizedPrompt: `Design a National Instruments LabVIEW SubVI for ${testRequirement || 'Automated Voltage Sweep and Limit Verification'}.
Target Hardware: ${targetHardware || 'NI PXIe-4139 SMU + NI-VISA DMM'}
Design Pattern: ${architecturePattern || 'Standard State Machine with Typedef Enum'}

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
        pattern: architecturePattern || 'State Machine',
        states: ['Initialize', 'Configure Limits', 'Sweep Loop', 'Evaluate Limits', 'Log to TDMS', 'Teardown'],
        keyNodes: ['DAQmx Create Virtual Channel', 'DAQmx Timing (Sample Clock)', 'While Loop with Shift Register', 'Case Structure', 'Unbundle by Name', 'Format Into String', 'DAQmx Clear Task'],
        pitfallAlert: 'Watch for unwired tunnels in the False case of limit evaluation; ensure default value is not used implicitly without explicit logic.',
      },
      modelUsed: 'offline-labview-architect',
    });
  }

  try {
    const promptText = `
You are the Lead Nigel AI Specialist for National Instruments LabVIEW test automation.
The student wants to prompt Nigel AI to generate or automate a LabVIEW VI / automated test workflow.

Student's Test Requirement: ${testRequirement || 'Automated multi-channel voltage logging and limit check'}
Target Hardware / Protocol: ${targetHardware || 'NI-DAQmx USB-6361 / VISA SCPI'}
Preferred Architecture: ${architecturePattern || 'Producer-Consumer (Queued Data)'}
User's Current Prompt Draft: "${promptDraft || ''}"

Evaluate the student's prompt and produce a comprehensive Nigel AI Master Blueprint in valid JSON with:
1. "score" (number from 0 to 100 rating prompt clarity for LabVIEW generation)
2. "critique" (string explaining strengths, ambiguities, and potential G-code pitfalls)
3. "optimizedPrompt" (the perfected, professional prompt ready to feed into Nigel AI)
4. "blockDiagramBlueprint": {
     "pattern": string,
     "states": array of strings,
     "keyNodes": array of strings,
     "pitfallAlert": string
   }
5. "trainingLesson": (string explanation of why this prompt structure produces superior G-code dataflow)
`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ ...parsed, modelUsed: 'gemini-3.8-flash' });
  } catch (error) {
    console.error('Error generating Nigel assist:', error);
    res.status(500).json({ error: 'Failed to evaluate Nigel prompt.' });
  }
});

// Setup Vite middlewares in dev mode, or serve static build in production
async function start() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[LabVIEW Academy] Full-stack Server running at http://0.0.0.0:${PORT}`);
  });
}

start();
