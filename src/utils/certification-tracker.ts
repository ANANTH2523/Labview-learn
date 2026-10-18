import { CURRICULUM_MODULES } from '../data/curriculumData.ts';

export interface CertificationSkill {
  id: string;
  name: string;
  tier: 'CLAD' | 'CLD' | 'CLA';
  category: string;
  description: string;
  mappedLabId: string;
  mappedLabTitle: string;
  mappedLessonId: string;
  officialExamWeight: string;
}

export const CERTIFICATION_SKILLS: CertificationSkill[] = [
  // CLAD Skills
  {
    id: 'clad-dataflow',
    name: 'G Dataflow & Execution Order',
    tier: 'CLAD',
    category: 'Core G Language',
    description: 'Ensure execution happens only when all node inputs arrive; avoid visual coordinate assumptions.',
    mappedLabId: 'lab-1',
    mappedLabTitle: 'Thermal Acquisition & PID Control System',
    mappedLessonId: 'lesson-1',
    officialExamWeight: '15%',
  },
  {
    id: 'clad-shift-registers',
    name: 'Shift Registers & Feedback Nodes',
    tier: 'CLAD',
    category: 'Loops & Data Persistence',
    description: 'Maintain state across loop iterations; understand initialized vs uninitialized shift registers.',
    mappedLabId: 'lab-1',
    mappedLabTitle: 'Thermal Acquisition & PID Control System',
    mappedLessonId: 'lesson-3',
    officialExamWeight: '18%',
  },
  {
    id: 'clad-wire-coercion',
    name: 'Data Types & Coercion Dots',
    tier: 'CLAD',
    category: 'Type Safety & Memory',
    description: 'Prevent buffer thrashing by matching DBL, I32, and cluster types without unexpected coercion dots.',
    mappedLabId: 'lab-1',
    mappedLabTitle: 'Thermal Acquisition & PID Control System',
    mappedLessonId: 'lesson-2',
    officialExamWeight: '12%',
  },
  {
    id: 'clad-subvi-pane',
    name: '4x2x2x4 Connector Panes & SubVIs',
    tier: 'CLAD',
    category: 'Modular Programming',
    description: 'Follow standard NI terminal mapping: Inputs on left, Outputs on right, 32x32 icon glyphs.',
    mappedLabId: 'lab-3',
    mappedLabTitle: 'Automated Instrument SCPI Voltage Sweep Bench',
    mappedLessonId: 'lesson-4',
    officialExamWeight: '15%',
  },
  {
    id: 'clad-error-cluster',
    name: 'Standard Error Cluster Flow',
    tier: 'CLAD',
    category: 'Flow Control & Robustness',
    description: 'Propagate status, code, and source; bypass execution on error; merge parallel error streams.',
    mappedLabId: 'lab-3',
    mappedLabTitle: 'Automated Instrument SCPI Voltage Sweep Bench',
    mappedLessonId: 'lesson-5',
    officialExamWeight: '20%',
  },
  {
    id: 'clad-mechanical-actions',
    name: 'Mechanical Actions of Booleans',
    tier: 'CLAD',
    category: 'Front Panel Controls',
    description: 'Distinguish Switch vs Latch actions (Switch When Pressed vs Latch When Released for Stop buttons).',
    mappedLabId: 'lab-4',
    mappedLabTitle: 'Robust Standard State Machine (SSM)',
    mappedLessonId: 'lesson-6',
    officialExamWeight: '20%',
  },

  // CLD Skills
  {
    id: 'cld-state-machine',
    name: 'Standard State Machine (SSM)',
    tier: 'CLD',
    category: 'Design Patterns',
    description: 'Implement While Loop + Shift Register + Case Structure + Strict Typedef Enum with Default Case.',
    mappedLabId: 'lab-4',
    mappedLabTitle: 'Robust Standard State Machine (SSM)',
    mappedLessonId: 'lesson-7',
    officialExamWeight: '30%',
  },
  {
    id: 'cld-producer-consumer',
    name: 'Producer-Consumer Architecture',
    tier: 'CLD',
    category: 'Multithreading & Buffering',
    description: 'Decouple high-speed DAQ from UI/disk writing via NI FIFO Queues (Obtain, Enqueue, Dequeue, Release).',
    mappedLabId: 'lab-2',
    mappedLabTitle: 'High-Speed Producer-Consumer / QMH Bench',
    mappedLessonId: 'lesson-8',
    officialExamWeight: '35%',
  },
  {
    id: 'cld-event-structure',
    name: 'Event-Driven UI Programming',
    tier: 'CLD',
    category: 'UI Responsiveness',
    description: 'Eliminate CPU polling waste; queue user interactions without long-running blocking operations.',
    mappedLabId: 'lab-4',
    mappedLabTitle: 'Robust Standard State Machine (SSM)',
    mappedLessonId: 'lesson-9',
    officialExamWeight: '20%',
  },
  {
    id: 'cld-race-conditions',
    name: 'Race Condition & Local Variable Elimination',
    tier: 'CLD',
    category: 'Thread Safety',
    description: 'Eliminate local variables for cross-loop data transfer; use Queues or Functional Global Variables.',
    mappedLabId: 'lab-2',
    mappedLabTitle: 'High-Speed Producer-Consumer / QMH Bench',
    mappedLessonId: 'lesson-8',
    officialExamWeight: '15%',
  },

  // CLA Skills
  {
    id: 'cla-hardware-timed-daq',
    name: 'NI-DAQmx Continuous Hardware Timing',
    tier: 'CLA',
    category: 'Hardware Integration',
    description: 'Configure Sample Clock, block transfers, prevent Error -200279 buffer overwrite, and teardown tasks.',
    mappedLabId: 'lab-1',
    mappedLabTitle: 'Thermal Acquisition & PID Control System',
    mappedLessonId: 'lesson-10',
    officialExamWeight: '25%',
  },
  {
    id: 'cla-visa-scpi',
    name: 'Instrument Automation via NI-VISA & SCPI',
    tier: 'CLA',
    category: 'Instrument Control',
    description: 'Open session once, query instruments over GPIB/USB/LAN, trap timeouts, enforce \\n termination.',
    mappedLabId: 'lab-3',
    mappedLabTitle: 'Automated Instrument SCPI Voltage Sweep Bench',
    mappedLessonId: 'lesson-11',
    officialExamWeight: '25%',
  },
  {
    id: 'cla-ate-architecture',
    name: 'Automated Test Equipment (ATE) & TestStand',
    tier: 'CLA',
    category: 'Enterprise Test Systems',
    description: 'Design Hardware Abstraction Layers (HAL), multi-socket test sequencers, and TDMS telemetry.',
    mappedLabId: 'lab-3',
    mappedLabTitle: 'Automated Instrument SCPI Voltage Sweep Bench',
    mappedLessonId: 'lesson-12',
    officialExamWeight: '25%',
  },
  {
    id: 'cla-nigel-gcode-audit',
    name: 'Nigel AI Prompting & G-Code Audit Engineering',
    tier: 'CLA',
    category: 'AI-Augmented Architecture',
    description: 'Formulate 5-point invariant prompt specs and audit AI diagrams for unwired tunnels and leaks.',
    mappedLabId: 'lab-2',
    mappedLabTitle: 'High-Speed Producer-Consumer / QMH Bench',
    mappedLessonId: 'lesson-14',
    officialExamWeight: '25%',
  },
];

