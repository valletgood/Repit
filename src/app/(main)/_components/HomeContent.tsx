'use client';

import { ChevronRight, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useAppSelector } from '@/redux/hooks';
import { Button } from '@/components/ui/button';
import ChartBar from '@/components/chart/ChartBar';
import { useRouter } from 'next/navigation';
import type { Routine } from '@/db/schema';
import { useGetWeeklyChart } from '@/app/api/main/chart/client/hooks/useGetWeeklyChart';
import { useEffect, useState } from 'react';
import { useModal } from '@/hooks/useModal';
import { useDeleteRoutine, useUpdateRoutine } from '@/app/api/main/routine/client/hooks/useRoutine';
import { RoutineEditModal } from '@/components/ui/modal';
import { toast } from 'sonner';

interface RoutineWithExercises extends Routine {
  exerciseCount: number;
  exerciseNames: string[];
}

interface HomeContentProps {
  routines: RoutineWithExercises[];
}

export function HomeContent({ routines }: HomeContentProps) {
  const user = useAppSelector((state) => state.user);
  const modal = useModal();
  const [stats, setStats] = useState({
    sequenceDay: 0,
    totalDay: 0,
    totalDuration: '',
  });
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<RoutineWithExercises | null>(null);

  const { mutate: deleteRoutine, isPending: isDeleting } = useDeleteRoutine();
  const { mutate: updateRoutine, isPending: isUpdating } = useUpdateRoutine();

  const userName = user.name || 'OOO';
  const router = useRouter();
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1); // 내일 포함

  const { data: chartData } = useGetWeeklyChart(
    user.id as string,
    start.toISOString(),
    end.toISOString()
  );

  const month = today.getMonth() + 1;
  const date = today.getDate();

  const moveToRegRoutine = () => {
    router.push('/reg-routine');
  };

  const moveToDoing = (routineId: string) => {
    router.push(`/doing/${routineId}`);
  };

  const handleMenuToggle = (e: React.MouseEvent, routineId: string) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === routineId ? null : routineId);
  };

  const handleEdit = (e: React.MouseEvent, routine: RoutineWithExercises) => {
    e.stopPropagation();
    setOpenMenuId(null);
    setEditingRoutine(routine);
    setEditModalOpen(true);
  };

  const handleDelete = (e: React.MouseEvent, routine: RoutineWithExercises) => {
    e.stopPropagation();
    setOpenMenuId(null);
    modal.confirm(`"${routine.name}" 루틴을 삭제하시겠습니까?`, () => {
      deleteRoutine(routine.id, {
        onSuccess: () => {
          toast.success('루틴이 삭제되었습니다.');
          router.refresh();
        },
        onError: () => {
          toast.error('루틴 삭제에 실패했습니다.');
        },
      });
    });
  };

  const handleUpdateRoutineName = (name: string) => {
    if (!editingRoutine) return;
    updateRoutine(
      { routineId: editingRoutine.id, name },
      {
        onSuccess: () => {
          toast.success('루틴명이 수정되었습니다.');
          setEditModalOpen(false);
          setEditingRoutine(null);
          router.refresh();
        },
        onError: () => {
          toast.error('루틴명 수정에 실패했습니다.');
        },
      }
    );
  };

  useEffect(() => {
    if (chartData) {
      // 연속 운동 일수 계산 (오늘부터 하루씩 전날로 돌아가면서)
      let consecutiveDays = 0;
      const today = new Date();

      for (let i = 0; i < 7; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        const dateStr = checkDate.toISOString().split('T')[0].substring(5); // MM-DD 형식

        const dayData = chartData.find((item) => item.name === dateStr);
        if (dayData && dayData.value > 0) {
          consecutiveDays++;
        } else {
          break; // 운동이 없는 날이 나오면 중단
        }
      }

      // 총 운동 일수와 시간 계산
      const workoutDays = chartData.filter((item) => item.name !== '평균' && item.value > 0).length;
      const totalSeconds = chartData
        .filter((item) => item.name !== '평균')
        .reduce((sum, item) => sum + item.value, 0);

      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);

      // Batch all state updates together asynchronously
      setTimeout(() => {
        setStats({
          sequenceDay: consecutiveDays,
          totalDay: workoutDays,
          totalDuration: `${hours}시간 ${minutes}분`,
        });
      }, 0);
    }
  }, [chartData]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
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
      <section className="mb-4">
        <h2 className="mb-4 text-lg font-bold text-white">최근 기록</h2>

        {/* 차트 */}
        <ChartBar data={chartData ?? []} />

        {/* 요약 정보 */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#888888]">지난 7일</p>
            <p className="text-lg font-bold text-white">
              총 {stats.totalDay}회 {stats.totalDuration}
            </p>
          </div>
          <ChevronRight className="h-6 w-6 text-[#888888]" />
        </div>
      </section>

      {/* 섹션 3: 루틴 */}
      <section className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <h2 className="mb-4 text-lg font-bold text-white">루틴</h2>
        <Button variant="dark" size="full" onClick={moveToRegRoutine} className="mb-4 shrink-0">
          + 루틴 만들기
        </Button>

        {routines.length > 0 && (
          <div className="scrollbar-hide flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto rounded-xl">
            {routines.map((routine) => (
              <div
                key={routine.id}
                className="relative cursor-pointer rounded-xl bg-[#2A2A2A] p-4 transition-colors hover:bg-[#333333]"
                onClick={() => moveToDoing(routine.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 pr-2">
                    <p className="font-bold text-white">{routine.name}</p>
                    <p className="text-sm text-[#888888]">
                      {routine.exerciseNames.slice(0, 3).join(', ')}
                      {routine.exerciseCount > 3 && ` 외 ${routine.exerciseCount - 3}개`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleMenuToggle(e, routine.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-[#888888] hover:bg-[#3A3A3A] hover:text-white"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>
                    <ChevronRight className="h-5 w-5 text-[#888888]" />
                  </div>
                </div>

                {/* 드롭다운 메뉴 */}
                {openMenuId === routine.id && (
                  <div className="absolute right-12 top-12 z-10 min-w-[120px] rounded-lg bg-[#3A3A3A] py-1 shadow-lg">
                    <button
                      onClick={(e) => handleEdit(e, routine)}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-white hover:bg-[#4A4A4A]"
                    >
                      <Pencil className="h-4 w-4" />
                      이름 수정
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, routine)}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-[#E31B23] hover:bg-[#4A4A4A]"
                    >
                      <Trash2 className="h-4 w-4" />
                      삭제
                    </button>
                  </div>
                )}
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
      <modal.Modal />

      {/* 루틴 이름 수정 모달 */}
      <RoutineEditModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingRoutine(null);
        }}
        onSave={handleUpdateRoutineName}
        currentName={editingRoutine?.name ?? ''}
      />
    </div>
  );
}
