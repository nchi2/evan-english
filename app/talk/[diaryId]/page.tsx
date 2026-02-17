'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styled from 'styled-components';
import {
  Button,
  Card,
  Chip,
  Textarea,
  ProgressBarTrack,
  ProgressBarFill,
  EmptyStateRoot,
  EmptyStateTitle,
  EmptyStateDescription,
} from '@/components/ui';
import { MockTalkRepository } from '@/repositories/MockTalkRepository';
import type { TalkQuestion } from '@/types/diary';

const talkRepo = new MockTalkRepository();

const ProgressHeader = styled.div`
  margin-bottom: 16px;
`;

const ProgressLabel = styled.div`
  font-size: 0.875rem;
  color: var(--muted);
  margin-bottom: 6px;
`;

const QuestionCard = styled(Card)`
  margin-bottom: 16px;
  font-size: 1.125rem;
  font-weight: 500;
  line-height: 1.4;
`;

const HintToggle = styled.button`
  margin-top: 10px;
  padding: 6px 0;
  font-size: 0.8125rem;
  color: var(--muted);
  background: none;
  border: none;
  cursor: pointer;
  &:hover {
    color: var(--foreground);
  }
`;

const HintText = styled.div`
  margin-top: 6px;
  padding: 8px;
  font-size: 0.875rem;
  color: var(--muted);
  background: var(--surface-elevated);
  border-radius: var(--radius-sm);
`;

const FeedbackPanel = styled(Card)`
  margin-top: 16px;
  margin-bottom: 16px;
`;

const FeedbackTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--muted);
  text-transform: uppercase;
  margin-bottom: 6px;
`;

const ActionBar = styled.div`
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 12px;
  padding: 12px 0;
  padding-bottom: calc(12px + env(safe-area-inset-bottom, 0));
  background: var(--background);
  border-top: 1px solid var(--border);
  margin: 0 calc(-1 * var(--page-h-padding));
  padding-left: var(--page-h-padding);
  padding-right: var(--page-h-padding);
`;

export default function TalkPage() {
  const params = useParams();
  const router = useRouter();
  const diaryId = typeof params?.diaryId === 'string' ? params.diaryId : '';
  const [questions, setQuestions] = useState<TalkQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [hintOpen, setHintOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savedAnswer, setSavedAnswer] = useState<string | null>(null);

  const total = 5;
  const question = questions[currentIndex];
  const progressPercent = total > 0 ? ((currentIndex + 1) / total) * 100 : 0;
  const existingAnswer = savedAnswer ?? '';

  useEffect(() => {
    if (!diaryId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const [qs, progress] = await Promise.all([
        talkRepo.getQuestions(diaryId),
        talkRepo.getProgress(diaryId),
      ]);
      if (cancelled) return;
      setQuestions(qs);
      if (progress.answers.length >= total) {
        router.replace('/');
        return;
      }
      setCurrentIndex(progress.answers.length);
      const current = progress.answers.find((a) => a.questionIndex === progress.answers.length);
      setSavedAnswer(current?.userAnswer ?? null);
      setAnswer(current?.userAnswer ?? '');
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [diaryId, total, router]);

  const handleNext = useCallback(async () => {
    if (!question || !diaryId) return;
    await talkRepo.saveAnswer({
      id: '',
      diaryId,
      questionIndex: currentIndex,
      question: question.question,
      userAnswer: answer.trim(),
    });
    setSavedAnswer(answer.trim());
    if (currentIndex >= total - 1) {
      router.replace('/');
      return;
    }
    setCurrentIndex((i) => i + 1);
    setAnswer('');
    setSavedAnswer(null);
    setHintOpen(false);
  }, [question, diaryId, currentIndex, answer, total, router]);

  const handlePrevious = useCallback(() => {
    if (currentIndex <= 0) return;
    setCurrentIndex((i) => i - 1);
    setHintOpen(false);
  }, [currentIndex]);

  // Reload saved answer when changing question (from progress)
  useEffect(() => {
    if (!diaryId || questions.length === 0) return;
    let cancelled = false;
    talkRepo.getProgress(diaryId).then((progress) => {
      if (cancelled) return;
      const a = progress.answers.find((x) => x.questionIndex === currentIndex);
      setSavedAnswer(a?.userAnswer ?? null);
      setAnswer(a?.userAnswer ?? '');
    });
    return () => {
      cancelled = true;
    };
  }, [diaryId, currentIndex, questions.length]);

  if (loading || questions.length === 0) {
    return (
      <EmptyStateRoot>
        <EmptyStateTitle>Loading...</EmptyStateTitle>
      </EmptyStateRoot>
    );
  }

  if (!question) {
    return (
      <EmptyStateRoot>
        <EmptyStateTitle>No questions</EmptyStateTitle>
        <EmptyStateDescription>Complete your diary first.</EmptyStateDescription>
        <Button $variant="primary" onClick={() => router.push('/')}>
          Home
        </Button>
      </EmptyStateRoot>
    );
  }

  const isFirst = currentIndex === 0;
  const isLast = currentIndex >= total - 1;
  const canNext = answer.trim().length > 0;

  return (
    <>
      <ProgressHeader>
        <ProgressLabel>
          Question {currentIndex + 1} of {total}
        </ProgressLabel>
        <ProgressBarTrack>
          <ProgressBarFill $percent={progressPercent} />
        </ProgressBarTrack>
        <Chip style={{ marginTop: 8 }}>{question.template}</Chip>
      </ProgressHeader>

      <QuestionCard>
        {question.question}
        <HintToggle type="button" onClick={() => setHintOpen((x) => !x)}>
          {hintOpen ? 'Hide Hint' : 'Hint'}
        </HintToggle>
        {hintOpen && <HintText>Try to answer in one or two sentences. (더미 힌트)</HintText>}
      </QuestionCard>

      <div style={{ marginBottom: 16 }}>
        <Textarea
          placeholder="Type your answer..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          style={{ minHeight: 100 }}
        />
      </div>

      <FeedbackPanel>
        <FeedbackTitle>Minimal Fix</FeedbackTitle>
        <div style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>—</div>
        <FeedbackTitle style={{ marginTop: 12 }}>Natural</FeedbackTitle>
        <div style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>—</div>
        <Button $variant="secondary" type="button" style={{ marginTop: 8, fontSize: '0.8125rem' }}>
          Paste Feedback
        </Button>
      </FeedbackPanel>

      <ActionBar>
        <Button $variant="secondary" onClick={handlePrevious} disabled={isFirst} style={{ flex: 1 }}>
          Previous
        </Button>
        <Button
          $variant="primary"
          onClick={handleNext}
          disabled={!canNext}
          style={{ flex: 1 }}
        >
          {isLast ? 'Finish' : 'Next'}
        </Button>
      </ActionBar>
    </>
  );
}