export interface TierReadiness {
  tier: 'CLAD' | 'CLD' | 'CLA';
  title: string;
  totalSkills: number;
  completedSkills: number;
  percentage: number;
  status: 'Ready for Exam' | 'Candidate' | 'In Training';
  badge: string;
}

/**
 * Calculates certification readiness per tier based on set of completed skills and completed lab IDs.
 * Accepts either Set<string> or string[] for maximum compatibility.
 */
export function calculateTierReadiness(
  completedSkillIds: Set<string> | string[],
  completedLabIds: Set<string> | string[] = new Set()
): Record<'CLAD' | 'CLD' | 'CLA', TierReadiness> {
  const skillSet = completedSkillIds instanceof Set ? completedSkillIds : new Set(completedSkillIds || []);
  const labSet = completedLabIds instanceof Set ? completedLabIds : new Set(completedLabIds || []);

  const tiers: ('CLAD' | 'CLD' | 'CLA')[] = ['CLAD', 'CLD', 'CLA'];

  const titles: Record<'CLAD' | 'CLD' | 'CLA', string> = {
    CLAD: 'Certified LabVIEW Associate Developer',
    CLD: 'Certified LabVIEW Developer',
    CLA: 'Certified LabVIEW Architect',
  };

  const badges: Record<'CLAD' | 'CLD' | 'CLA', string> = {
    CLAD: 'Associate Developer Badge',
    CLD: 'Developer Specialist Badge',
    CLA: 'Architect Fellow Badge',
  };

  const result = {} as Record<'CLAD' | 'CLD' | 'CLA', TierReadiness>;

  tiers.forEach((tier) => {
    const tierSkills = CERTIFICATION_SKILLS.filter((s) => s.tier === tier);
    const total = tierSkills.length;

    // A skill is counted as completed if either its skill ID is marked or its mapped lab is completed
    const completed = tierSkills.filter(
      (s) => skillSet.has(s.id) || labSet.has(s.mappedLabId)
    ).length;

    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    let status: TierReadiness['status'] = 'In Training';
    if (percentage >= 80) {
      status = 'Ready for Exam';
    } else if (percentage >= 50) {
      status = 'Candidate';
    }

    result[tier] = {
      tier,
      title: titles[tier],
      totalSkills: total,
      completedSkills: completed,
      percentage,
      status,
      badge: badges[tier],
    };
  });

  return result;
}

