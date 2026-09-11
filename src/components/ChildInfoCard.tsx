import type { Child } from "@/data/children";

export function ChildInfoCard({ child }: { child: Child }) {
  const rows = [
    { label: "Fecha de nacimiento", value: child.birthDate },
    { label: "Sala", value: child.room },
    { label: "Ingreso", value: child.enrollment },
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
