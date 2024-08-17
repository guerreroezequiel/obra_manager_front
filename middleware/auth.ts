import { defineNuxtRouteMiddleware, navigateTo, useCookie } from 'nuxt/app';

export default defineNuxtRouteMiddleware((to, from) => {
    const authToken = useCookie('authToken');
    const token = authToken.value;

    console.log('Middleware auth.ts ejecutado');
    console.log('Ruta destino:', to.path);
    console.log('Token:', token);


    if (!token && to.path !== '/login') {
        console.log('No autenticado, redirigiendo a /login');
        return navigateTo('/login');
    }

    console.log('Autenticado, permitiendo acceso');
});