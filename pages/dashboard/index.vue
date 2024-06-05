<template>
    <div class="flex bg-zinc-50">
        <SideNav :table="table" , :id="id" />
        <div class="flex flex-col w-0 flex-grow">
            <TopNav />
            <main class="flex flex-col p-14 ">
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

<script lang="ts">
import SideNav from '~/components/SideNav.vue';
import TopNav from '~/components/TopNav.vue';

export default {
    components: {
        SideNav
    },
    data() {
        return {
            table: 'obras',
            id: 1
        };
    },

    setup() {

        let obra = ref(null);
        let id = ref(1);
        onMounted(async () => {
            const response = await fetch(`http://localhost:3333/obras/1/details`);
            if (response.ok) {
                obra.value = await response.json();
            } else {
                console.error('HTTP-Error-del-DASHBOARD: ' + response.status);
            }
        });
    }


};


</script>