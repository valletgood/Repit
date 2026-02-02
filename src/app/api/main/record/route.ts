import { db } from '@/db';
import { workoutSessions, workoutSets, exercises } from '@/db/schema';
import { NextRequest, NextResponse } from 'next/server';
import { and, eq, between, inArray, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const date = searchParams.get('date'); // YYYY-MM-DD 형식
    const month = searchParams.get('month'); // YYYY-MM 형식

    if (!userId) {
      return NextResponse.json({ error: '사용자 정보가 필요합니다.' }, { status: 400 });
    }

    // 특정 날짜의 운동 기록 조회
    if (date) {
      const targetDate = new Date(date);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const sessions = await db
        .select()
        .from(workoutSessions)
        .where(
          and(
            eq(workoutSessions.userId, userId),
            between(workoutSessions.date, targetDate, nextDate)
          )
        );

      if (sessions.length === 0) {
        return NextResponse.json({ sessions: [], sets: [] }, { status: 200 });
      }

      // 세션별 세트 정보 조회
      const sessionIds = sessions.map((s) => s.id);
      const sets = await db
        .select({
          id: workoutSets.id,
          sessionId: workoutSets.sessionId,
          exerciseId: workoutSets.exerciseId,
          setNumber: workoutSets.setNumber,
          weight: workoutSets.weight,
          reps: workoutSets.reps,
          duration: workoutSets.duration,
          distance: workoutSets.distance,
          exerciseName: exercises.name,
          mainCategory: exercises.mainCategory,
          equipment: exercises.equipment,
        })
        .from(workoutSets)
        .innerJoin(exercises, eq(workoutSets.exerciseId, exercises.excerciseId))
        .where(inArray(workoutSets.sessionId, sessionIds))
        .orderBy(asc(workoutSets.setNumber));

      return NextResponse.json({ sessions, sets }, { status: 200 });
    }

    // 특정 월의 운동 횟수 조회
    if (month) {
      const [year, mon] = month.split('-').map(Number);
      const startDate = new Date(year, mon - 1, 1);
      const endDate = new Date(year, mon, 0, 23, 59, 59);

      const sessions = await db
        .select({
          id: workoutSessions.id,
          date: workoutSessions.date,
        })
        .from(workoutSessions)
        .where(
          and(
            eq(workoutSessions.userId, userId),
            between(workoutSessions.date, startDate, endDate)
          )
        );

      // 운동한 날짜 목록
      const workoutDates = [...new Set(sessions.map((s) => s.date.toISOString().split('T')[0]))];
      const workoutCount = workoutDates.length;

      return NextResponse.json({ workoutCount, workoutDates }, { status: 200 });
    }

    return NextResponse.json({ error: 'date 또는 month 파라미터가 필요합니다.' }, { status: 400 });
  } catch (error) {
    console.error('운동 기록 조회 에러:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
