<script setup>
import { storeToRefs } from 'pinia';
import toasterStore from '../../store/toasterStore.js';

  const useToaster = toasterStore();
  const { toasterStatus, toasterMsg, toasterType, toasterColor, duration, position, toastIcon} = storeToRefs(useToaster);

</script>
<template>
  <v-snackbar v-model="toasterStatus" :timeout="duration" :location="position" :color="toasterColor">
    <p class="text-center text-capitalize mb-0">
      <strong class="me-1">{{ toasterMsg}}</strong>
      <v-icon size="16">{{ toastIcon }}</v-icon>
    </p>
  </v-snackbar>
</template>
