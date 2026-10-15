"use client";

import Link from "next/link";
import SignForm from "@/app/components/sign/sign-form";
import SignFormButton from "@/app/components/sign/sign-form-button";
import SignInput from "@/app/components/sign/sign-input";
import SignSection from "@/app/components/sign/sign-section";
import SignTitle from "@/app/components/sign/sign-title";
import { useState } from "react";
import { isValidEmail } from "@/lib/email-pattern";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

import { motion } from "motion/react";
import { LoaderCircle } from "lucide-react";

const AnimatedCheck = motion(LoaderCircle);

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const emailSendHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValid = isValidEmail(email);
    setEmailError(!isValid);

    if (!isValid) return;

    setIsLoading(true);

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/recovery`,
    });

    if (!data || error) {
      setIsLoading(false);
      alert(`이메일 발송에 실패했습니다. : ${error}`);
      return;
    }

    sessionStorage.setItem("verification-email", email);
    localStorage.setItem("email-resend-mode", "waiting");
    localStorage.setItem("email-resend-until", String(Date.now() + 60_000));

    document.cookie = "find-pw-access=1; path=/find-password/email-send-complete; Max-Age=60; SameSite=Lax";

    router.replace("/find-password/email-send-complete");
  };

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setEmail(value);
    setEmailError(!isValidEmail(value));
  };

  return (
    <SignSection>
      <SignTitle
        title="비밀번호 찾기"
        description={
          <>
            비밀번호를 잃어버리셨나요? <br />
            가입 시 입력하셨던 이메일을 입력해주세요.
          </>
        }
      />
      <SignForm onSubmit={emailSendHandler}>
        <div>
          <SignInput id="email" name="email" type="text" placeholder="이메일을 입력하세요." onChange={onChangeHandler} />
          {emailError && <p className="mt-1.5 text-[12px] text-red-400">올바른 이메일 형식을 입력해주세요.</p>}
        </div>
        {isLoading ? (
          <SignFormButton disabled>
            <div className="flex items-center justify-center h-10">
              <AnimatedCheck size={24} className="animate-spin text-gray-300" />
            </div>
          </SignFormButton>
        ) : (
          <SignFormButton>인증 메일 전송</SignFormButton>
        )}
      </SignForm>
      <p className="relative w-full py-3 text-center before:absolute before:left-0 before:top-[50%] before:w-full before:h-px before:bg-slate-200 before:translate-y-[-50%] before:z-0">
        <span className="relative z-1 bg-white px-2 text-sm text-slate-400">또는</span>
      </p>
      <p className="mt-1 text-center text-sm text-slate-400">
        <Link href="/" className="ml-1 text-primary font-medium hover:text-[#4471e2] transition-colors">
          홈
        </Link>
        으로 돌아가기
      </p>
    </SignSection>
  );
}
