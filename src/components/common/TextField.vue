<script setup>
import { VTextField } from "vuetify/components";

const emit = defineEmits(["update:modelValue"]);

const handleValue = (e) => {
  // console.log(e.target.value, "e");
  emit("update:modelValue", e.target.value);
};
</script>
<template>
  <VTextField v-bind="$attrs" @input="handleValue"></VTextField>
</template>

<!-- <VTextField v-model="props.modelValue" :label="props.label" :rules="[...props.rules]" :variant="props.variant" :density="props.density" :required="props.required"></VTextField> -->