export interface RecommendedLessonItem {
  skillId: string;
  skillName: string;
  tier: 'CLAD' | 'CLD' | 'CLA';
  category: string;
  lessonId: string;
  lessonTitle: string;
  lessonSubtitle: string;
  durationMinutes: number;
  gapReason: string;
  mappedLabId: string;
  mappedLabTitle: string;
  officialExamWeight: string;
}

export interface NextTierGapAnalysis {
  currentTier: 'CLAD' | 'CLD' | 'CLA' | 'Master';
  targetTier: 'CLAD' | 'CLD' | 'CLA' | 'Master';
  targetTierTitle: string;
  targetTierBadge: string;
  missingSkillsCount: number;
  totalTierSkillsCount: number;
  tierCompletionPercentage: number;
  recommendedLessons: RecommendedLessonItem[];
}

/**
 * Analyzes completedSkillIds and compares them against the requirements for the next certification tier,
 * returning a detailed gap analysis with recommended lessons to fill those specific gaps.
 * Accepts either Set<string> or string[].
 */
export function getRecommendedLessonsForNextTier(
  completedSkillIds: Set<string> | string[],
  completedLabIds: Set<string> | string[] = new Set(),
  preferredTier?: 'CLAD' | 'CLD' | 'CLA'
): NextTierGapAnalysis {
  const skillSet = completedSkillIds instanceof Set ? completedSkillIds : new Set(completedSkillIds || []);
  const labSet = completedLabIds instanceof Set ? completedLabIds : new Set(completedLabIds || []);

  const readiness = calculateTierReadiness(skillSet, labSet);

  let targetTier: 'CLAD' | 'CLD' | 'CLA' | 'Master' = 'CLAD';
  let currentTier: 'CLAD' | 'CLD' | 'CLA' | 'Master' = 'CLAD';

  if (preferredTier) {
    targetTier = preferredTier;
    currentTier = preferredTier === 'CLA' ? 'CLD' : preferredTier === 'CLD' ? 'CLAD' : 'CLAD';
  } else {
    if (readiness.CLAD.percentage < 100) {
      targetTier = 'CLAD';
      currentTier = 'CLAD';
    } else if (readiness.CLD.percentage < 100) {
      targetTier = 'CLD';
      currentTier = 'CLAD';
    } else if (readiness.CLA.percentage < 100) {
      targetTier = 'CLA';
      currentTier = 'CLD';
    } else {
      targetTier = 'Master';
      currentTier = 'CLA';
    }
  }

  const targetTierTitles: Record<'CLAD' | 'CLD' | 'CLA' | 'Master', string> = {
    CLAD: 'Certified LabVIEW Associate Developer (CLAD)',
    CLD: 'Certified LabVIEW Developer (CLD)',
    CLA: 'Certified LabVIEW Architect (CLA)',
    Master: 'National Instruments Certified Master & Nigel AI Fellow',
  };

  const targetTierBadges: Record<'CLAD' | 'CLD' | 'CLA' | 'Master', string> = {
    CLAD: 'Next Milestone: CLAD Associate Developer',
    CLD: 'Next Milestone: CLD Certified Developer',
    CLA: 'Next Milestone: CLA Certified Architect',
    Master: 'All Tiers Mastered: Certified Fellow',
  };

  if (targetTier === 'Master') {
    return {
      currentTier,
      targetTier: 'Master',
      targetTierTitle: targetTierTitles.Master,
      targetTierBadge: targetTierBadges.Master,
      missingSkillsCount: 0,
      totalTierSkillsCount: CERTIFICATION_SKILLS.length,
      tierCompletionPercentage: 100,
      recommendedLessons: [],
    };
  }

  // Filter skills belonging to target tier
  const tierSkills = CERTIFICATION_SKILLS.filter((s) => s.tier === targetTier);
  const totalTierSkillsCount = tierSkills.length;

  // Identify missing skills
  const missingSkills = tierSkills.filter(
    (s) => !skillSet.has(s.id) && !labSet.has(s.mappedLabId)
  );

  const missingSkillsCount = missingSkills.length;
  const completedCount = totalTierSkillsCount - missingSkillsCount;
  const tierCompletionPercentage = Math.round((completedCount / totalTierSkillsCount) * 100);

  // Flatten all curriculum lessons for fast lookup
  const lessonMap = new Map<string, { title: string; subtitle: string; durationMinutes: number }>();
  CURRICULUM_MODULES.forEach((mod) => {
    mod.lessons.forEach((l) => {
      lessonMap.set(l.id, {
        title: l.title,
        subtitle: l.subtitle,
        durationMinutes: l.durationMinutes,
      });
    });
  });

  const recommendedLessons: RecommendedLessonItem[] = missingSkills.map((skill) => {
    const lessonInfo = lessonMap.get(skill.mappedLessonId) || {
      title: skill.name,
      subtitle: skill.description,
      durationMinutes: 25,
    };

    return {
      skillId: skill.id,
      skillName: skill.name,
      tier: skill.tier,
      category: skill.category,
      lessonId: skill.mappedLessonId,
      lessonTitle: lessonInfo.title,
      lessonSubtitle: lessonInfo.subtitle,
      durationMinutes: lessonInfo.durationMinutes,
      gapReason: `Required to fulfill ${skill.officialExamWeight} of the official ${skill.tier} exam specification.`,
      mappedLabId: skill.mappedLabId,
      mappedLabTitle: skill.mappedLabTitle,
      officialExamWeight: skill.officialExamWeight,
    };
  });

  return {
    currentTier,
    targetTier,
    targetTierTitle: targetTierTitles[targetTier],
    targetTierBadge: targetTierBadges[targetTier],
    missingSkillsCount,
    totalTierSkillsCount,
    tierCompletionPercentage,
    recommendedLessons,
  };
}

