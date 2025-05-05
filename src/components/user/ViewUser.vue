<script setup>
import { ref, watch } from "vue";
import CardCompo from "../common/CardCompo.vue";
import ZoomImage from "../common/ZoomImage.vue";
import dayjs from "dayjs";
import { VBtn, VCard } from "vuetify/components";
import userform from "./userform.vue";

const props = defineProps({
  userData: {
    type: Object,
    default: () => ({}),
  },
  deleteType: {
    type: String,
    default: "",
  },
});
const emit = defineEmits(["close-dialog"]);

const formData = ref({});
const titleData = ref("");
const subtitle = ref("");
const titleImage = ref("");
const imageDialog = ref(false);
const editdialog = ref(false);
const selectedUser = ref({});

const handleDate = (date) => {
  return dayjs(date).format("DD/MM/YYYY");
};

const userForm = (data)=> {
  if (data) {
    selectedUser.value = data || null;
    editdialog.value = true;
  }else{
    selectedUser.value = null;
    editdialog.value = true;
  }
}

const handleClosedForm = ()=>{
  editdialog.value = false;
}

watch(
  () => props.userData,
  (newUser) => {
    if (newUser) {
      formData.value = newUser;
      titleData.value = formData.value.firstName
        ? formData.value.firstName + "" + formData.value.lastName
        : formData.value.title;
      subtitle.value = formData.value.email
        ? formData.value.email
        : formData.value.description;
      titleImage.value = formData.value.image
        ? formData.value.image
        : formData.value.images
        ? formData.value.images[0]
        : null;
    }
  },
  { immediate: true }
);
</script>

