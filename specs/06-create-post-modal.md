# SPEC 06 — Modal Nueva publicación (publicación en memoria)

> **Estado:** Approved
> **Depende de:** SPEC 01 (sidebar, feed y modelo de posts), SPEC 02 (datos de los niños)
> **Fecha:** 2026-09-17
> **Objetivo:** Implementar el modal de `crear-publicacion.dc.html` lanzado por el botón "Nueva publicación" del sidebar (desktop y drawer móvil), con réplica visual, selección de destinatarios y tipo funcional, validación al publicar y alta del post en memoria visible en el feed `/` durante la sesión, sin persistencia.

## Alcance

**Dentro:**

- Componente cliente `src/components/CreatePostModal.tsx` (patrón `AddChildModal`/`LinkParentModal`): disparador con el estilo exacto del botón actual del sidebar (gradiente 180deg `#F4977E→#EE8164`, icono +, texto, sombra) + overlay `rgba(63,54,46,.4)` + tarjeta centrada `max-width:580px` (bg `#FBF4EC`, borde `#ECE0D0`, radio 24px, sombra `0 20px 50px -24px rgba(63,54,46,.35)`), z-50 sobre el drawer móvil (z-40).
- Header del modal: "Cancelar" (`#94887B`, 700, 15px), título "Nueva publicación" (Fredoka 600, 18px, `#3F362E`), "Publicar" (`#D9583C`, 800, 15px), sobre borde inferior `#ECE0D0`.
- PARA: chips de los 8 niños de sala Soles de `children.ts` (avatar 26px con inicial Fredoka 600 13px sobre `avatarBg`/`avatarColor` del niño + nombre de pila) y chip "Toda la sala" (sin avatar). Selección múltiple de niños; "Toda la sala" es excluyente (al tocarla se desmarcan los niños y viceversa). Seleccionado: borde 1.5px `#3F362E`, bg `#3F362E`, texto blanco; sin seleccionar: borde `#ECE0D0`, bg `#FFFDF9`, color `#6E6359`.
- TIPO: 7 pills con colores fijos de la referencia (Comida `#9A7B1E`/blanco, Siesta `#E7DCF6`/`#7B5FC0`, Actividad `#2E89A6`/blanco, Logro `#CFEBD8`/`#3E9B6C`, Ánimo `#F9D2DE`/`#C56486`, Foto `#FBD8CC`/`#D9684A`, Anuncio `#CCD8F4`/`#4E72C8`; radio 999px, 800, 13.5px). Selección única; el elegido agrega borde 1.5px `#3F362E` (marca inventada: la referencia no define estado de selección).
- DESCRIPCIÓN: textarea placeholder "Contá cómo le fue hoy…" (min-height 120px, resize vertical, estilo de inputs del patrón).
- FOTOS: tile placeholder 96px (icono imagen `#CBB89F` sobre `#F4ECE1`) + tile "Agregar" punteado (borde dashed `#DBCDBA`, icono + `#C5503A`); "Agregar" añade tiles placeholder visuales adicionales, sin subida real de archivos.
- Validación al "Publicar" (estados inventados, patrón SPEC 05): exige al menos un destinatario, un tipo y descripción con contenido tras trim. Errores con mensaje 13px `#D9583C` bajo el bloque: "Elegí al menos un destinatario." / "Elegí un tipo de publicación." / "Ingresá una descripción." (la textarea además toma borde `#D9583C`). El error de un bloque desaparece al cambiar ese campo; con errores el modal no cierra ni publica.
- Publicación válida: cierra el modal y agrega el post en memoria como primera tarjeta del feed — autor = primer niño seleccionado (primero en el orden de `children.ts` entre los elegidos, nombre de pila, avatar con su inicial/colores) o `kind: "announcement"` con "Toda la sala"; `recipient` = "familia de {nombres de pila unidos con ' y '}" o "toda la sala"; `time` = hora actual en HH:MM (24h); `likes: 0`, `comments: 0`; sin foto (aunque haya tiles en el modal).
- Feed en contexto de sesión: `src/components/FeedProvider.tsx` (contexto cliente con la lista inicializada desde `posts` y `addPost()` con prepend) montado en `src/app/layout.tsx`; `src/components/FeedPosts.tsx` (cliente) lee el contexto y renderiza el listado; `src/app/page.tsx` reemplaza el `posts.map()` por `<FeedPosts />`. Lo publicado desde cualquier página aparece en el feed al navegar a `/`; recargar restaura los 3 posts originales.
- Refactor en `src/components/Sidebar.tsx`: el `Link href="#"` "Nueva publicación" de `SidebarContent` pasa a ser `<CreatePostModal />` (aplica al sidebar desktop y al drawer móvil, que reutiliza `SidebarContent`).
- `src/data/feed.ts`: `PostType` extendido a 7 tipos + exports para el modal + `badgeByType` completo (ver Modelo de datos).
- Adaptación móvil <768px: mismo modal centrado, padding reducido, chips y pills usables, sin desbordes.

