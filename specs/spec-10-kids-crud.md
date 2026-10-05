# Spec 10 — Mantenimiento de niños (CRUD completo)

**State:** approved 
**Depends on:** Spec 07 (tabla `daycares`), Spec 08 (tabla `users`), Spec 09 (autenticación y protección de rutas)  
**Date:** 2026-10-04  
**Objective:** Conectar la pantalla `/kids` a Supabase creando las tablas `rooms` y `children`, poblando 3 rooms por defecto, e implementando el CRUD completo (crear, editar, archivar, listar, buscar, filtrar por sala) con set predefinido de alergias.

> **Nota de ubicación:** este spec está guardado como plan. Al aprobarse, se moverá a `specs/10-kids-crud.md`.

---

## Scope

**In:**

- Migración: ENUM `child_status` (`active`, `archived`)
- Migración: tabla `rooms` (id, daycare_id FK, name, created_at) con RLS y políticas
- Migración: tabla `children` (id, room_id FK, full_name, birth_date, enrolled_at, medical_notes, allergy_tags text[], photo_consent boolean, status child_status, created_at, updated_at) con RLS y políticas
- Migración de seed: 3 rooms (Soles, Lunas, Estrellas) asociados al daycare existente
- Server Actions en `src/app/actions/children.ts` para crear, editar y archivar niños
- DAL en `src/lib/children.ts` con funciones de lectura (lista con filtros, detalle por id, rooms)
- Refactor de `/kids` (`ChildrenBrowser`) para leer desde la BD en lugar de datos mock, con búsqueda por nombre y filtro por sala
- Refactor del `AddChildModal`: conexión al server action de crear, formulario completo con todos los campos, checkboxes de alergias predefinidos, `enrolled_at` autocompletado con la fecha actual como valor por defecto (editable)
- Nuevo `EditChildModal` (o reutilización del modal en modo edición) para editar todos los campos de un niño existente
- Acción de archivar niño (botón en el perfil con confirmación), cambia `status` a `archived` y lo oculta de la lista
- Refactor de `/kids/[childId]` para leer desde la BD
- `ChildCard` adaptado para consumir datos de la BD (edad calculada desde `birth_date`, sala desde `room`, resumen de padres desde `parent_children`)
- Eliminación de datos mock de niños en `src/data/children.ts` (se conservan solo tipos compartidos si los usan otros componentes)
- Adaptación móvil <768px para todos los modales y componentes nuevos
- Convención de idioma: BD en inglés, UI visible en español

**Out of scope (para specs futuros):**

- Gestión de rooms (crear/editar salas desde la UI)
- Vinculación de padres (`parent_children`)
- Resumen diario (`daily_summaries`)
- Feed y publicaciones
- Roles y permisos granulares (políticas RLS básicas para authenticated)
- Avatar/foto del niño
- Borrado físico
- Búsqueda por alergia o por fecha de cumpleaños
- Notificaciones

---

## Data model

**ENUM:**

```sql
CREATE TYPE child_status AS ENUM ('active', 'archived');
```

**Tabla `rooms`:**

| Campo        | Tipo                   | Notas                       |
| ------------ | ---------------------- | --------------------------- |
| `id`         | `uuid` PK              | Default `gen_random_uuid()` |
| `daycare_id` | `uuid` FK → `daycares` |                             |
| `name`       | `text`                 | Ej. "Soles".                |
| `created_at` | `timestamptz`          | Default `now()`             |

Políticas RLS: SELECT / INSERT / UPDATE / DELETE para authenticated.

**Tabla `children`:**

| Campo           | Tipo                     | Notas                                             |
| --------------- | ------------------------ | ------------------------------------------------- |
| `id`            | `uuid` PK                | Default `gen_random_uuid()`                       |
| `room_id`       | `uuid` FK → `rooms`      |                                                   |
| `full_name`     | `text`                   |                                                   |
| `birth_date`    | `date`                   |                                                   |
| `enrolled_at`   | `date`                   |                                                   |
| `medical_notes` | `text`                   | Nullable                                          |
| `allergy_tags`  | `text[]`                 | Default `{}`, valores en inglés (peanut, lactose) |
| `photo_consent` | `boolean`                | Default `true`                                    |
| `status`        | `child_status`           | Default `active`                                  |
| `created_at`    | `timestamptz`            | Default `now()`                                   |
| `updated_at`    | `timestamptz`            | Default `now()`                                   |

