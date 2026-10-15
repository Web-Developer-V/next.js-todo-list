import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  const pathName = request.nextUrl.pathname;

  if (pathName === "/sign-up/complete") {
    const accessCookie = request.cookies.get("signup-complete-access");

    if (accessCookie?.value !== "1") {
      return NextResponse.redirect(new URL("/?notice=unauthorized", request.url));
    }

    const { response } = await updateSession(request);
    response.cookies.set("signup-complete-access", "", {
      path: "/sign-up/complete",
      maxAge: 0,
    });

    return response;
  }

  if (pathName === "/sign-up/error") {
    const errorCookie = request.cookies.get("signup-error");

    if (errorCookie?.value !== "1") {
      return NextResponse.redirect(new URL("/?notice=authFailed", request.url));
    }

    const { response } = await updateSession(request);
    response.cookies.set("signup-error", "", {
      path: "/sign-up/error",
      maxAge: 0,
    });

    return response;
  }

  if (pathName === "/sign-up/verified") {
    const errorCookie = request.cookies.get("signup-verified");

    if (errorCookie?.value !== "1") {
      return NextResponse.redirect(new URL("/?notice=verificationFailed", request.url));
    }

    const { response } = await updateSession(request);
    response.cookies.set("signup-verified", "", {
      path: "/sign-up/verified",
      maxAge: 0,
    });

    return response;
  }

  if (pathName === "/sign-in") {
    const { response, user } = await updateSession(request);
    const skipNotice = request.cookies.get("skip-sign-in-notice")?.value === "1";
    const isRecoveryMode = request.cookies.get("recovery-mode-server")?.value === "1";

    if (user && !skipNotice && !isRecoveryMode) {
      return NextResponse.redirect(new URL("/?notice=already-logged-in", request.url));
    }

    if (skipNotice) {
      response.cookies.set("skip-sign-in-notice", "", {
        path: "/",
        maxAge: 0,
      });
    }

    return response;
  }

  if (pathName === "/sign-in/verify-email") {
    const accessCookie = request.cookies.get("verify-email-access");

    if (accessCookie?.value !== "1") {
      return NextResponse.redirect(new URL("/?notice=verify-email-unauthorized", request.url));
    }

    const { response } = await updateSession(request);
    response.cookies.set("verify-email-access", "", {
      path: "/sign-in/verify-email",
      maxAge: 0,
    });

    return response;
  }

  if (pathName === "/my-page") {
    const { response, user } = await updateSession(request);

    if (!user) {
      return NextResponse.redirect(new URL("/?notice=my-page-unauthorized", request.url));
    }

    return response;
  }

  if (pathName === "/find-password/email-send-complete") {
    const accessCookie = request.cookies.get("find-pw-access");

    if (accessCookie?.value !== "1") {
      return NextResponse.redirect(new URL("/?notice=find-pw-unauthorized", request.url));
    }

    const { response } = await updateSession(request);
    response.cookies.set("find-pw-access", "", {
      path: "/find-password/email-send-complete",
      maxAge: 0,
    });

    return response;
  }

  if (pathName === "/find-password/error") {
    const accessCookie = request.cookies.get("find-pw-error");

    if (accessCookie?.value !== "1") {
      return NextResponse.redirect(new URL("/?notice=find-pw-authFailed", request.url));
    }

    const { response } = await updateSession(request);
    response.cookies.set("find-pw-error", "", {
      path: "/find-password/error",
      maxAge: 0,
    });

    return response;
  }

  if (pathName === "/find-password/reset") {
    const accessCookie = request.cookies.get("find-pw-reset");

    if (accessCookie?.value !== "1") {
      return NextResponse.redirect(new URL("/?notice=find-pw-reset-unauthorized", request.url));
    }

    const { response } = await updateSession(request);
    response.cookies.set("find-pw-reset", "", {
      path: "/find-password/reset",
      maxAge: 0,
    });

    return response;
  }

  if (pathName === "/find-password/reset-complete") {
    const accessCookie = request.cookies.get("find-pw-reset-complete");

    if (accessCookie?.value !== "1") {
      return NextResponse.redirect(new URL("/?notice=find-pw-reset-complete-unauthorized", request.url));
    }

    const { response } = await updateSession(request);
    response.cookies.set("find-pw-reset-complete", "", {
      path: "/find-password/reset-complete",
      maxAge: 0,
    });

    return response;
  }

  if (pathName === "/find-password/verified") {
    const accessCookie = request.cookies.get("find-pw-verified");

    if (accessCookie?.value !== "1") {
      return NextResponse.redirect(new URL("/?notice=find-pw-verificationFailed", request.url));
    }

    const { response } = await updateSession(request);
    response.cookies.set("find-pw-verified", "", {
      path: "/find-password/verified",
      maxAge: 0,
    });

    return response;
  }

  const { response } = await updateSession(request);

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
