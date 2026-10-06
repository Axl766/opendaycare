import "server-only";
import { cookies } from "next/headers";
import { randomInt } from "node:crypto";
import type { ParentRole } from "@/data/children";
import { sendInvitationEmail } from "@/lib/resend";
import { createClient } from "@/utils/supabase/server";

export type RelationshipValue = "father" | "mother" | "guardian";

export const relationshipByUiRole: Record<ParentRole, RelationshipValue> = {
  mom: "mother",
  dad: "father",
  tutor: "guardian",
};

const CODE_ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const CODE_LENGTH = 5;
const INVITATION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export const generateInvitationCode = (): string => {
  const alphabetSize = CODE_ALPHABET.length;
  const max = alphabetSize ** CODE_LENGTH;
  let value = randomInt(0, max);
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    code = CODE_ALPHABET[value % alphabetSize] + code;
    value = Math.floor(value / alphabetSize);
  }
  return code;
};

export type InvitationInput = {
  childId: string;
  fullName: string;
  email: string;
  relationship: RelationshipValue;
  invitedBy: string;
};

export type InvitationResult =
  | { code: string }
  | { error: "child_not_found" | "invitation_already_pending" | "code_generation_failed" | "email_send_failed" };

export const createInvitationAndSendEmail = async (
  input: InvitationInput,
): Promise<InvitationResult> => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: child } = await supabase
    .from("children")
    .select("id, full_name")
    .eq("id", input.childId)
    .eq("status", "active")
    .maybeSingle();

  if (!child) {
    return { error: "child_not_found" };
  }

  const { data: pendingInvitation } = await supabase
    .from("invitations")
    .select("id")
    .eq("email", input.email)
    .eq("child_id", input.childId)
    .eq("status", "pending")
    .maybeSingle();

  if (pendingInvitation) {
    return { error: "invitation_already_pending" };
  }

  const expiresAt = new Date(Date.now() + INVITATION_TTL_MS).toISOString();

  let invitationId: string | null = null;
  let code = "";

  for (let attempt = 0; attempt < 3 && !invitationId; attempt++) {
    code = generateInvitationCode();
    const { data, error } = await supabase
      .from("invitations")
      .insert({
        child_id: input.childId,
        invited_by: input.invitedBy,
        full_name: input.fullName,
        email: input.email,
        relationship: input.relationship,
        code,
        status: "pending",
        expires_at: expiresAt,
      })
      .select("id")
      .single();

    if (!error) {
      invitationId = data.id;
      break;
    }
    if (error.code !== "23505") {
      return { error: "code_generation_failed" };
    }
  }

  if (!invitationId) {
    return { error: "code_generation_failed" };
  }

  try {
    await sendInvitationEmail({
      to: input.email,
      childName: child.full_name,
      code,
      expiresAt,
    });
  } catch {
    return { error: "email_send_failed" };
  }

  return { code };
};

export const invitationErrorMessages: Record<Extract<InvitationResult, { error: string }>["error"], string> = {
  child_not_found: "Niño no encontrado.",
  invitation_already_pending:
    "Ya existe una invitación pendiente para este email.",
  code_generation_failed:
    "No se pudo generar la invitación. Intentá de nuevo.",
  email_send_failed:
    "No se pudo enviar el correo. Intentá de nuevo en unos minutos.",
};

export type StaffCheck =
  | { session: { userId: string; email: string; fullName: string; role: "staff" | "admin" } }
  | { error: "unauthenticated" | "forbidden" };

export const requireStaffSession = async (): Promise<StaffCheck> => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "unauthenticated" };
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return { error: "unauthenticated" };
  }

  if (profile.role !== "staff" && profile.role !== "admin") {
    return { error: "forbidden" };
  }

  return {
    session: {
      userId: user.id,
      email: user.email ?? "",
      fullName: profile.full_name,
      role: profile.role,
    },
  };
};
