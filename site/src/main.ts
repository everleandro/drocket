import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { Drocket } from "../../src";
import "../../public/styles/main.scss";
import "../../src/assets/sass/main.scss";

const app = createApp(App);

app.use(router);
app.use(Drocket);
app.mount("#app");
