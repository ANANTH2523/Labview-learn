import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateTierReadiness,
  generateReadinessReport,
  getRecommendedLessonsForNextTier,
  CERTIFICATION_SKILLS,
} from './certification-tracker.ts';

test('Skills database contains valid skills across CLAD, CLD, and CLA', () => {
  const cladSkills = CERTIFICATION_SKILLS.filter((s) => s.tier === 'CLAD');
  const cldSkills = CERTIFICATION_SKILLS.filter((s) => s.tier === 'CLD');
  const claSkills = CERTIFICATION_SKILLS.filter((s) => s.tier === 'CLA');

  assert.equal(cladSkills.length > 0, true);
  assert.equal(cldSkills.length > 0, true);
  assert.equal(claSkills.length > 0, true);
});

test('calculateTierReadiness reports 0% when no skills or labs are completed', () => {
  const readiness = calculateTierReadiness(new Set(), new Set());
  assert.equal(readiness.CLAD.percentage, 0);
  assert.equal(readiness.CLAD.status, 'In Training');
  assert.equal(readiness.CLD.percentage, 0);
  assert.equal(readiness.CLA.percentage, 0);
});

test('calculateTierReadiness credits skills when mapped lab is completed', () => {
  const readiness = calculateTierReadiness(new Set(), new Set(['lab-1']));
  assert.equal(readiness.CLAD.percentage > 0, true);
  assert.equal(readiness.CLAD.completedSkills >= 3, true);
});

test('calculateTierReadiness grants Ready for Exam when threshold is met', () => {
  const cladSkills = CERTIFICATION_SKILLS.filter((s) => s.tier === 'CLAD');
  const completedSkills = new Set(cladSkills.map((s) => s.id));

  const readiness = calculateTierReadiness(completedSkills, new Set());
  assert.equal(readiness.CLAD.percentage, 100);
  assert.equal(readiness.CLAD.status, 'Ready for Exam');
});

test('generateReadinessReport outputs tailored advice based on learner level', () => {
  const beginnerReadiness = calculateTierReadiness(new Set(), new Set());
  const report1 = generateReadinessReport(beginnerReadiness);
  assert.match(report1.summary, /CLAD fundamentals/);

  const allSkills = new Set(CERTIFICATION_SKILLS.map((s) => s.id));
  const masterReadiness = calculateTierReadiness(allSkills, new Set(['lab-1', 'lab-2', 'lab-3', 'lab-4']));
  const report2 = generateReadinessReport(masterReadiness);
  assert.match(report2.summary, /Outstanding achievement/);
});

test('getRecommendedLessonsForNextTier targets CLAD for beginners and lists missing CLAD lessons', () => {
  const analysis = getRecommendedLessonsForNextTier(new Set(), new Set());
  assert.equal(analysis.targetTier, 'CLAD');
  assert.equal(analysis.missingSkillsCount, 6);
  assert.equal(analysis.recommendedLessons.length, 6);

  // Check structure of first recommended lesson
  const first = analysis.recommendedLessons[0];
  assert.equal(first.tier, 'CLAD');
  assert.equal(Boolean(first.lessonTitle), true);
  assert.equal(Boolean(first.gapReason), true);
  assert.equal(Boolean(first.officialExamWeight), true);
});

test('getRecommendedLessonsForNextTier dynamically advances to CLD when CLAD is completed', () => {
  const cladSkills = CERTIFICATION_SKILLS.filter((s) => s.tier === 'CLAD');
  const completedSkills = new Set(cladSkills.map((s) => s.id));

  const analysis = getRecommendedLessonsForNextTier(completedSkills, new Set());
  assert.equal(analysis.targetTier, 'CLD');
  assert.equal(analysis.missingSkillsCount, 4);

  // Verify CLD recommended lessons contain State Machine & Producer-Consumer
  const titles = analysis.recommendedLessons.map((l) => l.skillName);
  assert.equal(titles.includes('Standard State Machine (SSM)'), true);
  assert.equal(titles.includes('Producer-Consumer Architecture'), true);
});

test('getRecommendedLessonsForNextTier advances to CLA when CLD is completed', () => {
  const cladAndCldSkills = CERTIFICATION_SKILLS.filter((s) => s.tier === 'CLAD' || s.tier === 'CLD');
  const completedSkills = new Set(cladAndCldSkills.map((s) => s.id));

  const analysis = getRecommendedLessonsForNextTier(completedSkills, new Set());
  assert.equal(analysis.targetTier, 'CLA');
  assert.equal(analysis.missingSkillsCount, 4);

  const titles = analysis.recommendedLessons.map((l) => l.skillName);
  assert.equal(titles.includes('NI-DAQmx Continuous Hardware Timing'), true);
  assert.equal(titles.includes('Nigel AI Prompting & G-Code Audit Engineering'), true);
});

test('getRecommendedLessonsForNextTier reports Master when all skills are completed', () => {
  const allSkills = new Set(CERTIFICATION_SKILLS.map((s) => s.id));
  const analysis = getRecommendedLessonsForNextTier(allSkills, new Set());

  assert.equal(analysis.targetTier, 'Master');
  assert.equal(analysis.missingSkillsCount, 0);
  assert.equal(analysis.recommendedLessons.length, 0);
  assert.equal(analysis.tierCompletionPercentage, 100);
});
