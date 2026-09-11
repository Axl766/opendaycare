import Link from "next/link";
import { currentUser } from "@/data/feed";

export function CreatePostPrompt() {
  return (
    <Link
      href="#"
      className="flex items-center gap-[14px] bg-[#FFFDF9] border border-[#ECE0D0] rounded-[18px] px-[18px] py-[14px] mb-[24px] shadow-[0_4px_14px_-10px_rgba(120,90,60,.4)]"
    >
      <div className="w-[40px] h-[40px] rounded-full bg-[#F2937A] text-white font-display font-semibold text-[16px] flex items-center justify-center shrink-0">
        {currentUser.initial}
      </div>
      <span className="flex-1 text-[#A89A8B] text-[15px]">
        Compartí un momento…
      </span>
      <span className="w-[38px] h-[38px] rounded-[12px] bg-[#FBE3D8] text-[#E0654A] flex items-center justify-center">
        <svg
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      </span>
    </Link>
  );
}
