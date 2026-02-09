# 01_FRONTEND_REQUIREMENTS.md - Rentas24

Este documento define las reglas obligatorias de frontend para Rentas24.
Aplica a todo cambio nuevo y a toda migracion de codigo legacy.

## 1) Objetivo

Construir y mantener una interfaz moderna, mobile-first y escalable para Rentas24,
conectada 100% a Appwrite 1.8.1, sin backend Docker legacy ni fuentes de datos ficticias.

## 2) Stack oficial

- React + Vite (JavaScript, no TypeScript por defecto)
- TailwindCSS
- React Router DOM
- Redux Toolkit (estado global actual del proyecto)
- Appwrite Web SDK
- Framer Motion para animaciones e interacciones UI
- Lucide React para iconografia
- PWA con `vite-plugin-pwa`

## 3) Reglas no negociables

- Prohibido usar `flowbite` o `flowbite-react`.
- Prohibido usar mock data, fake data o datos hardcodeados como sustituto de Appwrite.
- Prohibido usar emojis en UI (siempre iconos de Lucide).
- Prohibido hardcodear endpoint de Appwrite.
- Prohibido leer `import.meta.env` fuera de `src/env.js`.
- Toda variable de entorno debe homologarse en una sola convencion para frontend y functions.

## 4) Configuracion y entorno

- El endpoint Appwrite debe venir de variable de entorno (ejemplo: `APPWRITE_ENDPOINT`).
- El cliente Appwrite centralizado debe vivir en `src/appwrite.js`.
- Toda lectura de variables debe pasar por `src/env.js`.
- `/.env` y `/.env.example` deben contener el mismo catalogo de variables esperadas.
- Evitar prefijos duplicados para el mismo concepto (`VITE_APP_URL`, `APP_URL`, `ENV_APP_URL`).

## 5) Arquitectura objetivo (atomic + feature + MVC)

```text
src/
  app/
    layouts/
    providers/
    routes/
  features/
    <domain>/
      api/
      components/
      hooks/
      pages/
      services/
      models/
      index.js
  shared/
    ui/
      atoms/
      molecules/
      organisms/
    lib/
    hooks/
    utils/
    styles/
  components/ (legacy; migrar gradualmente a shared/ui)
```

### Responsabilidades por capa

- `features/<domain>/api`: contratos de red y llamadas concretas.
- `features/<domain>/services`: logica de negocio y adaptadores.
- `features/<domain>/pages`: orquestacion de vista, sin logica pesada.
- `shared/ui`: componentes reutilizables atomicos y consistentes.
- `app/layouts`: estructura visual principal (public, auth, app, legal).

### Regla MVC aplicada al frontend

- Modelo: shape de datos Appwrite + normalizacion.
- Vista: componentes presentacionales.
- Controlador: hooks/servicios que conectan vista y modelo.

## 6) Sistema de diseno y branding

### Paleta base de marca (obligatoria como direccion visual)

- Primario profundo: `brand-950` `#0b1528`
- Primario medio: `brand-700` `#184565`
- Superficie clara: `brand-50` `#f5f9fc`
- Acento activo: `accent-500` `#21c1dc`
- Acento hover: `accent-400` `#42d4ea`

### Logo e identidad

- Fuente oficial actual: icono puro (`icon`/`icon_alter`).
- Donde aplique marca completa, renderizar texto `Rentas24` y slogan `Busca, encuentra, renta` desde componente, no en imagen.
- Si el icono es blanco, usar superficie oscura o contraste suficiente para legibilidad.

### Inputs y formularios

- Input moderno con borde unico exterior.
- Nunca mostrar doble borde (wrapper + borde interno del input).
- Estado visual minimo: normal, hover, focus, disabled, error.
- Checkboxes y selects deben respetar tokens de color de marca.

## 7) Layouts y comportamiento UI

- Mobile-first real (no desktop-first adaptado).
- Sidebar:
  - Colapso/expansion organica.
  - Iconos fijos, texto con reveal/trim (sin wrap brusco).
  - Boton de colapso integrado visualmente con la barra inferior.
- Footer:
  - Compacto y discreto en app shell.
  - Alineado al borde inferior del viewport sin cortes visuales.
- Navbar/hero/cards con animaciones suaves y consistentes.

## 8) Rutas, flujos y seguridad

- Nomenclatura de rutas en ingles.
- Mantener redirects legacy solo como compatibilidad temporal.
- Bloquear rutas privadas sin sesion valida.
- Impedir creacion/edicion de articulos sin autenticacion.
- Acciones protegidas deben redirigir a login/registro segun flujo definido.

## 9) Datos y Appwrite

- Toda lectura/escritura viene de Appwrite (DB/Auth/Functions/Storage).
- `03_appwrite_db_mirror.md` es la referencia del espejo de BD.
- En errores `401`, `403`, `500` o red:
  - mostrar estado de error visual reutilizable,
  - ofrecer acciones de recuperacion (reintentar, volver a zona segura).

## 10) Functions y sincronizacion de perfil

- Se permite crear/migrar Appwrite Functions siguiendo `06_appwrite_functions_catalog.md`.
- Debe mantenerse sincronizacion entre:
  - usuario Auth de Appwrite,
  - documento de perfil extendido (`profiles`).
- Flujos minimos:
  - verificacion de correo al crear usuario,
  - sincronizador para datos adicionales de perfil.

## 11) PWA, SEO y metadatos

- `index.html` debe incluir:
  - metas base de SEO,
  - Open Graph/Twitter cards,
  - referencias correctas a iconos en `/public`.
- Manifest valido (`manifest.webmanifest`) sin errores de sintaxis.
- Service worker:
  - `registerType: autoUpdate`,
  - estrategia de actualizacion amigable.
- En desarrollo, evitar cache stale de SW cuando rompa modulos o MIME.

## 12) Performance y calidad de codigo

- Lazy loading en rutas/paginas pesadas.
- Limite recomendado por archivo: advertencia en 300 lineas.
- Limite duro: 700 lineas.
- Modularizar antes de llegar a spaghetti code.
- Evitar dependencias redundantes (no duplicar responsabilidades existentes).

## 13) Checklist de aceptacion (Definition of Done)

Una tarea frontend se considera terminada solo si:

1. Compila en `npm run build`.
2. Respeta arquitectura atomica + feature + MVC.
3. No introduce dependencias prohibidas.
4. No usa mock data ni hardcodes de infraestructura.
5. Mantiene rutas/guards seguras y flujos de auth correctos.
6. Incluye estados `loading`, `empty`, `no matches` y `error`.
7. Mantiene consistencia visual mobile/desktop con branding Rentas24.

