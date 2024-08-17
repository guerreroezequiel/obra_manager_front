<template>
  <div>
    <LoggedLayout v-if="$route.name !== 'presupuesto'">
      <NuxtPage />
    </LoggedLayout>
    <NuxtPage v-else />
  </div>
</template>

<script setup lang="ts">
import LoggedLayout from './layouts/LoggedLayout.vue';
</script>