# Theming

Drocket expone estilos Sass para personalizar variables y mixins.

## Import recomendado

```scss
// assets/styles/variables.scss
$border-radius-root: 4px;
$root-font-size: 16px;

$colors: (
  'primary': #f19933,
  'secondary': #2c373c,
  'white': #ffffff,
  'black': #000000,
  'disabled': rgba(0, 0, 0, 0.38),
  'success': #66bb6a,
  'error': #f44336
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
