<template>
    <div class="flex flex-col p-2 rounded-lg">
        <!-- <h1 class="font-mono ">{{ tableProp }}</h1> -->
        <!--    <div class="flex flex-col my-3 py-5" v-if="consulta">
            <input
                class="rounded-md p-2 w-80 bg-gray-200 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text" placeholder="Buscar" />
        </div> -->
        <div class="flex flex-col" v-if="consulta"
            :class="{ 'visible delay-150': open, 'invisible duration-150': !open }">

            <div :class="{ 'bg-slate-200': isEditing, 'border-slate-400': !isEditing }"
                class="rounded-lg overflow-hidden overflow-x-auto w-full shadow-md border-2 border-slate-400">
                <table class="table-auto ">
                    <thead class="">
                        <tr>
                            <th v-for=" (value, key) in consulta[0]" :key="key" class="p-2 bg-slate-300 ">{{ key
                                }}</th>
                        </tr>
                    </thead>
                    <tbody v-if="editableFields" class="p-2" :class="{ ' border-green-500': isEditing }">
                        <tr v-for="(item, index) in consulta" :key="index" @click="selectedRow = index"
                            class="p-2 m-1 border-b"
                            :class="{ ' border-slate-400': selectedRow === index && isEditing, 'border-transparent': !isEditing }">
                            <td v-for="(value, key) in item" :key="key" class="p-1">
                                <input :readonly="!isFieldEditable(key) || !isEditing" v-model="item[key]"
                                    :class="{ ' bg-gray-300': !isFieldEditable(key) && isEditing }"
                                    class=" focus:outline-none focus:border-blue-500 border px-2 py-1 rounded-md">
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="flex justify-between mt-3 my-1">
            <p class="text-lg font-bold">Total: ${{ totalPrecioTotal }}</p>

            <div>
                <button class="items-center w-20 h-7  rounded-md text-white"
                    :class="{ 'bg-red-400': isEditing, 'bg-sky-400': !isEditing }" @click="toggleEdit()">
                    <p>{{ isEditing ? 'Cancelar' : 'Editar' }}</p>
                </button>
                <button class="w-20 h-7 m-1 rounded-md"
                    :class="{ 'bg-sky-400 text-white': isEditing, 'bg-gray-400': !isEditing }" @click="saveChanges()"
                    :disabled="!isEditing">
                    <p>Guardar</p>
                </button>

            </div>


        </div>

    </div>
</template>

<script lang="ts">

interface ArtTarea {
    id: number;
    articuloId: number;
    articuloNombre: string | null;
    uniMedId: number | null;
    descripcion: string | null;
    heredaMed: boolean;
    cantidad: number;
    cantidadTotal: number;
    precioUnitario: number;
    precioTotal: number;
    tareaId: number;
}

import { ref, onMounted, watch } from 'vue';

export default {
    data() {
        return {
            selectedRow: null as number | null,
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


    methods: {
        isFieldEditable(fieldName: any) {
            return this.editableFields[fieldName];
        },
    },

    setup(props, { emit }) {
        let consulta = ref<ArtTarea[]>([]);
        let open = ref(true);
        let editableFields = ref([]);
        let isEditing = ref(false);  // Nuevo estado
        let changedItems = ref<{ [key: string]: any }>({});
        let originalConsulta = ref([]);  // Nuevo estado
        let tableProp = new URL(props.rutaGet).pathname.split('/')[1]

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
            console.log('ruta: ', props.rutaGet);
            const response = await fetch(props.rutaGet);
            if (response.ok) {
                const contentType = response.headers.get("content-type");
                // let tableProp = new URL(props.rutaGet).pathname.split('/')[1]
                const camposResponse = await fetch(`http://localhost:3333/editables/${tableProp}`);  // campos editables
                if (camposResponse.ok) {
                    const campos = await camposResponse.json();
                    editableFields.value = campos;
                } else {
                    console.error('HTTP-Error desde GRILLA: ' + camposResponse.status);
                }
                if (contentType && contentType.includes("application/json")) {
                    const data = await response.json();
                    consulta.value = data;
                } else {
                    console.error('HTTP-Error desde GRILLA: La respuesta no es un JSON válido');
                }
            } else {
                console.error('HTTP-Error desde GRILLA: ' + response.status);
            }

        });


        const toggleEdit = () => {
            if (!isEditing.value) {
                originalConsulta.value = JSON.parse(JSON.stringify(consulta.value));
            }
            isEditing.value = !isEditing.value;

            console.log(props.medida);
        };

        const saveChanges = async () => {
            if (consulta.value && originalConsulta.value) {
                consulta.value.forEach((item: any, index: any) => {
                    if (!originalConsulta.value[index]) {
                        return;
                    }

                    Object.keys(item).forEach(key => {
                        if (JSON.stringify(item[key]) !== JSON.stringify(originalConsulta.value[index][key])) {
                            console.log(`ID: ${item.id}, consulta.value: ${JSON.stringify(item[key])}, originalConsulta.value: ${JSON.stringify(originalConsulta.value[index][key])}`);
                            changedItems.value[item.id] = item;
                        }
                    });
                });
            }

            for (let id in changedItems.value) {
                console.log('id: ', id, 'changedItems: ', changedItems.value[id]);
                const item = changedItems.value[id];
                const response = await fetch(`http://localhost:3333/${tableProp}/${id}`, {
                    method: 'PUT', // Aquí es donde especificas el método PUT
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(item)
                });

                if (!response.ok) {
                    console.error('Error al guardar los cambios: ', response.url);
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
            changedItems.value = {};
            originalConsulta.value = [];  // Limpiar la copia original de consulta
            toggleEdit();
        };

        return {
            consulta,
            open,
            editableFields,
            toggleEdit,
            isEditing,
            saveChanges,
            tableProp,
            recalculateTotal,
            recalculateCantidadTotal,
            totalPrecioTotal
        };
    }
};
</script>