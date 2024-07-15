<template>
    <main class="mt-10 p-12">

        <h1>ARTICULOS</h1>
        <!-- <GrillaAllObras rutaGet="http://localhost:3333/articulos" /> -->
        <GrillaAllArticulos :rutaGet="'http://localhost:3333/articulos'" />
    </main>
</template>

<script lang="ts">
import GrillaAllArticulos from '~/components/grilla/GrillaAllArticulos.vue';




</script>