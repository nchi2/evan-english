'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Card, SectionCard } from '@/components/ui';
import { MockDiaryRepository } from '@/repositories/MockDiaryRepository';

const diaryRepo = new MockDiaryRepository();

const StatCard = styled(Card)`
  text-align: center;
  padding: 20px;
  margin-bottom: 12px;
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--foreground);
  line-height: 1.2;
`;

const StatLabel = styled.div`
  font-size: 0.8125rem;
  color: var(--muted);
  margin-top: 4px;
`;

const WeekActivity = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 80px;
  margin-top: 12px;
`;

const DayBar = styled.div<{ $height: number }>`
  flex: 1;
  min-width: 24px;
  height: ${(p) => p.$height}%;
  min-height: 4px;
  background: var(--accent);
  border-radius: var(--radius-sm);
  opacity: 0.9;
`;

const DayLabel = styled.div`
  font-size: 0.6875rem;
  color: var(--muted);
  text-align: center;
  margin-top: 6px;
`;

const WeekRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-end;
`;

/** 더미 주간 활동 (7일, 0~100%) */
const DUMMY_WEEK = [40, 80, 60, 100, 70, 0, 90];

export default function StatsPage() {
  const [totalEntries, setTotalEntries] = useState(0);

  useEffect(() => {
    diaryRepo.list().then((list) => setTotalEntries(list.length));
  }, []);

  const streak = 3;
  const talkRate = 80;

  return (
    <>
      <SectionCard>
        <h3 style={{ marginBottom: 12 }}>Stats</h3>
        <StatCard>
          <StatValue>{streak}</StatValue>
          <StatLabel>Streak (days)</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{totalEntries}</StatValue>
          <StatLabel>Total entries</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{talkRate}%</StatValue>
          <StatLabel>Talk completion rate</StatLabel>
        </StatCard>
      </SectionCard>

      <SectionCard>
        <h3 style={{ marginBottom: 12 }}>Week activity</h3>
        <WeekRow>
          {DUMMY_WEEK.map((h, i) => (
            <div key={i} style={{ flex: 1, minWidth: 24 }}>
              <DayBar $height={h} />
              <DayLabel>{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</DayLabel>
            </div>
          ))}
        </WeekRow>
      </SectionCard>
    </>
  );
}
