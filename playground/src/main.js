import { createApp } from "vue";
import Layout from "./Layout.vue";
import router from "./router";
import "../../public/styles/main.scss";
import "../../src/assets/sass/main.scss";

const app = createApp(Layout);
app.use(router);
app.mount("#app");
