import type { NextRequest } from "next/server";
import {
  createInvitationAndSendEmail,
  invitationErrorMessages,
  requireStaffSession,
  type RelationshipValue,
} from "@/lib/invitations";

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const RELATIONSHIP_VALUES: RelationshipValue[] = [
  "father",
  "mother",
  "guardian",
];

export async function POST(request: NextRequest) {
  const staffCheck = await requireStaffSession();

  if ("error" in staffCheck) {
    const status = staffCheck.error === "forbidden" ? 403 : 401;
    return Response.json(
      { error: "No tenés permiso para enviar invitaciones." },
      { status },
    );
  }

  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Cuerpo inválido." }, { status: 400 });
  }

  const childId = String(body.child_id ?? "").trim();
  const fullName = String(body.full_name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const relationship = String(body.relationship ?? "") as RelationshipValue;

  if (!childId || !fullName) {
    return Response.json(
      { error: "Faltan datos de la invitación." },
      { status: 400 },
    );
  }

  if (!isValidEmail(email)) {
    return Response.json({ error: "Email inválido." }, { status: 400 });
  }

  if (!RELATIONSHIP_VALUES.includes(relationship)) {
    return Response.json({ error: "Parentesco inválido." }, { status: 400 });
  }

  const result = await createInvitationAndSendEmail({
    childId,
    fullName,
    email,
    relationship,
    invitedBy: staffCheck.session.userId,
  });

  if ("error" in result) {
    return Response.json(
      { error: invitationErrorMessages[result.error] },
      { status: 400 },
    );
  }

  await new Promise((resolve) => setTimeout(resolve, 0));

  return Response.json({
    success: true,
    invitation: {
      childId,
      fullName,
      email,
      relationship,
    },
  });
}
