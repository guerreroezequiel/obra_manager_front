<template>
    <main>
        <!-- <DashForm :showModal="showModal" :rutaGet="'http://localhost:3333/art_tareas'" @close="showModal = false" /> -->
        <p>{{ showModal }}</p>
        <button
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            @click="showModal = true">Open Modal</button>
        <!-- obra -->
        <div v-if="obra" class="flex flex-col  p-2 my-5 "
            :class="{ 'showModal': showModal, 'backdrop-blur-sm': showModal }">
            <h1 class="text-gray-700 m-2 text-2xl font-bold">{{ obra.id }}{{ obra.nombre }}</h1>
            <h1 class="text-gray-700 m-2 text-2xl font-bold">Medida: {{ obra.medida }} mt²</h1>
            <div class="flex flex-col flex-grow rounded-b-xl items-center justify-center">
                <!-- etapa -->
                <div class="flex flex-col w-full rounded-md my-2 item-center justify-center shadow-md"
                    v-for="etapa in obra.etapas" :key="etapa.id">
                    <div class="flex flex-col border border-blue-600 rounded-md ">
                        <div class="flex p-2 items-center justify-between">
                            <div class="flex items-center pb-1">
                                <p class="text-lg font-medium">{{ etapa.id }}- </p>
                                <button @click="verModulosEtapa(etapa)" class="flex items-end text-blue-500 ">
                                    <h2 class="text-gray-700 text-xl font-semibold pl-1 pr-4">
                                        {{ etapa.nombre }}</h2>
                                    <Icon name="simple-line-icons:arrow-down" />
                                </button>
                            </div>
                            <button @click="verDetalleEtapa(etapa)" class="text-blue-500 px-3">
                                Ver detalle
                            </button>
                        </div>
                        <!-- detalle -->
                        <div v-show="etapa.detalleVisible">
                            <div class="flex border-blue-500 p-2 mx-1 rounded-md ">
                                <p class="text-gray-700">{{ etapa.descripcion }}</p>
                            </div>
                        </div>
                    </div>


                    <!-- MODULOS -->
                    <div v-show="etapa.modulovisible"
                        class="border-l-2  border-b-blue-500 border-l-blue-500 p-2 mx-2 my-1 "
                        v-for="modulo in etapa.modulos" :key="modulo.id">
                        <div class="flex items-center justify-between m-">
                            <div class="flex item-center">
                                <h3 class="text-gray-700">{{ modulo.nombre }}</h3>
                                <button @click="verTareasModulo(modulo)" class="text-blue-500 px-3">
                                    <Icon name="simple-line-icons:arrow-down" />
                                </button>
                            </div>
                            <!-- detalle -->
                            <button @click="verDetalleModulo(modulo)" class="text-blue-500 px-3 self-end">
                                Ver detalle
                            </button>
                        </div>
                        <div v-show="modulo.detalleVisible">
                            <p class="bg-gray-500 text-white rounded-md p-2">{{ modulo.descripcion }}</p>
                        </div>
                        <!-- tareas -->
                        <div v-show="modulo.tareaVisible" class="flex flex-col ">
                            <!-- recorrer las tareas -->
                            <div class="flex flex-col border border-slate-300 m-1 bg-gray-50 rounded-md py-1 px-2"
                                v-for="tarea in modulo.tareas" :key="tarea.id">
                                <div class="flex items-center justify-between p-1 ">
                                    <div class="flex w-full items-center">
                                        <div
                                            class="flex items-center justify-between border-r border-slate-300 w-2/6 max-w-1/5 ">
                                            <h4 class="text-gray-700">{{ tarea.nombre }}</h4>
                                            <button @click="verArtTarea(tarea)" class="text-blue-500 px-3  ">
                                                <Icon name="simple-line-icons:arrow-down" />
                                            </button>
                                        </div>
                                        <div class="flex w-2/6 max-w-1/5 items-center justify-between">
                                            <p class="ml-3 text-blas border-r border-slate-300">{{
                                                tarea.descripcion }}</p>


                                        </div>

                                    </div>
                                    <!-- detalle -->
                                    <button @click="verDetalleTareas(tarea)"
                                        class="text-blue-500 px-3 min-w-max text-sm">
                                        <p>Ver detalle</p>
                                    </button>
                                </div>
                                <div class="flex flex-col">
                                    <!-- detalle -->
                                    <div v-show="tarea.detalleVisible">
                                        <p>Valor ${{ tarea.precioTotal }}</p>
                                    </div>
                                    <!-- art_tareas -->
                                    <div v-if="tarea.artTareasVisible" class="mt-4 ">
                                        <div class="">
                                            <GrillaArtTareasCopia :rutaGet='rutaGet' :medida="obra.medida" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    </main>
