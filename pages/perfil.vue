<template>
    <main class="mt-10 p-12">

        <h1>PERFIL</h1>
        <GrillaAllObras rutaGet="http://localhost:3333/perfil" />
    </main>
</template>

<script lang="ts">
definePageMeta({
    middleware: 'auth'
});


</script>