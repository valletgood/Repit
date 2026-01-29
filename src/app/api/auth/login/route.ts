import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, password } = body;

    // 유효성 검사
    if (!userId || !password) {
      return NextResponse.json({ error: '아이디와 비밀번호를 입력해주세요.' }, { status: 400 });
    }

    // 사용자 조회
    const user = await db.select().from(users).where(eq(users.userId, userId)).limit(1);

    if (user.length === 0) {
      return NextResponse.json(
        { error: '아이디 또는 비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      );
    }

    // 비밀번호 확인 (TODO: 실제 서비스에서는 bcrypt.compare 등으로 해시 비교)
    if (user[0].password !== password) {
      return NextResponse.json(
        { error: '아이디 또는 비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      );
    }

    // 로그인 성공 - 비밀번호 제외한 사용자 정보 반환
    const { password: _, ...userWithoutPassword } = user[0];

    return NextResponse.json({
      message: '로그인 성공',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('로그인 에러:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