</template>

<script lang="ts">
interface Tarea {
    id: number;
    nombre: string;
    descripcion: string;
    precioTotal: number;
    condicion: string;
    condBool: number;
    heredaMed: boolean;
    createdAt: string;
    updatedAt: string;
    moduloId: number;
    artTareasVisible?: boolean | false;
    detalleVisible?: boolean;
    artTareas?: [];
}

interface Modulo {
    id: number;
    nombre: string;
    descripcion: string;
    habilitado: number;
    heredaMed: number;
    createdAt: string;
    updatedAt: string;
    estadoId: null | number;
    etapaId: number;
    tareaVisible?: boolean | true;
    detalleVisible?: boolean;
    tareas: Tarea[];
}

interface Etapa {
    [key: string]: any;
    id: number;
    nombre: string;
    descripcion: string;
    area: null | string;
    habilitado: number;
    heredaMed: number;
    createdAt: string;
    updatedAt: string;
    estadoId: null | number;
    obraId: number;
    modulovisible?: boolean | true;
    detalleVisible?: boolean;
    modulos: Modulo[];
}

interface Obra {
    id: number;
    nombre: string;
    descripcion: string;
    medida: number;
    habilitado: number;
    createdAt: string;
    updatedAt: string;
    estadoId: number;
    etapas: Etapa[];
}

import { ref, onMounted } from 'vue';
import SideNav from '~/components/SideNav.vue';
import TopNav from '~/components/TopNav.vue';

export default {
    components: {
        SideNav
    },
    data() {
        return {
            table: 'obras',
            id: 1,
        };

    },

    setup(props) {

        let obra_index = ref(1)
        let obra = ref<Obra | null>(null);
        let etapa = ref<Etapa | null>(null);
        let modulo = ref<Modulo | null>(null);
        let tarea = ref<Tarea | null>(null);
        let rutaGet = ref(``);  // Inicializar la propiedad ruta
        const showModal = ref(false)

        // Carga los detalles de la obra
        onMounted(async () => {
            const response = await fetch(`http://localhost:3333/obras/1/full`);
            if (response.ok) {
                const data = await response.json();
                obra.value = data.obra
                console.log(obra.value?.medida)
            } else {
                console.error('HTTP-Error-obra: ' + response.status);
            }
        });

        // Carga los detalles de la etapa
        async function verModulosEtapa(etapa: Etapa) {
            etapa.modulovisible = !etapa.modulovisible;
        }

        async function verDetalleEtapa(etapa: Etapa) {
            etapa.detalleVisible = !etapa.detalleVisible;
        }

        async function verTareasModulo(modulo: Modulo) {
            modulo.tareaVisible = !modulo.tareaVisible;
        }

        async function verDetalleModulo(modulo: Modulo) {
            modulo.detalleVisible = !modulo.detalleVisible;
        }


        async function verArtTarea(tarea: Tarea) {
            // Cambia la visibilidad de la modulo
            tarea.artTareasVisible = !tarea.artTareasVisible;
            rutaGet.value = `http://localhost:3333/art_tareas/tarea/${tarea.id}`;  // Actualiza la propiedad ruta
            // Carga los detalles de la tarea si no se han cargado aún
            if (!tarea.descripcion && tarea.artTareasVisible) {
                const response = await fetch(`http://localhost:3333/tareas/${tarea.id}`);
                console.log(response)
                if (response.ok) {
                    tarea.descripcion = await response.json();
                } else {
                    console.error('HTTP-Error: ' + response.status);
                }
            }
        }

        async function verDetalleTareas(tarea: Tarea) {
            tarea.detalleVisible = !tarea.detalleVisible;
        }


        return {
            obra,
            rutaGet,
            verArtTarea,
            verDetalleModulo,
            verTareasModulo,
            verDetalleEtapa,
            verModulosEtapa,
            verDetalleTareas,
            showModal

        };
    }
}
</script>