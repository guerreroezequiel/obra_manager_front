<template>
    <main class="mt-10 p-12">

        <h1>ARTICULOS</h1>
        <GrillaAllArticulos :rutaGet="`${apiUrl}/articulos`" />
    </main>
</template>

<script lang="ts">

definePageMeta({
    middleware: 'auth'
});

export default {
    setup() {
        const config = useRuntimeConfig()
        const appUrl = config.public.appUrl
        const apiUrl = config.public.apiUrl

        return {
            apiUrl,
            appUrl,
        };
    },
}

</script>