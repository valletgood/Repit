import type { NextConfig } from 'next';
import withPWAInit from 'next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // ✅ 추가: Turbopack 사용 의도 명시 (빈 설정으로도 OK)
  turbopack: {},
};

export default withPWA(nextConfig);
