'use client';

import { Input } from '@/components/ui/input';
import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { LoginRequest } from '@/app/api/auth/login/client/service/service';
import { useLogin } from '@/app/api/auth/login/client/hooks/useLogin';

export default function LoginPage() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const router = useRouter();
  const { mutate: login } = useLogin();
  const handleId = (value: string) => {
    setId(value);
  };

  const handlePassword = (value: string) => {
    setPassword(value);
  };

  const moveToRegister = () => {
    router.push('/register');
  };

  const handleLogin = () => {
    const payload: LoginRequest = {
      userId: id,
      password: password,
    };
    login(payload, {
      onSuccess: () => {
        router.push('/');
      },
      onError: () => {
        setShowError(true);
      },
    });
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-[#2a2a2a] px-8 pt-12">
      {/* 콘텐츠 */}
      <div className="flex w-full flex-col items-center">
        {/* 로고 영역 */}
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image src="/images/logo.svg" alt="Repit 로고" fill className="object-contain" priority />
        </div>

        <section className="mt-6 flex w-full max-w-[383px] flex-col gap-6">
          {/* 로그인 폼 */}
          <div className="flex w-full flex-col gap-4">
            {/* ID 입력 */}
            <div className="flex flex-col gap-2">
              <label htmlFor="id" className="text-foreground-muted font-semi text-sm">
                ID
              </label>
              <div className="relative">
                <Image
                  src="/images/icon_person.svg"
                  alt="User"
                  width={16}
                  height={16}
                  className="text-muted-foreground absolute top-1/2 left-4 -translate-y-1/2"
                />
                <Input
                  id="id"
                  variant="auth"
                  inputSize="lg"
                  value={id}
                  onChange={(e) => handleId(e.target.value)}
                  placeholder="아이디를 입력해 주세요."
                  className="bg-input text-foreground placeholder:text-muted-foreground pl-12"
                />
              </div>
            </div>

            {/* PASSWORD 입력 */}
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-foreground-muted text-sm font-medium">
                PASSWORD
              </label>
              <div className="relative">
                <Image
                  src="/images/icon_key.svg"
                  alt="Key"
                  width={16}
                  height={16}
                  className="text-muted-foreground absolute top-1/2 left-4 -translate-y-1/2"
                />
                <Input
                  id="password"
                  type="password"
                  variant="auth"
                  inputSize="lg"
                  value={password}
                  onChange={(e) => handlePassword(e.target.value)}
                  placeholder="비밀번호를 입력해 주세요."
                  className="bg-input text-foreground placeholder:text-muted-foreground pl-12"
                />
              </div>
              {showError && (
                <div className="flex items-center gap-2">
                  <Image src="/images/icon_warning.svg" alt="Error" width={16} height={16} />
                  <p className="text-sm font-medium text-[#CE0000]">
                    아이디 또는 비밀번호가 일치하지 않습니다.
                  </p>
                </div>
              )}
            </div>

            {/* 버튼 영역 */}
            <div className="mt-10 flex flex-col gap-3">
              {/* 로그인 버튼 */}
              <Button
                type="submit"
                size="auth"
                variant="authPrimary"
                className="w-full"
                disabled={id === '' || password === ''}
                onClick={handleLogin}
              >
                로그인
              </Button>

              {/* 회원가입 버튼 */}
              <Button
                type="button"
                size="auth"
                variant="authSecondary"
                className="w-full"
                onClick={moveToRegister}
              >
                회원가입
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
