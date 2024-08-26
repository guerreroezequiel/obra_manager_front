<template>
  <div>
    <LoggedLayout v-if="isLoggedIn">

      <NuxtPage />
    </LoggedLayout>
    <NuxtPage v-else />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useNuxtApp } from '#app';
import LoggedLayout from './layouts/LoggedLayout.vue';

// Obtener el estado de autenticación
const { $auth } = useNuxtApp();


// Crear una propiedad computada para verificar si el usuario está logueado
const isLoggedIn = computed(() => $auth.getToken());

</script>