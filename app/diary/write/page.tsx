'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { Button, Textarea, InlineAlert } from '@/components/ui';
import { MockDiaryRepository } from '@/repositories/MockDiaryRepository';

const diaryRepo = new MockDiaryRepository();

function getTodayDateISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function wordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

const Subtext = styled.p`
  font-size: 0.875rem;
  color: var(--muted);
  margin-bottom: 16px;
`;

const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8125rem;
  color: var(--muted);
  margin-bottom: 12px;
`;

const TextareaWrap = styled.div`
  min-height: 40vh;
  margin-bottom: 16px;
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

const AlertWrap = styled.div`
  margin-bottom: 12px;
`;

export default function DiaryWritePage() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSaveDraft = useCallback(async () => {
    const draft = { dateISO: getTodayDateISO(), content };
    await diaryRepo.saveDraft(draft);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
  }, [content]);

  const handleComplete = useCallback(async () => {
    const draft = { dateISO: getTodayDateISO(), content };
    const entry = await diaryRepo.saveDraft(draft);
    router.push(`/diary/result/${entry.id}`);
  }, [content, router]);

  const words = wordCount(content);

  return (
    <>
      <Subtext>Write freely. Don&apos;t worry about grammar.</Subtext>

      <MetaRow>
        <span>{getTodayDateISO()}</span>
        <span>{words} words</span>
      </MetaRow>

      <TextareaWrap>
        <Textarea
          placeholder="e.g. Today I went to the park. It was sunny. I read a book under a tree."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ minHeight: '40vh' }}
        />
      </TextareaWrap>

      {savedMessage && (
        <AlertWrap>
          <InlineAlert $variant="success">Saved</InlineAlert>
        </AlertWrap>
      )}

      <ActionBar>
        <Button $variant="secondary" onClick={handleSaveDraft} style={{ flex: 1 }}>
          Save Draft
        </Button>
        <Button $variant="primary" onClick={handleComplete} disabled={!content.trim()} style={{ flex: 1 }}>
          Complete
        </Button>
      </ActionBar>
    </>
  );
}
