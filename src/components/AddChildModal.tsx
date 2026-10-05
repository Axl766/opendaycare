"use client";

import { useState } from "react";
import { createChildAction } from "@/app/actions/children";
import { ChildForm } from "@/components/ChildForm";
import type { Room } from "@/lib/children";

export function AddChildModal({ rooms }: { rooms: Room[] }) {
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
        <ChildForm
          title="Agregar niño"
          rooms={rooms}
          action={createChildAction}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
