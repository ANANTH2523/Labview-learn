import React, { useState, useEffect, useRef } from 'react';
import { SIMULATION_LABS } from '../data/labProjects';
import { SimulationLab, BlockDiagramWire, WireType } from '../types';
import { WIRE_SPECS, computePID, computeMovingAverage } from '../utils/labview-engine';
import {
  Play,
  RotateCcw,
  Square,
  Lightbulb,
  Cpu,
  Layers,
  Sliders,
  TrendingUp,
  Activity,
  AlertTriangle,
  Info,
  Zap,
} from 'lucide-react';

interface SimulatorViewProps {
  initialLabId?: string;
  isRunning: boolean;
  setIsRunning: (running: boolean) => void;
  onOpenNigelWithPrompt: (prompt: string) => void;
}

export const SimulatorView: React.FC<SimulatorViewProps> = ({
  initialLabId = 'lab-1',
  isRunning,
  setIsRunning,
  onOpenNigelWithPrompt,
}) => {
  const [selectedLabId, setSelectedLabId] = useState<string>(initialLabId);
  const activeLab: SimulationLab =
    SIMULATION_LABS.find((l) => l.id === selectedLabId) || SIMULATION_LABS[0];

  const [activeTab, setActiveTab] = useState<'both' | 'frontPanel' | 'blockDiagram'>('both');
  const [highlightExecution, setHighlightExecution] = useState<boolean>(true);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [probedWireId, setProbedWireId] = useState<string | null>(null);

  // Front Panel interactive state values
  const [controlsState, setControlsState] = useState<Record<string, any>>({});
  const [chartHistory, setChartHistory] = useState<number[]>([24, 25, 26, 28, 32, 40, 52, 60, 64]);
  const [pidInternal, setPidInternal] = useState({ integralSum: 0, prevError: 0 });
  const [wireValues, setWireValues] = useState<Record<string, any>>({});

  // Reset or initialize when switching labs
  useEffect(() => {
    const initialControls: Record<string, any> = {};
    activeLab.controls.forEach((c) => {
      initialControls[c.id] = c.value;
    });
    setControlsState(initialControls);
    if (activeLab.controls.find((c) => c.type === 'chart')?.history) {
      setChartHistory(activeLab.controls.find((c) => c.type === 'chart')?.history || []);
    }
    setPidInternal({ integralSum: 0, prevError: 0 });
    setWireValues({});
    setActiveStep(0);
  }, [selectedLabId, activeLab]);

  // Main Simulation Loop
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isRunning) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalMs = highlightExecution ? 800 : 200;

    timerRef.current = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 6);

      setControlsState((prev) => {
        const next = { ...prev };
        const newWires: Record<string, any> = {};

        if (activeLab.id === 'lab-1') {
          // Thermal PID Simulation
          const sp = Number(prev['ctrl-sp'] ?? 65);
          const ambient = Number(prev['ctrl-ambient'] ?? 24);
          const kp = Number(prev['ctrl-kp'] ?? 2.2);
          const ki = Number(prev['ctrl-ki'] ?? 0.4);
          const limit = Number(prev['ctrl-alarm-limit'] ?? 90);
          const currentPv = Number(prev['ctrl-pv-temp'] ?? 24);

          // Simulate physical heat exchange: PV moves toward (ambient + heaterDrive * 0.8)
          const currentDrive = Number(prev['ctrl-heater-pwr'] ?? 0);
          const targetTemp = ambient + currentDrive * 0.85;
          const nextPv = currentPv + (targetTemp - currentPv) * 0.15 + (Math.random() - 0.5) * 0.4;
          const roundedPv = Number(nextPv.toFixed(1));

          // Run LabVIEW PID Engine
          const pidResult = computePID(sp, roundedPv, kp, ki, 0.05, 0.5, pidInternal);
          setPidInternal(pidResult.updatedState);

          const alarmActive = roundedPv >= limit;

          next['ctrl-pv-temp'] = roundedPv;
          next['ctrl-heater-pwr'] = pidResult.output;
          next['ctrl-alarm-led'] = alarmActive;

          // Update wire data
          newWires['w-1'] = roundedPv;
          newWires['w-2'] = roundedPv;
          newWires['w-3'] = roundedPv;
          newWires['w-4'] = pidResult.output;
          newWires['w-err-1'] = { status: false, code: 0, source: '' };
          newWires['w-err-2'] = { status: false, code: 0, source: '' };

          setChartHistory((hist) => [...hist.slice(-19), roundedPv]);
        } else if (activeLab.id === 'lab-2') {
          // Producer Consumer
          const amp = Number(prev['ctrl-vibration-amp'] ?? 3.5);
          const noise = (Math.random() - 0.5) * 0.6;
          const peak = Number((amp * Math.sin(Date.now() / 300) + noise).toFixed(2));
          const currentDepth = Math.min(50, Math.max(0, Math.floor(Math.random() * 5)));

          next['ctrl-peak-val'] = Math.abs(peak);
          next['ctrl-queue-depth'] = currentDepth;
          next['ctrl-queue-overflow'] = currentDepth > 35;

          newWires['w-q1'] = `WDT: 10kS/s (Amp ${amp}V)`;
          newWires['w-q2'] = `Dequeued: ${peak}V`;
          newWires['w-q3'] = Math.abs(peak);

          setChartHistory((hist) => [...hist.slice(-19), peak]);
        } else if (activeLab.id === 'lab-3') {
          // SCPI DMM Sweep
          const startV = Number(prev['ctrl-v-start'] ?? 1.0);
          const stopV = Number(prev['ctrl-v-stop'] ?? 5.0);
          const limitI = Number(prev['ctrl-i-limit'] ?? 250);

          const voltageSweepVal = Number((startV + ((Date.now() / 1000) % 5)).toFixed(1));
          const measuredCurrent = Number((voltageSweepVal * 28.5 + (Math.random() - 0.5) * 3).toFixed(1));
          const isPass = measuredCurrent <= limitI;

          next['ctrl-dmm-meas'] = measuredCurrent;
          next['ctrl-test-pass'] = isPass;

          newWires['w-v1'] = 'VISA: GPIB0::14::INSTR';
          newWires['w-v2'] = `APPL ${voltageSweepVal}V`;
          newWires['w-v3'] = `${measuredCurrent} mA`;

          setChartHistory((hist) => [...hist.slice(-19), measuredCurrent]);
        } else {
          // State Machine Lab
          const states = ['Initialize', 'Calibrate', 'Arm', 'Acquire', 'Evaluate', 'Shutdown'];
          const currentStateIndex = activeStep % states.length;
          next['ctrl-curr-state'] = states[currentStateIndex];

          newWires['w-s1'] = states[currentStateIndex];
          newWires['w-s2'] = states[(currentStateIndex + 1) % states.length];
        }

        setWireValues(newWires);
        return next;
      });
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, highlightExecution, activeLab, pidInternal, activeStep]);

  const updateControlValue = (id: string, val: any) => {
    setControlsState((prev) => ({
      ...prev,
      [id]: val,
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Workbench Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-4 shadow-lg">
        {/* Left: Execution Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md ${
              isRunning
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-amber-500/20'
                : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-600/20'
            }`}
          >
            {isRunning ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Abort Execution</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Continuously</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setIsRunning(false);
              setChartHistory([24, 25, 26]);
              setActiveStep(0);
            }}
            title="Reset VI"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Iconic LabVIEW Lightbulb: Execution Highlighting */}
          <button
            onClick={() => setHighlightExecution(!highlightExecution)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              highlightExecution
                ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-sm shadow-amber-500/20'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Execution Highlighting (Trace Data Tokens across Wires)"
          >
            <Lightbulb className={`w-4 h-4 ${highlightExecution ? 'text-amber-400 fill-amber-400/40' : ''}`} />
            <span className="hidden sm:inline">Highlight Execution</span>
          </button>
        </div>

        {/* Center: Lab Project Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium hidden md:inline">VI Project:</span>
          <select
            value={selectedLabId}
            onChange={(e) => setSelectedLabId(e.target.value)}
            className="bg-slate-800 text-slate-100 text-xs font-semibold py-2 px-3 rounded-lg border border-slate-700 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            {SIMULATION_LABS.map((lab) => (
              <option key={lab.id} value={lab.id}>
                {lab.title} ({lab.difficulty})
              </option>
            ))}
          </select>
        </div>

        {/* Right: View Toggles & Nigel Prompt Action */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-slate-800 rounded-lg border border-slate-700 text-xs">
            <button
              onClick={() => setActiveTab('both')}
              className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                activeTab === 'both' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setActiveTab('frontPanel')}
              className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                activeTab === 'frontPanel' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Front Panel
            </button>
            <button
              onClick={() => setActiveTab('blockDiagram')}
              className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                activeTab === 'blockDiagram' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Block Diagram
            </button>
          </div>

          <button
            onClick={() => onOpenNigelWithPrompt(activeLab.nigelPromptExample)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/30 text-xs font-semibold transition-all cursor-pointer"
            title="Send this VI architecture directly to Nigel AI Studio"
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ask Nigel AI to Build</span>
          </button>
        </div>
      </div>

      {/* Lab Context Header */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs text-slate-300">
        <div>
          <span className="font-bold text-amber-400 mr-2">Architecture:</span>
          <span>{activeLab.architecture}</span>
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          <span>Status: {isRunning ? 'Running (Continuous)' : 'Ready / Stopped'}</span>
          <span>·</span>
          <span>Tokens: {highlightExecution ? 'Animated' : 'High Speed'}</span>
          {probedWireId && (
            <span className="text-amber-400 font-semibold">
              Probe #{probedWireId}: {JSON.stringify(wireValues[probedWireId] ?? 'null')}
            </span>
          )}
        </div>
      </div>

      {/* Main Workspace (Front Panel + Block Diagram) */}
      <div
        className={`grid gap-6 ${
          activeTab === 'both'
            ? 'grid-cols-1 lg:grid-cols-12'
            : 'grid-cols-1'
        }`}
      >
        {/* ================= Front Panel (UI) ================= */}
        {(activeTab === 'both' || activeTab === 'frontPanel') && (
          <div
            className={`${
              activeTab === 'both' ? 'lg:col-span-5' : 'w-full'
            } bg-slate-900 border-2 border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col`}
          >
            {/* Front Panel Title Bar (Classic LabVIEW Gray Header) */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-850 px-4 py-2.5 border-b border-slate-700 flex items-center justify-between text-xs text-slate-200 font-bold">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>Front Panel: {activeLab.title}.vi</span>
              </div>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                UI Terminal Layer
              </span>
            </div>

            {/* Front Panel Grid & Controls Canvas */}
            <div className="p-6 bg-slate-950/90 flex-1 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeLab.controls
                  .filter((c) => c.type !== 'chart')
                  .map((control) => {
                    const currentVal = controlsState[control.id] ?? control.value;
                    return (
                      <div
                        key={control.id}
                        className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-inner"
                      >
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold text-slate-300 leading-tight">
                            {control.label}
                          </label>
                          {control.unit && (
                            <span className="text-[10px] text-slate-500 font-mono">
                              [{control.unit}]
                            </span>
                          )}
                        </div>

                        {/* Knob / Slider Control */}
                        {control.type === 'knob' || control.type === 'slider' ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs font-mono text-amber-400">
                              <span>{control.min ?? 0}</span>
                              <span className="font-bold text-sm bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                                {currentVal} {control.unit}
                              </span>
                              <span>{control.max ?? 100}</span>
                            </div>
                            <input
                              type="range"
                              min={control.min ?? 0}
                              max={control.max ?? 100}
                              step={control.step ?? 1}
                              value={currentVal}
                              onChange={(e) => updateControlValue(control.id, parseFloat(e.target.value))}
                              className="w-full accent-amber-500 cursor-pointer"
                            />
                          </div>
                        ) : control.type === 'numericControl' ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min={control.min}
                              max={control.max}
                              step={control.step}
                              value={currentVal}
                              onChange={(e) => updateControlValue(control.id, parseFloat(e.target.value))}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono text-amber-400 focus:outline-none focus:border-amber-500"
                            />
                            {control.unit && (
                              <span className="text-xs text-slate-400 font-mono">{control.unit}</span>
                            )}
                          </div>
                        ) : control.type === 'led' ? (
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-xs text-slate-400 font-mono">
                              Status: {currentVal ? 'ACTIVE' : 'CLEAR'}
                            </span>
                            <div
                              className={`w-6 h-6 rounded-full border-2 transition-all duration-300 shadow-md ${
                                currentVal
                                  ? 'bg-red-500 border-red-300 shadow-red-500/50 animate-pulse'
                                  : 'bg-emerald-950 border-emerald-800 text-slate-600'
                              }`}
                            ></div>
                          </div>
                        ) : control.type === 'gauge' ? (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-mono text-slate-400">
                              <span>Output</span>
                              <span className="font-bold text-amber-400">{currentVal}%</span>
                            </div>
                            <div className="w-full bg-slate-950 rounded-full h-3 p-0.5 border border-slate-800">
                              <div
                                className="bg-gradient-to-r from-amber-500 to-amber-400 h-full rounded-full transition-all duration-300"
                                style={{ width: `${Math.min(100, Math.max(0, currentVal))}%` }}
                              ></div>
                            </div>
                          </div>
                        ) : (
                          // Numeric / String Digital Readout
                          <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-center font-mono text-sm text-emerald-400 font-bold">
                            {currentVal} {control.unit ?? ''}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>

              {/* Front Panel Waveform Chart */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2 shadow-inner">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>Real-Time Waveform Chart (WDT)</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">100ms dt</span>
                </div>

                {/* SVG Chart Visualizer */}
                <div className="h-40 bg-slate-950 rounded-lg border border-slate-800 p-2 relative flex items-end overflow-hidden">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none opacity-20">
                    <div className="w-full border-b border-dashed border-slate-500"></div>
                    <div className="w-full border-b border-dashed border-slate-500"></div>
                    <div className="w-full border-b border-dashed border-slate-500"></div>
                  </div>

                  {/* SVG Polyline */}
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                    {(() => {
                      const min = Math.min(...chartHistory, 0);
                      const max = Math.max(...chartHistory, 100);
                      const range = max - min || 1;
                      const points = chartHistory
                        .map((val, idx) => {
                          const x = (idx / (chartHistory.length - 1 || 1)) * 100;
                          const y = 100 - ((val - min) / range) * 85 - 5;
                          return `${x},${y}`;
                        })
                        .join(' ');
                      return (
                        <>
                          <polyline
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            points={points}
                          />
                        </>
                      );
                    })()}
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= Block Diagram (G-Code Source) ================= */}
        {(activeTab === 'both' || activeTab === 'blockDiagram') && (
          <div
            className={`${
              activeTab === 'both' ? 'lg:col-span-7' : 'w-full'
            } bg-slate-900 border-2 border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col`}
          >
            {/* Block Diagram Header */}
            <div className="bg-gradient-to-r from-slate-850 to-slate-800 px-4 py-2.5 border-b border-slate-700 flex items-center justify-between text-xs text-slate-200 font-bold">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Block Diagram: {activeLab.title}.vi (G Dataflow)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700 font-mono">
                  {highlightExecution ? '💡 Lightbulb Active' : 'Normal Execution'}
                </span>
              </div>
            </div>

            {/* Block Diagram Workspace Canvas (Classic Dot Grid) */}
            <div className="relative p-6 bg-slate-950 flex-1 min-h-[440px] overflow-x-auto select-none">
              {/* Dot Grid Background */}
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
                  backgroundSize: '16px 16px',
                }}
              ></div>

              {/* While Loop Outer Enclosure */}
              <div className="absolute inset-4 border-2 border-slate-700 rounded-xl pointer-events-none">
                <div className="absolute -top-3 left-4 bg-slate-900 px-2 py-0.5 border border-slate-700 rounded text-[10px] font-mono text-amber-400 font-bold flex items-center gap-1">
                  <RotateCcw className="w-3 h-3" />
                  <span>While Loop: Deterministic Dataflow</span>
                </div>
                {/* Loop Condition Terminal */}
                <div className="absolute bottom-2 right-2 bg-red-950 border border-red-700 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                  <span>[Stop If True]</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                </div>
              </div>

              {/* Render Block Diagram Nodes */}
              <div className="relative z-10 space-y-6">
                {activeLab.nodes.map((node) => {
                  const isNodeActive = isRunning && activeStep % 2 === 0;
                  return (
                    <div
                      key={node.id}
                      style={{
                        position: 'absolute',
                        left: `${node.x}px`,
                        top: `${node.y}px`,
                        width: `${node.width}px`,
                      }}
                      className={`rounded-lg border shadow-xl transition-all duration-300 p-2.5 flex flex-col justify-between ${
                        isNodeActive
                          ? 'bg-slate-850 border-amber-400 ring-2 ring-amber-400/20 shadow-amber-500/10'
                          : 'bg-slate-900/95 border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      {/* Node Header */}
                      <div className="flex items-center gap-1.5 pb-1 border-b border-slate-800">
                        <Cpu className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="text-[11px] font-bold text-slate-200 truncate">
                          {node.name}
                        </span>
                      </div>

                      {/* Terminals */}
                      <div className="pt-2 flex justify-between items-center text-[10px] font-mono">
                        {/* Inputs */}
                        <div className="space-y-1">
                          {node.inputs.map((inp) => {
                            const spec = WIRE_SPECS[inp.type as WireType];
                            return (
                              <div key={inp.id} className="flex items-center gap-1 text-slate-400">
                                <span
                                  className="w-2 h-2 rounded-full inline-block"
                                  style={{ backgroundColor: spec?.color || '#fff' }}
                                ></span>
                                <span className="truncate max-w-[50px]">{inp.name}</span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Outputs */}
                        <div className="space-y-1 text-right">
                          {node.outputs.map((out) => {
                            const spec = WIRE_SPECS[out.type as WireType];
                            return (
                              <div key={out.id} className="flex items-center justify-end gap-1 text-slate-300">
                                <span className="truncate max-w-[60px]">{out.name}</span>
                                <span
                                  className="w-2 h-2 rounded-full inline-block"
                                  style={{ backgroundColor: spec?.color || '#fff' }}
                                ></span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* SVG Connections / Wires Overlay */}
                <svg className="absolute inset-0 w-full h-[400px] pointer-events-none z-0">
                  {activeLab.wires.map((wire) => {
                    const fromNode = activeLab.nodes.find((n) => n.id === wire.fromNodeId);
                    const toNode = activeLab.nodes.find((n) => n.id === wire.toNodeId);
                    if (!fromNode || !toNode) return null;

                    const startX = fromNode.x + fromNode.width;
                    const startY = fromNode.y + fromNode.height / 2;
                    const endX = toNode.x;
                    const endY = toNode.y + toNode.height / 2;

                    const midX = (startX + endX) / 2;
                    const pathData = `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;
                    const spec = WIRE_SPECS[wire.type as WireType];

                    const isProbed = probedWireId === wire.id;

                    return (
                      <g key={wire.id} className="pointer-events-auto cursor-pointer" onClick={() => setProbedWireId(wire.id)}>
                        {/* Interactive Click Area */}
                        <path
                          d={pathData}
                          fill="none"
                          stroke="transparent"
                          strokeWidth="16"
                        />
                        {/* The Actual LabVIEW Wire */}
                        <path
                          d={pathData}
                          fill="none"
                          stroke={spec?.color || '#f97316'}
                          strokeWidth={spec?.strokeWidth || 3}
                          strokeDasharray={spec?.dash}
                          className="transition-all"
                        />

                        {/* Execution Highlighting Bubble / Data Token */}
                        {isRunning && highlightExecution && (
                          <circle r="4" fill="#fbbf24" stroke="#000" strokeWidth="1">
                            <animateMotion
                              path={pathData}
                              dur="1.2s"
                              repeatCount="indefinite"
                            />
                          </circle>
                        )}

                        {/* Probe Icon if active */}
                        {isProbed && (
                          <g transform={`translate(${midX - 10}, ${(startY + endY) / 2 - 10})`}>
                            <rect width="20" height="20" rx="4" fill="#f59e0b" stroke="#000" />
                            <text x="10" y="14" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#000">P</text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Wire Color Legend / Cheat Sheet */}
              <div className="absolute bottom-2 left-6 right-6 z-20 bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 flex flex-wrap items-center justify-between gap-3 text-[11px] font-sans">
                <span className="font-bold text-slate-400">G Wire Code:</span>
                {Object.entries(WIRE_SPECS).map(([type, spec]) => (
                  <div key={type} className="flex items-center gap-1.5">
                    <span
                      className="w-3.5 h-1.5 rounded-full"
                      style={{ backgroundColor: spec.color }}
                    ></span>
                    <span className="text-slate-300">{spec.label.split(' ')[0]}</span>
                  </div>
                ))}
                <span className="text-slate-500 text-[10px]">Click wire to attach Probe</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lab Explanation & Exercise Footnote */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs text-slate-300">
        <div className="flex items-center gap-2 font-bold text-white text-sm">
          <Info className="w-4 h-4 text-amber-400" />
          <span>Interactive Experimentation Guide</span>
        </div>
        <p className="leading-relaxed">
          {activeLab.description}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {activeLab.learningObjectives.map((obj, i) => (
            <div key={i} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center font-bold text-[9px] shrink-0">
                {i + 1}
              </span>
              <span>{obj}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
