import React, { useState } from 'react';
import { PROGRESSIVE_MILESTONES, ProgressiveMilestone } from '../data/progressiveSteps';
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Award,
  Play,
  Lightbulb,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Zap,
} from 'lucide-react';

interface ProgressiveStepperProps {
  currentMilestoneIndex: number;
  setCurrentMilestoneIndex: (index: number) => void;
  completedMilestones: Set<string>;
  onMarkMilestoneComplete: (id: string) => void;
  onLaunchLab: (labId: string) => void;
  onOpenNigel: () => void;
  onOpenZeroToPro?: () => void;
}

export const ProgressiveStepper: React.FC<ProgressiveStepperProps> = ({
  currentMilestoneIndex,
  setCurrentMilestoneIndex,
  completedMilestones,
  onMarkMilestoneComplete,
  onLaunchLab,
  onOpenNigel,
  onOpenZeroToPro,
}) => {
  const milestone: ProgressiveMilestone = PROGRESSIVE_MILESTONES[currentMilestoneIndex] || PROGRESSIVE_MILESTONES[0];
  const isCompleted = completedMilestones.has(milestone.id);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
      {/* Header with Step Tracker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
              Progressive Pathway: Step {milestone.stepNumber} of {PROGRESSIVE_MILESTONES.length}
            </span>
            <span className="text-xs text-slate-400">· {milestone.tier}</span>
            {onOpenZeroToPro && (
              <button
                onClick={onOpenZeroToPro}
                className="text-[11px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 font-semibold border border-amber-500/40 flex items-center gap-1 transition-colors cursor-pointer ml-1"
                title="Open Zero to Pro Foundation Guide"
              >
                <HelpCircle className="w-3 h-3 text-amber-400" />
                <span>What is LabVIEW?</span>
              </button>
            )}
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white mt-1">
            {milestone.title}
          </h2>
        </div>

        {/* Milestone Steps Quick Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {PROGRESSIVE_MILESTONES.map((m, idx) => {
            const isDone = completedMilestones.has(m.id);
            const isCurrent = idx === currentMilestoneIndex;
            return (
              <button
                key={m.id}
                onClick={() => setCurrentMilestoneIndex(idx)}
                className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400/50'
                    : isDone
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-750'
                }`}
                title={`Step ${m.stepNumber}: ${m.title}`}
              >
                {isDone ? <CheckCircle2 className="w-4 h-4" /> : m.stepNumber}
              </button>
            );
          })}
        </div>
      </div>

      {/* Milestone Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Theory & Objective */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-amber-400 uppercase tracking-wider">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Core Objective & Theory</span>
          </div>
          <p className="text-slate-300 font-medium leading-relaxed">
            {milestone.objective}
          </p>
          <p className="text-slate-400 leading-relaxed pt-1 border-t border-slate-900">
            {milestone.theorySummary}
          </p>
        </div>

        {/* Hands-On Interactive Task */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 font-bold text-emerald-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hands-On Interactive Task</span>
            </div>
            <p className="text-slate-200 font-medium leading-relaxed mt-1">
              {milestone.handsOnTask}
            </p>
            <div className="mt-2 text-[11px] text-slate-500">
              Badge: <span className="text-amber-300 font-semibold">{milestone.unlockBadge}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-3 border-t border-slate-900">
            {milestone.labTargetId ? (
              <button
                onClick={() => onLaunchLab(milestone.labTargetId!)}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Launch This Lab</span>
              </button>
            ) : (
              <button
                onClick={onOpenNigel}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20"
              >
                <Sparkles className="w-3 h-3" />
                <span>Open Nigel AI Studio</span>
              </button>
            )}

            <button
              onClick={() => onMarkMilestoneComplete(milestone.id)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isCompleted
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isCompleted ? 'Milestone Completed!' : 'Mark Step Complete'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stepper Navigation Footer */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setCurrentMilestoneIndex(Math.max(0, currentMilestoneIndex - 1))}
          disabled={currentMilestoneIndex === 0}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 disabled:opacity-40 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Milestone</span>
        </button>

        <span className="text-[11px] text-slate-500">
          {completedMilestones.size} of {PROGRESSIVE_MILESTONES.length} Milestones Achieved
        </span>

        <button
          onClick={() =>
            setCurrentMilestoneIndex(
              Math.min(PROGRESSIVE_MILESTONES.length - 1, currentMilestoneIndex + 1)
            )
          }
          disabled={currentMilestoneIndex === PROGRESSIVE_MILESTONES.length - 1}
          className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 disabled:opacity-40 cursor-pointer"
        >
          <span>Next Milestone</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
