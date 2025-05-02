<script setup>
import { onMounted, onUnmounted, ref, computed, watch } from "vue";
import { useRoute } from 'vue-router';
import logoImg from "../../assets/logo-1.png";

const route = useRoute();
const sidebarItems = [
  {
    icon: "mdi-home-city",
    title: "Home",
    value: "home",
    to: "/dashboard",
  },
  {
    icon: "mdi-account-group-outline",
    title: "Users",
    value: "users",
    to: "/dashboard/userlist",
  },
  {
    icon: "mdi-collage",
    title: "Products",
    value: "products",
    to: "/dashboard/products",
      items: [
        {
          title: "Products List",
          value: "products",
          to: "/dashboard/products",
        },
        {
          title: "Add Product",
          value: "addproduct",
          to: "/dashboard/products/addproduct",
        },
        // {
        //   title: "Edit Product",
        //   value: "editproduct",
        //   to: "/dashboard/products/editproduct",
        // },
      ],
  },
  {
    icon: "mdi-account",
    title: "My Account",
    value: "account",
    to: "/dashboard/account",
  },
];

const drawer = ref(true);
const rail = ref(false);

const windowWidth = ref(window.innerWidth);

const handleResize = () => {
  windowWidth.value = window.innerWidth;
};

const isMobile = computed(() => windowWidth.value < 992);

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

watch(isMobile,(newVal)=>{
  rail.value = newVal ? true : false;
},{immediate:true});

</script>
<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer v-model="drawer" :rail="rail" permanent @click="rail = false">
        <v-list-item nav>
          <template v-slot:prepend>
            <v-img :src="logoImg" width="200px" />
          </template>
          <template v-slot:append>
            <v-btn
              icon="mdi-chevron-left"
              variant="text"
              class="cursor-pointer"
              @click.stop="rail = !rail"
            ></v-btn>
          </template>
        </v-list-item>

        <v-divider class="mt-0"></v-divider>

        <v-list density="compact" nav>
          <template v-for="(item, index) in sidebarItems" :key="index">
            <v-list-item
              v-if="!item.items && !item?.items?.length > 0"
              :prepend-icon="item.icon"
              :title="item.title"
              :value="item.title"
              :to="item.to"
              link
              exact
              active-class="active-sidebar-item"
              @click.stop="rail ? (rail = true) : null"
            >
            </v-list-item>
            <v-list-group v-else>
              <template v-slot:activator="{ props }">
                <v-list-item
                  v-bind="props"
                  :active-class="rail ? 'active-sidebar-item' : null"
                  :prepend-icon="item.icon"
                  :title="item.title"
                  :value="item.title" :active="item.items.some(v=>v.to == route.path)"
                  @click="rail ? (rail = false) : null"
                ></v-list-item>
              </template>

              <template v-if="!rail">
                <v-list-item
                  v-for="(option, i) in item.items"
                  :key="i"
                  :prepend-icon="option.icon"
                  :to="option.to"
                  :title="option.title"
                  :value="option.title"
                  link
                  exact
                  active-class="active-sidebar-item"
                >
                </v-list-item>
              </template>
            </v-list-group>
          </template>
        </v-list>
      </v-navigation-drawer>
      <v-app-bar class="dashHeader">
        <!-- <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon> -->

        <v-toolbar-title>Dashboard Overview</v-toolbar-title>
        <template v-slot:append>
          <v-list-item
            lines="two"
            prepend-avatar="https://randomuser.me/api/portraits/women/81.jpg"
            subtitle="Logged in"
            title="Jane Smith"
          ></v-list-item>
        </template>
      </v-app-bar>
      <v-main class="vh-100 pt-5 pb-0">
        <div class="p-3">
          <router-view />
        </div>
      </v-main>
      <!-- <v-footer name="footer" app>
        <div class="ms-auto pb-2">
          <v-btn color="warning" class="me-2">Clear</v-btn>
          <v-btn @click="saveproduct()" type="submit" color="#1976d2">Save Product</v-btn>
        </div>
    </v-footer> -->
    </v-layout>
  </v-card>
</template>
<style scoped>
.active-sidebar-item {
  background: linear-gradient(90deg, #1976d2, transparent);
  color: white !important;
}

:deep(.dashHeader .v-toolbar__content) {
  height: 55px !important;
}
</style>
