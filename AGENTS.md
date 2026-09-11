<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## MCPs

- Playwright : screenshots y cualquier cosa relacionada a playwright tiene que estar en la carpeta .playwright-mcp.
- Context7 utilizaremos este MCP para usar la documentación mas actualizada

## Agentes

- `spec-verify` : verifica los criterios de aceptación de un spec (estado "Approved"), revisa la implementación, corrige lo que falle y marca los checkboxes del spec. Usa Playwright MCP para la verificación visual con capturas comparativas (guardadas en `.playwright-mcp/`) y corre `pnpm build`.

## Comandos

- Verificar un spec : `@spec-verify @specs/NN-slug.md` — lanza el agente `spec-verify` vía Task tool con un prompt detallado que incluye: ruta del spec, archivos de implementación esperados, criterios de aceptación, workflow de verificación (build, dev server, capturas desktop/mobile, naming inglés/español) y la instrucción de marcar los checkboxes que pasen y devolver un reporte PASS/FAIL por criterio.