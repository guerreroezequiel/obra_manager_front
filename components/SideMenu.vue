<template>
    <div class="relative min-h-screen">
        <button @click="open = !open" class="p-2 bg-blue-500 text-white">
            Toggle Menu
        </button>
        <transition name="slide">
            <div v-if="open"
                class="fixed top-0 left-0 w-64 h-full bg-gray-600 overflow-auto transition-transform transform translate-x-0">
                <!-- Aquí va el contenido del menú -->
                <p class="text-white p-4">Item 1</p>
                <p class="text-white p-4">Item 2</p>
                <p class="text-white p-4">Item 3</p>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    data() {
        return {
            open: false,
        };
    },
};
</script>

<style scoped>
.slide-enter-active {
    transition: all 0.3s ease;
}

.slide-leave-active {
    transition: all 0.3s ease;
}

.slide-enter,
.slide-leave-to {
    transform: translateX(-100%);
}
</style>