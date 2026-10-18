import React from 'react';
import {
  GraduationCap,
  Cpu,
  Sparkles,
  MessageSquare,
  Award,
  BookOpen,
  Monitor,
  Zap,
  Library,
} from 'lucide-react';

export type ActiveTab = 'curriculum' | 'simulator' | 'nigel' | 'mentor' | 'tracker' | 'exam' | 'osGuide' | 'resources';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isRunning: boolean;
  onRunToggle: () => void;
  hasGeminiKey: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isRunning,
  onRunToggle,
  hasGeminiKey,
}) => {
  const tabs = [
    { id: 'curriculum', label: 'Curriculum', icon: GraduationCap },
    { id: 'simulator', label: 'Workbench', icon: Cpu },
    { id: 'nigel', label: 'Nigel AI Studio', icon: Sparkles },
    { id: 'mentor', label: 'AI Mentors', icon: MessageSquare },
    { id: 'tracker', label: 'Cert Tracker', icon: Award },
    { id: 'exam', label: 'Exam Prep', icon: BookOpen },
    { id: 'resources', label: 'Resource Library', icon: Library },
    { id: 'osGuide', label: 'OS Setup', icon: Monitor },
  ] as const;

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black text-lg tracking-tighter">
              G
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-white">LabVIEW Academy</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-medium border border-amber-500/20">
                  Nigel AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden xl:block">
                Graphical System Design & Automated Test Engineering
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 overflow-x-auto py-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Status & Quick Action */}
          <div className="flex items-center gap-2.5 shrink-0">
            {hasGeminiKey ? (
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-1 rounded-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Gemini 3.8 Live</span>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-800/60 border border-slate-700/50 px-2 py-1 rounded-md">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>CLA Knowledge Base</span>
              </div>
            )}

            <button
              onClick={onRunToggle}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border transition-all cursor-pointer ${
                isRunning
                  ? 'bg-red-500/10 border-red-500/40 text-red-400 hover:bg-red-500/20'
                  : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{isRunning ? 'Halt VI' : 'Run VI'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
