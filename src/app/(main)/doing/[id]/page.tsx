import { db } from '@/db';
import { routines, routineExercises, exercises } from '@/db/schema';
import { eq } from 'drizzle-orm';

interface DoingPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface RoutineWithExercises {
  id: string;
  name: string;
  exercises: {
    id: string;
    name: string;
    mainCategory: string;
    subCategory: string;
    equipment: string;
    order: number;
  }[];
}

export default async function DoingPage({ params }: DoingPageProps) {
  const { id } = await params;

  // 루틴 정보 조회
  const [routine] = await db
    .select({
      id: routines.id,
      name: routines.name,
    })
    .from(routines)
    .where(eq(routines.id, id))
    .limit(1);

  if (!routine) {
    return <div className="flex min-h-0 flex-1 flex-col">루틴을 찾을 수 없습니다</div>;
  }

  // 루틴에 포함된 운동들 조회
  const routineExerciseList = await db
    .select({
      exerciseId: routineExercises.exerciseId,
      order: routineExercises.order,
    })
    .from(routineExercises)
    .where(eq(routineExercises.routineId, id))
    .orderBy(routineExercises.order);

  // 운동 상세 정보 조회
  const exerciseDetails = await Promise.all(
    routineExerciseList.map(async (re) => {
      const [exercise] = await db
        .select({
          id: exercises.excerciseId,
          name: exercises.name,
          mainCategory: exercises.mainCategory,
          subCategory: exercises.subCategory,
          equipment: exercises.equipment,
        })
        .from(exercises)
        .where(eq(exercises.excerciseId, re.exerciseId))
        .limit(1);

      return {
        ...exercise,
        order: re.order,
      };
    })
  );

  const routineWithExercises: RoutineWithExercises = {
    ...routine,
    exercises: exerciseDetails.filter(Boolean),
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <h1 className="text-xl font-bold text-white mb-4">{routineWithExercises.name}</h1>
      <div className="flex-1 overflow-y-auto">
        {routineWithExercises.exercises.map((exercise) => (
          <div key={exercise.id} className="rounded-xl bg-[#2A2A2A] p-4 mb-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-white">{exercise.order}. {exercise.name}</p>
                <p className="text-sm text-[#888888]">
                  {exercise.mainCategory} • {exercise.equipment}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
