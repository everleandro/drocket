# ETextfield

## Objetivo

`ETextfield` cubre captura de texto, numeros y cadenas cortas con soporte para validacion, contador, clearable, prefijos/sufijos y eventos ricos de entrada integrados con `EForm`.

## Importacion

```ts
import { ETextfield } from 'drocket'
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
| `modelValue` | `string \| number \| null` | `undefined` | Valor actual del input. |
| `type` | `string` | `'text'` | Tipo nativo del input HTML. |
| `name` | `string` | `undefined` | Atributo `name` del input. |
| `placeholder` | `string` | `undefined` | Placeholder visible cuando no aplica label flotante o cuando el label ya floto. |
| `autocomplete` | `string` | `undefined` | Valor pasado al atributo `autocomplete`. |
| `inputmode` | `TextInputInputMode` | `undefined` | Sugiere teclado virtual apropiado en dispositivos moviles. |
| `inputAlign` | `string` | `'start'` | Alineacion del contenido del input. |
| `inputReadonly` | `boolean` | `false` | Marca el input como readonly sin desactivar el field completo. |
| `disabled` | `boolean` | `false` | Desactiva interaccion. |
| `clearable` | `boolean` | `false` | Muestra control de limpieza cuando hay valor y el field puede limpiarse. |
| `iconClear` | `string \| IconPath \| IconPath[]` | `undefined` | Reemplaza el icono del boton de clear. |
| `limit` | `string \| number` | `undefined` | Limite maximo de caracteres. Tambien alimenta contador si `counter` esta activo. |
| `counter` | `boolean` | `false` | Muestra contador en `EDetails`. |
| `prefix` | `string` | `undefined` | Texto decorativo antes del input. |
| `suffix` | `string` | `undefined` | Texto decorativo despues del input. |
| `spellcheck` | `boolean` | `false` | Controla correccion ortografica nativa. |
| `autocapitalize` | `string` | `undefined` | Pasa el valor al atributo `autocapitalize`. |
| `enterkeyhint` | `TextInputEnterKeyHint` | `undefined` | Sugiere etiqueta/accion del enter virtual en teclado movil. |
| `modelModifiers` | `trim \| number \| lazy` | `{}` | Modificadores compatibles con la logica interna del input. |

Ademas hereda las props base de campo, como `label`, `detail`, `rules`, `outlined`, `readonly`, `prependIcon`, `appendIcon`, `color`, `labelBehavior` y props de grid.

## Eventos

| Evento | Payload | Descripcion |
| --- | --- | --- |
| `update:modelValue` | `string \| number \| null` | Emitido cuando cambia el valor normalizado del input. |
| `focus` | `FocusEvent` | Emitido al enfocar el input. |
| `blur` | `Event` | Emitido al perder foco. |
| `input` | `TextInputValueEventPayload` | Emitido en cada entrada, con `rawValue`, `value` y `event`. |
| `change` | `TextInputValueEventPayload` | Emitido al cambio nativo del input. |
| `keydown` | `TextInputKeyEventPayload` | Emitido en cualquier `keydown`. |
| `keyup` | `TextInputKeyEventPayload` | Emitido en cualquier `keyup`. |
| `keydown:enter` | `TextInputKeyEventPayload` | Emitido especificamente al presionar Enter. |
| `compositionstart` | `TextInputValueEventPayload<CompositionEvent>` | Inicio de composicion IME. |
| `compositionend` | `TextInputValueEventPayload<CompositionEvent>` | Fin de composicion IME. |
| `click:clear` | `void` | Emitido al usar el control de limpieza. |

## Metodos expuestos

| Metodo | Retorno | Descripcion |
| --- | --- | --- |
| `focus()` | `void` | Enfoca el input interno. |
| `blur()` | `void` | Quita foco del input interno. |
| `select()` | `void` | Selecciona el texto del input interno. |
| `validate()` | `boolean` | Ejecuta reglas del field. |
| `reset()` | `void` | Restablece valor y estado interno. |
| `resetValidation()` | `void` | Limpia solo el estado de validacion. |

Tambien expone `input` via `ref` si necesitas acceso directo al elemento nativo.

## Slots

| Slot | Descripcion |
| --- | --- |
| `label` | Reemplaza el contenido visible de la etiqueta. |

## Ejemplos

### Basico

```vue
<template>
  <ETextfield v-model="name" label="Nombre" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const name = ref('')
</script>
```

### Con prefijo, sufijo y contador

```vue
<template>
  <ETextfield
    v-model="rate"
    label="Tarifa"
    prefix="$"
    suffix="USD"
    :limit="6"
    counter
  />
</template>
```

### Clearable con label flotante

```vue
<template>
  <ETextfield
    v-model="email"
    label="Email"
    label-behavior="floating"
    clearable
    autocomplete="email"
  />
</template>
```

### Escuchar payload de entrada

```vue
<template>
  <ETextfield
    v-model="username"
    label="Usuario"
    @input="handleInput"
    @keydown:enter="submitFromKeyboard"
  />
</template>
```

## Accesibilidad

- Usa un `label` asociado al input y enlaza mensajes auxiliares mediante `aria-describedby` cuando existen detalles o contador.
- Expone `aria-invalid`, `aria-disabled` y `aria-readonly` segun el estado del field.
- El boton de limpieza solo aparece cuando el campo puede limpiarse; si dependes de lectores de pantalla, conviene acompanar el control con una etiqueta clara de contexto en el label.

## Errores comunes

- Usar `readonly` esperando bloquear solo el input: ese estado forma parte del contrato del field completo; si quieres apuntar al control interno, usa `inputReadonly`.
- Pasar `counter` sin `limit` esperando tope duro de longitud: el contador informa, pero el limite efectivo depende de `limit`.
- Esperar placeholder visible siempre con label flotante: cuando el label no ha flotado todavia, el placeholder se oculta para evitar duplicidad visual.