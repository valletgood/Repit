import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { routines } from '@/db/schema';
import { eq } from 'drizzle-orm';

// 루틴 삭제
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const routineId = searchParams.get('routineId');

    if (!routineId) {
      return NextResponse.json({ error: '루틴 ID가 필요합니다.' }, { status: 400 });
    }

    // 루틴 존재 확인
    const [routine] = await db
      .select({ id: routines.id })
      .from(routines)
      .where(eq(routines.id, routineId))
      .limit(1);

    if (!routine) {
      return NextResponse.json({ error: '루틴을 찾을 수 없습니다.' }, { status: 404 });
    }

    // 루틴 삭제 (cascade로 routineExercises, routineExerciseSets도 삭제됨)
    await db.delete(routines).where(eq(routines.id, routineId));

    return NextResponse.json({ message: '루틴이 삭제되었습니다.' }, { status: 200 });
  } catch (error) {
    console.error('루틴 삭제 에러:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 루틴명 수정
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { routineId, name } = body;

    if (!routineId) {
      return NextResponse.json({ error: '루틴 ID가 필요합니다.' }, { status: 400 });
    }

    if (!name || name.trim() === '') {
      return NextResponse.json({ error: '루틴 이름을 입력해주세요.' }, { status: 400 });
    }

    // 루틴 존재 확인
    const [routine] = await db
      .select({ id: routines.id })
      .from(routines)
      .where(eq(routines.id, routineId))
      .limit(1);

    if (!routine) {
      return NextResponse.json({ error: '루틴을 찾을 수 없습니다.' }, { status: 404 });
    }

    // 루틴명 수정
    await db
      .update(routines)
      .set({ name: name.trim(), updatedAt: new Date() })
      .where(eq(routines.id, routineId));

    return NextResponse.json({ message: '루틴명이 수정되었습니다.' }, { status: 200 });
  } catch (error) {
    console.error('루틴 수정 에러:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
