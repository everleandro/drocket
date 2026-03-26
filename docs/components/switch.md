# ESwitch

## Objetivo

`ESwitch` representa un valor booleano o binario dentro del sistema de `field` compartido, con soporte para `v-model`, estados `readonly` y `loading`, detalles integrados y exposicion consistente con `EForm`.

## Importacion

```ts
import { ESwitch } from 'drocket'
```

## Navegacion Rapida

- [Props](#props)
- [Eventos](#eventos)
- [Metodos expuestos](#metodos-expuestos)
- [Slots](#slots)
- [Ejemplos](#ejemplos)
- [Accesibilidad](#accesibilidad)
- [Errores comunes](#errores-comunes)

## Props

| Prop | Tipo | Default | Descripcion |
| --- | --- | --- | --- |
| `modelValue` | `boolean \| string \| number` | `undefined` | Valor actual del switch. Se compara contra `trueValue` para resolver el estado activo. |
| `trueValue` | `boolean \| string \| number` | `true` | Valor emitido cuando el switch se activa. |
| `falseValue` | `boolean \| string \| number` | `false` | Valor emitido cuando el switch se desactiva. |
| `loading` | `boolean` | `false` | Vuelve el control no interactivo y muestra un indicador visual de carga. |
| `hideOverlay` | `boolean` | `false` | Oculta el overlay visual del field. |

Ademas hereda las props base de campo definidas por `FieldBaseProps`, como `label`, `detail`, `rules`, `outlined`, `disabled`, `readonly`, `color`, `labelBehavior`, `labelMinWidth`, `retainColor` y props de grid como `cols`, `md` o `xl`.

## Eventos

| Evento | Payload | Descripcion |
| --- | --- | --- |
| `update:modelValue` | `boolean \| string \| number` | Emitido cuando cambia el estado del switch. |
| `focus` | `FocusEvent` | Emitido cuando el control recibe foco. |
| `blur` | `Event` | Emitido cuando el control pierde foco. |

## Metodos expuestos

| Metodo | Retorno | Descripcion |
| --- | --- | --- |
| `focus()` | `void` | Enfoca el control interno. |
| `blur()` | `void` | Quita el foco del control interno. |
| `validate()` | `boolean` | Ejecuta las reglas del field. |
| `reset()` | `void` | Restablece el valor y el estado interno del field. |
| `resetValidation()` | `void` | Limpia solo el estado de validacion. |

Tambien expone `input` via `ref` si necesitas acceso al `HTMLInputElement` nativo.

## Slots

| Slot | Descripcion |
| --- | --- |
| `label` | Reemplaza el contenido visible de la etiqueta. |

## Ejemplos

### Basico

```vue
<template>
  <ESwitch v-model="notifications" label="Notificaciones" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const notifications = ref(false)
</script>
```

### Con valores custom

```vue
<template>
  <ESwitch
    v-model="releaseGate"
    label="Release gate"
    true-value="publish"
    false-value="draft"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const releaseGate = ref<'publish' | 'draft'>('draft')
</script>
```

### En loading

```vue
<template>
  <ESwitch
    v-model="analytics"
    label="Analytics en vivo"
    :loading="true"
    :true-value="1"
    :false-value="0"
  />
</template>
```

## Accesibilidad

- Usa un `input type="checkbox"` con `role="switch"` y una etiqueta visible asociada mediante `for`/`id`.
- Cuando hay supporting text visible, lo enlaza mediante `aria-describedby`.
- Expone `aria-invalid`, `aria-disabled`, `aria-readonly` y `aria-busy` segun el estado efectivo del control.
- En `loading` el indicador visual interno es decorativo y no se anuncia como `progressbar`; el estado ocupado se comunica desde el control principal.
- `readonly` se trata como estado no interactivo dentro de este componente para evitar una UX ambigua en controles binarios.

## Errores comunes

- Esperar que `readonly` permita enfocar y cambiar visualmente el switch sin confirmar el valor: en `ESwitch` ese estado se trata como no interactivo.
- Usar `loading` solo como señal visual: en este componente tambien bloquea interaccion y ajusta atributos accesibles.
- Pasar `modelValue` con un tipo que no coincide con `trueValue`/`falseValue`: el estado activo depende de esa comparacion exacta.
- Esperar eventos de `prependIcon` o `appendIcon`: `ESwitch` hereda props base de field, pero este control no renderiza esos iconos como puntos de interaccion.