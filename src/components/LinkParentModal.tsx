"use client";

import { useEffect, useRef, useState } from "react";
import type { LinkedParent, ParentRole } from "@/data/children";

const invitationCode = "7K4P9";
const invitationExpiryNote = "Vence en 7 días";
const calloutIntro =
  "Le enviaremos un correo con un código para que active su cuenta.";

const relationshipOptions: { value: ParentRole; label: string }[] = [
  { value: "mom", label: "Mamá" },
  { value: "dad", label: "Papá" },
  { value: "tutor", label: "Tutor/a" },
];

export function LinkParentModal({
  childName,
  onInvite,
}: {
  childName: string;
  onInvite: (parent: LinkedParent) => void;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [relationship, setRelationship] = useState<ParentRole>("mom");

  const cardRef = useRef<HTMLDivElement | null>(null);

  const childFirstName = childName.split(" ")[0];

  function closeModal() {
    setOpen(false);
    setForm({ name: "", email: "" });
    setRelationship("mom");
  }

  function handleNameChange(value: string) {
    setForm((prev) => ({ ...prev, name: value }));
  }

  function handleEmailChange(value: string) {
    setForm((prev) => ({ ...prev, email: value }));
  }

  function handleInvite() {
    closeModal();
  }

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (cardRef.current && !cardRef.current.contains(target)) {
        closeModal();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeModal();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-[12px] pt-[8px]"
      >
        <span className="w-[40px] h-[40px] rounded-full border-[1.5px] border-dashed border-[#D8CBBA] flex items-center justify-center text-[#B0A290] shrink-0">
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
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
        <span className="font-extrabold text-[14.5px] text-[#C5503A]">
          Vincular otro padre
        </span>
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
                aria-label="Vincular padre"
                className="w-full max-w-[480px] bg-[#FBF4EC] border border-[#ECE0D0] rounded-[24px] shadow-[0_20px_50px_-24px_rgba(63,54,46,.35)] overflow-hidden"
              >
                <div className="flex items-center justify-between px-[26px] py-[20px] border-b border-[#ECE0D0]">
                  <div>
                    <div className="font-display font-semibold text-[18px] text-[#3F362E]">
                      Vincular padre
                    </div>
                    <div className="text-[13px] text-[#A89A8B]">
                      a {childName}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={closeModal}
                    aria-label="Cerrar"
                    className="w-[34px] h-[34px] rounded-[10px] bg-[#F0E6D8] text-[#94887B] flex items-center justify-center shrink-0"
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
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="px-[26px] py-[22px]">
                  <div className="flex gap-[11px] bg-[#E3ECFB] rounded-[14px] px-[16px] py-[13px] mb-[20px]">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#4E72C8"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="flex-none mt-[1px]"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4M12 8h.01" />
                    </svg>
                    <span className="text-[13.5px] text-[#3F5694] leading-[1.45]">
                      {calloutIntro} Solo verá el feed de {childFirstName}.
                    </span>
                  </div>

                  <label
                    htmlFor="parent-name"
                    className="block text-[12px] font-extrabold tracking-[.7px] text-[#94887B] mb-[8px]"
                  >
                    NOMBRE DEL PADRE/MADRE
                  </label>
                  <input
                    id="parent-name"
                    placeholder="Ej. Diego Fernández"
                    value={form.name}
                    onChange={(event) => handleNameChange(event.target.value)}
                    className="w-full px-[16px] py-[13px] rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white text-[15px] text-[#3F362E] placeholder:text-[#B6A99B] focus:outline-none mb-[18px]"
                  />

                  <label
                    htmlFor="parent-email"
                    className="block text-[12px] font-extrabold tracking-[.7px] text-[#94887B] mb-[8px]"
                  >
                    EMAIL
                  </label>
                  <input
                    id="parent-email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={form.email}
                    onChange={(event) => handleEmailChange(event.target.value)}
                    className="w-full px-[16px] py-[13px] rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white text-[15px] text-[#3F362E] placeholder:text-[#B6A99B] focus:outline-none mb-[18px]"
                  />

                  <div className="text-[12px] font-extrabold tracking-[.7px] text-[#94887B] mb-[10px]">
                    PARENTESCO
                  </div>
                  <div
                    role="radiogroup"
                    aria-label="Parentesco"
                    className="flex gap-[9px] mb-[20px]"
                  >
                    {relationshipOptions.map((option) => {
                      const selected = relationship === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          onClick={() => setRelationship(option.value)}
                          className={`flex-1 py-[11px] rounded-full border-[1.5px] font-extrabold text-[14px] ${
                            selected
                              ? "border-[#9FB8EC] bg-[#CCD8F4] text-[#4E72C8]"
                              : "border-[#ECE0D0] bg-[#FFFDF9] text-[#6E6359]"
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="bg-[#FBF1D6] border-[1.5px] border-dashed border-[#E6D08A] rounded-[16px] py-[18px] text-center mb-[20px]">
                    <div className="text-[12px] font-extrabold tracking-[.7px] text-[#A88526] mb-[8px]">
                      CÓDIGO DE INVITACIÓN
                    </div>
                    <div className="font-display font-semibold text-[34px] tracking-[7px] text-[#8A7234]">
                      {invitationCode}
                    </div>
                    <div className="text-[13px] text-[#A88526] mt-[6px]">
                      {invitationExpiryNote}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleInvite}
                    className="flex items-center justify-center gap-[9px] w-full py-[14px] rounded-[14px] bg-[linear-gradient(180deg,#F4977E,#EE8164)] text-white font-extrabold text-[15.5px] shadow-[0_10px_22px_-8px_rgba(238,129,100,.7)]"
                  >
                    <svg
                      width="19"
                      height="19"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m22 2-7 20-4-9-9-4z" />
                      <path d="M22 2 11 13" />
                    </svg>
                    Enviar invitación
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
