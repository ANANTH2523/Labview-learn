import React, { useState } from 'react';
import { OS_GUIDES, OSGuidePlatform } from '../data/osGuideData';
import {
  Monitor,
  Apple,
  Terminal,
  CheckCircle2,
  Copy,
  Check,
  AlertTriangle,
  Lightbulb,
  Keyboard,
  HardDrive,
  Cpu,
} from 'lucide-react';

export const OSGuideView: React.FC = () => {
  const [selectedOS, setSelectedOS] = useState<'windows' | 'mac' | 'linux'>('windows');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const guide: OSGuidePlatform = OS_GUIDES[selectedOS];

  const copyCommand = (cmd: string, index: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950/40 rounded-2xl border border-slate-800 p-6 sm:p-8 relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
            <Monitor className="w-4 h-4" />
            <span>Cross-Platform Deployment & Environment Guide</span>
            <span className="text-slate-500">·</span>
            <span>Windows · macOS · Linux</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            LabVIEW Across Windows, macOS & Linux
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Understand how to install, configure, and operate National Instruments software, hardware drivers (NI-DAQmx, VISA, SCPI), and automated test sequences across all major operating systems.
          </p>
        </div>
      </div>

      {/* OS Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { id: 'windows', name: 'Microsoft Windows', icon: Monitor, sub: 'Tier 1 NI Flagship', color: 'hover:border-sky-500' },
          { id: 'mac', name: 'Apple macOS', icon: Apple, sub: 'Apple Silicon & Intel', color: 'hover:border-slate-300' },
          { id: 'linux', name: 'Linux & NI Linux RT', icon: Terminal, sub: 'Ubuntu · RHEL · cRIO', color: 'hover:border-amber-500' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = selectedOS === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedOS(tab.id as 'windows' | 'mac' | 'linux')}
              className={`text-left p-5 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                isSelected
                  ? 'bg-slate-900 border-sky-500 shadow-xl shadow-sky-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:bg-slate-850'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-md ${
                  isSelected ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{tab.name}</h3>
                <p className="text-xs text-sky-400 font-medium mt-0.5">{tab.sub}</p>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  {isSelected ? 'Currently Viewing' : 'Click to inspect'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Platform Detail Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Installation Guide & Driver Matrix (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Platform Summary Banner */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                  {guide.badge}
                </span>
                <h2 className="text-xl font-bold text-white mt-1">{guide.name}</h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">{guide.driverSupport}</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {guide.tagline}
            </p>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Primary Test & Automation Roles:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {guide.primaryUseCases.map((useCase, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-850 text-xs text-slate-300 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                    <span>{useCase}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Installation Walkthrough */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-sky-400" />
              <span>{guide.installationGuide.title}</span>
            </h3>

            <div className="space-y-2.5">
              {guide.installationGuide.steps.map((step, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3 text-xs text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-sky-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </div>
              ))}
            </div>

            {/* Terminal Commands if applicable (Mac / Linux) */}
            {guide.installationGuide.terminalCommands && (
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Terminal Setup Commands:
                </span>
                <div className="space-y-1.5 font-mono text-xs">
                  {guide.installationGuide.terminalCommands.map((cmd, i) => (
                    <div
                      key={i}
                      className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between text-slate-300 group"
                    >
                      <span className="truncate pr-2">{cmd}</span>
                      {!cmd.startsWith('#') && (
                        <button
                          onClick={() => copyCommand(cmd, i)}
                          className="text-slate-500 hover:text-white p-1 cursor-pointer shrink-0"
                          title="Copy command"
                        >
                          {copiedIndex === i ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Warning */}
            <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs text-amber-200 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{guide.installationGuide.pitfallWarning}</span>
            </div>
          </div>

          {/* Driver Compatibility Matrix */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-sky-400" />
              <span>National Instruments Hardware Driver Matrix</span>
            </h3>

            <div className="space-y-2">
              {guide.driverMatrix.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <span className="text-xs font-bold text-white block">{item.driver}</span>
                    <span className="text-[11px] text-slate-400">{item.notes}</span>
                  </div>
                  <span
                    className={`text-[10px] px-2.5 py-1 rounded-md font-semibold shrink-0 self-start sm:self-center ${
                      item.status.includes('Native')
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : item.status.includes('Requires')
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Keyboard Shortcuts & Expert Tips (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Keyboard Shortcuts Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-sky-400" />
                <span>{guide.name} Shortcuts</span>
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">Productivity Booster</span>
            </div>

            <div className="space-y-2">
              {guide.shortcuts.map((sc, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-white block">{sc.action}</span>
                    <span className="text-[11px] text-slate-400 leading-tight block">
                      {sc.description}
                    </span>
                  </div>
                  <kbd className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-sky-300 font-mono text-[11px] font-bold shrink-0 shadow-sm">
                    {sc.keyCombo}
                  </kbd>
                </div>
              ))}
            </div>
          </div>

          {/* Expert Pro Tips */}
          <div className="bg-gradient-to-br from-slate-900 to-sky-950/30 border border-sky-800/40 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              <span>Architect Pro-Tips for {guide.name}</span>
            </h3>

            <div className="space-y-3">
              {guide.expertTips.map((tip, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-950/80 border border-sky-900/40 text-xs text-slate-200 leading-relaxed flex items-start gap-2.5">
                  <span className="text-sky-400 font-bold">›</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
