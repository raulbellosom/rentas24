# 07_FRONTEND_ROUTES_AND_FLOWS.md - Rentas24

## Rutas públicas
- `/` Home
- `/properties` Catálogo
- `/properties/:id` Detalle

## Auth
- `/login`
- `/register`
- `/verify-email`

## Owner (privadas)
- `/owner` Dashboard
- `/owner/properties` Mis propiedades
- `/owner/properties/new` Crear propiedad
- `/owner/properties/:id` Ver propiedad propia
- `/owner/properties/:id/edit` Editar propiedad
- `/owner/profile` Perfil

## Redirects legacy (compatibilidad temporal)
- `/mis-articulos` -> `/owner/properties`
- `/crear-articulo` -> `/owner/properties/new`
- `/editar-articulo/:id` -> `/owner/properties/:id/edit`
- `/ver-articulo/:id` -> `/owner/properties/:id`
- `/anuncio/:id` -> `/properties/:id`
- `/article/:id` -> `/properties/:id`
- `/perfil` -> `/owner/profile`

## Guards
- Rutas owner bloqueadas sin sesión
- Login/register redirigen a owner si ya hay sesión
- Sesión válida solo cuando `user.enabled=true` y `user.emailVerified=true`

## Flujos principales

### Publicar propiedad
1. Owner crea draft (`/owner/properties/new`)
2. Sube imágenes a bucket Appwrite
3. Guarda documento en `properties`
4. Revisa detalle y edita si es necesario

### Explorar propiedades
1. Usuario navega Home/Catálogo
2. Abre detalle público
3. Visualiza disponibilidad, precio y servicios

### Perfil owner
1. Owner entra a `/owner/profile`
2. Actualiza datos y foto
3. Cambios sincronizados con Appwrite

### Verificación de correo
1. Usuario crea cuenta en `/register`
2. Se envía correo de verificación y se redirige a `/login`
3. Si intenta entrar sin verificar: login bloqueado + opción para reenviar correo
4. Enlace de correo abre `/verify-email?token=...` y valida token

## Errores y fallback
- Ruta inexistente: vista 404 animada
- Error runtime: ErrorBoundary con retry
