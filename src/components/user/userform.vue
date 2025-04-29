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

function triggerFileInput() {
  // console.log(fileInput, "asdasdasfileInput");

  fileInput.value?.$el?.querySelector("input")?.click();
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
    console.log(err,'error');
    console.log(formData,'propsuserData');
    loading.value = false;
    closeUserform();
    manageStore(res, 'user');
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
    // console.log(newUser, "newValue");

    if (newUser) {
      Object.assign(formData, newUser);
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
  <v-card width="400px" class="p-1">
    <!-- <v-card-title class="d-flex justify-space-between align-center">
      <div class="text-h5 text-medium-emphasis ps-2">
        Add User
      </div>

      <v-btn
        icon="mdi-close"
        variant="text" density="compact"
        @click="$emit('close-dialog')"
      ></v-btn>
    </v-card-title>
    <v-divider class="my-0"></v-divider> -->

    <!-- <h2 class="text-center">Add User</h2> -->
    <v-form ref="form" v-model="valid" lazy-validation>
      <div class="row">
        <div class="col-md-12">
          <v-list v-if="props?.userData?.type == 'delete'" class="pt-0">
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


          <div v-if="props?.userData?.type !=='delete'" class="rounded-1 px-2 pt-4 d-flex justify-content-between align-items-center form-header">
            <v-avatar
              class="cursor-pointer"
              size="50"
              color="primary"
              @click="triggerFileInput"
            >
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
 
            <v-card-item>
              <v-card-title>
                {{ !props.userData ? "Add" : "Edit" }} User
              </v-card-title>
            </v-card-item>
            <v-btn
              icon="mdi-close"
              @click="closeUserform()"
              density="compact"
              rounded="pill"
              class="text-dark btn-close"
            ></v-btn>
          </div>

          <v-divider class="mt-0 mb-4"></v-divider>

          <div v-if="props?.userData?.type == 'delete'">
            <v-card-text class="py-0">
              Are you sure you want to delete this user?
            </v-card-text>
            <v-card-actions class="justify-content-between">
              <v-btn @click="closeUserform()" density="compact">Cancel</v-btn>
              <v-btn @click="deleteUser(props.userData.id)" :loading="loading" density="compact" color="danger">Delete</v-btn>
            </v-card-actions>
          </div>
        </div>
      </div>
      <div class="row px-2" v-if="props?.userData?.type !=='delete'">

        <TextField v-model="formData.firstName" :rules="[...validRules, ...nameRules]" required label="First Name" 
        density="compact" variant="outlined" class="col-md-6"></TextField>
        
        <TextField v-model="formData.lastName" :rules="[...validRules, ...nameRules]" required label="Last Name" 
        density="compact" variant="outlined" class="col-md-6"></TextField>

        <TextField v-model="formData.email" :rules="emailRules" type="email" required label="E-mail" 
        prepend-inner-icon="mdi-email" density="compact" variant="outlined" class="col-md-12"></TextField>

        <TextField v-model="formData.phone" @keypress="filterEvent" :rules="phoneRules" required label="Phone Number" 
        prepend-inner-icon="mdi-phone" density="compact" variant="outlined" class="col-md-6"></TextField>

        <DatePicker v-model="formData.birthDate" @update-dateValue="(e)=>formData.birthDate = new Date(e)" label="Date of birth" persistent
          prepend-inner-icon="mdi-calendar" persistent-placeholder density="compact" variant="outlined" required class="col-md-6"></DatePicker>
        
        <div class="col-md-12">
          <RadioGroup v-model="formData.gender" :options="itemList" :radioLable="radioLable"
            inline class="d-flex align-items-center"></RadioGroup>
        </div>

        <v-checkbox
          v-model="formData.checkbox"
          :rules="[(v) => !!v || 'You must agree to continue!']"
          required
          density="compact"
          class="col-md-12"
        >
          <template v-slot:label>
            <p class="text-start mb-0">
              Do you agree {{ props.userData ? "to changes" : null }}?
            </p>
          </template>
        </v-checkbox>

        <div class="col-md-12 d-flex justify-content-end mb-3">
          <v-btn v-if="!props.userData"
            :disabled="!valid"
            color="warning"
            @click="clearForm"
            size="small"
            class="me-2"
            >Clear</v-btn
          >
          <v-btn
            :disabled="!props.userData ? !valid : (!valid || (valid && !isChanged) || (!valid && !isChanged))"
            color="success" :loading="loading"
            @click="!props.userData ? addUser() : editUser(props.userData.id,formData)"
            size="small"
            >{{ !props.userData ? 'Add' : 'Save Changes' }}</v-btn
          >
        </div>
      </div>
    </v-form>
  </v-card>
</template>

<style scoped>
:deep(.custom-field .v-label .v-field-label) {
  background-color: red;
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

.v-form .form-header, .v-list .v-list-item {
  background: linear-gradient(180deg,rgb(207 207 207) 50%,rgb(255 255 255) 100%);
}

.v-radio-group .v-radio,
.v-checkbox {
  font-size: 14px;
}
.v-radio-group .v-radio p,
.v-checkbox p {
  font-size: 14px;
}

.btn-close {
  position: relative;
  bottom: 35px;
  left: 8px;
}

</style>
