# SPEC 11 — Flujo real de invitación a padres (correo + activación + vinculación)

> **State:** Draft
> **Depends on:** SPEC 05 (modal visual vincular padre), SPEC 09 (autenticación real), SPEC 10 (CRUD niños, tablas `rooms` y `children`)
> **Date:** 2026-10-04
> **Objective:** Conectar el modal de vincular padre al flujo completo: generar código de invitación, enviar correo con Resend, y permitir al padre registrarse en `/activate-account` con ese código para crear la vinculación persistente `parent_children`.

---

## Scope

**In:**

- Migración: tabla `parent_children` (id, parent_id FK, child_id FK, relationship, created_at, UNIQUE parent_id + child_id) con RLS y políticas
- Migración: tabla `invitations` (id, child_id FK, invited_by FK, full_name, email, relationship, code UNIQUE, status invitation_status, expires_at, accepted_at, created_at) con RLS y políticas
- Migración: ENUM `invitation_status` (`pending`, `accepted`, `expired`, `cancelled`)
- Migración: ENUM `relationship_type` (`father`, `mother`, `guardian`)
- Instalación del paquete `resend` en el proyecto (pnpm)
- Variable de entorno `RESEND_API_KEY` en `.env.local`
- Route Handler `src/app/api/send-invitation/route.ts` que: recibe `child_id`, `full_name`, `email`, `relationship`, genera código alfanumérico de 5 caracteres, calcula `expires_at` (7 días), inserta fila en `invitations` con status `pending`, envía correo vía Resend con saludo personalizado + código + link a `/activate-account?code={code}`
- Refactor de `LinkParentModal.tsx`: al enviar formulario válido, invocar Server Action `sendInvitation`; al éxito, mostrar mensaje de confirmación (no cerrar inmediatamente), manejar errores (email duplicado, error de Resend)
- Server Action `sendInvitation` en `src/app/actions/invitations.ts`: valida permisos del staff, invoca la lógica del Route Handler directamente (sin fetch), retorna resultado
- Refactor de `activate-account/page.tsx`: leer `?code=` de URL, consultar invitación en BD; si es válida, mostrar formulario con campos pre-llenados (nombre, email del invitado, código); al enviar: si email ya existe en `auth.users` → vincular directamente (crear `parent_children`, marcar invitación `accepted`); si no existe → `supabase.auth.signUp()`, crear fila en `users` (trigger), crear `parent_children`, marcar invitación `accepted`
- Server Action `activateAccount` en `src/app/actions/invitations.ts`: recibe código + contraseña + consentimiento; valida invitación (existencia, expiración, status); ejecuta signUp o vinculación directa; redirige a `/` al éxito
- Manejo de estados de error en `/activate-account`: código inválido, código expirado, código ya usado, error de Supabase Auth
- Configuración del trigger `AFTER INSERT ON auth.users` que crea fila en `users` (si no existe ya del Spec 08)
- Convención de idioma: BD en inglés, UI visible en español

**Out of scope (para specs futuros):**

- Feed del padre filtrado por `parent_children`
- Resumen diario (`daily_summaries`)
- Publicaciones (`posts`, `post_children`)
- Gestión/eliminación de padres ya vinculados
- Reenvío de invitación si expiró
- Cancelación manual de invitación por staff
- Flujo "¿Olvidaste tu contraseña?"
- Roles y permisos granulares en la UI
- Notificaciones push

---

## Data model

**ENUMs:**

```sql
CREATE TYPE invitation_status AS ENUM ('pending', 'accepted', 'expired', 'cancelled');
CREATE TYPE relationship_type AS ENUM ('father', 'mother', 'guardian');
```

**Tabla `parent_children`:**

