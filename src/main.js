import { createApp } from "vue";
import App from "./App.vue";

const app = createApp(App);

// You can also set Vue configuration options here if needed
app.config.productionTip = false;

app.mount("#app");
