<template>
    <div class="flex flex-col my-5 p-5 bg-stone-500 rounded-lg">
        <h1 class="font-mono ">{{ table }}</h1>
        <div class="flex flex-col my-3 py-5" v-if="consulta">
            <input
                class="rounded-md p-2 w-80 bg-gray-200 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text" placeholder="Buscar" />
        </div>
        <div class="flex" v-if="consulta" :class="{ 'visible delay-150': open, 'invisible duration-150': !open }">
            <div class="rounded-lg overflow-hidden overflow-x-auto w-full">
                <table class="table-auto ">
                    <thead class="">
                        <tr>
                            <th v-for=" (value, key) in consulta[0]" :key="key" class="p-2 bg-slate-300 ">{{ key
                                }}</th>
                        </tr>
                    </thead>
                    <tbody class="p-3" :class="{ ' border-green-500': isEditing }">
                        <tr v-for="(item, index) in consulta" :key="index">
                            <td v-for="(value, key) in item" :key="key" class=" "
                                :class="{ 'border-cyan-600': isEditing && isFieldEditable(key), 'bg-slate-100': isFieldEditable(key), 'bg-slate-300': !isFieldEditable(key) }">
                                <input v-model="item[key]" :readonly="!isEditing || !isFieldEditable(key)"
                                    class="bg-transparent focus:outline-none focus:border-blue-500 border px-4 py-2 rounded-md">
                                <slot />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="flex justify-end right-0 mt-3">
            <button class=" w-20 h-7 m-1 rounded-md " :class="{ 'bg-red-300': isEditing, 'bg-blue-300': !isEditing }"
                @click=" toggleEdit()">
                {{ isEditing ? 'Cancelar' : 'Editar' }}
            </button>
            <button class="w-20 h-7 m-1 rounded-md" :class="{ 'bg-green-300': isEditing, 'bg-gray-300': !isEditing }"
                @click="saveChanges()" :disabled="!isEditing">
                Guardar
            </button>
        </div>

    </div>
</template>

<script lag="ts">
import { ref, onMounted } from 'vue';

export default {
    props: {
        table: {
            type: String,
            default: 'articulos' // Valor por defecto para la prop 'url'
        },
        rutaGet: {
            type: String,
            default: 'articulos'
        },

    },
    setup(props) {
        let consulta = ref(null);
        let open = ref(true);
        let modelSchema = ref(null);
        let editableFields = ref({});  // Nuevo estado
        let isEditing = ref(false);  // Nuevo estado
        let changedItems = ref({});
        let originalConsulta = ref(null);  // Nuevo estado

        onMounted(async () => {
            console.log('ruta: ', props.rutaGet);
            const response = await fetch(props.rutaGet);
            if (response.ok) {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const data = await response.json();
                    consulta.value = data;
                } else {
                    console.error('HTTP-Error desde GRILLA: La respuesta no es un JSON válido');
                }
            } else {
                console.error('HTTP-Error desde GRILLA: ' + response.status);
            }

            const modelResponse = await fetch('http://localhost:3333/models/' + props.table);
            if (modelResponse.ok) {
                const jsonResponse = await modelResponse.json();
                modelSchema.value = jsonResponse.articulosModelSchema;

                // Inicializar editableFields
                jsonResponse.articulosModelSchema.forEach(field => {
                    editableFields.value[field.Field] = false;
                });
            } else {
                console.error('HTTP-Error: ' + modelResponse.status);
            }
        });

        // chequea editables
        const isFieldEditable = (key) => {
            const result = modelSchema.value?.find(field => field.Field === key)?.editable;
            return Boolean(result);
        };

        const toggleEdit = () => {
            if (!isEditing.value) {
                originalConsulta.value = JSON.parse(JSON.stringify(consulta.value));
            }
            isEditing.value = !isEditing.value;
        };

        const saveChanges = async () => {
            consulta.value.forEach((item, index) => {
                if (!originalConsulta.value[index]) {
                    return;
                }

                Object.keys(item).forEach(key => {
                    if (JSON.stringify(item[key]) !== JSON.stringify(originalConsulta.value[index][key])) {
                        changedItems.value[item.id] = item;
                    }
                });
            });

            for (let id in changedItems.value) {
                const item = changedItems.value[id];
                const response = await fetch(`http://localhost:3333/articulos/${id}`, {
                    method: 'PUT', // Aquí es donde especificas el método PUT
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(item)
                });

                if (!response.ok) {
                    console.error('Error al guardar los cambios: ', response.status);
                }
            }

            changedItems.value = {};
            originalConsulta.value = null;  // Limpiar la copia original de consulta
            toggleEdit();
        };

        return {
            consulta,
            open,
            editableFields,
            toggleEdit,
            isEditing,
            isFieldEditable,
            saveChanges
        };
    }
};
</script>