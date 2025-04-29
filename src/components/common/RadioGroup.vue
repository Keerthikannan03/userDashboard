<script setup>
// import { VRadioGroup, VRadio } from 'vuetify/components';
const props = defineProps({
  options: {
    type: Array,
    default: null,
  },
  radioLable: {
    type: String,
    default: null,
  },
});
</script>
<template>
  <VRadioGroup v-bind="$attrs" inline class="d-flex align-items-center">
    <p class="text-start ms-0 mb-0 text-grey">{{ props.radioLable }}:</p>
    <template v-for="option in props.options" :key="option">
      <VRadio :value="option.value" density="compact" class="me-2 small-radio">
        <template v-slot:label>
          <p class="text-start mb-0">{{ option.type }}</p>
        </template>
      </VRadio>
    </template>
  </VRadioGroup>
</template>
<style scoped>
:deep(.small-radio .v-selection-control__input) {
  transform: scale(0.8);
}
</style>
