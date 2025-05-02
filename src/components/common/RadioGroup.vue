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
  <VRadioGroup v-bind="$attrs" inline>
    <div class="d-flex align-items-center">
      <label class="text-start ms-0 mb-0">{{ props.radioLable }}:</label>
      <template v-for="option in props.options" :key="option">
        <VRadio :value="option.value" density="compact" class="me-2 small-radio">
          <template v-slot:label>
            <label class="text-start mb-0 text-dark">{{ option.type }}</label>
          </template>
        </VRadio>
      </template>
    </div>
  </VRadioGroup>
</template>
<style scoped>
label {
  font-size: 12px;
  font-weight: 500;
  color: grey;
}
:deep(.small-radio .v-selection-control__input) {
  transform: scale(0.8);
}
</style>
