import type { Metadata } from "next";
import Link from "next/link";
import { ActivateAccountForm } from "./ActivateAccountForm";
import {
  childAvatarStyle,
} from "@/data/children";
import { getAdminClient } from "@/utils/supabase/admin";

export const metadata: Metadata = {
  title: "Activá tu cuenta · OpenDayCare",
};

const shellClasses =
  "min-h-screen flex items-center justify-center bg-[#FBF4EC] p-[24px] md:p-[40px]";
const headingClasses =
  "font-display font-semibold text-[32px] leading-[1.15] text-[#3F362E] mb-[8px]";

const brandIcon = (
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
);

function ErrorState({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className={shellClasses}>
      <div className="w-full max-w-[440px]">
        {brandIcon}
        <h1 className={headingClasses}>{title}</h1>
        <p className="text-[#94887B] text-[15.5px] leading-[1.55] mb-[26px]">
          {message}
        </p>
        <div className="flex items-center gap-[10px]">
          <Link
            href="/login"
            className="flex-1 text-center p-[14px] rounded-[14px] bg-[linear-gradient(180deg,#F4977E,#EE8164)] text-white font-extrabold text-[15px] shadow-[0_10px_22px_-8px_rgba(238,129,100,.7)]"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/"
            className="flex-1 text-center p-[14px] rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white text-[#6E6359] font-extrabold text-[15px]"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

const isExpiredInvitation = (expiresAt: string) =>
  new Date(expiresAt).getTime() < Date.now();

export default async function ActivateAccountPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { code: codeParam } = await searchParams;
  const code =
    typeof codeParam === "string" ? codeParam.trim().toUpperCase() : "";

  if (!code) {
    return (
      <ErrorState
        title="Abrí el link de tu email"
        message="No encontramos tu código de invitación. Usá el link que le enviamos por correo con el código para activar tu cuenta."
      />
    );
  }

  let invitationData:
    | {
        id: string;
        full_name: string;
        email: string;
        code: string;
        status: string;
        expires_at: string;
        child_id: string;
        relationship: string;
      }
    | null = null;

  try {
    const admin = getAdminClient();
    const { data } = await admin
      .from("invitations")
      .select(
        "id, full_name, email, code, status, expires_at, child_id, relationship",
      )
      .ilike("code", code)
      .maybeSingle();
    invitationData = data;
  } catch {
    return (
      <ErrorState
        title="Algo salió mal"
        message="No pudimos verificar tu invitación en este momento. Intentá de nuevo en unos minutos."
      />
    );
  }

  if (!invitationData) {
    return (
      <ErrorState
        title="Código de invitación inválido"
        message="El código no existe o está mal escrito. Revisá el correo de invitación o pedí una nueva a la guardería."
      />
    );
  }

  if (invitationData.status === "accepted") {
    return (
      <ErrorState
        title="Este código ya fue utilizado"
        message="La invitación ya fue aceptada. Podés iniciar sesión con tu email y contraseña."
      />
    );
  }

  if (invitationData.status !== "pending") {
    return (
      <ErrorState
        title="Código no disponible"
        message="Esta invitación ya no está activa. Pedí una nueva invitación a la guardería."
      />
    );
  }

  if (isExpiredInvitation(invitationData.expires_at)) {
    return (
      <ErrorState
        title="El código venció"
        message="Tu invitación expiró (los códigos duran 7 días). Pedí una nueva invitación a la guardería."
      />
    );
  }

  const admin = getAdminClient();
  const { data: child } = await admin
    .from("children")
    .select("full_name, rooms(name)")
    .eq("id", invitationData.child_id)
    .eq("status", "active")
    .maybeSingle();

  if (!child) {
    return (
      <ErrorState
        title="Código no disponible"
        message="Esta invitación ya no está activa. Pedí una nueva invitación a la guardería."
      />
    );
  }

  const room = child.rooms as { name: string } | { name: string }[] | null;
  const roomName = Array.isArray(room)
    ? (room[0]?.name ?? "")
    : (room?.name ?? "");
  const childFullName = child.full_name;
  const avatar = childAvatarStyle(childFullName);

  return (
    <div className={shellClasses}>
      <div className="w-full max-w-[440px]">
        {brandIcon}
        <h1 className={headingClasses}>Te invitaron a OpenDayCare</h1>
        <p className="text-[#94887B] text-[15.5px] leading-[1.55] mb-[26px]">
          Activá tu cuenta con el código de la invitación para seguir el día de{" "}
          {childFullName.split(" ")[0]}.
        </p>

        <ActivateAccountForm
          code={invitationData.code}
          email={invitationData.email}
          fullName={invitationData.full_name}
          childName={childFullName}
          roomName={roomName || "Sala"}
          childAvatarBg={avatar.bg}
          childAvatarColor={avatar.color}
        />
      </div>
    </div>
  );
}
