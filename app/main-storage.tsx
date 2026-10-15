"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MainStorage() {
  const router = useRouter();

  useEffect(() => {
    const loginEventHandler = (e: StorageEvent) => {
      if (e.key !== "login-event" || !e.newValue) {
        return;
      }

      const data = JSON.parse(e.newValue);

      if (data.type === "SIGNED_IN") {
        alert("다른 창에서 로그인 되었습니다.");
        router.replace("/");
      }

      if (data.type === "SIGNED_OUT") {
        alert("다른 창에서 로그아웃 되었습니다.");
        router.replace("/");
      }
    };

    const oauthLoginCookie = document.cookie.split("; ").find((cookie) => cookie === "oauth-login-event=1");

    if (oauthLoginCookie) {
      localStorage.setItem("login-event", JSON.stringify({ type: "SIGNED_IN", timestamp: Date.now() }));

      document.cookie = "oauth-login-event=; path=/; Max-Age=0; SameSite=Lax";
    }

    window.addEventListener("storage", loginEventHandler);

    return () => {
      window.removeEventListener("storage", loginEventHandler);
    };
  }, []);

  return null;
}
