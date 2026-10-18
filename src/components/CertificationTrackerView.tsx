import React, { useState } from 'react';
import {
  CERTIFICATION_SKILLS,
  CertificationSkill,
  calculateTierReadiness,
  generateReadinessReport,
  getRecommendedLessonsForNextTier,
  calculateDomainProficiency,
  DomainProficiency,
} from '../utils/certification-tracker';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend,
} from 'recharts';
import {
  Award,
  CheckCircle2,
  Clock,
  Play,
  BookOpen,
  ArrowRight,
  Sparkles,
  Layers,
  Cpu,
  ShieldCheck,
  Filter,
  Flame,
  Printer,
  ChevronRight,
  Compass,
  Zap,
  HelpCircle,
  Activity,
  Sliders,
  Lightbulb,
  RotateCcw,
  X,
} from 'lucide-react';

interface CertificationTrackerViewProps {
  completedLabIds: Set<string>;
  completedSkillIds: Set<string>;
  onToggleSkill: (skillId: string) => void;
  onToggleLab?: (labId: string) => void;
  onOpenLab: (labId: string) => void;
  onOpenLesson: (lessonId: string) => void;
  onOpenExam: (tier: 'CLAD' | 'CLD' | 'CLA') => void;
  onOpenZeroToPro?: () => void;
  onOpenResourceLibrary?: () => void;
  onResetProgress?: () => void;
}

