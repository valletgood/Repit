import { cookies } from 'next/headers';
import { db } from '@/db';
import { refreshTokens, users } from '@/db/schema';
import { eq, and, gt } from 'drizzle-orm';
import { randomUUID } from 'crypto';

const ACCESS_TOKEN_COOKIE = 'access_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';
const ACCESS_TOKEN_EXPIRY = 15 * 60 * 1000; // 15분
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7일

export interface TokenPayload {
  userId: string;
  exp: number;
}

// 간단한 토큰 생성 (Base64 인코딩)
function createToken(payload: TokenPayload): string {
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

// 토큰 파싱
function parseToken(token: string): TokenPayload | null {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    return JSON.parse(decoded) as TokenPayload;
  } catch {
    return null;
  }
}

// Access Token 생성
export function generateAccessToken(userId: string): string {
  const payload: TokenPayload = {
    userId,
    exp: Date.now() + ACCESS_TOKEN_EXPIRY,
  };
  return createToken(payload);
}

// Refresh Token 생성 및 DB 저장
export async function generateRefreshToken(userId: string): Promise<string> {
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY);

  await db.insert(refreshTokens).values({
    userId,
    token,
    expiresAt,
  });

  return token;
}

// 쿠키에 토큰 설정
export async function setAuthCookies(userId: string): Promise<void> {
  const accessToken = generateAccessToken(userId);
  const refreshToken = await generateRefreshToken(userId);

  const cookieStore = await cookies();

  cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: ACCESS_TOKEN_EXPIRY / 1000,
    path: '/',
  });

  cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: REFRESH_TOKEN_EXPIRY / 1000,
    path: '/',
  });
}

// 쿠키에서 토큰 삭제
export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
}

// Access Token 검증
export async function verifyAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) return null;

  const payload = parseToken(accessToken);
  if (!payload) return null;

  if (payload.exp < Date.now()) {
    // Access Token 만료 - Refresh Token으로 갱신 시도
    return await refreshAccessToken();
  }

  return payload.userId;
}

// Refresh Token으로 Access Token 갱신
async function refreshAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!refreshToken) return null;

  // DB에서 유효한 refresh token 확인
  const [tokenRecord] = await db
    .select()
    .from(refreshTokens)
    .where(
      and(
        eq(refreshTokens.token, refreshToken),
        gt(refreshTokens.expiresAt, new Date())
      )
    )
    .limit(1);

  if (!tokenRecord) {
    await clearAuthCookies();
    return null;
  }

  // 새 Access Token 발급
  const newAccessToken = generateAccessToken(tokenRecord.userId);

  cookieStore.set(ACCESS_TOKEN_COOKIE, newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: ACCESS_TOKEN_EXPIRY / 1000,
    path: '/',
  });

  return tokenRecord.userId;
}

// 현재 로그인한 사용자 정보 가져오기
export async function getCurrentUser() {
  const userId = await verifyAccessToken();
  if (!userId) return null;

  const [user] = await db
    .select({
      id: users.id,
      userId: users.userId,
      name: users.name,
      gender: users.gender,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return user || null;
}

// 로그아웃 시 refresh token 삭제
export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (refreshToken) {
    await db.delete(refreshTokens).where(eq(refreshTokens.token, refreshToken));
  }

  await clearAuthCookies();
}
