import type { PracticeAttempt } from '@/types/diary';

/**
 * 연습(5형식/시제) 저장소 인터페이스 (UI는 이 인터페이스만 사용 – RULE-7)
 * 구현체: MockPracticeRepository / PrismaPracticeRepository
 */
export interface PracticeRepository {
  /** 연습 시도 한 건 저장 */
  saveAttempt(attempt: PracticeAttempt): Promise<PracticeAttempt>;

  /** 연습 시도 목록 (최신순) */
  listAttempts(): Promise<PracticeAttempt[]>;
}
