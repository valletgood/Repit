import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-background relative min-h-screen overflow-hidden">
      {/* 배경 효과 */}
      <div className="from-primary/10 via-background to-background absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]" />
      <div className="bg-primary/5 absolute top-1/4 left-1/4 h-96 w-96 rounded-full blur-3xl" />
      <div className="bg-secondary/5 absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full blur-3xl" />

      {/* 네비게이션 */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 lg:px-12">
        <div className="flex items-center gap-2">
          <div className="from-primary to-secondary flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br">
            <span className="text-background text-xl font-bold">R</span>
          </div>
          <span className="text-xl font-bold tracking-tight">Repit</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-muted-foreground hover:text-foreground px-4 py-2 text-sm font-medium transition-colors"
          >
            로그인
          </Link>
          <Link
            href="/signup"
            className="bg-primary text-background hover:bg-primary-dark rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            시작하기
          </Link>
        </div>
      </nav>

      {/* 히어로 섹션 */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-20 pb-32 lg:pt-32">
        <div className="animate-fade-in mx-auto max-w-4xl text-center">
          <div className="bg-card border-border mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-2">
            <span className="bg-success h-2 w-2 animate-pulse rounded-full" />
            <span className="text-muted-foreground text-sm">운동 기록을 시작하세요</span>
          </div>

          <h1 className="mb-6 text-5xl font-bold tracking-tight lg:text-7xl">
            <span className="from-primary via-accent to-secondary bg-gradient-to-r bg-clip-text text-transparent">
              Rep
            </span>
            을 세고,{' '}
            <span className="from-secondary via-accent to-primary bg-gradient-to-r bg-clip-text text-transparent">
              성장
            </span>
            을 확인하세요
          </h1>

          <p className="text-muted-foreground mx-auto mb-12 max-w-2xl text-lg lg:text-xl">
            Repit과 함께 매일의 운동을 기록하고, 진행 상황을 시각화하며, 목표를 달성해 나가세요.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="from-primary to-primary-dark text-background animate-pulse-glow w-full rounded-xl bg-gradient-to-r px-8 py-4 text-lg font-semibold transition-opacity hover:opacity-90 sm:w-auto"
            >
              무료로 시작하기
            </Link>
            <Link
              href="/demo"
              className="bg-card border-border text-foreground hover:bg-muted w-full rounded-xl border px-8 py-4 text-lg font-semibold transition-colors sm:w-auto"
            >
              데모 보기
            </Link>
          </div>
        </div>

        {/* 기능 카드 */}
        <div className="mx-auto mt-24 grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          <FeatureCard
            icon="📊"
            title="상세한 통계"
            description="운동 볼륨, 1RM 추정치, 진행률 등 다양한 통계를 확인하세요"
            delay="0.1s"
          />
          <FeatureCard
            icon="🎯"
            title="목표 설정"
            description="개인화된 운동 목표를 설정하고 달성 현황을 추적하세요"
            delay="0.2s"
          />
          <FeatureCard
            icon="📱"
            title="간편한 기록"
            description="직관적인 인터페이스로 운동 중에도 빠르게 기록하세요"
            delay="0.3s"
          />
        </div>
      </main>

      {/* 푸터 */}
      <footer className="border-border relative z-10 border-t px-6 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-muted-foreground text-sm">© 2025 Repit. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              개인정보처리방침
            </Link>
            <Link
              href="/terms"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              이용약관
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: string;
  title: string;
  description: string;
  delay: string;
}) {
  return (
    <div
      className="animate-slide-up bg-card/50 border-border hover:border-primary/50 group rounded-2xl border p-6 backdrop-blur-sm transition-colors"
      style={{ animationDelay: delay }}
    >
      <div className="from-primary/20 to-secondary/20 mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br transition-transform group-hover:scale-110">
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}
