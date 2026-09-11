import Link from "next/link";
import type { Child } from "@/data/children";

export function ChildProfileHeader({ child }: { child: Child }) {
  return (
    <div className="flex items-center gap-[18px]">
      <div
        className="w-[84px] h-[84px] rounded-full font-display font-semibold text-[34px] flex items-center justify-center shrink-0"
        style={{ backgroundColor: child.avatarBg, color: child.avatarColor }}
      >
        {child.initial}
      </div>
      <div className="flex-1 min-w-0">
        <h1 className="font-display font-semibold text-[28px] text-[#3F362E]">
          {child.name}
        </h1>
        <p className="mt-[3px] text-[#94887B] text-[15px]">
          {child.ageYears} años · Sala {child.room}
        </p>
      </div>
      <Link
        href="#"
        className="border-[1.5px] border-[#ECE0D0] bg-[#FFFDF9] text-[#6E6359] font-bold text-[14px] py-[9px] px-[16px] rounded-[12px]"
      >
        Editar
      </Link>
    </div>
  );
}
