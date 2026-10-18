import React, { useState, useEffect } from 'react';
import { EXAM_QUESTIONS } from '../data/examQuestions';
import { ExamQuestion } from '../types';
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface ExamPrepViewProps {
  initialLevel?: 'ALL' | 'CLAD' | 'CLD' | 'CLA';
  onOpenResourceLibrary?: () => void;
  onOpenCertTracker?: () => void;
}

const STORAGE_KEY_EXAM = 'labview_academy_exam_answers';

export const ExamPrepView: React.FC<ExamPrepViewProps> = ({
  initialLevel = 'ALL',
  onOpenResourceLibrary,
  onOpenCertTracker,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<'ALL' | 'CLAD' | 'CLD' | 'CLA'>(initialLevel);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);

  // Track answers for all questions
  const [answersMap, setAnswersMap] = useState<
    Record<string, { selectedOptionId: string; isCorrect: boolean }>
  >(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_EXAM);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Sync initialLevel when prop changes
  useEffect(() => {
    if (initialLevel) {
      setSelectedLevel(initialLevel);
      setCurrentQuestionIndex(0);
      setIsAnswerSubmitted(false);
      setSelectedOptionId(null);
    }
  }, [initialLevel]);

  // Sync answersMap to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_EXAM, JSON.stringify(answersMap));
    } catch (e) {
      console.error(e);
    }
  }, [answersMap]);

  const filteredQuestions =
    selectedLevel === 'ALL'
      ? EXAM_QUESTIONS
      : EXAM_QUESTIONS.filter((q) => q.level === selectedLevel);

  const activeQuestion: ExamQuestion =
    filteredQuestions[currentQuestionIndex] || filteredQuestions[0];

  // Update submission state when question changes
  useEffect(() => {
    if (!activeQuestion) return;
    const recorded = answersMap[activeQuestion.id];
    if (recorded) {
      setSelectedOptionId(recorded.selectedOptionId);
      setIsAnswerSubmitted(true);
    } else {
      setSelectedOptionId(null);
      setIsAnswerSubmitted(false);
    }
  }, [activeQuestion?.id, currentQuestionIndex, selectedLevel]);

  const handleSelectOption = (id: string) => {
    if (isAnswerSubmitted) return;
    setSelectedOptionId(id);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOptionId || isAnswerSubmitted || !activeQuestion) return;
    setIsAnswerSubmitted(true);

    const isCorrect = selectedOptionId === activeQuestion.correctOptionId;
    setAnswersMap((prev) => ({
      ...prev,
      [activeQuestion.id]: {
        selectedOptionId,
        isCorrect,
      },
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Loop or stay on summary
      setCurrentQuestionIndex(0);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleJumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleResetExam = () => {
    setIsAnswerSubmitted(false);
    setSelectedOptionId(null);
    setCurrentQuestionIndex(0);
    setAnswersMap({});
    try {
      localStorage.removeItem(STORAGE_KEY_EXAM);
    } catch {}
  };

  // Compute metrics for the current filtered list
  const filteredQuestionIds = new Set(filteredQuestions.map((q) => q.id));
  const answeredInFilter = Object.entries(answersMap).filter(([qId]) =>
    filteredQuestionIds.has(qId)
  );
  const correctCount = answeredInFilter.filter(([, res]) => res.isCorrect).length;
  const totalAnswered = answeredInFilter.length;
  const accuracyPercent =
    totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950/40 rounded-3xl border border-slate-800 p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-amber-400">
              <Award className="w-4 h-4" />
              <span>National Instruments Official Exam Prep</span>
              <span className="text-slate-500">·</span>
              <span>CLAD, CLD & CLA Simulator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Certification Exam Simulator
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Test your mastery of execution dataflow, mechanical boolean actions, shift registers, race condition prevention, and queue architectures with authentic exam-grade questions and explanatory rationale.
            </p>

            <div className="flex items-center gap-2 pt-1">
              {onOpenCertTracker && (
                <button
                  onClick={onOpenCertTracker}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700 cursor-pointer flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>View Certification Tracker</span>
                </button>
              )}
              {onOpenResourceLibrary && (
                <button
                  onClick={onOpenResourceLibrary}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 transition-colors border border-amber-500/30 cursor-pointer flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Whitepaper & Docs Library</span>
                </button>
              )}
            </div>
          </div>

          {/* Score Badge */}
          <div className="bg-slate-900/90 border border-slate-750 rounded-2xl p-5 min-w-[240px] space-y-2 shadow-xl shrink-0">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Exam Accuracy</span>
              <span className="font-bold text-amber-400">{accuracyPercent}%</span>
            </div>
            <div className="text-2xl font-black text-white">
              {correctCount} / {filteredQuestions.length} Correct
            </div>
            <div className="text-xs text-slate-400 pt-1 flex items-center justify-between">
              <span>Answered: {totalAnswered} of {filteredQuestions.length}</span>
              <span className="text-emerald-400 font-semibold">Pass: 70%+</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Question Navigator */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
            {(['ALL', 'CLAD', 'CLD', 'CLA'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => {
                  setSelectedLevel(lvl);
                  setCurrentQuestionIndex(0);
                }}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedLevel === lvl
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/10'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lvl === 'ALL' ? 'All Tiers' : lvl}
              </button>
            ))}
          </div>

          <button
            onClick={handleResetExam}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-850 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Exam Tally</span>
          </button>
        </div>

        {/* Question Bubbles Quick Matrix */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-2 bg-slate-900/60 border border-slate-800/80 rounded-xl">
          <span className="text-[11px] font-semibold text-slate-400 px-2 shrink-0">
            Questions:
          </span>
          {filteredQuestions.map((q, idx) => {
            const recorded = answersMap[q.id];
            const isCurrent = idx === currentQuestionIndex;
            let bubbleStyle = 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750';
            if (recorded) {
              bubbleStyle = recorded.isCorrect
                ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300'
                : 'bg-red-950/60 border-red-500/60 text-red-300';
            }
            if (isCurrent) {
              bubbleStyle += ' ring-2 ring-amber-400 font-bold text-white scale-105';
            }

            return (
              <button
                key={q.id}
                onClick={() => handleJumpToQuestion(idx)}
                className={`w-7 h-7 rounded-lg text-xs font-semibold border flex items-center justify-center shrink-0 transition-all cursor-pointer ${bubbleStyle}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Question Card */}
      {activeQuestion ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
                {activeQuestion.level} Exam Question
              </span>
              <span className="text-xs text-slate-400">Topic: {activeQuestion.topic}</span>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              Question {currentQuestionIndex + 1} of {filteredQuestions.length}
            </span>
          </div>

          {/* Question Text */}
          <h2 className="text-base sm:text-lg font-bold text-white leading-relaxed">
            {activeQuestion.question}
          </h2>

          {/* ASCII Block Diagram if available */}
          {activeQuestion.diagramAscii && (
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl overflow-x-auto">
              <pre className="font-mono text-xs text-amber-300 leading-tight">
                {activeQuestion.diagramAscii}
              </pre>
            </div>
          )}

          {/* Multiple Choice Options */}
          <div className="space-y-3">
            {activeQuestion.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              const isCorrectOption = opt.id === activeQuestion.correctOptionId;

              let cardStyle = 'bg-slate-950/60 border-slate-800 hover:border-slate-700';
              if (isAnswerSubmitted) {
                if (isCorrectOption) {
                  cardStyle = 'bg-emerald-950/30 border-emerald-500 text-emerald-200';
                } else if (isSelected && !isCorrectOption) {
                  cardStyle = 'bg-red-950/30 border-red-500 text-red-200';
                }
              } else if (isSelected) {
                cardStyle = 'bg-slate-850 border-amber-500 text-white shadow-md shadow-amber-500/10';
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${cardStyle}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                      isSelected
                        ? 'border-amber-400 bg-amber-400 text-slate-950'
                        : 'border-slate-700 bg-slate-900 text-slate-400'
                    }`}
                  >
                    {opt.id.toUpperCase()}
                  </div>
                  <span className="text-xs sm:text-sm leading-relaxed">{opt.text}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation & Dataflow Rule Box (Revealed upon Submission) */}
          {isAnswerSubmitted && (
            <div className="space-y-4 p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-2">
                {selectedOptionId === activeQuestion.correctOptionId ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="font-bold text-sm text-emerald-400">Correct! Great architectural judgment.</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-400" />
                    <span className="font-bold text-sm text-red-400">Incorrect. Review the G-dataflow principle below:</span>
                  </>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activeQuestion.explanation}
              </p>

              <div className="p-3 bg-slate-900 border border-amber-500/30 rounded-xl text-xs text-amber-300 font-semibold flex items-center gap-2">
                <span className="text-amber-400 font-bold shrink-0">Rule of G:</span>
                <span>{activeQuestion.dataflowRule}</span>
              </div>

              {onOpenResourceLibrary && (
                <div className="pt-2">
                  <button
                    onClick={onOpenResourceLibrary}
                    className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Review NI Official Documentation & Whitepapers on {activeQuestion.topic}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800 gap-3">
            <button
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {!isAnswerSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedOptionId}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer disabled:opacity-40 shadow-md shadow-amber-500/20"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-500/20"
              >
                <span>{currentQuestionIndex === filteredQuestions.length - 1 ? 'Review All' : 'Next Question'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-3xl">
          <p className="text-slate-400 text-sm">No questions available for the selected tier.</p>
        </div>
      )}
    </div>
  );
};
