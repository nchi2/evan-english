'use client';

import styled from 'styled-components';

export const ProgressBarTrack = styled.div`
  height: 6px;
  background: var(--border);
  border-radius: 3px;
  overflow: hidden;
`;

export const ProgressBarFill = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${(p) => Math.min(100, Math.max(0, p.$percent))}%;
  background: var(--accent);
  border-radius: 3px;
  transition: width 0.2s ease;
`;
