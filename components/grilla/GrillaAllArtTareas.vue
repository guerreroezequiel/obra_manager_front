<template>
    <div class="flex flex-col p-2 rounded-lg">
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
                                    <div v-if="field.type === 'search'" class="flex flex-grow">
                                        <input :readonly="!isEditing" v-model="(item as any)[field.fieldName]"
                                            :style="{ width: `50px` }"
                                            :class="{ 'bg-gray-300': !field.isEditable && isEditing, 'bg-white': field.isEditable }"
                                            class="flex flex-grow focus:outline-none focus:border-blue-500 border px-2 py-1 rounded-md">
                                        <button @click="selectRow(item), showModalArticulos = true"
                                            :disabled="!isEditing"
                                            class="bg-blue-200 px-2 rounded items-center justify-center">
                                            <Icon name="simple-line-icons:magnifier" class="pb-1"></Icon>
                                        </button>
                                    </div>
                                    <input v-else-if="field.type === 'check'" class="flex flex-grow"
                                        :style="{ width: `50px` }" type="checkbox"
                                        :disabled="!field.isEditable || !isEditing"
                                        v-model="(item as any)[field.fieldName]"
                                        :class="{ 'bg-gray-300': !field.isEditable && isEditing, 'bg-white': field.isEditable }">

                                    <div v-else-if="isEditing && field.type === 'number'"
                                        class="flex flex-grow items-center justify-start rounded-md">
                                        <input type="number" :style="{ width: `50px` }"
                                            class="flex-grow focus:outline-none focus:border-blue-500 border px-2 py-1 rounded-md"
                                            :class="{ 'bg-gray-300': !field.isEditable && isEditing, 'bg-white': field.isEditable }"
                                            :disabled="!field.isEditable"
                                            v-model.number="(item as any)[field.fieldName]">
                                    </div>
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
            <div class="flex justify-center items-center mt-4">
                <button @click="prevPage"
                    class=" bg-blue-500 text-white rounded-full  active:scale-95 mx-3 h-10 w-10 pb-1 "
                    :disabled="currentPage <= 1">
                    <Icon name="simple-line-icons:arrow-left" />
                </button>
                <span>Página {{ currentPage }} de {{ totalPages }}</span>
                <button @click="nextPage"
                    class=" bg-blue-500 text-white rounded-full  active:scale-95 mx-3 h-10 w-10 pb-1 "
                    :disabled="currentPage >= totalPages">
                    <Icon name="simple-line-icons:arrow-right" />
                </button>
            </div>
        </div>
        <div class="flex justify-between mt-3 my-1">

            <!-- <div>
                <button class="w-20 h-7 m-1 rounded-md"
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
                <button class="w-20 h-7 m-1 rounded-md"
                    :class="{ 'bg-sky-400 text-white': isEditing || isDeleting, 'bg-gray-400': !isEditing && !isDeleting }"
                    @click="isEditing ? saveChanges() : deleteRows()" :disabled="!isEditing && !isDeleting"
                    v-if="isEditing || isDeleting">
                    <p>Guardar</p>
                </button>
                <button class="w-20 h-7 m-1 rounded-md"
                    :class="{ 'bg-sky-400 text-white': isEditing, 'bg-gray-400': !isEditing }" @click="createRow"
                    :disabled="!isEditing">
                    <p>Crear</p>
                </button>


            </div> -->


        </div>

    </div>
</template>

<script lang="ts">

