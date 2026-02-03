import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { workoutSessions, workoutSets, exercises } from '@/db/schema';
import { eq, and, gte, sql } from 'drizzle-orm';
import { cookies } from 'next/headers';

const ACCESS_TOKEN_COOKIE = 'access_token';

interface TokenPayload {
  userId: string;
  exp: number;
}

function parseToken(token: string): TokenPayload | null {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    return JSON.parse(decoded) as TokenPayload;
  } catch {
    return null;
  }
}

// 1. 부위별 차트 - 최근 일주일 요일별 데이터
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

    if (!accessToken) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const payload = parseToken(accessToken);
    if (!payload) {
      return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const part = searchParams.get('part');
    const type = searchParams.get('type'); // 'part-weekly' or 'part-distribution'

    if (!type) {
      return NextResponse.json({ error: 'type 파라미터가 필요합니다.' }, { status: 400 });
    }

    const userId = payload.userId;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // 1. 부위별 주간 차트
    if (type === 'part-weekly') {
      if (!part) {
        return NextResponse.json({ error: 'part 파라미터가 필요합니다.' }, { status: 400 });
      }

      // 최근 일주일 동안의 운동 데이터 조회
      const weeklyData = await db
        .select({
          date: workoutSessions.date,
          totalSets: sql<number>`count(${workoutSets.id})`,
          totalVolume: sql<number>`sum(${workoutSets.weight} * ${workoutSets.reps})`,
        })
        .from(workoutSessions)
        .innerJoin(workoutSets, eq(workoutSets.sessionId, workoutSessions.id))
        .innerJoin(exercises, eq(exercises.excerciseId, workoutSets.exerciseId))
        .where(
          and(
            eq(workoutSessions.userId, userId),
            eq(exercises.mainCategory, part),
            gte(workoutSessions.date, oneWeekAgo)
          )
        )
        .groupBy(workoutSessions.date)
        .orderBy(workoutSessions.date);

      // 요일별로 데이터 정리
      const result = [];

      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);

        const dateStr = date.toISOString().split('T')[0].substring(5); // MM-DD 형식

        const dayData = weeklyData.find((d) => {
          const dataDate = new Date(d.date);
          dataDate.setHours(0, 0, 0, 0);
          return dataDate.toISOString().split('T')[0] === dateStr;
        });

        result.push({
          name: dateStr,
          value: dayData?.totalVolume || 0,
        });
      }

      return NextResponse.json({ data: result }, { status: 200 });
    }

    // 2. 부위별 분포 차트 (파이 차트용)
    if (type === 'part-distribution') {
      const distributionData = await db
        .select({
          mainCategory: exercises.mainCategory,
          totalSets: sql<number>`count(${workoutSets.id})`,
        })
        .from(workoutSessions)
        .innerJoin(workoutSets, eq(workoutSets.sessionId, workoutSessions.id))
        .innerJoin(exercises, eq(exercises.excerciseId, workoutSets.exerciseId))
        .where(and(eq(workoutSessions.userId, userId), gte(workoutSessions.date, oneWeekAgo)))
        .groupBy(exercises.mainCategory);

      // 전체 세트 수 계산
      const totalSets = distributionData.reduce((sum, item) => sum + item.totalSets, 0);

      // 퍼센트 계산
      const result = distributionData.map((item) => ({
        label: item.mainCategory,
        value: totalSets > 0 ? Math.round((item.totalSets / totalSets) * 1000) / 10 : 0,
        count: item.totalSets,
      }));

      // 퍼센트 높은 순으로 정렬
      result.sort((a, b) => b.value - a.value);

      return NextResponse.json({ data: result }, { status: 200 });
    }

    return NextResponse.json({ error: '유효하지 않은 type입니다.' }, { status: 400 });
  } catch (error) {
    console.error('차트 데이터 조회 에러:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
