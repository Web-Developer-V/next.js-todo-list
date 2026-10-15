import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const redirectUrl = request.nextUrl.clone();

  redirectUrl.pathname = "/find-password/reset";
  redirectUrl.search = "";

  if (!tokenHash || type !== "recovery") {
    return NextResponse.redirect(new URL("/find-password/error", request.url));
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: "recovery",
  });

  if (error) {
    const errorResponse = NextResponse.redirect(new URL("/find-password/error", request.url));

    errorResponse.cookies.set("find-pw-error", "1", {
      path: "/find-password/error",
      maxAge: 60,
      httpOnly: true,
      sameSite: "lax",
    });

    return errorResponse;
  }

  const response = NextResponse.redirect(redirectUrl);

  response.cookies.set("find-pw-reset", "1", {
    path: "/find-password/reset",
    maxAge: 60,
    httpOnly: true,
    sameSite: "lax",
  });

  response.cookies.set("find-pw-verified", "1", {
    path: "/find-password/verified",
    maxAge: 60,
    httpOnly: true,
    sameSite: "lax",
  });

  response.cookies.set("recovery-mode-server", "1", {
    path: "/",
    maxAge: 60,
    httpOnly: true,
    sameSite: "lax",
  });

  response.cookies.set("recovery-mode-ui", "1", {
    path: "/",
    maxAge: 60,
    httpOnly: false,
    sameSite: "lax",
  });

  return response;
}
