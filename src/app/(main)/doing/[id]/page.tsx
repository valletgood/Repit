import { db } from '@/db';
import { routines, routineExercises, routineExerciseSets, exercises } from '@/db/schema';
import { eq, asc, inArray } from 'drizzle-orm';
import { DoingContent } from '@/app/(main)/doing/[id]/_component/DoingContent';

interface DoingPageProps {
  params: Promise<{ id: string }>;
}

export interface RoutineExerciseSetDTO {
  id: string;
  setNumber: number;
  weight: number | null;
  reps: number | null;
  duration: number | null;
  distance: number | null;
}

export interface RoutineExerciseDTO {
  routineExerciseId: string;
  order: number;
  exerciseId: string;
  name: string;
  mainCategory: string;
  subCategory: string | null;
  equipment: string;
  sets: RoutineExerciseSetDTO[];
}

export interface RoutineWithExercises {
  id: string;
  name: string;
  exercises: RoutineExerciseDTO[];
}

export default async function DoingPage({ params }: DoingPageProps) {
  const { id: routineId } = await params;

  // 1) 루틴 정보
  const [routine] = await db
    .select({ id: routines.id, name: routines.name })
    .from(routines)
    .where(eq(routines.id, routineId))
    .limit(1);

  if (!routine) {
    return <div className="flex min-h-0 flex-1 flex-col">루틴을 찾을 수 없습니다</div>;
  }

  // 2) 루틴 운동 + 운동 상세 (JOIN으로 한 방)
  const routineExerciseRows = await db
    .select({
      routineExerciseId: routineExercises.id,
      order: routineExercises.order,

      exerciseId: exercises.excerciseId,
      name: exercises.name,
      mainCategory: exercises.mainCategory,
      subCategory: exercises.subCategory,
      equipment: exercises.equipment,
    })
    .from(routineExercises)
    .innerJoin(exercises, eq(routineExercises.exerciseId, exercises.excerciseId))
    .where(eq(routineExercises.routineId, routineId))
    .orderBy(asc(routineExercises.order));

  // 운동이 없으면 그대로 내려도 됨
  if (routineExerciseRows.length === 0) {
    const routineWithExercises: RoutineWithExercises = { ...routine, exercises: [] };
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <h1 className="mb-4 text-xl font-bold text-white">{routineWithExercises.name}</h1>
        <DoingContent exercise={routineWithExercises} />
      </div>
    );
  }

  // 3) 세트 한 방에 조회 (routineExerciseId들로)
  const routineExerciseIds = routineExerciseRows.map((r) => r.routineExerciseId);

  const setRows = await db
    .select({
      id: routineExerciseSets.id,
      routineExerciseId: routineExerciseSets.routineExerciseId,
      setNumber: routineExerciseSets.setNumber,
      weight: routineExerciseSets.weight,
      reps: routineExerciseSets.reps,
      duration: routineExerciseSets.duration,
      distance: routineExerciseSets.distance,
    })
    .from(routineExerciseSets)
    .where(inArray(routineExerciseSets.routineExerciseId, routineExerciseIds))
    .orderBy(asc(routineExerciseSets.setNumber));

  // 4) routineExerciseId 기준으로 세트 묶기
  const setsByRoutineExerciseId = new Map<string, RoutineExerciseSetDTO[]>();
  for (const s of setRows) {
    const arr = setsByRoutineExerciseId.get(s.routineExerciseId) ?? [];
    arr.push({
      id: s.id,
      setNumber: s.setNumber,
      weight: s.weight ?? null,
      reps: s.reps ?? null,
      duration: s.duration ?? null,
      distance: s.distance ?? null,
    });
    setsByRoutineExerciseId.set(s.routineExerciseId, arr);
  }

  // 5) 운동 + 세트 합치기
  const mergedExercises: RoutineExerciseDTO[] = routineExerciseRows.map((r) => ({
    routineExerciseId: r.routineExerciseId,
    order: r.order,
    exerciseId: r.exerciseId,
    name: r.name,
    mainCategory: r.mainCategory,
    subCategory: r.subCategory ?? null,
    equipment: r.equipment,
    sets: setsByRoutineExerciseId.get(r.routineExerciseId) ?? [],
  }));

  const routineWithExercises: RoutineWithExercises = {
    ...routine,
    exercises: mergedExercises,
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <DoingContent exercise={routineWithExercises} />
    </div>
  );
}
