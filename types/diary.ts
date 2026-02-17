/**
 * 일기·Talk 5Q·연습 관련 도메인 타입 (UI/Repository 공통)
 */

/** Talk 5Q 질문 타입 (고정 순서: Fact → Detail → Reason → Feeling → Plan) */
export type TalkQuestionTemplate =
  | 'FACT'
  | 'DETAIL'
  | 'REASON'
  | 'FEELING'
  | 'PLAN';

/** 일기 한 건 (원문 + 교정 결과) */
export interface DiaryEntry {
  id: string;
  dateISO: string;
  content: string;
  correctedMinimal?: string;
  correctedNatural?: string;
  correctedUpgrade?: string;
  keySentences?: string[];
  createdAt: string;
}

/** 일기 교정/피드백 결과 (Fix & Read 단계) */
export interface DiaryFeedback {
  id: string;
  diaryId: string;
  correctedMinimal: string;
  correctedNatural: string;
  correctedUpgrade: string;
  notes?: string;
  keySentences: string[];
  createdAt: string;
}

/** Talk 5Q 질문 한 개 (타입 고정, 질문 문장만 AI 생성) */
export interface TalkQuestion {
  id: string;
  diaryId: string;
  template: TalkQuestionTemplate;
  question: string;
  order: number;
}

/** Talk 5Q 사용자 답변 + AI 피드백 */
export interface TalkAnswer {
  id: string;
  diaryId: string;
  questionIndex: number;
  question: string;
  userAnswer: string;
  feedbackMinimal?: string;
  feedbackNatural?: string;
  createdAt?: string;
}

/** 연습(5형식/시제 등) 시도 한 건 */
export interface PracticeAttempt {
  id: string;
  type: 'SENTENCE_PATTERN' | 'TENSE';
  prompt: string;
  userAnswer: string;
  isCorrect: boolean;
  feedback?: string;
  attemptedAt: string;
}
