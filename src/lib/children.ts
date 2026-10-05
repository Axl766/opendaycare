import "server-only";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export type Room = {
  id: string;
  name: string;
};

export type Child = {
  id: string;
  roomId: string;
  roomName: string;
  fullName: string;
  birthDate: string;
  enrolledAt: string;
  medicalNotes: string | null;
  allergyTags: string[];
  photoConsent: boolean;
};

export type GetChildrenFilters = {
  roomFilter?: string | null;
  search?: string | null;
};

export type NewChildData = {
  roomId: string;
  fullName: string;
  birthDate: string;
  enrolledAt: string;
  medicalNotes: string | null;
  allergyTags: string[];
  photoConsent: boolean;
};

export type UpdateChildData = Partial<NewChildData>;

const CHILD_COLUMNS =
  "id, room_id, full_name, birth_date, enrolled_at, medical_notes, allergy_tags, photo_consent, rooms(name)";

const mapChild = (row: Record<string, unknown>): Child => {
  const room = row.rooms as { name: string } | { name: string }[] | null;
  const roomName = Array.isArray(room) ? (room[0]?.name ?? "") : (room?.name ?? "");

  return {
    id: row.id as string,
    roomId: row.room_id as string,
    roomName,
    fullName: row.full_name as string,
    birthDate: row.birth_date as string,
    enrolledAt: row.enrolled_at as string,
    medicalNotes: (row.medical_notes as string | null) ?? null,
    allergyTags: (row.allergy_tags as string[] | null) ?? [],
    photoConsent: (row.photo_consent as boolean | null) ?? true,
  };
};

const getParentCount = async (childIds: string[]): Promise<Map<string, number>> => {
  if (childIds.length === 0) return new Map();

  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data, error } = await supabase
      .from("parent_children")
      .select("child_id")
      .in("child_id", childIds);

    if (error) throw error;

    const counts = new Map<string, number>();
    for (const row of data) {
      counts.set(row.child_id, (counts.get(row.child_id) ?? 0) + 1);
    }
    return counts;
  } catch {
    return new Map();
  }
};

export const getRooms = async (): Promise<Room[]> => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("rooms")
    .select("id, name")
    .order("created_at");

  if (error) throw error;

  return data;
};

export const getChildren = async ({
  roomFilter,
  search,
}: GetChildrenFilters = {}): Promise<(Child & { parentCount: number })[]> => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  let query = supabase
    .from("children")
    .select(CHILD_COLUMNS)
    .eq("status", "active")
    .order("full_name", { ascending: true });

  if (roomFilter) {
    query = query.eq("room_id", roomFilter);
  }

  if (search) {
    query = query.ilike("full_name", `%${search}%`);
  }

  const { data, error } = await query;

  if (error) throw error;

  const mapped = data.map(mapChild);
  const parentCounts = await getParentCount(mapped.map((child) => child.id));

  return mapped.map((child) => ({
    ...child,
    parentCount: parentCounts.get(child.id) ?? 0,
  }));
};

export const getChildById = async (id: string): Promise<Child | null> => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("children")
    .select(CHILD_COLUMNS)
    .eq("id", id)
    .eq("status", "active")
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return mapChild(data);
};

export const createChild = async (data: NewChildData): Promise<string> => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: rows, error } = await supabase
    .from("children")
    .insert({
      room_id: data.roomId,
      full_name: data.fullName,
      birth_date: data.birthDate,
      enrolled_at: data.enrolledAt,
      medical_notes: data.medicalNotes,
      allergy_tags: data.allergyTags,
      photo_consent: data.photoConsent,
    })
    .select("id")
    .single();

  if (error) throw error;

  return rows.id;
};

export const updateChild = async (
  id: string,
  data: UpdateChildData,
): Promise<void> => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (data.roomId !== undefined) updates.room_id = data.roomId;
  if (data.fullName !== undefined) updates.full_name = data.fullName;
  if (data.birthDate !== undefined) updates.birth_date = data.birthDate;
  if (data.enrolledAt !== undefined) updates.enrolled_at = data.enrolledAt;
  if (data.medicalNotes !== undefined) updates.medical_notes = data.medicalNotes;
  if (data.allergyTags !== undefined) updates.allergy_tags = data.allergyTags;
  if (data.photoConsent !== undefined) updates.photo_consent = data.photoConsent;

  const { error } = await supabase
    .from("children")
    .update(updates)
    .eq("id", id);

  if (error) throw error;
};

export const archiveChild = async (id: string): Promise<void> => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase
    .from("children")
    .update({ status: "archived", updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
};
