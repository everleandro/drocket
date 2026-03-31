# ESelect

## Objetivo

`ESelect` resuelve seleccion simple o multiple con soporte para items primitivos u objetos, busqueda opcional, chips, keyboard navigation, custom rendering por slots y control por `v-model`.

## Importacion

```ts
import { ESelect } from 'drocket'
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
| `modelValue` | `SelectModelValue` | `undefined` | Valor seleccionado actual. Puede ser simple o arreglo si `multiple=true`. |
| `items` | `SelectItemType[]` | requerido | Lista de opciones disponibles. |
| `itemText` | `string` | `'text'` | Clave usada para obtener texto cuando los items son objetos. |
| `itemValue` | `string` | `'value'` | Clave usada para obtener valor cuando los items son objetos. |
| `multiple` | `boolean` | `false` | Permite seleccion multiple. |
| `returnObject` | `boolean` | `false` | Emite el item completo en lugar del valor normalizado. |
| `loading` | `boolean` | `false` | Muestra estado de carga y barra lineal. |
| `search` | `string \| number` | `undefined` | Valor de busqueda controlado externamente. |
| `autocomplete` | `boolean` | `false` | Permite escribir en el input interno y emitir `update:search`. |
| `placeholder` | `string` | `undefined` | Placeholder mostrado cuando no hay seleccion. |
| `chip` | `boolean` | `false` | Renderiza selecciones como `EChip`. |
| `chipClosable` | `boolean` | `false` | En seleccion simple, permite cerrar el chip activo. |
| `prefix` | `string` | `undefined` | Texto decorativo previo a la seleccion. |
| `suffix` | `string` | `undefined` | Texto decorativo posterior a la seleccion. |
| `inputAlign` | `string` | `'start'` | Alineacion del texto o selecciones. |
| `itemCol` | `string \| number` | `1` | Cantidad de columnas visuales para el listado. |
| `lineWidth` | `string \| number` | `undefined` | Grosor personalizado de la linea inferior cuando no es outlined. |
| `limit` | `string \| number` | `undefined` | Reservado para el contrato compartido del field; no limita el numero de items seleccionados. |
| `arrowDown` | `string \| IconPath \| IconPath[]` | `undefined` | Reemplaza el icono decorativo del activador. |
| `menuColor` | `string` | `undefined` | Color heredable del dropdown. Prioriza `menuColor` y si no existe reutiliza `color` del componente. |

Ademas hereda props base de field como `label`, `detail`, `outlined`, `disabled`, `readonly`, `clearable`, `prependIcon`, `appendIcon`, `color`, `rules` y props de grid.

## Eventos

| Evento | Payload | Descripcion |
| --- | --- | --- |
| `update:modelValue` | `SelectModelValue` | Emitido al cambiar la seleccion. |
| `update:search` | `string \| number` | Emitido cuando cambia la busqueda en modo `autocomplete`. |
| `focus` | `FocusEvent` | Emitido al enfocar el input/activador interno. |
| `blur` | `Event` | Emitido al perder foco. |
| `click:clear` | `void` | Emitido al usar el control de limpieza. |
| `click:prepend` | `void` | Emitido al hacer click en el icono prepend. |
| `click:append` | `void` | Emitido al hacer click en el icono append externo. |

## Metodos expuestos

| Metodo | Retorno | Descripcion |
| --- | --- | --- |
| `focus()` | `void` | Enfoca el input interno. |
| `blur()` | `void` | Quita foco del input interno. |
| `validate()` | `boolean` | Ejecuta validacion del field. |
| `reset()` | `void` | Restablece valor y estado del control. |
| `resetValidation()` | `void` | Limpia solo estado de validacion. |

Tambien expone `input` via `ref`.

Si necesitas interactuar programaticamente con el control, usa `focus()` sobre el componente y deja que `ESelect` administre apertura, highlighted option y sincronizacion de busqueda.

## Slots

| Slot | Descripcion |
| --- | --- |
| `label` | Reemplaza el contenido visible de la etiqueta. |
| `selection` | Personaliza el render de la seleccion actual. Recibe `selection` y `attrs`. |
| `item` | Personaliza cada opcion del listado. Recibe `item` y `attrs`. |

## Ejemplos

### Basico

```vue
<template>
  <ESelect v-model="status" :items="['Draft', 'Review', 'Published']" label="Estado" />
</template>
```

### Items objeto con `returnObject`

```vue
<template>
  <ESelect
    v-model="assignee"
    :items="users"
    item-text="name"
    item-value="id"
    return-object
    label="Responsable"
  />
</template>
```

### Multiple con chips

```vue
<template>
  <ESelect
    v-model="tags"
    :items="['UI', 'Docs', 'Bug', 'Infra']"
    multiple
    chip
    clearable
    label="Etiquetas"
  />
</template>
```

### Autocomplete controlado

```vue
<template>
  <ESelect
    v-model="selectedUser"
    :items="filteredUsers"
    :search="search"
    autocomplete
    label="Buscar usuario"
    @update:search="search = $event"
  />
</template>
```

## Accesibilidad

- El input interno usa `role="combobox"` y enlaza el listado mediante `aria-controls`.
- Expone `aria-expanded`, `aria-activedescendant`, `aria-autocomplete`, `aria-invalid`, `aria-disabled` y `aria-readonly`.
- El listado usa `role="listbox"` y mantiene una opcion destacada para navegacion por teclado.
- Soporta `ArrowUp`, `ArrowDown`, `Home`, `End`, `Enter`, `Escape`, `Tab` y flujo especial de chips con `Backspace` en modo multiple.

## Errores comunes

- Pasar objetos sin configurar `itemText` o `itemValue` cuando tus claves no son `text` y `value`.
- Activar `autocomplete` esperando filtrado automatico: el componente emite `update:search`, pero el filtrado de `items` lo controlas externamente.
- Usar `returnObject` sin cuidar igualdad referencial entre items remotos: la seleccion depende del valor comparable o del objeto emitido segun configuracion.
- Esperar que `limit` restrinja cantidad de seleccionados: no controla eso; solo forma parte del contrato comun del field.