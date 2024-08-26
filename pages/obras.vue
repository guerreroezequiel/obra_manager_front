<template>
    <main class="mt-10 p-12">

        <h1>OBRAS</h1>
        <GrillaAllObras :rutaGet="`${apiUrl}/obras`" />
    </main>
</template>


<script setup>
import { onMounted, ref } from 'vue';
import { useCookie } from '#app';
const obras = ref([]);

const config = useRuntimeConfig();
const appUrl = config.public.appUrl;
const apiUrl = config.public.apiUrl;

onMounted(async () => {
    try {
        const response = await fetch(`${apiUrl}/obras`, {
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