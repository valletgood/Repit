'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    href: '/',
    label: 'HOME',
    icon: <Image src="/images/icon_home.svg" alt="Home" width={22} height={22} />,
  },
  {
    href: '/record',
    label: '기록',
    icon: <Image src="/images/icon_exercise.svg" alt="Exercise" width={22} height={22} />,
  },
  {
    href: '/chart',
    label: '차트',
    icon: <Image src="/images/icon_chart.svg" alt="Chart" width={22} height={22} />,
  },
  {
    href: '/mypage',
    label: '마이페이지',
    icon: <Image src="/images/icon_mypage.svg" alt="Mypage" width={22} height={22} />,
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 border-t border-[#3A3A3A] bg-[#2A2A2A]">
      <div className="flex h-16 items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors',
                isActive ? 'text-[#00A3FF]' : 'text-[#808080] hover:text-[#AAAAAA]'
              )}
            >
              {item.icon}
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && <div className="absolute top-0 h-[2px] w-16 bg-[#00A3FF]" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
