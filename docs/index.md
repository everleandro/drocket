# Drocket Docs

Drocket es una libreria de componentes para Vue 3 orientada a construir interfaces consistentes y reutilizables.

## Empezar rapido

1. Instala el paquete:

```bash
npm install drocket
```

2. Registra el plugin en tu app Vue:

```ts
import { createApp } from 'vue'
import App from './App.vue'
import { Drocket } from 'drocket'
import 'drocket/styles.css'

const app = createApp(App)
app.use(Drocket)
app.mount('#app')
```

## Secciones

- [Guia de inicio](./getting-started.md)
- [Theming](./theming.md)
- [Componentes](./components/README.md)

## Convencion de docs por componente

Cada componente debe incluir:

- objetivo
- importacion
- props
- eventos
- slots
- ejemplos
- notas de accesibilidad
- errores comunes
