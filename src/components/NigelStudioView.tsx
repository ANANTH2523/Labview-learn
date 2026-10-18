import React, { useState } from 'react';
import { NIGEL_PROMPT_TEMPLATES } from '../data/nigelTemplates';
import { evaluateNigelPrompt, PromptEvaluationResult } from '../utils/nigel-evaluator';
import type { NigelBlueprintResult } from '../types';
import {
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Send,
  Layers,
  Cpu,
  BookOpen,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface NigelStudioViewProps {
  initialPrompt?: string;
  onOpenLab: (labId: string) => void;
}

export const NigelStudioView: React.FC<NigelStudioViewProps> = ({
  initialPrompt = '',
  onOpenLab,
}) => {
  const [promptText, setPromptText] = useState<string>(
    initialPrompt ||
      `Design an automated SCPI test sequencer in LabVIEW for an Agilent 34401A DMM and Keithley 2400 SourceMeter over NI-VISA.
Architecture: Queued Message Handler with Typedef Enum for states [Init, Configure, Sweep, CheckLimits, LogTDMS, CleanUp].
Connector Pane: Input VISA Resource Names top-left, Error In bottom-left, Output Telemetry Cluster top-right, Error Out bottom-right.
Trap VISA timeout error -1073807339 and pre-allocate measurement arrays using Initialize Array to prevent memory fragmentation.`
  );

  const [hardware, setHardware] = useState<string>('NI-VISA / SCPI + NI-DAQmx');
  const [architecture, setArchitecture] = useState<string>('Queued Message Handler (QMH)');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [blueprintResult, setBlueprintResult] = useState<NigelBlueprintResult | null>(null);

  // Live client-side evaluation
  const liveEval: PromptEvaluationResult = evaluateNigelPrompt(promptText);

  const handleGenerateBlueprint = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/nigel/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testRequirement: promptText,
          targetHardware: hardware,
          architecturePattern: architecture,
          promptDraft: promptText,
        }),
      });

      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();
      setBlueprintResult(data);
    } catch (err) {
      console.error(err);
      // Fallback result
      setBlueprintResult({
        score: liveEval.score,
        critique: 'Prompt provides good structural guidelines. Be sure to instruct Nigel AI to explicitly enforce error cluster bypass on all subVIs.',
        optimizedPrompt: promptText,
        blockDiagramBlueprint: {
          pattern: architecture,
          states: ['Initialize', 'Configure Hardware', 'Acquisition Loop', 'Limit Evaluation', 'TDMS Log', 'Teardown'],
          keyNodes: ['VISA Open', 'VISA Write/Read', 'While Loop with Shift Register', 'In Range and Coerce', 'TDMS Write', 'VISA Close'],
          pitfallAlert: 'Ensure VISA sessions are closed in the Teardown state even if a timeout error occurs mid-sweep.',
        },
        modelUsed: 'offline-labview-architect',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.warn('Clipboard unavailable:', err);
      return;
    }
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950/40 rounded-2xl border border-slate-800 p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span>National Instruments Generative AI</span>
            <span className="text-slate-500">·</span>
            <span>Nigel AI Prompt Engineering & Automation Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Nigel AI Co-Pilot & Prompt Training Studio
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Learn the exact science of communicating with Nigel AI for National Instruments LabVIEW. Formulate certified G-code specifications, audit AI proposals for unwired tunnels or race conditions, and generate production test bench blueprints.
          </p>
        </div>
      </div>

      {/* Preset Automation Templates */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Industrial Test Bench Templates
          </h2>
          <span className="text-xs text-slate-500">Click to load standard prompt</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {NIGEL_PROMPT_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => {
                setPromptText(tmpl.samplePrompt);
                setHardware(tmpl.hardware);
                setArchitecture(tmpl.architecture);
                setBlueprintResult(null);
              }}
              className="text-left p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850/80 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                  {tmpl.complexity}
                </span>
                <h3 className="text-xs font-bold text-white mt-2 line-clamp-1">
                  {tmpl.title}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  {tmpl.description}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-500 font-mono">
                {tmpl.architecture.split(' ')[0]}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Prompting Workspace (Two Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Prompt Crafting & Live Scorecard (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Nigel AI Prompt Specification</span>
              </label>
              <button
                onClick={() => copyToClipboard(promptText)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedPrompt ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Prompt</span>
                  </>
                )}
              </button>
            </div>

            <textarea
              rows={9}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Describe your LabVIEW automated test requirement in detail (e.g. target hardware, connector pane signature, design pattern, error handling)..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500 leading-relaxed resize-y"
            />
          </div>

          {/* Quick Hardware & Architecture Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1.5">Target Hardware / Bus</label>
              <input
                type="text"
                value={hardware}
                onChange={(e) => setHardware(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1.5">Preferred Architecture</label>
              <input
                type="text"
                value={architecture}
                onChange={(e) => setArchitecture(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          {/* Live Heuristic Scorecard */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Nigel Prompt Quality Score</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-black text-emerald-400">{liveEval.score}/100</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Grade: {liveEval.grade}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-500">Dataflow Readiness</span>
                <div className="text-xs font-bold text-slate-200 mt-0.5">
                  {liveEval.dataflowReadiness}
                </div>
              </div>
            </div>

            {/* Strengths */}
            {liveEval.strengths.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                  Verified Invariants:
                </span>
                <div className="space-y-1">
                  {liveEval.strengths.map((str, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{str}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Elements / Suggestions */}
            {liveEval.suggestions.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-slate-850">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  Recommendations to Improve G-Code Generation:
                </span>
                <div className="space-y-1">
                  {liveEval.suggestions.map((sug, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                      <span className="text-amber-400 font-bold">›</span>
                      <span>{sug}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={handleGenerateBlueprint}
            disabled={isGenerating || promptText.trim().length === 0}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                <span>Synthesizing Nigel AI Blueprint...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-current" />
                <span>Generate Nigel AI G-Code Blueprint</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Synthesis Blueprint & Training Rules (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Blueprint Output Box */}
          {blueprintResult ? (
            <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-6 space-y-5 shadow-2xl animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                  <h3 className="text-sm font-bold text-white">Nigel AI Architecture Blueprint</h3>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                  Score {blueprintResult.score}/100
                </span>
              </div>

              {/* Critique */}
              {blueprintResult.critique && (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <span className="font-bold text-amber-400 block mb-1">Architectural Critique:</span>
                  {blueprintResult.critique}
                </div>
              )}

              {/* Blueprint States & Key Nodes */}
              {blueprintResult.blockDiagramBlueprint && (
                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <span className="text-slate-400 font-sans font-bold text-[11px] block mb-1">State Machine States:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {blueprintResult.blockDiagramBlueprint.states?.map((st: string, idx: number) => (
                        <span key={idx} className="px-2 py-1 rounded bg-slate-800 text-amber-300 border border-slate-700 text-[11px]">
                          {idx + 1}. {st}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="text-slate-400 font-sans font-bold text-[11px] block mb-1">Essential G Nodes:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {blueprintResult.blockDiagramBlueprint.keyNodes?.map((kn: string, idx: number) => (
                        <span key={idx} className="px-2 py-1 rounded bg-slate-950 text-slate-300 border border-slate-800 text-[11px]">
                          {kn}
                        </span>
                      ))}
                    </div>
                  </div>

                  {blueprintResult.blockDiagramBlueprint.pitfallAlert && (
                    <div className="p-3 rounded-lg bg-red-950/30 border border-red-800/40 text-red-300 text-xs flex items-start gap-2 font-sans">
                      <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <span>{blueprintResult.blockDiagramBlueprint.pitfallAlert}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Optimized Prompt Output */}
              {blueprintResult.optimizedPrompt && (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">Production Ready Prompt:</span>
                    <button
                      onClick={() => copyToClipboard(blueprintResult.optimizedPrompt)}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </button>
                  </div>
                  <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-[11px] font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap max-h-48 leading-relaxed">
                    {blueprintResult.optimizedPrompt}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                <span>The 5 Rules of Nigel AI Prompting</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                National Instruments Nigel AI translates textual specifications into compiled graphical dataflow nodes. Follow these rules to guarantee deterministic G-code:
              </p>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-white block">1. Enforce Connector Pane (4x2x2x4)</span>
                  <span className="text-slate-400">Explicitly assign reference and Error In on left; data and Error Out on right.</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-white block">2. Prohibit Local Variables</span>
                  <span className="text-slate-400">Instruct Nigel to propagate loop states through Shift Registers to eliminate race conditions.</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-white block">3. Specify Exact Hardware Driver</span>
                  <span className="text-slate-400">Clarify NI-DAQmx, NI-VISA SCPI, or NI-XNET CAN bus sessions.</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-white block">4. Error Cluster Flow</span>
                  <span className="text-slate-400">Require all SubVIs to bypass execution when Error In status is TRUE.</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-white block">5. Memory Buffer Pre-Allocation</span>
                  <span className="text-slate-400">Pre-allocate arrays with Initialize Array outside high-speed acquisition loops.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
