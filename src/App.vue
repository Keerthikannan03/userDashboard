<script setup>
  import Toasters from "./components/common/toasters.vue";
</script>
<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
    <Toasters />
  </v-app>
</template>
