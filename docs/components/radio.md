# ERadioGroup y ERadio

## Objetivo

`ERadioGroup` y `ERadio` resuelven seleccion exclusiva dentro del sistema compartido de `field`, con integracion con `EForm`, herencia de configuracion visual, soporte para variantes `row` y `column`, y propagacion centralizada de foco, readonly, disabled y color.

## Importacion

```ts
import { ERadio, ERadioGroup } from 'drocket'
```

## Navegacion Rapida

- [Props de ERadioGroup](#props-de-eradiogroup)
- [Props de ERadio](#props-de-eradio)
- [Eventos](#eventos)
- [Metodos expuestos](#metodos-expuestos)
- [Slots](#slots)
- [Ejemplos](#ejemplos)
- [Accesibilidad](#accesibilidad)
- [Errores comunes](#errores-comunes)

## Props de ERadioGroup

| Prop | Tipo | Default | Descripcion |
| --- | --- | --- | --- |
| `modelValue` | `string \| number \| null \| undefined` | `undefined` | Valor seleccionado actualmente dentro del grupo. |
| `mandatory` | `boolean` | `false` | Cuando esta activo y no existe seleccion valida, intenta inicializar el primer radio disponible al montar. |
| `row` | `boolean` | `false` | Distribuye los radios en horizontal. Cuando no se usa, el grupo se comporta en columna. |
| `showOverlay` | `boolean` | `false` | Muestra el overlay visual del field en el contenedor del grupo. |
| `flat` | `boolean` | `false` | Oculta la linea inferior del field cuando se combina con la variante del grupo. |

Ademas hereda las props base de `FieldBaseProps`, como `label`, `detail`, `detailErrors`, `detailsOnMessageOnly`, `outlined`, `disabled`, `readonly`, `color`, `retainColor`, `labelBehavior`, `labelMinWidth` y props de grid como `cols`, `md` o `xl`.

## Props de ERadio

| Prop | Tipo | Default | Descripcion |
| --- | --- | --- | --- |
| `modelValue` | `string \| number \| null \| undefined` | `undefined` | Valor representado por esa opcion individual. Cuando coincide con el `modelValue` del grupo, el radio se considera activo. |
| `label` | `string \| number` | `undefined` | Etiqueta visible de la opcion. |

`ERadio` debe renderizarse dentro de un `ERadioGroup`. No esta pensado como control autonomo fuera de ese contexto.

## Eventos

### ERadioGroup

| Evento | Payload | Descripcion |
| --- | --- | --- |
| `update:modelValue` | `string \| number \| null \| undefined` | Emitido cuando cambia la opcion seleccionada. |
| `focus` | `FocusEvent` | Emitido cuando cualquiera de los radios hijos recibe foco. |
| `blur` | `Event` | Emitido cuando el grupo pierde foco efectivo. |

### ERadio

`ERadio` no expone un contrato de eventos publico separado. La interaccion y el valor seleccionado se coordinan desde `ERadioGroup`.

## Metodos expuestos

### ERadioGroup

`ERadioGroup` participa del sistema de `field` compartido, por lo que hereda los metodos expuestos habituales a traves del contenedor del field.

### ERadio

`ERadio` no documenta metodos expuestos como API publica. Su ciclo de vida y configuracion dependen del grupo padre.

## Slots

### ERadioGroup

| Slot | Descripcion |
| --- | --- |
| `default` | Lista de componentes `ERadio` hijos. |
| `label` | Reemplaza el contenido visible de la etiqueta del grupo. |

### ERadio

| Slot | Descripcion |
| --- | --- |
| `label` | Reemplaza el contenido visible de la etiqueta de la opcion. |

## Ejemplos

### Grupo basico en fila

```vue
<template>
  <ERadioGroup v-model="contactChannel" row label="Canal de contacto">
    <ERadio model-value="email" label="Email" />
    <ERadio model-value="slack" label="Slack" />
    <ERadio model-value="meet" label="Meet" />
  </ERadioGroup>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const contactChannel = ref<'email' | 'slack' | 'meet'>('slack')
</script>
```

### Integrado con EForm

```vue
<template>
  <EForm field-color="teal-900" label-behavior="floating">
    <ERadioGroup
      v-model="releaseTrack"
      label="Release track"
      detail="Elige el canal de despliegue"
      color="secondary"
    >
      <ERadio model-value="stable" label="Stable" />
      <ERadio model-value="beta" label="Beta" />
      <ERadio model-value="canary" label="Canary" />
    </ERadioGroup>
  </EForm>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const releaseTrack = ref<'stable' | 'beta' | 'canary'>('beta')
</script>
```

### Con seleccion obligatoria

```vue
<template>
  <ERadioGroup v-model="audience" mandatory label="Audience">
    <ERadio model-value="internal" label="Internal" />
    <ERadio model-value="beta-users" label="Beta users" />
    <ERadio model-value="public" label="Public" />
  </ERadioGroup>
</template>
```

## Accesibilidad

- `ERadioGroup` renderiza un contenedor con `role="radiogroup"` y enlaza etiqueta y detalles mediante `aria-labelledby` y `aria-describedby`.
- Cada `ERadio` usa un `input type="radio"` nativo con `role="radio"`, `aria-checked`, `aria-disabled` y `aria-readonly`.
- El foco se coordina a nivel de grupo, de modo que `focus` y `blur` se emiten desde `ERadioGroup` aunque el elemento enfocado real sea un hijo.
- El area clicable se amplia alrededor de cada opcion sin perder la semantica del input nativo.
- Cuando el grupo recibe color desde `EForm` o desde su propia prop `color`, lo propaga a los radios hijos mediante configuracion de field en lugar de usar variables CSS especificas del grupo.

## Errores comunes

- Usar `ERadio` fuera de `ERadioGroup`: el componente depende del contexto inyectado por el grupo y lanzara un error.
- Esperar que cada `ERadio` tenga `v-model` propio: el estado seleccionado pertenece al grupo.
- Mezclar tipos incompatibles entre `ERadioGroup.modelValue` y los `model-value` de los hijos: la opcion activa depende de una comparacion exacta.
- Esperar comportamiento floating identico en `row` y `column`: el layout del label cambia segun la disposicion y el estado del field.
- Usar color via una variable CSS especifica del grupo: en la arquitectura actual el color debe llegar por propagacion de configuracion, igual que el resto de fields.