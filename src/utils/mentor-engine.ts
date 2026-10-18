import { KNOWLEDGE_TOPICS, SUGGESTED_QUESTIONS, type KnowledgeTopic } from '../data/mentorKnowledge.ts';
import type { MentorPersonaId } from '../types';

export interface MentorReply {
  text: string;
  /** Topic ids that contributed, best match first. Empty when nothing matched. */
  topicIds: string[];
}

const OPENERS: Record<MentorPersonaId, string> = {
  professor: 'A well-chosen question. Let us reason about it from first principles.',
  mentor: 'Good one. Here is how this plays out on a real test system.',
  nigel: 'Let\'s approach this like an engineer working with an AI assistant.',
};

const NO_MATCH_INTRO: Record<MentorPersonaId, string> = {
  professor: 'I do not have a focused lesson on that exact phrasing yet, but the answer will almost always trace back to dataflow, error propagation or state.',
  mentor: 'I do not have a specific playbook for that wording, but most production issues come back to a few fundamentals.',
  nigel: 'I could not map that to one of my prompt-engineering topics, so here is the general approach.',
};

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s\-+*?]/g, ' ').replace(/\s+/g, ' ').trim();

/** Phrase hits count more than single words; whole-word match for single words avoids "can" ⊂ "scan". */
export function scoreTopic(topic: KnowledgeTopic, question: string): number {
  const q = ` ${normalize(question)} `;
  let score = 0;
  for (const keyword of topic.keywords) {
    const k = normalize(keyword);
    if (!k) continue;
    if (q.includes(` ${k} `) || q.includes(` ${k}s `) || (k.includes(' ') && q.includes(k))) {
      score += k.split(' ').length > 1 ? 3 : 1;
    }
  }
  return score;
}

export function rankTopics(question: string): { topic: KnowledgeTopic; score: number }[] {
  return KNOWLEDGE_TOPICS.map((topic) => ({ topic, score: scoreTopic(topic, question) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
}

/**
 * Answers a learner's question from the built-in knowledge base.
 * Pure and deterministic: no network, no API key, no usage limits.
 */
export function answerQuestion(persona: MentorPersonaId, question: string): MentorReply {
  const ranked = rankTopics(question);

  if (ranked.length === 0) {
    const first = KNOWLEDGE_TOPICS[0];
    return {
      topicIds: [],
      text: `${NO_MATCH_INTRO[persona]}

${first.answer}

**Try asking about:**
${SUGGESTED_QUESTIONS.map((q) => `- ${q}`).join('\n')}`,
    };
  }

  const [best, second] = ranked;
  const related =
    second && second.score >= Math.max(2, best.score / 2)
      ? `\n\n**Related:** ${second.topic.title}. ${second.topic.angle[persona]}`
      : '';

  return {
    topicIds: [best.topic.id, ...(related ? [second.topic.id] : [])],
    text: `${OPENERS[persona]}

### ${best.topic.title}

${best.topic.answer}

**${persona === 'professor' ? 'Theory' : persona === 'mentor' ? 'In production' : 'With Nigel AI'}:** ${best.topic.angle[persona]}${related}`,
  };
}
