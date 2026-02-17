'use client';

import { useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { Button, Input, InlineAlert } from '@/components/ui';
import { createClient } from '@/lib/supabase/client';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 320px;
`;

const Hint = styled.p`
  font-size: 0.875rem;
  color: var(--muted);
  margin: 0;
`;

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.trim()) return;
    setLoading(true);
    try {
      const supabase = createClient();
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const { error: err } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${origin}/auth/callback`,
        },
      });
      if (err) {
        setError(err.message);
        return;
      }
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <>
        <InlineAlert $variant="success" style={{ marginBottom: 16 }}>
          이메일에서 링크를 확인해 주세요.
        </InlineAlert>
        <Hint>보내드린 매직링크를 클릭하면 로그인됩니다.</Hint>
        <Button
          $variant="ghost"
          type="button"
          onClick={() => { setSent(false); setEmail(''); }}
          style={{ marginTop: 8, alignSelf: 'flex-start' }}
        >
          다른 이메일로 다시 보내기
        </Button>
      </>
    );
  }

  return (
    <>
      <Hint style={{ marginBottom: 8 }}>
        이메일 주소를 입력하면 로그인 링크를 보내드립니다.
      </Hint>
      <Form onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          autoComplete="email"
          required
        />
        {error && (
          <InlineAlert $variant="error">{error}</InlineAlert>
        )}
        <Button
          type="submit"
          $variant="primary"
          $loading={loading}
          disabled={loading}
        >
          {loading ? '보내는 중…' : '매직링크 받기'}
        </Button>
      </Form>
      <p style={{ marginTop: 24, fontSize: '0.875rem', color: 'var(--muted)' }}>
        <Link href="/" style={{ color: 'var(--accent)' }}>
          ← 홈으로
        </Link>
      </p>
    </>
  );
}
