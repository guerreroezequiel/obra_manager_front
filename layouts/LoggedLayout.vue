<template>
    <div class="flex">
        <SideNav :table="table" , :id="id" class="bg-neutral-100 shadow-md" />
        <div class="flex flex-col w-0 flex-grow">
            <TopNav class="bg-orange-200 shadow-md" />
            <div class="flex flex-col pt-14 px-10 min-h-screen">
                <slot />
            </div>
            <footer class="h-28 bg-gray-300 shadow-md">
                <p class="text-center text-gray-700">Footer</p>
            </footer>
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