| Campo          | Tipo                   | Notas                            |
| -------------- | ---------------------- | -------------------------------- |
| `id`           | `uuid` PK              | Default `gen_random_uuid()`      |
| `parent_id`    | `uuid` FK → `users`    |                                  |
| `child_id`     | `uuid` FK → `children` |                                  |
| `relationship` | `relationship_type`    |                                  |
| `created_at`   | `timestamptz`          | Default `now()`                  |
|                |                        | UNIQUE (`parent_id`, `child_id`) |

Políticas RLS: SELECT / INSERT / UPDATE / DELETE para authenticated.

**Tabla `invitations`:**

| Campo          | Tipo                   | Notas                                   |
| -------------- | ---------------------- | --------------------------------------- |
| `id`           | `uuid` PK              | Default `gen_random_uuid()`             |
| `child_id`     | `uuid` FK → `children` |                                         |
| `invited_by`   | `uuid` FK → `users`    | Staff que invita                        |
| `full_name`    | `text`                 | Nombre del padre/tutor                  |
| `email`        | `text`                 |                                         |
| `relationship` | `relationship_type`    |                                         |
| `code`         | `text` UNIQUE          | 5 caracteres alfanuméricos, ej. `7K4P9` |
| `status`       | `invitation_status`    | Default `pending`                       |
| `expires_at`   | `timestamptz`          | 7 días desde creación                   |
| `accepted_at`  | `timestamptz`          | Nullable                                |
| `created_at`   | `timestamptz`          | Default `now()`                         |

Políticas RLS: SELECT / INSERT / UPDATE para authenticated.

**Mapping de parentesco (UI → BD):**

| UI (español) | BD (inglés) |
| ------------ | ----------- |
| Mamá         | `mother`    |
| Papá         | `father`    |
| Tutor/a      | `guardian`  |

---

## Implementation plan

1. **Cargar skill `supabase`** antes de cualquier operación de BD (requisito de AGENTS.md).
2. **Migración: crear ENUMs y tablas.** Crear archivo `migrations/006_create_invitations_and_parent_children.sql` con: ENUMs, tabla `parent_children`, tabla `invitations`, RLS, políticas. Aplicar con `supabase_execute_sql` (iterar si falla), verificar con query a `information_schema` y `pg_policies`.
3. **Instalar Resend.** `pnpm add resend`. Agregar `RESEND_API_KEY=...` en `.env.local` (el usuario debe obtener la key de resend.com).
4. **Crear helper de Resend** `src/lib/resend.ts`: instancia del cliente Resend con la API key desde env vars, función `sendInvitationEmail(to, childName, code, expiresAt)` que envía correo con template HTML simple (saludo personalizado, código visible, link a activación, aviso de expiración).
5. **Crear Route Handler** `src/app/api/send-invitation/route.ts`: método POST, valida cuerpo (child_id, full_name, email, relationship), genera código alfanumérico de 5 caracteres, calcula `expires_at` (7 días), inserta en `invitations`, invoca `sendInvitationEmail()`, retorna `{ success: true, invitationId }` o `{ error }`. Proteger con verificación de sesión (staff).
6. **Crear Server Action** `sendInvitation` en `src/app/actions/invitations.ts`: extrae datos del FormData, valida permisos del usuario actual (debe ser staff o admin), invoca la lógica del Route Handler directamente (sin fetch), retorna `{ error }` si falla, `{ success }` si OK.
7. **Refactor de `LinkParentModal.tsx`**: reemplazar envío en memoria por `useActionState(sendInvitation, undefined)`. Al éxito: mostrar mensaje "Invitación enviada a {email}. Vence en 7 días." y cerrar modal tras 3 segundos. Manejar estados de error (email inválido, error de Resend, child_id inexistente).
8. **Refactor de `activate-account/page.tsx`**: leer `?code=` del searchParams en server component; si hay código, consultar invitación en BD (`SELECT * FROM invitations WHERE code = $1`); si existe y es `pending` y no expiró: mostrar formulario con campos pre-llenados (nombre, email, código readonly), campo contraseña, checkbox consentimiento. Si no hay código o es inválido/expirado: mostrar mensaje de error amigable.
9. **Crear Server Action `activateAccount`** en `src/app/actions/invitations.ts`: recibe código + contraseña + consentimiento; consulta invitación; valida (existencia, expiración, status); si email ya existe en `auth.users` → crear `parent_children` + marcar invitación `accepted`; si no existe → `supabase.auth.signUp(email, password)` con `raw_user_meta_data` (daycare_id, role: parent, full_name, child_id, relationship), crear `parent_children`, marcar invitación `accepted`; redirigir a `/` al éxito, retornar `{ error }` si falla.
10. **Trigger `users` (si no existe del Spec 08):** verificar si el trigger `AFTER INSERT ON auth.users` ya crea fila en `users`. Si no existe, crear función `handle_new_user()` `SECURITY DEFINER` que lee `raw_user_meta_data` y hace INSERT en `users`. Aplicar con `supabase_execute_sql`.
11. **Verificar:** `pnpm build` sin errores. Pruebas manuales: (a) staff abre modal, envía invitación, correo llega (Resend sandbox), (b) padre hace clic en link, llega a `/activate-account?code=XXXXX` con datos pre-llenados, (c) padre crea contraseña y se registra, (d) vinculación se crea en `parent_children`, invitación marcada `accepted`, (e) login del padre funciona, (f) código inválido/expirado muestra error claro.
12. **Advisors de seguridad:** correr advisors, verificar que no haya alertas nuevas por estas tablas.

