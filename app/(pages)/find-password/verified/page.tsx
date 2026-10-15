"use client";

import { useEffect } from "react";

import SignSection from "@/app/components/sign/sign-section";
import SignTitle from "@/app/components/sign/sign-title";

export default function SignUpCompletePage() {
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const preventBack = () => {
      window.history.forward();
    };

    window.addEventListener("popstate", preventBack);

    return () => {
      window.removeEventListener("popstate", preventBack);
    };
  }, []);

  return (
    <SignSection>
      <SignTitle
        title="이메일 인증 완료"
        description={
          <>
            이메일 인증이 완료되었습니다.
            <br />
            새로운 창에서 비밀번호 변경을 완료해주세요.
          </>
        }
      />
    </SignSection>
  );
}
