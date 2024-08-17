<template>
    <main class="mt-10 p-12">

        <h1>Marcas</h1>
        <GrillaAllRubros rutaGet="http://localhost:3333/marcas" />
    </main>
</template>

<script>
definePageMeta({
    middleware: 'auth'
});
</script>