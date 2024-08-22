<template>
    <main class="mt-10 p-12">

        <h1>CLIENTES</h1>
        <GrillaAllClientesV2 rutaGet="http://localhost:3333/clientes" />
    </main>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useCookie } from '#app';

const clientes = ref([]);

onMounted(async () => {
    try {
        const response = await fetch('http://localhost:3333/clientes', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${useCookie('authToken').value}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch clientes');
        }

        clientes.value = await response.json();
    } catch (error) {
        console.error('Error fetching clientes:', error);
    }
});

definePageMeta({
    middleware: 'auth'
});
</script>