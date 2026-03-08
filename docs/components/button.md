# EButton

## Objetivo

`EButton` renderiza botones de accion con variantes visuales, estado de carga, iconos y soporte de link.

## Importacion

```ts
import { EButton } from 'drocket'
```

## Props

| Prop | Tipo | Default | Descripcion |
| --- | --- | --- | --- |
| `disabled` | `boolean` | `false` | Desactiva interaccion. |
| `link` | `boolean` | `false` | Fuerza render como `<a>`. |
| `appendIcon` | `IconPath \| IconPath[] \| string` | `undefined` | Icono al final del contenido. |
| `prependIcon` | `IconPath \| IconPath[] \| string` | `undefined` | Icono al inicio del contenido. |
| `ripple` | `boolean` | `false` | Habilita clase/efecto ripple. |
| `loading` | `boolean` | `false` | Muestra loader y bloquea interaccion. |
| `color` | `string` | `undefined` | Color base. Resuelve `--e-color-{color}` y `--e-contrast-{color}`. |
| `hoverColor` | `string` | `undefined` | Color al hover. Si existe, reemplaza `color` mientras hover esta activo. |
| `fab` | `boolean` | `false` | Variante circular flotante. |
| `depressed` | `boolean` | `false` | Quita sombra. |
| `text` | `boolean` | `false` | Variante texto (fondo transparente). |
| `outlined` | `boolean` | `false` | Variante outlined. |
| `block` | `boolean` | `false` | Ocupa todo el ancho disponible. |
| `xSmall` | `boolean` | `false` | Tamano extra pequeno. |
| `small` | `boolean` | `false` | Tamano pequeno. |
| `large` | `boolean` | `false` | Tamano grande. |
| `xLarge` | `boolean` | `false` | Tamano extra grande. |
| `rounded` | `boolean` | `false` | Bordes redondeados. |
| `stacked` | `boolean` | `false` | Acomoda icono/contenido en columna. |
| `icon` | `IconPath \| IconPath[] \| string` | `undefined` | Icono principal cuando no hay slot default. |
| `height` | `string \| number` | `undefined` | Alto en px (`style.height`). |
| `width` | `string \| number` | `undefined` | Ancho en px (`style.width`). |
| `type` | `string` | `'button'` | Tipo de boton HTML. |

## Atributos heredados

`EButton` usa `useAttrs()`, por lo que acepta atributos nativos y de routing:

- `to="/ruta"` renderiza `router-link`.
- `to="https://..."` renderiza `<a href="...">`.
- con `link`, siempre renderiza `<a>`.

## Slots

| Slot | Descripcion |
| --- | --- |
| `default` | Contenido principal del boton. |
| `loading` | Loader personalizado cuando `loading=true`. |

## Ejemplos

### Basico

```vue
<template>
  <EButton color="primary">Guardar</EButton>
</template>
```

### Con iconos y estado loading

```vue
<template>
  <EButton
    color="secondary"
    prepend-icon="mdiContentSave"
    :loading="saving"
  >
    Guardar cambios
  </EButton>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const saving = ref(false)
</script>
```

### Como enlace externo

```vue
<template>
  <EButton to="https://example.com" link text>
    Ver sitio
  </EButton>
</template>
```

### Color personalizado sin recompilar

```vue
<template>
  <EButton color="brand">Marca</EButton>
</template>

<style>
:root {
  --e-color-brand: #1e88e5;
  --e-contrast-brand: #ffffff;
}
</style>
```

## Accesibilidad

- Usa texto visible y especifico en el slot `default`.
- Si el boton solo tiene icono, agrega `aria-label`.
- Evita deshabilitar botones sin una explicacion visible para el usuario.

## Errores comunes

- Usar `height`/`width` esperando unidades distintas a px: el componente agrega `px` automaticamente.
- Definir `to` sin Vue Router para rutas internas: en ese caso usa `link` + `href` externo o instala Router.
- Definir `color="brand"` sin crear `--e-color-brand`: en ese caso se usa el color primario por defecto.
