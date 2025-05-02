<script setup>
import { ref, watch } from "vue";
// import VDateInput from 'vuetify/components';
import { useDate } from "vuetify";
import dayjs from "dayjs";

const dateAdapter = useDate();
const props = defineProps({
  modelValue: {
    type: Date,
    default: null,
  },
});
const emit = defineEmits(["update-dateValue"]);

const isMenuOpen = ref(false);
const selectDate = ref("");
const selectedDate = ref(null);

watch(selectDate, (newVal) => {
  let getDate = dateAdapter.toISO(newVal);
  let formatDate = dayjs(getDate).format("DD/MM/YYYY");
  selectedDate.value = formatDate;
  emit("update-dateValue", newVal);
});
</script>

<template>
  <VMenu v-model="isMenuOpen" :close-on-content-click="true">
    <template v-slot:activator="{ props }">
      <label v-bind="$attrs">{{ $attrs.label }}</label>
      <VTextField v-model="selectedDate" v-bind="{ ...$attrs, ...props }" :label="false"></VTextField>
    </template>
    <VDatePicker
      v-model="selectDate"
      :min="new Date(new Date().getFullYear() - 10)"
      hide-header
      :show-adjacent-months="true" 
    ></VDatePicker>
  </VMenu>
</template>
<style scoped>
  label{
    font-size: 12px;
    font-weight: 500;
    color: grey;
  }
  .v-input input::placeholder{
    font-size: 14px !important;
  }
</style>
