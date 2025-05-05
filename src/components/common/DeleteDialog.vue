<script setup>
import { ref, watch } from "vue";
import callApi from "../utils/storeApi.js"
import { VCard, VDialog } from "vuetify/components";
import toasterStore from "../../store/toasterStore.js";
import accountImg from "../../assets/accountImg.jpeg";
import CardCompo from "./CardCompo.vue";

const {manageStore} = toasterStore();
const emit = defineEmits(["close-dialog"]);
// const form = ref();
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

function closeUserform() {
  emit("close-dialog");
}

const formData = ref({});
const loading = ref(false);
const titleData = ref('');
const subtitle = ref('');
const titleImage = ref('');
const propsDataType = ref('');
const defaultImage = accountImg;

const deleteUser = (uid) =>{
  loading.value = true;
  let type = propsDataType.value == 'user' ? 'user' : 'product';
  let url = propsDataType.value == 'user' ? `/users/${uid}` : `/products/${uid}`;

  callApi(url, {method: "delete"})
  .then((res)=>{
    loading.value = false;
    closeUserform();
    manageStore(res, type);
  })
  .catch((err)=>{
    loading.value = false;
    closeUserform();
    manageStore(err, type);
    // console.log(err,'error');
  })
}

watch(
  () => props.userData,
  (newUser) => {
    if (newUser) {
      formData.value = newUser;
    //   console.log(formData.value);
      
      titleData.value = formData.value.firstName ? formData.value.firstName + '' + formData.value.lastName : formData.value.title;
      subtitle.value = formData.value.email ? formData.value.email : formData.value.description;
      titleImage.value = formData.value.image ? formData.value.image : formData.value.images ? formData.value.images[0] : null;
    }
},
{ immediate: true }
);

watch(()=>props.deleteType, (newVal)=>{
    if(newVal){
          propsDataType.value = newVal;
    }
},{ immediate: true });
</script>
<template>
  <VDialog v-bind="$attrs">
    <CardCompo max-width="500px" width="auto">
      <v-list class="pt-0 form-header">
        <v-list-item
          class="px-2"
          :title="titleData"
          :subtitle="subtitle"
        >
          <template v-slot:prepend>
            <v-avatar class="cursor-pointer border-1 border-dark p-1" size="50">
              <v-img :src="titleImage || defaultImage" />
            </v-avatar>
          </template>
        </v-list-item>
      </v-list>

      <div class="mt-3">
        <v-card-text class="py-0">
          Are you sure you want to delete this {{propsDataType}}?
        </v-card-text>
        <v-card-actions class="justify-content-between">
          <v-btn @click="closeUserform()" density="compact">Cancel</v-btn>
          <v-btn
            @click="deleteUser(props.userData.id)"
            :loading="loading"
            density="compact"
            color="danger"
            >Delete</v-btn
          >
        </v-card-actions>
      </div>
    </CardCompo>
  </VDialog>
</template>

<style scoped>
    .form-header{
  background: #c1c1c12b;
  border-bottom: 1px solid #8080805e;
}

.v-list.form-header{
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}
</style>
