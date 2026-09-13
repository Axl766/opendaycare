"use client";

import { useState } from "react";

export function ConsentCheckbox({ text }: { text: string }) {
  const [checked, setChecked] = useState(true);

  return (
    <label className="flex items-start gap-[12px] bg-[#FBF1D6] rounded-[14px] px-[16px] py-[14px] mb-[24px] cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => setChecked((prev) => !prev)}
        className="sr-only"
      />
      <span
        className={`flex-none w-[24px] h-[24px] rounded-[8px] mt-[1px] flex items-center justify-center ${
          checked
            ? "bg-[#5FB97E]"
            : "bg-white border-[1.5px] border-[#EADFD0]"
        }`}
      >
        {checked && (
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </span>
      <span className="text-[14px] text-[#8A7234] leading-[1.45]">{text}</span>
    </label>
  );
}
