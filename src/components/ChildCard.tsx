import Link from "next/link";
import type { Child } from "@/lib/children";
import {
  calcAgeYears,
  childAvatarStyle,
  getChildInitial,
  unlinkedPill,
  allergyPillStyle,
  allergyLabelByValue,
  type AllergyTag,
} from "@/data/children";

function parentsSummary(parentCount: number): string {
  if (parentCount === 0) return "sin padres vinculados";
  if (parentCount === 1) return "1 padre vinculado";
  return `${parentCount} padres vinculados`;
}

export function ChildCard({
  child,
}: {
  child: Child & { parentCount: number };
}) {
  const age = calcAgeYears(child.birthDate);
  const avatar = childAvatarStyle(child.fullName);
  const firstAllergy = child.allergyTags[0];

  return (
    <Link
      href={`/kids/${child.id}`}
      className="flex items-center gap-[14px] min-w-0 bg-[#FFFDF9] border border-[#ECE0D0] rounded-[18px] p-[16px] shadow-[0_4px_14px_-12px_rgba(120,90,60,.5)] hover:border-[#F2A78E] hover:-translate-y-[2px] transition"
    >
      <div
        className="w-[48px] h-[48px] rounded-full font-display font-semibold text-[19px] flex items-center justify-center shrink-0"
        style={{ backgroundColor: avatar.bg, color: avatar.color }}
      >
        {getChildInitial(child.fullName)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-display font-semibold text-[16px] text-[#3F362E]">
          {child.fullName}
        </div>
        <div className="text-[13px] text-[#A89A8B]">
          {age} años · {child.roomName} · {parentsSummary(child.parentCount)}
        </div>
      </div>
      {firstAllergy ? (
        <span
          className="shrink-0 text-[11px] font-extrabold px-[9px] py-[5px] rounded-full"
          style={{
            backgroundColor: allergyPillStyle.bg,
            color: allergyPillStyle.color,
          }}
        >
          {allergyLabelByValue[firstAllergy as AllergyTag] ?? firstAllergy}
        </span>
      ) : child.parentCount === 0 ? (
        <span
          className="shrink-0 text-[11px] font-extrabold px-[9px] py-[5px] rounded-full"
          style={{ backgroundColor: unlinkedPill.bg, color: unlinkedPill.color }}
        >
          {unlinkedPill.label}
        </span>
      ) : (
        <svg
          className="shrink-0"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#CBB89F"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      )}
    </Link>
  );
}
