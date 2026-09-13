# SPEC 03 — Login y activación de cuenta (réplica visual)

> **Estado:** Draft
> **Depende de:** SPEC 01 (fuentes, base de estilo), SPEC 02 (refactor de navegación del sidebar)
> **Fecha:** 2026-09-12
> **Objetivo:** Implementar `login.dc.html` y `activar-cuenta.dc.html` como `/login` y `/activate-account` dentro del route group `(auth)`, sin el selector de rol "Personal/Familia", con checkbox de autorización toggléable y navegación real entre pantallas existentes, sin autenticación ni base de datos.

## Alcance

**Dentro:**

- Route group `src/app/(auth)/` — solo agrupador, sin layout propio ni prefijo en la URL: `(auth)/login/page.tsx` → `/login` y `(auth)/activate-account/page.tsx` → `/activate-account`.
- `/login` **sin** el bloque "INGRESO COMO" ni los botones Personal/Familia: título "Iniciar sesión" (30px), "Ingresá para ver el día de hoy.", EMAIL pre-cargado con `caro@opendaycare.com`, CONTRASEÑA con placeholder "••••••••", "¿Olvidaste tu contraseña?" (`href="#"`), botón "Iniciar sesión" → `/` y "¿Te invitó la guardería? Activá tu cuenta" → `/activate-account`.
- Panel izquierdo de marca del login (solo ≥768px): gradiente 155deg `#F6A98E → #F2937A → #EC7E62`, dos círculos decorativos absolutos, logo con sol, titular "El día de cada niño, compartido con su familia.", subtítulo y footer "🌿 Guardería Sala Soles"; grid `1.05fr 1fr`, fondo de página `#FBF4EC`.
- `/activate-account`: columna única `max-width:440px` con icono de marca 58px, "Bienvenida a OpenDayCare", tarjeta de invitación (avatar "M" 44px `#A9D9E8`/`#1F7A93`, "Te invitaron a seguir a", "Mateo · Sala Soles"), CÓDIGO DE INVITACIÓN "7K4P9" (Fredoka 18px, letter-spacing 3px), EMAIL `lucia.fernandez@gmail.com`, CREAR CONTRASEÑA pre-cargada ("contraseña", borde `#F2A78E`), checkbox de autorización toggléable, botón "Activar mi cuenta" (`href="#"`) y "¿Ya tenés cuenta? Iniciar sesión" → `/login`.
- `src/data/auth.ts` con los datos tipados de ambas pantallas (identificadores en inglés, textos visibles en español).
- Componentes nuevos en `src/components/`: `AuthLogo` (lockup logo + wordmark), `AuthBrandPanel` (panel izquierdo del login, oculto <768px) y `ConsentCheckbox` (cliente, único estado interactivo).
- Refactor mínimo en `src/components/Sidebar.tsx`: el cierre de sesión de `SidebarContent` pasa de `href="#"` a `href="/login"` (cubre sidebar desktop y drawer móvil).
- Adaptación móvil <768px: `/login` oculta el panel izquierdo y muestra `AuthLogo` compacto sobre el formulario; `/activate-account` ya es columna única y solo ajusta padding.
- Metadata por página: "Iniciar sesión · OpenDayCare" y "Activá tu cuenta · OpenDayCare".

**Fuera de alcance (para specs futuros):**

- Autenticación real: credenciales, sesiones, cookies, base de datos, validación de campos.
- Pantalla `familia-feed` (destino real de "Activar mi cuenta") y flujo "¿Olvidaste tu contraseña?".
- Redirecciones o protección de rutas (`/` sigue accesible sin login).
- Selector de rol Personal/Familia (eliminado a pedido del usuario).
- Resto de las pantallas de `src/references/pantallas/`.

## Modelo de datos

Archivo nuevo `src/data/auth.ts` — identificadores en inglés, strings visibles al usuario en español:

```ts
// Login form — pre-loaded values, replica visual de la referencia
export const loginDefaults = {
  email: "caro@opendaycare.com",
};

// Left brand panel copy (login, desktop only)
export const brandPanel = {
  headline: "El día de cada niño,|compartido con su familia.", // two lines
  tagline:
    "Publicá momentos, gestioná las salas y mantené a las familias cerca, desde un solo lugar.",
  footer: "🌿 Guardería Sala Soles",
};

// Activation invitation — activar-cuenta.dc.html
export const invitation = {
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
```

No hay persistencia ni estado global; el único estado interactivo (`ConsentCheckbox`) vive en el cliente y arranca marcado, como en la referencia.

## Plan de implementación

1. Leer las guías de Next.js 16 en `node_modules/next/dist/docs/` (route groups, layouts anidados) — requisito de AGENTS.md.
2. `src/data/auth.ts` con las constantes del modelo de datos.
3. `src/components/AuthLogo.tsx`: lockup con caja de sol + wordmark "OpenDayCare", con variantes para panel coral (blanco) y fondo claro.
4. `src/app/(auth)/login/page.tsx`: metadata "Iniciar sesión · OpenDayCare"; grid de 2 columnas `1.05fr 1fr` con `AuthBrandPanel` (`hidden md:grid`) y formulario (email pre-cargado, contraseña con placeholder, enlaces según alcance); en <768px solo formulario con `AuthLogo` compacto arriba. Verificar `/login`.
5. `src/components/AuthBrandPanel.tsx`: panel coral con gradiente, círculos decorativos, `AuthLogo`, headline/tagline de `brandPanel` y footer.
6. `src/components/ConsentCheckbox.tsx` (`"use client"`): label `#FBF1D6` radio 14px con caja 24px radio 8px; marcado = `#5FB97E` con check (inicial); desmarcado = caja blanca con borde `#EADFD0`.
7. `src/app/(auth)/activate-account/page.tsx`: metadata "Activá tu cuenta · OpenDayCare"; columna única con tarjeta de invitación, campos pre-cargados de `invitation`, `ConsentCheckbox`, botón `href="#"` y enlace a `/login`. Verificar `/activate-account`.
8. Refactor en `src/components/Sidebar.tsx`: cierre de sesión `href="/login"`. Verificar que `/` y `/kids` quedan intactos y que el drawer móvil también enlaza.
9. Verificación móvil <768px de ambas pantallas (panel oculto + logo compacto; activate sin desbordes).
10. Capturas comparativas con Playwright en `.playwright-mcp/` (login y activate contra sus referencias, desktop y móvil) y `pnpm build` sin errores.

