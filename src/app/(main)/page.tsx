'use client';

import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { useAppSelector } from '@/redux/hooks';
import { Button } from '@/components/ui/button';
import ChartBar from '@/components/chart/ChartBar';

// 임시 데이터
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

const routines = [];

export default function HomePage() {
  const user = useAppSelector((state) => state.user);
  const userName = user.name || 'OOO';

  // 오늘 날짜
  const today = new Date();
  const month = today.getMonth() + 1;
  const date = today.getDate();

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
          {/* <div className="mb-4 flex items-end justify-between gap-2">
            {weeklyData.map((item, index) => {
              const maxValue = 100;
              const height = item.value === 0 ? 8 : (item.value / maxValue) * 120;
              const isAverage = item.day === '평균';

              return (
                <div key={index} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className={`w-full rounded-sm ${isAverage ? 'bg-[#E31B23]' : 'bg-[#8B0F14]'}`}
                    style={{ height: `${height}px` }}
                  />
                  <span className="text-xs text-[#888888]">{item.day}</span>
                </div>
              );
            })}
          </div> */}

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

          {routines.length > 0 ? (
            <div className="flex flex-col gap-3">
              {routines.map((routine) => (
                <div
                  key={routine.id}
                  className={`rounded-xl p-4 ${routine.exercises ? 'bg-[#2A2A2A]' : 'bg-[#3A3A3A]'}`}
                >
                  {routine.exercises ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">{routine.name}</p>
                        <p className="text-sm text-[#888888]">{routine.exercises}</p>
                      </div>
                      {routine.lastUsed && (
                        <span className="rounded-full border border-[#8B0F14] px-3 py-1 text-xs text-[#E31B23]">
                          {routine.lastUsed}
                        </span>
                      )}
                    </div>
                  ) : (
                    <p className="text-[#888888]">{routine.name}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <Button variant="dark" size="full">
              + 루틴 만들기
            </Button>
          )}
        </section>
      </div>
    </main>
  );
}
