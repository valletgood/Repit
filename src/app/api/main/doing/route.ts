import { NextResponse } from 'next/server';
import { db } from '@/db';
import { routineExerciseSets } from '@/db/schema';
import { eq } from 'drizzle-orm';

type SaveRoutineSetsBody = {
  routineId: string;
  exercises: {
    routineExerciseId: string;
    sets: {
      id: string;
      setNumber: number;
      weight: number | null;
      reps: number | null;
    }[];
  }[];
};

export async function PUT(req: Request) {
  try {
    const body = (await req.json()) as SaveRoutineSetsBody;

    if (!body?.routineId || !Array.isArray(body.exercises)) {
      return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
    }

    // 각 운동별로 세트 처리
    for (const exercise of body.exercises) {
      const { routineExerciseId, sets } = exercise;

      // 1) 기존 세트 모두 삭제
      await db
        .delete(routineExerciseSets)
        .where(eq(routineExerciseSets.routineExerciseId, routineExerciseId));

      // 2) 새 세트 삽입 (setNumber 재정렬)
      if (sets.length > 0) {
        const newSets = sets.map((s, idx) => ({
          routineExerciseId,
          setNumber: idx + 1,
          weight: s.weight,
          reps: s.reps,
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