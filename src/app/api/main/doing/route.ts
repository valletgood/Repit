import { NextResponse } from 'next/server';
import { db } from '@/db';
import { routineExerciseSets, routineExercises, workoutSessions, routines } from '@/db/schema';
import { eq } from 'drizzle-orm';

type SaveRoutineSetsBody = {
  routineId: string;
  duration: number;
  saveSession: boolean;
  exercises: {
    routineExerciseId: string;
    exerciseId: string;
    order: number;
    sets: {
      id: string;
      setNumber: number;
      weight: number | null;
      reps: number | null;
      duration: number | null;
      distance: number | null;
    }[];
  }[];
};

export async function PUT(req: Request) {
  try {
    const body = (await req.json()) as SaveRoutineSetsBody;

    if (!body?.routineId || !Array.isArray(body.exercises)) {
      return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
    }

    // 루틴에서 userId 가져오기
    const [routine] = await db
      .select({ userId: routines.userId })
      .from(routines)
      .where(eq(routines.id, body.routineId))
      .limit(1);

    if (!routine) {
      return NextResponse.json({ error: '루틴을 찾을 수 없습니다.' }, { status: 404 });
    }

    // 운동 세션 저장 (saveSession이 true일 때만)
    if (body.saveSession) {
      await db.insert(workoutSessions).values({
        userId: routine.userId,
        date: new Date(),
        duration: body.duration ?? 0,
      });
    }

    // 각 운동별로 세트 처리
    for (const exercise of body.exercises) {
      const { routineExerciseId, exerciseId, order, sets } = exercise;

      let actualRoutineExerciseId = routineExerciseId;

      // 새 운동인 경우 (temp-로 시작하는 ID)
      if (routineExerciseId.startsWith('temp-')) {
        const [newRoutineExercise] = await db
          .insert(routineExercises)
          .values({
            routineId: body.routineId,
            exerciseId,
            order,
          })
          .returning({ id: routineExercises.id });

        actualRoutineExerciseId = newRoutineExercise.id;
      } else {
        // 기존 운동인 경우 세트 삭제
        await db
          .delete(routineExerciseSets)
          .where(eq(routineExerciseSets.routineExerciseId, routineExerciseId));
      }

      // 새 세트 삽입 (setNumber 재정렬)
      if (sets.length > 0) {
        const newSets = sets.map((s, idx) => ({
          routineExerciseId: actualRoutineExerciseId,
          setNumber: idx + 1,
          weight: s.weight,
          reps: s.reps,
          duration: s.duration,
          distance: s.distance,
        }));

        await db.insert(routineExerciseSets).values(newSets);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: '세트 저장 중 오류가 발생했습니다.' }, { status: 500 });
  }
}