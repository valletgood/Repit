'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import type { Exercise } from '@/db/schema';
import Image from 'next/image';

interface ExerciseSelectSheetProps {
  isOpen: boolean;
  onClose: () => void;
  exercises: Exercise[];
  categories: string[];
  equipments: string[];
  onSelect: (selectedExercises: Exercise[]) => void;
  existingExerciseIds?: string[];
}

export function ExerciseSelectSheet({
  isOpen,
  onClose,
  exercises,
  categories,
  equipments,
  onSelect,
  existingExerciseIds = [],
}: ExerciseSelectSheetProps) {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedEquipment, setSelectedEquipment] = useState('전체');
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);

  const handleAddExercise = (exerciseId: string) => {
    if (selectedExercises.includes(exerciseId)) {
      setSelectedExercises(selectedExercises.filter((id) => id !== exerciseId));
    } else {
      setSelectedExercises([...selectedExercises, exerciseId]);
    }
  };

  const handleConfirm = () => {
    const selected = exercises.filter((e) => selectedExercises.includes(e.excerciseId));
    onSelect(selected);
    setSelectedExercises([]);
    setSearchText('');
    setSelectedCategory('전체');
    setSelectedEquipment('전체');
    onClose();
  };

  const handleClose = () => {
    setSelectedExercises([]);
    setSearchText('');
    setSelectedCategory('전체');
    setSelectedEquipment('전체');
    onClose();
  };

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory =
      selectedCategory === '전체' || exercise.mainCategory === selectedCategory;
    const matchesEquipment =
      selectedEquipment === '전체' || exercise.equipment === selectedEquipment;
    const notAlreadyAdded = !existingExerciseIds.includes(exercise.excerciseId);
    return matchesSearch && matchesCategory && matchesEquipment && notAlreadyAdded;
  });
  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose} title="운동 추가">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-4">
        {/* 검색 영역 */}
        <div className="mb-3 shrink-0">
          <Input
            value={searchText}
            variant="auth"
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="운동 이름을 검색하세요"
            className="w-full px-4 py-3 text-sm placeholder:text-[#999999]"
          />
        </div>

        {/* 부위 필터 */}
        <div className="scrollbar-hide mb-2 flex shrink-0 gap-2 overflow-x-auto">
          {['전체', ...categories].map((filter) => (
            <Button
              key={filter}
              variant={selectedCategory === filter ? 'active' : 'outline'}
              onClick={() => setSelectedCategory(filter)}
              className="shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors"
            >
              {filter}
            </Button>
          ))}
        </div>

        {/* 장비 필터 */}
        <div className="scrollbar-hide mb-3 flex shrink-0 gap-2 overflow-x-auto">
          {['전체', ...equipments].map((filter) => (
            <Button
              key={filter}
              variant={selectedEquipment === filter ? 'active' : 'outline'}
              onClick={() => setSelectedEquipment(filter)}
              className="shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors"
            >
              {filter}
            </Button>
          ))}
        </div>

        {/* 선택된 운동 목록 */}
        {selectedExercises.length > 0 && (
          <div className="mb-3 shrink-0">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-white">
                선택한 운동 ({selectedExercises.length}개)
              </span>
              <button
                onClick={() => setSelectedExercises([])}
                className="text-xs text-[#999999] hover:text-white"
              >
                전체 삭제
              </button>
            </div>
            <div className="scrollbar-hide flex gap-2 overflow-x-auto">
              {selectedExercises.map((exerciseId) => {
                const exercise = exercises.find((e) => e.excerciseId === exerciseId);
                if (!exercise) return null;
                return (
                  <div
                    key={exerciseId}
                    className="flex shrink-0 items-center gap-2 rounded-full bg-[#8B0F14] px-3 py-1.5"
                  >
                    <span className="text-sm text-white">{exercise.name}</span>
                    <button
                      onClick={() => handleAddExercise(exerciseId)}
                      className="flex h-4 w-4 items-center justify-center rounded-full bg-white/20 text-xs text-white hover:bg-white/30"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 운동 목록 */}
        <div className="scrollbar-hide flex flex-1 flex-col gap-2 overflow-y-auto pb-25">
          {filteredExercises.length === 0 ? (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-[#999999]">검색 결과가 없습니다</p>
            </div>
          ) : (
            filteredExercises.map((exercise) => {
              const isSelected = selectedExercises.includes(exercise.excerciseId);
              return (
                <div
                  key={exercise.excerciseId}
                  className="flex items-center justify-between rounded-xl bg-[#2A2A2A] p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">
                      {exercise.equipment === '맨몸' && (
                        <Image src="/images/icon_body.svg" alt="맨몸" width={24} height={24} />
                      )}
                      {exercise.equipment === '바벨' && (
                        <Image src="/images/icon_barbell.svg" alt="바벨" width={24} height={24} />
                      )}
                      {exercise.equipment === '덤벨' && (
                        <Image src="/images/icon_dumbell.svg" alt="덤벨" width={24} height={24} />
                      )}
                      {exercise.equipment === '머신' && (
                        <Image src="/images/icon_machine.svg" alt="머신" width={24} height={24} />
                      )}
                      {exercise.equipment === '케이블' && (
                        <Image src="/images/icon_cable.svg" alt="케이블" width={24} height={24} />
                      )}
                      {exercise.equipment === '유산소' && (
                        <Image
                          src="/images/icon_treadmill.svg"
                          alt="케이블"
                          width={24}
                          height={24}
                        />
                      )}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white">{exercise.name}</span>
                      <span className="text-xs text-[#999999]">
                        {exercise.mainCategory} · {exercise.equipment}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant={isSelected ? 'active' : 'outline'}
                    onClick={() => handleAddExercise(exercise.excerciseId)}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-colors"
                  >
                    {isSelected ? '선택됨' : '+ 추가'}
                  </Button>
                </div>
              );
            })
          )}
        </div>

        {/* 하단 확인 버튼 */}
        {selectedExercises.length > 0 && (
          <div className="fixed right-0 bottom-0 left-1/2 w-1/2 -translate-x-1/2 px-4 py-4">
            <Button
              onClick={handleConfirm}
              variant="active"
              className="w-full rounded-full py-3 text-base font-medium text-white"
            >
              {selectedExercises.length}개 운동 추가
            </Button>
          </div>
        )}
      </div>
    </BottomSheet>
  );
}
