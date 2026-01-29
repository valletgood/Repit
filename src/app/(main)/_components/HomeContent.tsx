'use client';

import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { useAppSelector } from '@/redux/hooks';
import { Button } from '@/components/ui/button';
import ChartBar from '@/components/chart/ChartBar';
import { useRouter } from 'next/navigation';
import type { Routine } from '@/db/schema';

// 임시 차트 데이터
const weeklyData = [
  { name: '월', value: 30 },
  { name: '화', value: 100 },
  { name: '수', value: 20 },
  { name: '목', value: 10 },
  { name: '금', value: 50 },
  { name: '토', value: 60 },
  { name: '일', value: 70 },
  { name: '평균', value: 80 },
];

interface RoutineWithExercises extends Routine {
  exerciseCount: number;
  exerciseNames: string[];
}

interface HomeContentProps {
  routines: RoutineWithExercises[];
}

export function HomeContent({ routines }: HomeContentProps) {
  const user = useAppSelector((state) => state.user);
  const userName = user.name || 'OOO';
  const router = useRouter();

  // 오늘 날짜
  const today = new Date();
  const month = today.getMonth() + 1;
  const date = today.getDate();

  const moveToRegRoutine = () => {
    router.push('/reg-routine');
  };

  return (
    <main className="min-h-screen bg-[#1A1A1A]">
      {/* 헤더 - 로고 */}
      <header className="flex items-center justify-center py-4">
        <Image src="/images/logo.svg" alt="REPIT" width={120} height={40} priority />
      </header>

      <div className="px-4">
        {/* 섹션 1: 인사말 */}
        <section className="mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">{userName}님</span>
            <span className="text-sm text-[#888888]">
              {month}월 {date}일
            </span>
            <span className="text-sm text-[#888888]">|</span>
            <span className="text-sm">🔥 3일 연속</span>
          </div>
        </section>

        {/* 섹션 2: 최근 기록 */}
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-bold text-white">최근 기록</h2>

          {/* 차트 */}
          <ChartBar data={weeklyData} />

          {/* 요약 정보 */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#888888]">지난 7일</p>
              <p className="text-lg font-bold text-white">총 5회 2시간 40분</p>
            </div>
            <ChevronRight className="h-6 w-6 text-[#888888]" />
          </div>
        </section>

        {/* 섹션 3: 루틴 */}
        <section>
          <h2 className="mb-4 text-lg font-bold text-white">루틴</h2>
          <Button variant="dark" size="full" onClick={moveToRegRoutine} className="mb-4">
            + 루틴 만들기
          </Button>

          {routines.length > 0 && (
            <div className="flex flex-col gap-3">
              {routines.map((routine) => (
                <div key={routine.id} className="rounded-xl bg-[#2A2A2A] p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">{routine.name}</p>
                      <p className="text-sm text-[#888888]">
                        {routine.exerciseNames.slice(0, 3).join(', ')}
                        {routine.exerciseCount > 3 && ` 외 ${routine.exerciseCount - 3}개`}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-[#888888]" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {routines.length === 0 && (
            <div className="rounded-xl bg-[#2A2A2A] p-6 text-center">
              <p className="text-[#888888]">아직 등록된 루틴이 없습니다</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
