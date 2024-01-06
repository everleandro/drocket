# DRocket Vue UI Components Library

A comprehensive collection of reusable Vue.js UI components to streamline your development process. It contains frequently used components, adaptable to your needs. You can use each of the proposed components or just use the one you need.

## You can read the full documentation [here](https://drocket-doc.vercel.app/).

- [Get Started](https://drocket-doc.vercel.app/)
- [Buttons](https://drocket-doc.vercel.app/buttons)
- [Icons](https://drocket-doc.vercel.app/icons)
- [Date Pickers](https://drocket-doc.vercel.app/date-picker)
- Forms & Inputs
  - [form](https://drocket-doc.vercel.app/form)
  - [Text Fields](https://drocket-doc.vercel.app/form/text-fields)
  - [Selects](https://drocket-doc.vercel.app/form/selects)

# Instalation and basic setup

## Installation

```bash
npm install drocket
```

```javascript
import { EButton, EForm, ECheckbox, EDIalog, ESelect,...rest } from "drocket";
```

# Setup

### vue app

```javascript
// src/main.ts

import { createApp } from "vue";
import "drocket/styles.css";
import App from "./App.vue";
import { Drocket } from "drocket";

const app = createApp(App);
// this line auto imports all components and directives
app.use(Drocket);
app.mount("#app");
```

```javascript
// vite.config.ts

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        // This is the path to your variables
        additionalData: `          
        @import "assets/styles/variables.scss";";
        `,
      },
    },
  },
});
```

```scss
// src/style.scss
@import "drocket/framework.scss";
```

### nuxt app

```javascript
// plugins/drocket.ts

import { Drocket } from "drocket";
export default defineNuxtPlugin((nuxtApp) => {
  // this line auto imports all components and directives
  nuxtApp.vueApp.use(Drocket);
});
```

```javascript
// nuxt.config.ts

export default defineNuxtConfig({
  css: [
    "drocket/styles.css",
    "drocket/framework.scss",
  ],
   ...
  vite: {
   ...
    css: {
      preprocessorOptions: {
        scss: {
          // This is the path to your variables
          additionalData: '@import "assets/styles/variables.scss";',
        },
      },
    },
  },
});
```

# Example variable file

```scss
// assets/styles/variables.scss

// Globals
$border-radius-root: 4px;
$root-font-size: 2rem;

// Colors
$colors: (
  "primary": #f19933,
  "secondary": #2c373c,
  "white": white,
  "black": black,
  "disabled": rgba(0, 0, 0, 0.38),
  "success": #66bb6a,
  "red": #f44336,
  "error": #f44336,
);

// This is mandatory
@import "drocket/setting.scss";
```

# Contribute

We welcome and encourage contributions from the community! If you'd like to contribute to the Vue UI Components library, here's how you can get started:

## Fork the Repository

Fork the repository on GitHub and clone it to your local machine.

```bash
git clone https://github.com/your-username/drocket-contributions.git
```

## Create a Branch

Create a new branch for your contributions.

```bash
git checkout -b feature-branch
```

## Make Changes

Make your changes to the code using your preferred code editor.

## Commit Changes

Stage and commit your changes.

```bash
git add .
git commit -m "Add feature or fix issue"
```

## Push Changes

Push your changes to your forked repository.

```bash
git push origin feature-branch
```

## Open a Pull Request

Visit your forked repository on GitHub, and open a pull request to the main repository.

## Report Issues

If you encounter any issues or have suggestions for improvements, please report them on our [Issues](https://github.com/everleandro/drocket/issues) page. Before creating a new issue, check if a similar one already exists.

# Thank You!

We appreciate your contributions and feedback. Together, let's make the Drocket even better!
