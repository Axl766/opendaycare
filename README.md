# OpenDaycare

Plataforma de gestión para guarderías: salas, niños, cumpleaños, invitaciones y más.

Stack: [Next.js](https://nextjs.org) (App Router) + [Supabase](https://supabase.com) (Postgres, Auth) + [Tailwind CSS](https://tailwindcss.com) + [Resend](https://resend.com) (emails).

## Requisitos

- Node.js 20+
- [pnpm](https://pnpm.io) (el proyecto usa `pnpm@11.20.0`, ver `packageManager` en `package.json`)
- CLI de Supabase (para tareas de base de datos):

  ```bash
  # macOS
  brew install supabase/tap/supabase
  # o con npm/npx en cualquier plataforma
  npx supabase
  ```

- (Opcional) Supabase MCP server ya configurado en este repo vía `.opencode`/`AGENTS.md`.

## Configuración de variables de entorno

Crea un archivo `.env.local` (el `.env` del repo es la referencia local; nunca lo subas con claves reales) con las siguientes variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://< TU-PROYECTO-REF>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable (anon) key>
# Solo para scripts/CLI locales, NUNCA exponer al cliente
SUPABASE_DB_PASSWORD=<db password>
SUPABASE_SERVICE_ROLE_KEY=<service_role key>

# Emails (Resend)
RESEND_API_KEY=<api key de resend>
RESEND_FROM_EMAIL=OpenDaycare <no-reply@tu-dominio.com>
```

Valores:

- `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: desde el Dashboard del proyecto en Supabase → Project Settings → API. Usa SIEMPRE la *publishable* (anon) key en el cliente.
- `SUPABASE_DB_PASSWORD` y `SUPABASE_SERVICE_ROLE_KEY`: solo para tareas administrativas locales (migraciones, sechas de datos). Nunca las uses en código que corre en el browser.
- `RESEND_*`: para el envío de emails (invitaciones).

## Setup del proyecto

```bash
# 1. Instalar dependencias
pnpm install

# 2. Configurar env vars (copiar .env.example si existe, o crear .env.local con las vars de arriba)

# 3. Levantar el dev server
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

Otros comandos útiles:

```bash
pnpm build   # build de producción
pnpm lint    # ESLint
```

## Autenticación con el CLI de Supabase

El MCP de Supabase y las tareas de base de datos (migraciones, `db pull`, etc.) requieren que el CLI esté autenticado con tu cuenta.

### 1. Login del CLI

```bash
supabase login
```

Esto abre el navegador para autenticarte con tu cuenta de Supabase (OAuth). El access token queda guardado en el keyring nativo del sistema (o en `~/.supabase/access-token` si no hay keyring).

Alternativas:

```bash
# Sin navegador (p. ej. entornos headless/CI)
supabase login --no-browser

# O directamente con un Personal Access Token
# (crearlo en https://supabase.com/dashboard/account/tokens)
supabase login --token <personal-access-token>
```

> En CI o scripts se puede evitar el login seteando la variable de entorno `SUPABASE_ACCESS_TOKEN`.

### 2. Vincular el proyecto local al proyecto remoto

```bash
# Desde la raíz del repo (pide el project ref o escribe de forma interactiva)
supabase link --project-ref <project-ref>
```

`<project-ref>` es el prefijo de la URL de Supabase: `https://<project-ref>.supabase.co`.

> Aquí el CLI puede pedirte la contraseña de base de datos (usada para `supabase db ...`), que corresponde a `SUPABASE_DB_PASSWORD` en `.env.local`.

### 3. Verificar

```bash
# Ver estado de la vinculación
supabase status

# Listar migraciones aplicadas en el proyecto remoto
supabase migration list
```

## Base de datos / Migraciones

- `migrations/` contiene el SQL de migraciones aplicadas a la base (vered con `supabase migration list`).
- Para iterar SQL usa el MCP de Supabase (`execute_sql`), y para commit genera la migración con `supabase db pull <nombre> --local --yes` y verifica con `supabase migration list --local` (ver `AGENTS.md`).

> Nota: este repo no usa middleware de Next.js; la lógica de sesión vive en `src/proxy.ts` (Next.js 16 renombró Middleware → Proxy).

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase docs](https://supabase.com/docs)
- [Supabase CLI reference](https://supabase.com/docs/guides/local-development/cli)
