export type ParentRole = "mom" | "dad" | "tutor";

export type ParentStatus = "active" | "pending";

export type LinkedParent = {
  name: string;
  initial: string;
  avatarBg: string;
  role: ParentRole;
  status: ParentStatus;
};

export type ChildAllergy = {
  pill: string;
  notes: string;
};

export type Child = {
  id: string;
  name: string;
  initial: string;
  avatarBg: string;
  avatarColor: string;
  ageYears: number;
  room: string;
  birthDate: string;
  enrollment: string;
  allergy?: ChildAllergy;
  parents: LinkedParent[];
};

export const children: Child[] = [
  {
    id: "mateo-fernandez",
    name: "Mateo Fernández",
    initial: "M",
    avatarBg: "#A9D9E8",
    avatarColor: "#1F7A93",
    ageYears: 3,
    room: "Soles",
    birthDate: "12 mar 2022",
    enrollment: "feb 2025",
    allergy: {
      pill: "MANÍ",
      notes:
        "Alergia al maní. Evitar frutos secos. Lleva inhalador en la mochila.",
    },
    parents: [
      {
        name: "Lucía Fernández",
        initial: "L",
        avatarBg: "#C9B6E8",
        role: "mom",
        status: "active",
      },
      {
        name: "Diego Fernández",
        initial: "D",
        avatarBg: "#A9C7E8",
        role: "dad",
        status: "pending",
      },
    ],
  },
  {
    id: "sofia-mendez",
    name: "Sofía Méndez",
    initial: "S",
    avatarBg: "#F4B8CC",
    avatarColor: "#C44A7A",
    ageYears: 2,
    room: "Soles",
    birthDate: "05 jul 2023",
    enrollment: "mar 2025",
    parents: [
      {
        name: "Mariana Méndez",
        initial: "M",
        avatarBg: "#A9C7E8",
        role: "mom",
        status: "active",
      },
    ],
  },
  {
    id: "benjamin-ruiz",
    name: "Benjamín Ruiz",
    initial: "B",
    avatarBg: "#B9DEC4",
    avatarColor: "#3E8B62",
    ageYears: 3,
    room: "Soles",
    birthDate: "28 sep 2022",
    enrollment: "feb 2025",
    parents: [
      {
        name: "Carla Ruiz",
        initial: "C",
        avatarBg: "#C9B6E8",
        role: "mom",
        status: "active",
      },
      {
        name: "Andrés Ruiz",
        initial: "A",
        avatarBg: "#F4DC8E",
        role: "dad",
        status: "pending",
      },
    ],
  },
  {
    id: "valentina-soto",
    name: "Valentina Soto",
    initial: "V",
    avatarBg: "#F4DC8E",
    avatarColor: "#9A7B1E",
    ageYears: 2,
    room: "Soles",
    birthDate: "14 ene 2023",
    enrollment: "abr 2025",
    parents: [],
  },
  {
    id: "tomas-diaz",
    name: "Tomás Díaz",
    initial: "T",
    avatarBg: "#C9B6E8",
    avatarColor: "#7B5FC0",
    ageYears: 3,
    room: "Soles",
    birthDate: "02 jun 2022",
    enrollment: "mar 2025",
    allergy: {
      pill: "LACTOSA",
      notes:
        "Alergia a la lactosa. Se sustituyen leche y derivados por opciones vegetales en las colaciones.",
    },
    parents: [
      {
        name: "Paula Díaz",
        initial: "P",
        avatarBg: "#B9DEC4",
        role: "mom",
        status: "active",
      },
    ],
  },
  {
    id: "emma-castro",
    name: "Emma Castro",
    initial: "E",
    avatarBg: "#F4B8CC",
    avatarColor: "#C44A7A",
    ageYears: 2,
    room: "Soles",
    birthDate: "19 nov 2023",
    enrollment: "sep 2025",
    parents: [
      {
        name: "Julián Castro",
        initial: "J",
        avatarBg: "#A9D9E8",
        role: "dad",
        status: "active",
      },
    ],
  },
  {
    id: "lucas-romero",
    name: "Lucas Romero",
    initial: "L",
    avatarBg: "#A9D9E8",
    avatarColor: "#1F7A93",
    ageYears: 3,
    room: "Soles",
    birthDate: "07 abr 2022",
    enrollment: "feb 2025",
    parents: [
      {
        name: "Renata Romero",
        initial: "R",
        avatarBg: "#F4B8CC",
        role: "mom",
        status: "active",
      },
    ],
  },
  {
    id: "olivia-vega",
    name: "Olivia Vega",
    initial: "O",
    avatarBg: "#B9DEC4",
    avatarColor: "#3E8B62",
    ageYears: 2,
    room: "Soles",
    birthDate: "25 ago 2023",
    enrollment: "sep 2025",
    parents: [
      {
        name: "Martín Vega",
        initial: "M",
        avatarBg: "#A9C7E8",
        role: "dad",
        status: "active",
      },
    ],
  },
];

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

export const rooms: string[] = ["Soles", "Lunas", "Estrellas"];
