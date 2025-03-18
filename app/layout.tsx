'use client';

import { usePathname } from 'next/navigation';
import './globals.css';
import BottomNavBar from './components/BottomNavBar';
import InkBackground from './components/InkBackground';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();

  return (
    <html lang="zh">
      <body>
        <InkBackground />
        <main style={{ paddingBottom: '70px' }}>
          {children}
        </main>
        <BottomNavBar currentPath={pathname} />
      </body>
    </html>
  );
}
