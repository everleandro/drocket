import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { Drocket } from "../../src";
import { iconFactory } from "./icons";
import "../../public/styles/main.scss";
import "../../src/style/main.scss";

const app = createApp(App);

app.use(router);
app.use(Drocket, { icons: iconFactory });
app.mount("#app");
