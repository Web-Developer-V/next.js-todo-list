import { LogOut } from "lucide-react";

export default function SignOutButton({ signOut }: { signOut: () => Promise<void> }) {
  return (
    <button
      aria-label="로그아웃"
      title="로그아웃"
      onClick={signOut}
      className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-[4px_4px_12px_rgba(149,157,165,0.1)] text-sm text-white cursor-pointer transition-colors hover:bg-[#fafafa]"
    >
      <LogOut color="#000" size={18} />
    </button>
  );
}
