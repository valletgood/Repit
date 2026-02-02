'use client';

import { useState } from 'react';
import { ChevronDown, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import type { RoutineExerciseDTO } from '@/app/(main)/doing/[id]/page';
import { clsx } from 'clsx';
import { Input } from '@/components/ui/input';

interface DoingAccordionProps {
  exercises: RoutineExerciseDTO[];
  onAddSet: (routineExerciseId: string) => void;
  onDeleteSet: (routineExerciseId: string, setId: string) => void;
  onUpdateSet: (
    routineExerciseId: string,
    setId: string,
    field: 'weight' | 'reps' | 'duration' | 'distance',
    value: number | null
  ) => void;
}

export function DoingAccordion({
  exercises,
  onAddSet,
  onDeleteSet,
  onUpdateSet,
}: DoingAccordionProps) {
  const defaultValue = exercises?.[0]?.routineExerciseId;
  const [openedId, setOpenedId] = useState(defaultValue);

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto">
        <Accordion
          type="single"
          collapsible
          value={openedId}
          onValueChange={setOpenedId}
          defaultValue={defaultValue}
          className="flex flex-col gap-3"
        >
          {exercises.map((item) => (
            <ExerciseItem
              key={item.routineExerciseId}
              item={item}
              isOpen={openedId === item.routineExerciseId}
              onAddSet={onAddSet}
              onDeleteSet={onDeleteSet}
              onUpdateSet={onUpdateSet}
            />
          ))}
        </Accordion>
      </div>
    </div>
  );
}

interface ExerciseItemProps {
  item: RoutineExerciseDTO;
  isOpen: boolean;
  onAddSet: (routineExerciseId: string) => void;
  onDeleteSet: (routineExerciseId: string, setId: string) => void;
  onUpdateSet: (
    routineExerciseId: string,
    setId: string,
    field: 'weight' | 'reps' | 'duration' | 'distance',
    value: number | null
  ) => void;
}

function ExerciseItem({ item, isOpen, onAddSet, onDeleteSet, onUpdateSet }: ExerciseItemProps) {
  const isCardio = item.equipment === '유산소';

  const get1Rm = (weight: number, reps: number) => {
    return weight * (1 + reps / 30);
  };

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}시간 ${m}분`;
    if (m > 0) return `${m}분 ${s}초`;
    return `${s}초`;
  };

  const sets = item.sets ?? [];
  const setCount = sets.length;

  // 유산소: 총 시간/거리, 웨이트: 총 횟수/1RM
  let summary: string;
  if (isCardio) {
    const totalDuration = sets.reduce((sum, s) => sum + (s.duration ?? 0), 0);
    const totalDistance = sets.reduce((sum, s) => sum + (s.distance ?? 0), 0);
    summary = `${formatDuration(totalDuration)} / ${totalDistance.toFixed(2)}km`;
  } else {
    const totalReps = sets.reduce((sum, s) => sum + (s.reps ?? 0), 0);
    const oneRmValues = sets
      .filter((s) => s.weight && s.reps && s.reps > 0 && s.reps <= 10)
      .map((s) => get1Rm(s.weight!, s.reps!));
    const oneRm = oneRmValues.length > 0 ? Math.round(Math.max(...oneRmValues)) : null;
    summary = `${totalReps}회 / ${setCount}세트 / 1RM: ${oneRm ?? '-'}`;
  }

  const handleAddSet = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddSet(item.routineExerciseId);
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
            <h3 className="flex-1 text-lg leading-tight font-extrabold text-white">{item.name}</h3>

            <div className="flex items-center gap-3">
              <p
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70 rounded-2xl px-4 py-2 text-center"
                onClick={handleAddSet}
              >
                세트 추가
              </p>

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
          <p className="text-md mt-4 text-[#BEBEBE]">{summary}</p>
        </div>
      </AccordionTrigger>

      <AccordionContent className="pt-6 pb-0">
        {/* 세트 입력 그리드 */}
        <div className="flex flex-col gap-6">
          {sets.map((set) => (
            <div
              key={`${item.routineExerciseId}-${set.id}`}
              className="grid grid-cols-[1fr_auto_1fr_auto_auto] items-center gap-x-6 gap-y-3"
            >
              {isCardio ? (
                <>
                  {/* 시간 (분 단위 입력) */}
                  <Input
                    variant="auth"
                    type="number"
                    defaultValue={set.duration ? Math.floor(set.duration / 60) : ''}
                    placeholder="0"
                    onBlur={(e) => {
                      const minutes = e.target.value === '' ? null : Number(e.target.value);
                      const seconds = minutes !== null ? minutes * 60 : null;
                      onUpdateSet(item.routineExerciseId, set.id, 'duration', seconds);
                    }}
                  />
                  <span className="text-md font-semibold text-white">분</span>

                  {/* 거리 */}
                  <Input
                    variant="auth"
                    type="number"
                    step="0.01"
                    defaultValue={set.distance ?? ''}
                    placeholder="0"
                    onBlur={(e) => {
                      const val = e.target.value === '' ? null : Number(e.target.value);
                      onUpdateSet(item.routineExerciseId, set.id, 'distance', val);
                    }}
                  />
                  <span className="text-md font-semibold text-white">km</span>
                </>
              ) : (
                <>
                  {/* 무게 */}
                  <Input
                    variant="auth"
                    type="number"
                    defaultValue={set.weight ?? ''}
                    placeholder="0"
                    onBlur={(e) => {
                      const val = e.target.value === '' ? null : Number(e.target.value);
                      onUpdateSet(item.routineExerciseId, set.id, 'weight', val);
                    }}
                  />
                  <span className="text-md font-semibold text-white">KG</span>

                  {/* 횟수 */}
                  <Input
                    variant="auth"
                    type="number"
                    defaultValue={set.reps ?? ''}
                    placeholder="0"
                    onBlur={(e) => {
                      const val = e.target.value === '' ? null : Number(e.target.value);
                      onUpdateSet(item.routineExerciseId, set.id, 'reps', val);
                    }}
                  />
                  <span className="text-md font-semibold text-white">회</span>
                </>
              )}

              {/* 삭제 */}
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-[#888888] hover:text-[#E31B23]"
                onClick={() => onDeleteSet(item.routineExerciseId, set.id)}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
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
