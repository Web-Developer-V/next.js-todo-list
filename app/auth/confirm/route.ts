import type { EmailOtpType } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  const redirectUrl = request.nextUrl.clone();

  redirectUrl.pathname = "/sign-up/verified";
  redirectUrl.search = "";

  if (!tokenHash || type !== "email") {
    redirectUrl.pathname = "/sign-up/error";

    const response = NextResponse.redirect(redirectUrl);
    response.cookies.set("signup-error", "1", {
      path: redirectUrl.pathname,
      maxAge: 60,
      httpOnly: true,
      sameSite: "lax",
    });

    return response;
  }

  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: "email",
  });

  if (error || !user) {
    redirectUrl.pathname = "/sign-up/error";

    const response = NextResponse.redirect(redirectUrl);
    response.cookies.set("signup-error", "1", {
      path: redirectUrl.pathname,
      maxAge: 60,
      httpOnly: true,
      sameSite: "lax",
    });

    return response;
  }

  await supabase.auth.signOut({
    scope: "local",
  });

  const response = NextResponse.redirect(redirectUrl);
  response.cookies.set("signup-verified", "1", {
    path: "/sign-up/verified",
    maxAge: 60,
    httpOnly: true,
    sameSite: "lax",
  });

  return response;
}
