'use client';

import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useRegister } from '@/app/api/auth/register/client/hooks/useRegister';
import { useCheckId } from '@/app/api/auth/check-id/client/hooks/useCheckId';
import { toast } from 'sonner';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [gender, setGender] = useState('');
  const [error, setError] = useState('');
  const [idError, setIdError] = useState('');
  const [isIdAvailable, setIsIdAvailable] = useState<boolean | null>(null);
  const router = useRouter();

  const { mutate: register } = useRegister();
  const { mutate: checkId, isPending: isCheckingId } = useCheckId();

  const handleName = (value: string) => {
    setName(value);
  };

  const handleId = (value: string) => {
    setId(value);
    // 입력 시 이전 검증 결과 초기화
    setIsIdAvailable(null);
    setIdError('');
  };

  const handleIdBlur = () => {
    if (!id.trim()) {
      setIdError('');
      setIsIdAvailable(null);
      return;
    }

    checkId(id, {
      onSuccess: (response) => {
        setIsIdAvailable(response.available);
        if (!response.available) {
          setIdError(response.message);
        } else {
          setIdError('');
        }
      },
      onError: () => {
        setIdError('아이디 확인 중 오류가 발생했습니다.');
        setIsIdAvailable(null);
      },
    });
  };

  const handlePassword = (value: string) => {
    setPassword(value);
  };

  const handlePasswordConfirm = (value: string) => {
    setPasswordConfirm(value);
  };

  const handleGender = (value: string) => {
    setGender(value);
  };

  // 비밀번호 유효성 검사: 8~20글자, 숫자/영어/특수문자 중 2가지 이상 포함
  const validatePassword = (pwd: string): boolean => {
    if (pwd.length < 8 || pwd.length > 20) return false;

    const hasNumber = /[0-9]/.test(pwd);
    const hasLetter = /[a-zA-Z]/.test(pwd);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd);

    const typeCount = [hasNumber, hasLetter, hasSpecial].filter(Boolean).length;
    return typeCount >= 2;
  };

  const isFormValid = () => {
    return (
      name &&
      id &&
      password &&
      passwordConfirm &&
      gender &&
      password === passwordConfirm &&
      isIdAvailable === true
    );
  };

  const handleClickRegister = async () => {
    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!validatePassword(password)) {
      setError(
        '비밀번호는 숫자, 영어, 특수문자 중 두가지를 포함하여 8 ~ 20 글자 이내로 작성해주세요.'
      );
      return;
    }

    setError('');

    try {
      register(
        {
          userId: id,
          name,
          password,
          gender,
        },
        {
          onSuccess: (response) => {
            console.log(response);
            toast.success('회원가입이 완료되었습니다.');
            router.push('/login');
          },
          onError: (error) => {
            console.error(error);
            setError('회원가입에 실패했습니다.');
          },
        }
      );
    } catch (error) {
      console.error(error);
      setError('회원가입에 실패했습니다.');
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-[#2a2a2a] px-8 pt-4">
      {/* 콘텐츠 */}
      <div className="flex w-full flex-col items-center">
        {/* 로고 영역 */}
        <div className="relative aspect-[2/1] w-full max-w-[280px] overflow-hidden">
          <Image src="/images/logo.svg" alt="Repit 로고" fill className="object-contain" priority />
        </div>

        <section className="mt-6 flex w-full max-w-[383px] flex-col gap-6">
          {/* 회원가입 폼 */}
          <div className="flex w-full flex-col gap-4">
            {/* 이름 입력 */}
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-foreground-muted text-sm font-medium">
                이름
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
                  id="name"
                  variant="auth"
                  inputSize="lg"
                  value={name}
                  onChange={(e) => handleName(e.target.value)}
                  placeholder="이름을 입력해 주세요."
                  className="bg-input text-foreground placeholder:text-muted-foreground pl-12"
                />
              </div>
            </div>

            {/* ID 입력 */}
            <div className="flex flex-col gap-2">
              <label htmlFor="id" className="text-foreground-muted text-sm font-medium">
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
                  onBlur={handleIdBlur}
                  placeholder="아이디를 입력해 주세요."
                  className="bg-input text-foreground placeholder:text-muted-foreground pl-12"
                />
              </div>
              {isCheckingId && <p className="text-muted-foreground text-sm">확인 중...</p>}
              {idError && (
                <div className="flex items-center gap-2">
                  <Image src="/images/icon_warning.svg" alt="Error" width={16} height={16} />
                  <p className="text-sm font-medium text-[#CE0000]">{idError}</p>
                </div>
              )}
              {isIdAvailable === true && !idError && (
                <p className="text-sm font-medium text-[#00C853]">사용 가능한 아이디입니다.</p>
              )}
            </div>

            {/* PASSWORD 입력 */}
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-foreground-muted text-sm font-medium">
                비밀번호
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
            </div>

            {/* PASSWORD 확인 입력 */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="passwordConfirm"
                className="text-foreground-muted text-sm font-medium"
              >
                비밀번호 확인
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
                  id="passwordConfirm"
                  type="password"
                  variant="auth"
                  inputSize="lg"
                  value={passwordConfirm}
                  onChange={(e) => handlePasswordConfirm(e.target.value)}
                  placeholder="비밀번호를 다시 입력해 주세요."
                  className="bg-input text-foreground placeholder:text-muted-foreground pl-12"
                />
              </div>
              {passwordConfirm && password !== passwordConfirm && (
                <div className="flex items-center gap-2">
                  <Image src="/images/icon_warning.svg" alt="Error" width={16} height={16} />
                  <p className="text-sm font-medium text-[#CE0000]">
                    비밀번호가 일치하지 않습니다.
                  </p>
                </div>
              )}
            </div>

            {/* 성별 선택 */}
            <div className="flex flex-col gap-2">
              <span className="text-foreground-muted text-sm font-medium">성별</span>
              <RadioGroup value={gender} onValueChange={handleGender} className="flex gap-6">
                <div className="flex items-center gap-2">
                  <RadioGroupItem
                    value="male"
                    id="male"
                    className="border-[#5A5A5A] text-[#00C853] data-[state=checked]:border-[#00C853]"
                  />
                  <Label
                    htmlFor="male"
                    className="text-foreground cursor-pointer text-sm font-medium"
                  >
                    남성
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem
                    value="female"
                    id="female"
                    className="border-[#5A5A5A] text-[#00C853] data-[state=checked]:border-[#00C853]"
                  />
                  <Label
                    htmlFor="female"
                    className="text-foreground cursor-pointer text-sm font-medium"
                  >
                    여성
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="flex items-center gap-2">
                <Image src="/images/icon_warning.svg" alt="Error" width={16} height={16} />
                <p className="text-sm font-medium text-[#CE0000]">{error}</p>
              </div>
            )}

            {/* 버튼 영역 */}
            <div className="mt-10 flex flex-col gap-3">
              {/* 회원가입 버튼 */}
              <Button
                type="button"
                size="auth"
                variant="authPrimary"
                className="w-full"
                disabled={!isFormValid()}
                onClick={handleClickRegister}
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
