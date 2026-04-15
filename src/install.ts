import type { App, Component, Directive } from "vue";
import * as _components from "./components";
import * as _directives from "./directives";
import type { Locale } from "./locales";
import { registerLocales } from "./locales";
import type { IconPath } from "./types";
import { registerIcons } from "./utils/icons";

export interface DrocketInstallOptions {
  icons?: Record<string, IconPath | string | Array<IconPath>>;
  locales?: Record<string, Locale>;
  components?: Record<string, Component>;
}

export function install(Vue: App, args: DrocketInstallOptions = {}): void {
  registerIcons(args.icons);
  registerLocales(args.locales);

  const directives = _directives as Record<string, Directive>;
  for (const key in directives) {
    Vue.directive(key, directives[key]);
  }

  const components =
    args.components || (_components as Record<string, Component>);

  (function registerComponents(components: Record<string, Component>) {
    if (components) {
      for (const key in components) {
        Vue.component(key, components[key]);
      }

      return true;
    }
    return false;
  })(components);
}
