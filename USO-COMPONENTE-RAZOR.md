# Liquidación Dashboard — Guía de Uso, Build y Limpieza

Este documento explica las tecnologías utilizadas, cómo desarrollar y probar localmente, cómo generar el Web Component listo para producción e integrarlo en ASP.NET Razor Pages. Al final se incluye una propuesta de limpieza de archivos que no son necesarios en el flujo actual. No se modifica código: tú decides qué borrar.

## Tecnologías
- Preact + Vite: UI y bundling rápido (dev server y build).
- Tailwind CSS v4: utilidades de estilos; se inyecta dentro del Shadow DOM.
- Web Component con Shadow DOM: aislamiento total del CSS del sitio principal.
- preact-custom-element: registro del custom element y render dentro del Shadow DOM.
- IIFE single file: un único `*.js` para producción; opcionalmente con CSS embebido.

## Arquitectura Clave
- Entrada prod: `liquidation-web-component.tsx` (registra `<liquidation-modal>` y expone API global `window.LiquidationApp.open/close`).
- App principal: `App.tsx` (pantallas y lógica de UI).
- Estado/calculado: `hooks/useFinancials.ts` (reducer, memo y cálculos `totals`/`baseValues`).
- Estilos: `index.css` + Tailwind v4 con `safelist` para clases usadas en Shadow DOM.
- Build prod (lib mode IIFE): genera `dist-razor/liquidation-bundle.js` y `dist-razor/liquidation-styles.css` (si no se embebe).
- Embebido CSS opcional: `scripts/embed-css.js` inserta el CSS en el JS para entregar un único archivo.

## Desarrollo Local
1) Instalar dependencias
```cmd
cd /d "C:\Users\hernyk.martinez\Downloads\shipment-dashboard"
npm install
```

2) Ejecutar en modo desarrollo (vite)
```cmd
npm run dev
```

- Por defecto levanta en `http://localhost:3000/`.
- `index.tsx` monta la app completa para desarrollo.
- El wrapper de producción también auto‑abre un modal de demo cuando está en `DEV` (útil para probar rápidamente).

## Pruebas Rápidas en Local (bundle de producción)
Opción A — JS + CSS separados (build estándar):
```cmd
npm run build:razor
```
Genera:
- `dist-razor/liquidation-bundle.js`
- `dist-razor/liquidation-styles.css`
- `dist-razor/test.html` (página de prueba)

Opción B — Archivo único JS (CSS embebido):
```cmd
npm run build:single
```
Genera:
- `dist-razor/liquidation-bundle.js` (CSS ya dentro del JS; no se requiere CSS externo)
- `dist-razor/test.html`

Atajo para probar:
```cmd
npm run test:razor
```
Abre automáticamente `dist-razor\test.html` en el navegador.

## Integración en ASP.NET Razor Pages
1) Copiar artefactos a `wwwroot` (recomendado usar el build de archivo único):
```cmd
rem Genera el archivo único
npm run build:single

rem Copia a tu proyecto Razor (ajusta la ruta de destino)
copy /Y dist-razor\liquidation-bundle.js C:\Ruta\A\TuAppRazor\wwwroot\js\liquidation-bundle.js
```

2) Referenciar en tu `.cshtml` (antes de `</body>`):
```html
<!-- No se requiere CSS externo si usas build:single -->
<script src="~/js/liquidation-bundle.js" asp-append-version="true"></script>

<script>
  function abrirLiquidacion(guias) {
    window.LiquidationApp.open({
      shipments: guias,
      mode: guias && guias.length > 1 ? 'multiple' : 'single',
      onSave: async (data) => {
        // TODO: enviar al servidor
        console.log('Guardar', data);
      },
      onCancel: () => window.LiquidationApp.close()
    });
  }
</script>
```

- Si eliges el build estándar (`build:razor`), además debes copiar y referenciar `liquidation-styles.css` en el `<head>`.

## Comandos Útiles (cmd.exe)
- Desarrollo: `npm run dev`
- Build estándar (JS + CSS): `npm run build:razor`
- Build archivo único (JS con CSS): `npm run build:single`
- Probar bundle y demo: `npm run test:razor`

## Estructura de `dist-razor`
- `liquidation-bundle.js`: bundle IIFE del Web Component y API `window.LiquidationApp`.
- `liquidation-styles.css`: CSS (Tailwind + utilidades) si no se embebe.
- `test.html`: demo para abrir `single` o `multiple` y validar integración.

## Sugerencias de Limpieza (NO ejecutar todavía)
Recomendación basada en el flujo actual (entrada: `liquidation-web-component.tsx` y build via `vite.config.ts`). Puedes borrar o archivar estos elementos si no tienes dependencias externas que los usen:

- `main-modal.tsx`
  - Motivo: ruta alternativa histórica al wrapper sin Custom Element. El build actual usa `liquidation-web-component.tsx` (Shadow DOM + custom element).
  - Nota: si lo eliminas, quita también su referencia del `content` en `tailwind.config.js`.

- Carpeta `public/` (archivos duplicados de demo)
  - `public/liquidation-bundle.js`, `public/liquidation-styles.css`, `public/test.html`.
  - Motivo: los artefactos de prueba canónicos viven en `dist-razor/`.

- Scripts de prefijo CSS: `scripts/update-css-prefix.ps1`, `scripts/remove-css-prefix.ps1`
  - Motivo: ya no se usa `prefix` en Tailwind; los estilos están aislados por Shadow DOM.

- Script de validación: `scripts/validar.ps1`
  - Motivo: referencía archivos y rutas antiguas (p. ej., docs en raíz y “React”). Si lo mantienes, conviene actualizarlo.

- Documentación histórica (si buscas minimalismo):
  - `PREACT-MIGRATION.md`, `WEB-COMPONENT-MIGRATION.md`, `OPTIMIZATIONS.md`, `OPTIMIZATION-SUMMARY.md`, `FIXES-APPLIED.md`, `COMPLETED.md`, `SOLUCION-*`, `BACKEND-INTEGRATION-GUIDE.md`, `INTEGRATION-GUIDE.md` y varios en `docs/`.
  - Motivo: este MD unifica la guía operativa; puedes archivar el resto en `docs/archive/` o eliminarlos.

- Build output en control de versiones
  - Añade a `.gitignore`: `dist-razor/`, `.vite/`, `node_modules/`, `*.log`.

> Importante: Si existe alguna página o proceso externo que aún consuma `main-modal.tsx` o los archivos de `public/`, no los borres hasta confirmar. El build y la integración recomendados aquí no los requieren.

---

¿Quieres que prepare un PR sólo con: (a) `.gitignore` recomendado y (b) mover docs históricas a `docs/archive/` sin tocar el código fuente? Puedo dejarlo listo para que lo revises antes de borrar nada.