export const CertificationTrackerView: React.FC<CertificationTrackerViewProps> = ({
  completedLabIds,
  completedSkillIds,
  onToggleSkill,
  onToggleLab,
  onOpenLab,
  onOpenLesson,
  onOpenExam,
  onOpenZeroToPro,
  onOpenResourceLibrary,
  onResetProgress,
}) => {
  const [selectedTierFilter, setSelectedTierFilter] = useState<'ALL' | 'CLAD' | 'CLD' | 'CLA'>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'ALL' | 'MASTERED' | 'PENDING'>('ALL');
  const [gapTierFilter, setGapTierFilter] = useState<'AUTO' | 'CLAD' | 'CLD' | 'CLA'>('AUTO');
  const [selectedDomainCard, setSelectedDomainCard] = useState<string | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState<boolean>(false);

  const readiness = calculateTierReadiness(completedSkillIds, completedLabIds);
  const readinessReport = generateReadinessReport(readiness);
  const gapAnalysis = getRecommendedLessonsForNextTier(
    completedSkillIds,
    completedLabIds,
    gapTierFilter === 'AUTO' ? undefined : gapTierFilter
  );
  const domainProficiencies = calculateDomainProficiency(completedSkillIds, completedLabIds);


  // Labs to Competencies summary
  const labMappings = [
    {
      labId: 'lab-1',
      title: 'Lab 1: Thermal Acquisition & PID Control System',
      tierFocus: 'CLAD & CLA',
      skillsCovered: ['G Dataflow & Execution Order', 'Shift Registers & Feedback Nodes', 'Data Types & Coercion Dots', 'NI-DAQmx Continuous Hardware Timing'],
      difficulty: 'Beginner',
    },
    {
      labId: 'lab-2',
      title: 'Lab 2: High-Speed Producer-Consumer / QMH Bench',
      tierFocus: 'CLD & CLA',
      skillsCovered: ['Producer-Consumer Architecture', 'Race Condition Elimination', 'Nigel AI Prompting & G-Code Audit Engineering'],
      difficulty: 'Intermediate',
    },
    {
      labId: 'lab-3',
      title: 'Lab 3: Automated Instrument SCPI Voltage Sweep Bench',
      tierFocus: 'CLAD & CLA',
      skillsCovered: ['4x2x2x4 Connector Panes & SubVIs', 'Standard Error Cluster Flow', 'Instrument Automation via NI-VISA & SCPI', 'Automated Test Equipment (ATE) & TestStand'],
      difficulty: 'Advanced',
    },
    {
      labId: 'lab-4',
      title: 'Lab 4: Robust Standard State Machine (SSM)',
      tierFocus: 'CLAD & CLD',
      skillsCovered: ['Mechanical Actions of Booleans', 'Standard State Machine (SSM)', 'Event-Driven UI Programming'],
      difficulty: 'Intermediate',
    },
  ];

  const filteredSkills = CERTIFICATION_SKILLS.filter((skill) => {
    if (selectedTierFilter !== 'ALL' && skill.tier !== selectedTierFilter) return false;
    const isMastered = completedSkillIds.has(skill.id) || completedLabIds.has(skill.mappedLabId);
    if (selectedStatusFilter === 'MASTERED' && !isMastered) return false;
    if (selectedStatusFilter === 'PENDING' && isMastered) return false;
    return true;
  });

  const totalSkillsCount = CERTIFICATION_SKILLS.length;
  const totalMasteredCount = CERTIFICATION_SKILLS.filter(
    (s) => completedSkillIds.has(s.id) || completedLabIds.has(s.mappedLabId)
  ).length;
  const overallPercentage = Math.round((totalMasteredCount / totalSkillsCount) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950/40 rounded-2xl border border-slate-800 p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
              <Award className="w-4 h-4" />
              <span>National Instruments Official Competency Map</span>
              <span className="text-slate-500">·</span>
              <span>CLAD · CLD · CLA</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              LabVIEW Certification Tracker
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Track your verified mastery toward Certified LabVIEW Associate Developer (CLAD), Certified LabVIEW Developer (CLD), and Certified LabVIEW Architect (CLA). Every completed lab unlocks verified exam competencies.
            </p>
          </div>

          {/* Overall Gauge */}
          <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-5 min-w-[260px] space-y-3 shadow-xl">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Overall NI Readiness</span>
              <span className="text-amber-400 font-bold">{overallPercentage}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${overallPercentage}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span>{totalMasteredCount} of {totalSkillsCount} Competencies</span>
              <span className="text-slate-300 font-semibold">Tier: {readiness.CLAD.percentage >= 80 ? 'CLD' : 'CLAD'}</span>
            </div>

            {onResetProgress && (
              <button
                onClick={() => setIsResetConfirmOpen(true)}
                className="w-full mt-2 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors border border-slate-750 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3 text-amber-400" />
                <span>Reset Competency Baseline</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Zero Knowledge to Pro Academy Quick Launcher Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-amber-500/30 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl relative overflow-hidden">
        <div className="flex items-start sm:items-center gap-3.5 z-10">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                Zero-to-Pro Foundation
              </span>
              <span className="text-xs text-slate-400 font-medium">· LabVIEW 101 Guide</span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">
              New to LabVIEW? Learn What LabVIEW Software Is Step-by-Step
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl mt-0.5 leading-relaxed">
              Understand the two-window rule (Front Panel vs Block Diagram), how graphical G dataflow runs in parallel without code threads, wire colors, and follow the 7-step practical ladder to become a certified pro.
            </p>
          </div>
        </div>

        {onOpenZeroToPro && (
          <button
            onClick={onOpenZeroToPro}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-500/10 cursor-pointer shrink-0 z-10"
          >
            <BookOpen className="w-4 h-4" />
            <span>Launch Zero-to-Pro Guide</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 3 Tier Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {(['CLAD', 'CLD', 'CLA'] as const).map((tierKey) => {
          const tier = readiness[tierKey];
          const isExamReady = tier.percentage >= 80;
          return (
            <div
              key={tierKey}
              className={`rounded-2xl border p-6 flex flex-col justify-between space-y-4 transition-all shadow-xl ${
                isExamReady
                  ? 'bg-slate-900 border-emerald-500/50 shadow-emerald-500/5'
                  : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2.5 py-1 rounded font-bold uppercase tracking-wider ${
                        tierKey === 'CLAD'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : tierKey === 'CLD'
                          ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {tierKey}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{tier.badge.split(' ')[0]}</span>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                      isExamReady
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : tier.percentage >= 50
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {tier.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">{tier.title}</h3>
                <p className="text-xs text-slate-400 mt-1">
                  {tierKey === 'CLAD'
                    ? 'Foundations: Dataflow, SubVIs, Loops & Booleans'
                    : tierKey === 'CLD'
                    ? 'Architecture: State Machines, Queues & Events'
                    : 'Architect: High-Speed ATE, VISA SCPI & Nigel AI'}
                </p>
              </div>

              {/* Progress Metric */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">
                    {tier.completedSkills} / {tier.totalSkills} Skills Mastered
                  </span>
                  <span className="font-extrabold text-amber-400 text-sm">{tier.percentage}%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-850">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      tierKey === 'CLAD'
                        ? 'bg-amber-400'
                        : tierKey === 'CLD'
                        ? 'bg-sky-400'
                        : 'bg-emerald-400'
                    }`}
                    style={{ width: `${tier.percentage}%` }}
                  ></div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => onOpenExam(tierKey)}
                    className="text-xs text-slate-300 hover:text-white flex items-center gap-1 font-semibold transition-colors cursor-pointer"
                  >
                    <span>Practice {tierKey} Exam</span>
                    <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                  </button>

                  <span className="text-[10px] text-slate-500 font-mono">Passing: 70%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Executive Readiness Report */}
      <div className="bg-gradient-to-r from-slate-900 to-amber-950/20 border border-slate-800 rounded-2xl p-6 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Certification Advisory Assessment</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
          {readinessReport.summary}
        </p>
        <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl text-xs text-slate-300 flex items-start gap-2">
          <span className="font-bold text-amber-400 shrink-0">Recommended Action:</span>
          <span>{readinessReport.recommendation}</span>
        </div>
      </div>

      {/* Core Domain Proficiency Radar Chart (Dataflow, Architecture, Hardware Interfacing, UI Design) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>Competency Radar</span>
              </span>
              <span className="text-xs text-slate-400 font-medium">· Multi-Domain Proficiency Analysis</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              LabVIEW Core Domain Proficiency Radar
            </h2>
            <p className="text-xs text-slate-300">
              Visualizes your mastery across core LabVIEW domains: Dataflow, Architecture, Hardware Interfacing, and UI Design based on completed skills. Benchmark line (80%) reflects official NI developer certification standard.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onOpenResourceLibrary && (
              <button
                onClick={onOpenResourceLibrary}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-750 transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>Browse Whitepapers & Docs</span>
              </button>
            )}

            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-3 text-right">
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">Disciplines at Benchmark</span>
                <span className="text-base font-bold text-amber-400">
                  {domainProficiencies.filter((d) => d.proficiency >= 80).length} of {domainProficiencies.length} Passed (80%+)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Radar Chart & Domain Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Radar Chart Viewport */}
          <div className="lg:col-span-5 bg-slate-950/80 border border-slate-850 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[350px] relative shadow-inner">
            <div className="w-full flex items-center justify-between px-2 text-xs text-slate-400 mb-2">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                <span>Active Profile</span>
              </span>
              <span className="font-mono text-[11px] text-slate-500">Live Recharts Vector</span>
            </div>

            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="68%"
                  data={domainProficiencies.map((d) => ({
                    domain: d.domain,
                    proficiency: d.proficiency,
                    benchmark: d.benchmark,
                    fullName: d.fullName,
                    mastered: `${d.masteredCount} of ${d.totalCount}`,
                  }))}
                >
                  <PolarGrid stroke="#334155" strokeDasharray="3 3" />
                  <PolarAngleAxis
                    dataKey="domain"
                    tick={{ fill: '#f8fafc', fontSize: 11, fontWeight: 700 }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    stroke="#475569"
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                  />
                  <Radar
                    name="Your Verified Proficiency (%)"
                    dataKey="proficiency"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.45}
                    strokeWidth={2.5}
                    isAnimationActive={true}
                  />
                  <Radar
                    name="NI Cert Target Benchmark (80%)"
                    dataKey="benchmark"
                    stroke="#38bdf8"
                    strokeDasharray="4 4"
                    fill="#38bdf8"
                    fillOpacity={0.06}
                    strokeWidth={1.5}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload as any;
                        return (
                          <div className="bg-slate-950/95 border border-slate-700 p-3 rounded-xl shadow-2xl text-xs space-y-1.5 min-w-[210px] backdrop-blur-md">
                            <div className="font-bold text-white border-b border-slate-800 pb-1 text-sm">
                              {item.domain}
                            </div>
                            <div className="text-slate-400 text-[11px]">{item.fullName}</div>
                            <div className="flex items-center justify-between text-amber-400 font-semibold pt-1">
                              <span>Proficiency:</span>
                              <span className="font-bold text-sm">{item.proficiency}%</span>
                            </div>
                            <div className="flex items-center justify-between text-sky-400 text-[11px]">
                              <span>NI Benchmark:</span>
                              <span className="font-mono">{item.benchmark}%</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-400 text-[11px]">
                              <span>Mastered Skills:</span>
                              <span className="font-mono text-slate-200">{item.mastered}</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                    iconType="circle"
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="text-[11px] text-slate-500 font-mono text-center mt-1">
              *Toggling completed skills or labs dynamically recalculates the polygon shape.
            </div>
          </div>

          {/* Interactive Domain Discipline Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {domainProficiencies.map((d) => {
              const isMet = d.proficiency >= 80;
              const isHalf = d.proficiency >= 50;
              return (
                <div
                  key={d.domain}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                    isMet
                      ? 'bg-slate-950 border-emerald-500/40 shadow-emerald-500/5'
                      : 'bg-slate-950 border-slate-850 hover:border-amber-500/40'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        {d.domain === 'Dataflow' && <Zap className="w-3.5 h-3.5 text-amber-400" />}
                        {d.domain === 'Architecture' && <Layers className="w-3.5 h-3.5 text-sky-400" />}
                        {d.domain === 'Hardware Interfacing' && <Cpu className="w-3.5 h-3.5 text-emerald-400" />}
                        {d.domain === 'UI Design' && <Sliders className="w-3.5 h-3.5 text-pink-400" />}
                        <span>{d.domain}</span>
                      </span>

                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                          isMet
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : isHalf
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {d.proficiency}%
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-snug">
                      {d.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          isMet
                            ? 'bg-emerald-400'
                            : isHalf
                            ? 'bg-amber-400'
                            : 'bg-sky-400'
                        }`}
                        style={{ width: `${d.proficiency}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                      <span className="font-mono">{d.masteredCount} / {d.totalCount} Skills Mastered</span>
                      <span className={isMet ? 'text-emerald-400 font-semibold' : 'text-slate-500'}>
                        {isMet ? 'Benchmark Met' : 'Target: 80%'}
                      </span>
                    </div>

                    {/* Key topics mini pills */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {d.keyTopics.slice(0, 3).map((topic, i) => (
                        <span
                          key={i}
                          className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-850 font-mono"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>


      {/* Recommended Lessons to Fill Specific Certification Gaps */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {gapAnalysis.targetTierBadge}
              </span>
              <span className="text-xs text-slate-400 font-medium">· Gap Analysis</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Recommended Lessons to Fill Specific Certification Gaps
            </h2>
            <p className="text-xs text-slate-300">
              {gapAnalysis.missingSkillsCount > 0
                ? `You have ${gapAnalysis.missingSkillsCount} skill gaps remaining to complete your ${gapAnalysis.targetTier} certification requirements. Study the recommended lessons below:`
                : `Congratulations! You have closed all skill requirements for this tier.`}
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 min-w-[200px] text-right">
            <span className="text-[11px] text-slate-400 block font-mono">Target Tier Progress</span>
            <span className="text-xl font-black text-amber-400">{gapAnalysis.tierCompletionPercentage}%</span>
            <div className="w-full bg-slate-900 rounded-full h-1.5 mt-1 overflow-hidden">
              <div
                className="bg-amber-400 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${gapAnalysis.tierCompletionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Tier Gap Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-850">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-slate-300">View Skill Gaps For:</span>
          </div>
          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs">
            {(['AUTO', 'CLAD', 'CLD', 'CLA'] as const).map((tierKey) => (
              <button
                key={tierKey}
                onClick={() => setGapTierFilter(tierKey)}
                className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  gapTierFilter === tierKey
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tierKey === 'AUTO' ? 'Next Goal (Auto-Detected)' : `${tierKey} Gaps`}
              </button>
            ))}
          </div>
        </div>

        {/* Recommended Lessons Cards */}
        {gapAnalysis.recommendedLessons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gapAnalysis.recommendedLessons.map((item) => (
              <div
                key={item.skillId}
                className="p-5 rounded-xl bg-slate-950 border border-slate-850 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-4 shadow-lg group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-amber-300 border border-slate-800 font-mono font-semibold">
                      Gap: {item.skillName}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-amber-400" /> {item.durationMinutes}m
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                      {item.lessonTitle}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                      {item.lessonSubtitle}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-850 text-[11px] text-slate-300">
                    <span className="font-semibold text-amber-400">Exam Impact: </span>
                    <span>{item.gapReason}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-900 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onToggleSkill(item.skillId)}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-500 hover:text-emerald-400" />
                    <span>Mark Mastered</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {item.mappedLabId && (
                      <button
                        onClick={() => onOpenLab(item.mappedLabId)}
                        className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-850 flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Practice on Workbench"
                      >
                        <Play className="w-3 h-3 fill-current text-amber-400" />
                        <span>Lab</span>
                      </button>
                    )}

                    <button
                      onClick={() => onOpenLesson(item.lessonId)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-amber-500/20"
                    >
                      <span>Start Lesson</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-950 rounded-xl border border-slate-850 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">All Skill Gaps Successfully Closed!</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              You have satisfied every required competency for this tier. You are ready to book and take the official National Instruments certification exam.
            </p>
          </div>
        )}
      </div>

      {/* Lab-to-Certification Competency Mapping Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-amber-400" />
              <span>Interactive Labs to Exam Requirements Mapping</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Completing each interactive Workbench lab automatically credits its mapped skills across CLAD, CLD, and CLA.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">4 Core Simulation Labs</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {labMappings.map((lab) => {
            const isLabCompleted = completedLabIds.has(lab.labId);
            return (
              <div
                key={lab.labId}
                className="bg-slate-950 border border-slate-850 rounded-xl p-4 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300">{lab.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                      {lab.tierFocus}
                    </span>
                  </div>
                  <div className="mt-2 space-y-1">
                    <span className="text-[11px] text-slate-400 font-medium block">Competencies Fulfilled:</span>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {lab.skillsCovered.map((skillName, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{skillName}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-900 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {onToggleLab ? (
                      <button
                        onClick={() => onToggleLab(lab.labId)}
                        className={`text-xs px-2.5 py-1 rounded-md border flex items-center gap-1.5 cursor-pointer transition-colors ${
                          isLabCompleted
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                            : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                        title="Toggle completed state to verify mapping to skills"
                      >
                        <CheckCircle2 className={`w-3.5 h-3.5 ${isLabCompleted ? 'text-emerald-400' : 'text-slate-600'}`} />
                        <span>{isLabCompleted ? 'Lab Completed' : 'Mark Lab Done'}</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500">
                        Status: {isLabCompleted ? <span className="text-emerald-400 font-semibold">Completed</span> : 'Pending Practice'}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onOpenLab(lab.labId)}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Launch Lab</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comprehensive Skill Requirements Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Official Skill Competencies Checklist ({filteredSkills.length})</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select skills to review their exam weight, mapped workbench lab, and curriculum lesson.
            </p>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
              {(['ALL', 'CLAD', 'CLD', 'CLA'] as const).map((tier) => (
                <button
                  key={tier}
                  onClick={() => setSelectedTierFilter(tier)}
                  className={`px-2.5 py-1 rounded font-semibold transition-all cursor-pointer ${
                    selectedTierFilter === tier
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>

            <div className="flex items-center p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
              {(['ALL', 'MASTERED', 'PENDING'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatusFilter(status)}
                  className={`px-2.5 py-1 rounded font-semibold transition-all cursor-pointer ${
                    selectedStatusFilter === status
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Skill Cards Grid */}
        <div className="space-y-3">
          {filteredSkills.map((skill) => {
            const isMastered =
              completedSkillIds.has(skill.id) || completedLabIds.has(skill.mappedLabId);

            return (
              <div
                key={skill.id}
                className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isMastered
                    ? 'bg-slate-950/70 border-emerald-500/30'
                    : 'bg-slate-950/40 border-slate-850 hover:border-slate-800'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <button
                    onClick={() => onToggleSkill(skill.id)}
                    className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                      isMastered
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                        : 'border-slate-700 bg-slate-900 hover:border-amber-400'
                    }`}
                    title={isMastered ? 'Mark as In-Progress' : 'Mark as Mastered'}
                  >
                    {isMastered && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                          skill.tier === 'CLAD'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : skill.tier === 'CLD'
                            ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {skill.tier}
                      </span>
                      <span className="text-xs font-semibold text-slate-400 font-mono">
                        {skill.category}
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="text-[11px] text-amber-400/90 font-mono">
                        Exam Weight: {skill.officialExamWeight}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white">{skill.name}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {skill.description}
                    </p>
                  </div>
                </div>

                {/* Direct Action Links */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => onOpenLesson(skill.mappedLessonId)}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-850 flex items-center gap-1.5 cursor-pointer transition-colors"
                    title="Review corresponding curriculum lesson"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span>Review Lesson</span>
                  </button>

                  <button
                    onClick={() => onOpenLab(skill.mappedLabId)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 flex items-center gap-1.5 cursor-pointer font-semibold transition-colors"
                    title={`Open ${skill.mappedLabTitle} in workbench`}
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Practice in Lab</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <RotateCcw className="w-4 h-4" />
                <span>Reset Competency Baseline?</span>
              </div>
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to reset your certification tracker? This will reset all completed competencies, lab credits, and milestone marks back to their initial baseline.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onResetProgress?.();
                  setIsResetConfirmOpen(false);
                }}
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-500 text-white transition-colors cursor-pointer shadow-md shadow-red-600/20"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
