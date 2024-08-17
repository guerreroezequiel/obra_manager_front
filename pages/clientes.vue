<template>
    <main class="mt-10 p-12">

        <h1>CLIENTES</h1>
        <GrillaAllClientesV2 rutaGet="http://localhost:3333/clientes" />
    </main>
</template>

<script lang="ts">
import GrillaAllClientesV2 from '~/components/grilla/GrillaAllClientesV2.vue';


definePageMeta({
    middleware: 'auth'
});

</script>