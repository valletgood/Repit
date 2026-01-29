import BottomNav from '@/components/navigation/BottomNav';
import AuthGuard from '@/components/guards/AuthGuard';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <AuthGuard>
      <div className="pb-16">{children}</div>
      <BottomNav />
    </AuthGuard>
  );
}
