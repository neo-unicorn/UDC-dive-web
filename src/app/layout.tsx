import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DiveInfo - 潜水资讯',
  description: '中英文双语潜水资讯平台',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  );
}
