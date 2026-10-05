import type { Child } from "@/lib/children";

export function ChildInfoCard({ child }: { child: Child }) {
  const rows = [
    { label: "Fecha de nacimiento", value: formatFullDate(child.birthDate) },
    { label: "Sala", value: child.roomName },
    { label: "Ingreso", value: formatMonthYear(child.enrolledAt) },
  ];

  return (
    <div className="bg-[#FFFDF9] border border-[#ECE0D0] rounded-[16px] overflow-hidden divide-y divide-[#F0E6D8]">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex justify-between px-[18px] py-[15px] text-[14.5px]"
        >
          <span className="text-[#94887B]">{row.label}</span>
          <span className="font-extrabold text-[#3F362E]">{row.value}</span>
        </div>
      ))}
    </div>
  );
}

function formatFullDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  const month = new Intl.DateTimeFormat("es-AR", { month: "short" }).format(date);
  return `${String(date.getDate()).padStart(2, "0")} ${month} ${date.getFullYear()}`;
}

function formatMonthYear(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  const month = new Intl.DateTimeFormat("es-AR", { month: "short" }).format(date);
  return `${month} ${date.getFullYear()}`;
}
