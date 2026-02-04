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

// 한국 시간(KST, UTC+9) 기준 날짜 생성
function getKSTDate(date: Date = new Date()): Date {
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  return new Date(utc + 9 * 60 * 60 * 1000);
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

    // KST 기준 오늘 포함 7일: 6일 전 00:00:00 ~ 오늘 23:59:59
    const kstToday = getKSTDate();
    const sevenDaysAgoKST = new Date(kstToday);
    sevenDaysAgoKST.setDate(sevenDaysAgoKST.getDate() - 6);
    sevenDaysAgoKST.setHours(0, 0, 0, 0);
    // DB 비교를 위해 UTC로 변환
    const sevenDaysAgo = new Date(sevenDaysAgoKST.getTime() - 9 * 60 * 60 * 1000);

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
            gte(workoutSessions.date, sevenDaysAgo)
          )
        )
        .groupBy(workoutSessions.date)
        .orderBy(workoutSessions.date);

      // 요일별로 데이터 정리 (KST 기준)
      const result = [];

      for (let i = 6; i >= 0; i--) {
        // KST 기준 날짜 계산
        const targetKST = new Date(kstToday);
        targetKST.setDate(targetKST.getDate() - i);
        targetKST.setHours(0, 0, 0, 0);

        const dateStr = `${String(targetKST.getMonth() + 1).padStart(2, '0')}-${String(targetKST.getDate()).padStart(2, '0')}`;

        const dayData = weeklyData.find((d) => {
          // DB에서 가져온 UTC 시간을 KST로 변환해서 비교
          const dataDateKST = getKSTDate(new Date(d.date));
          const dataDateStr = `${String(dataDateKST.getMonth() + 1).padStart(2, '0')}-${String(dataDateKST.getDate()).padStart(2, '0')}`;
          return dataDateStr === dateStr;
        });

        result.push({
          name: dateStr,
          value: dayData?.totalVolume || 0,
        });
      }

      return NextResponse.json({ data: result }, { status: 200 });
    }

    // 2. 부위별 분포 차트 (파이 차트용) - 운동 시간 기준, mainCategory만
    if (type === 'part-distribution') {
      // 7일간 세션별 duration과 mainCategory별 세트 수 조회
      const sessionData = await db
        .select({
          sessionId: workoutSessions.id,
          sessionDuration: workoutSessions.duration,
          mainCategory: exercises.mainCategory,
          setCount: sql<number>`count(${workoutSets.id})`,
        })
        .from(workoutSessions)
        .innerJoin(workoutSets, eq(workoutSets.sessionId, workoutSessions.id))
        .innerJoin(exercises, eq(exercises.excerciseId, workoutSets.exerciseId))
        .where(and(eq(workoutSessions.userId, userId), gte(workoutSessions.date, sevenDaysAgo)))
        .groupBy(workoutSessions.id, workoutSessions.duration, exercises.mainCategory);

      // 세션별 총 세트 수 계산
      const sessionTotalSets: Record<string, number> = {};
      for (const row of sessionData) {
        sessionTotalSets[row.sessionId] = (sessionTotalSets[row.sessionId] || 0) + row.setCount;
      }

      // 부위별(mainCategory) 시간 배분
      const categoryDuration: Record<string, number> = {};

      for (const row of sessionData) {
        const totalSetsInSession = sessionTotalSets[row.sessionId];
        // 세션 duration을 세트 비율로 배분
        const allocatedDuration = (row.setCount / totalSetsInSession) * row.sessionDuration;

        categoryDuration[row.mainCategory] =
          (categoryDuration[row.mainCategory] || 0) + allocatedDuration;
      }

      // 전체 운동 시간 계산
      const totalDuration = Object.values(categoryDuration).reduce((sum, d) => sum + d, 0);

      // 백분율 계산 및 결과 생성
      const result = Object.entries(categoryDuration).map(([label, duration]) => ({
        label,
        value: totalDuration > 0 ? Math.round((duration / totalDuration) * 1000) / 10 : 0,
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
