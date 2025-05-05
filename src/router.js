import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

import LoginCom from './components/loginPage/loginCom.vue';
import DashboardCom from './components/dashboard/dashboard.vue';

const routes = [
  { path: '/', component: LoginCom },
  { path: '/dashboard', name: 'dashboard', component: DashboardCom,
    children:[
      {
        path: '',
        name: 'home',
        component: ()=> import('./components/homePage/homeCom.vue')
      },
      { 
        path: 'userlist', 
        name: 'userList', 
        component: ()=> import('./components/user/UserPage.vue')
      },
      { 
        path: '/dashboard/products', 
        name: 'products',
        children:[
          {
            path: '',
            name: 'producthome',
            component: ()=> import('./components/products/products.vue')
          },
          {
            path: "addproduct",
            name: "addproduct",
            component: ()=> import('./components/products/addproduct.vue')
          },
          {
            path: "/dashboard/products/:id",
            name: "viewproduct",
            component: ()=> import('./components/products/ViewProduct.vue')
          },
        ],
      },
      { 
        path: 'account', 
        name: 'account', 
        component: ()=> import('./components/accountPages/account.vue')
      },
    ]
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  // history: createWebHistory(),
  routes,
})

export default router;