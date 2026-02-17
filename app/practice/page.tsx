'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { Button, Card, SectionCard, Chip, EmptyStateRoot, EmptyStateTitle, EmptyStateDescription } from '@/components/ui';
import { MockPracticeRepository } from '@/repositories/MockPracticeRepository';
import type { PracticeAttempt } from '@/types/diary';

const practiceRepo = new MockPracticeRepository();

const PracticeCard = styled(Card)`
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PracticeTitle = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: var(--foreground);
`;

const PracticeDesc = styled.p`
  font-size: 0.875rem;
  color: var(--muted);
  margin: 0;
`;

const AttemptRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
  font-size: 0.875rem;

  &:last-child {
    border-bottom: none;
  }
`;

const PRACTICE_CARDS = [
  {
    path: '/practice/sentence-type',
    title: 'Sentence Type',
    desc: '5형식 문장 만들기. 제시 단어로 목표 형식 문장을 써 보세요.',
  },
  {
    path: '/practice/transform',
    title: 'Transform',
    desc: '문장 변환. 원문을 목표 형태(수동·시제 등)로 바꿔 쓰기.',
  },
  {
    path: '/practice/tense',
    title: 'Tense',
    desc: '시제 연습. 현재→과거, 미래 완료 등 시제 바꿔 쓰기.',
  },
] as const;

function formatAttemptDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return iso.slice(0, 10);
  }
}

export default function PracticePage() {
  const [attempts, setAttempts] = useState<PracticeAttempt[]>([]);

  useEffect(() => {
    practiceRepo.listAttempts().then(setAttempts);
  }, []);

  const recentAttempts = attempts.slice(0, 5);

  return (
    <>
      <SectionCard>
        <h3 style={{ marginBottom: 12 }}>Practice</h3>
        {PRACTICE_CARDS.map(({ path, title, desc }) => (
          <PracticeCard key={path}>
            <PracticeTitle>{title}</PracticeTitle>
            <PracticeDesc>{desc}</PracticeDesc>
            <Link href={path}>
              <Button $variant="primary" style={{ alignSelf: 'flex-start' }}>
                Start
              </Button>
            </Link>
          </PracticeCard>
        ))}
      </SectionCard>

      <SectionCard>
        <h3 style={{ marginBottom: 12 }}>Recent Attempts</h3>
        {recentAttempts.length === 0 ? (
          <EmptyStateRoot>
            <EmptyStateTitle>No practice yet</EmptyStateTitle>
            <EmptyStateDescription>Try Sentence Type, Transform, or Tense.</EmptyStateDescription>
          </EmptyStateRoot>
        ) : (
          recentAttempts.map((a) => (
            <AttemptRow key={a.id}>
              <span>{a.type === 'SENTENCE_PATTERN' ? '5형식' : '시제'}</span>
              <span style={{ color: 'var(--muted)', fontSize: '0.8125rem' }}>{formatAttemptDate(a.attemptedAt)}</span>
              <Chip $variant={a.isCorrect ? 'success' : 'error'}>{a.isCorrect ? 'Correct' : 'Wrong'}</Chip>
            </AttemptRow>
          ))
        )}
      </SectionCard>
    </>
  );
}
