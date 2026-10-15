import { useState } from "react";
import { useModalStore } from "@/app/store/modal-store";
import { Input } from "@/components/ui/input";
import MyPageModal from "./my-page-modal";
import { isValidPassword } from "@/lib/password-validation";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function PasswordChange() {
  const router = useRouter();
  const close = useModalStore((state) => state.setIsClose);

  const [values, setValues] = useState({
    currentPassword: "",
    newPassword: "",
    newPasswordValidate: "",
  });

  const [validate, setValidate] = useState({
    currentPassword: false,
    newPassword: false,
    newPasswordValidate: false,
    differentPassword: false,
  });

  const passwordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newValidate = {
      currentPassword: !values.currentPassword.trim(),
      newPassword: !isValidPassword(values.newPassword) || !values.newPassword.trim(),
      newPasswordValidate: !values.newPassword.trim() || values.newPassword.trim() !== values.newPasswordValidate.trim(),
      differentPassword: values.currentPassword.trim() === values.newPassword.trim(),
    };

    setValidate(newValidate);

    if (Object.values(newValidate).some(Boolean)) {
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: values.newPassword,
      current_password: values.currentPassword,
    });

    if (error) {
      setValidate((prev) => ({
        ...prev,
        currentPassword: true,
        differentPassword: true,
      }));
      return;
    }

    localStorage.setItem("login-event", JSON.stringify({ type: "SIGNED_OUT", timestamp: Date.now() }));

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
      <form onSubmit={passwordChange}>
        <div className="mb-3">
          <p className="mb-1 text-[13px] font-semibold">현재 비밀번호</p>
          <Input
            id="currentPassword"
            type="password"
            placeholder="현재 비밀번호를 입력해주세요."
            className="w-full h-8.75 bg-background border border-gray-200 rounded-[10px] font-medium text-[12px] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-200 placeholder:text-[12px]"
            onChange={validateHandler}
          />
          {validate.currentPassword && <p className="mt-1.5 text-[12px] text-red-400">현재 비밀번호가 일치하지 않습니다.</p>}
        </div>
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
          {validate.differentPassword && <p className="mt-1.5 text-[12px] text-red-400">현재 비밀번호랑 다른 비밀번호를 입력해주세요.</p>}
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
          <button className="w-full max-w-18 h-8.75 bg-red-500 text-white rounded-[10px] cursor-pointer transition-colors text-[14px] hover:bg-red-600 disabled:bg-gray-200 disabled:cursor-auto">변경</button>
          <button onClick={close} type="button" className="w-full max-w-18 h-8.75 bg-white border border-gray-200 rounded-[10px] cursor-pointer transition-colors text-[14px] hover:bg-[#f4f4f4]">
            취소
          </button>
        </div>
      </form>
    </MyPageModal>
  );
}
