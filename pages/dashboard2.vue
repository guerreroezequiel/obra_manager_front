<template>
    <main class="flex bg-gradient-to-r from-gray-100 to-orange-50">
        <ModalAgregar :showModal="showModalModulos" :rutaGet="'http://localhost:3333/models/modulos'"
            @close="showModalModulos = false" @aceptar="refreshData()" />
        <div>
            <!-- Cartel de carga -->
            <div v-if="isLoading" class="fixed inset-0 bg-gray-400 bg-opacity-50 flex justify-center items-center">
                <div class=" bg-gray-200 p-4 rounded-lg shadow-lg flex items-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                    </svg>
                    <span>Cargando datos, por favor espere...</span>
                </div>
            </div>

            <!-- El resto de tu plantilla -->
        </div>
        <!-- SIDENAV -->
        <div :class="{ 'w-96 ': sideNavOpen, 'w-0 ': !sideNavOpen }"
            class="flex flex-col sticky top-0 left-0 h-screen pt-10 bg-gray-100 justify-center duration-300 border-r-2 border-r-slate-400 text-slate-600">

            <button @click="sideNavOpen = !sideNavOpen"
                class="absolute -right-[37px] p-1 bg-gray-200 border-r-2 border-b-2 border-neutral-400 text-black top-24  rounded-r-xl transition-all items-center active:scale-95 duration-100">
                <Icon v-if="sideNavOpen" name="mdi:folder-open-outline" class="h-12 hover:cursor-pointer " size="25">
                </Icon>
                <Icon v-else name="mdi:folder-search-outline" class="h-12 hover:cursor-pointer " size="25"></Icon>
            </button>

            <button v-if="!isEditing" :class="{ 'bg-gray-200': !isEditing }" @click="toggleEdit()" class="absolute -right-[37px] p-1 border-r-2 border-b-2 border-neutral-400 text-black top-40 rounded-r-xl
                transition-all items-center active:scale-95 duration-100">
                <Icon name="simple-line-icons:pencil" class="h-12 hover:cursor-pointer " size="25"></Icon>
            </button>
            <button v-else :class="{ 'bg-red-300': isEditing }" @click="toggleEdit()" class="absolute -right-[37px] p-1 border-r-2 border-b-2 border-neutral-400 text-black top-40 rounded-r-xl
                transition-all items-center active:scale-95 duration-100">
                <Icon name="simple-line-icons:ban" class="h-12 hover:cursor-pointer " size="25"></Icon>
            </button>

            <button v-if="isEditing" @click="saveChanges()" :disabled="!isEditing"
                class="absolute -right-[37px] p-1 bg-blue-300 border-r-2 border-b-2 border-neutral-400 text-black top-56  rounded-r-xl transition-all items-center active:scale-95 duration-100">
                <Icon name="line-md:confirm" class="h-12 hover:cursor-pointer " size="25"></Icon>
            </button>

            <div class="flex flex-col mt-12 items-center p-4" v-if="obra">
                <div class="flex flex-row min-h-10 w-full justify-between ring-1 focus:ring-blue-500 rounded-md">
                    <input class="p-1 rounded-l-md w-5/6 bg-gray-200 focus:outline-none text-black " type="text"
                        placeholder="Buscar" />
                    <button class="flex w-1/6 bg-slate-400 rounded-r-md items-center justify-center active:scale-95">
                        <Icon name="simple-line-icons:magnifier" class=""></Icon>
                    </button>
                </div>

                <div v-show="sideNavOpen" class="flex flex-col ml-5 p-2 ">
                    <button>Favorito 1</button>
                    <button>Favorito 2</button>
                    <button>Favorito 3</button>
                </div>
            </div>
            <div class="flex h-full overflow-x-auto">
                <div class="ml-5" v-if="obra" v-show="sideNavOpen">
                    <ul>
                        <li class="p-4">
                            <a href="#" class="p-4 truncate" @click="scrollToElement(`obra-${obra.id}`)">{{ obra.nombre
                                }}</a>
                            <ul>
                                <li class="p-4 " v-for="etapa in obra.etapas" :key="etapa.id">
                                    <a href="#" class="p-4 truncate overflow-hidden whitespace-nowrap"
                                        @click="scrollToElement(`etapa-${etapa.id}`)">{{
                                            etapa.nombre }}</a>
                                    <ul>
                                        <li class="p-4 " v-for="modulo in etapa.modulos" :key="modulo.id">
                                            <a href="#" class="p-4 truncate overflow-hidden whitespace-nowrap"
                                                @click="scrollToElement(`modulo-${modulo.id}`)">{{
                                                    modulo.nombre }}</a>
                                            <ul>
                                                <li class="p-4" v-for="tarea in modulo.tareas" :key="tarea.id">
                                                    <a href="#" class="p-4 truncate overflow-hidden whitespace-nowrap"
                                                        @click="scrollToElement(`tarea-${tarea.id}`)">{{ tarea.nombre
                                                        }}</a>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>

            </div>
        </div>

        <!-- DASHBOARD -->
        <!-- OBRA -->
        <div v-if="obra" class="flex flex-col w-full p-2 ml-10 mr-10 overflow-x-hidden">
            <div
                class="flex z-50 fixed top-2.5 rounded-3xl self-center h-10 px-5 items-center bg-orange-100 border-b border-r border-l border-orange-300 ">
                <p class="text-2xl">Lote</p>
                <input v-model="obra.nombre" type="text" class="max-w-20 text-gray-700 m-2 text-2xl font-bold"
                    :readonly="!isEditing"
                    :style="{ border: isEditing ? 'auto' : 'none', outline: 'none', backgroundColor: 'transparent' }" />
                <input v-if="isEditing" v-model="obra.medida" type="number" class="text-gray-700 m-2 text-2xl font-bold"
                    :readonly="!isEditing" :size="obra.medida.toString().length > 0 ? obra.medida.toString().length : 1"
                    :style="{ border: isEditing ? 'auto' : 'none', outline: 'none', backgroundColor: 'transparent' }" />
                <p v-else class="text-gray-700 m-2 text-2xl font-bold w-auto"> {{ obra.medida }}</p>

                <p>m2</p>
                <!-- 
                <p>Subt: {{ formatPrice(obra.subtotal) }}</p>

                <p>Descuento: {{ obra.descuento }}%</p>
                <p>Total: {{ formatPrice(obra.total) }}</p> -->
            </div>

            <div class="flex flex-col flex-grow rounded-b-xl items-center justify-center mt-14">
                <!-- etapa -->
                <div class="flex flex-col w-full my-4 item-center justify-center shadow-lg border border-gray-300 px-2 pt-3 pb-2 rounded bg-white"
                    v-for="(etapa, etapaIndex) in computedEtapas(obra.id).value" :key="etapa.id"
                    :ref="`etapa-${etapa.id}`">

                    <div class="flex flex-col border border-blue-600 rounded-md">
                        <div class="flex p-2 items-center justify-between">
                            <div class="flex items-center pb-1">
                                <p class="text-lg font-medium">{{ etapa.id }}- </p>
                                <input v-model="etapa.nombre" type="text" class="text-gray-700 text-xl font-semibold"
                                    :readonly="!isEditing"
                                    :style="{ border: isEditing ? 'auto' : 'none', outline: 'none', backgroundColor: 'transparent' }" />

                                <button @click="verModulosEtapa(etapa)" class="flex items-end text-blue-500 ">
                                    <Icon name="simple-line-icons:arrow-down" />
                                </button>
                            </div>
                            <button @click="verDetalleEtapa(etapa)" class="text-blue-500 px-3">
                                Ver detalle
                            </button>
                            <button @click="deleteEtapa(etapa)" v-show="isEditing"
                                class="flex text-blue-500 border-0.5 scale-125 p-1 rounded mr-1 active:bg-gray-300">
                                <Icon name="material-symbols:delete-outline-rounded" />
                            </button>

                        </div>
                        <!-- detalle -->
                        <div v-show="etapa.detalleVisible">
                            <div class="flex p-2 mx-1 rounded-md justify-between">
                                <input v-model="etapa.descripcion" type="text" class="text-gray-700 text-lg"
                                    :readonly="!isEditing"
                                    :style="{ border: isEditing ? 'auto' : 'none', outline: 'none', backgroundColor: 'transparent' }" />
                                <button
                                    class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    @click="showModalModulos = true">Agregar Modulo +</button>
                            </div>
                        </div>

                    </div>


                    <!-- MODULOS -->

                    <div v-show="!etapa.modulovisible"
                        class="border-l-2  border-b-blue-500 border-l-blue-500  bg-slate-200 pb-2 pt-1 px-2 mx-2 mb-3 rounded "
                        v-for="(modulo, moduloIndex) in computedModulos(etapa.id).value" :key="modulo.id"
                        :ref="`modulo-${modulo.id}`">
                        <div class="flex items-center justify-between ">
                            <div class="flex item-center">
                                <p class="ml-3 text-lg font-medium">{{ modulo.id }}- </p>
                                <input v-model="modulo.nombre" type="text" class="text-gray-700" :readonly="!isEditing"
                                    :style="{ border: isEditing ? 'auto' : 'none', outline: 'none', backgroundColor: 'transparent' }" />
                                <button @click="verTareasModulo(modulo)" class="text-blue-500 px-3">
                                    <Icon name="simple-line-icons:arrow-down" />
                                </button>
                            </div>
                            <!-- detalle -->
                            <button @click="verDetalleModulo(modulo)" class="text-blue-500 px-3 self-end">
                                Ver detalle
                            </button>
                            <button @click="deleteModulo(modulo)" v-show="isEditing"
                                class="flex text-blue-500 border-0.5 scale-125 p-1 rounded mr-1 active:bg-gray-300">
                                <Icon name="material-symbols:delete-outline-rounded" />
                            </button>

                        </div>
                        <div v-show="modulo.detalleVisible">
                            <div class="flex items-center justify-between">
                                <input v-model="modulo.descripcion" type="text" class="text-gray-700 text-lg"
                                    :readonly="!isEditing"
                                    :style="{ border: isEditing ? 'auto' : 'none', outline: 'none', backgroundColor: 'transparent' }" />

                            </div>

                        </div>

                        <!-- TAREAS -->
                        <div v-show="!modulo.tareaVisible" class="flex flex-col ">
                            <div class="flex flex-col border border-slate-300 my-0.5 bg-gray-50 rounded-md py-0.5 px-2"
                                v-for="(tarea, tareaIndex) in computedTareas(modulo.id).value" :key="tarea.id"
                                :ref="`tarea-${tarea.id}`">
                                <div class="flex items-center p-1 ">
                                    <div class="flex w-full items-center">
                                        <div
                                            class="flex items-center justify-between border-r border-slate-300 w-2/6 max-w-1/5 ">
                                            {{ tarea.id }}
                                            <input v-model="tarea.nombre" type="text" class="text-gray-700 "
                                                :readonly="!isEditing"
                                                :style="{ border: isEditing ? 'auto' : 'none', outline: 'none', backgroundColor: 'transparent' }" />
                                            <button @click="verArtTarea(tarea)" class="text-blue-500 px-3  ">
                                                <Icon name="simple-line-icons:arrow-down" />
                                            </button>
                                        </div>
                                        <div class="flex flex-grow justify-between">
                                            <p class="ml-3 text-blas border-r border-slate-300 w-5/6 mr-2">
                                                {{ tarea.descripcion }}</p>
                                            <p class="w-1/6">{{ formatPrice(+tarea.total) }}</p>
                                            <p class="w-1/6">{{ formatPrice(+tarea.subtotal) }}</p>
                                        </div>

                                    </div>
                                    <button @click="verDetalleTareas(tarea)"
                                        class="text-blue-500 px-3 min-w-max text-sm">
                                        <p>Ver detalle</p>
                                    </button>
                                    <button @click="deleteTarea(tarea)" v-show="isEditing"
                                        class="flex text-blue-500 border-0.5 scale-125 p-1 rounded mr-1 active:bg-gray-300">
                                        <Icon name="material-symbols:delete-outline-rounded" />
                                    </button>

                                </div>
                                <div class="flex flex-col">
                                    <!-- detalle -->
                                    <div v-show="tarea.detalleVisible" class="flex items-center">

                                        <div class="flex">
                                            <p>hereda medida:</p><input v-model="tarea.descripcion" type="checkbox"
                                                class="text-gray-700 text-lg" :disabled="!isEditing" />
                                        </div>


                                    </div>

                                    <!-- ART_TAREAS -->
                                    <div v-if="tarea.artTareasVisible" class="mt-4">
                                        <GrillaArtTareasV2 :rutaGet='rutaGet' :medida="Number(obra.medida)"
                                            @changesSaved="handleChangesSaved(tarea, $event)" />
                                    </div>
                                </div>
                            </div>
                            <!-- botones para agregar -->
                            <div class="flex items-center mt-1">
                                <button v-if="isEditing && modulo.id != 0"
                                    class="mr-2 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:w-auto sm:text-sm active:bg-gray-300"
                                    @click="crearTarea(modulo.id)">Crear Tareas +</button>
                                <button v-if="isEditing && modulo.id != 0"
                                    class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:w-auto sm:text-sm active:bg-gray-300"
                                    @click="setCurrentId(modulo.id)">Importar Tareas +</button>
                            </div>


                            <DashForm :showModal="showModalTareas" :rutaGet="'http://localhost:3333/tareas'"
                                :fkPadre="currentId" @close="showModalTareas = false" @aceptar="refreshData()" />
                        </div>

                    </div>
                    <div class="flex items-end justify-end pr-12 text-slate-500">
                        <div class="flex mr-16 justify-end items-end space-x-10">

                            <p class="text-md font-semibold"> Descuento: {{ +etapa.descuento }}%</p>
                            <p class="text-md font-semibold"> Subtotal: {{ formatPrice(etapa.subtotal) }}</p>

                        </div>

                        <p class="text-2xl font-semibold">Total: {{ formatPrice(etapa.total) }} </p>
                    </div>
                    <button v-if="isEditing && etapa.id != 0"
                        class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        @click="crearModulo(etapa.id)">Crear Modulo +</button>
                </div>
                <div class="flex flex-grow justify-end">
                </div>
            </div>
            <button v-if="isEditing"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                @click="crearEtapa(obra.id)">Crear Etapa +</button>
        </div>
    </main>
