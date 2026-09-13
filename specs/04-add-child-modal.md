# SPEC 04 — Modal Agregar niño (réplica visual)

> **Estado:** approved
> **Depende de:** SPEC 02 (pantalla /kids, header con botón "Agregar niño", datos de niños)
> **Fecha:** 2026-09-12
> **Objetivo:** Implementar el modal de `agregar-nino.dc.html` lanzado por el botón "Agregar niño" de `/kids`, como réplica visual sobre overlay centrado con cierre por Cancelar/Guardar/clic-fuera/Esc y dropdown de sala funcional, sin persistencia ni cambios en los niños existentes.

## Alcance

**Dentro:**

- Componente cliente `src/components/AddChildModal.tsx`: disparador "Agregar niño" (mismo estilo y lugar que el botón actual del header de `/kids`) + overlay `rgba(63,54,46,.4)` + tarjeta centrada `max-width:520px` (bg `#FBF4EC`, borde `#ECE0D0`, radio 24px, sombra `0 20px 50px -24px rgba(63,54,46,.35)`), por encima del drawer móvil (z superior a z-40).
- Header del modal: "Cancelar" (`#94887B`, 700, 15px), título "Agregar niño" (Fredoka 600, 18px, `#3F362E`), "Guardar" (`#D9583C`, 800, 15px), sobre borde inferior `#ECE0D0`.
- Formulario réplica con labels 12px/800/tracking .7px/`#94887B` e inputs (px-16 py-13, radio 14px, borde 1.5px `#EADFD0`, fondo blanco): NOMBRE COMPLETO ("Ej. Martina López"), FECHA DE NACIMIENTO ("dd/mm/aaaa"), SALA (dropdown), ALERGIAS (ETIQUETAS) ("Ej. Maní, Lactosa") y NOTAS MÉDICAS (textarea "Indicaciones, medicación, contactos…", min-height 90px, resize vertical).
- Dropdown custom de SALA (listbox): trigger idéntico al de la referencia (valor bold + chevron `#B0A290`), lista flotante con las salas de `rooms`, opción seleccionada visible en el trigger, cierre por clic-fuera y Esc, teclado (flechas + Enter/Space).
- Cierre del modal: "Cancelar", "Guardar", clic en el overlay y tecla Esc; con el dropdown abierto, Esc cierra primero el dropdown.
- Refactor mínimo en `src/app/kids/page.tsx`: el `Link href="#"` "Agregar niño" pasa a ser el disparador del modal.
- `rooms` en `src/data/children.ts`: `["Soles", "Lunas", "Estrellas"]` ("Soles" seleccionada por defecto).
- Adaptación móvil <768px: mismo modal, tarjeta centrada con padding reducido y sin desbordes.

**Fuera de alcance (para specs futuros):**

- Alta real del niño: validación de campos, crear/persistir, avatar, padres vinculados.
- Date picker real para la fecha (queda input de texto con placeholder, como la referencia).
- Pills/etiquetas interactivas de alergias (queda input de texto plano).
- Gestión de salas (crear/editar; las inventadas solo existen para el dropdown).
- Resto de las pantallas de `src/references/pantallas/`.

## Modelo de datos

Único agregado a `src/data/children.ts` (identificadores en inglés, strings visibles en español):

```ts
export const rooms: string[] = ["Soles", "Lunas", "Estrellas"];
```

No hay nuevos tipos ni persistencia; los estados del modal (abierto, sala seleccionada, dropdown abierto) viven en el cliente dentro de `AddChildModal` y se resetean al cerrar.

## Plan de implementación

