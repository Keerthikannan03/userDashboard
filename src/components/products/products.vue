<script setup>
import { ref, watch, onMounted } from "vue";
import nodataImg from "../../assets/nodata.jpg";
import { useRouter } from "vue-router";
import callApi from "../utils/storeApi.js";
import toasterStore from "../../store/toasterStore.js";
import DeleteDialog from "../common/DeleteDialog.vue";
import TextField from "../common/TextField.vue";
import ProductList from "./ProductList.vue";

const { manageStore } = toasterStore();
const router = useRouter();
const productsData = ref([]);
const noData = ref(true);
const search = ref("");
const selectIndex = ref(-1);
const deleteDialog = ref(false);
const tabwindow = ref(null);
const tablist = ref([
  {
    text: "Products",
    value: "product",
  },
  {
    text: "Card",
    value: "card",
  },
]);

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

const searchProduct = async (event) => {
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
  await callApi(url, { method: "delete" })
    .then((response) => {
      console.log(response, "response");
      // successtoaster.value = true;
      search.value = "";
      deleteDialog.value = false;
      // defaultMsg.value = "Product Deleted Successfully";
      manageStore(response, "Product");
      productsList();
    })
    .catch((error) => {
      console.log(error, "error");
      manageStore(error, "Product");
    })
    .finally(() => {
      btnLoading.value[index] = false;
    });
};

// const selectedDelete = (index) => {
//   selectIndex.value = index;
//   deleteDialog.value = true;
// };

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
    <div class="d-flex flex-wrap justify-content-between align-items-center ga-2">
      <div class="d-flex flex-wrap">
        <h2>Products Lists</h2>
        <TextField
          v-model="search"
          @input="searchProduct(search)"
          density="compact"
          placeholder="Search Products"
          prepend-inner-icon="mdi-magnify"
          style="width: 230px"
          variant="solo"
          clearable
          hide-details
          class="ms-md-4 ms-0 h-100"
        ></TextField>
      </div>
      <v-btn to="/dashboard/products/addproduct" class="text-none" color="#1976d2"
        >Add Product</v-btn
      >
    </div>

    <v-divider></v-divider>
    <v-card class="d-none">
      <v-tabs v-model="tabwindow" bg-color="primary">
        <template v-for="item of tablist" :key="item">
          <v-tab :value="item.value">{{ item.text }}</v-tab>
        </template>
      </v-tabs>

      <v-card-text>
        <v-tabs-window v-model="tabwindow">
          <template v-for="item of tablist" :key="item">
            <v-tabs-window-item :value="item.value">
              {{ item.text }}
            </v-tabs-window-item>
          </template>
        </v-tabs-window>
      </v-card-text>
    </v-card>

    <template v-if="noData">
      <ProductList
        :productDatas="productsData"
        @view-page="viewProduct"
      ></ProductList>
    </template>
    <template v-else>
      <v-img :src="nodataImg" width="80%" class="m-auto" />
    </template>
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
