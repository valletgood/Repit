'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import SlideMenu from './SlideMenu';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between px-4 py-4">
        <button
          onClick={() => setIsMenuOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-[#2A2A2A]"
        >
          <Menu size={24} />
        </button>
        
        <Image src="/images/logo.svg" alt="REPIT" width={120} height={40} priority />
        
        {/* 오른쪽 여백 맞추기 */}
        <div className="w-10" />
      </header>

      <SlideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
