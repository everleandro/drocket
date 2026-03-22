# Theming

Drocket expone variables Sass y CSS custom properties para personalizar tema en build-time y runtime.

## Import recomendado

```scss
// assets/styles/variables.scss
$border-radius-root: 6px;
$root-font-size: 16px;

$colors-light: (
  'primary': #42b883,
  'secondary': #35495e,
  'warning': #f39c12,
  'error': #e74c3c
);

$colors-dark: (
  'primary': #58d78d,
  'secondary': #8ca0b8,
  'warning': #f8b739,
  'error': #f58a8a
);

@import 'drocket/setting.scss';
```

## Mixins

```scss
@import 'drocket/mixin.scss';
```

## Buenas practicas

- Mantener variables de tema en un archivo central.
- Evitar sobrescribir clases internas de componentes cuando exista variable Sass equivalente.
- Documentar cualquier variable nueva agregada por componente.

## Temas dinamicos con CSS variables

El framework publica variables CSS `--e-*` para permitir cambios de tema sin recompilar.

### Paleta primitiva publica

Ademas de los tokens semanticos del tema, la libreria expone una paleta primitiva pensada para usuarios consumidores.

La idea es separar:

1. Paleta primitiva publica: `--e-palette-red-500`, `--e-palette-blue-700`, etc.
2. Tokens semanticos del tema: `--e-color-primary`, `--e-color-surface-1`, etc.

La paleta primitiva no reemplaza el sistema actual `light` y `dark`; es una capa adicional para que la app consumidora tenga colores reutilizables consistentes.

Los props `color` de los componentes deben referenciar colores definidos en el sistema (`--e-color-*` o `--e-palette-*`).
No se considera parte del contrato pasar valores literales como `#000`, `rgb(...)` o `hsl(...)` directamente al prop.

#### API Sass

En `public/styles/override/variables/index.scss` existen tres piezas:

1. `$primitive-color-seeds`
2. `$primitive-color-overrides`
3. `$primitive-color-palettes`

`$primitive-color-seeds` define el color base por familia:

```scss
$primitive-color-seeds: (
  red: #ef4444,
  blue: #3b82f6,
  green: #22c55e,
  amber: #f59e0b,
  neutral: #6b7280,
) !default;
```

A partir de esas seeds, Drocket genera automaticamente una escala por color:

```css
--e-palette-red: #ef4444;
--e-palette-red-50: ...;
--e-palette-red-100: ...;
--e-palette-red-200: ...;
--e-palette-red-300: ...;
--e-palette-red-400: ...;
--e-palette-red-500: #ef4444;
--e-palette-red-600: ...;
--e-palette-red-700: ...;
--e-palette-red-800: ...;
--e-palette-red-900: ...;
```

#### Personalizar la paleta

Puedes redefinir las seeds antes de importar `drocket/setting.scss`:

```scss
$primitive-color-seeds: (
  red: #dc2626,
  blue: #2563eb,
  green: #16a34a,
  amber: #d97706,
  neutral: #4b5563,
) !default;

@import 'drocket/setting.scss';
```

Si quieres corregir tonos especificos sin perder la generacion automatica, usa `$primitive-color-overrides`:

```scss
$primitive-color-overrides: (
  red: (
    500: #dc2626,
    700: #b91c1c,
    900: #7f1d1d,
  ),
  blue: (
    500: #2563eb,
  ),
) !default;

@import 'drocket/setting.scss';
```

Eso te permite usar la paleta directamente en tu app:

```scss
:root {
  border-color: var(--e-palette-neutral-300);
}

.danger-banner {
  background: var(--e-palette-red-100);
  color: var(--e-palette-red-800);
}
```

### Como se generan

La fuente de verdad para tokens base vive en `public/styles/override/variables/index.scss`.

Reglas actuales:

1. Variables Sass simples se exportan automaticamente desde `public/styles/override/theme/base.scss`
2. Si la variable Sass empieza con `$e-`, la CSS var resultante conserva el nombre
3. Si no empieza con `$e-`, se le agrega el prefijo `e-`
4. Los mapas Sass no se exportan automaticamente; solo se convierten en CSS vars si se agregan a `$theme-base-css-var-groups`
5. La paleta primitiva publica se exporta ademas como `--e-palette-{color}` y `--e-palette-{color}-{tono}`

Ejemplos:

```scss
$border-radius-root: 4px;   // -> --e-border-radius-root
$e-bar-height: 64px;        // -> --e-bar-height
$root-font-family: "Roboto", sans-serif; // -> --e-root-font-family
```

