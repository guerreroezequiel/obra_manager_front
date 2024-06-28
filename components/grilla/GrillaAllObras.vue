<template>
    <div class="flex flex-col p-2 rounded-lg">
        <div class="flex flex-col" v-if="consulta"
            :class="{ 'visible delay-150': open, 'invisible duration-150': !open }">

            <div :class="{ 'border-sky-500': isEditing, 'border-slate-400': !isEditing }"
                class="rounded-lg overflow-hidden overflow-x-auto w-full shadow-md border-2">
                <table class="table-auto ">
                    <thead class="">
                        <tr>
                            <th v-for=" (value, key) in consulta[0]" :key="key" class="p-2 bg-slate-300 ">{{ key }}</th>
                        </tr>
                    </thead>
                    <tbody v-if="editableFields" class="p-3" :class="{ ' border-green-500': isEditing }">
                        <tr v-for="(item, index) in consulta" :key="index">
                            <td v-for="(value, key) in item" :key="key">
                                <input :readonly="!isFieldEditable(key) || !isEditing" v-model="item[key]"
                                    :class="{ ' bg-gray-300': !isFieldEditable(key) && isEditing }"
                                    class=" focus:outline-none focus:border-blue-500 border px-2 py-1 rounded-md">
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="flex justify-end mt-3">
            <button class="items-center w-20 h-7 m-1 rounded-md text-white"
                :class="{ 'bg-red-400': isEditing, 'bg-sky-400': !isEditing }" @click=" toggleEdit()">
                <p>{{ isEditing ? 'Cancelar' : 'Editar' }}</p>
            </button>
            <button class="w-20 h-7 m-1 rounded-md"
                :class="{ 'bg-sky-400 text-white': isEditing, 'bg-gray-400': !isEditing }" @click="saveChanges()"
                :disabled="!isEditing">
                <p>Guardar</p>
            </button>
        </div>

    </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';

export default {
    props: {
        rutaGet: {
            type: String,
            required: true,
        },
    },

    methods: {
        isFieldEditable(fieldName: any) {
            return this.editableFields[fieldName];
        },
    },

    setup(props) {
        let consulta = ref([]);
        let open = ref(true);
        let editableFields = ref([]);
        let isEditing = ref(false);  // Nuevo estado
        let changedItems = ref<{ [key: string]: any }>({});
        let originalConsulta = ref([]);  // Nuevo estado
        let tableProp = new URL(props.rutaGet).pathname.split('/')[1]

        onMounted(async () => {

            const response = await fetch(props.rutaGet);
            if (response.ok) {
                const contentType = response.headers.get("content-type");
                const camposResponse = await fetch(`http://localhost:3333/editables/${tableProp}`);  // campos editables
                if (camposResponse.ok) {
                    const camposContentType = camposResponse.headers.get("content-type");
                    if (camposContentType && camposContentType.includes("application/json")) {
                        const campos = await camposResponse.json();
                        editableFields.value = campos;
                        console.log(camposContentType);
                    } else {
                        console.error('HTTP-Error desde GRILLA: La respuesta no es un JSON válido');
                    }
                } else {
                    console.error('HTTP-Error desde GRILLA: ' + camposResponse.status);
                }
                if (contentType && contentType.includes("application/json")) {
                    const data = await response.json();
                    consulta.value = data;
                } else {
                    console.error('HTTP-Error desde GRILLA ALL OBRAS: La respuesta no es un JSON válido' + response.status);
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
            tableProp  // Return tableProp
        };
    }
};
</script>