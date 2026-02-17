'use client';

import styled from 'styled-components';

export const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  font-size: 1rem;
  color: var(--foreground);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  outline: none;
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
