import Link from "next/link";
import { LogIn } from "lucide-react";

export default function SignInButton() {
  return (
    <Link
      aria-label="로그인"
      title="로그인"
      href="/sign-in"
      className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-[4px_4px_12px_rgba(149,157,165,0.1)] text-sm text-white cursor-pointer transition-colors hover:bg-[#fafafa]"
    >
      <LogIn color="#000" size={18} />
    </Link>
  );
}
