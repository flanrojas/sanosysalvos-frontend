# Frontend — Sanos y Salvos

Interfaz web de la plataforma comunitaria de mascotas perdidas y encontradas.
Construida con **Vite + React + TypeScript**, consume el **BFF** (`http://localhost:8085`).

## Stack

- Vite 6
- React 18 + React Router 6
- TypeScript (modo estricto)
- Axios
- CSS plano con variables de diseño (sin frameworks de UI)

## Requisitos previos

- Node.js 18+
- El **BFF** corriendo en `http://localhost:8085` (junto con los microservicios:
  `ms-publicacion`, `ms-mascotas`, `geolocalización`).

> El BFF ya permite CORS desde `http://localhost:5173`.

## Puesta en marcha

```bash
cd frontend-sanosysalvos
npm install
npm run dev
```

Abre http://localhost:5173

## Scripts

| Comando           | Descripción                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Servidor de desarrollo (puerto 5173)     |
| `npm run build`   | Compila TypeScript y genera el bundle    |
| `npm run preview` | Sirve el build de producción localmente  |
| `npm run lint`    | Chequeo de tipos con `tsc`               |

## Variables de entorno

Archivo `.env`:

```env
VITE_API_BASE_URL=http://localhost:8085
```

## Estructura

```
src/
  api/            Cliente Axios + módulos por microservicio + tipos (DTOs del BFF)
  components/     UI reutilizable (Button, Badge, Field, Toast, Layout, iconos…)
  pages/          Vistas: Home, Publicaciones, Detalle, Reportar, Mascotas, Geo
  utils/          Formateadores
  styles/         Estilos globales y tokens de diseño
```

