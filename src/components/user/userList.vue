<script setup>
import { ref, onMounted, reactive, watch } from "vue";
import nodataImg from "../../assets/nodata.jpg";
import userform from "./userform.vue";
import callApi from "../utils/storeApi";

const userDatas = ref([]);
const editdialog = ref(false);
const editvalid = ref(false);
const selectedUser = ref(null);

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

function userForm(data, reqtype) {
  if (reqtype) data.type = reqtype;
  selectedUser.value = data;
  editdialog.value = true;
}

// function deleteUser(data){
//   editdialog.value = true;
// }

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
      <v-btn @click="userForm(null)" color="success">Add User</v-btn>
    </div>
    <v-table
      v-if="userDatas && userDatas.length > 0"
      fixed-header
      style="width: auto"
      height="90vh">
      <thead>
        <tr>
          <th class="text-left">User ID</th>
          <th class="text-left">Name</th>
          <th class="text-left">E-mail</th>
          <th class="text-left">Phone</th>
          <th class="text-left">Gender</th>
          <th class="text-left">Image</th>
          <th class="text-left">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="data in userDatas" :key="data.id">
          <td>{{ data.id }}</td>
          <td>{{ data.firstName }} {{ data.lastName }}</td>
          <td>{{ data.email }}</td>
          <td>{{ data.phone }}</td>
          <td class="text-capitalize">{{ data.gender }}</td>
          <td>{{ data.image }}</td>
          <td class="d-flex align-items-center">
            <v-icon @click="userForm(data, 'edit')" color="warning" class="me-2"
              >mdi-pencil</v-icon
            >
            <v-icon @click="userForm(data, 'delete')" color="danger">mdi-delete</v-icon>
          </td>
        </tr>
      </tbody>
    </v-table>
    <v-img :src="nodataImg" width="80%" class="m-auto" v-else />
  </div>

  <div>
    <v-dialog v-model="editdialog" max-width="600" persistent>
      <div class="mx-auto">
        <userform :userData="selectedUser" @close-dialog="editdialog = false" />
      </div>
    </v-dialog>
  </div>
</template>
