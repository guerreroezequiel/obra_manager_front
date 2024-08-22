// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  pages: true,
  modules: ['@nuxtjs/tailwindcss', 'nuxt-icon'],

  // agregar proxy para evitar CORS

  runtimeConfig: {
    public: {
      appUrl: process.env.APP_URL,
    },
    private: {
      apiUrl: process.env.API_URL
    }
  },

  compatibilityDate: '2024-08-17',
})