import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '나이스 가이드',
  description: '직장인을 위한 맞춤형 여행 일정 파트너',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-black text-white antialiased">
        {children}
      </body>
    </html>
  );
}
