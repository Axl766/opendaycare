import Link from "next/link";
import {
  parentRoleLabel,
  parentStatus,
  type LinkedParent,
} from "@/data/children";

export function ParentsCard({ parents }: { parents: LinkedParent[] }) {
  return (
    <div className="bg-[#FFFDF9] border border-[#ECE0D0] rounded-[16px] px-[18px] py-[16px]">
      <div className="text-[12.5px] font-extrabold tracking-[.8px] text-[#8A7C6D] mb-[14px]">
        PADRES VINCULADOS
      </div>
      <div className="flex flex-col gap-[14px]">
        {parents.map((parent) => {
          const status = parentStatus[parent.status];
          return (
            <div key={parent.name} className="flex items-center gap-[12px]">
              <div
                className="w-[40px] h-[40px] rounded-full text-white font-display font-semibold text-[16px] flex items-center justify-center shrink-0"
                style={{ backgroundColor: parent.avatarBg }}
              >
                {parent.initial}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-extrabold text-[14.5px] text-[#3F362E]">
                  {parent.name}
                </div>
                <div className="text-[12.5px] text-[#A89A8B]">
                  {parentRoleLabel[parent.role]} · {status.detail}
                </div>
              </div>
              <span
                className="shrink-0 text-[10.5px] font-extrabold px-[9px] py-[4px] rounded-full"
                style={{ backgroundColor: status.bg, color: status.color }}
              >
                {status.label}
              </span>
            </div>
          );
        })}
        <Link href="#" className="flex items-center gap-[12px] pt-[8px]">
          <span className="w-[40px] h-[40px] rounded-full border-[1.5px] border-dashed border-[#D8CBBA] flex items-center justify-center text-[#B0A290] shrink-0">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </span>
          <span className="font-extrabold text-[14.5px] text-[#C5503A]">
            Vincular otro padre
          </span>
        </Link>
      </div>
    </div>
  );
}
