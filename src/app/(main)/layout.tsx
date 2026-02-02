import AuthGuard from '@/components/guards/AuthGuard';
import Header from '@/components/navigation/Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <AuthGuard>
      <div className="flex h-screen flex-col bg-[#1A1A1A]">
        <Header />

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 pb-4">{children}</div>
      </div>
    </AuthGuard>
  );
}
