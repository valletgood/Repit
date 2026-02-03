'use client';

import { useEffect, useRef } from 'react';
import { Button } from './button';
import { Input } from './input';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // 배경 클릭으로 닫기
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="animate-in fade-in zoom-in-95 w-full max-w-sm rounded-2xl bg-[#2A2A2A] p-6 shadow-xl duration-200"
      >
        {/* 헤더 */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#999999] hover:bg-[#3A3A3A] hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* 콘텐츠 */}
        {children}
      </div>
    </div>
  );
}

// 루틴 이름 입력 모달
interface RoutineNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  exerciseCount: number;
}

export function RoutineNameModal({
  isOpen,
  onClose,
  onSave,
  exerciseCount,
}: RoutineNameModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = inputRef.current?.value.trim();
    if (name) {
      onSave(name);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="루틴 저장">
      <form onSubmit={handleSubmit}>
        <p className="mb-4 text-sm text-[#999999]">
          {exerciseCount}개의 운동이 포함된 루틴의 이름을 입력하세요.
        </p>

        <Input
          ref={inputRef}
          variant="auth"
          placeholder="루틴 이름을 입력하세요"
          className="mb-4 w-full"
        />

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 rounded-full border-[#3A3A3A] bg-[#3A3A3A] py-3 text-white hover:bg-[#4A4A4A]"
          >
            취소
          </Button>
          <Button type="submit" variant="active" className="flex-1 rounded-full py-3 text-white">
            저장
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// 루틴 이름 수정 모달
interface RoutineEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  currentName: string;
}

export function RoutineEditModal({
  isOpen,
  onClose,
  onSave,
  currentName,
}: RoutineEditModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.value = currentName;
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isOpen, currentName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = inputRef.current?.value.trim();
    if (name) {
      onSave(name);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="루틴 이름 수정">
      <form onSubmit={handleSubmit}>
        <Input
          ref={inputRef}
          variant="auth"
          placeholder="루틴 이름을 입력하세요"
          className="mb-4 w-full"
        />

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 rounded-full border-[#3A3A3A] bg-[#3A3A3A] py-3 text-white hover:bg-[#4A4A4A]"
          >
            취소
          </Button>
          <Button type="submit" variant="active" className="flex-1 rounded-full py-3 text-white">
            저장
          </Button>
        </div>
      </form>
    </Modal>
  );
}
