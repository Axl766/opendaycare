import "server-only";
import { cookies } from "next/headers";
import { unauthorized } from "next/navigation";
import type { UserRole } from "@/data/auth";
import { createClient } from "@/utils/supabase/server";

export type Session = {
  userId: string;
  email: string;
  fullName: string;
  role: UserRole;
};

export const verifySession = async (): Promise<Session> => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    unauthorized();
  }

  const { data: profile, error } = await supabase
    .from("users")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    unauthorized();
  }

  return {
    userId: user.id,
    email: user.email ?? "",
    fullName: profile.full_name,
    role: profile.role,
  };
};
