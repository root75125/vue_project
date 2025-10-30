import { createApp } from "vue";
// import App from "./App.vue";
import App from "./AppP.vue";
// import router from "./router";
import router from "./router/indexP";
import store from "./store";
import { createVuetify } from "vuetify";
import "vuetify/styles";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "light",
  },
});

createApp(App).use(store).use(router).use(vuetify).mount("#app");
