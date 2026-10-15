"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

import VerificationEmailStorage from "@/app/components/auth/verification-email-storage";

import SignForm from "@/app/components/sign/sign-form";
import SignFormButton from "@/app/components/sign/sign-form-button";
import SignInput from "@/app/components/sign/sign-input";
import SignSection from "@/app/components/sign/sign-section";
import SignTitle from "@/app/components/sign/sign-title";
import { isValidPassword } from "@/lib/password-validation";

import { motion } from "motion/react";
import { LoaderCircle } from "lucide-react";

const AnimatedCheck = motion(LoaderCircle);

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState({
    password: "",
    passwordValidate: "",
  });
  const [passwordError, setPasswordError] = useState({
    password: false,
    passwordValidate: false,
  });
  const [matchedPasswordError, setMatchedPasswordError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const resetPasswordHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newValidate = {
      password: !isValidPassword(newPassword.password),
      passwordValidate: newPassword.password !== newPassword.passwordValidate,
    };

    setPasswordError(newValidate);

    if (Object.values(newValidate).some(Boolean)) {
      return;
    }

    setIsLoading(true);

    const {
      data: { user },
      error,
    } = await supabase.auth.updateUser({
      password: newPassword.password,
    });

    if (error) {
      setIsLoading(false);
      setMatchedPasswordError(true);
      return;
    }

    if (!user) {
      setIsLoading(false);
      alert("사용자 정보가 없습니다.");
      return;
    }

    const { error: signOutError } = await supabase.auth.signOut({
      scope: "local",
    });

    if (signOutError) {
      setIsLoading(false);
      alert(`로그아웃에 실패했습니다. : ${signOutError.message}`);
      return;
    }

    await fetch("/api/auth/recovery/clear", {
      method: "POST",
    });

    document.cookie = "find-pw-reset-complete=1; path=/find-password/reset-complete; Max-Age=60; SameSite=Lax";
    router.replace("/find-password/reset-complete");
  };

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setNewPassword((prev) => ({
      ...prev,
      [id]: value,
    }));

    setPasswordError((prev) => {
      const next = {
        ...prev,
        [id]: false,
      };

      if (id === "password") {
        next.password = value !== "" && !isValidPassword(value);
      }

      if (id === "passwordValidate") {
        next.passwordValidate = value !== "" && value !== newPassword.password;
      }

      return next;
    });
  };

  return (
    <>
      <VerificationEmailStorage storageKey="reset-password-verification-complete" />
      <SignSection>
        <SignTitle title="비밀번호 변경" />
        <SignForm onSubmit={resetPasswordHandler}>
          <div>
            <SignInput id="password" name="password" type="password" placeholder="새로운 비밀번호를 입력해주세요." onChange={onChangeHandler} value={newPassword.password} />
            {passwordError.password && <p className="mt-1.5 text-[12px] text-red-400">올바른 비밀번호를 입력해주세요.</p>}
            {matchedPasswordError && <p className="mt-1.5 text-[12px] text-red-400">기존 비밀번호와 다른 비밀번호를 입력해주세요.</p>}
            <p className="mt-1.5 text-[12px] text-slate-600">특수문자, 소문자, 대문자, 숫자 포함 8자리 이상 입력해야 합니다.</p>
          </div>
          <div>
            <SignInput id="passwordValidate" name="passwordValidate" type="password" placeholder="비밀번호를 다시 입력해주세요." onChange={onChangeHandler} value={newPassword.passwordValidate} />
            {passwordError.passwordValidate && <p className="mt-1.5 text-[12px] text-red-400">비밀번호가 일치하지 않습니다.</p>}
          </div>
          {isLoading ? (
            <SignFormButton disabled>
              <div className="flex items-center justify-center h-10">
                <AnimatedCheck size={24} className="animate-spin text-gray-300" />
              </div>
            </SignFormButton>
          ) : (
            <SignFormButton>비밀번호 변경</SignFormButton>
          )}
        </SignForm>
      </SignSection>
    </>
  );
}
