# ECheckbox

## Objetivo

`ECheckbox` representa una seleccion binaria dentro del sistema compartido de `field`, con soporte para `v-model`, valores custom, integracion con `EForm`, detalles integrados y exposicion consistente con el resto de form controls.

## Importacion

```ts
import { ECheckbox } from 'drocket'
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
| `modelValue` | `boolean \| string \| number` | `undefined` | Valor actual del checkbox. Se compara contra `trueValue` para resolver el estado marcado. |
| `trueValue` | `boolean \| string \| number` | `true` | Valor emitido cuando el checkbox se marca. |
| `falseValue` | `boolean \| string \| number` | `false` | Valor emitido cuando el checkbox se desmarca. |
| `showOverlay` | `boolean` | `false` | Muestra el overlay visual del field dentro del slot principal. |

Ademas hereda las props base de campo definidas por `UseFieldProps`, como `label`, `detail`, `detailErrors`, `detailsOnMessageOnly`, `rules`, `outlined`, `disabled`, `readonly`, `color`, `retainColor`, `labelBehavior`, `labelMinWidth` y props de grid como `cols`, `md` o `xl`.

## Eventos

| Evento | Payload | Descripcion |
| --- | --- | --- |
| `update:modelValue` | `boolean \| string \| number` | Emitido cuando cambia el estado del checkbox. |
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
  <ECheckbox v-model="accepted" label="Acepto terminos" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const accepted = ref(false)
</script>
```

### Con valores custom

```vue
<template>
  <ECheckbox
    v-model="releaseChecklist"
    label="Checklist de release"
    true-value="ready"
    false-value="hold"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const releaseChecklist = ref<'ready' | 'hold'>('hold')
</script>
```

### Integrado con EForm

```vue
<template>
  <EForm field-color="teal-900" label-behavior="floating">
    <ECheckbox
      v-model="termsAccepted"
      label="Acepto terminos"
      detail="Necesario para continuar"
      :rules="[(value) => value === true || 'Debes aceptar los terminos']"
    />
  </EForm>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const termsAccepted = ref(false)
</script>
```

## Accesibilidad

- Usa un `input type="checkbox"` nativo con `role="checkbox"` y una etiqueta asociada mediante `for`/`id`.
- Cuando hay supporting text visible, lo enlaza mediante `aria-describedby`.
- Expone `aria-invalid`, `aria-disabled`, `aria-readonly` y `aria-checked` segun el estado efectivo del control.
- Mantiene soporte de teclado nativo del checkbox, incluyendo foco y alternancia con teclado.
- El area clicable se amplifica a nivel del slot del field para mejorar la interaccion sin perder la semantica del input nativo.

## Errores comunes

- Pasar `modelValue` con un tipo que no coincide con `trueValue` o `falseValue`: el estado marcado depende de esa comparacion exacta.
- Esperar que `readonly` permita cambiar visualmente el valor: en este componente se trata como estado no interactivo.
- Usar `detailsOnMessageOnly` esperando que siempre se vea el helper text: cuando no hay error ni mensaje de validacion, el detail se oculta por contrato del sistema de fields.
- Pensar que `showOverlay` cambia el comportamiento del control: solo afecta la capa visual del field.