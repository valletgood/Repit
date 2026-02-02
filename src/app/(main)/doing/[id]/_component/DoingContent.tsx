'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import {
  RoutineWithExercises,
  RoutineExerciseDTO,
  RoutineExerciseSetDTO,
} from '@/app/(main)/doing/[id]/page';
import { DoingAccordion } from '@/app/(main)/doing/[id]/_component/DoingAccordion';
import { Button } from '@/components/ui/button';
import { useSaveRoutineSets } from '@/app/api/main/doing/client/hooks/useSaveRoutineSets';
import { useRouter } from 'next/navigation';
import { useModal } from '@/hooks/useModal';
import { toast } from 'sonner';

interface DoingContentProps {
  exercise: RoutineWithExercises;
}

export function DoingContent({ exercise }: DoingContentProps) {
  const [exercises, setExercises] = useState<RoutineExerciseDTO[]>(exercise.exercises);
  const { mutate: saveRoutineSets, isPending } = useSaveRoutineSets();
  const router = useRouter();
  const modal = useModal();

  const startTimeRef = useRef<number>(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const onAddSet = useCallback((routineExerciseId: string) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.routineExerciseId !== routineExerciseId) return ex;
        const maxSetNumber = Math.max(0, ...ex.sets.map((s) => s.setNumber));
        const newSet: RoutineExerciseSetDTO = {
          id: `temp-${Date.now()}`,
          setNumber: maxSetNumber + 1,
          weight: 0,
          reps: 10,
        };
        return { ...ex, sets: [...ex.sets, newSet] };
      })
    );
  }, []);

  const onDeleteSet = useCallback((routineExerciseId: string, setId: string) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.routineExerciseId !== routineExerciseId) return ex;
        return { ...ex, sets: ex.sets.filter((s) => s.id !== setId) };
      })
    );
  }, []);

  const onUpdateSet = useCallback(
    (routineExerciseId: string, setId: string, field: 'weight' | 'reps', value: number | null) => {
      setExercises((prev) =>
        prev.map((ex) => {
          if (ex.routineExerciseId !== routineExerciseId) return ex;
          return {
            ...ex,
            sets: ex.sets.map((s) => (s.id === setId ? { ...s, [field]: value } : s)),
          };
        })
      );
    },
    []
  );

  const onSave = () => {
    modal.confirm('운동을 완료하시겠습니까?', () => {
      const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
      saveRoutineSets(
        { routineId: exercise.id, exercises, duration },
        {
          onSuccess: () => {
            toast.message('운동을 완료했습니다.');
            router.push('/');
          },
        }
      );
    });
  };

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      {/* 헤더: 루틴 이름 + 경과 시간 */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">{exercise.name}</h1>
        <span className="text-lg font-semibold text-[#E31B23]">{formatTime(elapsedSeconds)}</span>
      </div>

      {/* 스크롤 영역 */}
      <div className="flex min-h-0 flex-1 flex-col">
        <DoingAccordion
          exercises={exercises}
          onAddSet={onAddSet}
          onDeleteSet={onDeleteSet}
          onUpdateSet={onUpdateSet}
        />
      </div>

      {/* 하단 고정 버튼바 */}
      <div className="sticky right-0 bottom-0 left-0 z-20 bg-[#1A1A1A] pt-3 pb-14">
        <div className="flex items-center justify-center gap-4 px-4">
          {/*<Button variant="secondary" onClick={onSave} disabled={isPending} className="w-40">*/}
          {/*  임시 저장*/}
          {/*</Button>*/}

          <Button variant="active" onClick={onSave} disabled={isPending} className="w-40">
            운동 완료
          </Button>
        </div>

        {/* 안전영역(iOS) 대응 */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
      <modal.Modal />
    </div>
  );
}
