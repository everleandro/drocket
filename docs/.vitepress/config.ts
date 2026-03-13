import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Drocket',
  description: 'Vue 3 UI component library',
  lang: 'es-ES',
  themeConfig: {
    nav: [
      { text: 'Inicio', link: '/' },
      { text: 'Guia', link: '/getting-started' },
      { text: 'Componentes', link: '/components/' }
    ],
    sidebar: [
      {
        text: 'Fundamentos',
        items: [
          { text: 'Inicio', link: '/' },
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'Theming', link: '/theming' }
        ]
      },
      {
        text: 'Componentes',
        items: [
          { text: 'Indice', link: '/components/' },
          { text: 'Avatar', link: '/components/avatar' },
          { text: 'Button', link: '/components/button' },
          { text: 'Card', link: '/components/card' },
          { text: 'Chip', link: '/components/chip' },
          { text: 'Dialog', link: '/components/dialog' },
          { text: 'Icon', link: '/components/icon' }
        ]
      }
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/everleandro/drocket' }]
  }
})
