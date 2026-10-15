"use client";

import { useEffect } from "react";

export default function RestoreSignUpEmail() {
  useEffect(() => {
    const email = document.cookie
      .split("; ")
      .find((row) => row.startsWith("verification-email="))
      ?.split("=")[1];

    if (email && !sessionStorage.getItem("verification-email")) {
      sessionStorage.setItem("verification-email", decodeURIComponent(email));
    }
  }, []);

  return null;
}
