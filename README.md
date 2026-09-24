# Frontend de B&R

Frontend React 18 + TypeScript para la web publica y el panel de administracion. El proyecto usa Vite y genera el build final en `build/`, para mantener el mismo destino de despliegue que tenia antes.

## Requisitos

- Node `^22.12.0`, `^24.0.0` o superior compatible.
- Backend `BYR-JAVA-Server` corriendo para desarrollo local.

## Entorno

Vite solo expone al navegador variables prefijadas con `VITE_`.

- `.env`: URLs publicas de produccion.
- `.env.development`: backend local, normalmente `http://localhost:8080`.
- `.env.e2e`: backend simulado por Playwright.
- `.env.example`: plantilla para configurar otro entorno.

No guardar secretos en variables del frontend: todo valor compilado queda visible en el navegador.

## Comandos

```bash
npm ci
npm start
npm run build
npm test
```

`npm start` abre Vite en `http://localhost:3000`. Para desarrollo, iniciar primero Java con el perfil local indicado en el README del backend.

## Admin y API

El login de `/admin` usa usuarios de la base del backend. La API central esta en `src/utils/api.ts`: envia cookies de sesion, obtiene CSRF antes de escrituras y limpia la sesion local ante respuestas 401/403.

El editor de descripciones usa Quill 2 directamente. Se conservan formatos usados por el cliente como negrita, cursiva, subrayado, titulos, tamanos, colores, enlaces, citas, alineacion, sangrias y listas. El HTML se sanitiza al cargarlo en el editor, al guardarlo y al renderizarlo en la ficha publica.

## Validacion

- `npm run build`: TypeScript y build de produccion con Vite.
- `npm test`: pruebas unitarias con Vitest.
El audit de produccion queda con una alerta baja de Quill 2.0.3 relacionada con exportacion HTML. No hay version corregida publicada al momento de esta revision; el proyecto mitiga el riesgo con whitelist de formatos y sanitizado.
