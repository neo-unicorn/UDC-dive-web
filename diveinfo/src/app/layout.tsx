import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'UDC DIVE - 探索海洋世界的无限可能',
  description: '专业潜水资讯网站，提供潜水培训、旅行目的地、水下摄影、海洋生物百科等内容',
  keywords: ['潜水', 'PADI', '水下摄影', '海洋生物', '潜水旅行', '潜水装备'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
