import Link from "next/link";
import { UserRoundPlus } from "lucide-react";

export default function SignUpButton() {
  return (
    <Link
      aria-label="회원가입"
      title="회원가입"
      href="/sign-up"
      className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-[4px_4px_12px_rgba(149,157,165,0.1)] text-sm text-white cursor-pointer transition-colors hover:bg-[#fafafa]"
    >
      <UserRoundPlus color="#000" size={18} />
    </Link>
  );
}
