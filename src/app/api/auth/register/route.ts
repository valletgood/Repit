import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, password, gender } = body;

    // 유효성 검사
    if (!userId || !name || !password || !gender) {
      return NextResponse.json({ error: '모든 필드를 입력해주세요.' }, { status: 400 });
    }

    // 아이디 중복 확인
    const existingUser = await db.select().from(users).where(eq(users.userId, userId)).limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json({ error: '이미 존재하는 아이디입니다.' }, { status: 409 });
    }

    // 사용자 생성 (실제 서비스에서는 비밀번호 해시 처리 필요)
    const newUser = await db
      .insert(users)
      .values({
        userId,
        name,
        password, // TODO: bcrypt 등으로 해시 처리
        gender,
      })
      .returning({
        id: users.id,
        userId: users.userId,
        name: users.name,
        gender: users.gender,
        createdAt: users.createdAt,
      });

    return NextResponse.json(
      { message: '회원가입이 완료되었습니다.', user: newUser[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('회원가입 에러:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
