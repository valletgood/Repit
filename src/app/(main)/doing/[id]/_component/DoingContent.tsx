'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import {
  RoutineWithExercises,
  RoutineExerciseDTO,
  RoutineExerciseSetDTO,
} from '@/app/(main)/doing/[id]/page';
import { DoingAccordion } from '@/app/(main)/doing/[id]/_component/DoingAccordion';
import { ExerciseSelectSheet } from '@/app/(main)/doing/[id]/_component/ExerciseSelectSheet';
import { Button } from '@/components/ui/button';
import { useSaveRoutineSets } from '@/app/api/main/doing/client/hooks/useSaveRoutineSets';
import { useGetExercises } from '@/app/api/main/exercises/client/hooks/useGetExercises';
import { useRouter } from 'next/navigation';
import { useModal } from '@/hooks/useModal';
import { toast } from 'sonner';
import type { Exercise } from '@/db/schema';

interface DoingContentProps {
  exercise: RoutineWithExercises;
}

export function DoingContent({ exercise }: DoingContentProps) {
  const [exercises, setExercises] = useState<RoutineExerciseDTO[]>(exercise.exercises);
  const { mutate: saveRoutineSets, isPending } = useSaveRoutineSets();
  const { data: exerciseData } = useGetExercises();
  const router = useRouter();
  const modal = useModal();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const [isStarted, setIsStarted] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!isStarted) return;

    const interval = setInterval(() => {
      if (startTimeRef.current) {
        setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isStarted]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const onStart = () => {
    modal.confirm('운동을 시작하시겠습니까?', () => {
      startTimeRef.current = Date.now();
      setIsStarted(true);
      toast.message('운동을 시작합니다.');
    });
  };

  const onAddSet = useCallback((routineExerciseId: string) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.routineExerciseId !== routineExerciseId) return ex;
        const maxSetNumber = Math.max(0, ...ex.sets.map((s) => s.setNumber));
        const isCardio = ex.equipment === '유산소';
        const newSet: RoutineExerciseSetDTO = {
          id: `temp-${Date.now()}`,
          setNumber: maxSetNumber + 1,
          weight: isCardio ? null : 0,
          reps: isCardio ? null : 10,
          duration: isCardio ? 1800 : null,
          distance: isCardio ? 0 : null,
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

  const onDeleteExercise = useCallback((routineExerciseId: string) => {
    modal.confirm('이 운동을 삭제하시겠습니까?', () => {
      setExercises((prev) => prev.filter((ex) => ex.routineExerciseId !== routineExerciseId));
      toast.message('운동이 삭제되었습니다.');
    });
  }, [modal]);

  const onUpdateSet = useCallback(
    (
      routineExerciseId: string,
      setId: string,
      field: 'weight' | 'reps' | 'duration' | 'distance',
      value: number | null
    ) => {
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
      const duration = startTimeRef.current
        ? Math.floor((Date.now() - startTimeRef.current) / 1000)
        : 0;
      const payload = {
        routineId: exercise.id,
        duration,
        saveSession: true,
        exercises: exercises.map((ex) => ({
          routineExerciseId: ex.routineExerciseId,
          exerciseId: ex.exerciseId,
          order: ex.order,
          sets: ex.sets,
        })),
      };
      saveRoutineSets(payload, {
        onSuccess: () => {
          toast.message('운동을 완료했습니다.');
          router.push('/');
        },
      });
    });
  };

  const onUpdateRoutine = () => {
    modal.confirm('루틴을 업데이트하시겠습니까?', () => {
      const payload = {
        routineId: exercise.id,
        duration: 0,
        saveSession: false,
        exercises: exercises.map((ex) => ({
          routineExerciseId: ex.routineExerciseId,
          exerciseId: ex.exerciseId,
          order: ex.order,
          sets: ex.sets,
        })),
      };
      saveRoutineSets(payload, {
        onSuccess: () => {
          toast.message('루틴이 업데이트되었습니다.');
          router.push('/');
        },
      });
    });
  };

  const onAddExercises = useCallback(
    (selectedExercises: Exercise[]) => {
      const existingIds = exercises.map((e) => e.exerciseId);
      const duplicates = selectedExercises.filter((ex) => existingIds.includes(ex.excerciseId));

      if (duplicates.length > 0) {
        toast.error(`이미 추가된 운동이 있습니다: ${duplicates.map((d) => d.name).join(', ')}`);
        return;
      }

      const maxOrder = Math.max(0, ...exercises.map((e) => e.order));
      const newExercises: RoutineExerciseDTO[] = selectedExercises.map((ex, idx) => {
        const isCardio = ex.equipment === '유산소';
        return {
          routineExerciseId: `temp-exercise-${Date.now()}-${idx}`,
          order: maxOrder + idx + 1,
          exerciseId: ex.excerciseId,
          name: ex.name,
          mainCategory: ex.mainCategory,
          subCategory: ex.subCategory,
          equipment: ex.equipment,
          sets: [
            {
              id: `temp-set-${Date.now()}-${idx}`,
              setNumber: 1,
              weight: isCardio ? null : 0,
              reps: isCardio ? null : 10,
              duration: isCardio ? 1800 : null,
              distance: isCardio ? 0 : null,
            },
          ],
        };
      });
      setExercises((prev) => [...prev, ...newExercises]);
      toast.message(`${selectedExercises.length}개 운동이 추가되었습니다.`);
    },
    [exercises]
  );

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      {/* 헤더: 루틴 이름 + 운동 추가 버튼 + 경과 시간 */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex w-full items-center gap-3">
          <h1 className="text-xl font-bold text-white">{exercise.name}</h1>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsSheetOpen(true)}
            className="text-xs"
          >
            + 운동 추가
          </Button>
        </div>
        {isStarted && (
          <span className="text-lg font-semibold text-[#E31B23]">{formatTime(elapsedSeconds)}</span>
        )}
      </div>

      {/* 스크롤 영역 */}
      <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto rounded-xl">
        <DoingAccordion
          exercises={exercises}
          onAddSet={onAddSet}
          onDeleteSet={onDeleteSet}
          onDeleteExercise={onDeleteExercise}
          onUpdateSet={onUpdateSet}
        />
      </div>

      {/* 하단 고정 버튼바 */}
      <div className="shrink-0 px-4 py-4">
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="secondary"
            onClick={onUpdateRoutine}
            disabled={isPending}
            className="w-40 shadow-lg"
          >
            루틴 업데이트
          </Button>
          {isStarted ? (
            <Button
              variant="active"
              onClick={onSave}
              disabled={isPending}
              className="w-40 shadow-lg"
            >
              운동 완료
            </Button>
          ) : (
            <Button variant="active" onClick={onStart} className="w-40 shadow-lg">
              운동 시작
            </Button>
          )}
        </div>
      </div>
      <modal.Modal />

      {/* 운동 추가 바텀시트 */}
      {isSheetOpen && exerciseData && (
        <ExerciseSelectSheet
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          exercises={exerciseData.exercises}
          categories={exerciseData.categories}
          equipments={exerciseData.equipments}
          onSelect={onAddExercises}
          existingExerciseIds={exercises.map((e) => e.exerciseId)}
        />
      )}
    </div>
  );
}
