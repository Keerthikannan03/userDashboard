import { defineStore } from 'pinia';

const counterStore = defineStore('counterStore',{
    state:(()=>{
        return{
            counter:0,
            showTimer:0,
        }
    }),
    getters:{
        doubleCount:(state)=>{
            console.log(state.counter,'x 2');
            return state.counter * 2
        },
    },
    actions:{
        increment(){
            console.log(this.counter,'countercounter...1');
            if(this.counter >= 0) this.counter++
            console.log(this.counter,'countercounter...2');
        },
        decrement(){
            if(this.counter > 0) this.counter--
        },
        startCount(){
            this.showTimer++
        },
    }
});
export default counterStore;