1. Leer las guías de Next.js 16 en `node_modules/next/dist/docs/` (client components y composición server/cliente) — requisito de AGENTS.md.
2. `rooms` en `src/data/children.ts`.
3. `src/components/AddChildModal.tsx` (cliente): estado `open` + disparador con el estilo actual del botón; overlay + tarjeta réplica (header y 5 campos con placeholders exactos).
4. Listbox custom de SALA: trigger con chevron, lista de `rooms`, selección, clic-fuera, Esc y teclado.
5. Cierre completo del modal (Cancelar/Guardar/overlay/Esc, dropdown primero) y refactor en `src/app/kids/page.tsx` reemplazando el `Link` por `<AddChildModal />`. Verificar `/kids`.
6. Verificación móvil <768px del modal (centrado, sin desbordes, dropdown usable).
7. Capturas comparativas con Playwright en `.playwright-mcp/` (modal cerrado y abierto contra la referencia, desktop y móvil) y `pnpm build` sin errores.

## Criterios de aceptación

- [ ] `pnpm build` completa sin errores.
- [ ] El botón "Agregar niño" de `/kids` abre el modal sin errores en consola; `/` y `/kids/[childId]` quedan intactos.
- [ ] En viewport ≥768px el modal abierto es visualmente idéntico a la tarjeta de `agregar-nino.dc.html`: max-width 520px, bg `#FBF4EC`, borde `#ECE0D0`, radio 24px, sombra de la referencia, header Cancelar/"Agregar niño"/Guardar y los 5 campos con labels e inputs de la referencia y sus placeholders exactos.
- [ ] El modal se presenta sobre overlay `rgba(63,54,46,.4)` centrado en el viewport (desviación registrada: la referencia es una página suelta sin overlay).
- [ ] "Cancelar" y "Guardar" cierran el modal y dejan la lista de `/kids` con los 8 niños de siempre (sin cambios).
- [ ] El clic en el overlay y la tecla Esc también cierran el modal.
- [ ] El dropdown de SALA abre al clic, lista "Soles", "Lunas" y "Estrellas" con "Soles" inicial, la selección queda visible en el trigger, se cierra con clic-fuera o Esc (sin cerrar el modal) y las flechas + Enter/Space seleccionan.
- [ ] En viewport <768px el modal abre igual: tarjeta centrada, sin desbordes horizontales, campos y dropdown usables.
- [ ] Todos los identificadores del código en inglés; los textos visibles en español.

## Decisiones

- **Sí:** botón "Agregar niño" como disparador de un modal. **No:** navegar a una página propia — la referencia es una página suelta, pero se pidió modal explícitamente.
- **Sí:** overlay oscuro + tarjeta centrada (lenguaje del drawer móvil). **No:** réplica literal sin overlay y alineada arriba.
- **Sí:** cierre por Cancelar/Guardar/clic-fuera/Esc (el teclado y el clic-fuera no existen en la referencia; invención registrada).
- **Sí:** dropdown de SALA funcional con listbox custom (elección del usuario). **No:** trigger estático como la referencia (recomendación original descartada por el usuario).
- **Sí:** salas "Lunas" y "Estrellas" inventadas para que el dropdown tenga opciones reales (elección del usuario); "Soles" sigue siendo la única sala de los datos existentes y la opción inicial.
- **Sí:** Guardar cierra sin efectos (réplica visual, patrón de specs 01-03). **No:** agregar en memoria ni persistir — va en el spec de alta real.
- **Sí:** fecha como input de texto y alergias como texto plano (réplica); date picker y pills van en el alta real.
- **Sí:** `rooms` en `src/data/children.ts`, siguiendo el patrón de datos tipados.
- **Sí:** mismo modal en móvil con padding reducido.

## Riesgos

| Riesgo                                                            | Mitigación                                                                                            |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Listbox custom sin comportamiento nativo (teclado, clic-fuera)    | Criterios explícitos de Esc/clic-fuera/flechas y verificación interactiva con Playwright.             |
| Overlay y dropdown no existen en la referencia (invención visual) | Capturas comparativas de la tarjeta contra la referencia; desviaciones registradas en las decisiones. |
| Conflicto de z-index con el drawer móvil (z-40)                   | Modal por encima (z-50); verificación en móvil.                                                       |

## Lo que **no** está en este spec

- Alta real del niño (validación, persistencia, avatar, padres).
- Date picker, pills de alergias, gestión de salas.
- Resto de las pantallas de `src/references/pantallas/`.

Cada una de esas, si llega, va en su propio spec.