<template>
  <VDialog v-bind="$attrs" max-width="700px">
    <CardCompo class="pa-2">
      <v-list class="pt-0 form-header overflow-visible">
        <v-list-item :subtitle="subtitle" class="d-sm-grid d-flex flex-column text-sm-start text-center px-2">
          <template v-slot:title>
            <p class="text-h4 m-0 lh-1">{{ titleData }}</p>
            <p class="text-muted text-capitalize mb-1">{{ formData.role }}</p>
          </template>
          <template v-slot:prepend>
            <v-avatar @click="imageDialog = true" class="cursor-pointer border-1 border-dark p-1" size="100" >
              <v-img :src="titleImage || defaultImage" />
            </v-avatar>
          </template>
          <template v-slot:append>
            <v-btn icon="mdi-close" @click="emit('close-dialog')" density="compact" rounded="pill" class="text-dark close-icon" ></v-btn>
            <v-sheet class="mt-sm-0 mt-2 ms-2 pa-2 py-1 rounded-xl">
              <span class="head-text">Verified Profile</span>
              <span><v-icon size="20" color="blue" class="ms-2">mdi-check-decagram</v-icon></span>
            </v-sheet>
          </template>
        </v-list-item>
      </v-list>
      <ZoomImage v-model="imageDialog" :userData="props.userData" @close-dialog="imageDialog = false" rounded="xl" width="auto" persistent ></ZoomImage>
      <div class="overflow-auto pb-2">
        <VCard class="border-1 border-end border-grey pa-2 mt-2">
          <div class="d-flex flex-wrap justify-content-between">
            <h5 class="heading-style alt-two position-relative mb-2">General Info:</h5>
            <VBtn @click="userForm(props.userData)" density="comfortable" class="text-dark text-capitalize px-1" size="small" color="warning">
              <VIcon>mdi-pencil-box-outline</VIcon>
              <span class="ms-1">Edit</span>
              </VBtn>
          </div>
          <div class="row px-2">
            <div class="col-6 mt-2">
              <p class="head-text mb-1"><span>First Name</span></p>
              <p class="sub-text mb-0">{{ formData.firstName }}</p>
            </div>
            <div class="col-6 mt-2">
              <p class="head-text mb-1"><span>Last Name</span></p>
              <p class="sub-text mb-0">{{ formData.lastName }}</p>
            </div>
            <div class="col-6 mt-2">
              <p class="head-text mb-1"><span>E-mail</span></p>
              <p class="sub-text mb-0">{{ formData.email }}</p>
            </div>
            <div class="col-6 mt-2">
              <p class="head-text mb-1"><span>Phone</span></p>
              <p class="sub-text mb-0">{{ formData.phone }}</p>
            </div>
            <div class="col-6 mt-2">
              <p class="head-text mb-1"><span>User ID</span></p>
              <p class="sub-text mb-0">{{ formData.id }}</p>
            </div>
            <div class="col-6 mt-2">
              <p class="head-text mb-1"><span>Role</span></p>
              <p class="sub-text mb-0">{{ formData.role }}</p>
            </div>
          </div>
        </VCard>
        <VCard class="border-1 border-end border-grey pa-2 mt-2">
          <h5 class="heading-style alt-two position-relative mt-3 mb-2">Address Info:</h5>
          <div class="row px-2">
            <div class="col-6 mt-2">
              <p class="head-text mb-1"><span>University</span></p>
              <p class="sub-text mb-0">{{ formData.university }}</p>
            </div>
            <div class="col-6 mt-2">
              <p class="head-text mb-1"><span>Street</span></p>
              <p class="sub-text mb-0">{{ formData.address.address }}</p>
            </div>
            <div class="col-6 mt-2">
              <p class="head-text mb-1"><span>State</span></p>
              <p class="sub-text mb-0">{{ formData.address.state }}</p>
            </div>
            <div class="col-6 mt-2">
              <p class="head-text mb-1"><span>Country</span></p>
              <p class="sub-text mb-0">{{ formData.address.country }}</p>
            </div>
            <div class="col-6 mt-2">
              <p class="head-text mb-1"><span>Postal Code</span></p>
              <p class="sub-text mb-0">{{ formData.address.postalCode }}</p>
            </div>
          </div>
        </VCard>
        <VCard class="border-1 border-end border-grey pa-2 mt-2">
          <h5 class="heading-style alt-two position-relative mb-2">Personal Info:</h5>
          <div class="row px-2">
            <div class="col-6 mt-2">
              <p class="head-text d-flex align-items-center mb-1">
                <span>Gender</span>
              </p>
              <p class="sub-text mb-0">{{ formData.gender }}</p>
            </div>
            <div class="col-6 mt-2">
              <p class="head-text d-flex align-items-center mb-1">
                <span>Age</span>
              </p>
              <p class="sub-text mb-0">{{ formData.age }}</p>
            </div>
            <div class="col-6 mt-2">
              <p class="head-text d-flex align-items-center mb-1">
                <span>Birthday</span>
              </p>
              <p class="sub-text mb-0">{{ handleDate(formData.birthDate) }}</p>
            </div>
            <div class="col-6 mt-2">
              <p class="head-text d-flex align-items-center mb-1">
                <span>Blood</span>
                <v-icon size="16" class="ms-1" color="red">mdi-water</v-icon>
              </p>
              <p class="sub-text mb-0">{{ formData.bloodGroup }}</p>
            </div>
            <div class="col-6 mt-2">
              <p class="head-text d-flex align-items-center mb-1">
                <span>Eye Color</span>
              </p>
              <p class="sub-text mb-0">{{ formData.eyeColor }}</p>
            </div>
            <div class="col-6 mt-2">
              <p class="head-text d-flex align-items-center mb-1">
                <span>Height</span>
              </p>
              <p class="sub-text mb-0">{{ formData.height }}</p>
            </div>
            <div class="col-6 mt-2">
              <p class="head-text d-flex align-items-center mb-1">
                <span>Weight</span>
              </p>
              <p class="sub-text mb-0">{{ formData.weight }}</p>
            </div>
          </div>
        </VCard>

        <VCard class="border-1 border-end border-grey pa-2 mt-2">
          <h5 class="heading-style alt-two position-relative mt-3 mb-2">Bank Info:</h5>
          <div class="row px-2">
            <div class="col-6 mt-2">
              <p class="head-text d-flex align-items-center mb-1">
                <span>Card Number</span>
              </p>
              <p class="sub-text mb-0">{{ formData.bank.cardNumber }}</p>
            </div>
            <div class="col-6 mt-2">
              <p class="head-text d-flex align-items-center mb-1">
                <span>Card Expire</span>
              </p>
              <p class="sub-text mb-0">{{ formData.bank.cardExpire }}</p>
            </div>
            <div class="col-6 mt-2">
              <p class="head-text d-flex align-items-center mb-1">
                <span>Currency</span>
              </p>
              <p class="sub-text mb-0">{{ formData.bank.currency }}</p>
            </div>
            <div class="col-6 mt-2">
              <p class="head-text d-flex align-items-center mb-1">
                <span>Iban</span>
              </p>
              <p class="sub-text mb-0">{{ formData.bank.iban }}</p>
            </div>
            <div class="col-6 mt-2">
              <p class="head-text d-flex align-items-center mb-1">
                <span>Card Type</span>
              </p>
              <p class="sub-text mb-0">{{ formData.bank.cardType }}</p>
            </div>
          </div>
        </VCard>
      </div>
      <userform v-model="editdialog" :userData="selectedUser" @close-dialog="handleClosedForm" width="500px" persistent></userform>
    </CardCompo>
  </VDialog>
</template>
<style scoped>
.form-header {
  background: #c1c1c12b;
  border-bottom: 1px solid #8080805e;
}

.v-list.form-header {
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}

.head-text,
.head-text span {
  font-size: 14px;
  font-weight: 500;
}

.sub-text {
  font-size: 14px;
  font-weight: 500;
  color: grey;
}

h5.heading-style {
  color: #1976d2;
  text-transform: capitalize;
}
h5.heading-style:before {
  position: absolute;
  left: 0%;
  bottom: -3px;
  width: 60px;
  height: 2px;
  content: "";
  background-color: #c50000;
}

h5.heading-style span {
  font-size: 13px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 4px;
  line-height: 3em;
  padding-left: 0.25em;
  color: rgba(0, 0, 0, 0.4);
  padding-bottom: 10px;
}

/* close Icon */

.close-icon {
  position: absolute;
  top: 4px;
  right: 4px;
}
</style>
