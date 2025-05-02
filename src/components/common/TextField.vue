<script setup>
import { VTextField } from "vuetify/components";

const emit = defineEmits(["update:modelValue"]);

const handleValue = (e) => {
  // console.log(e.target.value, "e");
  emit("update:modelValue", e.target.value);
};
</script>
<template>
  <!-- <div> -->
  <label v-bind="$attrs">{{ $attrs.label }}</label>
  <VTextField v-bind="$attrs" :label="undefined" @input="handleValue" variant="outlined" rounded="lg" class="text-field"></VTextField>
  <!-- </div> -->
<!-- <VTextField v-model="props.modelValue" :label="props.label" :rules="[...props.rules]" :variant="props.variant" :density="props.density" :required="props.required"></VTextField> -->
</template>
<style scoped>
  label{
    font-size: 12px;
    font-weight: 500;
    color: grey;
  }
  .text-field ::placeholder{
    font-size: 14px !important;
  }
  :deep(.v-input__details){
    min-height: 14px !important;
  }
</style>

