import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const adminSupabase = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function DELETE() {
  const supabase = await createServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { error: deleteError } = await adminSupabase.auth.admin.deleteUser(user.id);

  if (deleteError) {
    return NextResponse.json({ error: `회원탈퇴에 실패했습니다. : ${deleteError.message}` }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
