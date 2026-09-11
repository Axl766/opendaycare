"use client";

import { useState } from "react";
import { ChildCard } from "./ChildCard";
import { children } from "@/data/children";

export function ChildrenBrowser() {
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();
  const filteredChildren = normalizedQuery
    ? children.filter((child) =>
        child.name.toLowerCase().includes(normalizedQuery),
      )
    : children;

  return (
    <>
      <div className="flex items-center gap-[11px] bg-[#FFFDF9] border border-[#ECE0D0] rounded-[14px] px-[16px] py-[12px] mb-[22px]">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#B0A290"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar niño…"
          className="flex-1 border-none bg-transparent text-[15px] text-[#3F362E] placeholder:text-[#B6A99B] focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-[12px] mb-[14px]">
        <span className="text-[12.5px] font-extrabold tracking-[.8px] text-[#3F362E]">
          SALA SOLES
        </span>
        <span className="text-[13px] text-[#A89A8B]">
          {children.length} niños
        </span>
        <span className="flex-1 h-px bg-[#E7DAC8]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
        {filteredChildren.map((child) => (
          <ChildCard key={child.id} child={child} />
        ))}
      </div>
    </>
  );
}
