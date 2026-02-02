'use client';

import { useState, useCallback, ReactNode } from 'react';
import { Button } from '@/components/ui/button';

type ModalType = 'confirm' | 'info';

interface ModalState {
  isOpen: boolean;
  type: ModalType;
  message: string;
  onConfirm?: () => void;
}

export function useModal() {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    type: 'info',
    message: '',
  });

  const close = useCallback(() => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const confirm = useCallback((message: string, onConfirm: () => void) => {
    setModalState({
      isOpen: true,
      type: 'confirm',
      message,
      onConfirm,
    });
  }, []);

  const info = useCallback((message: string) => {
    setModalState({
      isOpen: true,
      type: 'info',
      message,
    });
  }, []);

  const handleConfirm = useCallback(() => {
    modalState.onConfirm?.();
    close();
  }, [modalState.onConfirm, close]);

  const ModalComponent = useCallback(
    (): ReactNode =>
      modalState.isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onClick={close}
        >
          <div
            className="animate-in fade-in zoom-in-95 w-full max-w-sm rounded-2xl bg-[#2A2A2A] p-6 shadow-xl duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-6 text-center text-white whitespace-pre-line">{modalState.message}</p>

            <div className="flex gap-3">
              {modalState.type === 'confirm' ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={close}
                    className="flex-1 rounded-full border-[#3A3A3A] bg-[#3A3A3A] py-3 text-white hover:bg-[#4A4A4A]"
                  >
                    취소
                  </Button>
                  <Button
                    type="button"
                    variant="active"
                    onClick={handleConfirm}
                    className="flex-1 rounded-full py-3 text-white"
                  >
                    확인
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  variant="active"
                  onClick={close}
                  className="flex-1 rounded-full py-3 text-white"
                >
                  확인
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : null,
    [modalState, close, handleConfirm]
  );

  return {
    confirm,
    info,
    Modal: ModalComponent,
  };
}
