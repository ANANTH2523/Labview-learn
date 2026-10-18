/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense, useEffect, useState } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { ProgressiveStepper } from './components/ProgressiveStepper';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PROGRESSIVE_MILESTONES } from './data/progressiveSteps';
import { usePersistentIndex, usePersistentSet } from './utils/storage';
import {
  GraduationCap,
  Cpu,
  Sparkles,
  MessageSquare,
  Award,
  Monitor,
  Flame,
  CheckCircle2,
  ShieldCheck,
  Lightbulb,
  Library,
} from 'lucide-react';

const CurriculumView = lazy(() => import('./components/CurriculumView').then((m) => ({ default: m.CurriculumView })));
const SimulatorView = lazy(() => import('./components/SimulatorView').then((m) => ({ default: m.SimulatorView })));
const NigelStudioView = lazy(() => import('./components/NigelStudioView').then((m) => ({ default: m.NigelStudioView })));
const MentorChatView = lazy(() => import('./components/MentorChatView').then((m) => ({ default: m.MentorChatView })));
const ExamPrepView = lazy(() => import('./components/ExamPrepView').then((m) => ({ default: m.ExamPrepView })));
const CertificationTrackerView = lazy(() => import('./components/CertificationTrackerView').then((m) => ({ default: m.CertificationTrackerView })));
const OSGuideView = lazy(() => import('./components/OSGuideView').then((m) => ({ default: m.OSGuideView })));
const ZeroToProWalkthrough = lazy(() => import('./components/ZeroToProWalkthrough').then((m) => ({ default: m.ZeroToProWalkthrough })));
const ResourceLibraryView = lazy(() => import('./components/ResourceLibraryView').then((m) => ({ default: m.ResourceLibraryView })));

const DEFAULT_SKILL_IDS = ['clad-dataflow', 'clad-shift-registers', 'clad-wire-coercion', 'cld-state-machine'];

/** Returns a copy of `set` with `id` added, or removed if already present. */
const toggled = (set: Set<string>, id: string): Set<string> => {
  const next = new Set(set);
  if (!next.delete(id)) next.add(id);
  return next;
};

