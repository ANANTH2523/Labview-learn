import React, { useState } from 'react';
import {
  CURRICULUM_MODULES,
} from '../data/curriculumData';
import { CurriculumLesson, WireType } from '../types';
import { WIRE_SPECS } from '../utils/labview-engine';
import {
  GraduationCap,
  Clock,
  Sparkles,
  AlertTriangle,
  Play,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

interface CurriculumViewProps {
  initialLessonId?: string;
  onOpenLab: (labId: string) => void;
  onAskMentor: (topic: string) => void;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({
  initialLessonId,
  onOpenLab,
  onAskMentor,
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>(CURRICULUM_MODULES[0].id);
  const [selectedLesson, setSelectedLesson] = useState<CurriculumLesson>(CURRICULUM_MODULES[0].lessons[0]);
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('labview_academy_completed_lessons');
      return saved ? new Set(JSON.parse(saved)) : new Set(['lesson-1']);
    } catch {
      return new Set(['lesson-1']);
    }
  });

  // Sync completedLessonIds to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem('labview_academy_completed_lessons', JSON.stringify([...completedLessonIds]));
    } catch (e) {
      console.error(e);
    }
  }, [completedLessonIds]);

  // Sync when initialLessonId changes
  React.useEffect(() => {
    if (!initialLessonId) return;
    for (const mod of CURRICULUM_MODULES) {
      const match = mod.lessons.find((l) => l.id === initialLessonId);
      if (match) {
        setSelectedModuleId(mod.id);
        setSelectedLesson(match);
        break;
      }
    }
  }, [initialLessonId]);

  const activeModule = CURRICULUM_MODULES.find((m) => m.id === selectedModuleId) || CURRICULUM_MODULES[0];

  const toggleLessonComplete = (id: string) => {
    setCompletedLessonIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const totalLessons = CURRICULUM_MODULES.reduce((acc, m) => acc + m.lessons.length, 0);
  const progressPercent = Math.round((completedLessonIds.size / totalLessons) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950/40 rounded-2xl border border-slate-800 p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>Zero-to-Hero Mastery Track</span>
              <span className="text-slate-500">·</span>
              <span>National Instruments Certified Path</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              LabVIEW & Nigel AI Engineering Curriculum
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Step through the complete architectural journey from raw G dataflow to high-throughput ATE test racks and precision Nigel AI prompting. Learn directly from certified National Instruments architects.
            </p>
          </div>

          {/* Progress Card */}
          <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-5 min-w-[260px] space-y-3 shadow-xl">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Curriculum Progress</span>
              <span className="text-amber-400 font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-amber-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span>{completedLessonIds.size} of {totalLessons} Lessons Done</span>
              <span className="text-slate-300 font-semibold">Track: CLAD → CLA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Module Selector Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {CURRICULUM_MODULES.map((module) => {
          const isSelected = module.id === selectedModuleId;
          const completedCount = module.lessons.filter((l) => completedLessonIds.has(l.id)).length;
          return (
            <button
              key={module.id}
              onClick={() => {
                setSelectedModuleId(module.id);
                setSelectedLesson(module.lessons[0]);
              }}
              className={`text-left p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-amber-500/10 border-amber-500/50 shadow-md shadow-amber-500/5'
                  : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Track {module.number}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                    {module.badge}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white line-clamp-1">
                  {module.title}
                </h3>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>{module.lessons.length} Lessons</span>
                <span className={completedCount === module.lessons.length ? 'text-emerald-400 font-semibold' : ''}>
                  {completedCount}/{module.lessons.length} Done
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Lesson Content & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Lesson List (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900/70 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="px-2 py-1">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {activeModule.title}
            </h2>
            <p className="text-xs text-slate-400 mt-1">{activeModule.description}</p>
          </div>

          <div className="space-y-1.5 pt-2">
            {activeModule.lessons.map((lesson) => {
              const isCurrent = lesson.id === selectedLesson.id;
              const isCompleted = completedLessonIds.has(lesson.id);
              return (
                <button
                  key={lesson.id}
                  onClick={() => setSelectedLesson(lesson)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                    isCurrent
                      ? 'bg-slate-800 border-amber-500/40 shadow-sm'
                      : 'border-transparent hover:bg-slate-850 hover:border-slate-800'
                  }`}
                >
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLessonComplete(lesson.id);
                    }}
                    className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                      isCompleted
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                        : 'border-slate-600 hover:border-amber-400'
                    }`}
                  >
                    {isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-amber-400">
                        Level {lesson.levelNumber}
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {lesson.durationMinutes}m
                      </span>
                    </div>
                    <h4 className={`text-sm font-semibold mt-1 truncate ${isCurrent ? 'text-white' : 'text-slate-300'}`}>
                      {lesson.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                      {lesson.subtitle}
                    </p>
                  </div>

                  <ChevronRight className={`w-4 h-4 self-center transition-transform ${isCurrent ? 'text-amber-400 translate-x-1' : 'text-slate-600'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Lesson Detail (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8">
          {/* Header */}
          <div className="space-y-3 border-b border-slate-800 pb-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20">
                  {selectedLesson.level}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {selectedLesson.durationMinutes} Minutes
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleLessonComplete(selectedLesson.id)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                    completedLessonIds.has(selectedLesson.id)
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{completedLessonIds.has(selectedLesson.id) ? 'Completed' : 'Mark as Done'}</span>
                </button>

                {selectedLesson.relatedLabId && (
                  <button
                    onClick={() => onOpenLab(selectedLesson.relatedLabId!)}
                    className="text-xs px-3.5 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-amber-500/20"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Launch in Simulator</span>
                  </button>
                )}
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white tracking-tight">
              {selectedLesson.title}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {selectedLesson.summary}
            </p>
          </div>

          {/* Core Concepts */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Core Architectural Concepts</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedLesson.coreConcepts.map((concept, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-850/80 border border-slate-800/80 text-xs text-slate-200 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center font-bold shrink-0 text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{concept}</span>
                </div>
              ))}
            </div>
          </div>

          {/* G Dataflow Laws */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              <span>The Professor's G-Dataflow Laws</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {selectedLesson.dataflowPrinciples.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">›</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Interactive Block Diagram Blueprint */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Block Diagram Schematic: {selectedLesson.blockDiagramExample.title}
              </h3>
              <span className="text-[11px] text-slate-500">G Dataflow Topology</span>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-4">
              <p className="text-xs text-slate-400 font-sans">
                {selectedLesson.blockDiagramExample.description}
              </p>

              {/* Graphical Nodes Flow */}
              <div className="flex flex-wrap items-center gap-2 py-3">
                {selectedLesson.blockDiagramExample.nodes.map((node, i) => (
                  <React.Fragment key={i}>
                    <div className="px-3 py-2 rounded-lg bg-slate-850 border border-slate-700 text-amber-300 font-semibold shadow-inner text-center">
                      {node}
                    </div>
                    {i < selectedLesson.blockDiagramExample.nodes.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Wire Color Legend for this diagram */}
              <div className="pt-3 border-t border-slate-800 flex flex-wrap gap-4 text-[11px] font-sans">
                {selectedLesson.blockDiagramExample.wires.map((wire, idx) => {
                  const spec = WIRE_SPECS[wire.type as WireType];
                  return (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span
                        className="w-3 h-1.5 rounded-full"
                        style={{ backgroundColor: spec?.color || '#cbd5e1' }}
                      ></span>
                      <span className="text-slate-300">{wire.from} → {wire.to}</span>
                      <span className="text-slate-500">({spec?.label.split(' ')[0]})</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Nigel AI Prompting Guidance Box */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-800/40 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>How to Prompt Nigel AI for This Workflow</span>
            </div>
            <p className="text-xs text-emerald-100 font-mono leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-emerald-900/40">
              "{selectedLesson.nigelTip}"
            </p>
          </div>

          {/* Pitfall & Anti-Pattern Alert */}
          <div className="p-4 rounded-xl bg-red-950/20 border border-red-800/30 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <span className="font-bold text-red-300">Production Pitfall to Avoid:</span>
              <p className="text-slate-300 leading-relaxed">{selectedLesson.pitfallToAvoid}</p>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={() => onAskMentor(`Can you explain ${selectedLesson.title} in more detail? I want to understand: ${selectedLesson.exercisePrompt}`)}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <span>Ask Dr. Vance about this lesson</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {selectedLesson.relatedLabId && (
              <button
                onClick={() => onOpenLab(selectedLesson.relatedLabId!)}
                className="text-xs px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-amber-500/20"
              >
                <span>Launch Interactive Workbench</span>
                <Play className="w-3 h-3 fill-current" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
