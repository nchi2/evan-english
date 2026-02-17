import type { TalkQuestion, TalkAnswer } from '@/types/diary';
import type { TalkProgress, TalkRepository } from './TalkRepository';

/** diaryId별 Q1~Q5 더미 질문 (고정 순서: FACT → DETAIL → REASON → FEELING → PLAN) */
function buildDummyQuestions(diaryId: string): TalkQuestion[] {
  return [
    { id: `q-${diaryId}-1`, diaryId, template: 'FACT', question: 'What did you do today?', order: 1 },
    { id: `q-${diaryId}-2`, diaryId, template: 'DETAIL', question: 'Can you describe it in more detail?', order: 2 },
    { id: `q-${diaryId}-3`, diaryId, template: 'REASON', question: 'Why did you do that?', order: 3 },
    { id: `q-${diaryId}-4`, diaryId, template: 'FEELING', question: 'How did you feel about it?', order: 4 },
    { id: `q-${diaryId}-5`, diaryId, template: 'PLAN', question: 'What will you do next?', order: 5 },
  ];
}

/** diaryId별 저장된 답변 (인메모리) */
const answersByDiary = new Map<string, TalkAnswer[]>();

function generateAnswerId(): string {
  return `answer-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export class MockTalkRepository implements TalkRepository {
  getQuestions(diaryId: string): Promise<TalkQuestion[]> {
    return Promise.resolve(buildDummyQuestions(diaryId));
  }

  async saveAnswer(answer: TalkAnswer): Promise<TalkAnswer> {
    const list = answersByDiary.get(answer.diaryId) ?? [];
    const withId = { ...answer, id: answer.id || generateAnswerId() };
    const idx = list.findIndex((a) => a.questionIndex === withId.questionIndex);
    const next = [...list];
    if (idx >= 0) next[idx] = withId;
    else next.push(withId);
    next.sort((a, b) => a.questionIndex - b.questionIndex);
    answersByDiary.set(answer.diaryId, next);
    return withId;
  }

  async getProgress(diaryId: string): Promise<TalkProgress> {
    const answers = answersByDiary.get(diaryId) ?? [];
    const total = 5;
    const currentIndex = answers.length < total ? answers.length : total - 1;
    return {
      currentIndex,
      total,
      answers,
    };
  }
}
