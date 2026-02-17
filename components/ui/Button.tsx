'use client';

import styled, { css } from 'styled-components';

type Variant = 'primary' | 'secondary' | 'ghost';

const variantStyles = {
  primary: css`
    background: var(--accent);
    color: var(--accent-foreground);
    border: none;
    &:hover:not(:disabled) {
      opacity: 0.9;
    }
  `,
  secondary: css`
    background: var(--surface);
    color: var(--foreground);
    border: 1px solid var(--border);
    &:hover:not(:disabled) {
      background: var(--surface-elevated);
    }
  `,
  ghost: css`
    background: transparent;
    color: var(--foreground);
    border: none;
    &:hover:not(:disabled) {
      background: var(--surface);
    }
  `,
};

export const Button = styled.button<{
  $variant?: Variant;
  $loading?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  font-size: 0.9375rem;
  font-weight: 500;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: opacity 0.15s, background 0.15s;
  min-height: 44px;

  ${(p) => variantStyles[p.$variant ?? 'primary']}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${(p) =>
    p.$loading &&
    css`
      pointer-events: none;
      opacity: 0.8;
    `}
`;
