"use client";

import { useEffect, useRef, useState } from "react";
import { useFeed } from "@/components/FeedProvider";
import { children } from "@/data/children";
import {
  postTypeLabel,
  postTypePill,
  type Post,
  type PostType,
} from "@/data/feed";

const postTypes: PostType[] = [
  "meal",
  "nap",
  "activity",
  "achievement",
  "mood",
  "photo",
  "announcement",
];

function formatRecipient(firstNames: string[]): string {
  if (firstNames.length === 1) {
    return `familia de ${firstNames[0]}`;
  }
  if (firstNames.length === 2) {
    return `familia de ${firstNames[0]} y ${firstNames[1]}`;
  }
  const allButLast = firstNames.slice(0, -1).join(", ");
  const last = firstNames[firstNames.length - 1];
  return `familia de ${allButLast} y ${last}`;
}

export function CreatePostModal() {
  const { addPost } = useFeed();
  const [open, setOpen] = useState(false);
  const [selectedChildren, setSelectedChildren] = useState<Set<string>>(
    new Set(),
  );
  const [roomSelected, setRoomSelected] = useState(false);
  const [selectedType, setSelectedType] = useState<PostType | null>(null);
  const [extraPhotos, setExtraPhotos] = useState(0);
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({
    recipient: "",
    type: "",
    description: "",
  });

  const cardRef = useRef<HTMLDivElement | null>(null);

  function resetForm() {
    setSelectedChildren(new Set());
    setRoomSelected(false);
    setSelectedType(null);
    setExtraPhotos(0);
    setDescription("");
    setErrors({ recipient: "", type: "", description: "" });
  }

  function closeModal() {
    resetForm();
    setOpen(false);
  }

  function toggleChild(childId: string) {
    setRoomSelected(false);
    setErrors((prev) => ({ ...prev, recipient: "" }));
    setSelectedChildren((prev) => {
      const next = new Set(prev);
      if (next.has(childId)) {
        next.delete(childId);
      } else {
        next.add(childId);
      }
      return next;
    });
  }

  function toggleRoom() {
    setSelectedChildren(new Set());
    setErrors((prev) => ({ ...prev, recipient: "" }));
    setRoomSelected((prev) => !prev);
  }

  function toggleType(type: PostType) {
    setErrors((prev) => ({ ...prev, type: "" }));
    setSelectedType((prev) => (prev === type ? null : type));
  }

  function addPhoto() {
    setExtraPhotos((prev) => prev + 1);
  }

  function handleDescriptionChange(value: string) {
    setDescription(value);
    setErrors((prev) => ({ ...prev, description: "" }));
  }

  function handlePublish() {
    const nextErrors = {
      recipient: "",
      type: "",
      description: "",
    };

    if (!roomSelected && selectedChildren.size === 0) {
      nextErrors.recipient = "Elegí al menos un destinatario.";
    }
    if (!selectedType) {
      nextErrors.type = "Elegí un tipo de publicación.";
    }
    if (!description.trim()) {
      nextErrors.description = "Ingresá una descripción.";
    }

    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    const selectedTypeValue = selectedType as PostType;
    const time = new Date().toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    let author: Post["author"];
    let recipient: string;

    if (roomSelected) {
      author = { kind: "announcement" };
      recipient = "toda la sala";
    } else {
      const selectedKids = children.filter((child) =>
        selectedChildren.has(child.id),
      );
      const firstChild = selectedKids[0];
      const firstNames = selectedKids.map((child) => child.name.split(" ")[0]);

      author = {
        kind: "child",
        name: firstChild.name.split(" ")[0],
        initial: firstChild.initial,
        avatarBg: firstChild.avatarBg,
        avatarColor: firstChild.avatarColor,
      };
      recipient = formatRecipient(firstNames);
    }

    const newPost: Post = {
      id: `post-${Date.now()}`,
      author,
      time,
      type: selectedTypeValue,
      recipient,
      body: description.trim(),
      likes: 0,
      comments: 0,
    };

    addPost(newPost);
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

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeModal();
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
                ref={cardRef}
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
                    onClick={handlePublish}
                    className="text-[#D9583C] font-extrabold text-[15px]"
                  >
                    Publicar
                  </button>
                </div>

                <div className="px-[26px] py-[24px]">
                  <div className="text-[12px] font-extrabold tracking-[.7px] text-[#94887B] mb-[10px]">
                    PARA
                  </div>
                  <div
                    className={`flex flex-wrap gap-[9px] ${
                      errors.recipient ? "mb-[8px]" : "mb-[22px]"
                    }`}
                  >
                    {children.map((child) => {
                      const selected = selectedChildren.has(child.id);
                      return (
                        <button
                          key={child.id}
                          type="button"
                          onClick={() => toggleChild(child.id)}
                          className={`flex items-center gap-[8px] pl-[6px] pr-[14px] py-[6px] rounded-full border-[1.5px] font-bold text-[14px] ${
                            selected
                              ? "border-[#3F362E] bg-[#3F362E] text-white"
                              : "border-[#ECE0D0] bg-[#FFFDF9] text-[#6E6359]"
                          }`}
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
                      );
                    })}
                    <button
                      type="button"
                      onClick={toggleRoom}
                      className={`px-[16px] py-[6px] rounded-full border-[1.5px] font-bold text-[14px] ${
                        roomSelected
                          ? "border-[#3F362E] bg-[#3F362E] text-white"
                          : "border-[#ECE0D0] bg-[#FFFDF9] text-[#6E6359]"
                      }`}
                    >
                      Toda la sala
                    </button>
                  </div>
                  {errors.recipient && (
                    <p className="text-[13px] font-bold text-[#D9583C] mb-[22px]">
                      {errors.recipient}
                    </p>
                  )}

                  <div className="text-[12px] font-extrabold tracking-[.7px] text-[#94887B] mb-[10px]">
                    TIPO
                  </div>
                  <div
                    className={`flex flex-wrap gap-[9px] ${
                      errors.type ? "mb-[8px]" : "mb-[22px]"
                    }`}
                  >
                    {postTypes.map((type) => {
                      const pill = postTypePill[type];
                      const selected = selectedType === type;
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => toggleType(type)}
                          className={`px-[16px] py-[8px] rounded-full font-extrabold text-[13.5px] ${
                            selected
                              ? "border-[1.5px] border-[#3F362E]"
                              : "border border-transparent"
                          }`}
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
                  {errors.type && (
                    <p className="text-[13px] font-bold text-[#D9583C] mb-[22px]">
                      {errors.type}
                    </p>
                  )}

                  <div className="text-[12px] font-extrabold tracking-[.7px] text-[#94887B] mb-[10px]">
                    DESCRIPCIÓN
                  </div>
                  <textarea
                    placeholder="Contá cómo le fue hoy…"
                    value={description}
                    onChange={(event) =>
                      handleDescriptionChange(event.target.value)
                    }
                    className={`w-full min-h-[120px] resize-y px-[16px] py-[14px] rounded-[14px] border-[1.5px] bg-white text-[15px] text-[#3F362E] placeholder:text-[#B6A99B] focus:outline-none leading-[1.5] ${
                      errors.description ? "mb-[8px]" : "mb-[22px]"
                    } ${
                      errors.description
                        ? "border-[#D9583C]"
                        : "border-[#EADFD0]"
                    }`}
                  />
                  {errors.description && (
                    <p className="text-[13px] font-bold text-[#D9583C] mb-[22px]">
                      {errors.description}
                    </p>
                  )}

                  <div className="text-[12px] font-extrabold tracking-[.7px] text-[#94887B] mb-[10px]">
                    FOTOS
                  </div>
                  <div className="flex flex-wrap gap-[12px]">
                    {Array.from({ length: 1 + extraPhotos }).map((_, index) => (
                      <div
                        key={index}
                        className="w-[96px] h-[96px] rounded-[14px] bg-[#F4ECE1] border border-[#ECE0D0] flex items-center justify-center text-[#CBB89F]"
                      >
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
                    ))}
                    <button
                      type="button"
                      onClick={addPhoto}
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
