import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { routines, routineExercises } from '@/db/schema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, exerciseIds } = body;

    // 유효성 검사
    if (!userId) {
      return NextResponse.json({ error: '사용자 정보가 필요합니다.' }, { status: 400 });
    }

    if (!name || name.trim() === '') {
      return NextResponse.json({ error: '루틴 이름을 입력해주세요.' }, { status: 400 });
    }

    if (!exerciseIds || !Array.isArray(exerciseIds) || exerciseIds.length === 0) {
      return NextResponse.json({ error: '최소 1개 이상의 운동을 선택해주세요.' }, { status: 400 });
    }

    // 루틴 생성
    const [newRoutine] = await db
      .insert(routines)
      .values({
        userId,
        name: name.trim(),
      })
      .returning();

    // 루틴에 운동들 추가 (순서 포함)
    const routineExerciseValues = exerciseIds.map((exerciseId: string, index: number) => ({
      routineId: newRoutine.id,
      exerciseId,
      order: index + 1,
    }));

    await db.insert(routineExercises).values(routineExerciseValues);

    return NextResponse.json(
      {
        message: '루틴이 저장되었습니다.',
        routine: {
          id: newRoutine.id,
          name: newRoutine.name,
          exerciseCount: exerciseIds.length,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('루틴 저장 에러:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
