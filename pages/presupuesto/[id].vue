<template>
    <main>
        <!-- DASHBOARD -->
        <!-- OBRA -->

        <div v-if="obra" class="flex flex-col w-full p-2 my-5 overflow-x-hidden">
            <div class="flex flex-col flex-grow rounded-b-xl items-center justify-center">
                <!-- etapa -->
                <div class="flex flex-col w-full my-4 item-center justify-center shadow-lg border border-gray-300 px-2 pt-3 pb-2 rounded bg-white"
                    v-for="(etapa, etapaIndex) in etapas" :key="etapa.id" :ref="`etapa-${etapa.id}`">

                    <div class="flex flex-col border border-blue-600 rounded-md">
                        <div class="flex p-2 items-center justify-between">
                            <div class="flex items-center pb-1">
                                <p class="text-lg font-medium">{{ etapaIndex + 1 }}- {{ etapa.new }} </p>
                                <input v-model="etapa.nombre" type="text" class="text-gray-700 text-xl font-semibold" />
                            </div>
                        </div>
                        <!-- detalle -->
                        <div v-show="etapa.detalleVisible">
                            <div class="flex p-2 mx-1 rounded-md justify-between">
                                <input v-model="etapa.descripcion" type="text" class="text-gray-700 text-lg" />
                            </div>
                        </div>
                    </div>

                    <!-- TAREAS -->
                    <div v-for="(modulo, moduloIndex) in etapa.modulos" :key="modulo.id">
                        <div v-show="!modulo.tareaVisible" class="flex flex-col">
                            <div class="flex flex-col border border-slate-300 my-0.5 bg-gray-50 rounded-md py-0.5 px-2"
                                v-for="(tarea, tareaIndex) in modulo.tareas" :key="tarea.id" :ref="`tarea-${tarea.id}`">
                                <div class="flex items-center p-1">
                                    <div class="flex w-full items-center">
                                        <div
                                            class="flex items-center justify-between border-r border-slate-300 w-2/6 max-w-1/5">
                                            {{ tareaIndex + 1 }}
                                            <input v-model="tarea.nombre" type="text" class="text-gray-700" />
                                        </div>
                                        <div class="flex flex-grow justify-between">
                                            <p class="ml-3 text-blas border-r border-slate-300 w-5/6 mr-2">
                                                {{ tarea.descripcion }}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-col">
                                    <!-- ART_TAREAS -->
                                    <div class="flex flex-col bg-gray-100 text-xs px-2"
                                        v-for="(artTarea, artTareaIndex) in tarea.art_tareas" :key="artTarea.id"
                                        :ref="`artTarea-${artTarea.id}`">
                                        <div class="flex p-1">
                                            <div class="flex w-full">
                                                <div
                                                    class="flex items-center justify-between border-r border-slate-300 w-2/6 max-w-1/5">
                                                    {{ artTareaIndex + 1 }}
                                                    <input v-model="artTarea.articuloNombre" type="text"
                                                        class="text-gray-700" />
                                                </div>
                                                <div class="flex flex-grow justify-between">
                                                    <p class="ml-3 text-blas border-r border-slate-300 w-1/6 mr-2">
                                                        {{ artTarea.descripcion }}
                                                    </p>
                                                    <p class="ml-3 text-blas border-r border-slate-300 w-1/6 mr-2">
                                                        {{ artTarea.cantidad }}
                                                    </p>
                                                    <p class="ml-3 text-blas border-r border-slate-300 w-1/6 mr-2">
                                                        {{ artTarea.uniMedId }}
                                                    </p>
                                                    <p class="ml-3 text-blas border-r border-slate-300 w-1/6 mr-2">
                                                        {{ formatPrice(+artTarea.precioUnitario) }}
                                                    </p>
                                                    <p class="ml-3 text-blas border-r border-slate-300 w-1/6 mr-2">
                                                        {{ formatPrice(+artTarea.subtotal) }}
                                                    </p>
                                                    <p class="ml-3 text-blas border-r border-slate-300 w-1/6 mr-2">
                                                        {{ formatPrice(+artTarea.total) }}
                                                    </p>
                                                    <p class="ml-3 text-blas border-r border-slate-300 w-1/6 mr-2">
                                                        {{ artTarea.descuento }}%
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex flex-row-reverse">
                                        <p class="truncate pr-20"> Tarea: {{ formatPrice(+tarea.total) }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-end justify-end pr-12 text-slate-500">
                        <div class="flex mr-16 justify-end items-end space-x-10">
                            <p class="text-md font-semibold"> Descuento: {{ +etapa.descuento }}%</p>
                            <p class="text-md font-semibold"> Subtotal: {{ formatPrice(etapa.subtotal) }}</p>
                        </div>
                        <p class="text-2xl font-semibold">Total: {{ formatPrice(etapa.total) }} </p>
                    </div>
                </div>
                <div class="flex flex-grow justify-end"></div>
            </div>
        </div>
    </main>
</template>

<script lang="ts">

interface ArtTarea {
    id: number
    articuloId: number | null;
    articuloNombre: string | null;
    uniMedId: string | null;
    descripcion: string | null;
    cantidad: number;
    precioUnitario: number;
    descuento: number;
    total: number;
    subtotal: number;
    tareaId: number | null;
    rubroId: string | null;
    marcaId: string | null;
    tipoId: string | null;
    presentacionId: string | null;
    uniMedPack: string | null;
    canPack: number | null;
    rendimiento: number | null;
}

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
    artTareasVisible?: boolean | true;
    detalleVisible?: boolean;
    deleted?: boolean;
    new?: boolean;
    art_tareas?: ArtTarea[];
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
    modulovisible?: boolean | true;
    detalleVisible?: boolean;
    deleted?: boolean;
    new?: boolean;
    modulos: Modulo[];
}

