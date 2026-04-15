import type { Plugin } from "vue";
import { version } from "../package.json";
import { install } from "./install";

type DrocketPlugin = Plugin & {
  version: string;
};

const Drocket: DrocketPlugin = {
  install,
  version,
};

export default Drocket;
