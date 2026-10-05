"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "@/app/actions/auth";
import { loginDefaults } from "@/data/auth";

export const LoginForm = () => {
  const [state, action, pending] = useActionState(login, null);

  return (
    <form action={action}>
      <label
        htmlFor="login-email"
        className="block text-[12px] font-bold tracking-[.7px] text-[#94887B] mb-[8px]"
      >
        EMAIL
      </label>
      <input
        id="login-email"
        name="email"
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
        name="password"
        type="password"
        placeholder="••••••••"
        className="w-full px-[16px] py-[14px] rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white text-[15px] text-[#3F362E] placeholder:text-[#B6A99B] focus:outline-none mb-[10px]"
      />
      <div className="text-right mb-[20px]">
        <Link href="#" className="text-[#C5503A] text-[13.5px] font-bold">
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      {state?.error && (
        <p
          role="alert"
          className="text-[13.5px] font-bold text-[#C5503A] bg-[#FDEDE8] border-[1.5px] border-[#F2A78E] rounded-[12px] px-[14px] py-[10px] mb-[16px]"
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="block text-center w-full p-[15px] rounded-[15px] bg-[linear-gradient(180deg,#F4977E,#EE8164)] text-white font-extrabold text-[16px] shadow-[0_10px_22px_-8px_rgba(238,129,100,.7)] disabled:opacity-60"
      >
        {pending ? "Ingresando…" : "Iniciar sesión"}
      </button>
    </form>
  );
};
