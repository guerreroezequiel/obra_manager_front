<template>
    <div class="flex flex-col p-2 rounded-lg">
        <div class="flex flex-col p-2 rounded-lg">
            <!-- Modal agregar lista-->
            <div v-if="showModalNuevaLista"
                class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <div class="bg-white p-4 rounded-lg shadow-lg w-1/3">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-lg">Agregar nueva Lista de Precios</h2>
                        <button @click="showModalNuevaLista = false" class="text-black">&times;</button>
                    </div>
                    <input type="text" v-model="newPreLisIdName" placeholder="Nombre"
                        class="p-2 border rounded w-full mb-4">
                    <button @click="addPreLisId"
                        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full">
                        Agregar
                    </button>
                </div>
            </div>
        </div>

        <div class="flex flex-col" v-if="consulta && fieldSettings" :class="{ 'visible ': open, 'invisible ': !open }">

            <div
                class=" bg-slate-200 rounded-lg overflow-hidden overflow-x-auto w-full shadow-md border-2 border-slate-400">
                <table class="table-auto">
                    <thead>
                        <tr class="">
                            <th v-if="isDeleting"></th> <!-- Cabecera adicional vacía -->
                            <th v-for="(field, index) in sortedFieldSettings" :key="field.id" class="">
                                <div class="border-r-2  my-1 px-0.5 "
                                    :class="{ 'resizable hover:border-blue-500': isEditing }"
                                    :style="{ width: field.width + 'px', minWidth: field.type === 'search' ? '80px' : 'auto' }"
                                    :data-field-name="field.fieldName" :data-index="index">
                                    <p class="truncate p-1 select-none">{{ field.tag }}</p>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in paginatedItems" :key="index" @click="selectRow(item)">
                            <td v-if="isDeleting">
                                <button @click.stop="deleteRowVisual(item)"
                                    class="text-blue-500 scale-125 px-1 pb-1.5 bg-transparent active:text-red-500">
                                    <Icon name="material-symbols:delete-outline-rounded" />
                                </button>
                            </td>
                            <td v-for="(field, index) in fieldSettings" :key="field.id">
                                <div v-if="cellRefs" class="flex flex-grow " :ref="el => cellRefs[index] = el">
                                    <div v-if="field.type === 'search'" class="flex flex-grow" @click="selectRow(item)">
                                        <input :readonly="!isEditing"
                                            :value="nombres[`${field.fieldName}_${(item as any)[field.fieldName]}`]"
                                            :style="{ width: `50px` }"
                                            class="flex flex-grow focus:outline-none focus:border-blue-500 border px-2 py-1 rounded-md">
                                        <button @click="selectRow(item), openModal(field.fieldName)"
                                            :disabled="!isEditing"
                                            class="bg-blue-200 px-2 rounded items-center justify-center">
                                            <Icon name="simple-line-icons:magnifier" class="pb-1"></Icon>
                                        </button>
                                        <ModalElegirIdV2 :showModal="showModalProveedores"
                                            :rutaGet="'http://localhost:3333/proveedores'"
                                            @close.native="showModalProveedores = false"
                                            @aceptar="updateRow($event, 'proveedorId')" />
                                        <ModalElegirIdV2 :showModal="showModalArticulos"
                                            :rutaGet="'http://localhost:3333/articulos'"
                                            @close.native="showModalArticulos = false"
                                            @aceptar="updateRow($event, 'articuloId')" />

                                    </div>
                                    <select v-else-if="field.type === 'list'" class="flex flex-grow bg-white rounded"
                                        :style="{ width: `50px` }" :disabled="!field.isEditable || !isEditing"
                                        v-model="(item as any)[field.fieldName]"
                                        :class="{ 'bg-slate-200': !field.isEditable && isEditing, 'focus:outline-none focus:border-blue-500 border px-2 py-1 rounded-md': true }">
                                        <option v-for="(lisPreIds, index) in lisPreIds" :key="'lisPreIds-' + index"
                                            :value="lisPreIds.id">
                                            {{ lisPreIds.nombre }}
                                        </option>
                                    </select>
                                    <div v-else-if="isEditing && field.type === 'number'"
                                        class="flex flex-grow items-center justify-start rounded-md">
                                        <input type="number" :style="{ width: `50px` }"
                                            class="flex-grow focus:outline-none focus:border-blue-500 border px-2 py-1 rounded-md"
                                            :class="{ 'bg-gray-300': !field.isEditable && isEditing, 'bg-white': field.isEditable }"
                                            :disabled="!field.isEditable"
                                            v-model.number="(item as any)[field.fieldName]">
                                    </div>
                                    <input v-else-if="field.type === 'check'" class="flex flex-grow"
                                        :style="{ width: `50px` }" type="checkbox"
                                        :disabled="!field.isEditable || !isEditing"
                                        v-model="(item as any)[field.fieldName]"
                                        :class="{ 'bg-gray-300': !field.isEditable && isEditing, 'focus:outline-none focus:border-blue-500 border px-2 py-1 rounded-md': true }">

                                    <div v-else-if="isEditing && field.type === 'price'"
                                        class="flex flex-grow items-center justify-start rounded-md">
                                        <input type="number" :style="{ width: `50px` }"
                                            class="flex-grow focus:outline-none focus:border-blue-500 border px-2 py-1 rounded-md"
                                            :class="{ 'bg-gray-300': !field.isEditable && isEditing, 'bg-white': field.isEditable }"
                                            :disabled="!field.isEditable"
                                            v-model.number="(item as any)[field.fieldName]">
                                    </div>
                                    <div v-else-if="field.type === 'price'" :style="{ width: `50px` }"
                                        class="flex flex-grow items-center justify-start px-2 py-1 rounded-md "
                                        :class="{ 'bg-gray-300': !field.isEditable && isEditing, 'bg-white': field.isEditable }">
                                        {{ formatPrice((item as any)[field.fieldName]) }}
                                    </div>
                                    <input v-else
                                        class="flex flex-grow focus:outline-none focus:border-blue-500 border px-2 py-1 rounded-md "
                                        :type="field.type === 'text' ? 'text' : 'text'" :style="{ width: `50px` }"
                                        :readonly="!field.isEditable || !isEditing"
                                        v-model="(item as any)[field.fieldName]"
                                        :class="{ 'bg-gray-300': !field.isEditable && isEditing, 'bg-white': field.isEditable }">
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>

        <div class="flex justify-between mt-3 my-1 ">
            <button @click="showModalNuevaLista = true"
                class="px-2 pb-1 h-7 rounded-md bg-blue-500 text-white hover:bg-blue-600 justify-self-end">
                Agregar Lista
            </button>
            <div class="flex space-x-1 items-center ">
                <!-- Botón para abrir la modal agregar lista-->

                <button class="w-20 h-7 rounded-md"
                    :class="{ 'bg-sky-400 text-white': !isEditing, 'bg-gray-400': isEditing }"
                    v-if="!isEditing && !isDeleting" @click="toggleDelete()">
                    <p>Eliminar</p>
                </button>
                <button class="items-center w-20 h-7 rounded-md "
                    :class="{ 'bg-sky-400 text-white': !isDeleting, 'bg-gray-400': isDeleting }"
                    v-if="!isEditing && !isDeleting" @click="toggleEdit()">
                    <p>Editar</p>
                </button>
                <button class="items-center w-20 h-7 rounded-md text-white bg-red-400" v-if="isEditing || isDeleting"
                    @click="cancelChanges()">
                    <p>Cancelar</p>
                </button>
                <button class="w-20 h-7  rounded-md"
                    :class="{ 'bg-sky-400 text-white': isEditing || isDeleting, 'bg-gray-400': !isEditing && !isDeleting }"
                    @click="isEditing ? saveChanges() : deleteRows()" :disabled="!isEditing && !isDeleting"
                    v-if="isEditing || isDeleting">
                    <p>Guardar</p>
                </button>
                <button class="w-20 h-7  rounded-md"
                    :class="{ 'bg-sky-400 text-white': isEditing, 'bg-gray-400': !isEditing }" @click="createRow"
                    :disabled="!isEditing">
                    <p>Crear</p>
                </button>


            </div>


        </div>
        <div class="flex  justify-center items-center mt-4">
            <button @click="prevPage" class=" bg-blue-500 text-white rounded-full  active:scale-95 mx-3 h-10 w-10 pb-1 "
                :disabled="currentPage <= 1">
                <Icon name="simple-line-icons:arrow-left" />
            </button>
            <span>Página {{ currentPage }} de {{ totalPages }}</span>
            <button @click="nextPage" class=" bg-blue-500 text-white rounded-full  active:scale-95 mx-3 h-10 w-10 pb-1 "
                :disabled="currentPage >= totalPages">
                <Icon name="simple-line-icons:arrow-right" />
            </button>
        </div>
    </div>