---

## Acceptance criteria

- [ ] `pnpm build` completa sin errores.
- [ ] Tabla `parent_children` existe en Supabase con RLS activado y políticas (SELECT, INSERT, UPDATE, DELETE para authenticated).
- [ ] Tabla `invitations` existe en Supabase con RLS activado y políticas (SELECT, INSERT, UPDATE para authenticated).
- [ ] ENUM `invitation_status` existe con valores `pending`, `accepted`, `expired`, `cancelled`.
- [ ] ENUM `relationship_type` existe con valores `father`, `mother`, `guardian`.
- [ ] El paquete `resend` está instalado en `package.json`.
- [ ] La variable `RESEND_API_KEY` existe en `.env.local`.
- [ ] `src/lib/resend.ts` exporta función `sendInvitationEmail()` que invoca la API de Resend.
- [ ] `src/app/api/send-invitation/route.ts` acepta POST, valida permisos, genera código, guarda invitación, envía correo.
- [ ] El correo enviado incluye: saludo personalizado ("Te invitaron a seguir a {nombre del niño}"), código de 5 caracteres visible, link a `/activate-account?code={code}`, texto "Este código vence en 7 días".
- [ ] `LinkParentModal` al enviar válido: cierra el modal tras 3 segundos con mensaje "Invitación enviada a {email}. Vence en 7 días."
- [ ] `LinkParentModal` maneja errores: email inválido → mensaje visible, error de Resend → mensaje visible, sin cerrar.
- [ ] `/activate-account?code=XXXXX` con código válido muestra formulario con campos pre-llenados (nombre, email, código readonly), contraseña y consentimiento.
- [ ] `/activate-account?code=XXXXX` con código inválido/expirado muestra mensaje de error amigable (no muestra formulario).
- [ ] Server Action `activateAccount` con email nuevo: crea usuario en Supabase Auth, crea fila en `users` (vía trigger), crea `parent_children`, marca invitación `accepted`, redirige a `/`.
- [ ] Server Action `activateAccount` con email existente: crea `parent_children`, marca invitación `accepted`, redirige a `/`.
- [ ] Login del padre recién registrado funciona (email + password).
- [ ] Advisors de seguridad sin alertas nuevas por estas tablas.
- [ ] Los identificadores del código están en inglés; los textos visibles en la UI están en español.

---

## Decisions

