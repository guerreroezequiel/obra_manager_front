<template>
    <div class="fixed z-10 inset-0 overflow-y-auto" v-if="showModal">
        <div v-if="consulta" class="flex items-end justify-center min-h-screen text-center sm:block">
            <div class="fixed inset-0 transition-opacity" aria-hidden="true">
                <div class="absolute inset-0 bg-gray-300 opacity-75"></div>
            </div>
            <span class="hidden sm:inline-block align-middle sm:h-screen" aria-hidden="true"> asd </span>
            <div
                class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all py-5 px-6 sm:my-8 sm:align-middle max-w-screen-xl">
                <!-- inicia -->
                <div class="flex flex-col ">
                    <div class="flex flex-col pb-2">
                        <h1 class="font-mono text-xl px-4 pb-4">{{ tableProp }}</h1>
                        <!-- buscador-->
                        <div
                            class="flex flex-row  min-h-10 w-80 justify-between ring-1 focus:ring-blue-500 rounded-md my-2">
                            <input class="p-1 rounded-l-md w-5/6 bg-gray-200 focus:outline-none text-black " type="text"
                                placeholder="Buscar ID" v-model="busqueda" />
                            <button @click="aplicarBusqueda()"
                                class="flex w-1/6 bg-slate-400 rounded-r-md items-center justify-center active:scale-95">
                                <Icon name="simple-line-icons:magnifier" class=""></Icon>
                            </button>
                        </div>
                    </div>

                    <div class="overflow-hidden overflow-x-auto min-h-[412px] rounded-lg border border-slate-300">
                        <table class="table-auto">
                            <thead class="p-3">
                                <tr>
                                    <th v-for=" (value, key) in consulta[0]" :key="key" class="p-2 bg-slate-300">
                                        {{ key }}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in currentItems" :key="index"
                                    @click="selectRow(item); selectedRow = index" class="p-2 m-1 border-b "
                                    :class="{ ' border-slate-400': selectedRow === index }">
                                    <td v-for="(value, key) in item" :key="key">
                                        <input :readonly="true" v-model="item[key]"
                                            class=" focus:outline-none focus:border-blue-500 border px-2 py-1 rounded-md">
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
                <!-- termina -->
                <div class="flex mt-4 items-center justify-center">
                    <div class="flex flex-row-reverse absolute right-6">
                        <button type="button" @click="aceptar(); $emit('close');"
                            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                            Aceptar
                        </button>
                        <button @click="$emit('close')" type="button"
                            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                            Cancelar
                        </button>
                    </div>

                    <div class="flex">
                        <button class=" bg-blue-500 text-white rounded-full active:scale-95 mx-3 h-10 w-10 pb-1 "
                            @click="currentPage = Math.max(1, currentPage - 1)">
                            <Icon name="simple-line-icons:arrow-left" />
                        </button>
                        <button class=" bg-blue-500 text-white rounded-full  active:scale-95 mx-3 h-10 w-10 pb-1 "
                            @click="currentPage = Math.min(Math.ceil(consulta.length / itemsPerPage), currentPage + 1)">
                            <Icon name="simple-line-icons:arrow-right" />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script lang="ts">

interface ItemType {
    id: number;
}

import { ref, onMounted } from 'vue';

interface currentItems {
    id: number;
}

export default {
    data() {
        return {
            selectedId: null as number | null,
            selectedRow: null as number | null,
            // ...
        }
    },

    props: {
        rutaGet: {
            type: String,
            required: true,
        },
        showModal: {
            type: Boolean,
            required: true
        },
        fkPadre: {
            type: Number,
            required: true,
        }
    },

    setup(props, { emit }) {
        let consulta = ref([]);
        let tableProp = new URL(props.rutaGet).pathname.split('/')[1]
        let busqueda = ref('')
        let campos = ref<string[]>([]); // Definir campos aquí
        let valores = ref<any[]>([]); // Definir valores aquí
        let currentPage = ref(1);
        let itemsPerPage = ref(10);

        const selectedId = ref<number | null>(null);
        const selectedRow = ref<ItemType | null>(null);

        const selectRow = (item: ItemType) => {
            selectedId.value = item.id;
            selectedRow.value = item;
        };

        const aceptar = async () => {
            // console.log('selectedRow: ', selectedRow.value);
            if (selectedRow.value !== null) {
                emit('aceptar', selectedRow.value);
                console.log('selectedRowModal: ', selectedRow.value);
            }
        };

        let currentItems = computed<ItemType[]>(() => {
            let start: number = (currentPage.value - 1) * itemsPerPage.value;
            let end: number = start + itemsPerPage.value;
            return consulta.value.slice(start, end);
        });

        onMounted(async () => {

            const response = await fetch(props.rutaGet);
            if (response.ok) {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const data = await response.json();
                    consulta.value = data;

                    // Iterar sobre los objetos en data
                    data.forEach((item: object) => {
                        // Iterar sobre las claves y los valores en el objeto
                        for (const [campo, valor] of Object.entries(item)) {
                            // Guardar el campo y el valor en los arrays
                            campos.value.push(campo);
                            valores.value.push(valor);
                        }
                    });


                } else {
                    console.error('HTTP-Error desde GRILLA ALL OBRAS: La respuesta no es un JSON válido' + response.status);
                }
            } else {
                console.error('HTTP-Error desde GRILLA: ' + response.status);
            }
        });

        const aplicarBusqueda = async () => {
            const response = await fetch(props.rutaGet + '/' + busqueda.value);
            console.log('ruta: ', props.rutaGet + '/' + busqueda.value)
            if (response.ok) {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    let data = await response.json();

                    // Si data es un objeto, convertirlo en un array
                    if (data.constructor === Object) {
                        data = [data];
                        currentPage.value = 1;
                    }

                    consulta.value = data;


                } else {
                    console.error('HTTP-Error desde dashform ALL OBRAS: La respuesta no es un JSON válido' + response.status);
                }
            } else {
                console.error('HTTP-Error desde dashform: ' + response.status);
            }

        }


        return {
            consulta,
            tableProp,
            aplicarBusqueda,
            busqueda,
            campos,
            valores,
            currentPage,
            itemsPerPage,
            currentItems,
            selectRow,
            aceptar,

        };
    }
};
</script>
