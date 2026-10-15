"use client";

import Link from "next/link";

import SignSection from "../../../components/sign/sign-section";
import SignTitle from "../../../components/sign/sign-title";

export default function SignUpCompletePage() {
  return (
    <SignSection>
      <SignTitle
        title="비밀번호 변경 완료"
        description={
          <>
            비밀번호 변경이 완료되었습니다.
            <br />
            로그인 후에 서비스를 이용해보세요.
          </>
        }
      />
      <Link
        href="/sign-in"
        replace
        prefetch={false}
        onClick={() => {
          document.cookie = "skip-sign-in-notice=1; path=/; Max-Age=10; SameSite=Lax";
        }}
        className="flex items-center justify-center w-full h-[40px] mt-3 bg-(--primary) rounded-md text-white cursor-pointer transition-colors hover:bg-[#4573e9]"
      >
        로그인
      </Link>
      <p className="relative w-full py-3 text-center before:absolute before:left-0 before:top-[50%] before:w-full before:h-[1px] before:bg-slate-200 before:translate-y-[-50%] before:z-0">
        <span className="relative z-1 bg-white px-2 text-sm text-slate-400">또는</span>
      </p>
      <p className="text-sm text-slate-400 text-center">
        <Link href="/" replace className="ml-1 text-(--primary) font-medium hover:text-[#4471e2] transition-colors">
          홈
        </Link>
        으로 돌아가기
      </p>
    </SignSection>
  );
}
