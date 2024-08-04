import Aura from "@primevue/themes/aura";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: false },
  modules: ["@primevue/nuxt-module", "@vuestic/nuxt"],
  primevue: {
    options: {
      theme: {
        preset: Aura,
      },
    },
  },
  vuestic: {
    config: {
      // Config here
    },
  },
});