</template>

<script lang="ts">

interface ItemType {
    id: number;
}

interface NombreXid {
    id: number;
    nombre: string;

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

interface LisPre {
    id: number;
    listaId: number;
    articuloId: number;
    proveedorId: number;
    precioVenta: number;
    descripcion: string | null;
    habilitado: boolean | null;
}

import interact from 'interactjs';
import { ref, onMounted, watch } from 'vue';
import { format, parseISO } from 'date-fns';
import { ar, ca } from 'date-fns/locale';
import ModalElegirId from '../modal/ModalElegirId.vue';


export default {
    data() {
        return {
            cellRefs: [] as any[],
            nombres: {} as Record<string, string>,
            showModalField: '' as string,
            currentPage: 1,
            perPage: 15,
            // ...
        }
    },

    props: {
        rutaGet: {
            type: String,
            required: true,
        },
    },


    mounted() {
        let debounceTimer: NodeJS.Timeout | null = null;

        // Interact.js resizable y draggable
        interact('.resizable').resizable({
            edges: { left: false, right: true, bottom: false, top: false },
            listeners: {
                move: (event) => {
                    const { target, rect } = event;
                    target.style.width = `${rect.width}px`;

                    const field = this.fieldSettings.find(field => field.fieldName === target.dataset.fieldName);
                    if (field) {
                        field.width = rect.width;
                    }
                },
            },
            modifiers: [
                interact.modifiers.restrictSize({
                    min: { width: 50, height: 50 },
                }),
            ],
            inertia: true,
        })
            .draggable({
                listeners: {
                    move: (event) => {
                        if (debounceTimer) clearTimeout(debounceTimer);
                        debounceTimer = setTimeout(() => {

                            const { target } = event;
                            const fieldIndex = parseInt(target.dataset.index);
                            const field = this.fieldSettings[fieldIndex];
                            if (field) {
                                const nextField = this.fieldSettings[fieldIndex + 1];
                                const prevField = this.fieldSettings[fieldIndex - 1];

                                if (nextField && event.dx > 0 && field.order < nextField.order) {
                                    // Moving to the right
                                    const tempOrder = field.order;
                                    field.order = nextField.order;
                                    nextField.order = tempOrder;
                                } else if (prevField && event.dx < 0 && field.order > prevField.order) {
                                    // Moving to the left
                                    const tempOrder = field.order;
                                    field.order = prevField.order;
                                    prevField.order = tempOrder;
                                }
                            }
                        }, 70); // timer
                    },
                },
                inertia: true,
            });
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

        // Mostrar el modal para elegir un ID
        showModal(field: string) {
            this.showModalField = field;
        },

        // Devuelve true si el campo es editable
        isFieldEditable(fieldName: any) {
            return this.fieldSettings[fieldName];
        },

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

        createRow() {
            // Crear un nuevo objeto ArtTarea con campos vacíos
            const newRow = {
                id: 0,
                listaId: 1,
                articuloId: 0,
                proveedorId: 0,
                precioVenta: 0,
                descripcion: null,
                habilitado: false,
            };
            this.consulta.push(newRow);
        },

        // Obtener el nombre de un campo por su ID
        async fetchNombre(id: number, fieldName: string) {
            if (id === null) {
                console.error('ID es null');
                return;
            }

            let url;
            switch (fieldName) {
                case 'articuloId':
                    url = `http://localhost:3333/articulos/${id}`;
                    break;
                case 'proveedorId':
                    url = `http://localhost:3333/proveedores/${id}`;
                    break;
                // Agrega más casos según sea necesario
                default:
                    console.error('Nombre de campo no reconocido');
                    return;
            }

            const { $auth } = useNuxtApp();
            const response = await $auth.fetchWithAuth(url);
            const data = await response.json();
            this.nombres[`${fieldName}_${id}`] = data.nombre; // Usar una combinación de fieldName e id como clave
        },

        openModal(fieldName: string) {
            switch (fieldName) {
                case 'proveedorId':
                    this.showModalProveedores = true;
                    break;
                case 'articuloId':
                    this.showModalArticulos = true;
                    break;
                default:
                    console.error(`No se encontró un modal para el fieldName: ${fieldName}`);
            }
        },
    },

    // Cargar los nombres de los campos al inicio
    created() {
        for (let item of this.consulta) {
            for (let field in item) {
                if (field === 'articuloId' || field === 'proveedorId') {
                    if (item[field] !== null) {
                        this.fetchNombre(item[field] as number, field);
                    }
                }
            }
        }
    },

    // Actualizar los nombres de los campos al cambiar la consulta
    watch: {
        consulta: {
            immediate: true,
            handler(newValue) {
                for (let item of newValue) {
                    for (let field in item) {
                        if (field === 'articuloId' || field === 'proveedorId') { // Añade más campos si es necesario
                            this.fetchNombre(item[field], field);
                        }
                    }
                }
            }
        }
    },

    setup(props, { emit }) {
        let consulta = ref<LisPre[]>([]);
        let open = ref(true);
        let selected = ref<LisPre | null>(null); // Nueva variable para almacenar el objeto ArtTarea seleccionado
        let fieldSettings: Ref<Campo[]> = ref([]);
        let isEditing = ref(false);  // Nuevo estado
        let isDeleting = ref(false);  // Nuevo estado
        let changedItems = ref<{ [key: string]: any }>({});
        let originalConsulta = ref([]);  // Nuevo estado
        let tableProp = new URL(props.rutaGet).pathname.split('/')[1]
        let tareaId = parseInt(new URL(props.rutaGet).pathname.split('/').pop() || '') || null;
        let deletedRows = ref<ItemType[]>([]);
        let lisPreIds = ref<NombreXid[]>([]);
        const showModalProveedores = ref(false)
        const showModalArticulos = ref(false)
        const showModalNuevaLista = ref(false)
        const newPreLisIdName = ref('');
        const selectedId = ref<number | null>(null);
        const { $auth } = useNuxtApp();

        const addPreLisId = async () => {
            const apiUrl = 'http://localhost:3333/lis_pre_ids'; // URL de tu API
            const data = {
                nombre: newPreLisIdName.value, // Datos que se enviarán
            };

            try {
                const response = await $auth.fetchWithAuth(apiUrl, {
                    method: 'POST', // Método HTTP POST
                    headers: {
                        'Content-Type': 'application/json', // Tipo de contenido
                        // 'Authorization': 'Bearer tu_token' // Autenticación, si es necesario
                    },
                    body: JSON.stringify(data), // Cuerpo de la solicitud
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }

                const responseData = await response.json();
                console.log(responseData); // Manejo de la respuesta de la API
                showModalNuevaLista.value = false; // Cierra la modal
                newPreLisIdName.value = ''; // Limpia el campo de entrada

                // Recargar la lista de IDs
                // const responseLisPreIds = await $auth.fetchWithAuth('http://localhost:3333/lis_pre_ids');
                // if (responseLisPreIds.ok) {
                //     lisPreIds.value = await responseLisPreIds.json();
                //     console.log('lisPreIds: ', lisPreIds.value);
                // } else {
                //     console.error('HTTP-Error: ' + responseLisPreIds.status);
                // }
            } catch (error) {
                console.error('Error al agregar preLisId:', error);
                // Manejo de errores
            }
        };


        const formatDate = (dateString: string) => {
            const date = parseISO(dateString);
            return format(date, 'dd-MM-yyyy');
        };


        async function refreshData() {
            // Recargar la consulta
            console.log('rutaGet desde all modal elegir id v2: ', props.rutaGet);
            const response = await $auth.fetchWithAuth(props.rutaGet);
            if (response.ok) {
                const contentType = response.headers.get("content-type");
                const camposResponse = await $auth.fetchWithAuth(`http://localhost:3333/user_field_settings/table/lis_pre`);  // campos editables
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
                        createdAt: formatDate(item.createdAt),
                        updatedAt: formatDate(item.updatedAt),
                        habilitado: item.habilitado == 1 ? true : false,
                    }));
                    console.log('consulta: ', consulta.value);
                } else {
                    console.error('HTTP-Error desde allLisPre: La respuesta no es un JSON válido');
                }
            } else {
                console.error('HTTP-Error desde alllispre: ' + response.status);
            }

