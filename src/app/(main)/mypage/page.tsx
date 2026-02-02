'use client';

import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/redux/hooks';
import { logout } from '@/redux/slices/userSlice';
import { Button } from '@/components/ui/button';

export default function MyPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  return (
    <main className="flex flex-col gap-4">
      <h1 className="text-xl font-bold text-white">마이페이지</h1>
      <Button variant="destructive" onClick={handleLogout}>
        로그아웃
      </Button>
    </main>
  );
}
