import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const response = NextResponse.redirect(new URL("/", requestUrl));

      response.cookies.set("oauth-login-event", "1", {
        path: "/",
        maxAge: 10,
        httpOnly: false,
        sameSite: "lax",
      });

      return response;
    }
  }

  return NextResponse.redirect(new URL("/sign-in?error=oauth", requestUrl));
}
