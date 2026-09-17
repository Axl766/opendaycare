# SPEC 05 — Modal Vincular padre (réplica visual con validación)

> **Estado:** Implemented
> **Depende de:** SPEC 02 (perfil del niño, tarjeta PADRES VINCULADOS, modelo de padres)
> **Fecha:** 2026-09-16
> **Objetivo:** Implementar el modal de `vincular-padre.dc.html` lanzado por "Vincular otro padre" del perfil de cada niño (`/kids/[childId]`), con réplica visual, parentesco funcional de 3 opciones, validación de nombre y email al enviar, y alta del padre como PENDIENTE en memoria (sin persistencia).

## Alcance

**Dentro:**

- Componente cliente `src/components/LinkParentModal.tsx` (patrón `AddChildModal`): disparador "Vincular otro padre" (mismo estilo actual: círculo punteado + texto `#C5503A`) + overlay `rgba(63,54,46,.4)` + tarjeta centrada `max-width:480px` (bg `#FBF4EC`, borde `#ECE0D0`, radio 24px, sombra `0 20px 50px -24px rgba(63,54,46,.35)`), z-50 sobre el drawer móvil.
- Header del modal: "Vincular padre" (Fredoka 600, 18px, `#3F362E`), subtítulo dinámico "a {childName}" (13px, `#A89A8B`) y botón X (34px, radio 10px, bg `#F0E6D8`, icono `#94887B`).
- Callout azul (`#E3ECFB`, radio 14px, icono info `#4E72C8`, texto 13.5px `#3F5694`): "Le enviaremos un correo con un código para que active su cuenta. Solo verá el feed de {primer nombre del niño}."
- Formulario réplica: labels 12px/800/tracking .7px/`#94887B` + inputs (padding 13px 16px, radio 14px, borde 1.5px `#EADFD0`, fondo blanco, 15px): NOMBRE DEL PADRE/MADRE ("Ej. Diego Fernández") y EMAIL (type email, "correo@ejemplo.com").
- PARENTESCO: 3 botones pill (flex-1, radio 999px, 800, 14px) Mamá/Papá/Tutor/a; seleccionado = borde `#9FB8EC`, bg `#CCD8F4`, color `#4E72C8`; sin seleccionar = borde `#ECE0D0`, bg `#FFFDF9`, color `#6E6359`; inicia "Mamá", selección única.
- Bloque CÓDIGO DE INVITACIÓN estático: bg `#FBF1D6`, borde 1.5px dashed `#E6D08A`, radio 16px, "7K4P9" (Fredoka 600, 34px, letter-spacing 7px, `#8A7234`) y "Vence en 7 días" (13px, `#A88526`).
- CTA "Enviar invitación" (gradiente 180deg `#F4977E→#EE8164`, blanco 800 15.5px, radio 14px, icono send) con validación al clic: nombre con contenido tras trim y email de formato válido.
- Estados de error (inventados — la referencia no los define): input inválido con borde `#D9583C` + mensaje debajo (13px, mismo color): "Ingresá el nombre del padre o madre." / "Ingresá un correo válido."; el error de un campo desaparece al editarlo; con errores el modal no cierra ni agrega.
- Envío válido: cierra el modal y agrega el padre como PENDIENTE en memoria a la lista de ese niño — `initial` = primera letra en mayúscula, `avatarBg` fijo `#A9C7E8`, `role` según parentesco, `status: "pending"` (render con pill PENDIENTE "invitación enviada" existente).
- Cierre del modal: X, clic en overlay y Esc (patrón spec 04); al cerrar se resetean campos, parentesco ("Mamá") y errores.
- Refactor: `src/components/ParentsCard.tsx` pasa a cliente con la lista de padres como estado (inicializada de props) y `src/app/kids/[childId]/page.tsx` le pasa `childName`.
- `ParentRole` extendido en `src/data/children.ts` con `"tutor"` + `parentRoleLabel` "Tutor/a".
- Adaptación móvil <768px: mismo modal centrado, padding reducido, sin desbordes.

**Fuera de alcance (para specs futuros):**

- Envío real de correo, persistencia (recargar restaura los padres originales), control de duplicados (mismo email ya vinculado).
- Expiración real del código ("Vence en 7 días" es texto fijo) y flujo de activación (SPEC 03).
- Actualizar el conteo "X padres vinculados" de las tarjetas de `/kids` (datos estáticos; la memoria vive solo en el perfil).
- Eliminación/gestión de padres vinculados; resto de las pantallas de `src/references/pantallas/`.

## Modelo de datos

Cambio en `src/data/children.ts` (identificadores en inglés, strings visibles en español):

```ts
export type ParentRole = "mom" | "dad" | "tutor";

export const parentRoleLabel: Record<ParentRole, string> = {
  mom: "Mamá",
  dad: "Papá",
  tutor: "Tutor/a",
};
```

Estructura del padre invitado (solo en memoria, no almacenada):

```ts
const invitedParent: LinkedParent = {
  name, // del input, con trim
  initial, // primera letra en mayúscula
  avatarBg: "#A9C7E8", // fijo para invitados
  role, // mom | dad | tutor (parentesco)
  status: "pending",
};
```

