<script setup>
import { ref, watch } from "vue";

const emit = defineEmits(['user-Form']);
const props = defineProps({
  userDatas: {
    type: Array,
    default: () => ([]),
  },
  selectview: {
    type: Number,
    default: -1,
  },
});

const usersDatas = ref([]);
const selectedView = ref(null);

const userForm = (index)=> {
    selectedView.value = index
};

watch(
  () => props.userDatas,
  (newValue) => {
    if (newValue) {
      usersDatas.value = props.userDatas;
    }
    // console.log(usersDatas.value, "usersDatasusersDatas");
  }
);
watch(
  () => props.selectview,
  (newValue) => {
    if (newValue) {
        selectedView.value = props.selectview;
    }
    // console.log(selectedView.value, "usersDatasusersDatas");
  }
);
</script>
<template>
    <v-table v-if="userDatas && userDatas.length > 0" fixed-header style="width: auto" height="90vh" >
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
        <tr v-for="(data,index) in userDatas" :key="data.id">
          <td>{{ data.id }}</td>
          <td>{{ data.firstName }} {{ data.lastName }}</td>
          <td>{{ data.email }}</td>
          <td>{{ data.phone }}</td>
          <td class="text-capitalize">{{ data.gender }}</td>
          <td>{{ data.image }}</td>
          <td class="d-flex align-items-center ga-1">
            <div class="border-sm rounded">
              <v-icon @click="emit('user-Form',data, index, 'edit')" color="grey" size="18" style="margin:2px;">mdi-pencil</v-icon>
            </div>
            <div class="border-sm rounded">
              <v-icon @click="emit('user-Form',data, index, 'delete')" color="danger" size="18" style="margin:2px;">mdi-delete</v-icon>
            </div>
            <div class="border-sm rounded">
              <v-icon @click="emit('user-Form',data, index, 'view'),userForm(index)" size="18" style="margin:2px;">{{selectedView !== index ? 'mdi-eye' : 'mdi-eye-off'}}</v-icon>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>
</template>