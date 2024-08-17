// plugins/authService.ts
import { defineNuxtPlugin, useNuxtApp } from 'nuxt/app';

interface Cookies {
    get: (name: string) => string | undefined;
    set: (name: string, value: string, options?: any) => void;
    remove: (name: string) => void;
}

export default defineNuxtPlugin(() => {
    const { $cookies } = useNuxtApp();
    const cookies = $cookies as unknown as Cookies;

    const login = async (username: string, password: string) => {
        try {
            const response = await fetch('http://localhost:3333/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            const token = data.token;
            cookies.set('authToken', token, { path: '/', maxAge: 60 * 60 }); // 1 hora
            return token;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const getToken = () => {
        return cookies.get('authToken');
    };

    const logout = () => {
        cookies.remove('authToken');
    };

    return {
        provide: {
            auth: {
                login,
                getToken,
                logout
            }
        }
    };
});