/**
 * Direct accessor returning the array of Recommended Lessons for the next tier gaps.
 */
export function getRecommendedLessons(
  completedSkillIds: Set<string> | string[],
  completedLabIds: Set<string> | string[] = new Set(),
  preferredTier?: 'CLAD' | 'CLD' | 'CLA'
): RecommendedLessonItem[] {
  return getRecommendedLessonsForNextTier(completedSkillIds, completedLabIds, preferredTier).recommendedLessons;
}

/**
 * Alias function for analyzing completed skill IDs and returning the gap analysis with recommended lessons.
 */
export function analyzeCompletedSkillsForNextTier(
  completedSkillIds: Set<string> | string[],
  completedLabIds: Set<string> | string[] = new Set(),
  preferredTier?: 'CLAD' | 'CLD' | 'CLA'
): NextTierGapAnalysis {
  return getRecommendedLessonsForNextTier(completedSkillIds, completedLabIds, preferredTier);
}

/**
 * Generates an executive readiness summary text for the user.
 */
export function generateReadinessReport(
  readiness: Record<'CLAD' | 'CLD' | 'CLA', TierReadiness>
): { summary: string; recommendation: string } {
  const clad = readiness.CLAD;
  const cld = readiness.CLD;
  const cla = readiness.CLA;

  if (clad.percentage < 70) {
    return {
      summary: `You are currently focusing on CLAD fundamentals (${clad.percentage}% readiness). Your primary focus should be mastering G dataflow laws, 4x2x2x4 connector panes, and mechanical actions of booleans.`,
      recommendation: 'Complete Lab 1 (Thermal PID) and review the CLAD Exam Practice questions on dataflow and shift registers.',
    };
  }

  if (cld.percentage < 70) {
    return {
      summary: `Your CLAD foundations are strong (${clad.percentage}%)! You are progressing through CLD architecture (${cld.percentage}% readiness). Focus on State Machines and Producer-Consumer queue buffering.`,
      recommendation: 'Complete Lab 2 (Producer-Consumer) and Lab 4 (Standard State Machine) to lock in your CLD developer status.',
    };
  }

  if (cla.percentage < 80) {
    return {
      summary: `CLAD and CLD tiers are fully mastered! You are in the final stretch for CLA Certified Architect (${cla.percentage}% readiness), tackling hardware-timed DAQmx streaming, SCPI sweeps, and Nigel AI prompt engineering.`,
      recommendation: 'Complete Lab 3 (SCPI Instrument Sweep) and practice formulating 85+ score prompts in Nigel AI Studio.',
    };
  }

  return {
    summary: `Outstanding achievement! You have satisfied all core competencies across CLAD (${clad.percentage}%), CLD (${cld.percentage}%), and CLA (${cla.percentage}%). You are fully prepared for the official National Instruments certification exams.`,
    recommendation: 'Schedule your official NI exam and use Nigel AI to accelerate production test rack development.',
  };
}

