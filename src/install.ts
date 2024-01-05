import { App } from "vue";
import * as _components from "./components";
import * as _directives from "./directives";

export function install(Vue: App, args: any = {}): void {
  const directives = _directives as Record<string, any>;
  for (const key in directives) {
    Vue.directive(key, directives[key]);
  }

  const components = args.components || (_components as Record<string, any>);

  (function registerComponents(components) {
    if (components) {
      for (const key in components) {
        Vue.component(key, components[key]);
      }

      return true;
    }
    return false;
  })(components);
}
