<template>
    <div v-if="tareaId" class="flex flex-col p-2 rounded-lg">

        <!-- <h1 class="font-mono ">{{ tableProp }}</h1> -->
        <!--    <div class="flex flex-col my-3 py-5" v-if="consulta">
            <input
                class="rounded-md p-2 w-80 bg-gray-200 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text" placeholder="Buscar" />
        </div> -->
        <ModalArticuloArtTarea :fkPadre=tareaId :showModal="showModalArticulos"
            :rutaGet="'http://localhost:3333/lis_pre'" @close.native="showModalArticulos = false"
            @aceptar="updateRow" />
        <div class="flex flex-col" v-if="consulta && fieldSettings"
            :class="{ 'visible delay-150': open, 'invisible duration-150': !open }">

            <div
                class=" bg-slate-200 rounded-lg overflow-hidden overflow-x-auto w-full shadow-md border-2 border-slate-400">
                <table class="table-auto">
                    <thead>
                        <tr class="">
                            <th v-if="isEditing"></th> <!-- Cabecera adicional vacía -->
                            <th v-for="field in fieldSettings" :key="field.id" class="">
                                <div class="resizable border-r-2 hover:border-blue-500  my-1 px-0.5"
                                    :style="{ width: field.width + 'px', minWidth: field.type === 'search' ? '80px' : 'auto' }"
                                    :data-field-name="field.fieldName">
                                    <p class="truncate p-1">{{ field.tag }} {{ field.width }}</p>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in consulta" :key="index" @click="selectRow(item)">
                            <td v-if="isEditing">
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
                                            class="flex flex-grow focus:outline-none focus:border-blue-500 border px-2 py-1 rounded-md">
                                        <button @click="selectRow(item), showModalArticulos = true"
                                            :disabled="!isEditing"
                                            class="bg-blue-200 px-2 rounded items-center justify-center">
                                            <Icon name="simple-line-icons:magnifier" class="pb-1"></Icon>
                                        </button>
                                    </div>
                                    <input v-else class="flex flex-grow" :style="{ width: `50px` }"
                                        :type="field.type === 'check' ? 'checkbox' : field.type === 'number' ? 'number' : 'text'"
                                        :readonly="!field.isEditable || !isEditing"
                                        v-model="(item as any)[field.fieldName]"
                                        :class="{ 'bg-gray-300': !field.isEditable && isEditing, 'focus:outline-none focus:border-blue-500 border px-2 py-1 rounded-md': true }">
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="flex justify-between mt-3 my-1">
            <p class="text-lg font-bold">Total: ${{ totalPrecioTotal }}</p>

            <div>
                <button class="items-center w-20 h-7 rounded-md text-white"
                    :class="{ 'bg-red-400': isEditing, 'bg-sky-400': !isEditing }"
                    @click="isEditing ? cancelChanges() : toggleEdit()">
                    <p>{{ isEditing ? 'Cancelar' : 'Editar' }}</p>
                </button>
                <button class="w-20 h-7 m-1 rounded-md"
                    :class="{ 'bg-sky-400 text-white': isEditing, 'bg-gray-400': !isEditing }" @click="saveChanges()"
                    :disabled="!isEditing">
                    <p>Guardar</p>
                </button>
                <button class="w-20 h-7 m-1 rounded-md"
                    :class="{ 'bg-sky-400 text-white': isEditing, 'bg-gray-400': !isEditing }" @click="createRow"
                    :disabled="!isEditing">
                    <p>Crear</p>
                </button>

            </div>


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
    uniMedId: number | null;
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

