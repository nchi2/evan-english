/**
 * 오늘 흐름 상태 (Today Dashboard용)
 */
export type TodayStatus =
  | 'NOT_STARTED'
  | 'WRITING'
  | 'GENERATED'
  | 'TALKING'
  | 'DONE';

export interface TodayStatusResult {
  status: TodayStatus;
  todayEntryId: string | null;
  talkAnswersCount: number;
}
