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

### Variables disponibles

```css
/* Colores base (derivadas de $colors-light) */
--e-color-primary: #42b883;
--e-color-secondary: #35495e;
--e-color-error: #e74c3c;
--e-contrast-white: #000;
/* + todos los demás colores definidos */

/* Breakpoints */
--e-breakpoint-xs: 600px;
--e-breakpoint-sm: 960px;
--e-breakpoint-md: 1264px;
--e-breakpoint-lg: 1904px;

/* Tamaños de botón */
--e-btn-height-x-small: 2.187rem;
--e-btn-height-small: 2.5rem;
--e-btn-height-default: 3rem;
/* + todas las variantes */

/* Otras variables globales */
--e-root-font-family: "Roboto", sans-serif;
--e-border-radius-root: 4px;
--e-space-base: 12px;
--e-schedule-bg: white;
--e-schedule-border-color: rgb(218, 220, 224);
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
