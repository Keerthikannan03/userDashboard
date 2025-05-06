<script setup>
import { ref, watch } from "vue";
import DeleteDialog from "../common/DeleteDialog.vue";
// import { defineAsyncComponent } from "vue";

const emit = defineEmits(['view-page','delete-item']);
const props = defineProps({
  productDatas: {
    type: Array,
    default: () => [],
  },
});

const productsData = ref([]);
const selectIndex = ref(-1);
const deleteDialog = ref(false);

const btnViewLoading = ref([]);

const selectedDelete = (index) => {
  selectIndex.value = index;
  deleteDialog.value = true;
};

// const loadComponent = defineAsyncComponent(()=> import('./products.vue'));

watch(
  () => props.productDatas,
  (newValue) => {
    if (newValue) {
      productsData.value = props.productDatas;
    }
    console.log(productsData.value, "productsDataproductsData");
  }
);
</script>

<template>
  <div class="row g-3 pb-2 overflow-y-auto" style="height: 80vh">
    <div v-for="(item, index) in props.productDatas" :key="item.id" class="col-xxl-4 col-xl-6 col-lg-6" >
      <v-card hover class="d-flex card-list d-flex flex-wrap">
        <div class="col-sm-3 col-12">
          <v-img
            :src="item.images[0]"
            width="100%"
            height="110px"
            min-height="100%"
            contain
            class="border border-1 rounded-2 rounded-top-0 rounded-end-0 p-1"
          />
        </div>
        <div class="col-sm-9 col-12 py-2 px-3">
          <h6 class="mb-1">
          <span>{{ item.title }}</span> 
              <v-btn color="warning"
            icon="mdi-cart-plus"
            size="small"
            density="comfortable"
          ></v-btn>
          </h6>
          <v-card-subtitle class="p-0">{{ item.description }}</v-card-subtitle>
          <v-card-text class="d-flex flex-wrap justify-content-between p-0 pt-2">
            <div>
              <p class="m-0">
                <span class="text-muted">Price: </span><span> {{ item.price }}</span>
              </p>
              <p class="my-1">
                <span class="text-muted">Brand: </span><span>{{ item.brand }}</span>
              </p>
              <p class="mb-0 text-truncate">
                <span class="text-muted">Category: </span><span>{{ item.category }}</span>
              </p>
            </div>
            <div class="d-flex flex-wrap flex-sm-column flex-row justify-start align-items-start ga-1 mt-auto">
              <v-btn
                @click="emit('view-page',item.id, index)"
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
      <DeleteDialog v-model="deleteDialog" v-if="selectIndex == index" :userData="item" :deleteType="'product'" @close-dialog="deleteDialog = false" max-width="380" persistent> </DeleteDialog>
    </div>
  </div>
</template>