Políticas RLS: SELECT / INSERT / UPDATE / DELETE para authenticated. El filtro `status = 'active'` se aplica en la consulta, no en RLS.

**Set de alergias predefinido:**

| Valor BD      | Etiqueta UI    |
| ------------- | -------------- |
| `peanut`      | MANÍ           |
| `lactose`     | LACTOSA        |
| `gluten`      | GLUTEN         |
| `egg`         | HUEVO          |
| `soy`         | SOYA           |
| `shellfish`   | MARISCOS       |
| `tree_nuts`   | FRUTOS SECOS   |
| `fish`        | PESCADO        |

**Seed:**

```sql
INSERT INTO rooms (daycare_id, name) VALUES
  (<daycare_id>, 'Soles'),
  (<daycare_id>, 'Lunas'),
  (<daycare_id>, 'Estrellas');
```

---

## Implementation plan

1. **Leer guías de Next.js 16** en `node_modules/next/dist/docs/` (server components, server actions, rutas dinámicas) — requisito de AGENTS.md.
2. **Cargar el skill `supabase`** antes de cualquier operación contra la base de datos.
3. **Migración 003**: crear archivo `migrations/003_create_rooms.sql` con ENUM `child_status`, tabla `rooms`, RLS, políticas. Aplicar con `supabase_execute_sql` (iterar si falla), verificar con query a `information_schema` y `pg_policies`.
4. **Migración 004**: crear archivo `migrations/004_create_children.sql` con tabla `children`, RLS, políticas. Aplicar y verificar.
5. **Seed 005**: crear archivo `migrations/005_seed_rooms.sql` con el INSERT de 3 rooms. Aplicar y verificar con `SELECT * FROM rooms`.
6. **Crear DAL** `src/lib/children.ts` con funciones server-only:
   - `getRooms()`: lista todas las rooms
   - `getChildren({ roomFilter?, search? })`: lista niños `status = 'active'`, con filtro opcional por sala y búsqueda por nombre (ilike). Incluye conteo de padres vinculados vía `parent_children` (o devuelve 0 si la tabla no existe).
   - `getChildById(id)`: detalle de un niño (incluye datos de la room)
   - `createChild(data)`, `updateChild(id, data)`, `archiveChild(id)`: mutaciones
7. **Crear Server Actions** `src/app/actions/children.ts`:
   - `createChildAction(state, formData)`: valida campos (nombre obligatorio, fecha de nacimiento válida y no futura, sala requerida), calcula `enrolled_at` si no se provee (hoy), hace `insert` en Supabase, retorna `{ error }` o redirige
   - `updateChildAction(state, formData)`: misma validación, hace `update`
   - `archiveChildAction(state, formData)`: cambia `status` a `archived`
   - Validación manual (sin Zod), siguiendo el patrón del Spec 04 y Spec 09.
8. **Refactor de `src/data/children.ts`**: eliminar el array `children` de 8 niños mock. Conservar tipos compartidos (`LinkedParent`, `ChildAllergy`) solo si los usan otros componentes; migrar `rooms` a la BD.
9. **Refactor de `AddChildModal.tsx`**:
   - Conectar al `createChildAction` via `useActionState`
   - Campos: nombre completo, fecha de nacimiento (dd/mm/aaaa como hoy), sala (dropdown desde BD), alergias (8 checkboxes con labels en español), notas médicas (textarea), photo consent (checkbox), enrolled_at (input date con valor por defecto = hoy, editable)
   - Al guardar exitosamente: cerrar modal y redirigir a `/kids`
