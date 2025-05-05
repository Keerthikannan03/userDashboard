<script setup>
import { ref, reactive } from "vue";
import defaultUpload from "../../assets/defaultUpload.png";
import { VFileUpload } from "vuetify/labs/VFileUpload";
// import axios from  'axios';
import callApi from "../utils/storeApi";
import toasterStore from "../../store/toasterStore.js";

const { manageStore } = toasterStore();
const productform = ref();
// const valid = ref(false);
const prodImage = ref(null);
const fileUploadError = ref(false);
const fileUploadErrorMsg = ref("");
const defaultMsg = ref("");
const successMessage = ref(false);
const errorMsg = ref(false);
const brandList = ref(["Nike", "Adidas", "Puma", "Reebok"]);

const categoriesList = ref(["Shoes", "Clothing", "Accessories", "Electronics"]);

const productsData = reactive({
  id: null,
  title: null,
  description: "",
  brand: [],
  categories: [],
  quantity: "",
  stock: "",
  sku: "",
  rating: "",
  selectedSelling: [],
  images: [],
  weight: [],
  length: "",
  breadth: "",
  width: "",
  discountPercentage: null,
  price: null,
});

const loadsubmit = ref(false);

function createBase64Image(fileObject) {
  Object.values(fileObject).forEach((v) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      productsData.images.push(e.target.result);
    };
    reader.readAsDataURL(v);
  });
}

function onFileChange($event) {
  fileUploadError.value = false;
  fileUploadErrorMsg.value = "";

  const file = $event.target.files;
  createBase64Image(file);
}

function filterNumbers(e) {
  const evt = e.key;
  if (!/^\d$/.test(evt)) {
    e.preventDefault();
  }
}

const requiredError = ref([(v) => (!!v && !!v.length > 0) || "This Field is required"]);
function lengthError(minlen, maxlen) {
  return [
    (v) => (v && v.length >= minlen) || `Min ${minlen} characters are allowed`,
    (v) => (v && v.length <= maxlen) || `Max ${maxlen} characters are allowed`,
  ];
}

function validateFileUpload() {
  if (!prodImage.value || prodImage.value.length === 0) {
    fileUploadError.value = true;
    fileUploadErrorMsg.value = "Please upload image";
    return false;
  }
  return true;
}

async function saveproduct() {
  const { valid } = await productform.value.validate();
  if (valid && validateFileUpload()) {
    loadsubmit.value = true;
    let url = "/products/add12";

    await callApi(url, { payload: productsData, method: "POST" })
      .then((response) => {
        if (response.data) {
          productsData.images = [];
          manageStore(response, "Product");
          setTimeout(() => {
            loadsubmit.value = false;
            productform.value.reset();
          }, 2000);
        }
      })
      .catch((error) => {
        successMessage.value = false;
        errorMsg.value = true;
        let getErrMsg = error?.response?.data?.message ?? null;
        manageStore(error, "Product");
        setTimeout(() => {
          loadsubmit.value = false;
          !getErrMsg ? [productform.value.reset(), (productsData.images = [])] : null;
        }, 2000);
      });
  }
}

function clearForm() {
  prodImage.value = null;
  productsData.images = [];
  productform.value.reset();
}

function filterEvent(event) {
  const key = event.key;
  // console.log(event, "eventevent");

  if (!/^\d$|^\.$/.test(key)) {
    event.preventDefault();
  }
}

