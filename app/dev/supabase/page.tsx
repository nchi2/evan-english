'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { InlineAlert } from '@/components/ui';

type Status = 'loading' | 'ok' | 'error';
type Result = { status: Status; message: string; detail?: string };

export default function DevSupabasePage() {
  const [result, setResult] = useState<Result>({ status: 'loading', message: '' });

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const supabase = createClient();
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
        const masked =
          url.length > 20
            ? `${url.slice(0, 12)}...${url.slice(-8)}`
            : url || '(없음)';

        const { error } = await supabase.auth.getSession();
        if (cancelled) return;
        if (error) {
          setResult({
            status: 'error',
            message: 'Supabase 연결 실패',
            detail: error.message,
          });
          return;
        }
        setResult({
          status: 'ok',
          message: `연결됨 (${masked})`,
          detail: '클라이언트 생성 및 getSession() 성공.',
        });
      } catch (e) {
        if (cancelled) return;
        setResult({
          status: 'error',
          message: 'Supabase 설정 오류',
          detail: e instanceof Error ? e.message : String(e),
        });
      }
    }

    check();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div style={{ padding: 24, maxWidth: 480 }}>
      <h1 style={{ marginBottom: 16 }}>5.1 Supabase 연동 확인</h1>
      <p style={{ marginBottom: 16, color: 'var(--muted)' }}>
        .env.local에 NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY가
        설정되어 있어야 합니다.
      </p>

      {result.status === 'loading' && (
        <p style={{ color: 'var(--muted)' }}>확인 중...</p>
      )}
      {result.status === 'ok' && (
        <>
          <InlineAlert $variant="success" style={{ marginBottom: 8 }}>
            {result.message}
          </InlineAlert>
          {result.detail && (
            <p style={{ fontSize: 14, color: 'var(--muted)' }}>{result.detail}</p>
          )}
        </>
      )}
      {result.status === 'error' && (
        <>
          <InlineAlert $variant="error" style={{ marginBottom: 8 }}>
            {result.message}
          </InlineAlert>
          {result.detail && (
            <p style={{ fontSize: 14, color: '#991b1b' }}>{result.detail}</p>
          )}
        </>
      )}
    </div>
  );
}
