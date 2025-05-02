<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import nowarrenty from "../../assets/warranty.png";
import deliveryVan from "../../assets/truck.png";

const router = useRoute();

const productColors = ref([
  {
    colorName: "Apricot",
    colorCode: "#FDD5B1",
  },
  {
    colorName: "Greenish Blue",
    colorCode: "#25685D",
  },
  {
    colorName: "Silver Grey",
    colorCode: "#E0E0E0",
  },
  {
    colorName: "Light Green",
    colorCode: "#C5E1A5",
  },
  {
    colorName: "Purple",
    colorCode: "#E1BEE7",
  },
]);
const colorFilter = ref([
  "none",
  "invert(1)",
  "grayscale(1)",
  "hue-rotate(90deg)",
  "hue-rotate(180deg)",
  "hue-rotate(270deg)",
]);
const productData = ref(null);
const selectedBox = ref(-1);
const fixedFixedImg = ref(null);
const isSelected = ref(false);
const selectedColor = ref(0);
const isColor = ref("none");
const quantity = ref(1);
const panelExpension = ref([0, 1]);

const viewProduct = async () => {
  const uid = router.params.id;
  const baseUrl = "https://dummyjson.com/products";
  await axios
    .delete(`${baseUrl}/${uid}`)
    .then((response) => {
      productData.value = response.data;
      selectImages(0);
    })
    .catch((error) => {
      console.log(error, "error");
    });
};

const selectImages = (index) => {
  selectedBox.value = index;
  fixedFixedImg.value = productData.value.images[index];
};

const colorSelection = (index) => {
  selectedColor.value = index;
  isColor.value = colorFilter.value[index];
  console.log(isColor.value, "isColor");
};

