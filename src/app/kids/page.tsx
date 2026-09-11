import type { Metadata } from "next";
import Link from "next/link";
import { ChildrenBrowser } from "@/components/ChildrenBrowser";
import { MobileTopBar } from "@/components/MobileTopBar";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Niños · OpenDayCare",
};

export default function Page() {
  return (
    <>
      <MobileTopBar activeNavId="kids" />
      <div className="flex min-h-screen bg-[#F6ECDF]">
        <Sidebar activeNavId="kids" />
        <main className="flex-1 min-w-0 md:h-screen md:overflow-y-auto">
          <div className="max-w-[880px] w-full mx-auto pt-[34px] px-[40px] pb-[80px]">
            <div className="flex items-end justify-between gap-[16px] mb-[22px]">
              <div>
                <div className="text-[12.5px] font-extrabold tracking-[.8px] text-[#D9583C] mb-[4px]">
                  GESTIÓN
                </div>
                <h1 className="font-display font-semibold text-[30px] text-[#3F362E]">
                  Niños
                </h1>
              </div>
              <Link
                href="#"
                className="flex items-center gap-[8px] py-[11px] px-[18px] rounded-[14px] bg-[linear-gradient(180deg,#F4977E,#EE8164)] text-white font-extrabold text-[14.5px] shadow-[0_8px_18px_-8px_rgba(238,129,100,.7)]"
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
                Agregar niño
              </Link>
            </div>

            <ChildrenBrowser />
          </div>
        </main>
      </div>
    </>
  );
}
