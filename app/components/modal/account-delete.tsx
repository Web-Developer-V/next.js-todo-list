import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

import { useModalStore } from "@/app/store/modal-store";

import { Input } from "@/components/ui/input";
import MyPageModal from "./my-page-modal";
import { useRouter } from "next/navigation";

export default function AccountDelete() {
  const router = useRouter();
  const close = useModalStore((state) => state.setIsClose);
  const [deleteValidate, setDeleteValidate] = useState("");

  const deleteUserHandler = async () => {
    const response = await fetch("/api/account/delete", {
      method: "DELETE",
    });

    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.success) {
      alert(result?.error ?? "회원탈퇴에 실패했습니다.");
      return;
    }

    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(`회원탈퇴에 실패했습니다. : ${error.code} - ${error.message}`);
      return;
    }

    localStorage.setItem("login-event", JSON.stringify({ type: "SIGNED_OUT", timestamp: Date.now() }));

    close();
    await supabase.auth.signOut();
    router.replace("/sign-in");
  };

  const deleteValidateHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setDeleteValidate(e.target.value);
  };

  return (
    <MyPageModal>
      <p className="mb-3 text-[15px] font-semibold">
        정말 탈퇴하실 건가요? 이 작업은 되돌릴 수 없어요! <br />
        <span className="text-[13px] font-normal text-slate-400">
          탈퇴를 원하시면 아래에 <span className="text-red-500 font-bold">회원탈퇴</span>를 입력해주세요.
        </span>
      </p>
      <Input
        id="edit"
        placeholder=""
        className="w-full h-8.75 mb-5 bg-background border border-gray-200 rounded-[10px] font-medium text-[13px] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-200"
        // value={content}
        onChange={deleteValidateHandler}
      />
      <div className="flex justify-end gap-x-2.5">
        <button
          onClick={deleteUserHandler}
          disabled={deleteValidate !== "회원탈퇴"}
          className="w-full max-w-18 h-8.75 bg-red-500 text-white rounded-[10px] cursor-pointer transition-colors text-[14px] hover:bg-red-600 disabled:bg-gray-200 disabled:cursor-auto"
        >
          탈퇴
        </button>
        <button onClick={close} type="button" className="w-full max-w-18 h-8.75 bg-white border border-gray-200 rounded-[10px] cursor-pointer transition-colors text-[14px] hover:bg-[#f4f4f4]">
          취소
        </button>
      </div>
    </MyPageModal>
  );
}
