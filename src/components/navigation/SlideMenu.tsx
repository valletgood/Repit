'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { logout as logoutAction } from '@/redux/slices/userSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useLogout } from '@/app/api/auth/logout/client/hooks/useLogout';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    href: '/',
    label: 'HOME',
    icon: <Image src="/images/icon_home.svg" alt="Home" width={24} height={24} />,
  },
  {
    href: '/record',
    label: '기록',
    icon: <Image src="/images/icon_exercise.svg" alt="Exercise" width={24} height={24} />,
  },
  {
    href: '/chart',
    label: '차트',
    icon: <Image src="/images/icon_chart.svg" alt="Chart" width={24} height={24} />,
  },
  {
    href: '/mypage',
    label: '마이페이지',
    icon: <Image src="/images/icon_mypage.svg" alt="Mypage" width={24} height={24} />,
  },
];

interface SlideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SlideMenu({ isOpen, onClose }: SlideMenuProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { mutate: logoutMutate } = useLogout();

  const handleLogout = () => {
    logoutMutate(undefined, {
      onSettled: () => {
        dispatch(logoutAction());
        router.push('/login');
      },
    });
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* 오버레이 */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/60 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={onClose}
      />

      {/* 슬라이드 메뉴 */}
      <div
        className={cn(
          'fixed top-0 left-0 z-50 flex h-full w-64 flex-col bg-[#1A1A1A] shadow-xl transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-[#3A3A3A] p-4">
          <Image src="/images/logo.svg" alt="REPIT" width={100} height={32} />
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2A2A2A] text-white hover:bg-[#3A3A3A]"
          >
            <X size={18} />
          </button>
        </div>

        {/* 메뉴 목록 */}
        <nav className="flex flex-1 flex-col justify-between gap-2 p-4">
          <div className="w-full">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-4 rounded-xl px-4 py-3 transition-colors',
                    isActive
                      ? 'bg-[#E31B23] text-white'
                      : 'text-[#888888] hover:bg-[#2A2A2A] hover:text-white'
                  )}
                >
                  {item.icon}
                  <span className="text-base font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
          <Button variant="destructive" onClick={handleLogout} className="w-full p-4">
            로그아웃
          </Button>
        </nav>
      </div>
    </>
  );
}
