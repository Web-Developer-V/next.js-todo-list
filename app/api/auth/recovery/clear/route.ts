import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  response.cookies.set("recovery-mode-server", "", {
    path: "/",
    maxAge: 0,
  });

  response.cookies.set("recovery-mode-ui", "", {
    path: "/",
    maxAge: 0,
  });

  return response;
}
