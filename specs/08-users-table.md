# Spec 08 — Tabla `users` y enums de dominio

**State:** Implemented
**Depends on:** Spec 07 (tabla `daycares`)  
**Date:** 2026-10-02  
**Objective:** Crear la tabla `users` vinculada a Supabase Auth, los enums `user_role` y `user_status`, el trigger que crea perfiles automáticamente, políticas RLS y un usuario staff de prueba.

---

## Scope

**In:**

- Enums `user_role` (`staff`, `parent`, `admin`) y `user_status` (`pending`, `active`) como tipos PostgreSQL
- Migración SQL versionada en `/migrations/` (siguiendo el patrón del spec 07)
- Tabla `users` con columnas: `id` (uuid PK, FK a `auth.users`), `daycare_id` (uuid FK a `daycares`), `role` (`user_role`), `status` (`user_status` default `active`), `full_name` (text), `avatar_url` (text nullable), `notify_on_post` (boolean default true), `daily_summary_enabled` (boolean default true), `created_at` / `updated_at` (timestamptz)
- Trigger `AFTER INSERT` en `auth.users` con función `SECURITY DEFINER` que crea el perfil automáticamente usando `raw_user_meta_data`
- RLS activado en la tabla
- Políticas RLS: lectura para authenticated (solo su propio usuario), escritura para authenticated (solo su propio usuario o staff/admin según operación)
- Usuario staff de prueba insertado manualmente (para desarrollo)
- Verificación con queries directas

**Out:**

- Otros enums (`relationship_type`, `invitation_status`, `post_type`, `child_status`) — specs posteriores
- Tablas dependientes (`rooms`, `children`, `parent_children`, etc.) — specs posteriores
- Flujos de UI (login real, activación, invitaciones) — specs posteriores
- Auditoría de acciones (`created_by`, `updated_by`) — fuera de scope

---

## Data model

**Enums:**

```sql
CREATE TYPE user_role AS ENUM ('staff', 'parent', 'admin');
CREATE TYPE user_status AS ENUM ('pending', 'active');
```

**Tabla `users`:**

| Campo                       | Tipo                     | Notas                                                                  |
| --------------------------- | ------------------------ | ---------------------------------------------------------------------- |
| `id`                        | `uuid` PK                | FK → `auth.users(id)` ON DELETE CASCADE. Mismo UUID que Supabase Auth. |
| `daycare_id`                | `uuid` FK → `daycares`   |                                                                        |
| `role`                      | `user_role`              | `staff` / `parent` / `admin`.                                          |
| `status`                    | `user_status`            | Default `active`.                                                      |
| `full_name`                 | `text`                   |                                                                        |
| `avatar_url`                | `text`                   | Nullable.                                                              |
| `notify_on_post`            | `boolean` default `true` | Avisos cuando publican.                                                |
| `daily_summary_enabled`     | `boolean` default `true` | Resumen diario (19:00).                                                |
| `created_at` / `updated_at` | `timestamptz`            | Default `now()`.                                                       |

**Trigger y función:**

