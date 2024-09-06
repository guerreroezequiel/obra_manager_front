// https://nuxt.com/docs/api/configuration/nuxt-config
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  pages: true,
  modules: ['@nuxtjs/tailwindcss', 'nuxt-icon'],

  // agregar proxy para evitar CORS

  runtimeConfig: {



    public: {
      appUrl: process.env.APP_URL,
      apiUrl: process.env.API_URL,
    }
  },

  compatibilityDate: '2024-09-05',
})