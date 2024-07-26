import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'

export default defineNuxtRouteMiddleware((to, from) => {
    const token = localStorage.getItem('authToken')
    if (!token && to.name !== 'login') {
        return navigateTo('/login')
    }
})