Código "7K4P9" y textos del modal como constantes locales de `LinkParentModal`; el nombre del niño llega por props.

## Plan de implementación

1. Leer las guías de Next.js 16 en `node_modules/next/dist/docs/` (client components, composición server/cliente) — requisito de AGENTS.md.
2. `children.ts`: `ParentRole` + `parentRoleLabel` con "tutor".
3. `src/components/LinkParentModal.tsx` (cliente): disparador + overlay + tarjeta réplica (header dinámico, callout, campos, parentesco, código, CTA).
4. Validación al clic + estados de error (borde/mensaje `#D9583C`, limpieza al editar) + reset al cerrar.
5. Refactor de `ParentsCard.tsx` a cliente (estado de lista + `onInvite` que agrega PENDIENTE) y paso de `childName` desde `/kids/[childId]`. Verificar el perfil de varios niños.
6. Verificación móvil <768px del modal (centrado, sin desbordes, pills usables).
7. Capturas comparativas con Playwright en `.playwright-mcp/` (modal abierto contra la referencia, desktop y móvil) y `pnpm build` sin errores.

## Criterios de aceptación

- [x] `pnpm build` completa sin errores.
- [x] "Vincular otro padre" del perfil abre el modal sin errores en consola; `/`, `/kids` y los demás perfiles quedan intactos.
- [x] En viewport ≥768px el modal abierto es visualmente idéntico a la tarjeta de `vincular-padre.dc.html`: max-width 480px, header "Vincular padre" + subtítulo "a {nombre del niño}", callout azul, NOMBRE/EMAIL con sus placeholders, PARENTESCO con "Mamá" seleccionada, bloque de código "7K4P9" con "Vence en 7 días" y CTA coral.
- [x] El modal se presenta sobre overlay `rgba(63,54,46,.4)` centrado en el viewport (desviación registrada: la referencia es una página suelta sin overlay).
- [x] PARENTESCO: al clic se selecciona una única opción y queda visible el estilo seleccionado; inicia "Mamá".
- [x] El modal cierra por X, clic en el overlay y tecla Esc, y reabre con campos vacíos, "Mamá" y sin errores.
- [x] Enviar con nombre vacío muestra borde `#D9583C` + "Ingresá el nombre del padre o madre."; con email inválido, "Ingresá un correo válido."; el error de un campo desaparece al editarlo; con errores no se cierra ni agrega nada.
- [x] Un envío válido cierra el modal y el padre aparece en PADRES VINCULADOS con pill PENDIENTE, avatar `#A9C7E8` con su inicial y "{parentesco} · invitación enviada" (incluye "Tutor/a").
- [x] Recargar la página restaura los padres originales del niño (sin persistencia).
- [x] Subtítulo y callout usan los datos del niño del perfil (p. ej. "a Sofía Méndez" / "Solo verá el feed de Sofía").
- [x] En viewport <768px el modal abre centrado, sin desbordes horizontales, con campos y pills de parentesco usables.
- [x] Todos los identificadores del código en inglés; los textos visibles en español.

## Decisiones

- **Sí:** modal lanzado desde "Vincular otro padre" (petición explícita). **No:** página propia.
- **Sí:** extender `ParentRole` con "tutor" + etiqueta "Tutor/a" (elección del usuario), aunque el alta sea solo en memoria.
- **Sí:** código estático "7K4P9", idéntico a la referencia y a `/activate-account` (elección del usuario).
- **Sí:** validación de nombre y email al clic de "Enviar invitación" (elección del usuario), con borde + mensaje `#D9583C` y voseo — estados de error inventados (la referencia no los define).
- **Sí:** alta en memoria como PENDIENTE (elección del usuario) — primera mutación de lista en memoria de la app; se pierde al recargar.
- **Sí:** avatar fijo `#A9C7E8` para padres invitados (color ya presente en la paleta de padres).
- **Sí:** cierre extra por overlay/Esc y reset al cerrar (patrón spec 04; invención registrada).
- **Sí:** textos y constantes del modal en el componente; `childName` llega por props.
- **No:** correo real, persistencia, duplicados, expiración real del código.
- **No:** actualizar el conteo de padres de las tarjetas de `/kids` — fuera de alcance.

## Riesgos

| Riesgo                                                                        | Mitigación                                                                                      |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Estados de error no existen en la referencia (estilo inventado)               | Reutilizar el rojo del sistema (`#D9583C`) y registrar la desviación; verificación interactiva. |
| `ParentsCard` pasa de server a client (primera tarjeta del perfil con estado) | Patrón ya probado (`ChildrenBrowser`, `AddChildModal`); props simples (`parents`, `childName`). |
| Conteo "X padres vinculados" de `/kids` desincronizado tras invitar           | Decisión explícita fuera de alcance; la memoria vive solo en el perfil del niño.                |
| Conflicto de z-index con el drawer móvil (z-40)                               | Modal en z-50 (como spec 04); verificación en móvil.                                            |

## Lo que **no** está en este spec

- Envío real de correo, vinculación persistente, activación (SPEC 03), expiración del código.
- Gestión/eliminación de padres, conteo actualizado en `/kids`.
- Resto de las pantallas de `src/references/pantallas/`.

Cada una de esas, si llega, va en su propio spec.
