import type { DiaryEntry, DiaryFeedback } from '@/types/diary';

/** 일기 초안 저장용 (날짜·내용 필수) */
export interface DiaryDraft {
  dateISO: string;
  content: string;
}

/**
 * 일기 저장소 인터페이스 (UI는 이 인터페이스만 사용 – RULE-7)
 * 구현체: MockDiaryRepository / PrismaDiaryRepository
 */
export interface DiaryRepository {
  /** 오늘 날짜 일기 조회 (없으면 null) */
  getToday(): Promise<DiaryEntry | null>;

  /** id로 일기 한 건 조회 */
  getById(id: string): Promise<DiaryEntry | null>;

  /** 일기 목록 (최신순) */
  list(): Promise<DiaryEntry[]>;

  /** 초안 저장 (새 일기 생성 또는 같은 날 덮어쓰기) */
  saveDraft(draft: DiaryDraft): Promise<DiaryEntry>;

  /** 완료 처리: 교정 결과 반영 후 저장 */
  complete(id: string, feedback: DiaryFeedback): Promise<DiaryEntry>;
}
