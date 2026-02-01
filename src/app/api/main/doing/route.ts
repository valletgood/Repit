import { NextResponse } from 'next/server';
import { db } from '@/db';
import { routineExerciseSets } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

type AddSetBody = {
  routineExerciseId: string;
  weight?: number | null;
  reps?: number | null;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as AddSetBody;

    // 1) 기본 검증
    if (!body?.routineExerciseId || typeof body.routineExerciseId !== 'string') {
      return NextResponse.json({ error: 'routineExerciseId가 필요합니다.' }, { status: 400 });
    }

    const weight =
      body.weight === undefined ? null : body.weight === null ? null : Number(body.weight);
    const reps = body.reps === undefined ? null : body.reps === null ? null : Number(body.reps);

    if (weight !== null && (Number.isNaN(weight) || weight < 0)) {
      return NextResponse.json({ error: 'weight 값이 올바르지 않습니다.' }, { status: 400 });
    }
    if (reps !== null && (Number.isNaN(reps) || reps < 0)) {
      return NextResponse.json({ error: 'reps 값이 올바르지 않습니다.' }, { status: 400 });
    }

    // 2) 다음 setNumber 계산 (max + 1)
    const [row] = await db
      .select({
        maxSetNumber: sql<number | null>`max(${routineExerciseSets.setNumber})`,
      })
      .from(routineExerciseSets)
      .where(eq(routineExerciseSets.routineExerciseId, body.routineExerciseId));

    const nextSetNumber = (row?.maxSetNumber ?? 0) + 1;

    // 3) insert
    const [created] = await db
      .insert(routineExerciseSets)
      .values({
        routineExerciseId: body.routineExerciseId,
        setNumber: nextSetNumber,
        weight,
        reps,
      })
      .returning({
        id: routineExerciseSets.id,
        routineExerciseId: routineExerciseSets.routineExerciseId,
        setNumber: routineExerciseSets.setNumber,
        weight: routineExerciseSets.weight,
        reps: routineExerciseSets.reps,
        createdAt: routineExerciseSets.createdAt,
      });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: '세트 추가 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
