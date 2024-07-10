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
                    </div>
                    <form
                        class="flex flex-col overflow-hidden overflow-x-auto min-h-[412px] min-w-[412px] rounded-lg border border-slate-300">
                        <div v-for="(value, key) in consulta.modulosModelSchema" :key="key" class="p-2 bg-slate-300">
                            <label :for="value.Field" class="block text-sm font-medium text-gray-700">{{ value.Field
                                }}</label>
                            <div class="p-2 m-1 border-b bg-white">
                                <input :id="value.Field"
                                    class=" focus:outline-none focus:border-blue-500 border px-2 py-1 rounded-md bg-white">
                            </div>
                        </div>
                    </form>
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
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

interface ModuloModelSchema {
    Field: string;
    Type: string;
    Null: string;
    Key: string;
    Default: string | null;
}

interface Consulta {
    modulosModelSchema: ModuloModelSchema[];
}

import { ref, onMounted } from 'vue';

interface consulta {
    Field: string;
}

export default {
    data() {
        return {
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
    },

    setup(props, { emit }) {
        let consulta = ref<Consulta>({ modulosModelSchema: [] });
        let tableProp = new URL(props.rutaGet).pathname.split('/')[1]
        let campos = ref<string[]>([]); // Definir campos aquí
        let valores = ref<any[]>([]); // Definir valores aquí
        const selectedId = ref<number | null>(null);



        const aceptar = async () => {
            console.log('selectedId: ', selectedId.value);
            if (selectedId.value !== null) {

                emit('aceptar');
            }
        };


        onMounted(async () => {
            const response = await fetch(props.rutaGet);
            if (response.ok) {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const data = await response.json();
                    consulta.value = data;

                    // Comprobar si data.modulosModelSchema es un array
                    if (Array.isArray(data.modulosModelSchema)) {
                        // Iterar sobre los objetos en data.modulosModelSchema
                        data.modulosModelSchema.forEach((item: { Field: string }) => {
                            // Guardar el campo en los arrays
                            campos.value.push(item.Field);
                        });
                    } else {
                        console.error('Error: data.modulosModelSchema is not an array');
                    }
                } else {
                    console.error('HTTP-Error desde GRILLA ALL OBRAS: La respuesta no es un JSON válido' + response.status);
                }
            } else {
                console.error('HTTP-Error desde GRILLA: ' + response.status);
            }
        });


        return {
            consulta,
            tableProp,
            campos,
            valores,
            aceptar,

        };
    }
};
</script>