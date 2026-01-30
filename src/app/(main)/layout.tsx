import BottomNav from '@/components/navigation/BottomNav';
import AuthGuard from '@/components/guards/AuthGuard';
import Image from 'next/image';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <AuthGuard>
      <div className="h-screen bg-[#1A1A1A] flex flex-col">
        {/* 헤더 - 로고 */}
        <header className="flex items-center justify-center py-4">
          <Image src="/images/logo.svg" alt="REPIT" width={120} height={40} priority />
        </header>
        
        <div className="flex flex-col flex-1 px-4 pb-20 overflow-hidden min-h-0">
          {children}
        </div>
        
        <BottomNav />
      </div>
    </AuthGuard>
  );
}
