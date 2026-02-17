'use client';

import styled from 'styled-components';

export const TabsRoot = styled.div`
  display: flex;
  gap: 0;
  border-bottom: 1px solid var(--border);
  margin-bottom: 12px;
`;

export const Tab = styled.button<{ $active?: boolean }>`
  flex: 1;
  padding: 10px 12px;
  font-size: 0.875rem;
  font-weight: ${(p) => (p.$active ? 600 : 500)};
  color: ${(p) => (p.$active ? 'var(--accent)' : 'var(--muted)')};
  background: none;
  border: none;
  border-bottom: 2px solid ${(p) => (p.$active ? 'var(--accent)' : 'transparent')};
  cursor: pointer;
  margin-bottom: -1px;
  transition: color 0.15s, border-color 0.15s;

  &:hover {
    color: var(--foreground);
  }
`;
