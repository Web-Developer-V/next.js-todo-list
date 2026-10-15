"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

import SignSection from "../../../components/sign/sign-section";
import SignForm from "../../../components/sign/sign-form";
import SignInput from "../../../components/sign/sign-input";
import SignFormButton from "../../../components/sign/sign-form-button";
// import SignAuth from "../../../components/sign/sign-auth";
// import SignAuthButton from "../../../components/sign/sign-auth-button";
import SignTitle from "../../../components/sign/sign-title";

import { Field, FieldContent } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import Terms from "../../../components/modal/terms";
import Privacy from "../../../components/modal/privacy";
import { useModalStore } from "@/app/store/modal-store";
import { isValidPassword } from "@/lib/password-validation";
import { isValidEmail } from "@/lib/email-pattern";

import { motion } from "motion/react";
import { LoaderCircle } from "lucide-react";

const privacyButtonCss = "relative inline-block cursor-pointer text-(--primary) font-medium hover:text-[#4471e2] transition-colors before:absolute before:w-full before:h-[1px] before:left-0 before:top-full before:bg-(--primary)";

const AnimatedCheck = motion(LoaderCircle);

export default function SignUpPage() {
  const openModal = useModalStore((state) => state.openModal);
  const setIsClose = useModalStore((state) => state.setIsOpen);
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [alreadyEmail, setAlreadyEmail] = useState(false);
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    passwordValidate: "",
  });
  const [validate, setValidate] = useState({
    name: false,
    email: false,
    password: false,
    passwordValidate: false,
    terms: false,
  });

  const router = useRouter();

  const signUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const nextValidate = {
      name: values.name.trim() == "",
      email: !isValidEmail(values.email.trim()),
      password: !isValidPassword(values.password),
      passwordValidate: values.password !== values.passwordValidate,
      terms: !termsAccepted,
    };

    setValidate(nextValidate);

    if (Object.values(nextValidate).some(Boolean)) {
      return;
    }

    setIsLoading(true);

    sessionStorage.setItem("verification-email", email);
    document.cookie = `verification-email=${encodeURIComponent(email)}; path=/; Max-Age=600; SameSite=Lax`;

    const {
      data: { user },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          hasPassword: true,
        },
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    });

    if (error) {
      setIsLoading(false);
      alert(`회원가입에 실패했습니다. : ${error}`);
      return;
    }

    if (user?.identities?.length === 0) {
      setIsLoading(false);
      setAlreadyEmail(true);
      return;
    }

    setAlreadyEmail(false);

    localStorage.setItem("email-resend-mode", "waiting");
    localStorage.setItem("email-resend-until", String(Date.now() + 60_000));

    document.cookie = "signup-complete-access=1; path=/sign-up/complete; Max-Age=60; SameSite=Lax";
    router.push("/sign-up/complete");
  };

  const validateHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setValidate((prev) => {
      const next = {
        ...prev,
        [id]: false,
      };

      if (id === "password") {
        next.password = value !== "" && !isValidPassword(value);
        next.passwordValidate = values.passwordValidate !== "" && value !== values.passwordValidate;
      }

      if (id === "passwordValidate") {
        next.passwordValidate = value !== "" && value !== values.password;
      }

      return next;
    });

    setValues((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const checkedHandler = (checked: boolean) => {
    setTermsAccepted(checked);
    setValidate((prev) => ({
      ...prev,
      terms: false,
    }));
  };

  return (
    <>
      {openModal["terms"] && <Terms />}
      {openModal["privacy"] && <Privacy />}
      <SignSection>
        <SignTitle title="회원가입" description="지금 회원가입하고 다양한 서비스를 이용해보세요." />
        <SignForm onSubmit={signUp}>
          <div>
            <SignInput id="name" name="name" type="text" placeholder="이름을 입력하세요." onChange={validateHandler} />
            {validate.name ? <p className="mt-1.5 text-[12px] text-red-400">이름을 필수로 입력해주세요.</p> : null}
          </div>
          <div>
            <SignInput id="email" name="email" type="text" placeholder="이메일을 입력하세요." onChange={validateHandler} />
            {validate.email ? <p className="mt-1.5 text-[12px] text-red-400">올바른 이메일 주소를 입력해주세요.</p> : null}
            {alreadyEmail ? <p className="mt-1.5 text-[12px] text-red-400">이미 등록된 이메일입니다.</p> : null}
          </div>
          <div>
            <SignInput id="password" name="password" type="password" placeholder="비밀번호를 입력하세요." onChange={validateHandler} />
            {validate.password ? <p className="mt-1.5 text-[12px] text-red-400">올바른 비밀번호를 입력해주세요.</p> : null}
            <p className="mt-1.5 text-[12px] text-slate-600">특수문자, 소문자, 대문자, 숫자 포함 8자리 이상 입력해야 합니다.</p>
          </div>
          <div>
            <SignInput id="passwordValidate" name="passwordValidate" type="password" placeholder="비밀번호를 한번 더 입력하세요." onChange={validateHandler} />
            {validate.passwordValidate ? <p className="mt-1.5 text-[12px] text-red-400">비밀번호가 일치하지 않습니다.</p> : null}
          </div>
          <div>
            <Field orientation="horizontal">
              <Checkbox id="terms" name="terms" checked={termsAccepted} onCheckedChange={checkedHandler} />
              <FieldContent className="block text-sm text-slate-600">
                <button type="button" className={privacyButtonCss} onClick={() => setIsClose("terms")}>
                  이용약관
                </button>{" "}
                및{" "}
                <button type="button" className={privacyButtonCss} onClick={() => setIsClose("privacy")}>
                  개인정보처리방침
                </button>
                에 동의합니다.
              </FieldContent>
            </Field>
            {validate.terms ? <p className="mt-2 text-[12px] text-red-400">약관 및 개인정보처리방침에 동의해주세요.</p> : null}
          </div>
          {isLoading ? (
                    <SignFormButton disabled>
                      <div className="flex items-center justify-center h-10">
                        <AnimatedCheck size={24} className="animate-spin text-gray-300" />
                      </div>
                    </SignFormButton>
                  ) : (
                    <SignFormButton>회원가입</SignFormButton>
                  )}
        </SignForm>
        <p className="mt-4 text-sm text-slate-400 text-center">
          이미 계정이 있으신가요?
          <Link href="/sign-in" className="ml-1 text-primary font-medium hover:text-[#4471e2] transition-colors">
            로그인
          </Link>
        </p>
        <p className="mt-1 text-center text-sm text-slate-400">
          <Link href="/" className="ml-1 text-primary font-medium hover:text-[#4471e2] transition-colors">
            홈
          </Link>
          으로 돌아가기
        </p>
      </SignSection>
    </>
  );
}
