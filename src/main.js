import { createApp } from "vue";
import App from "./App.vue";
import store from "./store/store";
import router from "./router/roter";

import "./assets/main.css";

const app = createApp(App);

app.use(router);
app.use(store);

app.mount("#app");
