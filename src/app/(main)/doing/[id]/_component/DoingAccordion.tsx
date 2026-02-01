'use client';

import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import type { RoutineExerciseDTO } from '@/app/(main)/doing/[id]/page';
import { clsx } from 'clsx';
import { AddSetRequest } from '@/app/api/main/doing/client/service/service';
import { useAddSet } from '@/app/api/main/doing/client/hooks/useAddSet';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';

interface DoingAccordionProps {
  exercise: RoutineExerciseDTO[];
}

export function DoingAccordion({ exercise }: DoingAccordionProps) {
  const defaultValue = exercise?.[0]?.routineExerciseId;
  const [openedId, setOpenedId] = useState(defaultValue);

  const handleOpenedId = (value: string) => {
    setOpenedId(value);
  };

  return (
    <div className="w-full">
      <Accordion
        type="single"
        collapsible
        value={openedId}
        onValueChange={handleOpenedId}
        defaultValue={defaultValue}
        className="scrollbar-hide flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto"
      >
        {exercise.map((item) => (
          <ExerciseItem
            key={item.routineExerciseId}
            item={item}
            isOpen={openedId === item.routineExerciseId}
          />
        ))}
      </Accordion>
    </div>
  );
}

function ExerciseItem({ item, isOpen }: { item: RoutineExerciseDTO; isOpen: boolean }) {
  const { mutate: addSet } = useAddSet();
  const router = useRouter();

  const get1Rm = (weight: number, reps: number) => {
    return weight * (1 + reps / 30);
  };

  const summary = useMemo(() => {
    const sets = item.sets ?? [];

    const setCount = sets.length;
    const totalReps = sets.reduce((sum, s) => sum + (s.reps ?? 0), 0);

    // ✅ 세트별 1RM 계산 → 가장 큰 값 사용
    const oneRmValues = sets
      .filter((s) => s.weight && s.reps && s.reps > 0 && s.reps <= 10)
      .map((s) => get1Rm(s.weight!, s.reps!));

    const oneRm = oneRmValues.length > 0 ? Math.round(Math.max(...oneRmValues)) : null;

    return `${totalReps}회 / ${setCount}세트 / 1RM: ${oneRm ?? '-'}`;
  }, [item.sets]);

  const onAddSet = (e: React.MouseEvent) => {
    e.preventDefault(); // 아코디언 토글 방지
    e.stopPropagation();
    // TODO: 세트 추가 로직 연결 (상태/서버 액션)
    const payload: AddSetRequest = {
      reps: 10,
      routineExerciseId: item.routineExerciseId,
      weight: 0,
    };
    addSet(payload, {
      onSuccess: () => {
        router.refresh();
      },
    });
    console.log('add set:', item.routineExerciseId);
  };

  return (
    <AccordionItem value={item.routineExerciseId} className="rounded-2xl bg-[#2A2A2A] p-4">
      {/* Trigger: 기본 화살표 숨기고 커스텀 헤더 */}
      <AccordionTrigger
        className={[
          'flex p-0 hover:no-underline',
          // shadcn 기본 chevron 숨김
          '[&>svg]:hidden',
        ].join(' ')}
      >
        <div className="w-full">
          {/* 상단: 제목 + 세트추가 + 원형 토글버튼 */}
          <div className="flex items-center justify-between gap-3">
            <h3 className="flex-1 text-xl leading-tight font-extrabold text-white">{item.name}</h3>

            <div className="flex items-center gap-3">
              <Button variant="secondary" onClick={onAddSet}>
                세트 추가
              </Button>

              <div className="flex items-center justify-center rounded-full">
                <ChevronDown
                  className={clsx(
                    'h-6 w-6 text-[#E31B23] transition-transform duration-200 ease-in-out',
                    isOpen && 'rotate-180'
                  )}
                />
              </div>
            </div>
          </div>

          {/* 요약 라인 */}
          <p className="mt-4 text-lg text-[#BEBEBE]">{summary}</p>
        </div>
      </AccordionTrigger>

      <AccordionContent className="pt-6 pb-0">
        {/* 세트 입력 그리드 */}
        <div className="flex flex-col gap-6">
          {(item.sets ?? []).map((set) => (
            <div
              key={`${item.routineExerciseId}-${set.setNumber}`}
              className="grid grid-cols-[1fr_auto_1fr_auto] items-center gap-x-6 gap-y-3"
            >
              {/* 무게 */}
              <Input variant="auth" defaultValue={set.weight ?? ''} placeholder="0" />
              <span className="text-lg font-semibold text-white">KG</span>

              {/* 횟수 */}
              <Input variant="auth" defaultValue={set.reps ?? ''} placeholder="0" />
              <span className="text-lg font-semibold text-white">회</span>
            </div>
          ))}

          {/* 세트가 없을 때도 UI 깨지지 않게 */}
          {(item.sets?.length ?? 0) === 0 && (
            <div className="rounded-xl bg-[#1F1F1F] p-4 text-center text-[#888888]">
              아직 세트가 없습니다. 상단의 <span className="text-white">세트 추가</span>를
              눌러주세요.
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
