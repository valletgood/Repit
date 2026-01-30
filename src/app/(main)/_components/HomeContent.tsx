'use client';

import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { useAppSelector } from '@/redux/hooks';
import { Button } from '@/components/ui/button';
import ChartBar from '@/components/chart/ChartBar';
import { useRouter } from 'next/navigation';
import type { Routine } from '@/db/schema';
import { useGetWeeklyChart } from '@/app/api/main/chart/client/hooks/useGetWeeklyChart';
import { useEffect, useState } from 'react';

interface RoutineWithExercises extends Routine {
  exerciseCount: number;
  exerciseNames: string[];
}

interface HomeContentProps {
  routines: RoutineWithExercises[];
}

export function HomeContent({ routines }: HomeContentProps) {
  const user = useAppSelector((state) => state.user);
  const [stats, setStats] = useState({
    sequenceDay: 0,
    totalDay: 0,
    totalDuration: ''
  });
  const userName = user.name || 'OOO';
  const router = useRouter();
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1); // 내일 포함

  const { data: chartData } = useGetWeeklyChart(user.id as string, start.toISOString(), end.toISOString());

  const month = today.getMonth() + 1;
  const date = today.getDate();


  const moveToRegRoutine = () => {
    router.push('/reg-routine');
  };

  useEffect(() => {
    if(chartData) {
      // 연속 운동 일수 계산 (오늘부터 하루씩 전날로 돌아가면서)
      let consecutiveDays = 0;
      const today = new Date();
      
      for (let i = 0; i < 7; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        const dateStr = checkDate.toISOString().split('T')[0].substring(5); // MM-DD 형식
        
        const dayData = chartData.find(item => item.name === dateStr);
        if (dayData && dayData.value > 0) {
          consecutiveDays++;
        } else {
          break; // 운동이 없는 날이 나오면 중단
        }
      }
      
      // 총 운동 일수와 시간 계산
      const workoutDays = chartData.filter(item => item.name !== '평균' && item.value > 0).length;
      const totalSeconds = chartData
        .filter(item => item.name !== '평균')
        .reduce((sum, item) => sum + item.value, 0);
      
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      
      // Batch all state updates together asynchronously
      setTimeout(() => {
        setStats({
          sequenceDay: consecutiveDays,
          totalDay: workoutDays,
          totalDuration: `${hours}시간 ${minutes}분`
        });
      }, 0);
    }
  }, [chartData]);

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
            <span className="text-sm">🔥 {stats.sequenceDay}일 연속</span>
          </div>
        </section>

        {/* 섹션 2: 최근 기록 */}
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-bold text-white">최근 기록</h2>

          {/* 차트 */}
          <ChartBar data={chartData ?? []} />

          {/* 요약 정보 */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#888888]">지난 7일</p>
              <p className="text-lg font-bold text-white">총 {stats.totalDay}회 {stats.totalDuration}</p>
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
