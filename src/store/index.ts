import {defineStore} from "pinia";

export const useStore = defineStore('useStore',{
    state:()=>{
        return {
            title:'这是一个标题',
        }
    },
    actions:{}
})

