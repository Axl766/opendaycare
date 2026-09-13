import type { Metadata } from "next";
import { AddChildModal } from "@/components/AddChildModal";
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
              <AddChildModal />
            </div>

            <ChildrenBrowser />
          </div>
        </main>
      </div>
    </>
  );
}
