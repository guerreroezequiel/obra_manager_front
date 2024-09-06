<template>
    <div class="flex flex-col">
        <TopNav class="bg-orange-200 shadow-md" />
        <div class="h-screen bg-gradient-to-r from-gray-100 to-orange-50 pt-20 px-10">
            <slot />
        </div>
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