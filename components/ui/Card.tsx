'use client';

import styled from 'styled-components';

export const Card = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 16px;
  color: var(--foreground);
`;

export const SectionCard = styled(Card)`
  & > h3 {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--muted);
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }
`;
