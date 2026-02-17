'use client';

import styled from 'styled-components';

export const Skeleton = styled.div`
  background: linear-gradient(
    90deg,
    var(--border) 25%,
    var(--surface-elevated) 50%,
    var(--border) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.2s ease-in-out infinite;
  border-radius: var(--radius-sm);

  @keyframes skeleton-shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;
