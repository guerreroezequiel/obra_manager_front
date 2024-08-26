<template>
    <main class="mt-10 p-12">

        <h1>tipos</h1>
        <GrillaAllRubros :rutaGet="`${apiUrl}/tipos`" />
    </main>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useCookie, useRuntimeConfig } from '#app';

definePageMeta({
    middleware: 'auth'
});

const config = useRuntimeConfig();
const appUrl = config.public.appUrl;
const apiUrl = config.public.apiUrl;

const clientes = ref([]);

onMounted(async () => {
    try {
        const response = await fetch(`${apiUrl}/tipos`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${useCookie('authToken').value}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch tipos');
        }

        clientes.value = await response.json();
    } catch (error) {
        console.error('Error fetching clientes:', error);
    }
});

</script>