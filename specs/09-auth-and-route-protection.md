# SPEC 09 — Autenticación real (login) y protección de rutas

> **State:** Approved
> **Depends on:** SPEC 03 (páginas visuales de login/activación), SPEC 07 (tabla `daycares`), SPEC 08 (tabla `users`)
> **Date:** 2026-10-03
> **Objective:** Conectar el login a Supabase Auth (email + password), proteger todas las rutas excepto `/login` y `/activate-account` con doble capa (proxy + `unauthorized()`), y agregar logout.

## Scope

**In:**

- Server Action `login` que invoque `supabase.auth.signInWithPassword()` y cree la sesión en cookies
- Server Action `logout` que invoque `supabase.auth.signOut()` y destruya la sesión
- Conversión del formulario de `/login` en client component con `useActionState` para mostrar errores
- Modificación de `src/utils/supabase/proxy.ts` para redirigir: sin sesión en ruta protegida → `/login`; con sesión en `/login` → `/`
- Data Access Layer `verifySession()` en `src/lib/auth.ts` que use `unauthorized()` de `next/navigation`
- Habilitar `experimental.authInterrupts: true` en `next.config.ts`
- Archivo `src/app/unauthorized.tsx` con UI 401 y link a `/login`
- Llamada a `verifySession()` en las páginas protegidas: `/`, `/kids`, `/kids/[childId]`
- Cambio del logout en `Sidebar.tsx`: de `<Link href="/login">` a botón que invoca Server Action `logout`

**Out of scope (para specs futuros):**

- Activación de cuenta real (crear usuario en Supabase desde `/activate-account`)
- Flujo "¿Olvidaste tu contraseña?"
- Validación de campos con Zod u otro schema
- Registro de nuevos usuarios (signup)
- Roles y permisos granulares en la UI
- Refresh token manual (ya lo hace `@supabase/ssr` automáticamente)

## Data model

No se crean tablas ni estructuras nuevas. Se reutiliza `auth.users` de Supabase Auth y la tabla `users` del SPEC 08.

La sesión se maneja vía cookies HTTP-only que `@supabase/ssr` gestiona automáticamente (`sb-*-auth-token`).

## Implementation plan

1. Habilitar `authInterrupts` en `next.config.ts`: agregar `experimental: { authInterrupts: true }`. Verificar que `pnpm build` no rompe.
2. Crear `src/lib/auth.ts` con la DAL: función `verifySession()` que crea el cliente Supabase (server), llama `getUser()`, y si no hay usuario invoca `unauthorized()`. Retorna `{ userId, email }`. Importar `'server-only'`.
3. Crear `src/app/actions/auth.ts` con dos Server Actions:
   - `login(state, formData)`: extrae email/password del FormData, valida que no estén vacíos (retorna `{ error }` si faltan), llama `signInWithPassword()`, retorna `{ error }` si falla, hace `redirect('/')` si succeede.
   - `logout()`: llama `signOut()` y hace `redirect('/login')`.
4. Crear `src/app/(auth)/login/LoginForm.tsx` como client component (`'use client'`): extrae el `<form>` de la página actual, usa `useActionState(login, undefined)` para manejar estado y pending, muestra mensaje de error de `state.error`, mantiene email `defaultValue={loginDefaults.email}`.
5. Modificar `src/app/(auth)/login/page.tsx`: reemplazar el `<form>`/`<input>`/`<button>` estáticos por `<LoginForm />`. El page sigue siendo server component (metadata intacta). Los labels y estructura visual permanecen fuera del LoginForm como wrappers según corresponda.
6. Modificar `src/utils/supabase/proxy.ts`: después de `getClaims()`, verificar `data?.claims?.sub` para determinar autenticación. Definir rutas públicas `['/login', '/activate-account']`. Si no hay sesión y la ruta no es pública → `NextResponse.redirect('/login')`. Si hay sesión y la ruta es `/login` → `NextResponse.redirect('/')`.
7. Crear `src/app/unauthorized.tsx`: UI con mensaje "401 — No autorizado", texto "Iniciá sesión para acceder", y link a `/login`. Seguir el lenguaje visual del proyecto (fondo `#FBF4EC`, fuentes display).
8. Agregar `verifySession()` en `src/app/page.tsx`: llamar al inicio del render. El tipo de retorno permite usar `session.userId` y `session.email` (no se usan aún en la UI, pero la verificación protege la ruta).
9. Agregar `verifySession()` en `src/app/kids/page.tsx` y `src/app/kids/[childId]/page.tsx`.
10. Modificar `src/components/Sidebar.tsx`: el botón de cierre de sesión deja de ser `<Link href="/login">` y pasa a ser un `<form>` con `<button>` que invoca `logout()` como Server Action. Mantener el mismo estilo visual.
11. Verificar: `pnpm build` sin errores. Pruebas manuales: (a) acceder a `/` sin sesión redirige a `/login`, (b) login con credenciales válidas redirige a `/`, (c) acceder a `/login` con sesión activa redirige a `/`, (d) logout redirige a `/login`, (e) credenciales inválidas muestran error en el formulario.

