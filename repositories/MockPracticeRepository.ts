import type { PracticeAttempt } from '@/types/diary';
import type { PracticeRepository } from './PracticeRepository';

function generateId(): string {
  return `attempt-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** 하드코딩 더미 연습 시도 (UI FIRST용) */
const DUMMY_ATTEMPTS: PracticeAttempt[] = [
  {
    id: 'attempt-dummy-1',
    type: 'SENTENCE_PATTERN',
    prompt: 'Make a sentence with: I / go / school',
    userAnswer: 'I go to school.',
    isCorrect: true,
    feedback: 'Good!',
    attemptedAt: new Date().toISOString(),
  },
  {
    id: 'attempt-dummy-2',
    type: 'TENSE',
    prompt: 'Change to past: She walks to the park.',
    userAnswer: 'She walked to the park.',
    isCorrect: true,
    attemptedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const store: PracticeAttempt[] = [...DUMMY_ATTEMPTS];

export class MockPracticeRepository implements PracticeRepository {
  async saveAttempt(attempt: PracticeAttempt): Promise<PracticeAttempt> {
    const withId: PracticeAttempt = {
      ...attempt,
      id: attempt.id || generateId(),
      attemptedAt: attempt.attemptedAt || new Date().toISOString(),
    };
    store.unshift(withId);
    return withId;
  }

  listAttempts(): Promise<PracticeAttempt[]> {
    const list = [...store].sort(
      (a, b) => new Date(b.attemptedAt).getTime() - new Date(a.attemptedAt).getTime()
    );
    return Promise.resolve(list);
  }
}
