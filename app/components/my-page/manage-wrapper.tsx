import { useEffect, useState } from "react";

import { useModalStore } from "@/app/store/modal-store";

import ContentTitle from "../board/content-title";
import AccountDelete from "../modal/account-delete";
import PasswordChange from "../modal/password-change";
import PasswordSetting from "../modal/password-setting";
import ManageWrapperSkeleton from "./skeleton/manage-wrapper-skeleton";

import { LockKeyhole } from "lucide-react";
import { UserRoundX } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type passwordButtonType = "setting" | "change" | null;

export default function ManageWrapper() {
  const modal = useModalStore((state) => state.openModal);
  const open = useModalStore((state) => state.setIsOpen);
  const [isLoading, setIsLoading] = useState(true);
  const [passwordButton, setPasswordButton] = useState<passwordButtonType>(null);

  useEffect(() => {
    const passwordButtonHandler = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        setPasswordButton(null);
        setIsLoading(false);
        alert("비밀번호 설정에 실패했습니다.");
        return;
      }

      if (user?.user_metadata?.hasPassword === true) {
        setPasswordButton("change");
      } else {
        setPasswordButton("setting");
      }

      setIsLoading(false);
    };

    passwordButtonHandler();
  }, []);

  return (
    <>
      {modal["password-change"] && <PasswordChange />}
      {modal["password-setting"] && <PasswordSetting onSuccess={() => setPasswordButton("change")} />}
      {modal["account-delete"] && <AccountDelete />}
      <div className="w-1/2 p-5 bg-white rounded-xl border border-gray-100 shadow-[4px_4px_12px_rgba(149,157,165,0.1)] max-[1025px]:w-[calc(100%-344px)] max-[769px]:w-full">
        <ContentTitle title="계정관리" />
        {isLoading ? (
          <ManageWrapperSkeleton />
        ) : (
          <div className="flex flex-col gap-y-2">
          {passwordButton === "change" && (
            <button onClick={() => open("password-change")} className="flex items-center justify-between w-full h-9 p-2 border border-gray-100 rounded-sm cursor-pointer transition-colors hover:bg-[#fafafa]">
              <div className="flex items-center gap-x-2">
                <LockKeyhole size={15} /> <span className="text-[14px]">비밀번호 변경</span>
              </div>
              <ChevronRight size={14} />
            </button>
          )}
          {passwordButton === "setting" && (
            <button onClick={() => open("password-setting")} className="flex items-center justify-between w-full h-9 p-2 border border-gray-100 rounded-sm cursor-pointer transition-colors hover:bg-[#fafafa]">
              <div className="flex items-center gap-x-2">
                <LockKeyhole size={15} /> <span className="text-[14px]">비밀번호 설정</span>
              </div>
              <ChevronRight size={14} />
            </button>
          )}
          <button onClick={() => open("account-delete")} className="flex items-center justify-between w-full h-9 p-2 border border-gray-100 rounded-sm cursor-pointer transition-colors hover:bg-[#fafafa]">
            <div className="flex items-center gap-x-2">
              <UserRoundX size={15} /> <span className="text-[14px]">회원탈퇴</span>
            </div>
            <ChevronRight size={14} />
          </button>
          </div>
        )}
      </div>
    </>
  );
}
