<template>
    <main class="mt-10 p-12">

        <h1>PROVEEDORES</h1>
        <GrillaAllProveedoresV2 rutaGet="http://localhost:3333/proveedores" />
    </main>
</template>

<script lang="ts">
import GrillaAllProveedoresV2 from '~/components/grilla/GrillaAllProveedoresV2.vue';

definePageMeta({
    middleware: 'auth'
});


</script>