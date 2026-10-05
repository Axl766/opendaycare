import type { Metadata } from "next";
import Link from "next/link";
import { AuthBrandPanel } from "@/components/AuthBrandPanel";
import { AuthLogo } from "@/components/AuthLogo";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Iniciar sesión · OpenDayCare",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen grid md:grid-cols-[1.05fr_1fr] bg-[#FBF4EC]">
      <AuthBrandPanel />
      <div className="flex items-center justify-center p-[24px] md:p-[40px]">
        <div className="w-full max-w-[392px]">
          <div className="md:hidden mb-[28px]">
            <AuthLogo variant="light" />
          </div>
          <h2 className="font-display font-semibold text-[30px] text-[#3F362E] mb-[6px]">
            Iniciar sesión
          </h2>
          <p className="text-[#94887B] text-[15px] mb-[28px]">
            Ingresá para ver el día de hoy.
          </p>

          <LoginForm />

          <p className="text-center mt-[24px] text-[#94887B] text-[14.5px]">
            ¿Te invitó la guardería?{" "}
            <Link href="/activate-account" className="text-[#C5503A] font-extrabold">
              Activá tu cuenta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