interface ItemType {
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

interface ArtTarea {
    id: number | null;
    articuloId: number | null;
    articuloNombre: string | null;
    uniMedId: string | null;
    descripcion: string | null;
    heredaMed: boolean;
    cantidad: number;
    cantidadTotal: number;
    precioUnitario: number;
    precioTotal: number;
    tareaId: number | null;
}

import interact from 'interactjs';
import { ref, onMounted, watch } from 'vue';
import { format, parseISO } from 'date-fns';


export default {
    data() {
        return {
            headerRefs: [] as any[],
            cellRefs: [] as any[],
            currentPage: 1,
            perPage: 18,
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
                            console.log('event: ', event);
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

        createRow() {
            // Crear un nuevo objeto ArtTarea con campos vacíos
            const newRow = {
                id: 0,
                articuloId: 1,
                articuloNombre: '',
                uniMedId: 'mts',
                descripcion: '',
                heredaMed: false,
                cantidad: 0,
                cantidadTotal: 0,
                precioUnitario: 0,
                precioTotal: 0,
                tareaId: this.tareaId // establecer tareaId igual a la tareaId de la primera fila
            };
            this.consulta.push(newRow);
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

    setup(props, { emit }) {
        let consulta = ref<ArtTarea[]>([]);
        let open = ref(true);
        let selectedArtTarea = ref<ArtTarea | null>(null); // Nueva variable para almacenar el objeto ArtTarea seleccionado
        let fieldSettings: Ref<Campo[]> = ref([]);
        let isEditing = ref(false);  // Nuevo estado
        let isDeleting = ref(false);  // Nuevo estado
        let changedItems = ref<{ [key: string]: any }>({});
        let originalConsulta = ref([]);  // Nuevo estado
        let tableProp = new URL(props.rutaGet).pathname.split('/')[1]
        let tareaId = parseInt(new URL(props.rutaGet).pathname.split('/').pop() || '') || null;
        let deletedRows = ref<ItemType[]>([]);
        const showModalArticulos = ref(false)
        const selectedId = ref<number | null>(null);

        const recalculateTotal = (index: number) => {
            consulta.value[index].precioTotal = consulta.value[index].cantidad * consulta.value[index].precioUnitario;
        };

        // const recalculateCantidadTotal = (index: number) => {
        //     consulta.value[index].cantidadTotal = consulta.value[index].cantidad * props.medida;
        // };

        const totalPrecioTotal = computed(() => {
            return consulta.value.reduce((total, item) => total + (+item.precioTotal || 0), 0);
        });

        watch(totalPrecioTotal, (newTotalTotal) => {

            emit('update-total', newTotalTotal);
        });

        // Watcher para recalcular el precio total de un artículo cuando cambia la cantidad o el precio unitario
        // watch(consulta, (newValue, oldValue) => {
        //     newValue.forEach((item, index) => {
        //         watch([
        //             () => consulta.value[index].cantidad,
        //             () => consulta.value[index].precioUnitario],
        //             () => recalculateTotal(index));

        //         watch(() => consulta.value[index].cantidad, (newCantidad) => {
        //             if (consulta.value[index].heredaMed == true) {
        //                 recalculateCantidadTotal(index);
        //             }
        //         });

        //         watch(() => consulta.value[index].heredaMed, (newHeredaMed) => {
        //             if (newHeredaMed == true) {
        //                 recalculateCantidadTotal(index);
        //                 consulta.value[index].precioTotal = consulta.value[index].cantidadTotal * consulta.value[index].precioUnitario;
        //             } else {
        //                 consulta.value[index].cantidadTotal = 0;
        //                 consulta.value[index].precioTotal = consulta.value[index].cantidad * consulta.value[index].precioUnitario;
        //             }
        //         });


        //     });


        // }, { deep: true });

        const formatDate = (dateString: string) => {
            const date = parseISO(dateString);
            return format(date, 'dd-MM-yyyy');
        };

        // const formatPrice = (price: Number) => {
        //     return price.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', currencyDisplay: 'symbol' });
        // };

        async function refreshData() {
            // Recargar la consulta
            console.log('rutaGet: ', props.rutaGet);
            const response = await fetch(props.rutaGet);
            if (response.ok) {
                const contentType = response.headers.get("content-type");
                const camposResponse = await fetch(`http://localhost:3333/user_field_settings/table/art_tarea`);  // campos editables
                if (camposResponse.ok) {
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
                    console.log(tableProp); // Mostrar fieldSettings y sus campos
                } else {
                    console.error('HTTP-Error desde GRILLA: ' + camposResponse.status);
                }
                if (contentType && contentType.includes("application/json")) {
                    const data = await response.json();
                    consulta.value = data.map((item: { createdAt: string, updatedAt: string, heredaMed: number }) => ({
                        ...item,
                        createdAt: formatDate(item.createdAt),
                        updatedAt: formatDate(item.updatedAt),
                        heredaMed: item.heredaMed == 1 ? true : false,
                    }));
                } else {
                    console.error('HTTP-Error desde GRILLA: La respuesta no es un JSON válido');
                }
            } else {
                console.error('HTTP-Error desde GRILLA: ' + response.status);
            }

            // Limpiar la copia original de consulta
            isEditing.value = false;
            isDeleting.value = false;
        }

        onMounted(async () => {
            // Cargar la consulta
            refreshData();
        });

        // Función para seleccionar una fila
        const selectRow = (row: ArtTarea) => {
            if (showModalArticulos.value === false) {
                selectedArtTarea.value = row;
                console.log('Row selected: ', row.id);
            } else {
                console.log('Row selected: rota');
            }
        };

        // Función para eliminar una fila visualmente
        const deleteRowVisual = (rowToDelete: ArtTarea) => {
            const consultaCopy = [...consulta.value];
            const index = consultaCopy.findIndex(row => row.id === rowToDelete.id);
            if (index !== -1 && index < consultaCopy.length && consultaCopy[index]) {
                // Agregar la fila a deletedRows antes de eliminarla visualmente
                deletedRows.value.push({ id: consultaCopy[index].id as number });
                consulta.value = consulta.value.filter(row => row.id !== rowToDelete.id);
            }
        };

        // Función para eliminar una fila de la base de datos
        const deleteRows = async () => {
            console.log('deletedRows: ', deletedRows.value);

            for (let row of deletedRows.value) {
                console.log(`http://localhost:3333/${tableProp}/${row.id}`)
                const response = await fetch(`http://localhost:3333/${tableProp}/${row.id}`, {
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
            // Clear the deletedRows array after all rows have been deleted
            deletedRows.value = [];
            refreshData();
        };

        const updateRow = (newId: any) => {
            console.log('selectedArtTarea: ', selectedArtTarea.value, 'newId: ', newId);
            if (selectedArtTarea.value !== null && newId !== undefined) {
                selectedArtTarea.value.articuloId = newId.articuloId;
                selectedArtTarea.value.precioUnitario = newId.precio;
                selectedArtTarea.value.articuloNombre = newId.articuloNombre;
                selectedArtTarea.value.descripcion = newId.articuloDescripcion;
                selectedArtTarea.value.uniMedId = newId.articuloUniMed;
                console.log('selectedArtTarea.Articulo ID: ', selectedArtTarea.value.articuloId);
            } else {
                console.error('Error al actualizar el Articulo ID');
            }
        };

        // Función para activar o desactivar el modo de edición
        const toggleEdit = async () => {
            if (!isEditing.value) {
                originalConsulta.value = JSON.parse(JSON.stringify(consulta.value));

                await updateFieldSettings();
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


        // Función para actualizar el ancho de un campo en la base de datos
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
                    const response = await fetch(url, {
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
                const response = await fetch(`http://localhost:3333/${tableProp}/${id}`, {
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
                const response = await fetch(`http://localhost:3333/${tableProp}`, {
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

            // guardas totalPrecioTotal
            const responseTotal = await fetch(`http://localhost:3333/tareas/${consulta.value[0].tareaId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ precioTotal: totalPrecioTotal.value })
            });
            console.log('ruta preciioTotal: ', responseTotal.url);

            if (!responseTotal.ok) {
                console.error('Error al guardar totalPrecio en  la tareas: ', responseTotal.url);
            }
            console.log({ precioTotal: totalPrecioTotal })
            console.log(` ruta para totalPrecioTotal http://localhost:3333/tareas/${consulta.value[0].tareaId}`)
            for (let prop in itemsToUpdate) {
                delete itemsToUpdate[prop];
            }

            await updateFieldSettings();

            originalConsulta.value = [];
            console.log('rutaGet: ', props.rutaGet);

            // Recargar la consulta

            refreshData();
        };

        return {
            consulta,
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
            recalculateTotal,
            // recalculateCantidadTotal,
            totalPrecioTotal,
            showModalArticulos,
            updateRow,
            selectRow,
            selectedArtTarea,
            deleteRowVisual,
            // formatPrice,
        };
    }
};
</script>