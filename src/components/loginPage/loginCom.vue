<script setup>
import { ref } from 'vue'
import router  from "../../router";

const visible = ref(false)

const sumbitLogin= () =>{
    router.push('/dashboard/userlist');
}
</script>
<template>
    <div class="d-flex align-center justify-center vh-100">
  
      <v-card
        class="mx-auto pa-12 pb-8"
        elevation="8"
        width="448"
        rounded="lg"
      >
        <h3 class="text-center">Login</h3>
        <v-form ref="form">
            <div class="text-subtitle-1 text-medium-emphasis text-start">Account</div>
      
            <v-text-field
              density="compact"
              placeholder="Email address"
              prepend-inner-icon="mdi-email-outline"
              variant="outlined"
            ></v-text-field>
      
            <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
              Password
      
              <a
                class="text-caption text-decoration-none text-blue"
                href="#"
                rel="noopener noreferrer"
              >
                Forgot login password?</a>
            </div>
      
            <v-text-field
              :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
              :type="visible ? 'text' : 'password'"
              density="compact"
              placeholder="Enter your password"
              prepend-inner-icon="mdi-lock-outline"
              variant="outlined"
              @click:append-inner="visible = !visible"
            ></v-text-field>
      
            <v-btn
              class="mb-2"
              color="blue"
              size="large"
              block
              @click="sumbitLogin()"
            >
              Log In
            </v-btn>
      
            <v-card-text class="text-center">
              <a
                class="text-blue text-decoration-none"
                href="#"
                rel="noopener noreferrer"
              >
                Sign up now <v-icon icon="mdi-chevron-right"></v-icon>
              </a>
            </v-card-text>
        </v-form>
      </v-card>
    </div>
  </template>