export default {
    data() {
        return {
            headerRefs: [] as any[],
            cellRefs: [] as any[],
            // ...
        }
    },

    props: {
        rutaGet: {
            type: String,
            required: true,
        },
        medida: {
            type: Number,
            required: true,
        },
    },

    mounted() {
        interact('.resizable').resizable({
            edges: { left: false, right: true, bottom: false, top: false },
            listeners: {
                move: (event) => {
                    const { target, rect } = event;
                    target.style.width = `${rect.width}px`;

                    // Actualizar field.width
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
        });
    },

    methods: {
        isFieldEditable(fieldName: any) {
            return this.fieldSettings[fieldName];
        },

        createRow() {
            // Crear un nuevo objeto ArtTarea con campos vacíos
            const newRow = {
                id: 0,
                articuloId: 2,
                articuloNombre: '3',
                uniMedId: 4,
                descripcion: '5',
                heredaMed: false,
                cantidad: 0,
                cantidadTotal: 0,
                precioUnitario: 0,
                precioTotal: 0,
                tareaId: this.tareaId // establecer tareaId igual a la tareaId de la primera fila
            };
            this.consulta.push(newRow);
        },

        // async updateCampoWidth(fieldName: string, newWidth: number) {
        //     // Encuentra el campo específico en this.fieldSettings
        //     const field = this.fieldSettings.find(field => field.fieldName === fieldName);
        //     if (!field) {
        //         console.error(`No se encontró el campo ${fieldName} en this.fieldSettings`);
        //         return;
        //     }

        //     // Actualiza el ancho del campo
        //     field.width = newWidth;
        //     console.log('field.width: ', field.width);
        //     const url = `http://localhost:3333/user_field_settings/table/art_tarea`;

        //     const data = {
        //         width: field.width,
        //     };

        //     try {
        //         const response = await fetch(url, {
        //             method: 'PUT', // o 'PATCH'
        //             headers: {
        //                 'Content-Type': 'application/json',
        //             },
        //             body: JSON.stringify(data),
        //         });

        //         if (!response.ok) {
        //             throw new Error(`HTTP error! status: ${response.status}`);
        //         }

        //         console.log('Campo width updated successfully');
        //     } catch (error) {
        //         console.error('An error occurred while updating campo width:', error);
        //     }
        // },

    },

    setup(props, { emit }) {
        let consulta = ref<ArtTarea[]>([]);
        let open = ref(true);
        let selectedArtTarea = ref<ArtTarea | null>(null); // Nueva variable para almacenar el objeto ArtTarea seleccionado
        let fieldSettings: Ref<Campo[]> = ref([]);
        let isEditing = ref(false);  // Nuevo estado
        let changedItems = ref<{ [key: string]: any }>({});
        let originalConsulta = ref([]);  // Nuevo estado
        let tableProp = new URL(props.rutaGet).pathname.split('/')[1]
        let tareaId = parseInt(new URL(props.rutaGet).pathname.split('/').pop() || '') || null;
        let deletedRows = ref<ItemType[]>([]);
        const showModalArticulos = ref(false)
        const selectedId = ref<number | null>(null);


        const selectRow = (row: ArtTarea) => {
            if (showModalArticulos.value === false) { // Usar '===' en lugar de '='
                selectedArtTarea.value = row; // Usar selectedArtTarea sin 'this'
                console.log('Row selected: ', row.id);
            }
        };

        const deleteRowVisual = (rowToDelete: ArtTarea) => {
            const index = consulta.value.findIndex(row => row.id === rowToDelete.id);
            if (index !== -1) {
                consulta.value.splice(index, 1);
            }
        };

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
        };

        const updateRow = (newId: any) => {
            console.log('selectedArtTarea: ', selectedArtTarea.value, 'newId: ', newId);
            if (selectedArtTarea.value !== null && newId !== undefined) {
                selectedArtTarea.value.articuloId = newId.articuloId;
                selectedArtTarea.value.precioUnitario = newId.precio;
                selectedArtTarea.value.articuloNombre = newId.articuloNombre;
                selectedArtTarea.value.uniMedId = newId.articuloUniMed;
                console.log('selectedArtTarea.Articulo ID: ', selectedArtTarea.value.articuloId);
            } else {
                console.error('Error al actualizar el Articulo ID');
            }
        };

        const recalculateTotal = (index: number) => {
            consulta.value[index].precioTotal = consulta.value[index].cantidad * consulta.value[index].precioUnitario;
        };

        const recalculateCantidadTotal = (index: number) => {
            consulta.value[index].cantidadTotal = consulta.value[index].cantidad * props.medida;
        };

        const totalPrecioTotal = computed(() => {
            return consulta.value.reduce((total, item) => total + (+item.precioTotal || 0), 0);
        });

        watch(totalPrecioTotal, (newTotalTotal) => {
            console.log('newtotal: ' + newTotalTotal);
            emit('update-total', newTotalTotal);
        });


        watch(consulta, (newValue, oldValue) => {
            newValue.forEach((item, index) => {
                watch([
                    () => consulta.value[index].cantidad,
                    () => consulta.value[index].precioUnitario],
                    () => recalculateTotal(index));

                watch(() => consulta.value[index].cantidad, (newCantidad) => {
                    if (consulta.value[index].heredaMed == true) {
                        recalculateCantidadTotal(index);
                    }
                });

                watch(() => consulta.value[index].heredaMed, (newHeredaMed) => {
                    if (newHeredaMed == true) {
                        recalculateCantidadTotal(index);
                        consulta.value[index].precioTotal = consulta.value[index].cantidadTotal * consulta.value[index].precioUnitario;
                    } else {
                        consulta.value[index].cantidadTotal = 0;
                        consulta.value[index].precioTotal = consulta.value[index].cantidad * consulta.value[index].precioUnitario;
                    }
                });


            });


        }, { deep: true });


        onMounted(async () => {
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
                    consulta.value = data; // Asignar los datos directamente a consulta sin transformarlos
                } else {
                    console.error('HTTP-Error desde GRILLA: La respuesta no es un JSON válido');
                }
            } else {
                console.error('HTTP-Error desde GRILLA: ' + response.status);
            }
            console.log('fieldSettings: ', fieldSettings.value);
        });


        const toggleEdit = async () => {
            if (!isEditing.value) {
                originalConsulta.value = JSON.parse(JSON.stringify(consulta.value));

                // Aquí puedes llamar a updateCampoWidth con los valores que necesites
                // Asegúrate de reemplazar 'fieldName' y 'newWidth' con los valores correctos
                await updateFieldSettings();
            }
            isEditing.value = !isEditing.value;

            console.log(props.medida);
        };

        const updateFieldSettings = async () => {
            // Asegúrate de que fieldSettings.value contiene al menos un elemento
            if (fieldSettings.value.length === 0) {
                console.error('fieldSettings.value is empty');
                return;
            }

            // Usa el userId y tableName del primer elemento en fieldSettings.value
            const userId = fieldSettings.value[0].userId;
            const tableName = fieldSettings.value[0].tableName;

            // Crea la URL de tu API usando interpolación de cadenas
            const url = `http://localhost:3333/user_field_settings/${userId}/${tableName}`;
            console.log('url: ', url);

            try {
                // Haz una solicitud PUT o PATCH a tu API
                const response = await fetch(url, {
                    method: 'PUT', // o 'PATCH'
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(fieldSettings.value),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                console.log('Field settings updated successfully');
            } catch (error) {
                console.error('An error occurred while updating field settings:', error);
            }
        };

        const cancelChanges = () => {
            // Revertir los cambios reemplazando consulta.value con originalConsulta.value
            consulta.value = JSON.parse(JSON.stringify(originalConsulta.value));
            isEditing.value = !isEditing.value;
        };

        const saveChanges = async () => {
            const itemsToCreate: any[] = [];
            const itemsToUpdate: { [key: string]: any } = {};

            // Comparar consulta.value con originalConsulta.value
            if (consulta.value && originalConsulta.value) {
                consulta.value.forEach((item: any, index: any) => {
                    if (!originalConsulta.value[index]) {
                        console.log('Adding item to itemsToCreate: ', item);
                        itemsToCreate.push(item);
                        return;
                    }

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

            // Aquí es donde guardas totalPrecioTotal
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

            originalConsulta.value = [];
            console.log('rutaGet: ', props.rutaGet);

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
                    consulta.value = data; // Asignar los datos directamente a consulta sin transformarlos
                } else {
                    console.error('HTTP-Error desde GRILLA: La respuesta no es un JSON válido');
                }
            } else {
                console.error('HTTP-Error desde GRILLA: ' + response.status);
            }
            console.log('fieldSettings: ', fieldSettings.value);
            // Limpiar la copia original de consulta
            toggleEdit();
        };

        return {
            consulta,
            tareaId,
            open,
            fieldSettings,
            toggleEdit,
            cancelChanges,
            isEditing,
            saveChanges,
            tableProp,
            recalculateTotal,
            recalculateCantidadTotal,
            totalPrecioTotal,
            showModalArticulos,
            updateRow,
            selectRow,
            selectedArtTarea,
            deleteRowVisual,
        };
    }
};
</script>