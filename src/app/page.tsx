import { CreatePostPrompt } from "@/components/CreatePostPrompt";
import { FeedPosts } from "@/components/FeedPosts";
import { MobileTopBar } from "@/components/MobileTopBar";
import { Sidebar } from "@/components/Sidebar";
import { userRoleLabels } from "@/data/auth";
import { getInitial, type SessionUser } from "@/components/Sidebar";
import { verifySession } from "@/lib/auth";

export default async function Page() {
  const session = await verifySession();
  const sessionUser: SessionUser = {
    name: session.fullName,
    roleLabel: userRoleLabels[session.role],
    initial: getInitial(session.fullName),
  };

  return (
    <>
      <MobileTopBar activeNavId="feed" sessionUser={sessionUser} />
      <div className="flex min-h-screen bg-[#F6ECDF]">
        <Sidebar activeNavId="feed" sessionUser={sessionUser} />
        <main className="flex-1 min-w-0 md:h-screen md:overflow-y-auto">
          <div className="max-w-[760px] w-full mx-auto pt-[34px] px-[40px] pb-[80px]">
            <div className="mb-[24px]">
              <div className="text-[12.5px] font-extrabold tracking-[.8px] text-[#D9583C] mb-[4px]">
                GUARDERÍA · SALA SOLES
              </div>
              <h1 className="font-display font-semibold text-[30px] text-[#3F362E]">
                Buenas, Caro
              </h1>
              <p className="mt-[5px] text-[#94887B] text-[14.5px]">
                12 niños · martes 17 jun
              </p>
            </div>

            <CreatePostPrompt />

            <div className="flex items-center gap-[14px] mb-[14px]">
              <span className="text-[12.5px] font-extrabold tracking-[.8px] text-[#8A7C6D]">
                PUBLICADO HOY
              </span>
              <span className="flex-1 h-px bg-[#E7DAC8]" />
            </div>

            <FeedPosts />
          </div>
        </main>
      </div>
    </>
  );
}
