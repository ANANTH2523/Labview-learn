import test from 'node:test';
import assert from 'node:assert/strict';
import {
  canConnectWire,
  computePID,
  computeMovingAverage,
  isNodeReadyToExecute,
  mergeErrors,
} from './labview-engine.ts';
import { evaluateNigelPrompt } from './nigel-evaluator.ts';

test('Wire compatibility allows identical wire types without coercion', () => {
  const result = canConnectWire('double', 'double');
  assert.equal(result.compatible, true);
  assert.equal(result.coerced, false);
});

test('Wire compatibility coerces i32 into double with coercion dot', () => {
  const result = canConnectWire('i32', 'double');
  assert.equal(result.compatible, true);
  assert.equal(result.coerced, true);
});

test('Wire compatibility rejects mismatched string to boolean with broken wire message', () => {
  const result = canConnectWire('string', 'boolean');
  assert.equal(result.compatible, false);
  assert.match(result.errorReason || '', /Cannot wire STRING output into BOOLEAN/);
});

test('G-Dataflow execution gate checks that all required inputs are present', () => {
  assert.equal(isNodeReadyToExecute(['in1', 'in2'], { in1: 42, in2: 10 }), true);
  assert.equal(isNodeReadyToExecute(['in1', 'in2'], { in1: 42 }), false);
});

test('LabVIEW PID computation regulates properly and clamps output limits', () => {
  const initialState = { integralSum: 0, prevError: 0 };
  const step = computePID(50, 40, 2.0, 0.5, 0.1, 1.0, initialState);
  // Error = 10, Kp*10 = 20, Ki*10 = 5, Kd*(10-0)=1 -> 26
  assert.equal(step.output > 0, true);
  assert.equal(step.output <= 100, true);
  assert.equal(step.updatedState.prevError, 10);
});

test('Moving average computes correct window average', () => {
  const samples = [10, 20, 30, 40, 50];
  const avg = computeMovingAverage(samples, 3);
  // Last 3 are 30, 40, 50 -> avg = 40
  assert.equal(avg, 40);
});

test('Error cluster merger propagates first active error', () => {
  const err1 = { status: false, code: 0, source: '' };
  const err2 = { status: true, code: 56, source: 'VISA Read.vi' };
  const merged = mergeErrors(err1, err2);
  assert.equal(merged.status, true);
  assert.equal(merged.code, 56);
  assert.equal(merged.source, 'VISA Read.vi');
});

test('Nigel prompt evaluator grades comprehensive CLA-grade prompts highly', () => {
  const prompt = `Design a Producer-Consumer Queued Message Handler in LabVIEW for NI-DAQmx multi-channel voltage acquisition.
Connector Pane: Input VISA Resource top-left, Error In bottom-left, Output Waveform Array top-right, Error Out bottom-right.
Trap timeout error 56 and ensure no local variables are used to prevent race conditions. Pre-allocate buffer arrays.`;

  const result = evaluateNigelPrompt(prompt);
  assert.equal(result.score >= 80, true);
  assert.equal(result.dataflowReadiness, 'Production Ready');
  assert.equal(result.strengths.length >= 4, true);
});

test('Nigel prompt evaluator flags vague novice prompts and offers concrete guidance', () => {
  const prompt = 'Make a labview program to read temperature';
  const result = evaluateNigelPrompt(prompt);
  assert.equal(result.score < 60, true);
  assert.equal(result.missingElements.length > 0, true);
});

// Import certification tracker logic
import {
  calculateTierReadiness,
  getRecommendedLessonsForNextTier,
  getRecommendedLessons,
} from './certification-tracker.ts';

test('calculateTierReadiness maps completed labs and skills to certification tiers', () => {
  const completedSkillIds = new Set(['clad-dataflow', 'clad-shift-registers']);
  const completedLabIds = new Set(['lab-1']); // lab-1 covers clad-dataflow, clad-shift-registers, clad-wire-coercion, cla-hardware-timed-daq

  const readiness = calculateTierReadiness(completedSkillIds, completedLabIds);
  assert.ok(readiness.CLAD);
  assert.ok(readiness.CLD);
  assert.ok(readiness.CLA);

  // CLAD has 6 skills, lab-1 + skills satisfy at least 3
  assert.ok(readiness.CLAD.completedSkills >= 3);
  assert.ok(readiness.CLAD.percentage > 0);
  assert.equal(typeof readiness.CLAD.status, 'string');
});

test('getRecommendedLessonsForNextTier targets CLAD when CLAD skills are incomplete', () => {
  const completedSkillIds = new Set(['clad-dataflow']);
  const completedLabIds = new Set<string>();

  const analysis = getRecommendedLessonsForNextTier(completedSkillIds, completedLabIds);
  assert.equal(analysis.targetTier, 'CLAD');
  assert.ok(analysis.missingSkillsCount > 0);
  assert.ok(analysis.recommendedLessons.length > 0);

  // First recommended lesson should have title, lessonId, gapReason, and officialExamWeight
  const firstLesson = analysis.recommendedLessons[0];
  assert.ok(firstLesson.lessonId);
  assert.ok(firstLesson.lessonTitle);
  assert.ok(firstLesson.gapReason);
  assert.ok(firstLesson.officialExamWeight);
  assert.equal(firstLesson.tier, 'CLAD');
});

