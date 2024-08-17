// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  pages: true,
  modules: ['@nuxtjs/tailwindcss', 'nuxt-icon'],

  // agregar proxy para evitar CORS

  runtimeConfig: {
    apiUrl: process.env.API
  },

  compatibilityDate: '2024-08-17',
})