export interface DomainProficiency {
  domain: string;
  fullName: string;
  proficiency: number;
  benchmark: number;
  masteredCount: number;
  totalCount: number;
  skillIds: string[];
  keyTopics: string[];
  description: string;
}

export const LABVIEW_DOMAINS_CONFIG = [
  {
    domain: 'Dataflow',
    fullName: 'Core G Dataflow Engine',
    skillIds: [
      'clad-dataflow',
      'clad-shift-registers',
      'clad-wire-coercion',
      'clad-subvi-pane',
      'clad-error-cluster',
    ],
    keyTopics: ['Execution Order', 'Shift Registers', 'Coercion Dots', 'Connector Panes', 'Error Clusters'],
    description: 'Fundamental token-based graphical execution, memory-efficient data typing, and modular SubVI wiring.',
  },
  {
    domain: 'Architecture',
    fullName: 'Design Patterns & Concurrency',
    skillIds: [
      'cld-state-machine',
      'cld-producer-consumer',
      'cld-race-conditions',
      'cla-ate-architecture',
      'cla-nigel-gcode-audit',
    ],
    keyTopics: ['Standard State Machine', 'Producer-Consumer Queues', 'Race Condition Elimination', 'HAL/ATE', 'G-Code Auditing'],
    description: 'Robust multi-loop design patterns, queue-based messaging, state management, and thread safety.',
  },
  {
    domain: 'Hardware Interfacing',
    fullName: 'Hardware Timing & Instrument Control',
    skillIds: [
      'cla-hardware-timed-daq',
      'cla-visa-scpi',
    ],
    keyTopics: ['NI-DAQmx Continuous Timing', 'Sample Clocks & Buffers', 'NI-VISA SCPI Control', 'Timeout Handling'],
    description: 'Physical instrument automation, high-speed DAQmx acquisition, hardware timing clocks, and SCPI bus communication.',
  },
  {
    domain: 'UI Design',
    fullName: 'Front Panel Ergonomics & Event Handling',
    skillIds: [
      'clad-mechanical-actions',
      'cld-event-structure',
    ],
    keyTopics: ['Boolean Mechanical Actions', 'Event Structure Trapping', 'UI Responsiveness', 'Front Panel Ergonomics'],
    description: 'Operator interface design, Switch vs Latch actions, event-driven user interaction, and non-blocking Front Panels.',
  },
];

/**
 * Calculates domain proficiency scores (0-100%) for core LabVIEW domains:
 * Dataflow, Architecture, Hardware Interfacing, and UI Design.
 */
export function calculateDomainProficiency(
  completedSkillIds: Set<string> | string[],
  completedLabIds: Set<string> | string[] = new Set()
): DomainProficiency[] {
  const skillSet = completedSkillIds instanceof Set ? completedSkillIds : new Set(completedSkillIds || []);
  const labSet = completedLabIds instanceof Set ? completedLabIds : new Set(completedLabIds || []);

  // Map skill id to mappedLabId for easy lookup
  const skillToLab = new Map<string, string>();
  CERTIFICATION_SKILLS.forEach((s) => {
    skillToLab.set(s.id, s.mappedLabId);
  });

  return LABVIEW_DOMAINS_CONFIG.map((conf) => {
    const totalCount = conf.skillIds.length;
    const masteredCount = conf.skillIds.filter((id) => {
      if (skillSet.has(id)) return true;
      const mappedLab = skillToLab.get(id);
      return Boolean(mappedLab && labSet.has(mappedLab));
    }).length;

    const proficiency = totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0;

    return {
      domain: conf.domain,
      fullName: conf.fullName,
      proficiency,
      benchmark: 80, // NI certification mastery target benchmark
      masteredCount,
      totalCount,
      skillIds: conf.skillIds,
      keyTopics: conf.keyTopics,
      description: conf.description,
    };
  });
}

