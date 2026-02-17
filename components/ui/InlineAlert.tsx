'use client';

import styled, { css } from 'styled-components';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

const variantStyles: Record<AlertVariant, ReturnType<typeof css>> = {
  info: css`
    background: #eff6ff;
    color: #1e40af;
    border: 1px solid #bfdbfe;
  `,
  success: css`
    background: #dcfce7;
    color: #166534;
    border: 1px solid #bbf7d0;
  `,
  warning: css`
    background: #fef3c7;
    color: #92400e;
    border: 1px solid #fde68a;
  `,
  error: css`
    background: #fee2e2;
    color: #991b1b;
    border: 1px solid #fecaca;
  `,
};

export const InlineAlert = styled.div<{ $variant?: AlertVariant }>`
  padding: 10px 12px;
  font-size: 0.875rem;
  border-radius: var(--radius-sm);
  ${(p) => variantStyles[p.$variant ?? 'info']}
`;
