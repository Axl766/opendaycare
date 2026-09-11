"use client";

import { useState } from "react";
import type { NavItemId } from "@/data/feed";
import { SidebarContent } from "./Sidebar";

export function MobileTopBar({ activeNavId }: { activeNavId: NavItemId }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header className="md:hidden sticky top-0 z-30 flex items-center gap-[11px] px-[16px] h-[64px] bg-[#FFFDF9] border-b border-[#ECE0D0]">
        <div className="w-[38px] h-[38px] rounded-[12px] bg-[linear-gradient(155deg,#F8C3A8,#F2937A)] flex items-center justify-center shrink-0">
          <svg
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </svg>
        </div>
        <div>
          <div className="font-display font-semibold text-[17px] text-[#3F362E] leading-none">
            OpenDayCare
          </div>
          <div className="text-[11.5px] text-[#A89A8B] mt-[2px]">Sala Soles</div>
        </div>
        <span className="flex-1" />
        <button
          type="button"
          aria-label="Abrir menú"
          onClick={() => setDrawerOpen(true)}
          className="shrink-0 w-[32px] h-[32px] rounded-[10px] bg-[#F6ECDF] text-[#94887B] flex items-center justify-center"
        >
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
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <button
            type="button"
            aria-label="Cerrar menú"
            className="absolute inset-0 w-full h-full bg-[rgba(63,54,46,.4)]"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-[248px] bg-[#FFFDF9] border-r border-[#ECE0D0] flex flex-col px-[16px] py-[24px]">
            <SidebarContent activeNavId={activeNavId} />
          </aside>
        </div>
      )}
    </>
  );
}
