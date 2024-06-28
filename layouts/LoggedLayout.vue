<template>
    <div class="flex flex-col">
        <TopNav class="bg-orange-200 shadow-md" />
        <slot />
    </div>
</template>

<script lang="ts">
export default {
    data() {
        return {
            table: 'obras',
            id: 1,
        };

    },
}
</script>