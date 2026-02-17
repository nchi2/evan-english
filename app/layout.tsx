import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import StyledComponentsRegistry from './lib/registry';
import PageLayout from '@/components/layouts/PageLayout';
import PwaRegister from '@/components/PwaRegister';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Evan English',
  description: '영어 일기로 배우는 혼자만의 학습 PWA',
  manifest: '/manifest.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <PwaRegister />
        <StyledComponentsRegistry>
          <PageLayout>{children}</PageLayout>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