- **Sí:** Route Handler de Next.js para envío de correo (no Edge Function de Supabase). **Justificación:** es más simple, ya estamos en el Server Action, no requiere deploy separado. El Route Handler puede invocar lógica directamente sin fetch.
- **Sí:** Reutilizar `LinkParentModal` del Spec 05. **Justificación:** el modal visual ya existe; solo necesitamos reemplazar el envío en memoria por envío real. Evita duplicar código.
- **Sí:** Reutilizar `/activate-account` del Spec 03. **Justificación:** la página visual ya existe; solo necesitamos conectarla al flujo real. Evita crear nueva página.
- **Sí:** Si email ya existe en `auth.users` → vincular directamente sin crear usuario nuevo. **Justificación:** si el padre ya tiene cuenta, no tiene sentido crear otra; solo falta la vinculación `parent_children`.
- **Sí:** Código de 5 caracteres alfanuméricos (ej. `7K4P9`). **Justificación:** ya está en el diseño visual del Spec 05; mantener consistencia.
- **Sí:** Expiración de 7 días. **Justificación:** ya está en el texto visual "Vence en 7 días" del Spec 05.
- **Sí:** Correo con saludo personalizado + código + link + aviso de expiración. **Justificación:** elección del usuario. Template HTML simple (no se necesita diseño complejo).
- **Sí:** Trigger `AFTER INSERT ON auth.users` para crear fila en `users`. **Justificación:** ya definido en el schema de referencia. Si no existe del Spec 08, crearlo.
- **Sí:** Tablas `parent_children` e `invitations` siguiendo el schema de referencia. **Justificación:** consistencia con el diseño de BD.
- **No:** Edge Function de Supabase para envío de correo. **Justificación:** overengineering para este caso; Route Handler es suficiente.
- **No:** Gestión/eliminación de padres ya vinculados. **Justificación:** fuera de scope.
- **No:** Reenvío de invitación si expiró. **Justificación:** fuera de scope.
- **No:** Feed del padre filtrado. **Justificación:** fuera de scope.

---

## Risks

| Riesgo                                                                                                      | Mitigación                                                                                                                    |
| ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Resend requiere API key válida y configuración de dominio remitente                                         | El usuario debe obtener key de resend.com. En sandbox, el correo solo se envía a emails verificados. Para producción, verificar dominio. |
| El trigger `AFTER INSERT ON auth.users` puede fallar si `raw_user_meta_data` no tiene los campos requeridos | Manejar error en el trigger (log + rollback). Verificar que `signUp()` pasa todos los campos requeridos.                       |
| Si el padre ya tiene cuenta y el staff intenta vincularlo de nuevo, puede haber conflicto                    | Server Action detecta email existente y hace vinculación directa. Si ya está vinculado al niño, retorna error claro.           |
| El código de invitación puede ser adivinado si es predecible                                                | Generar código aleatorio criptográficamente seguro (crypto.randomBytes). 5 caracteres alfanuméricos = 60^5 combinaciones, suficiente. |
| La página `/activate-account` puede recibir código inválido o expirado                                      | Mostrar mensaje de error amigable (no formulario). Sugerir contactar al staff para nueva invitación.                          |
| Migraciones aplicadas a Supabase sin entorno local pueden ser difíciles de revertir                         | Cada migración es idempotente por diseño; si falla, se corrige con nuevas migraciones. Verificar con queries antes de avanzar. |
| `resend` es paquete externo; puede tener breaking changes                                                   | Fijar versión en `package.json`. Leer changelog antes de actualizar.                                                          |

---

## Lo que **no** está en este spec

- Feed del padre filtrado por `parent_children`.
- Resumen diario (`daily_summaries`).
- Publicaciones (`posts`, `post_children`).
- Gestión/eliminación de padres ya vinculados.
- Reenvío de invitación si expiró.
- Cancelación manual de invitación por staff.
- Flujo "¿Olvidaste tu contraseña?".
- Roles y permisos granulares en la UI.
- Notificaciones push.

Cada una de esas, si llega, va en su propio spec.
