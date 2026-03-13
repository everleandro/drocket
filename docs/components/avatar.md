# EAvatar

## Objetivo

`EAvatar` renderiza una imagen, un icono o un fallback visual compacto para representar personas, entidades o estados.

## Importacion

```ts
import { EAvatar } from 'drocket'
```

## Props

| Prop | Tipo | Default | Descripcion |
| --- | --- | --- | --- |
| `size` | `'x-small' \| 'small' \| 'default' \| 'large' \| 'x-large' \| string \| number` | `'default'` | Tamano preset o valor custom. Los numeros se convierten a px. |
| `color` | `string` | `undefined` | Agrega la clase `{color}--text`. |
| `elevation` | `string \| number` | `undefined` | Agrega la clase `e-elevation--{valor}`. |
| `icon` | `string \| IconPath \| IconPath[]` | `undefined` | Icono a renderizar cuando no hay `src`. |
| `src` | `string` | `undefined` | URL de imagen del avatar. |

## Slots

| Slot | Descripcion |
| --- | --- |
| `default` | Reemplaza por completo el contenido interno del avatar. |

## Comportamiento

- Si `src` contiene una URL valida, se renderiza la imagen.
- Si no hay `src`, el componente usa `icon`.
- Si tampoco hay `icon`, usa `iconFactory.person` como fallback.
- Los sizes preset se resuelven por clases CSS; los sizes custom se aplican mediante `--avatar-size`.

## Ejemplos

### Basico

```vue
<template>
  <EAvatar />
</template>
```

### Con imagen

```vue
<template>
  <EAvatar src="https://i.pravatar.cc/64?img=12" />
</template>
```

### Con icono y color

```vue
<template>
  <EAvatar :icon="iconFactory.clear" color="error" size="large" />
</template>

<script setup lang="ts">
import iconFactory from '@/utils/icons'
</script>
```

### Tamano custom

```vue
<template>
  <EAvatar size="44" color="brand" />
  <EAvatar :size="56" elevation="lg" />
</template>
```

## Accesibilidad

- Si el avatar es decorativo, no necesita texto adicional por si solo.
- Si representa una persona o entidad importante, acompanal con nombre visible o contexto cercano.
- El `alt` interno actual de la imagen es generico (`avatar`), asi que no confies en `EAvatar` como unica fuente semantica para identidad critica.

## Errores comunes

- Esperar iniciales automaticas: hoy el fallback es iconografico, no texto.
- Pasar `size="44px"` y `size="44"` pensando que son distintos: ambos funcionan, pero el string numerico tambien se convierte a px.
- Esperar que `color` afecte la imagen: solo afecta el modo icon/fallback y clases de texto.
- Usar `src` vacio esperando fallback transparente: string vacio se trata como ausencia de imagen y cae al icono.