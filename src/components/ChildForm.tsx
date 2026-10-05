"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type { ChildFormState } from "@/app/actions/children";
import { allergyOptions } from "@/data/children";
import type { Child, Room } from "@/lib/children";

function isoToDdMmYyyy(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return day && month && year ? `${day}/${month}/${year}` : "";
}

function toIsoFromDdMmYyyy(value: string): string | null {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return null;
  const [day, month, year] = value.split("/");
  return `${year}-${month}-${day}`;
}

function localTodayIso(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
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
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
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

export function ChildForm({
  title,
  rooms,
  child,
  action,
  onClose,
}: {
  title: string;
  rooms: Room[];
  child?: Child;
  action: (state: ChildFormState, formData: FormData) => Promise<ChildFormState>;
  onClose: () => void;
}) {
  const [birthDate, setBirthDate] = useState(
    child ? isoToDdMmYyyy(child.birthDate) : "",
  );
  const [selectedRoomId, setSelectedRoomId] = useState(child?.roomId ?? "");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [errors, setErrors] = useState({ name: "", birthDate: "", roomId: "" });
  const [state, formAction, isPending] = useActionState(action, null);

  const formRef = useRef<HTMLFormElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const birthDateInputRef = useRef<HTMLInputElement | null>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const birthDateIso = toIsoFromDdMmYyyy(birthDate) ?? "";
  const selectedRoom = rooms.find((room) => room.id === selectedRoomId);
  const selectedRoomName = selectedRoom?.name ?? "";

  function handleSave() {
    const nextErrors = {
      name: nameInputRef.current?.value.trim()
        ? ""
        : "El nombre es obligatorio",
      birthDate: validateBirthDate(birthDate),
      roomId: selectedRoomId ? "" : "Seleccioná una sala",
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
    if (nextErrors.roomId) {
      triggerRef.current?.focus();
      return;
    }
    formRef.current?.requestSubmit();
  }

  useEffect(() => {
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
        onClose();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [dropdownOpen, onClose]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (dropdownOpen) {
          setDropdownOpen(false);
        } else {
          onClose();
        }
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [dropdownOpen, onClose]);

  useEffect(() => {
    if (dropdownOpen) {
      optionRefs.current[activeIndex]?.focus();
    }
  }, [dropdownOpen, activeIndex]);

  function toggleDropdown() {
    if (dropdownOpen) {
      setDropdownOpen(false);
    } else {
      setActiveIndex(
        Math.max(
          0,
          rooms.findIndex((room) => room.id === selectedRoomId),
        ),
      );
      setDropdownOpen(true);
    }
  }

  function selectRoom(room: Room) {
    setSelectedRoomId(room.id);
    setDropdownOpen(false);
    setErrors((prev) => ({ ...prev, roomId: "" }));
    triggerRef.current?.focus();
  }

  function handleListKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
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
      <div className="fixed inset-0 z-50 bg-[rgba(63,54,46,.4)]" />
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-[16px] md:p-[40px]">
          <div
            ref={cardRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="w-full max-w-[520px] bg-[#FBF4EC] border border-[#ECE0D0] rounded-[24px] shadow-[0_20px_50px_-24px_rgba(63,54,46,.35)] overflow-hidden"
          >
            <div className="flex items-center justify-between px-[26px] py-[20px] border-b border-[#ECE0D0]">
              <button
                type="button"
                onClick={onClose}
                className="text-[#94887B] font-bold text-[15px]"
              >
                Cancelar
              </button>
              <span className="font-display font-semibold text-[18px] text-[#3F362E]">
                {title}
              </span>
              <button
                type="button"
                onClick={handleSave}
                disabled={isPending}
                className="text-[#D9583C] font-extrabold text-[15px] disabled:opacity-50"
              >
                {isPending ? "Guardando…" : "Guardar"}
              </button>
            </div>
            <form
              ref={formRef}
              action={formAction}
              className="px-[26px] py-[24px]"
            >
              {state?.error && (
                <p
                  role="alert"
                  className="text-[13px] font-bold text-[#D9583C] bg-[#FBDAD6] rounded-[12px] px-[14px] py-[11px] mb-[18px]"
                >
                  {state.error}
                </p>
              )}

              {child && <input type="hidden" name="childId" value={child.id} />}
              <input
                type="hidden"
                name="birthDate"
                value={birthDateIso}
              />
              <input type="hidden" name="roomId" value={selectedRoomId} />

              <label
                htmlFor="child-name"
                className="block text-[12px] font-extrabold tracking-[.7px] text-[#94887B] mb-[8px]"
              >
                NOMBRE COMPLETO
              </label>
              <input
                id="child-name"
                ref={nameInputRef}
                name="fullName"
                placeholder="Ej. Martina López"
                defaultValue={child?.fullName ?? ""}
                onChange={() => setErrors((prev) => ({ ...prev, name: "" }))}
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

              <div className="flex flex-col md:flex-row gap-[14px] md:gap-[14px] mb-[18px]">
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
                    value={birthDate}
                    onChange={(event) => {
                      setBirthDate(event.target.value);
                      setErrors((prev) => ({ ...prev, birthDate: "" }));
                    }}
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
                      className={`flex items-center gap-[8px] w-full px-[16px] py-[13px] rounded-[14px] border-[1.5px] bg-white text-[15px] font-bold focus:outline-none ${
                        errors.roomId
                          ? "border-[#D9583C] text-[#B6A99B]"
                          : "border-[#EADFD0] text-[#3F362E]"
                      }`}
                    >
                      {selectedRoomName || "Seleccionar sala"}
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
                            key={room.id}
                            type="button"
                            role="option"
                            aria-selected={room.id === selectedRoomId}
                            ref={(element) => {
                              optionRefs.current[index] = element;
                            }}
                            onClick={() => selectRoom(room)}
                            className={`w-full text-left px-[16px] py-[10px] text-[15px] ${
                              room.id === selectedRoomId
                                ? "text-[#D9583C] font-bold"
                                : "text-[#3F362E]"
                            } ${
                              index === activeIndex ? "bg-[#FBE3D8]" : ""
                            }`}
                          >
                            {room.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.roomId && (
                    <p
                      role="alert"
                      className="text-[12px] font-bold text-[#D9583C] mt-[8px]"
                    >
                      {errors.roomId}
                    </p>
                  )}
                </div>
              </div>

              <div className="text-[12px] font-extrabold tracking-[.7px] text-[#94887B] mb-[10px]">
                ALERGIAS
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-[10px] gap-y-[10px] mb-[18px]">
                {allergyOptions.map((option) => (
                  <label
                    key={option.value}
                    htmlFor={`allergy-${option.value}`}
                    className="flex items-center gap-[9px] cursor-pointer select-none"
                  >
                    <input
                      id={`allergy-${option.value}`}
                      type="checkbox"
                      name={`allergy_${option.value}`}
                      defaultChecked={
                        child?.allergyTags.includes(option.value) ?? false
                      }
                      className="w-[18px] h-[18px] accent-[#EE8164] shrink-0"
                    />
                    <span className="text-[13.5px] font-bold text-[#3F362E]">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>

              <label
                htmlFor="child-medical-notes"
                className="block text-[12px] font-extrabold tracking-[.7px] text-[#94887B] mb-[8px]"
              >
                NOTAS MÉDICAS
              </label>
              <textarea
                id="child-medical-notes"
                name="medicalNotes"
                placeholder="Indicaciones, medicación, contactos…"
                defaultValue={child?.medicalNotes ?? ""}
                className="w-full min-h-[90px] resize-y px-[16px] py-[13px] rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white text-[15px] text-[#3F362E] placeholder:text-[#B6A99B] focus:outline-none leading-[1.5] mb-[18px]"
              />

              <label
                htmlFor="child-enrolled-at"
                className="block text-[12px] font-extrabold tracking-[.7px] text-[#94887B] mb-[8px]"
              >
                FECHA DE INGRESO
              </label>
              <input
                id="child-enrolled-at"
                type="date"
                name="enrolledAt"
                defaultValue={child?.enrolledAt ?? localTodayIso()}
                className="w-full px-[16px] py-[13px] rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white text-[15px] text-[#3F362E] focus:outline-none mb-[18px]"
              />

              <label
                htmlFor="child-photo-consent"
                className="flex items-center gap-[10px] cursor-pointer select-none"
              >
                <input
                  id="child-photo-consent"
                  type="checkbox"
                  name="photoConsent"
                  defaultChecked={child ? child.photoConsent : true}
                  className="w-[18px] h-[18px] accent-[#EE8164] shrink-0"
                />
                <span className="text-[13.5px] font-bold text-[#3F362E]">
                  Autorizo el uso de imágenes del niño
                </span>
              </label>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
