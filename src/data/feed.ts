export type PostType =
  | "meal"
  | "nap"
  | "activity"
  | "achievement"
  | "mood"
  | "photo"
  | "announcement";

export type PostAuthor =
  | {
      kind: "child";
      name: string;
      initial: string;
      avatarBg: string;
      avatarColor: string;
    }
  | { kind: "announcement" };

export type Post = {
  id: string;
  author: PostAuthor;
  time: string;              // "14:20"
  type: PostType;            // defines the badge
  recipient: string;         // "familia de Mateo" | "toda la sala"
  body: string;              // post text (Spanish)
  photo?: { label: string }; // dashed placeholder, only in "activity"
  likes: number;
  comments: number;
};

export const postTypeLabel: Record<PostType, string> = {
  meal: "Comida",
  nap: "Siesta",
  activity: "Actividad",
  achievement: "Logro",
  mood: "Ánimo",
  photo: "Foto",
  announcement: "Anuncio",
};

export const postTypePill: Record<PostType, { bg: string; color: string }> = {
  meal: { bg: "#9A7B1E", color: "#FFFFFF" },
  nap: { bg: "#E7DCF6", color: "#7B5FC0" },
  activity: { bg: "#2E89A6", color: "#FFFFFF" },
  achievement: { bg: "#CFEBD8", color: "#3E9B6C" },
  mood: { bg: "#F9D2DE", color: "#C56486" },
  photo: { bg: "#FBD8CC", color: "#D9684A" },
  announcement: { bg: "#CCD8F4", color: "#4E72C8" },
};

export const posts: Post[] = [
  {
    id: "post-achievement",
    author: {
      kind: "child",
      name: "Mateo",
      initial: "M",
      avatarBg: "#A9D9E8",
      avatarColor: "#1F7A93",
    },
    time: "14:20",
    type: "achievement",
    recipient: "familia de Mateo",
    body: "¡Usó el orinal solito por primera vez! Estaba feliz de contárselo a todos. Un gran paso.",
    likes: 3,
    comments: 1,
  },
  {
    id: "post-activity",
    author: {
      kind: "child",
      name: "Mateo",
      initial: "M",
      avatarBg: "#A9D9E8",
      avatarColor: "#1F7A93",
    },
    time: "09:40",
    type: "activity",
    recipient: "familia de Mateo",
    body: "Pintamos con témperas esta mañana. Mateo eligió el azul para todo y se concentró un montón mezclando colores.",
    photo: { label: "Foto · pintando con témperas" },
    likes: 5,
    comments: 2,
  },
  {
    id: "post-announcement",
    author: { kind: "announcement" },
    time: "07:50",
    type: "announcement",
    recipient: "toda la sala",
    body: "El viernes salimos al parque por la mañana. Recuerden mandar gorra y una botellita de agua.",
    likes: 8,
    comments: 0,
  },
];

export const currentUser = {
  name: "Caro Giménez",
  role: "Maestra · Soles",
  initial: "C",
};

export type NavIcon = "home" | "kids" | "bell" | "user";

export type NavItemId = "feed" | "kids" | "notices" | "account";

export type NavItem = {
  id: NavItemId;
  label: string;
  href: string;
  icon: NavIcon;
};

export const navItems: NavItem[] = [
  { id: "feed", label: "Feed", href: "/", icon: "home" },
  { id: "kids", label: "Niños", href: "/kids", icon: "kids" },
  { id: "notices", label: "Avisos", href: "#", icon: "bell" },
  { id: "account", label: "Mi cuenta", href: "#", icon: "user" },
];

export const badgeByType: Record<
  PostType,
  { label: string; bg: string; color: string }
> = {
  meal: { label: "COMIDA", bg: "#F4DC8E", color: "#9A7B1E" },
  nap: { label: "SIESTA", bg: "#E7DCF6", color: "#7B5FC0" },
  activity: { label: "ACTIVIDAD", bg: "#C7E7F1", color: "#2E89A6" },
  achievement: { label: "LOGRO", bg: "#CFEBD8", color: "#3E9B6C" },
  mood: { label: "ÁNIMO", bg: "#F9D2DE", color: "#C56486" },
  photo: { label: "FOTO", bg: "#FBD8CC", color: "#D9684A" },
  announcement: { label: "ANUNCIO", bg: "#CCD8F4", color: "#4E72C8" },
};