## Criterios de aceptación

- [ ] `pnpm build` completa sin errores.
- [ ] `/login` y `/activate-account` renderizan sin errores en consola.
- [ ] Las URLs responden sin prefijo de grupo: `/login` y `/activate-account`.
- [ ] `/login` no muestra el bloque "INGRESO COMO" ni los botones Personal/Familia.
- [ ] En viewport ≥768px `/login` es visualmente idéntico a `login.dc.html` salvo el bloque de rol eliminado: panel con gradiente `#F6A98E→#F2937A→#EC7E62`, círculos decorativos, titular "El día de cada niño, compartido con su familia.", footer "🌿 Guardería Sala Soles", fondo `#FBF4EC` y formulario `max-width:392px` con email pre-cargado `caro@opendaycare.com`.
- [ ] En `/login`: "Iniciar sesión" navega a `/`; "Activá tu cuenta" navega a `/activate-account`; "¿Olvidaste tu contraseña?" es `href="#"` y no navega.
- [ ] En viewport ≥768px `/activate-account` es visualmente idéntico a `activar-cuenta.dc.html`: icono 58px, "Bienvenida a OpenDayCare", tarjeta con avatar "M" y "Mateo · Sala Soles", código "7K4P9" con letter-spacing 3px, email `lucia.fernandez@gmail.com`, contraseña pre-cargada y consentimiento sobre `#FBF1D6` con caja verde `#5FB97E`.
- [ ] El checkbox de autorización alterna marcado/desmarcado al hacer clic (arranca marcado) y "Activar mi cuenta" queda `href="#"` sin navegar.
- [ ] "¿Ya tenés cuenta? Iniciar sesión" en `/activate-account` navega a `/login`.
- [ ] El cierre de sesión del sidebar (desktop) y del drawer (móvil) navega a `/login` desde `/` y `/kids`.
- [ ] En viewport <768px: `/login` oculta el panel coral y muestra el logo compacto sobre el formulario; `/activate-account` se ve en columna única sin desbordes.
- [ ] Todos los identificadores del código en inglés; los textos visibles en español.

## Decisiones

- **Sí:** route group `(auth)` como carpeta agrupadora sin layout propio — URLs sin prefijo (elección del usuario). **No:** carpeta `auth/` normal (generaría `/auth/login`).
- **Sí:** eliminar el bloque "INGRESO COMO" por completo (petición explícita). **No:** dejarlo deshabilitado u oculto con CSS.
- **Sí:** botón "Iniciar sesión" navega a `/` — sin selector, el login asume el lado personal (única pantalla post-login existente).
- **Sí:** logout del sidebar enlazado a `/login` en `SidebarContent` — un solo cambio cubre desktop y drawer.
- **Sí:** "Activar mi cuenta" con `href="#"` hasta que exista `familia-feed`; mismo criterio que specs 01/02 con pantallas inexistentes.
- **Sí:** inputs pre-cargados con los valores de la referencia (incluida la contraseña "contraseña" de activar-cuenta) — réplica visual exacta.
- **Sí:** checkbox toggléable como único estado interactivo (como el buscador del spec 02). **No:** validación de campos en cliente — va en el spec de autenticación real.
- **Sí:** estado desmarcado del checkbox = caja blanca con borde `#EADFD0` (mismo lenguaje de los inputs); la referencia solo define el estado marcado.
- **Sí:** móvil del login oculta el panel coral y muestra logo compacto (elección del usuario). **No:** apilar ambos paneles.
- **Sí:** segmento `/activate-account`, más descriptivo que `/activate` (elección del usuario).
- **Sí:** `src/data/auth.ts` tipado, siguiendo el patrón de `feed.ts`/`children.ts`.

## Riesgos

| Riesgo                                                                   | Mitigación                                                                                          |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| Next.js 16 cambió el comportamiento de route groups y layouts            | Leer `node_modules/next/dist/docs/` antes de escribir código (paso 1).                              |
| Gradientes, círculos absolutos y letter-spacing pueden desviar el visual | Capturas comparativas contra ambas referencias en `.playwright-mcp/` (paso final).                  |
| El checkbox desmarcado no existe en la referencia (estilo inventado)     | Reutilizar el lenguaje visual de los inputs (blanco + borde #EADFD0, radio 8px); decisión registrada. |

## Lo que **no** está en este spec

- Autenticación real (credenciales, sesiones, cookies, base de datos, validación).
- Pantalla `familia-feed` y flujo de reseteo de contraseña.
- Protección de rutas / redirecciones (`/` sigue sin requerir login).
- Selector de rol Personal/Familia (eliminado a pedido del usuario).
- Resto de las pantallas de `src/references/pantallas/`.

Cada una de esas, si llega, va en su propio spec.
