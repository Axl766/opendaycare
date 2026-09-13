import type { Metadata } from "next";
import Link from "next/link";
import { AuthBrandPanel } from "@/components/AuthBrandPanel";
import { AuthLogo } from "@/components/AuthLogo";
import { loginDefaults } from "@/data/auth";

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

          <label
            htmlFor="login-email"
            className="block text-[12px] font-bold tracking-[.7px] text-[#94887B] mb-[8px]"
          >
            EMAIL
          </label>
          <input
            id="login-email"
            type="email"
            defaultValue={loginDefaults.email}
            className="w-full px-[16px] py-[14px] rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white text-[15px] text-[#3F362E] placeholder:text-[#B6A99B] focus:outline-none mb-[18px]"
          />

          <label
            htmlFor="login-password"
            className="block text-[12px] font-bold tracking-[.7px] text-[#94887B] mb-[8px]"
          >
            CONTRASEÑA
          </label>
          <input
            id="login-password"
            type="password"
            placeholder="••••••••"
            className="w-full px-[16px] py-[14px] rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white text-[15px] text-[#3F362E] placeholder:text-[#B6A99B] focus:outline-none mb-[10px]"
          />
          <div className="text-right mb-[20px]">
            <Link href="#" className="text-[#C5503A] text-[13.5px] font-bold">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <Link
            href="/"
            className="block text-center w-full p-[15px] rounded-[15px] bg-[linear-gradient(180deg,#F4977E,#EE8164)] text-white font-extrabold text-[16px] shadow-[0_10px_22px_-8px_rgba(238,129,100,.7)]"
          >
            Iniciar sesión
          </Link>

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
