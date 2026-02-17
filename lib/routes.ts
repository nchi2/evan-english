/**
 * 앱 라우트 정의
 *
 * - 하단 탭: Home / Diary / Practice / Stats (4개만)
 * - Talk는 탭에 없음. Diary 완료 후 /talk/[diaryId] 로 자동 진입하는 단계 전용 경로.
 */

/** 탭에 노출되는 경로 (Talk 제외) */
export const PATH = {
  HOME: '/',
  DIARY: '/diary',
  PRACTICE: '/practice',
  STATS: '/stats',
} as const;

/** Talk 5Q 페이지 경로 (탭 메뉴 없음, Diary 완료 후 자동 이동) */
export function getTalkPath(diaryId: string): string {
  return `/talk/${diaryId}`;
}

/** 하단 탭용 라우트 목록 – 4탭만, Talk 미포함 */
export const BOTTOM_TAB_ROUTES = [
  { path: PATH.HOME, label: 'Home' },
  { path: PATH.DIARY, label: 'Diary' },
  { path: PATH.PRACTICE, label: 'Practice' },
  { path: PATH.STATS, label: 'Stats' },
] as const;
