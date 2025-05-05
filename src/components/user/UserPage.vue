<script setup>
import { ref, onMounted, reactive, watch } from "vue";
import nodataImg from "../../assets/nodata.jpg";
import userform from "./userform.vue";
import callApi from "../utils/storeApi";
import DeleteDialog from "../common/DeleteDialog.vue";
import ViewUser from "./ViewUser.vue";
import UserList from "./UserList.vue";

const userDatas = ref([]);
const editdialog = ref(false);
const deletedialog = ref(false);
const viewdialog = ref(false);
const editvalid = ref(false);
const selectedUser = ref({});
const selectedView = ref(-1);
const userTableHeading = ref(['User ID','Name','Phone','Gender','Image','Action']);

// const validRules = [(v) => !!v || "Field is required"];
// const nameRules = ref([
//     v => !!v || 'Name is required',
//     v => (v && v.length <= 10) || 'Name must be 10 characters or less',
//   ])

const formData = reactive({
  firstName: "",
  lastName: "",
  email: "",
  phone: null,
});

const getuserData = async () => {
  const url = "/users";
  await callApi(url)
    .then((response) => {
      // console.log(response.data, "sadasdresponseasdda");
      userDatas.value = response.data.users;
    })
    .catch((error) => {
      console.log(error, "reeerwewew");
    });
};

// git config --local user.name "Keerthikanan03"
// git config  --local user.email "keerthikanan03@gmail.com"

const userForm = (data,index,reqtype)=> {
  
  if (data && reqtype) data.type = reqtype;
  
  if (reqtype == 'edit' || reqtype == 'add') {
    selectedUser.value = reqtype !== 'add' ? data : null;
    editdialog.value = true;
  } 
  else if(reqtype == 'delete') {
    selectedUser.value = data;
    deletedialog.value = true;
  }
  else{
    selectedView.value = index;
    selectedUser.value = data;
    viewdialog.value = true;
  }
}

// function deleteUser(data){
//   editdialog.value = true;
// }

const handleClosedForm = ()=>{
  editdialog.value = false;
  selectedView.value = -1;
}

watch(
  () => formData.lastName,
  (newVal, oldVal) => {
    console.log(editvalid.value, "sadasdasdasd..1");
    console.log(newVal, "newVal123", oldVal);
    if (oldVal.length > 0 && newVal.length > 0 && newVal !== oldVal) {
      editvalid.value = true;
      console.log(editvalid.value, "sadasdasdasd...2");
    } else {
      editvalid.value = false;
    }
  }
);

// watch(formData, (newVal)=>{
//     console.log(newVal,'formDatanewVal',editvalid.value);
// },{ deep: true })

onMounted(() => {
  getuserData();
});
</script>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center">
      <h2>User Lists</h2>
      <v-btn @click="userForm(null,null,'add')" color="#1976d2">Add User</v-btn>
    </div>
    <template v-if="userDatas && userDatas.length > 0">
      <UserList :userDatas="userDatas" @user-Form="userForm" :selectview="selectedView" @select-view="selectedView = -1"></UserList>
    </template>
    <v-table v-else fixed-header style="width: auto" height="90vh" >
      <thead>
        <tr>
          <th v-for="heading of userTableHeading" :key="heading" class="text-left">{{ heading }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(data) in 14" :key="data.id">
          <td v-for="(data) in 6" :key="data.id">
            <v-skeleton-loader v-if="true" type="list-item" ></v-skeleton-loader>
          </td>
        </tr>
      </tbody>
      </v-table>
    <!-- <v-img :src="nodataImg" width="80%" class="m-auto" v-else /> -->
  </div>

  <div> 
    <userform v-model="editdialog" :userData="selectedUser" @close-dialog="handleClosedForm" width="500px" persistent></userform>
    <DeleteDialog v-model="deletedialog" width="400px" :userData="selectedUser" :deleteType="'user'" @close-dialog="deletedialog = false" persistent ></DeleteDialog>
    <ViewUser v-model="viewdialog" :userData="selectedUser" :deleteType="'view'" @close-dialog="viewdialog = false, selectedView = -1" persistent></ViewUser>
  </div>
</template>