onMounted(() => {
  viewProduct();
});
</script>
<template>
  <div class="d-flex align-items-center">
    <router-link to="/dashboard/products" class="me-2">
      <v-icon size="35" class="border border-1">mdi-arrow-left</v-icon>
    </router-link>
    <h2 class="mb-0">View product</h2>
  </div>
  <v-divider class="my-2"></v-divider>

  <!-- <v-container> -->
  <div class="grid-container g-3 pb-2 overflow-y-auto" style="height: 80vh" v-if="productData">
    <div class="productimg-card">
      <v-card class="d-flex align-items-stretch pa-2" max-height="500px">
        <div class="overflow-y-auto">
          <template v-for="(items, index) in productData.images" :key="items.id">
            <div
              @click="selectImages(index)"
              :class="{ 'active-box': selectedBox == index }"
              :style="{ filter: isColor }"
              class="pa-1 border border-1 rounded-2 mb-1 cursor-pointer"
            >
              <v-img
                :src="items"
                width="80px"
                height="85px"
                class="d-flex align-items-center justify-content-center"
              ></v-img>
            </div>
          </template>
        </div>
        <div class="d-flex align-center w-100">
          <v-img
            :src="fixedFixedImg ? fixedFixedImg : productData.images[0]"
            class="d-flex align-items-center justify-content-center"
            :style="{ filter: isColor }"
          >
            <v-btn
              @click="isSelected = !isSelected"
              :icon="isSelected ? 'mdi-heart' : 'mdi-heart-outline'"
              class="position-absolute top-0 end-0"
            >
            </v-btn
          ></v-img>
        </div>
      </v-card>
    
    </div>
    
    <div class="prodDetails-card">
      <v-card>
        <v-card-item>
          <div class="d-flex flex-wrap align-items-center">
            <span class="text-h4">{{ productData.title }}</span>
            <div class="ms-3">
              <v-icon class="me-1" icon="mdi-heart" size="small" color="pink"></v-icon>
              <span class="subheading me-2">{{ 256 + (isSelected ? 1 : null) }}</span>
              <v-icon class="me-1" icon="mdi-share-variant" size="small"></v-icon>
              <span class="subheading">45</span>
            </div>
          </div>
        </v-card-item>

        <v-card-text>
          <div align="center" class="d-flex mx-0">
            <v-rating
              :model-value="4.5"
              color="amber"
              density="compact"
              size="small"
              half-increments
              readonly
            ></v-rating>

            <div class="text-grey ms-2">4.5 (413)</div>

            <div class="d-flex align-items-center ga-1 ms-3">
              <v-icon color="grey" icon="mdi-circle" size="10"></v-icon>
              <span class="sub-text">40 Reviews</span>
            </div>
          </div>
        </v-card-text>

        <div class="d-flex flex-wrap align-items-end">
          <v-card-text class="pt-0">
            <p class="text-green-darken-2 text-muted">Extra ₹40 off</p>
            <div class="d-flex flex-wrap align-items-center ga-1">
              <span class="text-h4">₹ {{ productData.price }}</span>
              <span
                class="text-subtitle-1 text-medium-emphasis text-decoration-line-through ms-3 me-2"
                >₹ 200</span
              >
              <span class="text-green-darken-2 text-h6"
                >{{ productData.discountPercentage }}% off</span
              >
            </div>
          </v-card-text>

          <v-card-text class="pt-0">
            <div class="ms-md-auto ms-3 me-2" style="width: fit-content">
              <p class="mb-1 text-muted">Availablity</p>
              <div class="d-flex align-items-center ga-2">
                <v-icon color="#1976d2" icon="mdi-circle" size="11"></v-icon>
                <span class="sub-text">In stock</span>
                <v-icon color="grey" icon="mdi-circle" size="11"></v-icon>
                <span class="sub-text">{{ productData.stock }} Sold</span>
              </div>
            </div>
          </v-card-text>
        </div>
        <v-divider class="mx-3 mb-1 mt-0"></v-divider>
        <v-card-text class="pt-0 mt-3">
          <p class="mb-1 text-muted">Color</p>
          <div class="d-flex flex-wrap ga-2">
            <template v-for="(item, index) in productColors" :key="index">
              <v-card
                @click="colorSelection(index)"
                :color="item.colorCode"
                :class="{ 'color-card': selectedColor == index }"
                class="text-center"
                width="120px"
                height="50px"
              >
                <v-card-text class="px-2">{{ item.colorName }}</v-card-text>
              </v-card>
            </template>
          </div>
        </v-card-text>

        <div class="d-flex flex-wrap">
          <div>
            <v-card-text class="pt-0 mt-3">
              <p class="mb-1 text-muted">Quatity</p>
              <div class="d-flex align-center mt-2">
                <v-btn @click="quantity--" :disabled="quantity <= 1" size="small">
                  <v-icon icon="mdi-minus" size="16"></v-icon>
                </v-btn>
                <span class="mx-2 text-h6 px-2">{{ quantity }}</span>
                <v-btn
                  @click="quantity++"
                  :disabled="quantity >= productData.minimumOrderQuantity"
                  size="small"
                >
                  <v-icon icon="mdi-plus" size="16"></v-icon>
                </v-btn>
              </div>
            </v-card-text>
          </div>
            <div class="px-3 py-2 ms-md-auto ms-3 me-2 border rounded" style="width: fit-content">
              <p class="mb-1 text-muted">Warrenty & Delivery</p>
              <div class="d-flex align-items-center mt-2">
                <v-img :src="nowarrenty" max-width="20px"></v-img>
                <span class="sub-text ms-2">{{ productData.warrantyInformation }}</span>
              </div>
              <div class="d-flex align-items-center mt-2">
                <v-img :src="deliveryVan" max-width="20px"></v-img>
                <span class="sub-text ms-2">{{ productData.shippingInformation }}</span>
              </div>
            </div>
        </div>
        <div class="d-flex flex-wrap ga-2 px-3 px-3 mt-3">
          <v-btn width="160" color="warning">
            <v-icon icon="mdi-cart" size="16"></v-icon>
            <span>Add to Cart</span>
          </v-btn>
          <v-btn width="160" color="#B71C1C">
            <v-icon icon="mdi-cart-plus" size="16"></v-icon>
            <span>Buy Now</span>
          </v-btn>
        </div>

        <v-divider class="mx-3"></v-divider>

        <div class="px-3 mb-3">
          <v-expansion-panels v-model="panelExpension">
            <v-expansion-panel>
              <v-expansion-panel-title class="border border-bottom"
              >
                <p class="mb-1 text-muted">Specifications</p>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-table height="300px" fixed-header>
                  <tbody>
                    <tr>
                      <td class="text-medium-emphasis border-0">Brand</td>
                      <td class="text-medium-emphasis border-0">
                        {{ productData.brand }}
                      </td>
                    </tr>
                    <tr>
                      <td class="text-medium-emphasis border-0">Category</td>
                      <td class="text-medium-emphasis border-0">
                        {{ productData.category }}
                      </td>
                    </tr>
                    <tr>
                      <td class="text-medium-emphasis border-0">Weight</td>
                      <td class="text-medium-emphasis border-0">
                        {{ productData.weight }}
                      </td>
                    </tr>
                    <tr>
                      <td class="text-medium-emphasis border-0">Width</td>
                      <td class="text-medium-emphasis border-0">
                        {{ productData.dimensions.width }}
                      </td>
                    </tr>
                    <tr>
                      <td class="text-medium-emphasis border-0">Height</td>
                      <td class="text-medium-emphasis border-0">
                        {{ productData.dimensions.height }}
                      </td>
                    </tr>
                    <tr>
                      <td class="text-medium-emphasis border-0">Depth</td>
                      <td class="text-medium-emphasis border-0">
                        {{ productData.dimensions.depth }}
                      </td>
                    </tr>
                    <tr>
                      <td class="text-medium-emphasis border-0">Warranty Information</td>
                      <td class="text-medium-emphasis border-0">
                        {{ productData.warrantyInformation }}
                      </td>
                    </tr>
                    <tr>
                      <td class="text-medium-emphasis border-0">Return Policy</td>
                      <td class="text-medium-emphasis border-0">
                        {{ productData.returnPolicy }}
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-title class="border border-bottom">
                <p class="mb-1 text-muted">Decription</p>
                <template v-slot:actions>
                  <v-icon icon="mdi-alert-circle"> </v-icon>
                </template>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <p class="text-medium-emphasis pt-0">{{ productData.description }}</p>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </v-card>
    </div>

    <div class="review-card">
      <v-card class="pa-3" max-height="500px">
        <h6>Ratings & Reviews</h6>
        <div>
          <div class="d-flex align-items-center ga-1">
            <span class="fs-2">{{ productData.reviews[0].rating }}</span><v-icon icon="mdi-star" size="32"></v-icon>
          </div>
        </div>
      </v-card>
    </div>
    
  </div>
  <!-- </v-container> -->
</template>
<style scoped>
.active-box {
  box-shadow: inset 0px 0px 5px 0px #00000091;
}
.color-card {
  border: 2px solid #207aff;
}
.sub-text {
  font-size: 14px;
  font-size: 14px !important;
  font-weight: 400;
  line-height: 1.667;
  letter-spacing: 0.0333333333em !important;
}


.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 0fr;
  /* grid-template-rows: auto; */
  grid-template-areas:
    "productimg-card prodDetails-card"
    "review-card prodDetails-card";
  gap: 1rem;
  height: 80vh;
  overflow-y: auto;
}

/* Grid area assignment */
.productimg-card {
  grid-area: productimg-card;
}
.prodDetails-card {
  grid-area: prodDetails-card;
}
.review-card {
  grid-area: review-card;
}

/* Card styling for visibility */
/* .card {
  border: 1px solid #ccc;
  padding: 1rem;
  background-color: #f9f9f9;
} */

/* Tablet and mobile: stack all vertically */
@media (max-width: 991px) {
  .grid-container {
    grid-template-columns: 1fr;
    grid-template-areas:
      "productimg-card"
      "prodDetails-card"
      "review-card";
  }
}
</style>

