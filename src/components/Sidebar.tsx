import type { ReactNode } from "react";
import { currentUser, navItems, type NavIcon } from "@/data/feed";

const navIcons: Record<NavIcon, ReactNode> = {
  home: (
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
      <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
    </svg>
  ),
  kids: (
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
      <circle cx="9" cy="7" r="3" />
      <circle cx="17" cy="9" r="2.4" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 20a5 5 0 0 1 5.5-4.9" />
    </svg>
  ),
  bell: (
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
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
  ),
  user: (
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
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
};

export function Sidebar() {
  return (
    <aside className="w-[248px] flex-none bg-[#FFFDF9] border-r border-[#ECE0D0] flex flex-col px-[16px] py-[24px] sticky top-0 h-screen">
      <SidebarContent />
    </aside>
  );
}

export function SidebarContent() {
  return (
    <>
      <a
        href="#"
        className="flex items-center gap-[11px] pt-[4px] px-[8px] pb-[22px]"
      >
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
      </a>

      <a
        href="#"
        className="flex items-center justify-center gap-[8px] w-full p-[12px] rounded-[14px] bg-[linear-gradient(180deg,#F4977E,#EE8164)] text-white font-extrabold text-[14.5px] shadow-[0_8px_18px_-8px_rgba(238,129,100,.75)] mb-[18px]"
      >
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        Nueva publicación
      </a>

      <nav className="flex flex-col gap-[4px] flex-1">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className={`flex items-center gap-[12px] px-[12px] py-[11px] rounded-[12px] text-[14.5px] ${
              item.active
                ? "bg-[#FBE3D8] text-[#D9583C] font-extrabold"
                : "text-[#6E6359] font-semibold"
            }`}
          >
            {navIcons[item.icon]}
            {item.label}
          </a>
        ))}
      </nav>

      <div className="border-t border-[#ECE0D0] pt-[14px] mt-[10px]">
        <div className="flex items-center gap-[11px] px-[8px] py-[6px]">
          <div className="w-[38px] h-[38px] rounded-full bg-[#F2937A] text-white font-display font-semibold text-[16px] flex items-center justify-center shrink-0">
            {currentUser.initial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-extrabold text-[14px] text-[#3F362E]">
              {currentUser.name}
            </div>
            <div className="text-[12px] text-[#A89A8B]">{currentUser.role}</div>
          </div>
          <a
            href="#"
            title="Cerrar sesión"
            className="shrink-0 w-[32px] h-[32px] rounded-[10px] bg-[#F6ECDF] text-[#94887B] flex items-center justify-center"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
          </a>
        </div>
      </div>
    </>
  );
}
