'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';

interface GuestGuardProps {
  children: React.ReactNode;
}

/**
 * 비로그인 사용자만 접근 가능한 페이지를 보호하는 가드
 * 이미 로그인한 사용자는 메인 페이지로 리다이렉트
 */
export default function GuestGuard({ children }: GuestGuardProps) {
  const router = useRouter();
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      router.replace('/');
    }
  }, [isLoggedIn, router]);

  // 로그인된 경우 로딩 또는 빈 화면 표시
  if (isLoggedIn) {
    return null;
  }

  return <>{children}</>;
}
