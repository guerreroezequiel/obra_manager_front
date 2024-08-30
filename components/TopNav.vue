<template>
    <div
        class="flex flex-row-reverse h-14 px-7 justify-between items-center bg-orange-100 fixed top-0 left-0 right-0 shadow-lg z-50">

        <div class="flex flex-row-reverse">

            <button class="mr-6">
                <a :href="`${appUrl}/Clientes`">Clientes</a>
            </button>

            <div class="relative mr-6">
                <button @click="toggleDropdown('menu1')"
                    class="inline-flex items-center px-2 py-1 group-active:bg-orange-50 rounded-md shadow-sm text-gray-700 focus:outline-none ">
                    Articulos
                    <Icon name="ic:baseline-arrow-drop-down" class=" iner pl-1 scale-150"></Icon>
                </button>
                <div v-if="showDropdowns['menu1']"
                    class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md shadow-lg bg-orange-50 ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none"
                    @click.away="showDropdowns['menu1'] = false"
                    @keydown.escape.window="showDropdowns['menu1'] = false"> <a :href="`/articulos`"
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Articulos</a>
                    <a :href="`/rubros`" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Rubros</a>
                    <a :href="`/marcas`" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Marcas</a>
                    <a :href="`/tipos`" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Tipos</a>
                    <a :href="`/uni-meds`" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Unidades</a>
                    <a :href="`/presentaciones`"
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Presentaciones</a>
                </div>
            </div>
            <div class="relative mr-6">
                <button @click="toggleDropdown('menu2')"
                    class="inline-flex items-center px-2 py-1 group-active:bg-orange-50 rounded-md shadow-sm text-gray-700 focus:outline-none ">
                    Proveedores
                    <Icon name="ic:baseline-arrow-drop-down" class=" iner pl-1 scale-150"></Icon>
                </button>
                <div v-if="showDropdowns['menu2']"
                    class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md shadow-lg bg-orange-50 ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none"
                    @click.away="showDropdowns['menu2'] = false"
                    @keydown.escape.window="showDropdowns['menu2'] = false"> <a :href="`/Proveedores`"
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Proveedores</a>
                    <a :href="`/precios-de-venta`"
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Precios de venta</a>
                    <a :href="`/listas-de-precios`"
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Listas de precios</a>
                </div>
            </div>
        </div>

        <div class="flex">

            <div class="relative mr-6">
                <a :href="`/Obras`" class="block px-4 py-2 text-sm text-gray-700 ">Obras</a>

            </div>

        </div>



    </div>
</template>

<script lang='ts'>

interface ShowDropdowns {
    [key: string]: boolean;
}

export default {
    data() {
        return {
            // Cambia showDropdown para manejar múltiples menús
            showDropdowns: {} as ShowDropdowns,
        };
    },
    methods: {
        // Acepta un identificador único para cada menú desplegable
        toggleDropdown(menuId: string) {
            // Invierte el estado del menú específico, inicializándolo a false si no existe
            this.showDropdowns[menuId] = !this.showDropdowns[menuId];
        },
    },

    setup() {

        const config = useRuntimeConfig()
        const appUrl = config.public.appUrl
        const apiUrl = config.public.apiUrl

        return {
            apiUrl,
            appUrl,
        };
    },
};
</script>