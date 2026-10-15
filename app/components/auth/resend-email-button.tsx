"use client";

import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

type CooldownMode = string | null;

export default function ResendEmailButton({ resendType }: { resendType: string }) {
  const [resendMessage, setResendMessage] = useState<CooldownMode>(null);
  const [coolDown, setCoolDown] = useState(60);

  useEffect(() => {
    const updateCoolDownHander = () => {
      const until = Number(localStorage.getItem("email-resend-until") ?? 0);
      const coolTime = Math.max(0, Math.ceil((until - Date.now()) / 1000));

      setCoolDown(coolTime);
      setResendMessage(localStorage.getItem("email-resend-mode"));
    };

    updateCoolDownHander();

    const timer = window.setInterval(updateCoolDownHander, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const resendEmailHandler = async () => {
    const email = sessionStorage.getItem("verification-email");
    const until = Number(localStorage.getItem("email-resend-until") ?? 0);
    const coolTime = Math.max(0, Math.ceil((until - Date.now()) / 1000));

    if (!email || coolTime > 0) return;

    if (resendType === "signup") {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      });

      if (error) {
        alert(`이메일 재전송에 실패했습니다. : ${error.code} - ${error.message}`);
        return;
      }
    }

    if (resendType === "recovery") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/recovery`,
      });

      if (error) {
        alert(`이메일 재전송에 실패했습니다. : ${error.code} - ${error.message}`);
        return;
      }
    }

    const nextCooldown = Date.now() + 60 * 1000;
    localStorage.setItem("email-resend-until", String(nextCooldown));
    localStorage.setItem("email-resend-mode", "resend");

    setCoolDown(60);
    setResendMessage(localStorage.getItem("email-resend-mode"));
  };

  return (
    <div>
      {coolDown > 0 && resendMessage === "waiting" && <p className="mt-1 text-center text-sm text-slate-400 font-semibold">{coolDown}초 후에 재전송 가능</p>}

      {coolDown > 0 && resendMessage === "resend" && (
        <>
          <p className="text-center text-sm text-slate-600 font-semibold">인증 메일을 다시 전송했습니다.</p>
          <p className="mt-1 text-center text-sm text-slate-400 font-semibold">{coolDown}초 후 다시 시도</p>
        </>
      )}

      {coolDown === 0 && (
        <button onClick={resendEmailHandler} className="block mx-auto font-semibold text-primary text-center text-[13px] font-medium hover:text-[#4471e2] transition-colors cursor-pointer">
          인증메일 재전송
        </button>
      )}
    </div>
  );
}
