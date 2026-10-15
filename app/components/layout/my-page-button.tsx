import Link from "next/link";
import { User } from "lucide-react";

export default function MyPageButton() {
  return (
    <Link
      aria-label="마이페이지"
      title="마이페이지"
      href="/my-page"
      className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-[4px_4px_12px_rgba(149,157,165,0.1)] text-sm text-white cursor-pointer transition-colors hover:bg-[#fafafa]"
    >
      <User color="#000" size={18} />
    </Link>
  );
}
