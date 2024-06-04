<script setup lang="ts">
import SideNav from '~/components/layout/SideNav.vue';
import ToolBar from '~/components/layout/ToolBar.vue';
</script>

<template>
    <div class="flex ">
        <SideNav />
        <div class="flex flex-col w-0 flex-grow">
            <ToolBar />
            <main class="flex flex-col p-10 pt-10 ">
                <h1 class="p-2 align-top">Dashboard page</h1>
                <DashForm />
                <Grilla />
            </main>
            <footer class="h-28 bg-red-100 ">
                <p class="text-center">Footer</p>
            </footer>
        </div>
    </div>
</template>