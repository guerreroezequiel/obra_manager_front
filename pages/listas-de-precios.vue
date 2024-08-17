<template>
    <main class="mt-10 p-12">

        <h1>LISTAS DE PRECIOS</h1>
        <GrillaAllRubros rutaGet="http://localhost:3333/lis_pre_ids" />
    </main>
</template>

<script lang="ts">
import GrillaAllRubros from '~/components/grilla/GrillaAllRubros.vue';

definePageMeta({
    middleware: 'auth'
});


</script>