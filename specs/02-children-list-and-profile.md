# SPEC 02 — Niños: listado y perfil (réplica visual)

> **Estado:** Implemented
> **Depende de:** SPEC 01 (sidebar, top bar, fuentes y base de estilo)
> **Fecha:** 2026-09-10
> **Objetivo:** Implementar las plantillas `ninos.dc.html` y `perfil-nino.dc.html` como `/kids` (listado con buscador funcional) y `/kids/[childId]` (perfil dinámico por niño), con navegación real entre pantallas existentes y la misma adaptación móvil del spec 01, sin autenticación ni base de datos.

## Alcance

**Dentro:**

- Página `/kids`: header "GESTIÓN" / "Niños" + botón "Agregar niño" (`href="#"`), buscador funcional, divisor "SALA SOLES · 8 niños" y grid de 2 columnas con los 8 niños de la referencia.
- Página `/kids/[childId]`: "Volver a Niños", cabecera (avatar 84px + nombre + botón "Editar" `href="#"`), tarjeta "Alergias y notas" (solo si el niño tiene alergia), ficha (Fecha de nacimiento / Sala / Ingreso), botón "Resumen del día" (`href="#"`) y "PADRES VINCULADOS" con pills ACTIVA/PENDIENTE y "Vincular otro padre" (`href="#"`).
- Datos tipados de los 8 niños en `src/data/children.ts`; los de Mateo idénticos a la referencia, el resto inventado plausible respetando conteos de padres y pills de la referencia.
- Navegación real entre pantallas existentes; refactor del sidebar: `navItems` con `href` reales y sin `active` en los datos, `Sidebar`/`SidebarContent`/`MobileTopBar` reciben `activeNavId`.
- Buscador funcional en cliente: filtra las tarjetas por nombre (único estado interactivo del spec).
- Adaptación móvil <768px igual al spec 01: top bar + drawer, grid a 1 columna, perfil apilado.
- Estilos con Tailwind v4 y valores arbitrarios exactos de las referencias.

**Fuera de alcance (para specs futuros):**

- Pantallas enlazadas inexistentes: agregar-nino, resumen-dia, vincular-padre, login.
- Editar/vincular de verdad, autenticación, base de datos, persistencia.
- Interactividad más allá del buscador.
- Empty state del buscador sin resultados (la referencia no lo define; el grid queda vacío).

## Modelo de datos

Archivo nuevo `src/data/children.ts` — identificadores en inglés, strings visibles en español:

```ts
export type ParentRole = "mom" | "dad";
export type ParentStatus = "active" | "pending";

export type LinkedParent = {
  name: string; // "Lucía Fernández"
  initial: string; // "L"
  avatarBg: string; // "#C9B6E8"
  role: ParentRole;
  status: ParentStatus;
};

export type ChildAllergy = {
  pill: string; // "MANÍ" | "LACTOSA"
  notes: string; // texto de la tarjeta del perfil
};

export type Child = {
  id: string; // slug de la URL: "mateo-fernandez"
  name: string; // "Mateo Fernández"
  initial: string;
  avatarBg: string;
  avatarColor: string;
  ageYears: number; // 3
  room: string; // "Soles"
  birthDate: string; // "12 mar 2022"
  enrollment: string; // "feb 2025"
  allergy?: ChildAllergy;
  parents: LinkedParent[];
};

export const children: Child[] = [
  /* the 8 from the reference, in order */
];

// Visualization labels stay in Spanish
export const parentRoleLabel: Record<ParentRole, string> = {
  mom: "Mamá",
  dad: "Papá",
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

export const unlinkedPill = {
  label: "VINCULAR",
  bg: "#F9D2DE",
  color: "#C56486",
};
export const allergyPillStyle = { bg: "#FBD8CC", color: "#D9684A" };
```

Reglas de render derivadas (no almacenadas):

- Subtítulo de tarjeta: `"{ageYears} años · {resumen de padres}"` → "2 padres vinculados" | "1 padre vinculado" | "sin padres vinculados".
- Lado derecho de la tarjeta: pill de alergia si `allergy`; si no, pill VINCULAR si `parents.length === 0`; si no, chevron.

Refactor de navegación en `src/data/feed.ts`:

- `NavItem` pierde el campo `active`; nuevos hrefs: feed → `/`, kids → `/kids`, notices/account → `#`.
- Nuevo tipo `NavItemId = "feed" | "kids" | "notices" | "account"`; `Sidebar`, `SidebarContent` y `MobileTopBar` reciben `activeNavId: NavItemId`.

## Plan de implementación

