export type ParentRole = "mom" | "dad" | "tutor";

export type ParentStatus = "active" | "pending";

export type LinkedParent = {
  name: string;
  initial: string;
  avatarBg: string;
  role: ParentRole;
  status: ParentStatus;
};

export const parentRoleLabel: Record<ParentRole, string> = {
  mom: "Mamá",
  dad: "Papá",
  tutor: "Tutor/a",
};

export const parentStatus: Record<
  ParentStatus,
  { label: string; detail: string; bg: string; color: string }
> = {
  active: {
    label: "ACTIVA",
    detail: "activa",
    bg: "#CFEBD8",
    color: "#3E9B6C",
  },
  pending: {
    label: "PENDIENTE",
    detail: "invitación enviada",
    bg: "#F7E7A6",
    color: "#9A7B1E",
  },
};

export const unlinkedPill = { label: "VINCULAR", bg: "#F9D2DE", color: "#C56486" };

export const allergyPillStyle = { bg: "#FBD8CC", color: "#D9684A" };

export type AllergyTag =
  | "peanut"
  | "lactose"
  | "gluten"
  | "egg"
  | "soy"
  | "shellfish"
  | "tree_nuts"
  | "fish";

export const allergyOptions: { value: AllergyTag; label: string }[] = [
  { value: "peanut", label: "MANÍ" },
  { value: "lactose", label: "LACTOSA" },
  { value: "gluten", label: "GLUTEN" },
  { value: "egg", label: "HUEVO" },
  { value: "soy", label: "SOYA" },
  { value: "shellfish", label: "MARISCOS" },
  { value: "tree_nuts", label: "FRUTOS SECOS" },
  { value: "fish", label: "PESCADO" },
];

export const allergyLabelByValue: Record<AllergyTag, string> = {
  peanut: "MANÍ",
  lactose: "LACTOSA",
  gluten: "GLUTEN",
  egg: "HUEVO",
  soy: "SOYA",
  shellfish: "MARISCOS",
  tree_nuts: "FRUTOS SECOS",
  fish: "PESCADO",
};

const avatarPalettes = [
  { bg: "#A9D9E8", color: "#1F7A93" },
  { bg: "#F4B8CC", color: "#C44A7A" },
  { bg: "#B9DEC4", color: "#3E8B62" },
  { bg: "#F4DC8E", color: "#9A7B1E" },
  { bg: "#C9B6E8", color: "#7B5FC0" },
  { bg: "#A9C7E8", color: "#3F5694" },
];

export const childAvatarStyle = (fullName: string) => {
  const key = fullName.trim().slice(0, 3).toLowerCase();
  let hash = 0;
  for (const char of key) {
    hash += char.charCodeAt(0);
  }
  return avatarPalettes[hash % avatarPalettes.length];
};

export const getChildInitial = (fullName: string) =>
  fullName.trim().charAt(0).toUpperCase();

export const calcAgeYears = (birthDate: string): number => {
  const birth = new Date(`${birthDate}T00:00:00`);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age -= 1;
  }
  return Math.max(age, 0);
};

const monthFormatter = new Intl.DateTimeFormat("es-AR", { month: "short" });

export const formatFullDate = (isoDate: string): string => {
  const date = new Date(`${isoDate}T00:00:00`);
  return `${String(date.getDate()).padStart(2, "0")} ${monthFormatter.format(date)} ${date.getFullYear()}`;
};

export const formatMonthYear = (isoDate: string): string => {
  const date = new Date(`${isoDate}T00:00:00`);
  return `${monthFormatter.format(date)} ${date.getFullYear()}`;
};
