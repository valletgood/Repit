'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * 인증이 필요한 페이지를 보호하는 가드
 * 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트
 */
export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/login');
    }
  }, [isLoggedIn, router]);

  // 로그인되지 않은 경우 로딩 또는 빈 화면 표시
  if (!isLoggedIn) {
    return null;
  }

  return <>{children}</>;
}
