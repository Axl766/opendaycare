"use client";

import { useState } from "react";

export function AddChildModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
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
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-50 bg-[rgba(63,54,46,.4)]" />
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-[16px] md:p-[40px]">
              <div
                role="dialog"
                aria-modal="true"
                aria-label="Agregar niño"
                className="w-full max-w-[520px] bg-[#FBF4EC] border border-[#ECE0D0] rounded-[24px] shadow-[0_20px_50px_-24px_rgba(63,54,46,.35)] overflow-hidden"
              >
                <div className="flex items-center justify-between px-[26px] py-[20px] border-b border-[#ECE0D0]">
                  <button
                    type="button"
                    className="text-[#94887B] font-bold text-[15px]"
                  >
                    Cancelar
                  </button>
                  <span className="font-display font-semibold text-[18px] text-[#3F362E]">
                    Agregar niño
                  </span>
                  <button
                    type="button"
                    className="text-[#D9583C] font-extrabold text-[15px]"
                  >
                    Guardar
                  </button>
                </div>
                <div className="px-[26px] py-[24px]">
                  <label
                    htmlFor="child-name"
                    className="block text-[12px] font-extrabold tracking-[.7px] text-[#94887B] mb-[8px]"
                  >
                    NOMBRE COMPLETO
                  </label>
                  <input
                    id="child-name"
                    placeholder="Ej. Martina López"
                    className="w-full px-[16px] py-[13px] rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white text-[15px] text-[#3F362E] placeholder:text-[#B6A99B] focus:outline-none mb-[18px]"
                  />

                  <div className="flex gap-[14px] mb-[18px]">
                    <div className="flex-1">
                      <label
                        htmlFor="child-birth-date"
                        className="block text-[12px] font-extrabold tracking-[.7px] text-[#94887B] mb-[8px]"
                      >
                        FECHA DE NACIMIENTO
                      </label>
                      <input
                        id="child-birth-date"
                        placeholder="dd/mm/aaaa"
                        className="w-full px-[16px] py-[13px] rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white text-[15px] text-[#3F362E] placeholder:text-[#B6A99B] focus:outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-[12px] font-extrabold tracking-[.7px] text-[#94887B] mb-[8px]">
                        SALA
                      </div>
                      <button
                        type="button"
                        className="flex items-center gap-[8px] w-full px-[16px] py-[13px] rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white text-[15px] text-[#3F362E] font-bold"
                      >
                        Soles
                        <span className="flex-1" />
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#B0A290"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <label
                    htmlFor="child-allergies"
                    className="block text-[12px] font-extrabold tracking-[.7px] text-[#94887B] mb-[8px]"
                  >
                    ALERGIAS (ETIQUETAS)
                  </label>
                  <input
                    id="child-allergies"
                    placeholder="Ej. Maní, Lactosa"
                    className="w-full px-[16px] py-[13px] rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white text-[15px] text-[#3F362E] placeholder:text-[#B6A99B] focus:outline-none mb-[18px]"
                  />

                  <label
                    htmlFor="child-medical-notes"
                    className="block text-[12px] font-extrabold tracking-[.7px] text-[#94887B] mb-[8px]"
                  >
                    NOTAS MÉDICAS
                  </label>
                  <textarea
                    id="child-medical-notes"
                    placeholder="Indicaciones, medicación, contactos…"
                    className="w-full min-h-[90px] resize-y px-[16px] py-[13px] rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white text-[15px] text-[#3F362E] placeholder:text-[#B6A99B] focus:outline-none leading-[1.5]"
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
