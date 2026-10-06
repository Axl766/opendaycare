"use client";

import { useActionState } from "react";
import Link from "next/link";
import { activateAccount } from "@/app/actions/invitations";
import { ConsentCheckbox } from "@/components/ConsentCheckbox";
import { invitation } from "@/data/auth";

export type ActivateAccountFormProps = {
  code: string;
  email: string;
  fullName: string;
  childName: string;
  roomName: string;
  childAvatarBg: string;
  childAvatarColor: string;
};

export function ActivateAccountForm({
  code,
  email,
  fullName,
  childName,
  roomName,
  childAvatarBg,
  childAvatarColor,
}: ActivateAccountFormProps) {
  const [state, action, pending] = useActionState(activateAccount, null);

  return (
    <form action={action}>
      <div className="flex items-center gap-[14px] bg-white border-[1.5px] border-[#EADFD0] rounded-[16px] px-[16px] py-[14px] mb-[22px]">
        <div
          className="w-[44px] h-[44px] rounded-full font-display font-semibold text-[19px] flex items-center justify-center shrink-0"
          style={{
            backgroundColor: childAvatarBg,
            color: childAvatarColor,
          }}
        >
          {childName.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="text-[13px] text-[#94887B]">
            Te invitaron a seguir a
          </div>
          <div className="font-display font-semibold text-[17px] text-[#3F362E]">
            {childName} · {roomName}
          </div>
        </div>
      </div>

      <label
        htmlFor="activation-code"
        className="block text-[12px] font-bold tracking-[.7px] text-[#94887B] mb-[8px]"
      >
        CÓDIGO DE INVITACIÓN
      </label>
      <input
        id="activation-code"
        name="code"
        defaultValue={code}
        readOnly
        className="w-full px-[16px] py-[14px] rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white font-display font-bold text-[18px] tracking-[3px] text-[#3F362E] focus:outline-none mb-[18px]"
      />

      <label
        htmlFor="activation-name"
        className="block text-[12px] font-bold tracking-[.7px] text-[#94887B] mb-[8px]"
      >
        NOMBRE DEL PADRE/MADRE
      </label>
      <input
        id="activation-name"
        defaultValue={fullName}
        readOnly
        className="w-full px-[16px] py-[14px] rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white text-[15px] text-[#3F362E] focus:outline-none mb-[18px]"
      />

      <label
        htmlFor="activation-email"
        className="block text-[12px] font-bold tracking-[.7px] text-[#94887B] mb-[8px]"
      >
        EMAIL
      </label>
      <input
        id="activation-email"
        type="email"
        defaultValue={email}
        readOnly
        className="w-full px-[16px] py-[14px] rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white text-[15px] text-[#3F362E] focus:outline-none mb-[18px]"
      />

      <label
        htmlFor="activation-password"
        className="block text-[12px] font-bold tracking-[.7px] text-[#94887B] mb-[8px]"
      >
        CREAR CONTRASEÑA
      </label>
      <input
        id="activation-password"
        name="password"
        type="password"
        placeholder="Mínimo 8 caracteres"
        className="w-full px-[16px] py-[14px] rounded-[14px] border-[1.5px] border-[#F2A78E] bg-white text-[15px] text-[#3F362E] placeholder:text-[#B6A99B] focus:outline-none mb-[18px]"
      />

      <ConsentCheckbox name="consent" text={invitation.consentText} />

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
        {pending ? "Activando…" : "Activar mi cuenta"}
      </button>

      <p className="text-center mt-[22px] text-[#94887B] text-[14.5px]">
        ¿Ya tenés cuenta?{" "}
        <Link href="/login" className="text-[#C5503A] font-extrabold">
          Iniciar sesión
        </Link>
      </p>
    </form>
  );
}