10. **Refactor de `ChildrenBrowser.tsx`**:
    - Leer datos desde `getChildren()` en el server component padre (page.tsx), pasar como prop
    - Búsqueda por nombre en cliente (filtrar la lista recibida)
    - Filtro por sala: dropdown con las rooms recibidas del server
    - Agrupar por sala (divisor "SALA {nombre} · {n} niños")
    - Empty state cuando no hay niños: mensaje amigable invitando a crear
11. **Refactor de `ChildCard.tsx`**: adaptar al nuevo tipo `Child` que viene de la BD (calcular edad desde `birth_date`, mostrar sala real, ajustar el pill derecho para mostrar alergia si existe)
12. **Crear `EditChildModal.tsx`**: mismo formulario que `AddChildModal` pero precargado con datos existentes, conectado a `updateChildAction`. Se abre desde el botón "Editar" del perfil.
13. **Acción de archivar en perfil**: botón "Archivar niño" en `/kids/[childId]`, con modal de confirmación, invoca `archiveChildAction` y redirige a `/kids`
14. **Refactor de `/kids/[childId]/page.tsx`**: eliminar `generateStaticParams` (ahora dinámico), usar `getChildById(childId)` desde la DAL, pasar `child` al header, info card, allergy notice y parents card. Botón "Editar" abre `EditChildModal`.
15. **Adaptación de componentes dependientes** (`ChildProfileHeader`, `ChildInfoCard`, `AllergyNotice`, `ParentsCard`) al nuevo tipo `Child`. `ParentsCard` por ahora muestra empty state si no hay padres vinculados (la vinculación va en otro spec).
16. **Verificar**: `pnpm build` sin errores. Pruebas manuales: crear niño, editar niño, archivar niño, búsqueda, filtro por sala, empty state. Correr advisors de seguridad.

---

## Acceptance criteria

- [ ] `pnpm build` completa sin errores.
- [ ] Tabla `rooms` existe en Supabase con RLS activado y 4 políticas (SELECT, INSERT, UPDATE, DELETE para authenticated).
- [ ] Tabla `children` existe en Supabase con RLS activado y 4 políticas (SELECT, INSERT, UPDATE, DELETE para authenticated).
- [ ] ENUM `child_status` existe con valores `active` y `archived`.
- [ ] Tabla `rooms` tiene exactamente 3 filas: Soles, Lunas, Estrellas, todas asociadas al daycare existente.
- [ ] La lista `/kids` ya no muestra los 8 niños mock; muestra solo niños de la BD.
- [ ] `src/data/children.ts` no contiene el array `children` con datos mock de 8 niños.
- [ ] "Agregar niño" abre el modal con los 8 checkboxes de alergias con labels en español (MANÍ, LACTOSA, GLUTEN, HUEVO, SOYA, MARISCOS, FRUTOS SECOS, PESCADO).
- [ ] El campo `enrolled_at` aparece autocompletado con la fecha de hoy en formato editable.
- [ ] Crear un niño con todos los campos válidos lo persiste en Supabase y aparece en la lista de `/kids`.
- [ ] Editar un niño desde el perfil actualiza los campos en Supabase; los cambios son visibles al volver a la lista.
- [ ] Archivar un niño desde el perfil cambia su `status` a `archived` en Supabase y lo oculta de la lista de `/kids`.
- [ ] El buscador filtra la lista por nombre (ilike, en cliente) y al vaciar restaura todos los activos.
- [ ] El filtro por sala deja ver solo niños de esa sala; el selector muestra "Todas las salas" como opción por defecto.
- [ ] Cuando no hay niños (o ninguno coincide con filtros), se muestra un empty state amigable.
- [ ] El perfil `/kids/[childId]` carga datos reales desde la BD; un id inexistente o archivado devuelve 404.
- [ ] La validación del formulario: nombre vacío → error; fecha de nacimiento inválida o futura → error; sala no seleccionada → error.
- [ ] En viewport <768px los modales y el filtro por sala son usables sin desbordes.
- [ ] Los identificadores del código están en inglés; los textos visibles en la UI están en español.
- [ ] Advisors de seguridad sin alertas nuevas por estas tablas.

---

## Decisions

