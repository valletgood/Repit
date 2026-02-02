import { db } from '@/db';
import { exercises } from '@/db/schema';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const exerciseList = await db.select().from(exercises);

    const categories = [...new Set(exerciseList.map((e) => e.mainCategory))];
    const equipments = [...new Set(exerciseList.map((e) => e.equipment))];

    return NextResponse.json({ exercises: exerciseList, categories, equipments }, { status: 200 });
  } catch (error) {
    console.error('운동 목록 조회 에러:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