            // Limpiar la copia original de consulta
            isEditing.value = false;
            isDeleting.value = false;
        }

        onMounted(async () => {
            // Cargar la consulta
            refreshData();
            const responseLisPreIds = await $auth.fetchWithAuth('http://localhost:3333/lis_pre_ids');
            if (responseLisPreIds.ok) {
                lisPreIds.value = await responseLisPreIds.json();
                console.log('lisPreIds: ', lisPreIds.value);
            } else {
                console.error('HTTP-Error: ' + responseLisPreIds.status);
            }
        });

        //seleccionar una fila
        const selectRow = (row: LisPre) => {
            if (showModalProveedores.value == false && showModalArticulos.value == false) {
                selected.value = row;

                console.log('Row selected: ', row.id);
                console.log('selectedLisPRe: ', selected.value);
            } else {
                console.log('Row selected: rota ' + 'showModalProveedores: ' + showModalProveedores.value + 'showModalArticulos: ' + showModalArticulos.value);
            }
        };

        // eliminar una fila visualmente
        const deleteRowVisual = (rowToDelete: LisPre) => {
            const consultaCopy = [...consulta.value];
            const index = consultaCopy.findIndex(row => row.id === rowToDelete.id);
            if (index !== -1 && index < consultaCopy.length && consultaCopy[index]) {
                // Agregar la fila a deletedRows antes de eliminarla visualmente
                deletedRows.value.push({ id: consultaCopy[index].id as number });
                consulta.value = consulta.value.filter(row => row.id !== rowToDelete.id);
            }
        };

        // eliminar una fila de la base de datos
        const deleteRows = async () => {
            console.log('deletedRows: ', deletedRows.value);

            for (let row of deletedRows.value) {
                console.log(`http://localhost:3333/${tableProp}/${row.id}`)
                try {
                    const response = await $auth.fetchWithAuth(`http://localhost:3333/${tableProp}/${row.id}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (!response.ok) {
                        const data = await response.json();
                        console.error('Error al eliminar la fila: ', data.error);
                    }
                } catch (error) {
                    console.error('Error al eliminar la fila: ', error);
                }
            }

            // Clear the deletedRows array after all rows have been deleted
            deletedRows.value = [];
            refreshData();
        };

        // Actualizar el ID de una fila seleccionada
        const updateRow = (newId: any, modalField: string) => {
            if (selected.value !== null && newId !== undefined) {
                switch (modalField) {
                    case 'articuloId':
                        console.log('selectedRowModal ID: ', selected.value.id);
                        selected.value.articuloId = newId.id;
                        selected.value.descripcion = newId.descripcion;
                        break;
                    case 'proveedorId':
                        selected.value.proveedorId = newId.id;
                        break;
                    default:
                        console.error(`No se encontró un campo para el modalField: ${modalField}`);
                }
                // console.log('selectedRowModal ID: ', selected.value.id);
            } else {
                console.error('Error al actualizar el RowModal');
            }
        };

        //  activar o desactivar el modo de edición
        const toggleEdit = async () => {
            if (!isEditing.value) {
                originalConsulta.value = JSON.parse(JSON.stringify(consulta.value));
            }
            isEditing.value = !isEditing.value;
            isDeleting.value = false;
        };

        const toggleDelete = async () => {
            if (!isDeleting.value) {
                originalConsulta.value = JSON.parse(JSON.stringify(consulta.value));
            }
            isDeleting.value = !isDeleting.value;
            isEditing.value = false;
        };


        // actualizar el ancho de un campo en la base de datos
        const updateFieldSettings = async () => {
            if (fieldSettings.value.length === 0) {
                console.error('fieldSettings.value is empty');
                return;
            }

            for (const field of fieldSettings.value) {
                const userId = field.userId;
                const fieldId = field.id;

                const url = `http://localhost:3333/user_field_settings/${userId}/${fieldId}`;

                try {
                    const response = await $auth.fetchWithAuth(url, {
                        method: 'PUT', // o 'PATCH'
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(field),
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                } catch (error) {
                    console.error('An error occurred while updating field settings for userId:', userId, 'fieldId:', fieldId, 'Error:', error);
                }
            }

            console.log('Field settings updated successfully');
        };

        const cancelChanges = () => {
            // Revertir los cambios reemplazando consulta.value con originalConsulta.value
            consulta.value = JSON.parse(JSON.stringify(originalConsulta.value));
            isEditing.value = false;
            isDeleting.value = false;
        };

        const saveChanges = async () => {
            const itemsToCreate: any[] = [];
            const itemsToUpdate: { [key: string]: any } = {};

            if (consulta.value && originalConsulta.value) {
                consulta.value.forEach((item: any, index: any) => {
                    if (!originalConsulta.value[index]) {
                        console.log('Adding item to itemsToCreate: ', item);
                        itemsToCreate.push(item);
                        return;
                    }

                    // Comparar cada propiedad del objeto actual con el objeto original
                    Object.keys(item).forEach(key => {
                        if (JSON.stringify(item[key]) !== JSON.stringify(originalConsulta.value[index][key])) {
                            console.log(`ID: ${item.id}, consulta.value: ${JSON.stringify(item[key])}, originalConsulta.value: ${JSON.stringify(originalConsulta.value[index][key])}`);

                            if (item.id == 0) {
                                itemsToCreate.push(item);
                            } else {
                                itemsToUpdate[item.id] = item;
                            }
                        }
                    });
                });
            }

            //guarda cambios
            for (let id in itemsToUpdate) {
                console.log('id: ', id, 'itemsToUpdate: ', itemsToUpdate[id]);
                const item = itemsToUpdate[id];
                const response = await $auth.fetchWithAuth(`http://localhost:3333/${tableProp}/${id}`, {
                    method: 'PUT', // 
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(item)
                });

                if (!response.ok) {
                    console.error('Error al guardar los cambios: ', response.url);
                }
            }

            //crear nuevos elementos
            for (let item of itemsToCreate) {
                console.log('Creating item: ', item);
                const response = await $auth.fetchWithAuth(`http://localhost:3333/${tableProp}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(item)
                });

                if (!response.ok) {
                    console.error('Error al crear el elemento: ', response.url);
                }
            }

            // Limpiar los objetos
            for (let prop in itemsToUpdate) {
                delete itemsToUpdate[prop];
            }

            await updateFieldSettings();

            originalConsulta.value = [];

            await refreshData();
        };

        return {
            consulta,
            lisPreIds,
            tareaId,
            open,
            fieldSettings,
            toggleEdit,
            toggleDelete,
            cancelChanges,
            isEditing,
            isDeleting,
            saveChanges,
            deleteRows,
            tableProp,
            showModalNuevaLista,
            newPreLisIdName,
            addPreLisId,
            showModalProveedores,
            showModalArticulos,
            updateRow,
            selectRow,
            deleteRowVisual,
            selected,
        };
    }
};
</script>