'use client';

import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { logout as logoutAction } from '@/redux/slices/userSlice';
import { useLogout } from '@/app/api/auth/logout/client/hooks/useLogout';
import { Button } from '@/components/ui/button';

export default function MyPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const { mutate: logoutMutate } = useLogout();

  const handleLogout = () => {
    logoutMutate(undefined, {
      onSettled: () => {
        dispatch(logoutAction());
        router.push('/login');
      },
    });
  };

  return (
    <main className="flex flex-col gap-6 p-4">
      <h1 className="text-xl font-bold text-white">마이페이지</h1>

      <div className="flex flex-col gap-4 rounded-xl bg-[#2A2A2A] p-4">
        <div className="flex items-center justify-between">
          <span className="text-[#888888]">이름</span>
          <span className="font-medium text-white">{user.name || '-'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#888888]">성별</span>
          <span className="font-medium text-white">
            {user.gender === 'male' ? '남성' : user.gender === 'female' ? '여성' : '-'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#888888]">생년월일</span>
          <span className="font-medium text-white">
            <span className="font-medium text-white">{user.birthDate || '-'}</span>
          </span>
        </div>
      </div>

      <Button variant="destructive" onClick={handleLogout} className="w-full">
        로그아웃
      </Button>
    </main>
  );
}
