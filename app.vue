<script setup lang="ts">
import LoggedLayout from './layouts/LoggedLayout.vue';
</script>


<template>
  <div>
    <LoggedLayout v-if="$route.name !== 'index'">
      <NuxtPage />
    </LoggedLayout>
    <NuxtPage v-else />
  </div>
</template>