1. Leer las guías de Next.js 16 en `node_modules/next/dist/docs/` (rutas dinámicas, `generateStaticParams`, `params` asíncrono, `notFound`) — requisito de AGENTS.md.
2. Refactor de navegación: `navItems` en `src/data/feed.ts`, props `activeNavId` en `Sidebar`/`SidebarContent`/`MobileTopBar`, y `src/app/page.tsx` pasando `activeNavId="feed"`. Verificar que `/` queda intacto.
3. `src/data/children.ts`: tipos y los 8 niños de la referencia.
4. `/kids`: `src/app/kids/page.tsx` (metadata "Niños · OpenDayCare"), `src/components/ChildrenBrowser.tsx` (cliente: buscador + divisor + grid) y `src/components/ChildCard.tsx` (tarjeta con hover: borde #F2A78E y elevación 2px).
5. `/kids/[childId]`: `generateStaticParams`, `generateMetadata` ("{nombre} · OpenDayCare"), `notFound()` para id desconocido; componentes `ChildProfileHeader`, `AllergyNotice`, `ChildInfoCard` y `ParentsCard`.
6. Verificación móvil <768px: drawer con "Niños" activo, grid 1 columna, perfil apilado.
7. Capturas comparativas con Playwright en `.playwright-mcp/` (listado y perfil contra sus referencias) y `pnpm build` sin errores.

## Criterios de aceptación

- [x] `pnpm build` completa sin errores.
- [x] `/kids` y `/kids/mateo-fernandez` renderizan sin errores en consola.
- [x] En viewport ≥768px el listado es visualmente idéntico a `ninos.dc.html`: header GESTIÓN/Niños con "Agregar niño", buscador (borde #ECE0D0, radio 14px, placeholder "Buscar niño…"), divisor "SALA SOLES · 8 niños", grid de 2 columnas con gap 14px, tarjetas #FFFDF9 radio 18px con la sombra de la referencia y hover (borde #F2A78E, translateY -2px, transición .15s).
- [x] Los 8 niños se renderizan desde `children` con sus avatares/colores de la referencia; pills: MANÍ en Mateo, LACTOSA en Tomás, VINCULAR en Valentina y chevron en el resto.
- [x] El buscador filtra en cliente por nombre (p. ej. "mat" deja solo a Mateo) y al vaciar restaura los 8.
- [x] En viewport ≥768px el perfil de Mateo es visualmente idéntico a `perfil-nino.dc.html`: "Volver a Niños", avatar 84px #A9D9E8, tarjeta de alergias #FBDAD6 con el texto exacto, filas "12 mar 2022" / "Soles" / "feb 2025", botón "Resumen del día" #3F362E, padres Lucía (ACTIVA) y Diego (PENDIENTE) y "Vincular otro padre" con círculo punteado.
- [x] Cada tarjeta navega al perfil de ese niño con sus propios datos; un id desconocido devuelve 404.
- [x] Navegación del sidebar: "Feed" → `/` (activo en `/`), "Niños" → `/kids` (activo en `/kids` y en el perfil); "Nueva publicación", "Avisos", "Mi cuenta", "Editar", "Agregar niño", "Resumen del día", "Vincular otro padre" y cierre de sesión usan `href="#"` y no navegan.
- [x] En viewport <768px: sidebar oculto, top bar + drawer con "Niños" activo, grid a 1 columna y perfil apilado.
- [x] Todos los identificadores del código en inglés; los textos visibles en español.

## Decisiones

- **Sí:** un solo spec para listado y perfil; comparten modelo de datos y navegación.
- **Sí:** ruta dinámica `/kids/[childId]` con datos por niño (los 8 completos; solo el perfil de Mateo coincide 1:1 con la referencia). **No:** página única estática.
- **Sí:** buscador funcional en cliente (`ChildrenBrowser` con `"use client"`); único estado interactivo. **No:** solo visual.
- **Sí:** navegación real entre pantallas existentes (Feed ↔ Niños ↔ perfil); `href="#"` para las inexistentes.
- **Sí:** refactor del sidebar con prop `activeNavId` en vez de `active` en los datos; el estado activo es por página.
- **Sí:** móvil igual que spec 01 (reutiliza `MobileTopBar`), grid 1 columna y perfil apilado.
- **Sí:** URLs en inglés (`/kids`, `/kids/[childId]`); id slug derivado del nombre del niño ("mateo-fernandez"). Corrección sobre la decisión original: las URLs son naming, no visualización.
- **No:** empty state para búsqueda sin resultados; la referencia no lo define.
- **Sí:** convención naming inglés/español registrada en el spec 01.

## Riesgos

| Riesgo                                                                                 | Mitigación                                                                                        |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Next.js 16 cambió APIs de rutas dinámicas (`params` asíncrono, `generateStaticParams`) | Leer `node_modules/next/dist/docs/` antes de escribir código (paso 1).                            |
| Traducir estilos inline a Tailwind puede desviar el visual                             | Capturas comparativas contra ambas referencias en `.playwright-mcp/` (paso final).                |
| Datos inventados para 7 niños (solo Mateo tiene referencia)                            | Fijar los conteos de padres y pills que sí define la referencia; el resto sigue sus convenciones. |

## Lo que **no** está en este spec

- Pantallas agregar-nino, resumen-dia, vincular-padre, login.
- Edición real del perfil, vinculación de padres, autenticación, base de datos.
- Interactividad más allá del buscador.

Cada una de esas, si llega, va en su propio spec.
