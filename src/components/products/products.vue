<script setup>
import { ref, watch, onMounted } from "vue";
import nodataImg from "../../assets/nodata.jpg";
import { useRouter } from "vue-router";
import callApi from "../utils/storeApi.js";
import toasterStore from '../../store/toasterStore.js';

const { manageStore } = toasterStore();
// const callApi = callApijs();
const router = useRouter();
const productsData = ref([]);
const noData = ref(true);
// const successtoaster = ref(false);
const errortoaster = ref(false);
const search = ref("");
const defaultMsg = ref("");
const selectIndex = ref(-1);
const deleteDialog = ref(false);

const productsList = async () => {
  const url = "/products";

  await callApi(url)
    .then((response) => {
      // console.log(response, "response123");
      productsData.value = response.data.products;
      if (productsData.value.length == 0) {
        noData.value = false;
      } else {
        noData.value = true;
      }
    })
    .catch((error) => {
      console.log(error, "erasdasdasdror");
    });
};

const searchProduct = async(event) => {
  const url = `/products/search?q=${event}`;
  await callApi(url)
    .then((response) => {
      productsData.value = response.data.products;
      if (productsData.value.length == 0) {
        noData.value = false;
      } else {
        noData.value = true;
      }
    })
    .catch((error) => {
      console.log(error, "reeerwewew");
    });
};

const btnViewLoading = ref([]);
const viewProduct = (uid, index) => {
  btnViewLoading.value[index] = true;
  console.log(uid, "uid");
  router
    .push({
      name: "viewproduct",
      params: { id: uid },
    })
    .then(() => {
      btnViewLoading.value[index] = false;
    })
    .catch(() => {
      btnViewLoading.value[index] = false;
    });
};

const btnLoading = ref([]);
const deleteProduct = async (uid, index) => {
  btnLoading.value[index] = true;

  const url = `/products/${uid}`;
  await callApi(url, { method : 'delete'})
    .then((response) => {
      console.log(response, "response");
      // successtoaster.value = true;
      search.value = "";
      deleteDialog.value = false;
      // defaultMsg.value = "Product Deleted Successfully";
      manageStore(response, 'Product');
      productsList();
    })
    .catch((error) => {
      console.log(error, "error");
      manageStore(error, 'Product');
    })
    .finally(() => {
      btnLoading.value[index] = false;
    });
};

const selectedDelete = (index) => {
  selectIndex.value = index;
  deleteDialog.value = true;
  console.log(deleteDialog.value, "deleteDialog");
};

watch(search, (newVal) => {
  if (!newVal || (newVal && newVal.length == 0)) {
    console.log(newVal, "newVal");
    productsList();
  }
});

onMounted(() => {
  productsList();
});
</script>
<template>
  <div>
    <div class="d-flex justify-content-between align-items-center">
      <h2>Products Lists</h2>
      <v-btn to="/dashboard/products/addproduct" class="text-none" color="success"
        >Add Product</v-btn
      >
    </div>

    <div class="d-flex align-items-center">
      <span class="me-2" style="color: #757575">Filters:</span>
      <v-text-field
        v-model="search"
        @input="searchProduct(search)"
        density="compact"
        placeholder="Search"
        prepend-inner-icon="mdi-magnify"
        style="max-width: 300px"
        variant="solo"
        clearable
        hide-details
      ></v-text-field>
    </div>

    <v-divider></v-divider>

    <div v-if="noData" class="row g-3 pb-2 overflow-y-auto" style="height: 80vh">
      <div
        v-for="(item, index) in productsData"
        :key="item.id"
        class="col-xxl-4 col-xl-6 col-lg-6"
      >
        <v-card hover class="d-flex card-list">
          <div class="col-3">
            <v-img
              :src="item.images[0]"
              width="100%"
              height="10px"
              min-height="100%"
              contain
              class="border border-1 rounded-2 rounded-top-0 rounded-end-0 p-1"
            />
          </div>
          <div class="col-9 py-2 px-3">
            <h6 class="mb-1">{{ item.title }}</h6>
            <v-card-subtitle class="p-0">{{ item.description }}</v-card-subtitle>
            <v-card-text class="d-flex flex-wrap justify-content-between p-0 pt-2">
              <div>
                <p class="m-0">
                  <span class="text-muted">Price: </span
                  ><span> {{ item.price }}</span>
                </p>
                <p class="my-1">
                  <span class="text-muted">Brand: </span
                  ><span>{{ item.brand }}</span>
                </p>
                <p class="mb-0 text-truncate">
                  <span class="text-muted">Category: </span
                  ><span>{{ item.category }}</span>
                </p>
              </div>
              <div
                class="d-flex flex-wrap flex-sm-column flex-row justify-start align-items-start ga-1 mt-auto"
              >
                <v-btn
                  @click="viewProduct(item.id, index)"
                  :loading="btnViewLoading[index]"
                  size="small"
                  color="primary"
                  variant="text"
                  >View</v-btn
                >
                <v-btn
                  @click="selectedDelete(index)"
                  size="small"
                  color="red"
                  variant="text"
                  >Delete</v-btn
                >
              </div>
            </v-card-text>
          </div>
        </v-card>
        <v-dialog
          v-model="deleteDialog"
          v-if="selectIndex == index"
          max-width="380"
          persistent
        >
          <v-card class="rounded-1 p-1">
            <v-list class="pt-0">
              <v-list-item class="px-0" :title="item.title" :subtitle="item.description">
                <template v-slot:prepend>
                  <v-avatar class="cursor-pointer border border-1" size="50">
                    <v-img :src="item.images[0]" />
                  </v-avatar>
                </template>
              </v-list-item>
            </v-list>

            <v-divider class="mt-0 mb-4"></v-divider>

            <div>
              <v-card-text class="py-0">
                Are you sure you want to delete this Item?
              </v-card-text>
              <v-card-actions class="justify-content-between">
                <v-btn @click="deleteDialog = false" density="compact">Cancel</v-btn>
                <v-btn
                  @click="deleteProduct(item.id, index)"
                  :loading="btnLoading[index]"
                  density="compact"
                  color="danger"
                  >Delete</v-btn
                >
              </v-card-actions>
            </div>
          </v-card>
        </v-dialog>
      </div>
    </div>
    <v-img :src="nodataImg" width="80%" class="m-auto" v-else />
  </div>
</template>

<style scoped>
.v-form .form-header,
.v-list .v-list-item {
  background: linear-gradient(180deg, rgb(207 207 207) 50%, rgb(255 255 255) 100%);
}

.card-list.v-card .v-card-text {
  font-size: 12px;
}
</style>
