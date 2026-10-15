"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function RedirectNotice() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handledNoticeRef = useRef<string | null>(null);

  useEffect(() => {
    const notice = searchParams.get("notice");

    if (!notice) {
      handledNoticeRef.current = null;
      return;
    }

    if (handledNoticeRef.current === notice) {
      return;
    }

    const message =
      notice === "already-logged-in"
        ? "이미 로그인이 완료되었습니다."
        : notice === "verify-email-unauthorized"
          ? "이메일 인증 절차를 통해 접근해주세요."
          : notice === "unauthorized"
            ? "접근 권한이 없습니다."
            : notice === "authFailed"
              ? "접근 권한이 없습니다."
              : notice === "verificationFailed"
                ? "접근 권한이 없습니다."
                : notice === "my-page-unauthorized"
                  ? "로그인이 필요합니다."
                  : notice === "find-pw-unauthorized"
                    ? "접근 권한이 없습니다."
                    : notice === "find-pw-authFailed"
                      ? "접근 권한이 없습니다."
                      : notice === "find-pw-reset-unauthorized"
                        ? "접근 권한이 없습니다."
                        : notice === "find-pw-reset-complete-unauthorized"
                          ? "접근 권한이 없습니다."
                          : notice === "find-pw-verificationFailed"
                            ? "접근 권한이 없습니다."
                            : null;

    if (!message) {
      return;
    }

    handledNoticeRef.current = notice;

    setTimeout(() => {
      router.replace("/", { scroll: false });

      setTimeout(() => {
        alert(message);
        handledNoticeRef.current = null;
      }, 100);
    }, 100);
  }, [router, searchParams]);

  return null;
}
