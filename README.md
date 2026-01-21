# Repit - 운동 트래커

당신의 운동을 기록하고 성장을 추적하세요.

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: SQLite (libsql) / Turso
- **ORM**: Drizzle ORM

## 시작하기

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 환경 변수 설정

`.env.example` 파일을 참고하여 `.env.local` 파일을 생성하세요:

```bash
cp .env.example .env.local
```

### 3. 데이터베이스 설정

```bash
# 스키마를 데이터베이스에 푸시
pnpm db:push

# 또는 마이그레이션 생성 후 적용
pnpm db:generate
pnpm db:migrate
```

### 4. 개발 서버 실행

```bash
pnpm dev
```

[http://localhost:3000](http://localhost:3000)에서 앱을 확인하세요.

## 스크립트

| 명령어 | 설명 |
|--------|------|
| `pnpm dev` | 개발 서버 실행 |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm start` | 프로덕션 서버 실행 |
| `pnpm lint` | ESLint 실행 |
| `pnpm db:generate` | Drizzle 마이그레이션 생성 |
| `pnpm db:migrate` | 마이그레이션 적용 |
| `pnpm db:push` | 스키마를 DB에 직접 푸시 |
| `pnpm db:studio` | Drizzle Studio 실행 |

## 프로젝트 구조

```
src/
├── app/                  # Next.js App Router
│   ├── globals.css       # 전역 스타일
│   ├── layout.tsx        # 루트 레이아웃
│   └── page.tsx          # 홈페이지
└── db/                   # 데이터베이스 관련
    ├── index.ts          # Drizzle 클라이언트
    └── schema.ts         # 데이터베이스 스키마
```

## 데이터베이스 스키마

- **users**: 사용자 정보
- **exercises**: 운동 종류 (벤치프레스, 스쿼트 등)
- **workout_sessions**: 운동 세션 (하루 운동 기록)
- **workout_sets**: 운동 세트 (각 운동의 세트별 기록)

## 라이선스

MIT
