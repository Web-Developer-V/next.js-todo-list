"use client";

import Link from "next/link";

import SignSection from "../../../../components/sign/sign-section";
import SignTitle from "../../../../components/sign/sign-title";
import { useEffect, useState } from "react";

const emailLinks = [
  {
    link: "https://workspace.google.com/intl/ko/gmail",
    name: "gmail",
  },
  {
    link: "https://www.naver.com",
    name: "naver",
  },
  {
    link: "https://www.nate.com",
    name: "nate",
  },
  {
    link: "https://mail.kakao.com",
    name: "kakao",
  },
  {
    link: "https://www.daum.net",
    name: "hanmail",
  },
  {
    link: "https://www.daum.net",
    name: "daum",
  },
];

export default function SignUpCompletePage() {
  const [email, setEmail] = useState({
    link: "",
    name: "",
  });

  useEffect(() => {
    const verifyLink = async () => {
      const savedEmail = sessionStorage.getItem("verify-email");

      const matchedEmail = savedEmail?.split("@")[1].split(".")[0];
      const matchedName = emailLinks.find((email) => email.name === matchedEmail);

      if (matchedName) {
        setEmail({
          link: matchedName.link,
          name: matchedName.name,
        });
      }
    };

    verifyLink();
  }, []);

  return (
    <SignSection>
      <SignTitle
        title="이메일 인증"
        description={
          <>
            이메일 인증이 완료되지 않았습니다. <br />
            이메일을 확인하여 인증을 완료 후 로그인해주세요.
          </>
        }
      />
      <Link href={email.link} target="_blank" className="flex items-center justify-center w-full h-10 mt-3 bg-primary rounded-md text-white cursor-pointer transition-colors hover:bg-[#4573e9]">
        {email.name}로 이동
      </Link>
      <p className="relative w-full py-3 text-center before:absolute before:left-0 before:top-[50%] before:w-full before:h-px before:bg-slate-200 before:translate-y-[-50%] before:z-0">
        <span className="relative z-1 bg-white px-2 text-sm text-slate-400">또는</span>
      </p>
      <p className="text-center text-sm text-slate-400">
        <Link href="/" replace className="ml-1 text-primary font-medium hover:text-[#4471e2] transition-colors">
          홈
        </Link>
        으로 돌아가기
      </p>
    </SignSection>
  );
}
