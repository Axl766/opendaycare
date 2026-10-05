"use client";

import { useState } from "react";
import { ChildCard } from "./ChildCard";
import type { Child, Room } from "@/lib/children";

type ChildWithCount = Child & { parentCount: number };

function RoomDivider({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-center gap-[12px] mb-[14px]">
      <span className="text-[12.5px] font-extrabold tracking-[.8px] text-[#3F362E]">
        {label}
      </span>
      <span className="text-[13px] text-[#A89A8B]">
        {count} {count === 1 ? "niño" : "niños"}
      </span>
      <span className="flex-1 h-px bg-[#E7DAC8]" />
    </div>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="bg-[#FFFDF9] border border-dashed border-[#ECE0D0] rounded-[18px] px-[24px] py-[44px] text-center">
      <div className="w-[56px] h-[56px] rounded-full bg-[#FBE3D8] flex items-center justify-center mx-auto mb-[16px]">
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#EE8164"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {hasFilters ? (
            <>
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </>
          ) : (
            <path d="M12 5v14M5 12h14" />
          )}
        </svg>
      </div>
      <p className="font-display font-semibold text-[17px] text-[#3F362E] mb-[6px]">
        {hasFilters ? "Sin resultados" : "Todavía no hay niños"}
      </p>
      <p className="text-[14px] text-[#A89A8B]">
        {hasFilters
          ? "No encontramos niños que coincidan con la búsqueda o el filtro."
          : "Agregá al primer niño con el botón «Agregar niño»."}
      </p>
    </div>
  );
}

export function ChildrenBrowser({
  children: kids,
  rooms,
}: {
  children: ChildWithCount[];
  rooms: Room[];
}) {
  const [query, setQuery] = useState("");
  const [roomFilterId, setRoomFilterId] = useState("");

  const normalizedQuery = query.trim().toLowerCase();
  const filteredChildren = kids.filter((child) => {
    const matchesRoom = roomFilterId ? child.roomId === roomFilterId : true;
    const matchesQuery = normalizedQuery
      ? child.fullName.toLowerCase().includes(normalizedQuery)
      : true;
    return matchesRoom && matchesQuery;
  });

  const hasFilters = Boolean(normalizedQuery || roomFilterId);
  const selectedRoom = rooms.find((room) => room.id === roomFilterId);

  const groups = selectedRoom
    ? [{ room: selectedRoom, kids: filteredChildren }]
    : rooms
        .map((room) => ({
          room,
          kids: filteredChildren.filter((child) => child.roomId === room.id),
        }))
        .filter((group) => group.kids.length > 0);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-[10px] mb-[22px]">
        <div className="flex items-center gap-[11px] flex-1 min-w-0 bg-[#FFFDF9] border border-[#ECE0D0] rounded-[14px] px-[16px] py-[12px]">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#B0A290"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar niño…"
            className="flex-1 min-w-0 border-none bg-transparent text-[15px] text-[#3F362E] placeholder:text-[#B6A99B] focus:outline-none"
          />
        </div>
        <select
          value={roomFilterId}
          onChange={(event) => setRoomFilterId(event.target.value)}
          aria-label="Filtrar por sala"
          className="w-full md:w-[190px] shrink-0 px-[14px] py-[12px] rounded-[14px] border-[1.5px] border-[#ECE0D0] bg-[#FFFDF9] text-[14.5px] font-bold text-[#3F362E] focus:outline-none"
        >
          <option value="">Todas las salas</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name}
            </option>
          ))}
        </select>
      </div>

      {filteredChildren.length === 0 ? (
        <EmptyState hasFilters={hasFilters} />
      ) : (
        groups.map((group) => (
          <section key={group.room.id} className="mb-[26px] last:mb-0">
            <RoomDivider
              label={`SALA ${group.room.name.toUpperCase()}`}
              count={group.kids.length}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
              {group.kids.map((child) => (
                <ChildCard key={child.id} child={child} />
              ))}
            </div>
          </section>
        ))
      )}
    </>
  );
}
