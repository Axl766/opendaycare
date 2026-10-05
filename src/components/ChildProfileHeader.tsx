import type { Child } from "@/lib/children";
import {
  calcAgeYears,
  childAvatarStyle,
  getChildInitial,
} from "@/data/children";

export function ChildProfileHeader({ child }: { child: Child }) {
  const ages = calcAgeYears(child.birthDate);
  const avatar = childAvatarStyle(child.fullName);

  return (
    <div className="flex items-center gap-[18px] flex-1 min-w-0">
      <div
        className="w-[84px] h-[84px] rounded-full font-display font-semibold text-[34px] flex items-center justify-center shrink-0"
        style={{ backgroundColor: avatar.bg, color: avatar.color }}
      >
        {getChildInitial(child.fullName)}
      </div>
      <div className="flex-1 min-w-0">
        <h1 className="font-display font-semibold text-2xl text-[#3F362E]">
          {child.fullName}
        </h1>
        <p className="mt-[3px] text-[#94887B] text-[15px]">
          {ages} años · Sala {child.roomName}
        </p>
      </div>
    </div>
  );
}
