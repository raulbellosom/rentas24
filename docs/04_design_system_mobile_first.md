# 04_DESIGN_SYSTEM_MOBILE_FIRST.md - Rentas24

## Principios
- Mobile-first, touch-first
- Marca consistente: azul profundo + acento cyan
- Animaciones intencionales, no decorativas
- Contraste legible (accesibilidad)

## Paleta de marca
- `brand-950`: `#0b1528`
- `brand-700`: `#184565`
- `brand-500`: `#2e6f9f`
- `accent-500`: `#21c1dc`
- `surface`: `#f5f9fc`

## Tipografía
- Manrope como tipografía principal
- Jerarquía clara en títulos, subtítulos y labels

## Componentes base (obligatorios)
- Button (primary, secondary, ghost, danger)
- Input / Textarea / Select
- Modal
- Tabs
- Carousel
- Spinner
- EmptyState / ErrorState

## Reglas visuales
- Bordes redondeados suaves (`rounded-xl` / `rounded-2xl`)
- Profundidad con sombras ligeras
- Evitar ruido visual en fondos
- Evitar dobles bordes internos en campos

## Motion
- Sidebar collapse con reveal de texto mediante grid (`0fr -> 1fr`)
- Microinteracciones en botones y navegación
- Modales con enter/exit suaves

## Layout
- Header sticky
- Sidebar desktop + drawer mobile
- Footer compacto, discreto, siempre consistente
- Safe-area compatible en móviles

## Estados de interfaz
- Loading: spinner claro con overlay
- Empty: componente animado con CTA
- Error: vista reusable para 404/500/runtime
- No matches: variante de EmptyState