</template>

<script lang="ts">
interface Tarea {
    id: number;
    nombre: string;
    habilitado: boolean;
    descripcion: string;
    total: number;
    subtotal: number;
    descuento: number;
    createdAt: string;
    updatedAt: string;
    moduloId: number;
    artTareasVisible?: boolean | false;
    detalleVisible?: boolean;
    deleted?: boolean;
    new?: boolean;
    artTareas?: [];
}

interface Modulo {
    id: number;
    nombre: string;
    descripcion: string;
    habilitado: boolean;
    total: number;
    subtotal: number;
    descuento: number;
    createdAt: string;
    updatedAt: string;
    estadoId: null | number;
    etapaId: number;
    tareaVisible?: boolean | true;
    detalleVisible?: boolean;
    deleted?: boolean;
    new?: boolean;

    tareas: Tarea[];
}

interface Etapa {
    id: number;
    nombre: string;
    descripcion: string;
    total: number;
    subtotal: number;
    descuento: number;
    redondeo: number;
    habilitado: boolean;
    createdAt: string;
    updatedAt: string;
    estadoId: null | number;
    obraId: number;
    modulovisible?: boolean;
    detalleVisible?: boolean;
    deleted?: boolean;
    new?: boolean;
    modulos: Modulo[];
}

interface Obra {
    id: number;
    nombre: string;
    descripcion: string;
    medida: number;
    clienteId: number;
    total: number;
    subtotal: number;
    iva: number;
    descuento: number;
    habilitado: boolean;
    createdAt: string;
    updatedAt: string;
    estadoId: number;
    deleted?: boolean;
    etapas: Etapa[];
}