## Acceptance criteria

- [ ] `pnpm build` completa sin errores.
- [ ] `next.config.ts` tiene `experimental.authInterrupts: true`.
- [ ] Acceder a `/` sin sesión activa redirige a `/login`.
- [ ] Acceder a `/kids` sin sesión activa redirige a `/login`.
- [ ] Acceder a `/kids/[childId]` sin sesión activa redirige a `/login`.
- [ ] `/login` con email y password válidos (usuario existente en Supabase Auth) crea sesión y redirige a `/`.
- [ ] `/login` con credenciales inválidas muestra mensaje de error visible sin navegar.
- [ ] `/login` con sesión activa redirige a `/`.
- [ ] `/activate-account` sigue siendo accesible sin sesión (no redirige).
- [ ] El botón de cierre de sesión en el sidebar (desktop y drawer móvil) invoca `logout()`, destruye la sesión y redirige a `/login`.
- [ ] `src/app/unauthorized.tsx` existe y se renderiza cuando `unauthorized()` es invocado en el render path.
- [ ] `src/lib/auth.ts` exporta `verifySession()` que retorna `{ userId, email }` o lanza `unauthorized()`.
- [ ] `src/app/actions/auth.ts` exporta `login` y `logout` como Server Actions.
- [ ] El proxy (`src/utils/supabase/proxy.ts`) redirige basándose en la sesión y la ruta.
- [ ] Los textos visibles en la UI de login y unauthorized están en español; los identificadores de código en inglés.

## Decisions

- **Sí:** doble capa de protección — proxy (optimista, redirect basado en cookie) + `unauthorized()` en cada página (seguro, verifica con Supabase en el render path). **Justificación:** el proxy solo puede leer la cookie (no verifica contra Supabase); `unauthorized()` hace la verificación real. Juntos cubren ambos escenarios.
- **Sí:** `authInterrupts: true` en `next.config.ts` para habilitar `unauthorized()` y `forbidden()`. **Justificación:** requerido por Next.js 16 para usar estas APIs.
- **Sí:** DAL centralizada en `src/lib/auth.ts` con `verifySession()`. **Justificación:** sigue la recomendación de Next.js de centralizar la lógica de autorización; evita duplicar código en cada página.
- **Sí:** `LoginForm` como client component separado, page sigue siendo server component. **Justificación:** la page necesita metadata (server-only); el formulario necesita interactividad (client). Patrón recomendado.
- **Sí:** logout como Server Action en `<form>` dentro del Sidebar. **Justificación:** un `<Link>` no puede invocar una Server Action; el form puede estilarse para parecer un link/botón.
- **Sí:** rutas públicas definidas como array `['/login', '/activate-account']` en el proxy. **Justificación:** simple y explícito. Cualquier ruta que no esté en la lista requiere autenticación.
- **No:** validación de campos con Zod. **Justificación:** fuera de scope. Supabase Auth ya valida email/password y retorna errores. La validación de formato puede añadirse después.
- **No:** activación de cuenta real. **Justificación:** merece su propio spec (crear usuario, verificar código de invitación, etc.).
- **No:** flujo "¿Olvidaste tu contraseña?". **Justificación:** fuera de scope, requiere envío de emails y pantalla de reseteo.
- **No:** protección basada en roles en este spec. **Justificación:** la tabla `users` tiene `role` pero la verificación de roles se añadirá cuando haya rutas diferenciadas por rol.

## Risks

| Riesgo                                                                                                      | Mitigación                                                                                                        |
| ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `authInterrupts` es una API marcada como experimental en Next.js 16                                         | Es la API oficial para auth interrupts. El riesgo de breaking change en updates existe pero es aceptable.         |
| El proxy no puede verificar la sesión contra Supabase (solo lee la cookie)                                  | La capa de `unauthorized()` en cada página cubre este gap. El proxy es solo optimización de UX (redirect rápido). |
| Si la cookie de sesión está corrupta, el proxy puede no redirigir correctamente                             | `getClaims()` falla y `data?.claims?.sub` es undefined, lo que se trata como "no autenticado".                    |
| El Sidebar es parcialmente client component; invocar una Server Action desde un form puede requerir ajustes | El form con `action={logout}` funciona tanto en client como en server components en Next.js 16.                   |

## Lo que **no** está en este spec

- Activación de cuenta real (crear usuario en Supabase desde `/activate-account`).
- Flujo "¿Olvidaste tu contraseña?" (reset password).
- Validación de campos con Zod.
- Registro de nuevos usuarios (signup público).
- Protección de rutas por rol (staff/parent/admin).

Cada una de esas, si llega, va en su propio spec.