**Fuera de alcance (para specs futuros):**

- Subida real de fotos/archivos y fotos en el post publicado (los tiles son solo visuales).
- Persistencia (recargar restaura el feed original).
- Edición/eliminación de posts, "Editar" del PostCard, detalle de publicación (pantallas `detalle-publicacion`, `foto`).
- El prompt "Compartí un momento…" como disparador (queda estático, elección del usuario).
- Interactividad del feed (me gusta, comentarios) y resto de las pantallas de `src/references/pantallas/`.

## Modelo de datos

Cambios en `src/data/feed.ts` (identificadores en inglés, strings visibles en español):

```ts
export type PostType =
  | "meal" | "nap" | "activity" | "achievement"
  | "mood" | "photo" | "announcement";

export const postTypeLabel: Record<PostType, string> = {
  meal: "Comida", nap: "Siesta", activity: "Actividad",
  achievement: "Logro", mood: "Ánimo", photo: "Foto",
  announcement: "Anuncio",
};

// Pills del modal: colores fijos de la referencia
export const postTypePill: Record<PostType, { bg: string; color: string }> = {
  meal: { bg: "#9A7B1E", color: "#FFFFFF" },
  nap: { bg: "#E7DCF6", color: "#7B5FC0" },
  activity: { bg: "#2E89A6", color: "#FFFFFF" },
  achievement: { bg: "#CFEBD8", color: "#3E9B6C" },
  mood: { bg: "#F9D2DE", color: "#C56486" },
  photo: { bg: "#FBD8CC", color: "#D9684A" },
  announcement: { bg: "#CCD8F4", color: "#4E72C8" },
};

// badgeByType gana 4 entradas (bg claro + color; COMIDA usa el #F4DC8E de la paleta)
badgeByType: {
  ...,
  meal: { label: "COMIDA", bg: "#F4DC8E", color: "#9A7B1E" },
  nap: { label: "SIESTA", bg: "#E7DCF6", color: "#7B5FC0" },
  mood: { label: "ÁNIMO", bg: "#F9D2DE", color: "#C56486" },
  photo: { label: "FOTO", bg: "#FBD8CC", color: "#D9684A" },
}
```

Post nuevo (solo en memoria, no en `feed.ts`):

```ts
const newPost: Post = {
  id: `post-${Date.now()}`,           // generado al publicar
  author: /* primer niño seleccionado (kind "child") | { kind: "announcement" } */,
  time: "HH:MM",                       // hora actual al publicar
  type,                                // PostType elegido
  recipient: "familia de Mateo y Sofía" | "toda la sala",
  body,                                // descripción con trim
  likes: 0,
  comments: 0,
};
```

`FeedProvider` (contexto cliente): estado `posts` inicializado desde `posts` de `feed.ts` + `addPost(post)` que hace prepend. `PostAuthor` y `Post` no cambian de forma.

## Plan de implementación

1. Leer las guías de Next.js 16 en `node_modules/next/dist/docs/` (client components, composición server/cliente, contexto) — requisito de AGENTS.md.
2. `feed.ts`: `PostType` a 7 tipos + `postTypeLabel` + `postTypePill` + `badgeByType` completo. Verificar: `/` sigue renderizando los 3 posts sin errores.
3. `CreatePostModal.tsx` (cliente): disparador + overlay + tarjeta réplica (header, PARA, TIPO, DESCRIPCIÓN, FOTOS estático), sin lógica de publicación.
4. Selección funcional: chips PARA (multi + "Toda la sala" excluyente) y pills TIPO (única, borde `#3F362E`) + "Agregar" que añade tiles placeholder.
5. Validación al Publicar (3 campos, mensajes `#D9583C`, limpieza al editar, no cierra con errores) + reset al cerrar (Cancelar/overlay/Esc).
6. `FeedProvider.tsx` + montaje en `layout.tsx` + `FeedPosts.tsx` + refactor de `page.tsx` (listado desde el contexto). Verificar: feed idéntico en `/`.
7. Publicación (`addPost` con autor/recipient/hora/0-0) + refactor de `Sidebar.tsx` (`Link` → `<CreatePostModal />`). Verificar: publicar desde `/`, `/kids` y perfil; el post aparece primero en el feed al navegar a `/`; el drawer móvil abre el modal (z-50 sobre z-40).
8. Verificación móvil <768px del modal (centrado, sin desbordes, chips y pills usables).
9. Capturas comparativas con Playwright en `.playwright-mcp/` (modal abierto contra la referencia, desktop y móvil) y `pnpm build` sin errores.

## Criterios de aceptación

