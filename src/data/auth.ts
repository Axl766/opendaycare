export type LoginDefaults = {
  email: string;
};

export type BrandPanel = {
  headline: string;
  tagline: string;
  footer: string;
};

export type Invitation = {
  childName: string;
  room: string;
  childInitial: string;
  childAvatarBg: string;
  childAvatarColor: string;
  code: string;
  parentEmail: string;
  consentText: string;
};

// Login form — pre-loaded values, replica visual de la referencia
export const loginDefaults: LoginDefaults = {
  email: "caro@opendaycare.com",
};

// Left brand panel copy (login, desktop only)
export const brandPanel: BrandPanel = {
  headline: "El día de cada niño,|compartido con su familia.", // two lines
  tagline:
    "Publicá momentos, gestioná las salas y mantené a las familias cerca, desde un solo lugar.",
  footer: "🌿 Guardería Sala Soles",
};

// Activation invitation — activar-cuenta.dc.html
export const invitation: Invitation = {
  childName: "Mateo",
  room: "Sala Soles",
  childInitial: "M",
  childAvatarBg: "#A9D9E8",
  childAvatarColor: "#1F7A93",
  code: "7K4P9",
  parentEmail: "lucia.fernandez@gmail.com",
  consentText:
    "Autorizo a la guardería a tomar y compartir fotos de mi hijo dentro de la app.",
};
