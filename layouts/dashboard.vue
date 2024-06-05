<script setup lang="ts">

import ToolBar from '~/components/TopNav.vue';
</script>

<template>
    <div class="flex ">
        <SideNav />
        <main>
            <slot />
        </main>
    </div>




</template>