"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ParentRole } from "@/data/children";
import {
  createInvitationAndSendEmail,
  invitationErrorMessages,
  relationshipByUiRole,
  requireStaffSession,
} from "@/lib/invitations";
import { getAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

export type LinkParentState = {
  error?: string;
  successEmail?: string;
  fullName?: string;
  relationship?: ParentRole;
} | null;

export type ActivateAccountState = {
  error?: string;
} | null;

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const isParentRelationship = (value: string): value is ParentRole =>
  value === "mom" || value === "dad" || value === "tutor";

export const sendInvitation = async (
  _state: LinkParentState,
  formData: FormData,
): Promise<LinkParentState> => {
  const childId = String(formData.get("childId") ?? "").trim();
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const relationshipRaw = String(formData.get("relationship") ?? "mom");

  if (!fullName) {
    return { error: "Ingresá el nombre del padre o madre." };
  }
  if (!isValidEmail(email)) {
    return { error: "Ingresá un correo válido." };
  }
  if (!childId) {
    return { error: "Niño no encontrado." };
  }
  if (!isParentRelationship(relationshipRaw)) {
    return { error: "Parentesco inválido." };
  }

  const staffCheck = await requireStaffSession();

  if ("error" in staffCheck) {
    return { error: "No tenés permiso para enviar invitaciones." };
  }

  const result = await createInvitationAndSendEmail({
    childId,
    fullName,
    email,
    relationship: relationshipByUiRole[relationshipRaw],
    invitedBy: staffCheck.session.userId,
  });

  if ("error" in result) {
    return { error: invitationErrorMessages[result.error] };
  }

  return {
    successEmail: email,
    fullName,
    relationship: relationshipRaw,
  };
};

export const activateAccount = async (
  _state: ActivateAccountState,
  formData: FormData,
): Promise<ActivateAccountState> => {
  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  const password = String(formData.get("password") ?? "");
  const consent = formData.get("consent") === "on";

  if (!code) {
    return { error: "Ingresá el código de invitación." };
  }
  if (password.length < 8) {
    return { error: "La contraseña debe tener al menos 8 caracteres." };
  }
  if (!consent) {
    return { error: "Necesitamos tu autorización para compartir fotos." };
  }

  const admin = getAdminClient();

  const { data: invitation } = await admin
    .from("invitations")
    .select(
      "id, child_id, full_name, email, relationship, status, expires_at",
    )
    .ilike("code", code)
    .maybeSingle();

  if (!invitation) {
    return { error: "El código de invitación no es válido." };
  }

  if (invitation.status === "accepted") {
    return { error: "Este código ya fue utilizado." };
  }

  if (invitation.status !== "pending") {
    return { error: "Este código ya no está disponible." };
  }

  if (new Date(invitation.expires_at).getTime() < Date.now()) {
    return {
      error: "El código venció. Pedí una nueva invitación a la guardería.",
    };
  }

  const email = invitation.email.toLowerCase();

  const { data: existingUsers } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  const existingUser = existingUsers?.users?.find(
    (user) => (user.email ?? "").toLowerCase() === email,
  );

  const createLinkAndAccept = async (parentId: string): Promise<ActivateAccountState> => {
    const { error: linkError } = await admin.from("parent_children").insert({
      parent_id: parentId,
      child_id: invitation.child_id,
      relationship: invitation.relationship,
    });

    if (linkError && linkError.code === "23505") {
      return { error: "Este email ya está vinculado a ese niño." };
    }
    if (linkError) {
      return { error: "No se pudo completar la vinculación. Intentá de nuevo." };
    }

    const { error: acceptError } = await admin
      .from("invitations")
      .update({ status: "accepted", accepted_at: new Date().toISOString() })
      .eq("id", invitation.id);

    if (acceptError) {
      return { error: "No se pudo completar la activación. Intentá de nuevo." };
    }

    return null;
  };

  if (existingUser) {
    const state = await createLinkAndAccept(existingUser.id);
    if (state?.error) {
      return state;
    }
    redirect("/");
  }

  const { data: newUser, error: createUserError } = await admin.auth.admin
    .createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: invitation.full_name,
        role: "parent",
        child_id: invitation.child_id,
        relationship: invitation.relationship,
      },
    });

  if (createUserError) {
    if (createUserError.message.toLowerCase().includes("already")) {
      return {
        error: "Ese email ya tiene una cuenta. Iniciá sesión para vincularla.",
      };
    }
    return { error: "No se pudo crear la cuenta. Intentá de nuevo." };
  }

  if (!newUser) {
    return { error: "No se pudo crear la cuenta. Intentá de nuevo." };
  }

  const state = await createLinkAndAccept(newUser.user.id);
  if (state?.error) {
    return state;
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  await supabase.auth.signInWithPassword({ email, password });

  redirect("/");
};