interface Obra {
    id: number;
    codigo: string;
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
import SideNav from '~/components/SideNav.vue';


definePageMeta({
    middleware: 'auth'
});
export default {
    name: 'presupuesto',

    data() {
        return {
            table: 'obras',
            id: 1,
            currentId: Number(null),
            totalArtTareas: 0,
            subtotalArtTareas: 0,
            isLoading: false,
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

        },

        handleChangesSaved(tarea: Tarea, { total, subtotal, descuento }: Tarea) {
            tarea.total = total;
            tarea.subtotal = subtotal;
            tarea.descuento = descuento;
        },
    },


    setup(props) {

        const route = useRoute()
        let obra_id = route.params.id
        let sideNavOpen = ref(false);
        let obra = ref<Obra | null>(null);
        let etapas = ref<Etapa[]>([]);
        let modulos = ref<Modulo[]>([]);
        let tareas = ref<Tarea[]>([]);
        let art_tareas = ref<ArtTarea[]>([]);
        let rutaGet = ref(``);
        let isLoading = ref(false);
        const { $auth } = useNuxtApp();
        const config = useRuntimeConfig()
        const appUrl = config.public.appUrl
        const apiUrl = config.public.apiUrl
        const router = useRouter();

        const formatPrice = (price: number) => {
            const roundedPrice = Math.round(price * 100) / 100; // Redondea a dos decimales
            return roundedPrice.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', currencyDisplay: 'symbol' });
        };

        // Carga los detalles de la obra
        onMounted(async () => {
            try {
                const response = await $auth.fetchWithAuth(`${apiUrl}/obras/${obra_id}/presupuesto`)
                if (!response.ok) {
                    router.push('/login');
                }
                await refreshData();
            } catch (error) {
                console.error('Error fetching obra:', error);
            }
        });

        async function refreshData() {
            isLoading.value = true; // Inicia el estado de carga
            try {
                const response = await $auth.fetchWithAuth(`${apiUrl}/obras/${obra_id}/presupuesto`);
                if (response.ok) {
                    const data = await response.json();
                    obra.value = data.obra;
                    etapas.value = data.obra.etapas;
                    modulos.value = data.obra.etapas.flatMap((etapa: Etapa) => etapa.modulos);
                    tareas.value = data.obra.etapas.flatMap((etapa: Etapa) => etapa.modulos.flatMap(modulo => modulo.tareas));
                    art_tareas.value = data.obra.etapas.flatMap((etapa: Etapa) => etapa.modulos.flatMap(modulo => modulo.tareas.flatMap(tarea => tarea.art_tareas)));
                    console.log('Datos actualizados:', data);
                } else {
                    console.error('HTTP-Error-obra: ' + response.status);
                }
            } catch (error) {
                console.error('Error al refrescar los datos:', error);
            } finally {
                isLoading.value = false; // Finaliza el estado de carga
            }
        }



        return {
            sideNavOpen,
            obra,
            etapas,
            modulos,
            tareas,
            art_tareas,
            rutaGet,
            refreshData,
            formatPrice,
            isLoading,
        };
    }
}
</script>