"use client";

import { useState } from "react";
import { updateChildAction } from "@/app/actions/children";
import { ChildForm } from "@/components/ChildForm";
import type { Child, Room } from "@/lib/children";

export function EditChildModal({
  child,
  rooms,
}: {
  child: Child;
  rooms: Room[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="border-[1.5px] border-[#ECE0D0] bg-[#FFFDF9] text-[#6E6359] font-bold text-[14px] py-[9px] px-[16px] rounded-[12px]"
      >
        Editar
      </button>

      {open && (
        <ChildForm
          title="Editar niño"
          rooms={rooms}
          child={child}
          action={updateChildAction}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