- [ ] `pnpm build` completa sin errores.
- [ ] El botón "Nueva publicación" del sidebar (desktop) y del drawer (móvil) abre el modal; `/`, `/kids` y `/kids/[childId]` siguen funcionando; el prompt "Compartí un momento…" queda estático.
- [ ] En viewport ≥768px el modal abierto es visualmente idéntico a la tarjeta de `crear-publicacion.dc.html`: max-width 580px, bg `#FBF4EC`, borde `#ECE0D0`, radio 24px, sombra de la referencia, header Cancelar/"Nueva publicación"/Publicar y las 4 secciones con sus placeholders y tiles exactos.
- [ ] PARA muestra los 8 niños de sala Soles con sus avatares + "Toda la sala"; inicia vacío; se seleccionan varios niños; "Toda la sala" desmarca a los niños y viceversa; el chip seleccionado usa borde/bg `#3F362E` con texto blanco.
- [ ] TIPO muestra los 7 tipos con sus colores fijos; selección única; el elegido agrega borde 1.5px `#3F362E`.
- [ ] "Agregar" de FOTOS añade tiles placeholder de 96px, sin subida real de archivos.
- [ ] Publicar con faltantes muestra el mensaje `#D9583C` bajo el bloque correspondiente ("Elegí al menos un destinatario." / "Elegí un tipo de publicación." / "Ingresá una descripción.") y no cierra ni publica; cada error desaparece al cambiar ese campo.
- [ ] Publicar válido cierra el modal y el post aparece como primera tarjeta del feed: badge del tipo elegido (COMIDA/SIESTA/ACTIVIDAD/LOGRO/ÁNIMO/FOTO/ANUNCIO), autor = primer niño seleccionado (o megáfono "Anuncio general" con "Toda la sala"), "Para: familia de {nombres}" o "toda la sala", hora actual HH:MM, 0 me gusta y 0 comentarios, sin foto.
- [ ] Lo publicado desde `/kids` o el perfil aparece en el feed al navegar a `/` en la misma sesión (sin recargar).
- [ ] Recargar la página restaura los 3 posts originales.
- [ ] Al reabrir, el modal está vacío (sin destinatario, sin tipo, textarea vacía, sin tiles agregados, sin errores).
- [ ] En viewport <768px el modal abre centrado sobre el drawer, sin desbordes horizontales, con chips y pills usables.
- [ ] Todos los identificadores del código en inglés; los textos visibles en español.

## Decisiones

- **Sí:** publicación en memoria visible en el feed (elección del usuario; patrón SPEC 05 extendido al feed). **No:** réplica visual pura (SPEC 04) ni persistencia.
- **Sí:** extender `PostType` a 7 tipos con badges; COMIDA usa bg `#F4DC8E` (variante clara ya presente en la paleta — avatar de Valentina) porque el botón de la referencia es sólido; el resto toma los colores directos de la referencia.
- **Sí:** multi-selección de niños con "Toda la sala" excluyente. **No:** selección única y multi libre.
- **Sí:** tiles de FOTOS visuales; el post publicado no lleva fotos (incluso con tipo Foto). **No:** input file — merece su propio spec.
- **Sí:** validación de 3 campos con mensajes en voseo y `#D9583C` (estados inventados, patrón SPEC 05).
- **Sí:** autor = primer niño seleccionado / megáfono para "Toda la sala" (patrón existente). **No:** extender `PostAuthor` con kind "teacher" para Caro.
- **Sí:** feed en contexto cliente a nivel layout (sesión compartida entre páginas). **No:** estado local de `/` (dejaría mudo el botón en `/kids` y perfil).
- **Sí:** modal abre vacío. **No:** precargar el estado demo de la referencia (Mateo + Comida + texto de ejemplo).
- **Sí:** marca de tipo seleccionado = borde 1.5px `#3F362E` (invención registrada). **No:** pills neutros sin seleccionar (desviaría el look de la referencia).
- **Sí:** solo el botón del sidebar dispara el modal. **No:** el prompt del feed (elección del usuario).
- **Sí:** hora del post = hora actual HH:MM al publicar; likes/comments = 0.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| `FeedProvider` es el primer contexto global de la app; recargar entre navegaciones restaura el estado | Comportamiento aceptado y registrado; verificación navegando `/` → `/kids` → publicar → `/`. |
| `SidebarContent` compartido entre server (`Sidebar`) y client (`MobileTopBar`) pasa a renderizar un componente cliente con modal | Patrón ya probado (server renderiza client, como `AddChildModal` en `/kids`); verificación del drawer móvil. |
| Estados de error y marca de selección no existen en la referencia | Reutilizar `#D9583C` y borde `#3F362E` del sistema; desviaciones registradas en decisiones; capturas comparativas. |
| Conflicto de z-index con el drawer móvil (z-40) | Modal en z-50 (como specs 04/05); verificación en móvil. |

## Lo que **no** está en este spec

- Subida real de fotos y fotos en el post publicado.
- Persistencia, edición/eliminación de posts, detalle de publicación.
- El prompt "Compartí un momento…" como disparador; interactividad del feed; resto de las pantallas de `src/references/pantallas/`.

Cada una de esas, si llega, va en su propio spec.
