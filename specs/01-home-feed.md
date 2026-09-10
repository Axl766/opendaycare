# SPEC 01 — Home feed: réplica visual de la referencia

> **Estado:** Approved
> **Depende de:** ninguna (primer spec)
> **Fecha:** 2026-09-10
> **Objetivo:** Implementar la plantilla `src/references/pantallas/feed.dc.html` como home `/` con estilo idéntico en desktop (≥768px) y navegación móvil con top bar + drawer, sin autenticación ni base de datos.

## Alcance

**Dentro:**

- Página `/` con el layout de la referencia: sidebar fijo de 248px + columna central `max-width:760px`.
- Fuentes Fredoka (400–700) y Nunito (400–800) vía `next/font`, reemplazando Geist.
- Los 3 posts de la referencia (logro, actividad con foto placeholder, anuncio) renderizados desde un array tipado.
- Componentes en `src/components/`: `Sidebar`, `MobileTopBar`, `PostCard`, `CreatePostPrompt`.
- Estilos con Tailwind v4 y valores arbitrarios (colores, radios y sombras exactos de la referencia).
- Adaptación móvil <768px: top bar con logo + hamburguesa y drawer con el mismo contenido del sidebar.
- `globals.css`: base clara (fondo #F6ECDF, texto #3F362E), sin dark mode.
- Metadata: `lang="es"`, título "OpenDayCare".

**Fuera de alcance (para specs futuros):**

- Las pantallas enlazadas: crear-publicación, niños, avisos, mi-cuenta, detalle-publicación, foto, login.
- Autenticación, base de datos y persistencia.
- Interactividad del feed (me gusta, comentarios, editar).
- Cambios visuales sobre la referencia más allá de la adaptación móvil.

## Modelo de datos

Archivo nuevo `src/data/feed.ts` — identificadores en inglés, strings visibles al usuario en español:

```ts
export type PostType = "achievement" | "activity" | "announcement";

export type PostAuthor =
  | { kind: "child"; name: string; initial: string; avatarBg: string; avatarColor: string }
  | { kind: "announcement" }; // avatar with megaphone icon

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

export const posts: Post[] = [/* the 3 from the reference, in order */];

export const currentUser = {
  name: "Caro Giménez",
  role: "Maestra · Soles",
  initial: "C",
};

export const navItems = [
  /* Feed (active), Niños, Avisos, Mi cuenta — each with its icon */
];

// Visualization labels stay in Spanish
export const badgeByType: Record<PostType, { label: string; bg: string; color: string }> = {
  achievement: { label: "LOGRO", bg: "#CFEBD8", color: "#3E9B6C" },
  activity: { label: "ACTIVIDAD", bg: "#C7E7F1", color: "#2E89A6" },
  announcement: { label: "ANUNCIO", bg: "#CCD8F4", color: "#4E72C8" },
};
```

No hay persistencia: todo vive en memoria al momento del render.

## Plan de implementación

1. Leer las guías de Next.js 16 en `node_modules/next/dist/docs/` (App Router, `next/font`) antes de escribir código — requisito de AGENTS.md.
2. `src/app/layout.tsx`: Fredoka y Nunito con `next/font/google` (variables `--font-fredoka`, `--font-nunito`), `lang="es"`, título "OpenDayCare". Verificar: `pnpm dev` arranca sin errores.
3. `src/app/globals.css`: conservar el import de Tailwind; mapear ambas fuentes en `@theme`; base clara con los valores de la referencia (fondo, texto, enlaces sin subrayar, scrollbar); eliminar dark mode y variables Geist. Verificar: la app sigue funcionando.
4. `src/data/feed.ts`: tipos y constantes según el modelo de datos.
5. `src/components/PostCard.tsx`: tarjeta con valores exactos (`bg-[#FFFDF9]`, borde #ECE0D0, `rounded-[20px]`, sombra de la referencia) y badge según tipo.
6. `src/components/CreatePostPrompt.tsx`: prompt "Compartí un momento…" con avatar "C" e ícono de cámara.
7. `src/components/Sidebar.tsx`: logo + "Sala Soles", botón "Nueva publicación", nav con Feed activo, usuario y cierre de sesión; todos los enlaces `href="#"`.
8. `src/components/MobileTopBar.tsx`: top bar visible solo <768px (logo + hamburguesa) y drawer overlay que reutiliza el contenido del `Sidebar`; el sidebar queda `hidden md:flex`.
9. `src/app/page.tsx`: saludo ("GUARDERÍA · SALA SOLES", "Buenas, Caro", "12 niños · martes 17 jun"), prompt, divisor "PUBLICADO HOY" y listado con `posts.map()`. Verificar en `localhost:3000`.
10. Captura comparativa con Playwright en `.playwright-mcp/` (desktop ≥768px contra la referencia, y apertura del drawer <768px) y `pnpm build` sin errores.

## Criterios de aceptación

- [ ] `pnpm build` completa sin errores.
- [ ] `/` renderiza el feed completo sin errores en consola.
- [ ] En viewport ≥768px el diseño es visualmente idéntico a `feed.dc.html`: sidebar de 248px con fondo #FFFDF9, fondo de página #F6ECDF, tarjetas #FFFDF9 con borde #ECE0D0 y radio 20px, sombras y tipografías Fredoka/Nunito.
- [ ] Los 3 posts se renderizan desde el array `posts` con badges LOGRO, ACTIVIDAD y ANUNCIO, y contadores 3/1, 5/2 y 8/0 respectivamente.
- [ ] El placeholder punteado de foto aparece solo en el post de actividad con el texto "Foto · pintando con témperas".
- [ ] Fredoka y Nunito cargan vía `next/font` (self-hosted, sin `<link>` a Google Fonts).
- [ ] Todos los enlaces a pantallas inexistentes usan `href="#"` y no navegan.
- [ ] En viewport <768px el sidebar fijo no es visible; la top bar con logo y hamburguesa sí; el drawer abre/cierra y contiene el mismo contenido del sidebar.
- [ ] Con `prefers-color-scheme: dark` activo, la página mantiene el tema claro de la referencia.
- [ ] Todos los identificadores del código (variables, funciones, tipos, propiedades, discriminantes) están en inglés; los textos visibles (badges, navegación, saludo, contenido de los posts) quedan en español.

## Decisiones

- **Sí:** Tailwind v4 con valores arbitrarios (`bg-[#FFFDF9]`, `rounded-[20px]`, `text-[15.5px]`); sigue la convención del proyecto y los valores son exactos.
- **No:** estilos inline literales; misma fidelidad pero ignora el setup Tailwind existente.
- **Sí:** datos tipados en `src/data/feed.ts` y render con `map()`; cuando exista backend solo cambia la fuente.
- **Sí:** `next/font` para las fuentes; self-hosted, sin layout shift, visualmente idéntico al `<link>` de la referencia.
- **Sí:** componentes separados; todas las pantallas de `src/references/pantallas/` comparten el mismo sidebar.
- **Sí:** móvil con top bar + drawer bajo 768px (elección del usuario); reutiliza el sidebar exacto de la referencia.
- **No:** bottom nav y rail de iconos; descartados en la fase de preguntas.
- **Sí:** enlaces muertos con `href="#"`; cada pantalla destino va en su propio spec.
- **No:** dark mode; la referencia es solo tema claro, se eliminan los overrides actuales.
- **No:** interactividad; el requisito es visual.
- **Sí:** título "OpenDayCare" y `lang="es"` en el layout.
- **Sí:** convención de naming — identificadores en inglés, strings visibles al usuario en español. Queda registrada como convención del proyecto para los specs futuros.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| Next.js 16 tiene cambios rupturistas frente a conocimiento previo | Leer `node_modules/next/dist/docs/` antes de escribir código (paso 1, exigencia de AGENTS.md). |
| Traducir estilos inline a clases Tailwind puede introducir desvíos visuales | Captura comparativa contra la referencia en `.playwright-mcp/` (paso final) antes de dar por terminado. |
| Fredoka no disponible en `next/font` | Verificar en el paso 2; si no está, fallback al `<link>` de Google Fonts (visual idéntico). |

## Lo que **no** está en este spec

- Las pantallas enlazadas: crear-publicación, niños, avisos, mi-cuenta, detalle-publicación, foto, login.
- Autenticación, base de datos, persistencia.
- Interactividad del feed (me gusta, comentarios, editar).
- Cambios visuales más allá de la adaptación móvil.

Cada una de esas, si llega, va en su propio spec.
