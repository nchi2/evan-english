'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { Button, Card, SectionCard, Chip, EmptyStateRoot, EmptyStateTitle, EmptyStateDescription } from '@/components/ui';
import { MockDiaryRepository } from '@/repositories/MockDiaryRepository';
import { MockTalkRepository } from '@/repositories/MockTalkRepository';
import type { DiaryEntry } from '@/types/diary';
import type { TodayStatus } from '@/lib/todayStatus';
import { PATH, getTalkPath } from '@/lib/routes';

const diaryRepo = new MockDiaryRepository();
const talkRepo = new MockTalkRepository();

const FlowCard = styled(Card)`
  margin-bottom: 20px;
`;

const StepRow = styled.div<{ $done?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
  opacity: ${(p) => (p.$done ? 0.9 : 1)};

  &:last-child {
    border-bottom: none;
  }
`;

const StepLabel = styled.div`
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--foreground);
`;

const StepDesc = styled.div`
  font-size: 0.8125rem;
  color: var(--muted);
  margin-top: 2px;
`;

const CTABar = styled.div`
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
`;

const StatCard = styled(Card)`
  text-align: center;
  padding: 12px;
`;

const StatValue = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--foreground);
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: var(--muted);
  margin-top: 2px;
`;

const EntryRow = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
  color: inherit;
  text-decoration: none;

  &:last-child {
    border-bottom: none;
  }
`;

const EntrySummary = styled.div`
  flex: 1;
  min-width: 0;
`;

const EntryDate = styled.div`
  font-size: 0.8125rem;
  color: var(--muted);
`;

const EntryText = styled.div`
  font-size: 0.875rem;
  color: var(--foreground);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
`;

const STEPS: { key: TodayStatus; label: string; desc: string }[] = [
  { key: 'NOT_STARTED', label: 'Write', desc: '영어로 일기 작성' },
  { key: 'WRITING', label: 'Fix', desc: '교정 결과 확인' },
  { key: 'GENERATED', label: 'Talk', desc: '5문답에 답하기' },
  { key: 'DONE', label: 'Practice', desc: '문법 연습 (선택)' },
];

function getStepStatus(status: TodayStatus, stepIndex: number): 'LOCKED' | 'READY' | 'IN_PROGRESS' | 'DONE' {
  const order: TodayStatus[] = ['NOT_STARTED', 'WRITING', 'GENERATED', 'TALKING', 'DONE'];
  const currentIdx = order.indexOf(status);
  if (stepIndex < currentIdx) return 'DONE';
  if (stepIndex === currentIdx) {
    if (status === 'NOT_STARTED') return 'READY';
    if (status === 'DONE') return 'DONE';
    return 'IN_PROGRESS';
  }
  return 'LOCKED';
}

function getCTALabel(status: TodayStatus): string {
  switch (status) {
    case 'NOT_STARTED':
      return 'Start Today';
    case 'WRITING':
      return 'Continue Writing';
    case 'GENERATED':
    case 'TALKING':
      return status === 'TALKING' ? 'Continue Talk' : 'Go to Result';
    case 'DONE':
      return 'Review Today';
    default:
      return 'Start Today';
  }
}

function getCTALink(status: TodayStatus, todayId: string | null): string {
  switch (status) {
    case 'NOT_STARTED':
    case 'WRITING':
      return '/diary/write';
    case 'GENERATED':
      return todayId ? `/diary/result/${todayId}` : '/diary';
    case 'TALKING':
      return todayId ? getTalkPath(todayId) : '/diary';
    case 'DONE':
      return todayId ? `/diary/result/${todayId}` : '/';
    default:
      return '/diary/write';
  }
}

function summarize(content: string, max = 40): string {
  const t = content.replace(/\s+/g, ' ').trim();
  return t.length <= max ? t : t.slice(0, max) + '…';
}

export default function Home() {
  const [status, setStatus] = useState<TodayStatus>('NOT_STARTED');
  const [todayId, setTodayId] = useState<string | null>(null);
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [talkCount, setTalkCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const today = await diaryRepo.getToday();
      const list = await diaryRepo.list();
      if (cancelled) return;
      if (today) {
        setTodayId(today.id);
        const progress = await talkRepo.getProgress(today.id);
        if (cancelled) return;
        setTalkCount(progress.answers.length);
        if (progress.answers.length >= 5) setStatus('DONE');
        else if (progress.answers.length > 0) setStatus('TALKING');
        else if (today.correctedMinimal) setStatus('GENERATED');
        else setStatus('WRITING');
      } else {
        setStatus('NOT_STARTED');
      }
      setEntries(list.slice(0, 3));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const ctaLabel = getCTALabel(status);
  const ctaHref = getCTALink(status, todayId);

  return (
    <>
      <FlowCard>
        <h2 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 12 }}>Today Flow</h2>
        {STEPS.map((step, i) => {
          const stepStatus = getStepStatus(status, i);
          return (
            <StepRow key={step.key} $done={stepStatus === 'DONE'}>
              <div>
                <StepLabel>
                  {step.label} {stepStatus === 'DONE' && '✓'}
                </StepLabel>
                <StepDesc>{step.desc}</StepDesc>
              </div>
              <Chip $variant={stepStatus === 'DONE' ? 'success' : stepStatus === 'LOCKED' ? 'default' : 'warning'}>
                {stepStatus}
              </Chip>
            </StepRow>
          );
        })}
        <CTABar>
          <Link href={ctaHref} style={{ display: 'block' }}>
            <Button $variant="primary" style={{ width: '100%' }}>
              {ctaLabel}
            </Button>
          </Link>
        </CTABar>
      </FlowCard>

      <SectionCard>
        <h3>Quick Stats</h3>
        <StatsRow>
          <StatCard>
            <StatValue>3</StatValue>
            <StatLabel>Streak</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{entries.length}</StatValue>
            <StatLabel>Entries</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>80%</StatValue>
            <StatLabel>Talk rate</StatLabel>
          </StatCard>
        </StatsRow>
      </SectionCard>

      <SectionCard>
        <h3>Recent Entries</h3>
        {entries.length === 0 ? (
          <EmptyStateRoot>
            <EmptyStateTitle>No entries yet</EmptyStateTitle>
            <EmptyStateDescription>Start your first diary.</EmptyStateDescription>
            <Link href="/diary/write">
              <Button $variant="primary">Start Today</Button>
            </Link>
          </EmptyStateRoot>
        ) : (
          entries.map((e) => (
            <EntryRow key={e.id} href={`/diary/result/${e.id}`}>
              <EntrySummary>
                <EntryDate>{e.dateISO}</EntryDate>
                <EntryText>{summarize(e.content)}</EntryText>
              </EntrySummary>
              <Chip $variant={e.correctedMinimal ? (talkCount >= 5 && e.id === todayId ? 'success' : 'warning') : 'default'}>
                {e.correctedMinimal ? (e.id === todayId && talkCount >= 5 ? 'DONE' : 'Generated') : 'Draft'}
              </Chip>
            </EntryRow>
          ))
        )}
      </SectionCard>
    </>
  );
}
