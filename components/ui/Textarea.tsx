'use client';

import styled from 'styled-components';

export const Textarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 10px 12px;
  font-size: 1rem;
  line-height: 1.5;
  color: var(--foreground);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  outline: none;
  resize: vertical;
  transition: border-color 0.15s;

  &::placeholder {
    color: var(--muted-foreground);
  }

  &:focus {
    border-color: var(--accent);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
