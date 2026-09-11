import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AllergyNotice } from "@/components/AllergyNotice";
import { ChildInfoCard } from "@/components/ChildInfoCard";
import { ChildProfileHeader } from "@/components/ChildProfileHeader";
import { MobileTopBar } from "@/components/MobileTopBar";
import { ParentsCard } from "@/components/ParentsCard";
import { Sidebar } from "@/components/Sidebar";
import { children } from "@/data/children";

export function generateStaticParams() {
  return children.map((child) => ({ childId: child.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ childId: string }>;
}): Promise<Metadata> {
  const { childId } = await params;
  const child = children.find((item) => item.id === childId);
  return { title: child ? `${child.name} · OpenDayCare` : "OpenDayCare" };
}

export default async function Page({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;
  const child = children.find((item) => item.id === childId);

  if (!child) {
    notFound();
  }

  return (
    <>
      <MobileTopBar activeNavId="kids" />
      <div className="flex min-h-screen bg-[#F6ECDF]">
        <Sidebar activeNavId="kids" />
        <main className="flex-1 min-w-0 md:h-screen md:overflow-y-auto">
          <div className="max-w-[820px] w-full mx-auto pt-[34px] px-[40px] pb-[80px]">
            <Link
              href="/kids"
              className="flex items-center gap-[7px] text-[#94887B] font-bold text-[14px] mb-[20px]"
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
                <path d="m15 18-6-6 6-6" />
              </svg>
              Volver a Niños
            </Link>

            <div className="flex flex-col md:flex-row md:items-start gap-[26px]">
              <div className="flex-1 min-w-0 md:min-w-[300px] flex flex-col gap-[18px]">
                <ChildProfileHeader child={child} />
                {child.allergy && <AllergyNotice allergy={child.allergy} />}
                <ChildInfoCard child={child} />
              </div>

              <div className="w-full md:w-[300px] flex-none flex flex-col gap-[14px]">
                <Link
                  href="#"
                  className="flex items-center justify-center gap-[9px] w-full py-[13px] rounded-[14px] bg-[#3F362E] text-white font-extrabold text-[15px]"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                  </svg>
                  Resumen del día
                </Link>
                <ParentsCard parents={child.parents} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
