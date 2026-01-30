import { db } from '@/db';
import { workoutSessions } from '@/db/schema';
import { NextRequest, NextResponse } from 'next/server';
import { and } from 'drizzle-orm';
import { eq } from 'drizzle-orm';
import { between } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: '사용자 정보가 필요합니다.' }, { status: 400 });
    }
    const startDate = new Date(searchParams.get('startDate') || '');
    const endDate = new Date(searchParams.get('endDate') || '');

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json({ error: '유효하지 않은 날짜 형식입니다.' }, { status: 400 });
    }
    const chartData = await db
      .select()
      .from(workoutSessions)
      .where(
        and(
          eq(workoutSessions.userId, userId as string),
          between(workoutSessions.date, startDate, endDate)
        )
      );
    return NextResponse.json(chartData, { status: 200 });
  } catch (error) {
    console.error('차트 데이터 조회 에러:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
