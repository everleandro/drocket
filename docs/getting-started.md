# Getting Started

## Requisitos

- Vue 3
- Node 18+
- Bundler compatible con ESM (Vite recomendado)

## Instalacion

```bash
npm install drocket
```

## Uso en Vue (global)

```ts
import { createApp } from 'vue'
import App from './App.vue'
import { Drocket } from 'drocket'
import 'drocket/styles.css'

const app = createApp(App)
app.use(Drocket)
app.mount('#app')
```

## Uso por componente

```ts
import { EButton, ECard } from 'drocket'
```

## Importar estilos de framework

```scss
@import 'drocket/framework.scss';
```

## Nuxt 3 (plugin)

```ts
// plugins/drocket.ts
import { Drocket } from 'drocket'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Drocket)
})
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  css: ['drocket/styles.css', 'drocket/framework.scss']
})
```

## Desarrollo local

Para probar cambios de componentes y estilos en un entorno aislado:

```bash
npm run playground:dev
```

Para generar build del playground:

```bash
npm run playground:build
```

Para previsualizar el build del playground:

```bash
npm run playground:preview
```
