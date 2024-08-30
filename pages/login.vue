<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
        <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h1 class="text-2xl font-bold mb-6 text-center">Login</h1>
            <form @submit.prevent="login">
                <div class="mb-4">
                    <label for="email" class="block text-gray-700">Correo Electrónico</label>
                    <input type="email" v-model="email" id="email" required
                        class="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300" />
                </div>
                <div class="mb-6">
                    <label for="password" class="block text-gray-700">Contraseña</label>
                    <input type="password" v-model="password" id="password" required
                        class="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300" />
                </div>
                <button type="submit"
                    class="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300">Iniciar
                    Sesión</button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCookie } from '#app';
const { $auth } = useNuxtApp();


const email = ref('')
const password = ref('')
const router = useRouter()
const authToken = useCookie('authToken');
const login = async () => {
    const result = await $auth.login(email.value, password.value);
    if (result) {
        router.push('/obras');
    }
}
</script>