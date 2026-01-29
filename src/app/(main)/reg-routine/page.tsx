import Image from 'next/image';
import { db } from '@/db';
import { exercises } from '@/db/schema';
import { RoutineForm } from './_components/RoutineForm';

// 서버 컴포넌트 - DB에서 운동 데이터를 직접 불러옴
export default async function RegRoutinePage() {
  // 서버에서 운동 목록 조회 (API 호출 없이 직접 DB 접근)
  const exerciseList = await db.select().from(exercises);

  // 중복 없는 카테고리, 장비 목록 추출
  const categories = [...new Set(exerciseList.map((e) => e.mainCategory))];
  const equipments = [...new Set(exerciseList.map((e) => e.equipment))];

  return (
    <main className="flex h-full flex-col overflow-hidden bg-[#1A1A1A]">
      {/* 헤더 */}
      <header className="flex shrink-0 items-center justify-center py-4">
        <Image src="/images/logo.svg" alt="REPIT" width={120} height={40} priority />
      </header>

      {/* 클라이언트 컴포넌트에 데이터 전달 */}
      <RoutineForm exercises={exerciseList} categories={categories} equipments={equipments} />
    </main>
  );
}
