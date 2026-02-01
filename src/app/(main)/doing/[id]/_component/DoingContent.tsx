'use client';
import { RoutineWithExercises } from '@/app/(main)/doing/[id]/page';
import { DoingAccordion } from '@/app/(main)/doing/[id]/_component/DoingAccordion';
import { Button } from '@/components/ui/button';

interface DoingContentProps {
  exercise: RoutineWithExercises;
}

export function DoingContent({ exercise }: DoingContentProps) {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      {/* 스크롤 영역: 하단 버튼바 높이만큼 padding */}
      <div className="flex min-h-0 flex-1 flex-col pb-24">
        <DoingAccordion exercise={exercise.exercises} />
      </div>

      {/* 하단 고정 버튼바 */}
      <div className="sticky right-0 bottom-0 left-0 z-20 bg-[#1A1A1A] pt-3 pb-14">
        <div className="flex items-center justify-center gap-4 px-4">
          <Button
            variant="secondary"
            onClick={() => {
              // TODO: 임시저장 로직 연결
              console.log('임시저장');
            }}
            className="w-40"
          >
            임시저장
          </Button>

          <Button variant="active" onClick={() => {}} className="w-40">
            운동완료
          </Button>
        </div>

        {/* 안전영역(iOS) 대응 */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
    </div>
  );
}
