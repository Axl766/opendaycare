import type { Metadata } from "next";
import Link from "next/link";
import { ConsentCheckbox } from "@/components/ConsentCheckbox";
import { invitation } from "@/data/auth";

export const metadata: Metadata = {
  title: "Activá tu cuenta · OpenDayCare",
};

export default function ActivateAccountPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBF4EC] p-[24px] md:p-[40px]">
      <div className="w-full max-w-[440px]">
        <div className="w-[58px] h-[58px] rounded-[18px] bg-[linear-gradient(155deg,#F8C3A8,#F2937A)] flex items-center justify-center mb-[22px] shadow-[0_12px_26px_-10px_rgba(238,129,100,.65)]">
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </svg>
        </div>
        <h1 className="font-display font-semibold text-[32px] leading-[1.15] text-[#3F362E] mb-[8px]">
          Bienvenida a OpenDayCare
        </h1>
        <p className="text-[#94887B] text-[15.5px] leading-[1.55] mb-[26px]">
          Te invitaron a seguir el día de tu hijo. Creá tu contraseña para
          activar la cuenta.
        </p>

        <div className="flex items-center gap-[14px] bg-white border-[1.5px] border-[#EADFD0] rounded-[16px] px-[16px] py-[14px] mb-[22px]">
          <div
            className="w-[44px] h-[44px] rounded-full font-display font-semibold text-[19px] flex items-center justify-center shrink-0"
            style={{
              backgroundColor: invitation.childAvatarBg,
              color: invitation.childAvatarColor,
            }}
          >
            {invitation.childInitial}
          </div>
          <div>
            <div className="text-[13px] text-[#94887B]">
              Te invitaron a seguir a
            </div>
            <div className="font-display font-semibold text-[17px] text-[#3F362E]">
              {invitation.childName} · {invitation.room}
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
          defaultValue={invitation.code}
          className="w-full px-[16px] py-[14px] rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white font-display font-bold text-[18px] tracking-[3px] text-[#3F362E] focus:outline-none mb-[18px]"
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
          defaultValue={invitation.parentEmail}
          className="w-full px-[16px] py-[14px] rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white text-[15px] text-[#3F362E] placeholder:text-[#B6A99B] focus:outline-none mb-[18px]"
        />

        <label
          htmlFor="activation-password"
          className="block text-[12px] font-bold tracking-[.7px] text-[#94887B] mb-[8px]"
        >
          CREAR CONTRASEÑA
        </label>
        <input
          id="activation-password"
          type="password"
          defaultValue="contraseña"
          className="w-full px-[16px] py-[14px] rounded-[14px] border-[1.5px] border-[#F2A78E] bg-white text-[15px] text-[#3F362E] placeholder:text-[#B6A99B] focus:outline-none mb-[18px]"
        />

        <ConsentCheckbox text={invitation.consentText} />

        <Link
          href="#"
          className="block text-center w-full p-[15px] rounded-[15px] bg-[linear-gradient(180deg,#F4977E,#EE8164)] text-white font-extrabold text-[16px] shadow-[0_10px_22px_-8px_rgba(238,129,100,.7)]"
        >
          Activar mi cuenta
        </Link>

        <p className="text-center mt-[22px] text-[#94887B] text-[14.5px]">
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" className="text-[#C5503A] font-extrabold">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
