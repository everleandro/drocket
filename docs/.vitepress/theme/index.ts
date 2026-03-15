import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import DatePickerDocsDemo from "./components/DatePickerDocsDemo.vue";
import "../../../src/assets/sass/main.scss";
import "../../../public/styles/main.scss";

const theme: Theme = {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("DatePickerDocsDemo", DatePickerDocsDemo);
  },
};

export default theme;
