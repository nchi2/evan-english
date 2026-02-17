'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import styled from 'styled-components';
import {
  Button,
  Card,
  SectionCard,
  Chip,
  TabsRoot,
  Tab,
  Skeleton,
  EmptyStateRoot,
  EmptyStateTitle,
  EmptyStateDescription,
} from '@/components/ui';
import { MockDiaryRepository } from '@/repositories/MockDiaryRepository';
import { MockTalkRepository } from '@/repositories/MockTalkRepository';
import { getTalkPath } from '@/lib/routes';
import type { DiaryEntry } from '@/types/diary';

const diaryRepo = new MockDiaryRepository();
const talkRepo = new MockTalkRepository();

function wordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

const SummaryCard = styled(Card)`
  margin-bottom: 16px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
`;

const TextCard = styled(Card)`
  margin-bottom: 12px;
  white-space: pre-wrap;
  word-break: break-word;
`;

const CardHeader = styled.div<{ $clickable?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  cursor: ${(p) => (p.$clickable ? 'pointer' : 'default')};
`;

const CopyBtn = styled.button`
  padding: 6px 10px;
  font-size: 0.75rem;
  color: var(--muted);
  background: var(--surface-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  &:hover {
    color: var(--foreground);
  }
`;

const SentenceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
  &:last-child {
    border-bottom: none;
  }
`;

const SentenceText = styled.span`
  flex: 1;
  min-width: 0;
  font-size: 0.9375rem;
`;

const CTABar = styled.div`
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 0;
  padding-bottom: calc(16px + env(safe-area-inset-bottom, 0));
  background: var(--background);
  border-top: 1px solid var(--border);
  margin: 0 calc(-1 * var(--page-h-padding));
  padding-left: var(--page-h-padding);
  padding-right: var(--page-h-padding);
`;

const TAB_LABELS = ['Minimal Fix', 'Natural', 'Upgrade'] as const;
const CORRECTED_KEYS = ['correctedMinimal', 'correctedNatural', 'correctedUpgrade'] as const;

export default function DiaryResultPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';
  const [entry, setEntry] = useState<DiaryEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [originalExpanded, setOriginalExpanded] = useState(true);
  const [talkDone, setTalkDone] = useState(false);

  const copyToClipboard = useCallback((text: string) => {
    void navigator.clipboard.writeText(text);
  }, []);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setNotFound(true);
      return;
    }
    let cancelled = false;
    (async () => {
      const e = await diaryRepo.getById(id);
      if (cancelled) return;
      if (!e) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setEntry(e);
      const progress = await talkRepo.getProgress(id);
      if (cancelled) return;
      setTalkDone(progress.answers.length >= 5);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <>
        <Skeleton style={{ height: 80, marginBottom: 16 }} />
        <Skeleton style={{ height: 120, marginBottom: 16 }} />
        <Skeleton style={{ height: 100 }} />
      </>
    );
  }

  if (notFound || !entry) {
    return (
      <EmptyStateRoot>
        <EmptyStateTitle>Entry not found</EmptyStateTitle>
        <EmptyStateDescription>The diary entry could not be found.</EmptyStateDescription>
        <Link href="/">
          <Button $variant="primary">Home</Button>
        </Link>
      </EmptyStateRoot>
    );
  }

  const correctedText =
    entry[CORRECTED_KEYS[activeTab]] ?? entry.correctedMinimal ?? entry.correctedNatural ?? entry.correctedUpgrade ?? '';
  const keySentences = entry.keySentences ?? [];

  return (
    <>
      <SummaryCard>
        <SummaryRow>
          <span>{entry.dateISO}</span>
          <span>{wordCount(entry.content)} words</span>
          <Chip $variant={talkDone ? 'success' : entry.correctedMinimal ? 'warning' : 'default'}>
            {talkDone ? 'DONE' : entry.correctedMinimal ? 'GENERATED' : 'Draft'}
          </Chip>
        </SummaryRow>
      </SummaryCard>

      <SectionCard>
        <h3 style={{ marginBottom: 8 }}>Corrections</h3>
        <TabsRoot>
          {TAB_LABELS.map((label, i) => (
            <Tab key={label} $active={activeTab === i} onClick={() => setActiveTab(i)} type="button">
              {label}
            </Tab>
          ))}
        </TabsRoot>
        <TextCard>
          <div style={{ fontSize: '0.9375rem' }}>{correctedText || '—'}</div>
        </TextCard>
      </SectionCard>

      <SectionCard>
        <h3 style={{ marginBottom: 8 }}>Text Compare</h3>
        <TextCard>
          <CardHeader $clickable onClick={() => setOriginalExpanded((x) => !x)}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>Original {originalExpanded ? '▼' : '▶'}</span>
            <CopyBtn type="button" onClick={(e) => { e.stopPropagation(); copyToClipboard(entry.content); }}>
              Copy
            </CopyBtn>
          </CardHeader>
          {originalExpanded && <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{entry.content}</div>}
        </TextCard>
        <TextCard>
          <CardHeader>
            <span style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>{TAB_LABELS[activeTab]}</span>
            <CopyBtn type="button" onClick={() => copyToClipboard(correctedText)}>
              Copy
            </CopyBtn>
          </CardHeader>
          <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{correctedText || '—'}</div>
        </TextCard>
      </SectionCard>

      {keySentences.length > 0 && (
        <SectionCard>
          <h3 style={{ marginBottom: 8 }}>Key Sentences</h3>
          {keySentences.map((s, i) => (
            <SentenceRow key={i}>
              <SentenceText>{s}</SentenceText>
              <CopyBtn type="button" onClick={() => copyToClipboard(s)}>
                Copy
              </CopyBtn>
              <Button $variant="ghost" type="button" style={{ padding: '6px 10px', fontSize: '0.75rem' }}>
                Save 표현
              </Button>
            </SentenceRow>
          ))}
        </SectionCard>
      )}

      <CTABar>
        <Link href={getTalkPath(entry.id)} style={{ display: 'block' }}>
          <Button $variant="primary" style={{ width: '100%' }}>
            {talkDone ? 'Review Talk' : 'Continue → Talk 5Q'}
          </Button>
        </Link>
      </CTABar>
    </>
  );
}
