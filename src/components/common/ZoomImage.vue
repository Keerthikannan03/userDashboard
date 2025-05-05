<script setup>
import { ref, watch } from 'vue';
import { VDialog } from "vuetify/components";
import { ZoomImg } from 'vue3-zoomer';
import CardCompo from './CardCompo.vue';

const props = defineProps({
  userData: {
    type: Object,
    default: () => ({}),
  },
  deleteType: {
    type: String,
    default:''
  }
});
const emit = defineEmits(['close-dialog']);

const formData = ref({});
const titleData = ref('');
const subtitle = ref('');
const titleImage = ref('');


watch(
  () => props.userData,
  (newUser) => {
    if (newUser) {
        formData.value = newUser;
        titleData.value = formData.value.firstName ? formData.value.firstName + '' + formData.value.lastName : formData.value.title;
      subtitle.value = formData.value.email ? formData.value.email : formData.value.description;
      titleImage.value = formData.value.image ? formData.value.image : formData.value.images ? formData.value.images[0] : null;
    }
  },
  { immediate: true }
);
</script>

<template>
  <VDialog v-bind="$attrs">
    <CardCompo width="500px" class="rounded-xl pa-2 mx-auto bg-black">
      <!-- <v-overlay v-model="imageDialog" class="mx-auto"> -->
      <v-btn
        icon="mdi-close"
        @click="emit('close-dialog')"
        density="compact"
        rounded="pill"
        class="text-dark float-end ms-auto mt-1 me-1"
      ></v-btn>
      <div class="pa-4 zoom-image">
        <ZoomImg
          :src="formData.image || image || defaultImage"
          class="h-[30rem]"
          style="object-fit: contain"
        >
          <template #loading>
            <div style="width: 400px !important">
              <p class="text-center">Loading...</p>
            </div>
          </template>
        </ZoomImg>
        <!-- <v-img :src="formData.image || image || defaultImage" width="200px" class="mx-auto"></v-img> -->
      </div>
      <!-- </v-overlay> -->
    </CardCompo>
  </VDialog>
</template>
