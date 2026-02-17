import type { TalkQuestion, TalkAnswer } from '@/types/diary';

/** Talk 5Q 진행 상태 (진행률·저장된 답변) */
export interface TalkProgress {
  currentIndex: number;
  total: number;
  answers: TalkAnswer[];
}

/**
 * Talk 5Q 저장소 인터페이스 (UI는 이 인터페이스만 사용 – RULE-7)
 * 구현체: MockTalkRepository / PrismaTalkRepository
 */
export interface TalkRepository {
  /** 해당 일기의 Talk 질문 5개 조회 (order 순) */
  getQuestions(diaryId: string): Promise<TalkQuestion[]>;

  /** 답변 저장 (해당 질문 인덱스 덮어쓰기 또는 추가) */
  saveAnswer(answer: TalkAnswer): Promise<TalkAnswer>;

  /** 해당 일기 Talk 진행 상태 (현재 질문 인덱스, 답변 목록) */
  getProgress(diaryId: string): Promise<TalkProgress>;
}
