<script setup>
import { ref, reactive, watch } from "vue";
import { VDateInput } from "vuetify/labs/VDateInput";
import accountImg from "../../assets/accountImg.jpeg";
import callApi from "../utils/storeApi";
// import toasterCall from "../common/toasters.vue";
import toasterStore from "../../store/toasterStore.js";
// import { storeToRefs } from "pinia";
import TextField from '../../components/common/TextField.vue';
import RadioGroup from '../../components/common/RadioGroup.vue';
import DatePicker from "../common/DatePicker.vue";
import { ZoomImg } from "vue3-zoomer";

const emit = defineEmits(["close-dialog"]);
const form = ref();
const props = defineProps({
  userData: {
    type: Object,
    default: () => ({}),
  },
});

const { manageStore } = toasterStore();
// const useToaster = storeToRefs(manageStore)

const isChanged = ref(null);
const loading = ref(false);
const errorStatus = ref(false);

const valid = ref(false);
const validRules = [(v) => !!v || "Field is required"];
const emailRules = [
  (v) => !!v || "E-mail is required",
  (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
];
const phoneRules = [(v) => !!v || "Phone number is required"];
const nameRules = ref([
  (v) => !!v || "Name is required",
  (v) => (v && v.length <= 10) || "Name must be 10 characters or less",
]);

// Testing comment 

const formData = reactive({
  firstName: '',
  lastName: "",
  email: "",
  phone: null,
  birthDate: null,
  gender: "male",
  image: "",
  checkbox: false,
});

const radioLable = 'Gender';
const itemList = [
  {
    type:'Male',
    value:'male',
  },
  {
    type:'Female',
    value:'female',
  },
  {
    type:'Others',
    value:'others',
  },
];

const image = ref(null);
const imageDialog = ref(false);

function createBase64Image(fileObject) {
  const reader = new FileReader();

  // console.log(reader, "imageimage...1");
  // console.log(fileObject, "imageimage...2");
  reader.onload = (e) => {
    console.log(e.target.result);
    formData.image = e.target.result;
  };
  reader.readAsDataURL(fileObject);
}

function onFileChange() {
  // imageUrl.value = URL.createObjectURL(formData.image);
  console.log(image.value);
  createBase64Image(image.value);
  // imageDialog.value = true;
}

function filterEvent(event) {
  const key = event.key;
  // console.log(event, "eventevent");

  if (!/^\d$/.test(key)) {
    event.preventDefault();
  }
}

const fileInput = ref(null);
const defaultImage = accountImg;
const propsDataType = ref('')

function triggerFileInput() {
  // console.log(fileInput, "asdasdasfileInput");
  // if(formData.image == defaultImage || image == defaultImage){
    fileInput.value?.$el?.querySelector("input")?.click();
  // }else{
  //   imageDialog.value = true;
  // }
}

function clearForm() {
  form.value.reset();
  formData.gender = "male";
}

function closeUserform() {
  emit("close-dialog");
}

async function addUser() {
  console.log(valid.value, "asdasdasdvalid");
  loading.value = true;
  if (valid) {
    console.log("User data:", formData);
    // return
    let url = "/users/add";
    await callApi(url, {payload: formData, method: "POST"})
      .then((response) => {
        console.log(response, "responseresponse");
        loading.value = false;
        form.value.reset();
        closeUserform();
        manageStore(response, 'user');
      })
      .catch((error) => {
        console.log(error, "errorerror");
        loading.value = false;
        closeUserform();
        manageStore(error, 'user');
      });
  } else {
    console.log("Form is invalid");
  }
}

const editUser = async(userId, data) =>{
  loading.value = true;

  let url = `/users/${userId}`;

  await callApi(url, {payload: data, method: "PUT"})
  .then((res)=>{
    loading.value = false;
    closeUserform();
    manageStore(res, 'user');
  })
  .catch((err)=>{
    loading.value = false;
    closeUserform();
    manageStore(err, 'user');
    Object.assign(formData,props.userData);
  })
}

function deleteUser(userid){
  loading.value = true;
  let url = `/users/${userid}`;

  callApi(url, {method: "delete"})
  .then((res)=>{
    loading.value = false;
    closeUserform();
    manageStore(res, 'user');
  })
  .catch((err)=>{
    errorStatus.value = "Something went wrong";
    loading.value = false;
    closeUserform();
    manageStore(err, 'user');
    // console.log(err,'error');
  })
}

watch(
  () => props.userData,
  (newUser) => {
    console.log(newUser, "newValue");
    if(newUser) {
      propsDataType.value = newUser?.type;
    }

    if (newUser) {
      Object.assign(formData, newUser);
      image.value = newUser.image;
    }
  },
  { immediate: true }
);

watch(
  () => formData,
  (newValue) => {
    if (newValue && !props.userData) {
        Object.assign(formData, newValue);
    }
    if (newValue && props.userData) {
      isChanged.value = Object.keys(props.userData).some(key=> props.userData[key] !== newValue[key]);
      console.log(isChanged.value, "isChanged");
    }
  },
  { deep: true }
);
</script>

<template>
  <v-card max-width="500px" width="auto" class="p-1" rounded="xl">
    <v-form ref="form" v-model="valid" lazy-validation>
      <div class="position-relative d-flex justify-content-between py-2 px-1 form-title-head" v-if="propsDataType !=='delete'">
        <span></span>
        <h4 class="m-0">{{ !props.userData ? "Add" : "Edit" }} User</h4>
            <v-btn
              icon="mdi-close"
              @click="closeUserform()"
              density="compact"
              rounded="pill"
              class="text-dark"
            ></v-btn>
      </div>
        <div class="position-relative">
          <v-list v-if="propsDataType == 'delete'" class="pt-0 form-header">
            <v-list-item
                class="px-0"
                :title="formData.firstName + '' + formData.lastName"
                :subtitle="formData.email"
              >
              <template v-slot:prepend>
                <v-avatar
                class="cursor-pointer"
                size="50"
                color="primary"
              >
                <v-img :src="formData.image || defaultImage" />
                <v-icon
                  icon="mdi-camera"
                  v-if="!formData.image"
                  color="black"
                  class="avatar-icon"
                ></v-icon>
              </v-avatar>
              </template>
            </v-list-item>
          </v-list>

          <div v-if="propsDataType == 'delete'" class="mt-3">
            <v-card-text class="py-0">
              Are you sure you want to delete this user?
            </v-card-text>
            <v-card-actions class="justify-content-between">
              <v-btn @click="closeUserform()" density="compact">Cancel</v-btn>
              <v-btn @click="deleteUser(props.userData.id)" :loading="loading" density="compact" color="danger">Delete</v-btn>
            </v-card-actions>
          </div>

          <div v-if="propsDataType !=='delete'" class="px-2 py-2 ga-5 d-flex justify-content-between align-items-center form-header">
            <span class="col-2"></span>
            <v-avatar class="col-md-4 cursor-pointer border border-secondary z-3" file-icon size="60" color="primary" @click="imageDialog = true;" >
              <v-img :src="formData.image || defaultImage" />
              <v-icon
                icon="mdi-camera"
                v-if="props?.userData?.image || !formData.image"
                color="black"
                class="avatar-icon"
              ></v-icon>
            </v-avatar>
            <v-file-input
              ref="fileInput"
              v-model="image"
              accept="image/*"
              @change="onFileChange"
              style="display: none"
            />
            <div class="col-2 d-flex flex-column ga-2">

            <v-btn @click="triggerFileInput" color="#1976d2"
              density="compact" variant="outlined" size="small"
            >{{!image && !formData.image ? 'Upload' : 'Replace'}}</v-btn>
            <v-btn @click="image = null, formData.image = null" color="danger" :disabled="(!formData.image || !image) || (!formData.image && !image)"
              density="compact" variant="outlined" size="small"
            >Remove</v-btn>
            </div>
          </div>

          <v-dialog v-model="imageDialog" width="auto" persistent>
            <v-card width="500px" rounded="xl" class="pa-1 mx-auto bg-black">
              <!-- <v-overlay v-model="imageDialog" class="mx-auto"> -->
              <v-btn icon="mdi-close" @click="imageDialog = false" density="compact" rounded="pill" class="text-dark ms-auto me-1 mt-1"></v-btn>
              <div class="pa-4 zoom-image">
                <ZoomImg :src="formData.image || image || defaultImage" class="h-[30rem]" style="object-fit: contain;">
                  <template #loading>
                    <div style="width:400px !important">
                      <p class="text-center">Loading...</p>
                    </div>
                  </template>
                </ZoomImg>
                <!-- <v-img :src="formData.image || image || defaultImage" width="200px" class="mx-auto"></v-img> -->
              </div>
              <!-- </v-overlay> -->
            </v-card>
          </v-dialog>

      <div class="row px-2 mt-2" v-if="propsDataType !=='delete'">

        <div class="col-md-6">
          <TextField v-model="formData.firstName" :rules="[...validRules, ...nameRules]" required label="First Name" placeholder="John"
          density="compact" variant="outlined"></TextField>
        </div>
        <div class="col-md-6">
          <TextField v-model="formData.lastName" :rules="[...validRules, ...nameRules]" required label="Last Name" placeholder="hennel"
          density="compact" variant="outlined"></TextField>
        </div>

        <div class="col-md-12">
        <TextField v-model="formData.email" :rules="emailRules" type="email" required label="E-mail" placeholder="abc@gmail.com" 
        prepend-inner-icon="mdi-email" density="compact" variant="outlined"></TextField>
        </div>

        <div class="col-md-6">
        <TextField v-model="formData.phone" @keypress="filterEvent" :rules="phoneRules" required label="Phone Number" 
        placeholder="+91 86456455453" prepend-inner-icon="mdi-phone" density="compact" variant="outlined"></TextField>
        </div>

        <div class="col-md-6">
        <DatePicker v-model="formData.birthDate" @update-dateValue="(e)=>formData.birthDate = new Date(e)" label="Date of birth" persistent
          placeholder="23/03/1994" prepend-inner-icon="mdi-calendar" persistent-placeholder density="compact" variant="outlined" required></DatePicker>
        </div>
        
        <div class="col-md-6">
          <RadioGroup v-model="formData.gender" :options="itemList" :radioLable="radioLable"
            inline class="d-flex align-items-center"></RadioGroup>
        </div>

        <div class="col-md-6 d-flex justify-end">
        <v-checkbox
          v-model="formData.checkbox"
          :rules="[(v) => !!v || 'You must agree to continue!']"
          required
          density="compact"
        >
          <template v-slot:label>
            <p class="text-start mb-0">
              Do you agree {{ props.userData ? "to changes" : null }}?
            </p>
          </template>
        </v-checkbox>

        </div>

        <div class="col-md-12 d-flex mb-3" :class="props.userData ? 'justify-content-end' : 'justify-content-between '">
          <v-btn v-if="!props.userData"
            :disabled="!valid"
            color="warning"
            @click="clearForm"
            size="small"
            class="me-2"
            >Clear</v-btn
          >
          <v-btn @click="deleteUser(props.userData.id)" :loading="loading" v-if="propsDataType =='delete'" size="small" variant="outlined" color="danger">Delete User</v-btn>
          <v-btn
            :disabled="!props.userData ? !valid : (!valid || (valid && !isChanged) || (!valid && !isChanged))"
            color="#1976d2" :loading="loading && !propsDataType == 'delete'"
            @click="!props.userData ? addUser() : editUser(props.userData.id,formData)"
            size="small"
            >{{ !props.userData ? 'Add' : 'Save Changes' }}</v-btn
          >
        </div>
      </div>
        </div>
    </v-form>
  </v-card>
</template>

<style scoped>
:deep(.custom-field .v-label .v-field-label) {
  background-color: red;
}

.form-title-head{
  /* background: #aaaaaa; */
  background: #777777;
  /* border-radius: 20px; */
  color: white;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}

.form-header{
  background: #c1c1c12b;
  border-bottom: 1px solid #8080805e;
}

.v-list.form-header{
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}

.avatar-icon {
  position: absolute;
  font-size: 14px;
  /* right: 0px; */
  width: 91%;
  bottom: 0px;
  border: 1px solid white;
  background: white;
  /* color: white; */
  z-index: 0;
}

.line-border{
  position: absolute;
    top: 50%;
    left: 10px;
    width: 97%;
}

/* .v-form .form-header, .v-list{
  background: linear-gradient(180deg, #1976d2, transparent);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  background: linear-gradient(180deg,rgb(207 207 207) 50%,rgb(255 255 255) 100%);
} */

.v-radio-group .v-radio,
.v-checkbox {
  font-size: 14px;
}
.v-radio-group .v-radio p,
.v-checkbox p {
  font-size: 12px;
  font-weight: 500;
}
:deep(.v-checkbox .v-selection-control){
  min-height: auto !important;
}

.btn-close {
  position: relative;
  bottom: 35px;
  left: 8px;
}

.v-btn{
  text-transform: capitalize;
}

:deep(.zoom-image .vz-zoomimg-container .vz-zoomimg-img-container img){
  object-fit: contain;
}
</style>
