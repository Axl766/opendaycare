"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { rooms } from "@/data/children";

export function AddChildModal() {
  const [open, setOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState("Soles");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [form, setForm] = useState({ name: "", birthDate: "" });
  const [errors, setErrors] = useState({ name: "", birthDate: "" });

  const cardRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const birthDateInputRef = useRef<HTMLInputElement | null>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function closeModal() {
    setOpen(false);
    setDropdownOpen(false);
    setSelectedRoom("Soles");
    setForm({ name: "", birthDate: "" });
    setErrors({ name: "", birthDate: "" });
  }

  function handleNameChange(value: string) {
    setForm((prev) => ({ ...prev, name: value }));
    setErrors((prev) => ({ ...prev, name: "" }));
  }

  function handleBirthDateChange(value: string) {
    setForm((prev) => ({ ...prev, birthDate: value }));
    setErrors((prev) => ({ ...prev, birthDate: "" }));
  }

  function validateBirthDate(value: string): string {
    const invalidDateMessage = "Ingresa una fecha válida en formato dd/mm/aaaa";
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
      return invalidDateMessage;
    }
    const [dayText, monthText, yearText] = value.split("/");
    const day = Number(dayText);
    const month = Number(monthText);
    const year = Number(yearText);
    const isLeapYear =
      (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    const daysInMonth = [
      31,
      isLeapYear ? 29 : 28,
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31,
    ];
    if (month < 1 || month > 12 || day < 1 || day > daysInMonth[month - 1]) {
      return invalidDateMessage;
    }
    const birthDate = new Date(year, month - 1, day);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (birthDate.getTime() > today.getTime()) {
      return "La fecha no puede ser posterior a hoy";
    }
    return "";
  }

  function handleSave() {
    const nextErrors = {
      name: form.name.trim() ? "" : "El nombre es obligatorio",
      birthDate: validateBirthDate(form.birthDate),
    };
    setErrors(nextErrors);
    if (nextErrors.name) {
      nameInputRef.current?.focus();
      return;
    }
    if (nextErrors.birthDate) {
      birthDateInputRef.current?.focus();
      return;
    }
    closeModal();
  }

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (
        dropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setDropdownOpen(false);
        return;
      }
      if (cardRef.current && !cardRef.current.contains(target)) {
        closeModal();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, dropdownOpen]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (dropdownOpen) {
          setDropdownOpen(false);
        } else {
          closeModal();
        }
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, dropdownOpen]);

  useEffect(() => {
    if (dropdownOpen) {
      optionRefs.current[activeIndex]?.focus();
    }
  }, [dropdownOpen, activeIndex]);

  function toggleDropdown() {
    if (dropdownOpen) {
      setDropdownOpen(false);
    } else {
      setActiveIndex(Math.max(0, rooms.indexOf(selectedRoom)));
      setDropdownOpen(true);
    }
  }

  function selectRoom(room: string) {
    setSelectedRoom(room);
    setDropdownOpen(false);
    triggerRef.current?.focus();
  }

  function handleListKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const delta = event.key === "ArrowDown" ? 1 : -1;
      const next = (activeIndex + delta + rooms.length) % rooms.length;
      setActiveIndex(next);
      optionRefs.current[next]?.focus();
    } else if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      setDropdownOpen(false);
      triggerRef.current?.focus();
    }
  }

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
                ref={cardRef}
                role="dialog"
                aria-modal="true"
                aria-label="Agregar niño"
                className="w-full max-w-[520px] bg-[#FBF4EC] border border-[#ECE0D0] rounded-[24px] shadow-[0_20px_50px_-24px_rgba(63,54,46,.35)] overflow-hidden"
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
                    Agregar niño
                  </span>
                  <button
                    type="button"
                    onClick={handleSave}
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
                    ref={nameInputRef}
                    placeholder="Ej. Martina López"
                    value={form.name}
                    onChange={(event) => handleNameChange(event.target.value)}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "child-name-error" : undefined}
                    className={`w-full px-[16px] py-[13px] rounded-[14px] border-[1.5px] bg-white text-[15px] text-[#3F362E] placeholder:text-[#B6A99B] focus:outline-none ${
                      errors.name
                        ? "border-[#D9583C] mb-[8px]"
                        : "border-[#EADFD0] mb-[18px]"
                    }`}
                  />
                  {errors.name && (
                    <p
                      id="child-name-error"
                      role="alert"
                      className="text-[12px] font-bold text-[#D9583C] mb-[18px]"
                    >
                      {errors.name}
                    </p>
                  )}

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
                        ref={birthDateInputRef}
                        placeholder="dd/mm/aaaa"
                        inputMode="numeric"
                        value={form.birthDate}
                        onChange={(event) =>
                          handleBirthDateChange(event.target.value)
                        }
                        aria-invalid={Boolean(errors.birthDate)}
                        aria-describedby={
                          errors.birthDate ? "child-birth-date-error" : undefined
                        }
                        className={`w-full px-[16px] py-[13px] rounded-[14px] border-[1.5px] bg-white text-[15px] text-[#3F362E] placeholder:text-[#B6A99B] focus:outline-none ${
                          errors.birthDate
                            ? "border-[#D9583C]"
                            : "border-[#EADFD0]"
                        }`}
                      />
                      {errors.birthDate && (
                        <p
                          id="child-birth-date-error"
                          role="alert"
                          className="text-[12px] font-bold text-[#D9583C] mt-[8px]"
                        >
                          {errors.birthDate}
                        </p>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-[12px] font-extrabold tracking-[.7px] text-[#3F362E] mb-[8px]">
                        SALA
                      </div>
                      <div ref={dropdownRef} className="relative">
                        <button
                          type="button"
                          ref={triggerRef}
                          aria-haspopup="listbox"
                          aria-expanded={dropdownOpen}
                          onClick={toggleDropdown}
                          className="flex items-center gap-[8px] w-full px-[16px] py-[13px] rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white text-[15px] text-[#3F362E] font-bold"
                        >
                          {selectedRoom}
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
                        {dropdownOpen && (
                          <div
                            role="listbox"
                            aria-label="Sala"
                            onKeyDown={handleListKeyDown}
                            className="absolute top-[calc(100%+6px)] left-0 right-0 z-10 bg-white border-[1.5px] border-[#EADFD0] rounded-[14px] py-[6px] shadow-[0_14px_30px_-12px_rgba(63,54,46,.3)]"
                          >
                            {rooms.map((room, index) => (
                              <button
                                key={room}
                                type="button"
                                role="option"
                                aria-selected={room === selectedRoom}
                                ref={(element) => {
                                  optionRefs.current[index] = element;
                                }}
                                onClick={() => selectRoom(room)}
                                className={`w-full text-left px-[16px] py-[10px] text-[15px] ${
                                  room === selectedRoom
                                    ? "text-[#D9583C] font-bold"
                                    : "text-[#3F362E]"
                                } ${
                                  index === activeIndex ? "bg-[#FBE3D8]" : ""
                                }`}
                              >
                                {room}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
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
