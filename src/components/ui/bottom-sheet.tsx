'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* 오버레이 */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* 바텀시트 */}
      <div
        ref={sheetRef}
        className="relative z-10 flex h-[85vh] w-full flex-col rounded-t-2xl bg-[#1A1A1A]"
      >
        {/* 핸들 */}
        <div className="flex shrink-0 justify-center pt-3 pb-2">
          <div className="h-1 w-10 rounded-full bg-[#444444]" />
        </div>

        {/* 헤더 */}
        {title && (
          <div className="flex shrink-0 items-center justify-between px-4 pb-3">
            <h2 className="text-lg font-bold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2A2A2A] text-white hover:bg-[#3A3A3A]"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* 컨텐츠 */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
