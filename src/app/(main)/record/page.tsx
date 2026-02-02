'use client';

import { useState, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { useAppSelector } from '@/redux/hooks';
import {
  useGetDailyRecord,
  useGetMonthlyRecord,
} from '@/app/api/main/record/client/hooks/useGetRecord';
import type { WorkoutSetWithExercise } from '@/app/api/main/record/client/service/service';

interface ExerciseSummary {
  exerciseId: string;
  exerciseName: string;
  mainCategory: string;
  equipment: string;
  sets: WorkoutSetWithExercise[];
  totalReps: number;
  totalWeight: number;
  totalDuration: number;
  totalDistance: number;
}

export default function RecordPage() {
  const user = useAppSelector((state) => state.user);
  const [date, setDate] = useState<Date | undefined>(new Date());

  const dateStr = date ? date.toISOString().split('T')[0] : '';
  const monthStr = date
    ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    : '';

  const { data: dailyData, isLoading: isDailyLoading } = useGetDailyRecord(
    user.id as string,
    dateStr
  );
  const { data: monthlyData } = useGetMonthlyRecord(user.id as string, monthStr);

  const exerciseSummaries = useMemo<ExerciseSummary[]>(() => {
    if (!dailyData?.sets) return [];

    const grouped = new Map<string, ExerciseSummary>();

    for (const set of dailyData.sets) {
      const existing = grouped.get(set.exerciseId);
      if (existing) {
        existing.sets.push(set);
        existing.totalReps += set.reps ?? 0;
        existing.totalWeight += (set.weight ?? 0) * (set.reps ?? 0);
        existing.totalDuration += set.duration ?? 0;
        existing.totalDistance += set.distance ?? 0;
      } else {
        grouped.set(set.exerciseId, {
          exerciseId: set.exerciseId,
          exerciseName: set.exerciseName,
          mainCategory: set.mainCategory,
          equipment: set.equipment,
          sets: [set],
          totalReps: set.reps ?? 0,
          totalWeight: (set.weight ?? 0) * (set.reps ?? 0),
          totalDuration: set.duration ?? 0,
          totalDistance: set.distance ?? 0,
        });
      }
    }

    return Array.from(grouped.values());
  }, [dailyData?.sets]);
  console.log('dailyData:', dailyData);
  console.log('exerciseSummaries:', exerciseSummaries);
  const totalDuration = useMemo(() => {
    if (!dailyData?.sessions) return 0;
    return dailyData.sessions.reduce((sum, s) => sum + s.duration, 0);
  }, [dailyData?.sessions]);

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}시간 ${m}분`;
    return `${m}분`;
  };

  const workoutDates = useMemo(() => {
    if (!monthlyData?.workoutDates) return [];
    return monthlyData.workoutDates.map((d) => new Date(d));
  }, [monthlyData?.workoutDates]);

  const userName = user.name || 'OOO';
  const currentMonth = date ? date.getMonth() + 1 : new Date().getMonth() + 1;
  const workoutCount = monthlyData?.workoutCount ?? 0;

  return (
    <div className="flex h-[100svh] flex-1 flex-col gap-4">
      {/* 상단: 달력 */}
      <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-xl bg-[#2A2A2A]"
          modifiers={{
            workout: workoutDates,
          }}
          modifiersClassNames={{
            workout: 'bg-[#E31B23]/20 text-[#E31B23] font-bold',
          }}
        />
      </div>

      {/* 중간: 요약 메시지 */}
      <div className="px-2 text-center">
        <p className="text-lg font-semibold text-white">
          {userName}님 {currentMonth}월에 총{' '}
          <span className="text-[#E31B23]">{workoutCount}번</span> 운동 하셨어요.
        </p>
      </div>

      {/* 하단: 선택된 날의 운동 정보 카드 */}
      <div className="scrollbar-hide flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-2">
        {isDailyLoading && (
          <div className="rounded-xl bg-[#2A2A2A] p-6 text-center">
            <p className="text-[#888888]">로딩 중...</p>
          </div>
        )}

        {!isDailyLoading && exerciseSummaries.length === 0 && (
          <div className="rounded-xl bg-[#2A2A2A] p-6 text-center">
            <p className="text-[#888888]">
              {date?.toLocaleDateString('ko-KR', {
                month: 'long',
                day: 'numeric',
              })}
              에는 운동 기록이 없습니다.
            </p>
          </div>
        )}

        {!isDailyLoading && exerciseSummaries.length > 0 && (
          <>
            {/* 총 운동 시간 */}
            <div className="rounded-xl bg-[#2A2A2A] p-4">
              <p className="text-sm text-[#888888]">총 운동 시간</p>
              <p className="text-xl font-bold text-white">{formatDuration(totalDuration)}</p>
            </div>

            {/* 운동별 카드 */}
            {exerciseSummaries.map((exercise) => {
              const isCardio = exercise.equipment === '유산소';

              return (
                <Card key={exercise.exerciseId} className="border-0 bg-[#2A2A2A]">
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-bold text-white">{exercise.exerciseName}</h3>
                      <span className="text-sm text-[#888888]">{exercise.mainCategory}</span>
                    </div>

                    {isCardio ? (
                      <div className="flex gap-4 text-sm">
                        <div>
                          <span className="text-[#888888]">시간: </span>
                          <span className="text-white">
                            {formatDuration(exercise.totalDuration)}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#888888]">거리: </span>
                          <span className="text-white">{exercise.totalDistance.toFixed(2)}km</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-4 text-sm">
                        <div>
                          <span className="text-[#888888]">세트: </span>
                          <span className="text-white">{exercise.sets.length}세트</span>
                        </div>
                        <div>
                          <span className="text-[#888888]">총 횟수: </span>
                          <span className="text-white">{exercise.totalReps}회</span>
                        </div>
                        <div>
                          <span className="text-[#888888]">볼륨: </span>
                          <span className="text-white">
                            {exercise.totalWeight.toLocaleString()}kg
                          </span>
                        </div>
                      </div>
                    )}

                    {/* 세트 상세 */}
                    <div className="mt-3 space-y-1">
                      {exercise.sets.map((set) => (
                        <div
                          key={set.id}
                          className="flex items-center gap-2 text-xs text-[#BEBEBE]"
                        >
                          <span className="w-12">{set.setNumber}세트</span>
                          {isCardio ? (
                            <>
                              <span>{set.duration ? formatDuration(set.duration) : '-'}</span>
                              <span>·</span>
                              <span>{set.distance?.toFixed(2) ?? 0}km</span>
                            </>
                          ) : (
                            <>
                              <span>{set.weight ?? 0}kg</span>
                              <span>×</span>
                              <span>{set.reps ?? 0}회</span>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
