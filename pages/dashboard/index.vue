<template>
    <div class="flex bg-gray-100">
        <SideNav :table="table" , :id="id" class="bg-neutral-50 shadow-md" />
        <div class="flex flex-col w-0 flex-grow">
            <TopNav class="bg-orange-200 shadow-md" />

            <main class="flex flex-col p-14 bg-gray-200">
                <h1 class="p-2 align-top text-gray-700">Dashboard page</h1>
                <DashForm class="bg-neutral-400 shadow-md rounded-md p-4" />
                <div v-if="obra" class="bg-neutral-400 shadow-md rounded-md py-4 px-2 mt-4">
                    <h1 class="text-gray-700">{{ obra.nombre }}</h1>

                    <!-- recorrer las etapas -->
                    <div class="border-2 bg-gray-300 rounded-md py-4 px-2 m-4" v-for="etapa in obra.etapas"
                        :key="etapa.id">
                        <h2 class="text-gray-700">{{ etapa.nombre }}</h2>
                        <p class="bg-gray-600 text-white rounded-md p-2">{{ etapa.descripcion }}</p>
                        <button @click="cargarDetallesEtapa(etapa)"
                            class="bg-blue-500 text-white rounded-md px-4 py-2">Mostrar detalles de la etapa</button>
                        <div v-if="etapa.visible" class="mt-4">
                            <h2 class="text-gray-700">Detalles de la etapa seleccionada:</h2>

                            <!-- recorrer los módulos -->
                            <div class="border-2 bg-gray-200 rounded-md py-4 px-2 m-4" v-for="modulo in etapa.modulos"
                                :key="modulo.id">
                                <h3 class="text-gray-700">{{ modulo.nombre }}{{ modulo.descripcion }}</h3>
                                <button @click="cargarDetallesModulo(modulo)"
                                    class="bg-blue-500 text-white rounded-md px-4 py-2">Mostrar detalles del
                                    módulo</button>
                                <div v-if="modulo.visible" class="mt-4">
                                    <h4 class="text-gray-700">Detalles del módulo seleccionado:</h4>
                                    <p class="bg-gray-500 text-white rounded-md p-2">{{ modulo.descripcion }}</p>

                                    <!-- recorrer las tareas -->
                                    <div class="border-t-4 m-1 bg-gray-100 rounded-md py-1 px-2"
                                        v-for="tarea in modulo.tareas" :key="tarea.id">
                                        <h4 class="text-gray-700">{{ tarea.nombre }}</h4>
                                        <button @click="cargarDetallesTarea(tarea)"
                                            class="bg-blue-500 text-white rounded-md px-4 py-2">Mostrar detalles de la
                                            tarea</button>
                                        <div v-if="tarea.visible" class="mt-4">
                                            <h4 class="text-gray-700">Detalles de la tarea seleccionada:</h4>
                                            <div>
                                                <p class="text-gray-700">{{ rutaGet }}</p>
                                                <Grilla :rutaGet='rutaGet' />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <footer class="h-28 bg-gray-300 shadow-md">
                <p class="text-center text-gray-700">Footer</p>
            </footer>
        </div>
    </div>
</template>

<script lang="ts">
interface Tarea {
    id: number;
    nombre: string;
    descripcion: string;
    condicion: string;
    condBool: number;
    heredaMed: number;
    createdAt: string;
    updatedAt: string;
    moduloId: number;
    visible?: boolean;
    artTareasVisible?: boolean;
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
    tareas: Tarea[];
    visible?: boolean;
}

interface Etapa {
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
    modulos: Modulo[];
    visible?: boolean;
}

interface Obra {
    id: number;
    nombre: string;
    descripcion: string;
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
            id: 1
        };
    },

    setup(props) {

        let obra_index = ref(1)
        let obra = ref<Obra | null>(null);
        let etapa = ref<Etapa | null>(null);
        let modulo = ref<Modulo | null>(null);
        let tarea = ref<Tarea | null>(null);
        let rutaGet = ref(``);  // Inicializar la propiedad ruta

        // Carga los detalles de la obra
        onMounted(async () => {
            const response = await fetch(`http://localhost:3333/obras/1/details`);
            if (response.ok) {
                const data = await response.json();
                obra.value = data.obra;
                if (obra.value && obra.value.etapas) {
                    for (let i = 0; i < obra.value.etapas.length; i++) {
                        const responseEtapa = await fetch(`http://localhost:3333/etapas/${obra.value.etapas[i].id}`);
                        console.log(responseEtapa)
                        if (responseEtapa.ok) {
                            const dataEtapa = await responseEtapa.json();
                            //     // Actualiza las propiedades con los datos de la respuesta
                            Object.assign(obra.value.etapas[i], dataEtapa);
                        } else {
                            console.error('HTTP-Error: ' + responseEtapa.status);
                        }
                    }
                }
            } else {
                console.error('HTTP-Error-del-SIDEBAR: ' + response.status);
            }
        });

        // Carga los detalles de la etapa
        async function cargarDetallesEtapa(etapa: Etapa,) {
            etapa.visible = !etapa.visible;

            if (etapa.visible && etapa.modulos) {
                for (let i = 0; i < etapa.modulos.length; i++) {
                    const modulo = etapa.modulos[i];
                    if (modulo.id) {
                        const response = await fetch(`http://localhost:3333/modulos/${modulo.id}`);
                        console.log(response)
                        if (response.ok) {
                            const data = await response.json();
                            // Actualiza las propiedades con los datos de la respuesta
                            Object.assign(modulo, data);
                        } else {
                            console.error('HTTP-Error: ' + response.status);
                        }
                    } else {
                        console.error('Modulo id is not defined');
                    }
                }
            }
        }

        async function cargarDetallesModulo(modulo: Modulo) {
            // Cambia la visibilidad del modulo
            modulo.visible = !modulo.visible;

            // // Carga los detalles del modulo si no se han cargado aún
            // if (modulo.visible) {
            //     const response = await fetch(`http://localhost:3333/modulos/${modulo.id}`);
            //     console.log(response)
            //     if (response.ok) {
            //         const data = await response.json();
            //         // Actualiza las propiedades del modulo con los datos de la respuesta
            //         Object.assign(modulo, data);
            //     } else {
            //         console.error('HTTP-Error: ' + response.status);
            //     }
            // }
        }

        async function cargarDetallesTarea(tarea: Tarea) {
            // Cambia la visibilidad de la modulo
            tarea.visible = !tarea.visible;
            rutaGet.value = `http://localhost:3333/art_tareas/tarea/${tarea.id}`;  // Actualiza la propiedad ruta
            // Carga los detalles de la tarea si no se han cargado aún
            if (!tarea.descripcion && tarea.visible) {
                const response = await fetch(`http://localhost:3333/tareas/${tarea.id}`);
                console.log(response)
                if (response.ok) {
                    tarea.descripcion = await response.json();
                } else {
                    console.error('HTTP-Error: ' + response.status);
                }


            }
        }

        return {
            obra,
            cargarDetallesEtapa,
            cargarDetallesModulo,
            cargarDetallesTarea,
            rutaGet
        };
    }
}
</script>