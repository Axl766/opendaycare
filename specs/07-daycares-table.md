# Spec 07 — Tabla `daycares`

**State:** Implemented
**Depends on:** —  
**Date:** 2026-10-02  
**Objective:** Crear la tabla `daycares` como entidad raíz del sistema, aplicando el patrón de migraciones del proyecto, con RLS activado y políticas básicas de seguridad.

---

## Scope

**In:**

- Migración SQL versionada en `/migrations/` con numeración secuencial (siguiendo el patrón del proyecto)
- Tabla `daycares` con columnas: `id` (uuid PK), `name` (text), `created_at` (timestamptz)
- RLS activado en la tabla
- Políticas básicas: lectura pública (anon), escritura solo para authenticated
- Impacto en Supabase (aplicar la migración contra la base de datos del proyecto)
- Verificación de que la tabla y sus políticas existen

**Out:**

- ENUMs (`user_role`, `user_status`, `relationship_type`, `invitation_status`, `post_type`, `child_status`) — specs posteriores
- Trigger `AFTER INSERT` en `auth.users` — spec de `users` (Spec 03 cubre login/activación; el perfil va aparte)
- Tablas dependientes (`users`, `rooms`, `children`, etc.) — specs posteriores
- Datos de prueba o seeders

---

## Data model

**Tabla `daycares`:**

| Campo        | Tipo          | Notas                       |
| ------------ | ------------- | --------------------------- |
| `id`         | `uuid` PK     | Default `gen_random_uuid()` |
| `name`       | `text`        | Nombre de la guardería      |
| `created_at` | `timestamptz` | Default `now()`             |

**Políticas RLS:**

1. **SELECT (anon):** cualquiera puede leer guarderías
2. **INSERT (authenticated):** solo usuarios autenticados pueden crear guarderías
3. **UPDATE (authenticated):** solo usuarios autenticados pueden actualizar guarderías
4. **DELETE (authenticated):** solo usuarios autenticados pueden eliminar guarderías

> Nota: políticas más granulares (ej. "solo el admin del daycare puede actualizar") se añadirán cuando exista la tabla `users` con roles.

---

## Implementation plan

1. **Crear carpeta `/migrations/`** si no existe
2. **Crear archivo de migración** `migrations/001_create_daycares.sql` con:
   - `CREATE TABLE daycares` con columnas y defaults
   - `ALTER TABLE daycares ENABLE ROW LEVEL SECURITY`
   - `CREATE POLICY` para SELECT (anon)
   - `CREATE POLICY` para INSERT (authenticated)
   - `CREATE POLICY` para UPDATE (authenticated)
   - `CREATE POLICY` para DELETE (authenticated)
3. **Aplicar la migración contra Supabase** — iterar con `execute_sql` (MCP) según las reglas del proyecto; la migración queda como archivo versionado en `/migrations/`
4. **Verificar tabla** con query a `information_schema.tables` (`SELECT * FROM information_schema.tables WHERE table_name = 'daycares'`)
5. **Verificar políticas RLS** con query a `pg_policies`
6. **Correr advisors de seguridad** (MCP `supabase_get_advisors`) y confirmar que no hay alertas nuevas por esta tabla

---

## Acceptance criteria

- [x] Existe archivo `migrations/001_create_daycares.sql`
- [x] Tabla `daycares` existe en Supabase
- [x] Columnas: `id` (uuid PK, default `gen_random_uuid()`), `name` (text), `created_at` (timestamptz, default `now()`)
- [x] RLS activado en la tabla
- [x] Política SELECT permite lectura a anon y authenticated
- [x] Política INSERT requiere authenticated
- [x] Política UPDATE tiene USING + WITH CHECK y requiere authenticated
- [x] Política DELETE requiere authenticated
- [x] Query de verificación confirma que la tabla y las 4 políticas existen
- [x] Advisors de seguridad sin alertas nuevas por esta tabla

---

## Decisions taken and discarded

**Decisión:** Usar migraciones en `/migrations/` con numeración secuencial (001, 002, etc.).  
**Justificación:** El usuario eligió el patrón de migraciones para impactar Supabase. Numeración secuencial es más legible que timestamps largos.

**Decisión:** Solo crear tabla `daycares` sin ENUMs ni triggers.  
**Justificación:** Enfoque iterativo. Los ENUMs y triggers dependen de otras tablas (`users`, `roles`). Crear todo de una vez mezcla responsabilidades y dificulta el debugging.

**Decisión:** RLS activado desde el inicio con políticas básicas.  
**Justificación:** Sigue las reglas del proyecto (AGENTS.md: "RLS activado en todas las tablas expuestas"). Políticas granulares se añadirán cuando haya roles definidos.

**Decisión:** Aplicar SQL al proyecto vía `execute_sql` (MCP), no vía `apply_migration`.  
**Justificación:** Regla explícita de AGENTS.md: `apply_migration` escribe historial de migración en cada llamada; para iterar se usa `execute_sql`. El archivo en `/migrations/` es el registro versionado del patrón.

**Descartado:** Incluir trigger `AFTER INSERT` en `auth.users` que crea perfil automáticamente.  
**Justificación:** Ese trigger depende de la tabla `users` y de `raw_user_meta_data`. Va en el spec de `users`, no aquí.

**Descartado:** Usar migraciones con timestamp (ej. `20261002143021_create_daycares.sql`).  
**Justificación:** Más verboso y difícil de seguir manualmente. Secuencial es suficiente para este proyecto.

---

## Identified risks

**Riesgo:** Políticas RLS demasiado permisivas (cualquier authenticated puede UPDATE/DELETE cualquier daycare).  
**Mitigación:** Aceptable para esta primera iteración. Cuando exista `users` con roles, añadir políticas granulares: "solo admin del daycare puede modificar".

**Riesgo:** No hay forma de auditar quién creó/modificó una guardería.  
**Mitigación:** Fuera de scope para esta tabla. Si se necesita, añadir columnas `created_by` / `updated_by` en spec posterior cuando exista `users`.
