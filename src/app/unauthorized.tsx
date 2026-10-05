import type { Metadata } from "next";
import Link from "next/link";
import { AuthLogo } from "@/components/AuthLogo";

export const metadata: Metadata = {
  title: "No autorizado · OpenDayCare",
};

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBF4EC] p-[24px]">
      <div className="w-full max-w-[440px] text-center">
        <div className="flex justify-center mb-[22px]">
          <AuthLogo variant="light" />
        </div>
        <h1 className="font-display font-semibold text-[32px] leading-[1.15] text-[#3F362E] mb-[8px]">
          401 — No autorizado
        </h1>
        <p className="text-[#94887B] text-[15.5px] leading-[1.55] mb-[26px]">
          Iniciá sesión para acceder a esta página.
        </p>
        <Link
          href="/login"
          className="inline-block px-[32px] p-[15px] w-full max-w-[240px] rounded-[15px] bg-[linear-gradient(180deg,#F4977E,#EE8164)] text-white font-extrabold text-[16px] shadow-[0_10px_22px_-8px_rgba(238,129,100,.7)]"
        >
          Iniciar sesión
        </Link>
      </div>
    </div>
  );
}