```sql
-- Función SECURITY DEFINER (bypass RLS) que crea el perfil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, daycare_id, role, full_name)
  VALUES (
    NEW.id,
    (NEW.raw_user_meta_data->>'daycare_id')::uuid,
    (NEW.raw_user_meta_data->>'role')::user_role,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger AFTER INSERT en auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

**Políticas RLS:**

1. **SELECT (authenticated):** usuarios autenticados pueden leer solo su propio perfil (`auth.uid() = id`)
2. **INSERT (authenticated):** usuarios autenticados pueden crear su propio perfil (`auth.uid() = id`)
3. **UPDATE (authenticated):** usuarios autenticados pueden actualizar solo su propio perfil (`auth.uid() = id` en USING y WITH CHECK)
4. **DELETE (authenticated):** solo usuarios autenticados pueden eliminar su propio perfil (`auth.uid() = id`)

> Nota: políticas más granulares (ej. "staff puede leer todos los usuarios del mismo daycare") se añadirán cuando existan más tablas y flujos.

---

## Implementation plan

1. **Crear archivo de migración** `migrations/002_create_users_and_enums.sql` con:
   - `CREATE TYPE user_role AS ENUM (...)`
   - `CREATE TYPE user_status AS ENUM (...)`
   - `CREATE TABLE users` con columnas, FKs y defaults
   - `ALTER TABLE users ENABLE ROW LEVEL SECURITY`
   - `CREATE POLICY` para SELECT, INSERT, UPDATE, DELETE
   - `CREATE FUNCTION handle_new_user()` con `SECURITY DEFINER`
   - `CREATE TRIGGER on_auth_user_created`
2. **Aplicar la migración contra Supabase** — iterar con `execute_sql` (MCP) según las reglas del proyecto; la migración queda como archivo versionado en `/migrations/`
3. **Verificar enums** con query a `pg_enum` (`SELECT * FROM pg_enum WHERE enumtypid IN (SELECT oid FROM pg_type WHERE typname IN ('user_role', 'user_status'))`)
4. **Verificar tabla** con query a `information_schema.tables` (`SELECT * FROM information_schema.tables WHERE table_name = 'users'`)
5. **Verificar columnas** con query a `information_schema.columns` (confirmar tipos, FKs y defaults)
6. **Verificar políticas RLS** con query a `pg_policies`
7. **Verificar trigger** con query a `pg_trigger` (confirmar que existe y está asociado a `auth.users`)
8. **Insertar usuario staff de prueba** manualmente (usando un UUID de `auth.users` existente o creando uno temporal):
   ```sql
   INSERT INTO users (id, daycare_id, role, full_name)
   VALUES (
     '<uuid-de-auth-user>',
     '<daycare-id-del-spec-07>',
     'staff',
     'Caro Admin'
   );
   ```
9. **Verificar usuario staff** con `SELECT * FROM users WHERE role = 'staff'`
10. **Correr advisors de seguridad** (MCP `supabase_get_advisors`) y confirmar que no hay alertas nuevas por esta tabla

---

## Acceptance criteria

- [x] Existe archivo `migrations/002_create_users_and_enums.sql`
- [x] Enum `user_role` existe con valores `staff`, `parent`, `admin`
- [x] Enum `user_status` existe con valores `pending`, `active`
- [x] Tabla `users` existe en Supabase
- [x] Columna `id` es uuid PK con FK a `auth.users(id)` ON DELETE CASCADE
- [x] Columna `daycare_id` es uuid FK a `daycares(id)`
- [x] Columna `role` es tipo `user_role`
- [x] Columna `status` es tipo `user_status` con default `active`
- [x] Columnas `full_name`, `avatar_url` (nullable), `notify_on_post` (default true), `daily_summary_enabled` (default true), `created_at`, `updated_at` existen con tipos correctos
- [x] RLS activado en la tabla
- [x] Política SELECT requiere authenticated y filtra por `auth.uid() = id`
- [x] Política INSERT requiere authenticated y valida `auth.uid() = id`
- [x] Política UPDATE tiene USING + WITH CHECK y requiere `auth.uid() = id`
- [x] Política DELETE requiere authenticated y filtra por `auth.uid() = id`
- [x] Función `handle_new_user()` existe con `SECURITY DEFINER`
- [x] Trigger `on_auth_user_created` existe y está asociado a `auth.users`
- [x] Usuario staff de prueba existe en la tabla
- [x] Query de verificación confirma enums, tabla, columnas, políticas, trigger y usuario staff
- [x] Advisors de seguridad sin alertas nuevas por esta tabla

---

## Decisions taken and discarded

**Decisión:** Usar `CREATE TYPE ... AS ENUM` para `user_role` y `user_status`.  
**Justificación:** El schema de referencia define estos enums. Tipos PostgreSQL nativos son más eficientes que tablas de lookup para conjuntos pequeños y fijos de valores.

**Decisión:** Trigger `AFTER INSERT` en `auth.users` con función `SECURITY DEFINER`.  
**Justificación:** El schema lo especifica explícitamente. `SECURITY DEFINER` es necesario porque el trigger debe insertar en `public.users` bypassando RLS. Los metadatos (`daycare_id`, `role`, `full_name`) se pasan vía `raw_user_meta_data` en el signup.

**Decisión:** Políticas RLS básicas (solo ownership con `auth.uid()`).  
**Justificación:** Sigue las reglas del proyecto (AGENTS.md: "políticas UPDATE necesitan USING + WITH CHECK", "TO authenticated solo no basta"). Políticas más granulares (ej. "staff puede leer todos los usuarios del daycare") se añadirán cuando existan más tablas y flujos.

**Decisión:** Usuario staff de prueba insertado manualmente.  
**Justificación:** El usuario lo pidió explícitamente para desarrollo. En producción, los usuarios se crearán vía signup + trigger.

**Decisión:** Migración en `/migrations/` con numeración secuencial (002).  
**Justificación:** Sigue el patrón del spec 07. Secuencial es más legible que timestamps.

**Decisión:** Aplicar SQL al proyecto vía `execute_sql` (MCP), no vía `apply_migration`.  
**Justificación:** Regla explícita de AGENTS.md: `apply_migration` escribe historial de migración en cada llamada; para iterar se usa `execute_sql`. El archivo en `/migrations/` es el registro versionado.

**Descartado:** Incluir otros enums (`relationship_type`, `invitation_status`, `post_type`, `child_status`).  
**Justificación:** Enfoque iterativo. Esos enums se usan en otras tablas (`parent_children`, `invitations`, `posts`, `children`). Crearlos ahora sin las tablas correspondientes mezcla responsabilidades.

**Descartado:** Políticas RLS granulares (ej. "staff puede leer todos los usuarios del daycare").  
**Justificación:** Requiere joins y lógica adicional. Se añadirán cuando existan más tablas y flujos. Por ahora, ownership básico es suficiente.

**Descartado:** Auditoría de acciones (`created_by`, `updated_by`).  
**Justificación:** Fuera de scope para esta iteración. Si se necesita, se añadirá en un spec posterior.

---

## Identified risks

**Riesgo:** `SECURITY DEFINER` en la función del trigger es un bypass de RLS.  
**Mitigación:** Es el patrón recomendado por Supabase para triggers. La función solo inserta en `public.users` y no expone endpoints públicos. El riesgo es aceptable si la función no se modifica para incluir lógica adicional.

**Riesgo:** Si `raw_user_meta_data` no contiene `daycare_id`, `role` o `full_name`, el trigger fallará.  
**Mitigación:** El signup debe incluir estos campos en `raw_user_meta_data`. Si faltan, el trigger fallará y el usuario no se creará. Esto es aceptable para ahora; en un spec posterior se puede añadir validación o defaults.

**Riesgo:** Políticas RLS demasiado restrictivas (solo ownership) pueden dificultar flujos como "staff ve la lista de padres".  
**Mitigación:** Aceptable para esta iteración. Cuando existan más tablas y flujos, se añadirán políticas granulares.

**Riesgo:** El usuario staff de prueba usa un UUID de `auth.users` que puede no existir.  
**Mitigación:** Antes de insertar, verificar que el UUID existe en `auth.users` o crearlo manualmente. Si no existe, el INSERT fallará por la FK.
