import type { DiaryEntry, DiaryFeedback } from '@/types/diary';
import type { DiaryDraft, DiaryRepository } from './DiaryRepository';

function getTodayDateISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function generateId(): string {
  return `diary-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** 하드코딩 더미 일기 (UI FIRST용) */
const DUMMY_ENTRIES: DiaryEntry[] = [
  {
    id: 'diary-dummy-1',
    dateISO: getTodayDateISO(),
    content: 'Today I went to the park. It was sunny.',
    correctedMinimal: 'Today I went to the park. It was sunny.',
    correctedNatural: 'Today I went to the park. The weather was nice.',
    correctedUpgrade: 'I spent the afternoon at the park under clear skies.',
    keySentences: ['Today I went to the park.', 'It was sunny.'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'diary-dummy-2',
    dateISO: '2025-02-12',
    content: 'I studied English for one hour.',
    createdAt: '2025-02-12T10:00:00.000Z',
  },
];

/** 인메모리 저장소 (saveDraft/complete 시 갱신) */
const store = new Map<string, DiaryEntry>(
  DUMMY_ENTRIES.map((e) => [e.id, { ...e }])
);

/** 날짜별 id 매핑 (getToday용) */
const byDate = new Map<string, string>();
DUMMY_ENTRIES.forEach((e) => byDate.set(e.dateISO, e.id));

export class MockDiaryRepository implements DiaryRepository {
  getToday(): Promise<DiaryEntry | null> {
    const dateISO = getTodayDateISO();
    const id = byDate.get(dateISO);
    if (!id) return Promise.resolve(null);
    const entry = store.get(id);
    return Promise.resolve(entry ?? null);
  }

  getById(id: string): Promise<DiaryEntry | null> {
    return Promise.resolve(store.get(id) ?? null);
  }

  list(): Promise<DiaryEntry[]> {
    const list = Array.from(store.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return Promise.resolve(list);
  }

  async saveDraft(draft: DiaryDraft): Promise<DiaryEntry> {
    const existingId = byDate.get(draft.dateISO);
    const now = new Date().toISOString();
    const entry: DiaryEntry = {
      id: existingId ?? generateId(),
      dateISO: draft.dateISO,
      content: draft.content,
      createdAt: existingId ? store.get(existingId)?.createdAt ?? now : now,
    };
    if (existingId) {
      const existing = store.get(existingId);
      if (existing) entry.createdAt = existing.createdAt;
    } else {
      byDate.set(draft.dateISO, entry.id);
    }
    store.set(entry.id, entry);
    return entry;
  }

  async complete(id: string, feedback: DiaryFeedback): Promise<DiaryEntry> {
    const entry = store.get(id);
    if (!entry) throw new Error(`Diary not found: ${id}`);
    const updated: DiaryEntry = {
      ...entry,
      correctedMinimal: feedback.correctedMinimal,
      correctedNatural: feedback.correctedNatural,
      correctedUpgrade: feedback.correctedUpgrade,
      keySentences: feedback.keySentences,
    };
    store.set(id, updated);
    return updated;
  }
}
