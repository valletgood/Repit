import BottomNav from '@/components/navigation/BottomNav';
import AuthGuard from '@/components/guards/AuthGuard';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <AuthGuard>
      <div className="flex h-full flex-col overflow-hidden">
        <div className="flex-1 overflow-hidden pb-16">{children}</div>
        <BottomNav />
      </div>
    </AuthGuard>
  );
}
