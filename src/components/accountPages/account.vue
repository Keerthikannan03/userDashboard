<script setup>
// import nodataImg from "../../assets/nodata.jpg";
import { computed, onUnmounted, ref, watch } from 'vue';
import counterStore from '../../store/countStore.js';

const store = counterStore();

const resetStore = ()=>{
  store.$reset();
};

const startTimerCount = ()=>{
  if(store.showTimer > 0) store.startCount()
}
const timer=computed(()=>{
  return store.showTimer
})

watch(timer,(newVal)=>{
  if (newVal) {
      console.log(newVal,'newValnewValnewVal');
      setTimeout(() => {
        startTimerCount()
      }, 1000);
  }
});

</script>
<template>
  <div>
    <!-- <h2>Account product</h2> -->
    <!-- <v-img :src="nodataImg" width="80%" class="m-auto" /> -->
    <h2>Counter</h2>
    <div class="d-flex justify-content-between ga-2 w-25">
      <v-text-field v-model="store.counter" label="Count" min="1" variant="outlined" density="compact" />
      <v-btn @click="store.decrement()" color="warning" :disabled="store.doubleCount <= 0"><v-icon>mdi-minus</v-icon></v-btn>
      <v-btn @click="store.increment()" color="success" :disabled="store.doubleCount >= 10"><v-icon>mdi-plus</v-icon></v-btn>
      <v-btn @click="resetStore()" color="danger">Reset</v-btn>
    </div>
    <h2>Start Count</h2>
    <div class="d-flex justify-content-between ga-2 w-25">
      <v-text-field v-model="timer" label="Count" min="1" variant="outlined" density="compact" />
      <v-btn @click="store.stopCount()" color="warning" :disabled="store.doubleCount <= 0">Stop</v-btn>
      <v-btn @click="store.startCount()" color="success" :disabled="store.doubleCount >= 10">Start</v-btn>
      <v-btn @click="resetStore()" color="danger">Reset</v-btn>
      <p>Dummy Text Node js</p> 
    </div>
  </div>
</template>