const ViewFallback = () => (
  <div role="status" className="max-w-7xl mx-auto px-4 py-16 text-center text-sm text-slate-500">
    Loading…
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('curriculum');
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [activeLabId, setActiveLabId] = useState<string>('lab-1');
  const [activeMentorTopic, setActiveMentorTopic] = useState<string>('');
  const [activeLessonId, setActiveLessonId] = useState<string>('lesson-1');
  const [nigelPromptToLoad, setNigelPromptToLoad] = useState<string>('');
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(false);
  const [isZeroToProOpen, setIsZeroToProOpen] = useState<boolean>(false);
  // Load the walkthrough chunk on first open, then keep it mounted so its internal state survives closing.
  const [walkthroughMounted, setWalkthroughMounted] = useState<boolean>(false);
  if (isZeroToProOpen && !walkthroughMounted) setWalkthroughMounted(true);
  const [activeExamTier, setActiveExamTier] = useState<'ALL' | 'CLAD' | 'CLD' | 'CLA'>('ALL');

  // Progress state, persisted to localStorage
  const [currentMilestoneIndex, setCurrentMilestoneIndex] = usePersistentIndex(
    'labview_academy_milestone_index',
    PROGRESSIVE_MILESTONES.length - 1,
  );
  const [completedMilestones, setCompletedMilestones] = usePersistentSet('labview_academy_completed_milestones', ['m-1']);
  const [completedLabIds, setCompletedLabIds] = usePersistentSet('labview_academy_completed_labs', ['lab-1']);
  const [completedSkillIds, setCompletedSkillIds] = usePersistentSet('labview_academy_completed_skills', DEFAULT_SKILL_IDS);

  // Fetch server health & Gemini key status
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/health', { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`Health check failed: ${res.status}`))))
      .then((data) => setHasGeminiKey(Boolean(data.hasGeminiKey)))
      .catch(() => setHasGeminiKey(false));
    return () => controller.abort();
  }, []);

  const handleOpenLab = (labId: string) => {
    setActiveLabId(labId);
    setActiveTab('simulator');
    setIsRunning(true);
    setCompletedLabIds((prev) => new Set([...prev, labId]));
  };

  const handleAskMentor = (topic: string) => {
    setActiveMentorTopic(topic);
    setActiveTab('mentor');
  };

  const handleOpenNigelWithPrompt = (prompt: string) => {
    setNigelPromptToLoad(prompt);
    setActiveTab('nigel');
  };

  const handleMarkMilestoneComplete = (id: string) => setCompletedMilestones((prev) => toggled(prev, id));
  const handleToggleSkill = (skillId: string) => setCompletedSkillIds((prev) => toggled(prev, skillId));
  const handleToggleLab = (labId: string) => setCompletedLabIds((prev) => toggled(prev, labId));

  // The persistent hooks mirror these defaults back to localStorage.
  const handleResetAllProgress = () => {
    setCompletedMilestones(new Set(['m-1']));
    setCompletedLabIds(new Set(['lab-1']));
    setCompletedSkillIds(new Set(DEFAULT_SKILL_IDS));
    setCurrentMilestoneIndex(0);
  };

  const handleOpenExamWithTier = (tier: 'CLAD' | 'CLD' | 'CLA') => {
    setActiveExamTier(tier);
    setActiveTab('exam');
  };

  const handleOpenLesson = (lessonId: string) => {
    setActiveLessonId(lessonId);
    setActiveTab('curriculum');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => setActiveTab(tab)}
        isRunning={isRunning}
        onRunToggle={() => setIsRunning(!isRunning)}
        hasGeminiKey={hasGeminiKey}
      />

      {/* Secondary Fast-Access Bar */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 sm:px-8 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs overflow-x-auto gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <span className="font-bold text-amber-400 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>Zero-to-Pro Track:</span>
            </span>
            <span className="text-slate-300 font-medium">
              Milestone {currentMilestoneIndex + 1} of {PROGRESSIVE_MILESTONES.length}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsZeroToProOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 shadow-sm transition-all cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>What is LabVIEW? (Zero-to-Pro)</span>
            </button>

            <button
              onClick={() => setActiveTab('tracker')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'tracker'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-amber-400 hover:text-white bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Cert Readiness Tracker</span>
            </button>

            <button
              onClick={() => setActiveTab('resources')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'resources'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60'
              }`}
            >
              <Library className="w-3.5 h-3.5 text-amber-400" />
              <span>Resource Library</span>
            </button>

            <button
              onClick={() => setActiveTab('osGuide')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'osGuide'
                  ? 'bg-sky-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>macOS · Linux · Windows</span>
            </button>

            <button
              onClick={() => handleOpenLab('lab-1')}
              className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Thermal PID Lab
            </button>
            <button
              onClick={() => handleOpenLab('lab-2')}
              className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Producer-Consumer Lab
            </button>
            <button
              onClick={() => handleOpenLab('lab-3')}
              className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              SCPI Sweep Lab
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 pb-12">
        {/* Persistent Progressive Milestone Stepper at top */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <ProgressiveStepper
            currentMilestoneIndex={currentMilestoneIndex}
            setCurrentMilestoneIndex={setCurrentMilestoneIndex}
            completedMilestones={completedMilestones}
            onMarkMilestoneComplete={handleMarkMilestoneComplete}
            onLaunchLab={handleOpenLab}
            onOpenNigel={() => setActiveTab('nigel')}
            onOpenZeroToPro={() => setIsZeroToProOpen(true)}
          />
        </div>

        {/* View Routing */}
        <ErrorBoundary resetKey={activeTab}>
        <Suspense fallback={<ViewFallback />}>
        {activeTab === 'curriculum' && (
          <CurriculumView
            initialLessonId={activeLessonId}
            onOpenLab={handleOpenLab}
            onAskMentor={handleAskMentor}
          />
        )}

        {activeTab === 'simulator' && (
          <SimulatorView
            initialLabId={activeLabId}
            isRunning={isRunning}
            setIsRunning={setIsRunning}
            onOpenNigelWithPrompt={handleOpenNigelWithPrompt}
          />
        )}

        {activeTab === 'nigel' && (
          <NigelStudioView
            initialPrompt={nigelPromptToLoad}
            onOpenLab={handleOpenLab}
          />
        )}

        {activeTab === 'mentor' && (
          <MentorChatView initialTopic={activeMentorTopic} />
        )}

        {activeTab === 'tracker' && (
          <CertificationTrackerView
            completedLabIds={completedLabIds}
            completedSkillIds={completedSkillIds}
            onToggleSkill={handleToggleSkill}
            onToggleLab={handleToggleLab}
            onOpenLab={handleOpenLab}
            onOpenLesson={handleOpenLesson}
            onOpenExam={handleOpenExamWithTier}
            onOpenZeroToPro={() => setIsZeroToProOpen(true)}
            onOpenResourceLibrary={() => setActiveTab('resources')}
            onResetProgress={handleResetAllProgress}
          />
        )}

        {activeTab === 'exam' && (
          <ExamPrepView
            initialLevel={activeExamTier}
            onOpenResourceLibrary={() => setActiveTab('resources')}
            onOpenCertTracker={() => setActiveTab('tracker')}
          />
        )}

        {activeTab === 'resources' && (
          <ResourceLibraryView
            onOpenExamPrep={() => setActiveTab('exam')}
            onOpenCertTracker={() => setActiveTab('tracker')}
          />
        )}

        {activeTab === 'osGuide' && <OSGuideView />}
        </Suspense>
        </ErrorBoundary>
      </main>

      {/* Zero to Pro Walkthrough Modal */}
      {walkthroughMounted && (
      <Suspense fallback={null}>
      <ZeroToProWalkthrough
        isOpen={isZeroToProOpen}
        onClose={() => setIsZeroToProOpen(false)}
        onLaunchLab={handleOpenLab}
        onOpenLesson={handleOpenLesson}
        onOpenNigel={() => {
          setIsZeroToProOpen(false);
          setActiveTab('nigel');
        }}
        completedStepIds={completedMilestones}
        onToggleStepComplete={handleMarkMilestoneComplete}
      />
      </Suspense>
      )}

      {/* Professional Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-[10px]">
              G
            </span>
            <span className="font-semibold text-slate-400">LabVIEW Academy & Nigel AI Mentor</span>
            <span>·</span>
            <span>National Instruments Graphical System Design Education</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>CLAD · CLD · CLA Standards</span>
            <span>·</span>
            <span>Windows, macOS & Linux Verified</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
