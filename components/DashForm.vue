<template>
    <form class="flex flex-col w-1/3 bg-slate-300 p-5 m-5 rounded-md justify-center" @submit.prevent="submitForm">
        <div class="flex flex-col " v-for="field in obraModelSchema" :key="field.Field">
            <label class="flex p-2 w-1/3" :for="field.Field">{{ field.Field }}></label>
            <input class="flex m-2 p-1 right-0 rounded-md" :id="field.Field" v-model="formData[field.Field]"
                :type="(field.Type)" />
        </div>
        <button type="submit">Submit</button>
    </form>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
    setup() {
        let obraModelSchema = ref([]);
        let formData = ref({});

        onMounted(async () => {
            const response = await fetch('http://localhost:3333/models/obra');
            if (response.ok) {
                const data = await response.json();
                obraModelSchema.value = data.obraModelSchema;

                // Inicializa formData basado en obraModelSchema
                obraModelSchema.value.forEach(field => {
                    formData.value[field.Field] = null;
                });
            } else {
                console.error('HTTP-Error: ' + response.status);
            }
        });

        const submitForm = () => {
            // Aquí deberías manejar el envío del formulario
        };

        return {
            obraModelSchema,
            formData,
            submitForm,
        };
    },
};
</script>
