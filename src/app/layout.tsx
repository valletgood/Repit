import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/components/providers/QueryProvider';
import ReduxProvider from '@/redux/ReduxProvider';
import { Toaster } from '@/components/ui/sonner';
import PwaInstallBanner from '@/components/PwaInstallBanner';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-sans',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Repit - 운동 트래커',
  description: '당신의 운동을 기록하고 성장을 추적하세요',

  // ✅ PWA
  manifest: '/manifest.webmanifest',
  applicationName: 'Repit',

  // ✅ 모바일 주소창/상단바 색(안드로이드 크롬 등)
  themeColor: '#0B0F19',

  // ✅ iOS 홈화면 설치 시 “앱처럼”
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Repit',
  },

  // ✅ 아이콘 힌트 (최소)
  icons: {
    icon: [{ url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }],
    apple: [{ url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,

  // ✅ 노치/세이프에어리어 대응 (PWA에서 특히 유용)
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}>
        <ReduxProvider>
          <QueryProvider>
            {children}
            <Toaster position="top-center" />
          </QueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