Para grupos:

```scss
$icon-font-sizes: (
  small: 20px,
  default: 24px,
) !default;

$theme-base-css-var-groups: (
  "e-icon-size": $icon-font-sizes,
) !default;
```

Eso genera:

```css
--e-icon-size-small: 20px;
--e-icon-size-default: 24px;
```

### Variables disponibles

```css
/* Colores base (derivadas de $colors-light) */
--e-color-primary: #42b883;
--e-color-secondary: #35495e;
--e-color-error: #e74c3c;
--e-contrast-white: #000;
/* + todos los demás colores definidos */

/* Breakpoints */
--e-grid-breakpoint-xs: 0;
--e-grid-breakpoint-sm: 600px;
--e-grid-breakpoint-md: 960px;
--e-grid-breakpoint-lg: 1264px;
--e-grid-breakpoint-xl: 1904px;

/* Tamaños de botón */
--e-btn-height-x-small: 2.187rem;
--e-btn-height-small: 2.5rem;
--e-btn-height-default: 3rem;
/* + todas las variantes */

/* Otras variables globales */
--e-root-font-family: "Roboto", sans-serif;
--e-border-radius-root: 4px;
--e-space-base: 4px;
--e-bar-height: 64px;
--e-schedule-borderwidth: thin;
--e-schedule-bg: white;
--e-schedule-border-color: rgb(218, 220, 224);

/* Paleta primitiva */
--e-palette-red: #ef4444;
--e-palette-red-500: #ef4444;
--e-palette-blue-500: #3b82f6;
--e-palette-neutral-300: ...;
```

### Agregar nuevos tokens

#### Token simple

Si agregas una variable simple en `public/styles/override/variables/index.scss`, no hace falta registrarla en otro lado.

```scss
$field-label-gap: 6px !default;
```

Genera automaticamente:

```css
--e-field-label-gap: 6px;
```

#### Grupo de tokens

Si agregas un map y quieres una CSS var por item, debes incluirlo en `$theme-base-css-var-groups`.

```scss
$badge-sizes: (
  small: 16px,
  large: 24px,
) !default;

$theme-base-css-var-groups: (
  "e-grid-breakpoint": $grid-breakpoints,
  "e-badge-size": $badge-sizes,
) !default;
```

Genera:

```css
--e-badge-size-small: 16px;
--e-badge-size-large: 24px;
```

### Crear temas

Puedes sobreescribir variables CSS en tu app:

```scss
// src/styles/theme.css

// Light theme (default)
:root {
  --e-color-primary: #42b883;
  --e-color-secondary: #35495e;
  --e-schedule-bg: white;
}

// Dark theme
[data-theme='dark'] {
  --e-color-primary: #58d78d;
  --e-color-secondary: #8ca0b8;
  --e-schedule-bg: #1e1e1e;
  --e-schedule-border-color: #424242;
}
```

### Alternar temas en runtime

```javascript
// Cambiar tema
document.documentElement.setAttribute('data-theme', 'dark');

// O directamente con setProperty
document.documentElement.style.setProperty('--e-color-primary', '#58d78d');
document.documentElement.style.setProperty('--e-schedule-bg', '#1e1e1e');
```

Tambien puedes persistir el tema con `localStorage` y restaurarlo al montar la app.

### Colores personalizados

Los componentes usan un sistema genérico de colores. Puedes agregar colores completamente nuevos sin recompilar:

```scss
// En tu CSS
:root {
  --e-color-brand: #ff6b35;
  --e-contrast-brand: white;
  
  --e-color-custom-blue: #1e90ff;
  --e-contrast-custom-blue: #000;
}
```

```vue
<!-- Usa el color inmediatamente -->
<EButton color="brand">Mi marca</EButton>
<EButton color="custom-blue">Azul personalizado</EButton>
<EBar color="brand">Barra con color nuevo</EBar>
```

**Regla:** Cualquier color usado en el prop `color` intenta buscar:
1. `--e-color-{nombreColor}` para el fondo/color principal
2. `--e-contrast-{nombreColor}` para el texto (fallback: `white`)

Si no existen, se usa el color primario por defecto.

## Compatibilidad de variables legacy

En `public/styles/main.scss` tambien existen variables `--dr-*` para clases utilitarias de color y breakpoints.
Para nuevos componentes y theming dinamico, usa `--e-*` como fuente principal.
