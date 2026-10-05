"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { archiveChild, createChild, updateChild } from "@/lib/children";

const ALLERGY_TAGS = [
  "peanut",
  "lactose",
  "gluten",
  "egg",
  "soy",
  "shellfish",
  "tree_nuts",
  "fish",
] as const;

export type ChildFormState = {
  error?: string;
} | null;

const validateChildForm = (formData: FormData) => {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const birthDate = String(formData.get("birthDate") ?? "").trim();
  const enrolledAtRaw = String(formData.get("enrolledAt") ?? "").trim();
  const roomId = String(formData.get("roomId") ?? "").trim();
  const medicalNotes = String(formData.get("medicalNotes") ?? "").trim();
  const photoConsent = formData.get("photoConsent") === "on";

  if (!fullName) {
    return { error: "Ingresá el nombre completo del niño." } as const;
  }

  const birthDateParsed = new Date(`${birthDate}T00:00:00`);
  if (!birthDate || Number.isNaN(birthDateParsed.getTime())) {
    return { error: "Ingresá una fecha de nacimiento válida." } as const;
  }

  const today = new Date();
  today.setHours(23, 59, 59, 999);
  if (birthDateParsed > today) {
    return { error: "La fecha de nacimiento no puede ser futura." } as const;
  }

  if (!roomId) {
    return { error: "Seleccioná una sala." } as const;
  }

  const enrolledAt =
    enrolledAtRaw || new Date().toISOString().slice(0, 10);

  const enrolledAtParsed = new Date(`${enrolledAt}T00:00:00`);
  if (Number.isNaN(enrolledAtParsed.getTime())) {
    return { error: "Ingresá una fecha de alta válida." } as const;
  }

  const allergyTags = ALLERGY_TAGS.filter((tag) => formData.get(`allergy_${tag}`) === "on");

  return {
    data: {
      roomId,
      fullName,
      birthDate,
      enrolledAt,
      medicalNotes: medicalNotes || null,
      allergyTags,
      photoConsent,
    },
  } as const;
};

export const createChildAction = async (
  state: ChildFormState,
  formData: FormData,
): Promise<ChildFormState> => {
  const result = validateChildForm(formData);

  if ("error" in result) {
    return { error: result.error };
  }

  try {
    await createChild(result.data);
  } catch {
    return { error: "No se pudo crear el niño. Intentá de nuevo." };
  }

  revalidatePath("/kids");
  redirect("/kids");
};

export const updateChildAction = async (
  state: ChildFormState,
  formData: FormData,
): Promise<ChildFormState> => {
  const childId = String(formData.get("childId") ?? "");

  if (!childId) {
    return { error: "Niño no encontrado." };
  }

  const result = validateChildForm(formData);

  if ("error" in result) {
    return { error: result.error };
  }

  try {
    await updateChild(childId, result.data);
  } catch {
    return { error: "No se pudo actualizar el niño. Intentá de nuevo." };
  }

  revalidatePath(`/kids/${childId}`);
  revalidatePath("/kids");
  redirect("/kids");
};

export const archiveChildAction = async (
  state: ChildFormState,
  formData: FormData,
): Promise<ChildFormState> => {
  const childId = String(formData.get("childId") ?? "");

  if (!childId) {
    return { error: "Niño no encontrado." };
  }

  try {
    await archiveChild(childId);
  } catch {
    return { error: "No se pudo archivar el niño. Intentá de nuevo." };
  }

  revalidatePath("/kids");
  redirect("/kids");
};
