<template>
    <div class="flex flex-col h-screen pt-10 bg-orange-100 duration-300">

        <div class="flex flex-col my-3 p-5" v-if="consulta">
            <input
                class="rounded-md p-2 w-80 bg-gray-200 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text" placeholder="Buscar" />
        </div>
        <div class="mx-5 flex" v-if="consulta" :class="{ 'visible delay-150': open, 'invisible duration-150': !open }">
            <div class="overflow-x-auto w-full">
                <table class="table-auto">
                    <thead>
                        <tr>
                            <th v-for=" (value, key) in consulta[0]" :key="key" class="px-4 py-2">{{ key }}</th>
                        </tr>
                    </thead>
                    <tbody :class="{ ' border-green-500': isEditing }">
                        <tr v-for="(item, index) in consulta" :key="index">
                            <td v-for="(value, key) in item" :key="key" class="border-spacing-0 outline-2 "
                                :class="{ 'border-cyan-600': isEditing && isFieldEditable(key), 'bg-slate-100': isFieldEditable(key), 'bg-slate-300': !isFieldEditable(key) }">
                                <input v-model="item[key]" :readonly="!isEditing || !isFieldEditable(key)"
                                    class="bg-transparent focus:outline-none focus:border-blue-500 border px-4 py-2 rounded-sm">
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <button class="mt-7 bg-cyan-600 w-20 h-7" @click="toggleEdit()">
            {{ isEditing ? 'Cancelar' : 'Editar' }}
        </button>
        <button class="mt-7 bg-cyan-600 w-20 h-7" @click="saveChanges()">
            Guardar
        </button>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
    props: {
        url: {
            type: String,
            default: 'http://localhost:3333/articulos' // Valor por defecto para la prop 'url'
        }
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
            const response = await fetch(props.url);
            if (response.ok) {
                const data = await response.json();
                consulta.value = data;
            } else {
                console.error('HTTP-Error: ' + response.status);
            }

            const modelResponse = await fetch('http://localhost:3333/models/articulo');
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