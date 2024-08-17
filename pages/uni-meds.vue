<template>
    <main class="mt-10 p-12">

        <h1>uniMeds</h1>
        <GrillaAllUniMeds rutaGet="http://localhost:3333/uni_medsAll" />
    </main>
</template>

<script>
definePageMeta({
    middleware: 'auth'
});
</script>