- **Sí:** todo el CRUD (crear, editar, archivar, listar, buscar, filtrar) en un solo spec. **Justificación:** el usuario lo confirmó explícitamente; las piezas comparten DAL y tipos.
- **Sí:** eliminación completa de los 8 niños mock. **Justificación:** la lista debe reflejar la BD real; los mock impedirían verificar el flujo.
- **Sí:** alergias como checkboxes con 8 opciones predefinidas (valores en inglés en BD, UI en español). **Justificación:** elección del usuario. Set cubre alergenos comunes; mantener en inglés en BD respeta la convención del schema.
- **Sí:** `enrolled_at` autocompletado con la fecha actual (editable). **Justificación:** elección del usuario. Reduce fricción en el alta.
- **Sí:** validación manual sin Zod. **Justificación:** elección del usuario. El proyecto no tiene Zod instalado.
- **Sí:** archivado como `status = 'archived'` (soft delete), sin borrado físico. **Justificación:** el schema define `child_status` con `active`/`archived`.
- **Sí:** salas Soles, Lunas, Estrellas (mantener "Lunas" del Spec 04). **Justificación:** el Spec 04 ya usó "Lunas"; renombrar generaría inconsistencia.
- **Sí:** migraciones en `/migrations/` con numeración secuencial (003, 004, 005). **Justificación:** patrón de Specs 07 y 08.
- **Sí:** aplicar SQL vía `execute_sql` (MCP) iterando si falla, no vía `apply_migration`. **Justificación:** regla de AGENTS.md.
- **Sí:** filtros de búsqueda y sala en cliente (sobre la lista ya filtrada por `status = 'active'` desde server). **Justificación:** la lista de niños por daycare cabe en memoria; evita re-fetch en cada keystroke.
- **No:** gestión de rooms. **Justificación:** fuera de scope.
- **No:** vinculación de padres. **Justificación:** fuera de scope.
- **No:** Zod. **Justificación:** validación manual elegida por el usuario.
- **No:** políticas RLS granulares. **Justificación:** no hay roles diferenciados en rutas aún.
- **No:** avatar/foto del niño. **Justificación:** fuera de scope.

---

## Risks

| Riesgo                                                                                             | Mitigación                                                                                                                     |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Migraciones aplicadas a Supabase sin entorno local pueden ser difíciles de revertir                | Cada migración es idempotente por diseño; si falla, se corrige con nuevas migraciones. Verificar con queries antes de avanzar. |
| Al eliminar los 8 mock, la UI pierde datos de demostración hasta que el usuario cree niños         | Aceptable: el seed de rooms da la estructura; el empty state guía al usuario a crear.                                          |
| El spec 02 definió tipos (`Child`, `LinkedParent`, etc.) usados por varios componentes             | Refactor incremental: adaptar tipos y componentes uno a la vez, verificando build después de cada cambio.                      |
| `ChildCard` muestra "X padres vinculados" pero la tabla `parent_children` no está poblada          | El contador será 0 hasta que exista el spec de vinculación de padres; el card mostrará pill "VINCULAR" como fallback.         |
| `allergy_tags` como array de Postgres tiene limitaciones de escalabilidad                          | Aceptable para <10 alergias fijas. Si se normaliza en el futuro, se saca a tabla `allergies` + `child_allergies`.              |
| El `EditChildModal` duplica mucho del `AddChildModal`                                              | Considerar un componente compartido `ChildForm` que ambos modales usen; decisión de implementación, no de producto.            |
| `generateStaticParams` en el perfil debe eliminarse (ahora es dinámico)                            | Riesgo bajo; se detecta en build si se olvida.                                                                                 |

---

## Lo que **no** está en este spec

- Gestión de rooms (crear/editar salas).
- Vinculación de padres (`parent_children`).
- Resumen diario (`daily_summaries`).
- Feed y publicaciones.
- Roles y permisos granulares en UI y RLS.
- Avatar/foto del niño.
- Borrado físico de niños.
- Flujo "¿Olvidaste tu contraseña?".
- Activación de cuenta real.

Cada una de esas, si llega, va en su propio spec.
