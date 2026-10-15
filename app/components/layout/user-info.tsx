"use client";

import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function UserInfo() {
  const [userName, setUserName] = useState<string>();

  useEffect(() => {
    const userInfoHandler = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUserName(user?.user_metadata.name);
    };

    userInfoHandler();
  }, []);

  return <p className="text-[13px] text-slate-500">{userName}님 안녕하세요.</p>;
}
