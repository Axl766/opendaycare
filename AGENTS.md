<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## MCPs

- Playwright : screenshots y cualquier cosa relacionada a playwright tiene que estar en la carpeta .playwright-mcp.
- Context7 utilizaremos este MCP para usar la documentación mas actualizada
- Supabase : base de datos, RLS, Edge Functions, logs, advisors y cualquier operación contra la base de datos del proyecto.

## Interaction con la base de datos (Supabase + Next.js)

La app interactúa con la base de datos usando los paquetes propios de Supabase y Next.js:

- **Paquetes** : `@supabase/supabase-js` y `@supabase/ssr` (instalados, pnpm).
- **Clientes** (helpers en `src/utils/supabase/`):
  - `server.ts` → `createClient(cookieStore)` para Server Components / Server Functions (con `await cookies()` de `next/headers`).
  - `client.ts` → `createClient()` para Client Components (browser).
  - `proxy.ts` → `updateSession(request)` para refrescar sesiones.
- **Session refresh** : Next.js 16 renombró Middleware a Proxy — la lógica vive en `src/proxy.ts` (NO crear `middleware.ts`).
- **Env vars** : `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` en `.env.local`. Nunca exponer `service_role`/secret keys.
- **Auth** : usar `supabase.auth.getUser()` / `getClaims()` en servidor; no confiar en datos de cliente.

## Skills

- `supabase` (`.claude\skills\supabase\SKILL.md`) : OBLIGATORIO cargarlo antes de cualquier tarea que toque Supabase. Reglas clave:
  - No confiar en datos de entrenamiento; verificar contra changelog (`https://supabase.com/changelog.md`) y docs (preferir MCP `search_docs`, o añadir `.md` a cualquier URL de docs).
  - Seguridad: RLS activado en todas las tablas expuestas; nunca usar `user_metadata` para autorización (usar `app_metadata`); `auth.role()` deprecado (usar `TO authenticated/anon`); `TO authenticated` solo no basta (añadir predicado de ownership con `auth.uid()`); políticas UPDATE necesitan `USING` + `WITH CHECK`; `SECURITY DEFINER` bypass RLS y es endpoint público — evitarlo, si es imprescindible en schema no expuesto con check de `auth.uid()`.
  - Nunca exponer `service_role`/secret keys en cliente; usar publishable keys.
  - Con SQL: iterar con `execute_sql` (MCP), NO con `apply_migration` (escribe historial de migración en cada llamada). Al commitear: correr advisors, revisar checklist de seguridad, generar migración con `supabase db pull <nombre> --local --yes` y verificar con `supabase migration list --local`.
  - Debugging: ante errores de Supabase (REST/PostgREST/RLS/Auth/Realtime/Edge/Storage) primero leer `https://supabase.com/docs/guides/monitoring-and-debugging.md` antes de diagnosticar.
  - Verificar siempre los cambios con una query de prueba; si un enfoque falla 2-3 veces, cambiar de método en vez de loopear.

## Agentes

- `spec-verify` : verifica los criterios de aceptación de un spec (estado "Approved"), revisa la implementación, corrige lo que falle y marca los checkboxes del spec. Usa Playwright MCP para la verificación visual con capturas comparativas (guardadas en `.playwright-mcp/`) y corre `pnpm build`.

## Comandos

- Verificar un spec : `@spec-verify @specs/NN-slug.md` — lanza el agente `spec-verify` vía Task tool con un prompt detallado que incluye: ruta del spec, archivos de implementación esperados, criterios de aceptación, workflow de verificación (build, dev server, capturas desktop/mobile, naming inglés/español) y la instrucción de marcar los checkboxes que pasen y devolver un reporte PASS/FAIL por criterio.