function deleteProdImg(index) {
  productsData.images.splice(index, 1);
}
</script>
<template>
  <div class="d-flex align-items-center">
    <router-link to="/dashboard/products" class="me-2">
      <v-icon size="35" class="border border-1">mdi-arrow-left</v-icon>
    </router-link>
    <h2 class="mb-0">Add product</h2>
  </div>
  <v-divider class="my-2"></v-divider>

  <div>
    <v-form ref="productform" @submit.prevent="saveproduct()">
      <div
        class="row pb-2 overflow-y-auto overflow-x-hidden border-bottom"
        style="height: 80vh"
      >
        <div class="col-md-6">
          <div>
            <div class="p-2">
              <h6>Description</h6>
            </div>
            <v-card class="p-2">
              <v-text-field
                v-model="productsData.title"
                :rules="[...requiredError, ...lengthError(2, 50)]"
                label="Product Name"
                variant="outlined"
                required
              ></v-text-field>
              <v-textarea
                v-model="productsData.description"
                :rules="[...requiredError, ...lengthError(2, 200)]"
                :counter="200"
                label="Product Description"
                density="compact"
                variant="outlined"
                required
              ></v-textarea>
            </v-card>
          </div>

          <div class="mt-3">
            <div class="p-2">
              <h6>Categories</h6>
            </div>
            <v-card class="p-2">
              <div class="row">
                <v-select
                  v-model="productsData.brand"
                  :rules="requiredError"
                  :items="brandList"
                  label="Product Brand"
                  density="compact"
                  variant="outlined"
                  required
                  class="col-md-6"
                ></v-select>
                <v-select
                  v-model="productsData.categories"
                  :rules="requiredError"
                  :items="categoriesList"
                  label="Product Categories"
                  density="compact"
                  variant="outlined"
                  required
                  multiple
                  class="col-md-6 catagory-dropdown"
                >
                  <template v-slot:selection="{ item, index }">
                    <v-chip size="small" density="compact" v-if="index < 2" :text="item.title" closable @click:close="productsData.categories.splice(index, 1)"></v-chip>
                    <span v-if="index === 2" class="text-grey text-caption align-self-center" >
                      (+{{ productsData.categories.length - 2 }} others)
                    </span>
                  </template>
                </v-select>
              </div>
            </v-card>
          </div>

          <div class="mt-3">
            <div class="p-2">
              <h6>Inventory</h6>
            </div>
            <v-card class="p-2">
              <div class="row">
                <v-text-field
                  v-model="productsData.quantity"
                  :rules="requiredError"
                  label="Quantity"
                  density="compact"
                  variant="outlined"
                  required
                  type="number"
                  class="col-md-6"
                ></v-text-field>
                <v-text-field
                  v-model="productsData.stock"
                  :rules="requiredError"
                  label="Stock"
                  density="compact"
                  variant="outlined"
                  required
                  type="number"
                  class="col-md-6"
                ></v-text-field>
                <v-text-field
                  v-model="productsData.sku"
                  label="sku (Optional)"
                  density="compact"
                  variant="outlined"
                  required
                  class="col-md-6"
                ></v-text-field>
                <v-text-field
                  v-model="productsData.rating"
                  :rules="requiredError"
                  label="Rating"
                  density="compact"
                  variant="outlined"
                  required
                  type="number"
                  class="col-md-6"
                ></v-text-field>
              </div>
            </v-card>
          </div>

          <div class="mt-3">
            <div class="p-2">
              <h6>Selling Type</h6>
            </div>
            <v-card class="p-2 sellingCheckbox">
              <v-checkbox
                v-model="productsData.selectedSelling"
                label="In-store selling only"
                value="instoreOnly"
                density="compact"
              ></v-checkbox>
              <v-checkbox
                v-model="productsData.selectedSelling"
                label="Online selling only"
                value="onlineOnly"
                density="compact"
              ></v-checkbox>
              <v-checkbox
                v-model="productsData.selectedSelling"
                label="Available both store and online"
                value="bothOnlineStore"
                density="compact"
              ></v-checkbox>
            </v-card>
          </div>
        </div>
        <div class="col-md-6 mt-md-0 mt-3">
          <div>
            <div class="p-2">
              <h6 class="d-flex align-center">
                <span class="me-1">Product Images</span>
                <v-icon size="16">mdi-help-circle-outline</v-icon>
              </h6>
            </div>
            <v-card max-height="320px" class="p-2 overflow-auto">
              <div class="row g-1">
                <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 file-upload">
                  <v-file-upload
                    v-model="prodImage"
                    @change="onFileChange"
                    :error-messages="['Please upload image']"
                    icon="mdi-image-plus"
                    density="comfortable"
                    variant="compact"
                    multiple
                    class="py-4 px-2 me-2"
                    style="max-width: 200px; width: 100%; min-width: 100%; height: 150px"
                  >
                    <template v-slot:title>
                      <div style="font-size: 14px">
                        <span class="text-info text-decoration-underline"
                          >Click to Upload image
                        </span>
                        <span>or Drag and drop</span>
                      </div>
                    </template>
                  </v-file-upload>
                  <div
                    v-if="fileUploadError"
                    class="text-caption mt-1"
                    style="color: #b00020"
                  >
                    {{ fileUploadErrorMsg }}
                  </div>
                </div>
                <div
                  v-for="(prodimg, index) in productsData.images"
                  :key="index"
                  class="col-xl-3 col-lg-4 col-md-6 col-sm-6 product-image position-relative"
                  style="height: 150px"
                >
                  <v-img
                    :src="prodimg"
                    width="100%"
                    height="100%"
                    class="border border-1 rounded"
                  />
                  <v-icon
                    @click="deleteProdImg(index)"
                    class="position-absolute top-0 right-0 ma-1 bg-light rounded-5"
                    >mdi-close</v-icon
                  >
                </div>
                <div
                  class="col-xl-3 col-lg-4 col-md-6 col-sm-6"
                  v-if="productsData.images.length == 0"
                  style="height: 150px"
                >
                  <v-img :src="defaultUpload" width="100%" height="100%" cover></v-img>
                </div>
              </div>
            </v-card>
          </div>
          <div class="mt-3">
            <div class="p-2">
              <h6>Delivery and Shipping</h6>
            </div>
            <v-card class="p-2">
              <div class="row">
                <v-text-field
                  v-model="productsData.weight"
                  :rules="requiredError"
                  @keypress="filterEvent"
                  label="Items Weight"
                  density="compact"
                  variant="outlined"
                  required
                  suffix="kg"
                ></v-text-field>
                <div>
                  <span>Package Sizes</span>
                  <div class="row">
                    <v-text-field
                      v-model="productsData.length"
                      :rules="requiredError"
                      @keypress="filterEvent"
                      label="Length"
                      density="compact"
                      variant="outlined"
                      required
                      suffix="cm"
                      class="col-md-4"
                    ></v-text-field>
                    <v-text-field
                      v-model="productsData.breadth"
                      :rules="requiredError"
                      @keypress="filterEvent"
                      label="Breadth"
                      density="compact"
                      variant="outlined"
                      required
                      suffix="cm"
                      class="col-md-4"
                    ></v-text-field>
                    <v-text-field
                      v-model="productsData.width"
                      :rules="requiredError"
                      @keypress="filterEvent"
                      label="Width"
                      density="compact"
                      variant="outlined"
                      required
                      suffix="cm"
                      class="col-md-4"
                    ></v-text-field>
                  </div>
                </div>
              </div>
            </v-card>
          </div>
          <div class="mt-3">
            <div class="p-2">
              <h6>Pricing</h6>
            </div>
            <v-card class="p-2">
              <div class="row">
                <v-text-field
                  v-model="productsData.discountPercentage"
                  :rules="requiredError"
                  label="Discount Percentage"
                  density="compact"
                  variant="outlined"
                  required
                  append-inner-icon="mdi-percent"
                  class="col-md-6"
                ></v-text-field>
                <v-text-field
                  v-model="productsData.price"
                  :rules="requiredError"
                  @keypress="filterNumbers"
                  density="compact"
                  label="Price"
                  variant="outlined"
                  required
                  append-inner-icon="mdi-currency-inr"
                  class="col-md-6"
                ></v-text-field>
              </div>
            </v-card>
          </div>
        </div>
      </div>
      <div class="p-2 text-end">
        <v-btn @click="clearForm()" color="warning" class="me-2">Clear</v-btn>
        <v-btn
          @click="saveproduct()"
          :loading="loadsubmit"
          :disabled="loadsubmit"
          type="submit"
          color="#1976d2"
          >Save Product</v-btn
        >
      </div>
    </v-form>
  </div>
</template>
<style setup>
.sellingCheckbox .v-input__details {
  display: none;
}
.sellingCheckbox i {
  font-size: 20px;
}
.file-upload .v-file-upload-items {
  display: none;
}

.product-image .v-img img {
  object-fit: contain;
  padding: 4px;
}

.v-text-field:not(.v-textarea) .v-field__field {
  height: 32px;
}
.v-text-field:not(.v-textarea) .v-field__field input{
  min-height: 30px !important;
  padding: 0 0;
}
.v-input__details{
  min-height: 16px;
  padding-top: 2px;
}
.v-input .v-label.v-field-label {
    font-size: 14px;
}
.v-field--active .v-label.v-field-label {
    font-size: 12px;
}

.v-overlay .v-list-item--density-default.v-list-item--one-line {
  min-height: auto;
}
.v-overlay .v-list-item  .v-selection-control--density-default{
    --v-selection-control-size: 24px;
}
.v-overlay .v-list-item .v-selection-control i{
  font-size: 18px;
}
.v-overlay .v-list-item .v-list-item-title{
  font-size: 14px;
}


</style>