import { format, parseISO } from 'date-fns';
import { ref, onMounted } from 'vue';
import GrillaArtTareasV2 from '~/components/grilla/GrillaArtTareasV2.vue';
import SideNav from '~/components/SideNav.vue';

export default {

    components: {
        SideNav
    },

    data() {
        return {
            table: 'obras',
            id: 1,
            currentId: Number(null),
            totalArtTareas: 0,
            subtotalArtTareas: 0,
            isLoading: false,
            // Declare the deletedEtapas property as an empty array
        };
    },

    methods: {
        scrollToElement(refName: string) {
            this.$nextTick(() => {
                console.log('refName: ', refName);
                const element = this.$refs[refName] as HTMLElement[];
                element[0].scrollIntoView({ behavior: 'smooth' });
            });
        },

        setCurrentId(id: any) {
            this.currentId = id;
            this.showModalTareas = true;
        },

        handleChangesSaved(tarea: Tarea, { total, subtotal, descuento }: Tarea) {
            tarea.total = total;
            tarea.subtotal = subtotal;
            tarea.descuento = descuento;
        },
    },


    setup(props) {
        let sideNavOpen = ref(false);
        let obra = ref<Obra | null>(null);
        let originalObra = ref(null);
        let etapas = ref<Etapa[]>([]);
        let originalEtapa = ref([]);
        let modulos = ref<Modulo[]>([]);
        let originalModulo = ref([]);
        let tareas = ref<Tarea[]>([]);
        let originalTarea = ref([]);
        let rutaGet = ref(``);
        const showModalEtapas = ref(false)
        const showModalModulos = ref(false)
        const showModalTareas = ref(false)
        const showModalArtTareas = ref(false)
        let isEditing = ref(false);
        let deletedEtapas = ref<number[]>([]);
        let deletedModulos = ref<number[]>([]);
        let deletedTareas = ref<number[]>([]);
        let isLoading = ref(false);

        const route = useRoute();
        const obra_id = route.params.id;

        const computedTareas = (moduloId: number) => computed(() => {
            return modulos.value
                .find(modulo => modulo.id === moduloId)
                ?.tareas.filter(tarea => !tarea.deleted) || [];
        });

        const computedModulos = (etapaId: number) => computed(() => {
            return etapas.value
                .find(etapa => etapa.id === etapaId)
                ?.modulos.filter(modulo => !modulo.deleted) || [];
        });

        const computedEtapas = (obraId: number) => computed(() => {
            if (obra.value && obra.value.id === obraId) {
                return obra.value.etapas.filter(etapa => !etapa.deleted);
            }
            return [];
        });

        const formatDate = (dateString: string) => {
            const date = parseISO(dateString);
            return format(date, 'dd-MM-yyyy');
        };

        // Calcula tareas.total como la suma de todos los totales de las tareas
        const tareasTotal = computed(() => {
            return tareas.value.reduce((acc, tarea) => acc + tarea.total, 0);
        });

        const tareasSubtotal = computed(() => {
            return tareas.value.reduce((acc, tarea) => acc + tarea.subtotal, 0);
        });
        //modulos.total como la suma de todos los totales de los modulos
        const modulosTotal = computed(() => {
            return modulos.value.reduce((acc, modulo) => acc + modulo.total, 0);
        });

        const moduloSubtotal = computed(() => {
            return modulos.value.reduce((acc, modulo) => acc + modulo.subtotal, 0);
        });

        //etaas.total como la suma de todos los totales de las etapas
        const etapasTotal = computed(() => {
            return etapas.value.reduce((acc, etapa) => acc + etapa.total, 0);
        });

        const etapasSubtotal = computed(() => {
            return etapas.value.reduce((acc, etapa) => acc + etapa.subtotal, 0);
        });


        // Observa cambios en tareasTotal y actualiza etapas.total en consecuencia
        watch([tareasTotal, modulosTotal, etapasTotal, tareasSubtotal, moduloSubtotal, etapasSubtotal], () => {
            // Filtrar primero las etapas no eliminadas
            let etapasNoEliminadas = etapas.value.filter(etapa => !etapa.deleted);

            // Calcular el total de obra solo con las etapas no eliminadas
            let totalObra = etapasNoEliminadas.reduce((acc, etapa) => acc + Number(etapa.total), 0);

            // Calcular el subtotal de obra solo con las etapas no eliminadas
            let subtotalObra = etapasNoEliminadas.reduce((acc, etapa) => acc + Number(etapa.subtotal), 0);

            // Actualizar los totales y subtotales de módulos y tareas para cada etapa no eliminada
            etapasNoEliminadas.forEach(etapa => {
                let sumaModulos = 0;
                let sumaSubtotalModulos = 0; // Para el subtotal
                etapa.modulos.filter(modulo => !modulo.deleted).forEach(modulo => {
                    let sumaTareas = 0;
                    let sumaSubtotalTareas = 0; // Para el subtotal
                    modulo.tareas.filter(tarea => !tarea.deleted).forEach(tarea => {
                        sumaTareas += Number(tarea.total);
                        sumaSubtotalTareas += Number(tarea.subtotal); // Asumiendo que tarea tiene un campo subtotal
                    });
                    modulo.total = Math.round(sumaTareas * 100) / 100; // Redondear a dos decimales
                    modulo.subtotal = Math.round(sumaSubtotalTareas * 100) / 100; // Redondear a dos decimales
                    sumaModulos += modulo.total;
                    sumaSubtotalModulos += modulo.subtotal; // Sumar al subtotal de la etapa
                });
                etapa.total = Math.round(sumaModulos * 100) / 100; // Redondear a dos decimales
                etapa.subtotal = Math.round(sumaSubtotalModulos * 100) / 100; // Redondear a dos decimales

                // Calcular el porcentaje de descuento de la etapa como la diferencia entre el subtotal y el total de la etapa, dividido por el subtotal, todo multiplicado por 100
                if (etapa.subtotal !== 0) { // Evitar división por cero
                    etapa.descuento = Math.round(((etapa.subtotal - etapa.total) / etapa.subtotal) * 100 * 100) / 100; // Redondear a dos decimales
                } else {
                    etapa.descuento = 0; // Si el subtotal es 0, el descuento es 0%
                }
            });

            // Calcular el porcentaje de descuento de la obra
            let descuentoTotalObra = 0;
            if (subtotalObra !== 0) { // Evitar división por cero
                descuentoTotalObra = Math.round(((subtotalObra - totalObra) / subtotalObra) * 100 * 100) / 100; // Redondear a dos decimales
            }
            console.log('descuentoTotalObra:', descuentoTotalObra, 'totalObra:', totalObra, 'subtotalObra:', subtotalObra);

            // Actualizar el objeto obra con los nuevos valores calculados
            if (obra.value) {
                obra.value.total = totalObra;
                obra.value.subtotal = subtotalObra;
                obra.value.descuento = descuentoTotalObra;
            }
        });

        const formatPrice = (price: number) => {
            const roundedPrice = Math.round(price * 100) / 100; // Redondea a dos decimales
            return roundedPrice.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', currencyDisplay: 'symbol' });
        };

        // crea una nueva tarea
        const crearTarea = (moduloId: number) => {
            const nuevaTarea: Tarea = {
                id: 0, //me traigo siguiente id autoincremental
                nombre: 'NuevaTarea',
                habilitado: true,
                descripcion: 'Descripcion de nueva',
                total: 0,
                descuento: 0,
                subtotal: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                moduloId: moduloId,
                artTareasVisible: false,
                detalleVisible: false,
                deleted: false,
                new: true,
                artTareas: [],
            };
            const moduloIndex = modulos.value.findIndex(modulo => modulo.id === moduloId);
            if (moduloIndex !== -1) {
                modulos.value[moduloIndex].tareas.push(nuevaTarea);
            }
            isEditing.value = true;
            // Actualizar tareas.value
            tareas.value = [...tareas.value, nuevaTarea];
        };

        //crear nuevo modulo
        const crearModulo = (etapaId: number) => {
            const nuevoModulo: Modulo = {
                id: 0, //me traigo siguiente id autoincremental
                nombre: 'NuevoModulo',
                descripcion: 'Descripcion de nuevo',
                habilitado: true,
                total: 0,
                subtotal: 0,
                descuento: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                estadoId: null,
                etapaId: etapaId,
                tareaVisible: false,
                detalleVisible: false,
                deleted: false,
                new: true,
                tareas: [],
            };
            const etapaIndex = etapas.value.findIndex(etapa => etapa.id === etapaId);
            if (etapaIndex !== -1) {
                etapas.value[etapaIndex].modulos.push(nuevoModulo);
            }
            isEditing.value = true;
            // Actualizar modulos.value
            modulos.value = [...modulos.value, nuevoModulo];
        };

        //crear nueva etapa
        const crearEtapa = (obraId: number) => {
            const nuevaEtapa: Etapa = {
                id: 0,
                nombre: 'NuevaEtapa',
                descripcion: 'Descripcion de nueva',
                total: 0,
                subtotal: 0,
                descuento: 0,
                redondeo: 0,
                habilitado: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                estadoId: null,
                obraId: obraId,
                modulovisible: false,
                detalleVisible: false,
                deleted: false,
                new: true,
                modulos: [],
            };
            if (obra.value) {
                obra.value.etapas.push(nuevaEtapa);
            }
            isEditing.value = true;
            // Actualizar etapas.value
            etapas.value = [...etapas.value, nuevaEtapa];
        };

        const guardarTarea = (tarea: Tarea) => {
            const modulo = modulos.value.find(m => m.tareas.some(t => t.id === tarea.id));
            if (modulo) {
                const index = modulo.tareas.findIndex(t => t.id === tarea.id);
                if (index !== -1) {
                    modulo.tareas.splice(index, 1, tarea);
                }
            }
            isEditing.value = false;
        };

        // Carga los detalles de la obra
        onMounted(async () => {
            if (obra_id) {
                await refreshData();
            } else {
                console.error('El parámetro id no está presente en la ruta.');
            }
        });

        async function refreshData() {
            isLoading.value = true; // Inicia el estado de carga
            try {
                const response = await fetch(`http://localhost:3333/obras/${obra_id}/full`);
                console.log('ruta:', obra_id);
                if (response.ok) {
                    const data = await response.json();
                    obra.value = data.obra;
                    originalObra.value = JSON.parse(JSON.stringify(data.obra));  // Guarda una copia del estado original
                    etapas.value = data.obra.etapas;
                    originalEtapa.value = JSON.parse(JSON.stringify(data.obra.etapas));  // Guarda una copia del estado original
                    modulos.value = data.obra.etapas.flatMap((etapa: Etapa) => etapa.modulos);
                    originalModulo.value = JSON.parse(JSON.stringify(data.obra.etapas.flatMap((etapa: Etapa) => etapa.modulos)));  // Guarda una copia del estado original
                    tareas.value = data.obra.etapas.flatMap((etapa: Etapa) => etapa.modulos.flatMap(modulo => modulo.tareas));
                    originalTarea.value = JSON.parse(JSON.stringify(data.obra.etapas.flatMap((etapa: Etapa) => etapa.modulos.flatMap(modulo => modulo.tareas))));
                    // Guarda una copia del estado original
                } else {
                    console.error('HTTP-Error-obra: ' + response.status);
                }
            } catch (error) {
                console.error('Error al refrescar los datos:', error);
            } finally {
                isLoading.value = false; // Finaliza el estado de carga
            }
        }


        async function toggleEdit() {
            if (isEditing.value) {
                // Restaura el estado original

                obra.value = JSON.parse(JSON.stringify(originalObra.value));
                etapas.value = JSON.parse(JSON.stringify(originalEtapa.value));
                modulos.value = JSON.parse(JSON.stringify(originalModulo.value));
                tareas.value = JSON.parse(JSON.stringify(originalTarea.value));
                await refreshData()
            } else {
                // Guarda una copia del estado actual
                originalObra.value = JSON.parse(JSON.stringify(obra.value));
                originalEtapa.value = JSON.parse(JSON.stringify(etapas.value));
                originalModulo.value = JSON.parse(JSON.stringify(modulos.value));
                originalTarea.value = JSON.parse(JSON.stringify(tareas.value));


                // Compara tareas y originalTarea para determinar qué tareas se eliminaron
                deletedTareas.value = (originalTarea.value as Array<{ id: number; deleted?: boolean }>)
                    .filter(originalTareaItem => !tareas.value.some(tareaItem => tareaItem.id === originalTareaItem.id && !tareaItem.deleted))
                    .map(item => item.id);

                // Compara modulos y originalModulo para determinar qué módulos se eliminaron
                deletedModulos.value = (originalModulo.value as Array<{ id: number; deleted?: boolean }>)
                    .filter(originalModuloItem => !modulos.value.some(moduloItem => moduloItem.id === originalModuloItem.id && !moduloItem.deleted))
                    .map(item => item.id);

                // Compara etapas y originalEtapa para determinar qué etapas se eliminaron
                deletedEtapas.value = (originalEtapa.value as Array<{ id: number; deleted?: boolean }>)
                    .filter(originalEtapaItem => !etapas.value.some(etapaItem => etapaItem.id === originalEtapaItem.id && !etapaItem.deleted))
                    .map(item => item.id);
            }
            isEditing.value = !isEditing.value;

        }

        const deleteEtapa = (etapaToDelete: Etapa) => {
            const index = etapas.value.findIndex(etapa => etapa.id === etapaToDelete.id);
            if (index !== -1) {
                etapas.value[index].deleted = true;
                etapas.value = etapas.value.filter(etapa => !etapa.deleted);
            }
        };

        // Marcar un módulo como eliminado
        const deleteModulo = (moduloToDelete: Modulo) => {
            const index = modulos.value.findIndex(modulo => modulo.id === moduloToDelete.id);
            if (index !== -1) {
                modulos.value[index].deleted = true;
                modulos.value = modulos.value.filter(modulo => !modulo.deleted);
            }
        };

        const deleteTarea = (tareaToDelete: Tarea) => {
            const index = tareas.value.findIndex(tarea => tarea.id === tareaToDelete.id);
            if (index !== -1) {
                tareas.value[index].deleted = true;
                tareas.value = tareas.value.filter(tarea => !tarea.deleted);
            }
        };

        const saveChanges = async () => {
            isLoading.value = true;
            let changedObra: { [key: string]: any } = {};
            let changedEtapas: { [key: string]: any } = {};
            let changedModulos: { [key: string]: any } = {};
            let changedTareas: { [key: string]: any } = {};
            let deletedEtapas: string[] = [];
            let deletedModulos: string[] = [];
            let deletedTareas: string[] = [];

            // Para obra
            if (obra.value && originalObra.value) {
                Object.keys(obra.value).forEach(key => {
                    if (obra.value && JSON.stringify(obra.value) !== JSON.stringify(originalObra.value)) {
                        changedObra[obra.value.id] = obra.value;
                    }
                });
            }

            // Para etapas
            if (etapas.value && originalEtapa.value) {
                originalEtapa.value.forEach((item: any) => {
                    if (!etapas.value.find((etapa: any) => etapa.id === item.id)) {
                        deletedEtapas.push(item.id);
                    }
                });

                etapas.value.forEach((item: any, index: any) => {
                    if (!originalEtapa.value[index]) {
                        return;
                    }

                    Object.keys(item).forEach(key => {
                        if (JSON.stringify(item[key]) !== JSON.stringify(originalEtapa.value[index][key])) {
                            changedEtapas[item.id] = item;
                        }
                    });
                });
            }

            // Para modulos
            if (modulos.value && originalModulo.value) {
                originalModulo.value.forEach((item: any) => {
                    if (!modulos.value.find((modulo: any) => modulo.id === item.id)) {
                        deletedModulos.push(item.id);
                    }
                });

                modulos.value.forEach((item: any, index: any) => {
                    if (!originalModulo.value[index]) {
                        return;
                    }

                    Object.keys(item).forEach(key => {
                        if (JSON.stringify(item[key]) !== JSON.stringify(originalModulo.value[index][key])) {
                            changedModulos[item.id] = item;
                        }
                    });
                });
            }

            // Identificar y crear las etapas nuevas
            async function enviarNuevasEtapas() {
                console.log('etapas.value: ', etapas.value);
                const newEtapas = etapas.value.filter((item) => item.new === true);
                console.log('newEtapas: ', newEtapas);
                for (const etapa of newEtapas) {
                    const response = await fetch(`http://localhost:3333/etapas`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(etapa),
                    });

                    if (!response.ok) {
                        console.error('Error al enviar la etapa: ', response.url);
                    }
                }
            }
            await enviarNuevasEtapas();

            // Identificar y crear los módulos nuevos
            async function enviarNuevosModulos() {
                console.log('modulos.value: ', modulos.value);
                const newModulos = modulos.value.filter((item) => item.new === true);
                console.log('newModulos: ', newModulos);
                for (const modulo of newModulos) {
                    const response = await fetch(`http://localhost:3333/modulos`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(modulo),
                    });

                    if (!response.ok) {
                        console.error('Error al enviar el módulo: ', response.url);
                    }
                }
            }
            await enviarNuevosModulos();

            // Identificar las tareas nuevas
            async function enviarNuevasTareas() {
                const newTareas = tareas.value.filter((item) => item.new === true);
                console.log('newTareas: ', newTareas);
                // Crear las tareas nuevas en el servidor
                for (const tarea of newTareas) {
                    const response = await fetch(`http://localhost:3333/tareas`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(tarea),
                    });

                    if (!response.ok) {
                        console.error('Error al enviar el elemento: ', response.url);
                    }
                }
            }
            await enviarNuevasTareas();

            // Para tareas
            if (tareas.value && originalTarea.value) {
                originalTarea.value.forEach((item: any) => {
                    if (!tareas.value.find((tarea: any) => tarea.id === item.id)) {
                        deletedTareas.push(item.id);
                    }
                });

                tareas.value.forEach((item: any, index: any) => {
                    if (!originalTarea.value[index]) {
                        return;
                    }

                    Object.keys(item).forEach(key => {
                        if (JSON.stringify(item[key]) !== JSON.stringify(originalTarea.value[index][key])) {
                            changedTareas[item.id] = item;
                        }
                    });
                });
            }

            // Guardar los cambios para etapas, modulos y tareas
            await saveChangedItems(changedObra, 'obras');
            await saveChangedItems(changedEtapas, 'etapas');
            await saveChangedItems(changedModulos, 'modulos');
            await saveChangedItems(changedTareas, 'tareas');

            // Eliminar los elementos eliminados en el back-end
            await deleteItems(deletedEtapas, 'etapas');
            await deleteItems(deletedModulos, 'modulos');
            await deleteItems(deletedTareas, 'tareas');

            isLoading.value = false;
            await refreshData();
            isEditing.value = false;
        }

        const saveChangedItems = async (changedItems: any, endpoint: string) => {
            for (let id in changedItems) {
                const item = changedItems[id];
                const response = await fetch(`http://localhost:3333/${endpoint}/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(item)
                });

                if (!response.ok) {
                    console.error('Error al guardar los cambios: ', response.url);
                }
            }
        }

        const deleteItems = async (deletedItems: string[], endpoint: string) => {
            console.log('deletedItems: ', deletedItems);
            for (let id of deletedItems) {
                console.log(`http://localhost:3333/${endpoint}/${id}`)
                const response = await fetch(`http://localhost:3333/${endpoint}/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ habilitado: false }),
                });

                if (!response.ok) {
                    console.error('Error al actualizar el elemento: ', response.url);
                }
            }
            await refreshData();
        }

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
            sideNavOpen,
            obra,
            etapas,
            modulos,
            tareas,
            rutaGet,
            verArtTarea,
            verDetalleModulo,
            verTareasModulo,
            verDetalleEtapa,
            verModulosEtapa,
            verDetalleTareas,
            showModalEtapas,
            showModalModulos,
            showModalTareas,
            showModalArtTareas,
            isEditing,
            toggleEdit,
            deleteEtapa,
            deleteModulo,
            deleteTarea,
            saveChanges,
            refreshData,
            computedTareas,
            computedModulos,
            computedEtapas,
            formatPrice,
            crearTarea,
            crearModulo,
            crearEtapa,
            guardarTarea,
            isLoading,

        };
    }
}
</script>