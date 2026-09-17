"use client";

import { useState } from "react";
import { children } from "@/data/children";
import { postTypeLabel, postTypePill, type PostType } from "@/data/feed";

const postTypes: PostType[] = [
  "meal",
  "nap",
  "activity",
  "achievement",
  "mood",
  "photo",
  "announcement",
];

export function CreatePostModal() {
  const [open, setOpen] = useState(false);

  function closeModal() {
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
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
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-50 bg-[rgba(63,54,46,.4)]" />
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-[16px] md:p-[40px]">
              <div
                role="dialog"
                aria-modal="true"
                aria-label="Nueva publicación"
                className="w-full max-w-[580px] bg-[#FBF4EC] border border-[#ECE0D0] rounded-[24px] shadow-[0_20px_50px_-24px_rgba(63,54,46,.35)] overflow-hidden"
              >
                <div className="flex items-center justify-between px-[26px] py-[20px] border-b border-[#ECE0D0]">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="text-[#94887B] font-bold text-[15px]"
                  >
                    Cancelar
                  </button>
                  <span className="font-display font-semibold text-[18px] text-[#3F362E]">
                    Nueva publicación
                  </span>
                  <button
                    type="button"
                    className="text-[#D9583C] font-extrabold text-[15px]"
                  >
                    Publicar
                  </button>
                </div>

                <div className="px-[26px] py-[24px]">
                  <div className="text-[12px] font-extrabold tracking-[.7px] text-[#94887B] mb-[10px]">
                    PARA
                  </div>
                  <div className="flex flex-wrap gap-[9px] mb-[22px]">
                    {children.map((child) => (
                      <button
                        key={child.id}
                        type="button"
                        className="flex items-center gap-[8px] pl-[6px] pr-[14px] py-[6px] rounded-full border-[1.5px] border-[#ECE0D0] bg-[#FFFDF9] text-[#6E6359] font-bold text-[14px]"
                      >
                        <span
                          className="w-[26px] h-[26px] rounded-full font-display font-semibold text-[13px] flex items-center justify-center"
                          style={{
                            backgroundColor: child.avatarBg,
                            color: child.avatarColor,
                          }}
                        >
                          {child.initial}
                        </span>
                        {child.name.split(" ")[0]}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="px-[16px] py-[6px] rounded-full border-[1.5px] border-[#ECE0D0] bg-[#FFFDF9] text-[#6E6359] font-bold text-[14px]"
                    >
                      Toda la sala
                    </button>
                  </div>

                  <div className="text-[12px] font-extrabold tracking-[.7px] text-[#94887B] mb-[10px]">
                    TIPO
                  </div>
                  <div className="flex flex-wrap gap-[9px] mb-[22px]">
                    {postTypes.map((type) => {
                      const pill = postTypePill[type];
                      return (
                        <button
                          key={type}
                          type="button"
                          className="px-[16px] py-[8px] rounded-full font-extrabold text-[13.5px]"
                          style={{
                            backgroundColor: pill.bg,
                            color: pill.color,
                          }}
                        >
                          {postTypeLabel[type]}
                        </button>
                      );
                    })}
                  </div>

                  <div className="text-[12px] font-extrabold tracking-[.7px] text-[#94887B] mb-[10px]">
                    DESCRIPCIÓN
                  </div>
                  <textarea
                    placeholder="Contá cómo le fue hoy…"
                    className="w-full min-h-[120px] resize-y px-[16px] py-[14px] rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white text-[15px] text-[#3F362E] placeholder:text-[#B6A99B] focus:outline-none leading-[1.5] mb-[22px]"
                  />

                  <div className="text-[12px] font-extrabold tracking-[.7px] text-[#94887B] mb-[10px]">
                    FOTOS
                  </div>
                  <div className="flex gap-[12px]">
                    <div className="w-[96px] h-[96px] rounded-[14px] bg-[#F4ECE1] border border-[#ECE0D0] flex items-center justify-center text-[#CBB89F]">
                      <svg
                        width="26"
                        height="26"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="9" cy="9" r="2" />
                        <path d="m21 15-3.6-3.6a2 2 0 0 0-2.8 0L6 21" />
                      </svg>
                    </div>
                    <button
                      type="button"
                      className="w-[96px] h-[96px] rounded-[14px] border-[1.5px] border-dashed border-[#DBCDBA] bg-[#F4ECE1] flex flex-col items-center justify-center gap-[6px] text-[#B0A290]"
                    >
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#C5503A"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                      <span className="text-[12px]">Agregar</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
