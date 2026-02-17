'use client';

import styled from 'styled-components';

export const EmptyStateRoot = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  text-align: center;
  color: var(--muted);
`;

export const EmptyStateTitle = styled.p`
  font-size: 1rem;
  font-weight: 500;
  color: var(--foreground);
  margin-bottom: 4px;
`;

export const EmptyStateDescription = styled.p`
  font-size: 0.875rem;
  margin-bottom: 16px;
`;