test('getRecommendedLessonsForNextTier advances to CLD when CLAD is fully satisfied', () => {
  // All 6 CLAD skills completed
  const cladSkills = [
    'clad-dataflow',
    'clad-shift-registers',
    'clad-wire-coercion',
    'clad-subvi-pane',
    'clad-error-cluster',
    'clad-mechanical-actions',
  ];
  const completedSkillIds = new Set(cladSkills);
  const completedLabIds = new Set<string>();

  const analysis = getRecommendedLessonsForNextTier(completedSkillIds, completedLabIds);
  assert.equal(analysis.targetTier, 'CLD');
  assert.ok(analysis.missingSkillsCount > 0);
  assert.ok(analysis.recommendedLessons.some((l) => l.tier === 'CLD'));
});

test('getRecommendedLessons helper directly returns recommended lessons list', () => {
  const lessons = getRecommendedLessons(['clad-dataflow'], []);
  assert.ok(Array.isArray(lessons));
  assert.ok(lessons.length > 0);
  assert.equal(lessons[0].tier, 'CLAD');
});

import { calculateDomainProficiency } from './certification-tracker.ts';

test('calculateDomainProficiency returns metrics for Dataflow, Architecture, Hardware Interfacing, and UI Design', () => {
  const domains = calculateDomainProficiency(['clad-dataflow', 'clad-shift-registers'], ['lab-1']);
  assert.equal(domains.length, 4);

  const domainNames = domains.map((d) => d.domain);
  assert.ok(domainNames.includes('Dataflow'));
  assert.ok(domainNames.includes('Architecture'));
  assert.ok(domainNames.includes('Hardware Interfacing'));
  assert.ok(domainNames.includes('UI Design'));

  // Dataflow should have mastered skills from clad-dataflow, clad-shift-registers and lab-1
  const dataflow = domains.find((d) => d.domain === 'Dataflow');
  assert.ok(dataflow);
  assert.ok(dataflow.masteredCount >= 2);
  assert.ok(dataflow.proficiency > 0);
  assert.equal(dataflow.benchmark, 80);

  // Hardware interfacing should have cla-hardware-timed-daq mastered via lab-1
  const hw = domains.find((d) => d.domain === 'Hardware Interfacing');
  assert.ok(hw);
  assert.ok(hw.masteredCount >= 1);
});

import {
  LABVIEW_RESOURCES,
  filterResources,
  generateWhitepaperDocumentText,
} from '../data/resourceLibraryData.ts';

test('filterResources accurately filters by difficulty level', () => {
  const cladResources = filterResources(LABVIEW_RESOURCES, { difficulty: 'CLAD' });
  assert.ok(cladResources.length > 0);
  assert.ok(cladResources.every((r) => r.difficulty === 'CLAD' || r.difficulty === 'ALL'));

  const cldResources = filterResources(LABVIEW_RESOURCES, { difficulty: 'CLD' });
  assert.ok(cldResources.length > 0);
  assert.ok(cldResources.every((r) => r.difficulty === 'CLD' || r.difficulty === 'ALL'));

  const claResources = filterResources(LABVIEW_RESOURCES, { difficulty: 'CLA' });
  assert.ok(claResources.length > 0);
  assert.ok(claResources.every((r) => r.difficulty === 'CLA' || r.difficulty === 'ALL'));
});

test('filterResources accurately filters by category type', () => {
  const whitepapers = filterResources(LABVIEW_RESOURCES, { category: 'whitepaper' });
  assert.ok(whitepapers.length > 0);
  assert.ok(whitepapers.every((r) => r.category === 'whitepaper'));

  const officialDocs = filterResources(LABVIEW_RESOURCES, { category: 'official_doc' });
  assert.ok(officialDocs.length > 0);
  assert.ok(officialDocs.every((r) => r.category === 'official_doc'));

  const forums = filterResources(LABVIEW_RESOURCES, { category: 'community_forum' });
  assert.ok(forums.length > 0);
  assert.ok(forums.every((r) => r.category === 'community_forum'));
});

test('filterResources filters by search query and bookmarks', () => {
  const searchResults = filterResources(LABVIEW_RESOURCES, { searchQuery: 'Actor Framework' });
  assert.ok(searchResults.length > 0);
  assert.ok(searchResults.some((r) => r.title.includes('Actor Framework')));

  const bookmarked = filterResources(LABVIEW_RESOURCES, {
    bookmarkedOnly: true,
    bookmarkedIds: ['clad-core-1-2-manual', 'cld-style-guide-blume'],
  });
  assert.equal(bookmarked.length, 2);
});

test('generateWhitepaperDocumentText formats complete technical briefing', () => {
  const resource = LABVIEW_RESOURCES[0];
  const doc = generateWhitepaperDocumentText(resource);
  assert.ok(doc.includes(resource.title));
  assert.ok(doc.includes('Executive Architecture Summary'));
  assert.ok(doc.includes(resource.publisher));
  assert.ok(doc.includes('Crucial Architectural Takeaways'));
});


