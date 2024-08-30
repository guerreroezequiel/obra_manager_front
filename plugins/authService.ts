// plugins/authService.ts
import { defineNuxtPlugin, useNuxtApp } from 'nuxt/app';


export default defineNuxtPlugin(() => {
    const authCookie = useCookie("authToken", {
        maxAge: 60 * 60
    })
    const config = useRuntimeConfig()
    const appUrl = config.public.appUrl
    const apiUrl = config.public.apiUrl
    const login = async (email: string, password: string) => {

        try {
            const response = await fetch(`${apiUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            const token = data?.token?.token;
            if (!token) {
                throw new Error('Login failed')
            }

            authCookie.value = token
            return true
        } catch (error) {
            console.error('Login failed:', error);
            return false
        }
    };
    const logout = () => {
        authCookie.value = null
    };

    const getToken = () => {
        return authCookie.value
    }

    const fetchWithAuth = (url: any, options = {} as any) => {
        const optionsWithAuth = {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${authCookie.value}`,
            },
        };

        return fetch(url, optionsWithAuth);
    }

    return {
        provide: {
            auth: {
                login,
                logout,
                getToken,
                fetchWithAuth
            }
        }
    };
});