<template>
    <main class="mt-10 p-12">

        <h1>OBRAS</h1>
        <GrillaAllObras rutaGet="http://localhost:3333/obras" />
    </main>
</template>


<script setup>
import { onMounted, ref } from 'vue';
import { useCookie } from '#app';

const obras = ref([]);

onMounted(async () => {
    try {
        const response = await fetch('http://localhost:3333/obras', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${useCookie('authToken').value}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch obras');
        }

        obras.value = await response.json();
    } catch (error) {
        console.error('Error fetching obras:', error);
    }
});

definePageMeta({
    middleware: 'auth'
});
</script>