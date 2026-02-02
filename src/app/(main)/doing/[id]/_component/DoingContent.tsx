'use client';
import { useState, useCallback } from 'react';
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

interface DoingContentProps {
  exercise: RoutineWithExercises;
}

export function DoingContent({ exercise }: DoingContentProps) {
  const [exercises, setExercises] = useState<RoutineExerciseDTO[]>(exercise.exercises);
  const { mutate: saveRoutineSets, isPending } = useSaveRoutineSets();
  const router = useRouter();
  const modal = useModal();

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
      saveRoutineSets(
        { routineId: exercise.id, exercises },
        {
          onSuccess: () => {
            router.refresh();
          },
        }
      );
    });
  };

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      {/* 스크롤 영역: 하단 버튼바 높이만큼 padding */}
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
