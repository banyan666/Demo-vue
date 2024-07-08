import {createRouter,createWebHashHistory,RouteRecordRaw} from 'vue-router'
import route from "./route.ts";

const routes: Array<RouteRecordRaw> = route
const router = createRouter({
    history: createWebHashHistory(),
    routes
})


export default router