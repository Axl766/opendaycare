"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { archiveChildAction } from "@/app/actions/children";

export function ArchiveChildButton({
  childId,
  childName,
}: {
  childId: string;
  childName: string;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(
    archiveChildAction,
    null,
  );

  const cardRef = useRef<HTMLDivElement | null>(null);
  const firstName = childName.split(" ")[0];

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center justify-center gap-[9px] w-full py-[13px] rounded-[14px] border-[1.5px] border-[#FBDAD6] bg-[#FFFDF9] text-[#C5413A] font-extrabold text-[14.5px] hover:bg-[#FBDAD6] transition"
      >
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="4" rx="1" />
          <path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8M10 12h4" />
        </svg>
        Archivar niño
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-50 bg-[rgba(63,54,46,.4)]" />
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-[16px] md:p-[40px]">
              <div
                ref={cardRef}
                role="dialog"
                aria-modal="true"
                aria-label="Archivar niño"
                className="w-full max-w-[440px] bg-[#FBF4EC] border border-[#ECE0D0] rounded-[24px] shadow-[0_20px_50px_-24px_rgba(63,54,46,.35)] overflow-hidden"
              >
                <div className="px-[26px] py-[26px]">
                  <div className="flex items-start gap-[14px] mb-[18px]">
                    <div className="w-[44px] h-[44px] rounded-[13px] bg-[#FBDAD6] flex items-center justify-center shrink-0">
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#C5413A"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
                        <path d="M12 9v4M12 17h.01" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-display font-semibold text-[18px] text-[#3F362E] mb-[4px]">
                        ¿Archivar a {firstName}?
                      </div>
                      <p className="text-[14px] text-[#94887B] leading-[1.5]">
                        {firstName} dejará de aparecer en la lista de niños.
                        Esta acción se puede revertir desde la base de datos.
                      </p>
                    </div>
                  </div>

                  {state?.error && (
                    <p
                      role="alert"
                      className="text-[13px] font-bold text-[#D9583C] bg-[#FBDAD6] rounded-[12px] px-[14px] py-[11px] mb-[16px]"
                    >
                      {state.error}
                    </p>
                  )}

                  <form action={formAction} className="flex gap-[10px]">
                    <input type="hidden" name="childId" value={childId} />
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="flex-1 py-[12px] rounded-[14px] border-[1.5px] border-[#ECE0D0] bg-white text-[#6E6359] font-extrabold text-[14.5px]"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isPending}
                      className="flex-1 py-[12px] rounded-[14px] bg-[#D9583C] text-white font-extrabold text-[14.5px] disabled:opacity-50"
                    >
                      {isPending ? "Archivando…" : "Archivar"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
