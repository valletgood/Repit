import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* 배경 효과 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

      {/* 네비게이션 */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 lg:px-12">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-xl font-bold text-background">R</span>
          </div>
          <span className="text-xl font-bold tracking-tight">Repit</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            로그인
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 text-sm font-medium bg-primary text-background rounded-lg hover:bg-primary-dark transition-colors"
          >
            시작하기
          </Link>
        </div>
      </nav>

      {/* 히어로 섹션 */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-20 pb-32 lg:pt-32">
        <div className="animate-fade-in text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border mb-8">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm text-muted-foreground">
              운동 기록을 시작하세요
            </span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Rep
            </span>
            을 세고,{" "}
            <span className="bg-gradient-to-r from-secondary via-accent to-primary bg-clip-text text-transparent">
              성장
            </span>
            을 확인하세요
          </h1>

          <p className="text-lg lg:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Repit과 함께 매일의 운동을 기록하고, 진행 상황을 시각화하며,
            목표를 달성해 나가세요.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-8 py-4 text-lg font-semibold bg-gradient-to-r from-primary to-primary-dark text-background rounded-xl hover:opacity-90 transition-opacity animate-pulse-glow"
            >
              무료로 시작하기
            </Link>
            <Link
              href="/demo"
              className="w-full sm:w-auto px-8 py-4 text-lg font-semibold bg-card border border-border text-foreground rounded-xl hover:bg-muted transition-colors"
            >
              데모 보기
            </Link>
          </div>
        </div>

        {/* 기능 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-5xl mx-auto w-full">
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
      <footer className="relative z-10 border-t border-border py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 Repit. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              개인정보처리방침
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
      className="animate-slide-up p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-colors group"
      style={{ animationDelay: delay }}
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}
