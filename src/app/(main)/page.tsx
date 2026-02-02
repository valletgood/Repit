import { db } from '@/db';
import { routines, routineExercises, exercises } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { HomeContent } from './_components/HomeContent';
import { getCurrentUser } from '@/lib/auth';

// 서버 컴포넌트 - DB에서 루틴 데이터를 직접 불러옴
export default async function HomePage() {
  const user = await getCurrentUser();

  // 미인증 시 빈 루틴 목록 전달 (AuthGuard가 리다이렉트 처리)
  if (!user) {
    return <HomeContent routines={[]} />;
  }

  // 해당 사용자의 루틴만 조회
  const routineList = await db
    .select()
    .from(routines)
    .where(eq(routines.userId, user.id));

  // 각 루틴에 대해 운동 정보 조회
  const routinesWithExercises = await Promise.all(
    routineList.map(async (routine) => {
      // 루틴에 포함된 운동 ID들 조회
      const routineExerciseList = await db
        .select({
          exerciseId: routineExercises.exerciseId,
          order: routineExercises.order,
        })
        .from(routineExercises)
        .where(eq(routineExercises.routineId, routine.id))
        .orderBy(routineExercises.order);

      // 운동 이름들 조회
      const exerciseNames = await Promise.all(
        routineExerciseList.map(async (re) => {
          const [exercise] = await db
            .select({ name: exercises.name })
            .from(exercises)
            .where(eq(exercises.excerciseId, re.exerciseId))
            .limit(1);
          return exercise?.name || '';
        })
      );

      return {
        ...routine,
        exerciseCount: routineExerciseList.length,
        exerciseNames: exerciseNames.filter(Boolean),
      };
    })
  );

  return <HomeContent routines={routinesWithExercises} />;
}
