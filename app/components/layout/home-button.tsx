import Link from "next/link";
import { House } from "lucide-react";

export default function HomeButton() {
  return (
    <Link aria-label="홈" title="홈" href="/" className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-[4px_4px_12px_rgba(149,157,165,0.1)] text-sm text-white cursor-pointer transition-colors hover:bg-[#fafafa]">
      <House color="#000" size={18} />
    </Link>
  );
}
