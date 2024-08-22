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

                    <div
                        class=" bg-slate-200 rounded-lg overflow-hidden overflow-x-auto w-full shadow-md border-2 border-slate-400">
                        <table class="table-auto">
                            <thead>
                                <tr class="">
                                    <th v-for="(field, index) in sortedFieldSettings" :key="field.id" class="">
                                        <div class="border-r-2  my-1 px-0.5 "
                                            :style="{ width: field.width + 'px', minWidth: field.type === 'search' ? '80px' : 'auto' }"
                                            :data-field-name="field.fieldName" :data-index="index">
                                            <p class="truncate p-1 select-none">{{ field.tag }}</p>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in paginatedItems" :key="index" @click="selectRow(item)">
                                    <td v-for="(field, index) in fieldSettings" :key="field.id">
                                        <div v-if="cellRefs" class="flex flex-grow " :ref="el => cellRefs[index] = el">

                                            <div v-if="field.type === 'price'" :style="{ width: `50px` }"
                                                class="flex flex-grow items-center justify-start px-2 py-1 rounded-md">
                                                {{ formatPrice((item as any)[field.fieldName]) }}
                                            </div>
                                            <input v-else-if="field.type === 'check'" class="flex flex-grow"
                                                :style="{ width: `50px` }" type="checkbox"
                                                v-model="(item as any)[field.fieldName]" @click.prevent>

                                            <input v-else
                                                class="flex flex-grow focus:outline-none focus:border-blue-500 border px-2 py-1 rounded-md bg-white "
                                                :type="field.type === 'text' ? 'text' : 'text'" :readonly="true"
                                                :style="{ width: `50px` }" v-model="(item as any)[field.fieldName]">
                                        </div>
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

interface currentItems {
    id: number;
}

interface Campo {
    id: number;
    userId: number;
    tableName: string;
    fieldName: string;
    tag: string;
    type: string;
    width: number;
    order: number;
    isEditable: number;
    isHidden: number;
}

import interact from 'interactjs';
import { ref, onMounted } from 'vue';

export default {
    data() {
        return {
            cellRefs: [] as any[],
            selectedId: null as number | null,
            selectedRow: null as number | null,
            currentPage: 1,
            perPage: 10,
            // ...
        }
    },



    computed: {
        //ordenar los campos por el orden
        sortedFieldSettings() {
            return this.fieldSettings.sort((a, b) => a.order - b.order);
        },

        totalPages() {
            return Math.ceil(this.consulta.length / this.perPage);
        },

        paginatedItems() {
            let start = (this.currentPage - 1) * this.perPage;
            let end = start + this.perPage;
            return this.consulta.slice(start, end);
        },
    },

    methods: {
        nextPage() {
            if (this.currentPage < this.totalPages) this.currentPage++;
        },
        prevPage() {
            if (this.currentPage > 1) this.currentPage--;
        },

        formatPrice(price: number) {
            if (price === null) {
                return "N/A";
            }
            // Asegúrate de que el precio es un número antes de intentar formatearlo
            const numericPrice = Number(price);
            if (isNaN(numericPrice)) {
                return "Invalid";
            }
            // Utiliza toLocaleString para formatear el precio en el formato local deseado
            return numericPrice.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
        },
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

    },

    setup(props, { emit }) {
        let consulta = ref([]);
        let tableProp = new URL(props.rutaGet).pathname.split('/')[1]
        let fieldSettings: Ref<Campo[]> = ref([]);
        let busqueda = ref('')
        let campos = ref<string[]>([]); // Definir campos aquí
        let valores = ref<any[]>([]); // Definir valores aquí
        let currentPage = ref(1);
        let itemsPerPage = ref(10);
        const { $auth } = useNuxtApp();

        const selectedId = ref<number | null>(null);
        const selectedRow = ref<ItemType | null>(null);

        const selectRow = (item: ItemType) => {
            selectedId.value = item.id;
            selectedRow.value = item;
        };

        const aceptar = async () => {
            console.log('selectedRowRowModal:', selectedRow.value);
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
            await refreshData();
        });

        const refreshData = async () => {
            console.log('rutaGet: ', props.rutaGet)
            const response = await $auth.fetchWithAuth(props.rutaGet);
            if (response.ok) {
                const contentType = response.headers.get("content-type");
                const camposResponse = await $auth.fetchWithAuth(`http://localhost:3333/user_field_settings/table/${tableProp}`);  // campos editables
                if (camposResponse.ok) {
                    console.log('camposResponse: ', camposResponse);
                    const campos = await camposResponse.json();
                    fieldSettings.value = campos.map((campo: Campo) => ({
                        id: campo.id,
                        userId: campo.userId,
                        tableName: campo.tableName,
                        fieldName: campo.fieldName,
                        tag: campo.tag,
                        type: campo.type,
                        width: campo.width,
                        order: campo.order,
                        isEditable: campo.isEditable,
                        isHidden: campo.isHidden
                    }));
                    console.log('okey'); // Mostrar fieldSettings y sus campos
                } else {
                    console.error('HTTP-Error desde GRILLA: ' + camposResponse.status);
                }
                if (contentType && contentType.includes("application/json")) {
                    const data = await response.json();
                    consulta.value = data.map((item: { createdAt: string, updatedAt: string, habilitado: number, }) => ({
                        ...item,
                        habilitado: item.habilitado == 1 ? true : false,
                    }));
                    console.log('consulta: ', consulta.value);
                } else {
                    console.error('HTTP-Error desde GRILLA: La respuesta no es un JSON válido');
                }
            } else {
                console.error('HTTP-Error desde GRILLA: ' + response.status);
            }
        }

        const aplicarBusqueda = async () => {
            const response = await $auth.fetchWithAuth(props.rutaGet + '/' + busqueda.value);
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
            fieldSettings,

        };
    }
};
</script>
