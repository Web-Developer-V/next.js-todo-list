import { cookies } from "next/headers";
import { createClient } from "./server";

export async function getAppUser() {
  const cookieStore = await cookies();

  const isRecoveryMode = cookieStore.get("recovery-mode-server")?.value === "1";

  if (isRecoveryMode) {
    return null;
  }

  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}
