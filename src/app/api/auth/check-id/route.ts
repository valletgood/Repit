import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: '아이디를 입력해주세요.' }, { status: 400 });
    }

    const existingUser = await db.select().from(users).where(eq(users.userId, userId)).limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json({ available: false, message: '이미 사용 중인 아이디입니다.' });
    }

    return NextResponse.json({ available: true, message: '사용 가능한 아이디입니다.' });
  } catch (error) {
    console.error('아이디 중복확인 에러:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
