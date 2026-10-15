"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
  storageKey: string;
  redirectUrl: string;
}

export default function SignupVerificationComplete({ storageKey, redirectUrl }: Props) {
  const router = useRouter();

  useEffect(() => {
    const verificationCompleteHandler = (e: StorageEvent) => {
      if (e.key !== storageKey) {
        return;
      }

      localStorage.removeItem("email-resend-mode");
      localStorage.removeItem("email-resend-until");
      localStorage.removeItem(storageKey);
      document.cookie = "verification-email=; path=/; Max-Age=0; SameSite=Lax";

      alert("이메일 인증이 완료되었습니다.");
      router.replace(redirectUrl);
    };

    window.addEventListener("storage", verificationCompleteHandler);

    return () => {
      window.removeEventListener("storage", verificationCompleteHandler);
    };
  }, [router, storageKey, redirectUrl]);

  return null;
}
