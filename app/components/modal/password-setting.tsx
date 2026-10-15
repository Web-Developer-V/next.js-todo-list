import { useState } from "react";
import { useModalStore } from "@/app/store/modal-store";
import { Input } from "@/components/ui/input";
import MyPageModal from "./my-page-modal";
import { isValidPassword } from "@/lib/password-validation";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Props {
  onSuccess: () => void;
}

export default function PasswordSetting({ onSuccess }: Props) {
  const close = useModalStore((state) => state.setIsClose);
  const router = useRouter();

  const [values, setValues] = useState({
    newPassword: "",
    newPasswordValidate: "",
  });

  const [validate, setValidate] = useState({
    newPassword: false,
    newPasswordValidate: false,
  });

  const passwordSetting = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newValidate = {
      newPassword: !isValidPassword(values.newPassword) || !values.newPassword.trim(),
      newPasswordValidate: !values.newPassword.trim() || values.newPassword.trim() !== values.newPasswordValidate.trim(),
    };

    setValidate(newValidate);

    if (Object.values(newValidate).some(Boolean)) {
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: values.newPassword,
      data: {
        hasPassword: true,
      },
    });

    if (error) {
      setValidate((prev) => ({
        ...prev,
        newPassword: true,
      }));
      return;
    }

    localStorage.setItem("login-event", JSON.stringify({ type: "SIGNED_OUT", timestamp: Date.now() }));

    onSuccess();
    close();
    await supabase.auth.signOut();
    router.replace("/");
  };

  const validateHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setValidate((prev) => {
      const next = {
        ...prev,
        [id]: false,
      };

      if (id === "newPassword") {
        next.newPassword = value !== "" && !isValidPassword(value);
      }

      if (id === "newPasswordValidate") {
        next.newPasswordValidate = value !== "" && value !== values.newPassword;
      }

      return next;
    });

    setValues((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <MyPageModal>
      <form onSubmit={passwordSetting}>
        <div className="mb-3">
          <p className="mb-1 text-[13px] font-semibold">새 비밀번호</p>
          <Input
            id="newPassword"
            type="password"
            placeholder="새 비밀번호를 입력해주세요."
            className="w-full h-8.75 bg-background border border-gray-200 rounded-[10px] font-medium text-[12px] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-200 placeholder:text-[12px]"
            onChange={validateHandler}
          />
          {validate.newPassword && <p className="mt-1.5 text-[12px] text-red-400">올바른 비밀번호를 입력하세요.</p>}
          <p className="mt-1 text-[12px] text-slate-400">특수문자, 소문자, 대문자, 숫자 포함 8자리 이상 입력해야 합니다.</p>
        </div>
        <div className="mb-3">
          <p className="mb-1 text-[13px] font-semibold">비밀번호 확인</p>
          <Input
            id="newPasswordValidate"
            type="password"
            placeholder="비밀번호를 다시 입력해주세요."
            className="w-full h-8.75 bg-background border border-gray-200 rounded-[10px] font-medium text-[12px] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-200 placeholder:text-[12px]"
            onChange={validateHandler}
          />
          {validate.newPasswordValidate && <p className="mt-1.5 text-[12px] text-red-400">비밀번호가 일치하지 않습니다.</p>}
        </div>
        <div className="flex justify-end gap-x-2.5">
          <button className="w-full max-w-18 h-8.75 bg-red-500 text-white rounded-[10px] cursor-pointer transition-colors text-[14px] hover:bg-red-600 disabled:bg-gray-200 disabled:cursor-auto">설정</button>
          <button onClick={close} type="button" className="w-full max-w-18 h-8.75 bg-white border border-gray-200 rounded-[10px] cursor-pointer transition-colors text-[14px] hover:bg-[#f4f4f4]">
            취소
          </button>
        </div>
      </form>
    </MyPageModal>
  );
}
