<template>
    <main class="mt-10 p-12">

        <h1>uniMeds</h1>
        <GrillaAllUniMeds rutaGet="http://localhost:3333/uni_medsAll" />
    </main>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useCookie } from '#app';

const uniMeds = ref([]);

onMounted(async () => {
    try {
        const response = await fetch('http://localhost:3333/uni_medsAll', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${useCookie('authToken').value}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch uniMeds');
        }

        uniMeds.value = await response.json();
    } catch (error) {
        console.error('Error fetching uniMeds:', error);
    }
});

definePageMeta({
    middleware: 'auth'
});
</script>