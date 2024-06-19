<script setup lang="ts">
import LoggedLayout from './layouts/loggedLayout.vue';
</script>


<template>
  <LoggedLayout v-if="$route.name !== 'index'">
    <NuxtPage />
  </LoggedLayout>
</template>