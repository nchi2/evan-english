'use client';

import styled, { css } from 'styled-components';

type ChipVariant = 'default' | 'success' | 'warning' | 'error';

const variantStyles: Record<ChipVariant, ReturnType<typeof css>> = {
  default: css`
    background: var(--surface-elevated);
    color: var(--muted);
    border: 1px solid var(--border);
  `,
  success: css`
    background: #dcfce7;
    color: #166534;
    border: none;
  `,
  warning: css`
    background: #fef3c7;
    color: #92400e;
    border: none;
  `,
  error: css`
    background: #fee2e2;
    color: #991b1b;
    border: none;
  `,
};

export const Chip = styled.span<{ $variant?: ChipVariant }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: var(--radius-sm);
  ${(p) => variantStyles[p.$variant ?? 'default']}
`;
