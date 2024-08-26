<template>
    <main class="mt-10 p-12">

        <h1>ART_TAREAS</h1>
        <GrillaAllArtTareas :rutaGet="`${apiUrl}/art_tareas`" />
    </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useCookie, useRuntimeConfig } from '#app';

definePageMeta({
    middleware: 'auth'
});

const config = useRuntimeConfig();
const appUrl = config.public.appUrl;
const apiUrl = config.public.apiUrl;

const artTareas = ref([]);

onMounted(async () => {
    try {
        const response = await fetch(`${apiUrl}/art_tareas`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${useCookie('authToken').value}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch art_tareas');
        }

        artTareas.value = await response.json();
    } catch (error) {
        console.error('Error fetching art_tareas:', error);
    }
});
</script>