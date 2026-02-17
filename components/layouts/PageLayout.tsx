'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styled from 'styled-components';
import { BOTTOM_TAB_ROUTES } from '@/lib/routes';

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  background: var(--background);
`;

const Header = styled.header`
  flex-shrink: 0;
  height: var(--header-height);
  padding: 0 var(--page-h-padding);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
`;

const HeaderTitle = styled.h1`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--foreground);
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const HeaderIconButton = styled.button`
  padding: 8px;
  font-size: 0.75rem;
  color: var(--muted);
  background: none;
  border: none;
  cursor: pointer;
  &:hover {
    color: var(--foreground);
  }
`;

const Container = styled.main`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  padding: var(--page-h-padding);
  padding-bottom: calc(var(--bottom-tab-height) + var(--page-h-padding));
`;

const ContainerFocus = styled(Container)`
  padding-bottom: var(--page-h-padding);
`;

const BottomTab = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--bottom-tab-height);
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: var(--surface);
  border-top: 1px solid var(--border);
  padding-bottom: env(safe-area-inset-bottom, 0);
`;

const TabLink = styled(Link)<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 8px 12px;
  font-size: 0.6875rem;
  font-weight: ${(p) => (p.$active ? 600 : 500)};
  color: ${(p) => (p.$active ? 'var(--accent)' : 'var(--muted)')};
  transition: color 0.15s ease;

  &:hover {
    color: var(--foreground);
  }
`;

type PageLayoutProps = {
  children: React.ReactNode;
  title?: string;
};

const DEFAULT_TITLES: Record<string, string> = {
  '/': 'Today',
  '/diary': 'Diary',
  '/diary/write': 'Write Diary',
  '/login': 'Login',
  '/practice': 'Practice',
  '/stats': 'Stats',
};

const FOCUS_ROUTES = ['/diary/write', '/talk'];
const AUTH_ROUTES = ['/login'];

function getTitle(pathname: string, title?: string): string {
  if (title) return title;
  if (pathname.startsWith('/diary/result')) return 'Result';
  if (pathname.startsWith('/talk/')) return 'Talk 5Q';
  return DEFAULT_TITLES[pathname] ?? 'Evan English';
}

function isFocusMode(pathname: string): boolean {
  return FOCUS_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`));
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`));
}

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BackLink = styled(Link)`
  padding: 8px;
  margin: -8px 0 -8px -8px;
  color: var(--muted);
  text-decoration: none;
  font-size: 0.875rem;
  &:hover {
    color: var(--foreground);
  }
`;

export default function PageLayout({ children, title }: PageLayoutProps) {
  const pathname = usePathname();
  const displayTitle = getTitle(pathname, title);
  const focusMode = isFocusMode(pathname);
  const showBottomTab = !focusMode && !isAuthRoute(pathname);

  return (
    <Layout>
      <Header>
        <HeaderLeft>
          {focusMode && (
            <BackLink
              href={pathname.startsWith('/talk/') ? `/diary/result/${pathname.split('/')[2] ?? ''}` : '/diary'}
              aria-label="Back"
            >
              ← Back
            </BackLink>
          )}
          <HeaderTitle>{displayTitle}</HeaderTitle>
        </HeaderLeft>
        {pathname === '/' && (
          <HeaderRight>
            <HeaderIconButton type="button">Settings</HeaderIconButton>
            <HeaderIconButton type="button">Profile</HeaderIconButton>
          </HeaderRight>
        )}
      </Header>
      {focusMode ? <ContainerFocus>{children}</ContainerFocus> : <Container>{children}</Container>}
      {showBottomTab && (
        <BottomTab>
          {BOTTOM_TAB_ROUTES.map(({ path, label }) => (
            <TabLink
              key={path}
              href={path}
              $active={path === '/' ? pathname === '/' : pathname === path || pathname.startsWith(`${path}/`)}
            >
              {label}
            </TabLink>
          ))}
        </BottomTab>
      )}
    </Layout>
  );
}
